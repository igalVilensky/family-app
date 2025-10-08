import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "~/plugins/firebase"; // Import directly from your firebase plugin

export const registerUser = async (email, password, familyName) => {
  if (!auth || !db) {
    console.error("Auth or Firestore unavailable");
    return {
      success: false,
      message: "Authentication or database unavailable",
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = {
      email,
      name: null,
      role: familyName ? "parent" : "member",
      status: familyName ? "active" : null,
      birthday: null,
      bio: null,
      avatarUrl: null,
      createdAt: new Date(),
      familyId: null,
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    let familyId = null;
    if (familyName) {
      const familyRef = await addDoc(collection(db, "families"), {
        name: familyName,
        adminId: user.uid,
        members: [{ userId: user.uid, role: "parent", email }],
        createdAt: new Date(),
      });
      familyId = familyRef.id;
      await setDoc(
        doc(db, "users", user.uid),
        { familyId, status: "active" },
        { merge: true }
      );
    }

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

export const loginUser = async (email, password) => {
  if (!auth) {
    console.error("Auth unavailable");
    return { success: false, message: "Authentication service unavailable" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};

export async function createProfile(userId, profileData) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = {
      userId,
      email: profileData.email || "",
      name: profileData.name || "",
      birthday: profileData.birthday || null,
      familyRole: profileData.familyRole || "other",
      permissions: {
        role: profileData.permissions?.role || "member",
        minor: profileData.permissions?.minor || false,
        privateMode: profileData.permissions?.privateMode || false,
      },
      familyId: profileData.familyId || null,
      familyName: profileData.familyName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "active",
    };

    await setDoc(userRef, userDoc);

    if (profileData.familyName && profileData.permissions.role === "admin") {
      const familyRef = await addDoc(collection(db, "families"), {
        name: profileData.familyName,
        creatorId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        members: [
          {
            userId,
            email: profileData.email || "",
            name: profileData.name || "",
            familyRole: profileData.familyRole || "other",
            role: profileData.permissions?.role || "admin",
          },
        ],
      });

      await setDoc(
        userRef,
        {
          familyId: familyRef.id,
          familyName: profileData.familyName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, message: error.message };
  }
}

export const generateInvite = async (familyId, familyName, createdBy) => {
  if (!db || !auth) {
    console.error("Firestore or Auth unavailable");
    throw new Error("Database or authentication unavailable");
  }

  try {
    const inviteRef = await addDoc(collection(db, "invites"), {
      familyId,
      familyName,
      createdBy,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return inviteRef.id;
  } catch (error) {
    console.error("generateInvite error:", error);
    throw new Error(error.message || "Failed to generate invite");
  }
};

// Add Event (create with invites/RSVP init)
export const addEvent = async (eventData) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const familyId = eventData.familyId;
  if (!familyId) throw new Error("No family ID");

  try {
    const attendees = eventData.attendees || []; // From form checkboxes
    const rsvps = { [auth.currentUser.uid]: "yes" }; // Creator auto-yes
    attendees.forEach((userId) => {
      if (userId !== auth.currentUser.uid) rsvps[userId] = null;
    }); // Others pending

    const eventRef = await addDoc(
      collection(db, "families", familyId, "events"),
      {
        ...eventData,
        familyId,
        creatorId: auth.currentUser.uid,
        attendees,
        rsvps,
        color: eventData.color || "#f59e0b", // Default amber
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return { success: true, eventId: eventRef.id };
  } catch (error) {
    console.error("Add event error:", error);
    throw new Error(error.message || "Failed to add event");
  }
};

// Fetch Events by Date Range (manual for month view)
export const getEventsByRange = async (familyId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, "families", familyId, "events"),
      where("startDate", ">=", startDate),
      where("startDate", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Fetch events error:", error);
    return [];
  }
};

// Update RSVP (user's own status)
export const updateRSVP = async (familyId, eventId, status) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await updateDoc(eventRef, {
      [`rsvps.${auth.currentUser.uid}`]: status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update RSVP");
  }
};

// Update Event (edit details)
export const updateEvent = async (familyId, eventId, updates) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await updateDoc(eventRef, { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update event");
  }
};

// Delete Event (admin only—check in UI)
export const deleteEvent = async (familyId, eventId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    // TODO: isAdmin check from store
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to delete event");
  }
};
