import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

import { auth, db } from "~/plugins/firebase";
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

// Send Message (Basic)
export const sendMessage = async (receiverId, content) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const senderId = auth.currentUser.uid;

  // Get familyId directly from the user document instead of using authStore
  try {
    const userDoc = await getDoc(doc(db, "users", senderId));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) throw new Error("No family access");

    // Validate content
    if (!content || typeof content !== "string") {
      throw new Error("Message content is required");
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Message cannot be empty");
    }

    const messageRef = await addDoc(collection(db, "messages"), {
      familyId: familyId,
      senderId,
      receiverId,
      content: trimmedContent,
      timestamp: serverTimestamp(),
      read: false,
      type: "direct",
    });

    return { success: true, messageId: messageRef.id };
  } catch (error) {
    console.error("Send message error:", error);
    throw new Error(error.message || "Failed to send message");
  }
};

// Get Message History between two users
export const getMessageHistory = async (otherUserId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const currentUserId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", currentUserId));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    const messagesQuery = query(
      collection(db, "messages"),
      where("familyId", "==", familyId),
      where("senderId", "in", [currentUserId, otherUserId]),
      where("receiverId", "in", [currentUserId, otherUserId]),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
};

// Get All Conversations (for message history page)
export const getAllConversations = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const currentUserId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", currentUserId));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    // Get messages where current user is sender OR receiver
    const sentMessagesQuery = query(
      collection(db, "messages"),
      where("familyId", "==", familyId),
      where("senderId", "==", currentUserId) // Messages sent by current user
      // Removed orderBy from here since we're processing all messages
    );

    const receivedMessagesQuery = query(
      collection(db, "messages"),
      where("familyId", "==", familyId),
      where("receiverId", "==", currentUserId) // Messages received by current user
      // Removed orderBy from here since we're processing all messages
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentMessagesQuery),
      getDocs(receivedMessagesQuery),
    ]);

    const conversationsMap = new Map();

    // Process sent messages
    for (const messageDoc of sentSnapshot.docs) {
      const message = messageDoc.data();
      const otherUserId = message.receiverId;

      if (!conversationsMap.has(otherUserId)) {
        // Get the other user's profile
        const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
        if (otherUserDoc.exists()) {
          const otherUserData = otherUserDoc.data();
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            name: otherUserData.name || otherUserData.email,
            avatarUrl: otherUserData.avatarUrl,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: 0,
          });
        }
      } else {
        // Update if this message is newer
        const existing = conversationsMap.get(otherUserId);
        const messageTime = message.timestamp?.toDate?.() || new Date(0);
        const existingTime =
          existing.lastMessageTime?.toDate?.() || new Date(0);

        if (messageTime > existingTime) {
          existing.lastMessage = message.content;
          existing.lastMessageTime = message.timestamp;
        }
      }
    }

    // Process received messages
    for (const messageDoc of receivedSnapshot.docs) {
      const message = messageDoc.data();
      const otherUserId = message.senderId;

      if (!conversationsMap.has(otherUserId)) {
        // Get the other user's profile
        const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
        if (otherUserDoc.exists()) {
          const otherUserData = otherUserDoc.data();
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            name: otherUserData.name || otherUserData.email,
            avatarUrl: otherUserData.avatarUrl,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: message.read ? 0 : 1,
          });
        }
      } else {
        // Update if this message is newer
        const existing = conversationsMap.get(otherUserId);
        const messageTime = message.timestamp?.toDate?.() || new Date(0);
        const existingTime =
          existing.lastMessageTime?.toDate?.() || new Date(0);

        if (messageTime > existingTime) {
          existing.lastMessage = message.content;
          existing.lastMessageTime = message.timestamp;
          // Update unread count for received messages
          if (!message.read) {
            existing.unreadCount = (existing.unreadCount || 0) + 1;
          }
        } else if (!message.read) {
          // If not the latest message but still unread, count it
          existing.unreadCount = (existing.unreadCount || 0) + 1;
        }
      }
    }

    // Sort conversations by last message time (newest first)
    return Array.from(conversationsMap.values()).sort((a, b) => {
      const timeA = a.lastMessageTime?.toDate?.() || new Date(0);
      const timeB = b.lastMessageTime?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return [];
  }
};

// Favorites functions - update these too
export const addToFavorites = async (favoriteUserId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) throw new Error("No family access");

    // Check if already favorited
    const existingFavoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("favoriteUserId", "==", favoriteUserId),
      where("familyId", "==", familyId)
    );

    const existingSnapshot = await getDocs(existingFavoriteQuery);

    if (!existingSnapshot.empty) {
      // Already favorited, so remove it (toggle behavior)
      await deleteDoc(existingSnapshot.docs[0].ref);
      return { success: true, action: "removed" };
    }

    // Add to favorites
    await addDoc(collection(db, "favorites"), {
      userId,
      favoriteUserId,
      familyId: familyId,
      createdAt: serverTimestamp(),
    });

    return { success: true, action: "added" };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw new Error(error.message || "Failed to update favorites");
  }
};

export const getFavorites = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("familyId", "==", familyId)
    );

    const snapshot = await getDocs(favoritesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get favorites error:", error);
    return [];
  }
};

export const isUserFavorited = async (targetUserId) => {
  if (!auth.currentUser) return false;

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return false;

    const favoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("favoriteUserId", "==", targetUserId),
      where("familyId", "==", familyId)
    );

    const snapshot = await getDocs(favoriteQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Check favorite error:", error);
    return false;
  }
};
// Mark messages as read
export const markMessagesAsRead = async (senderId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const receiverId = auth.currentUser.uid;

  try {
    // Get user's familyId
    const userDoc = await getDoc(doc(db, "users", receiverId));
    if (!userDoc.exists()) {
      return;
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return;

    // Find unread messages from this sender
    const unreadMessagesQuery = query(
      collection(db, "messages"),
      where("familyId", "==", familyId),
      where("senderId", "==", senderId),
      where("receiverId", "==", receiverId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(unreadMessagesQuery);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error("Mark messages read error:", error);
  }
};

// Capsules functions
export const getCapsules = async (status = null) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    // CRITICAL FIX: Only fetch capsules that user should see
    const userId = auth.currentUser.uid;

    // Build query for capsules user can access:
    // 1. Capsules created by user (can see all statuses)
    // 2. Capsules where user is recipient AND status is 'delivered'
    const capsulesQuery = query(
      collection(db, "capsules"),
      where("familyId", "==", familyId),
      where("status", "in", ["scheduled", "delivered", "cancelled"]),
      orderBy("deliveryDate", "asc")
    );

    const snapshot = await getDocs(capsulesQuery);

    // CRITICAL: Filter on client side for additional security
    const filteredCapsules = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((capsule) => {
        // User can always see capsules they created
        if (capsule.createdBy === userId) return true;

        // User can only see received capsules if delivered
        if (capsule.recipientId === userId) {
          return capsule.status === "delivered";
        }

        return false;
      });

    return filteredCapsules;
  } catch (error) {
    console.error("Get capsules error:", error);
    return [];
  }
};

export const createCapsule = async (capsuleData) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) throw new Error("No family access");

    // Validate recipient is in same family
    if (capsuleData.recipientId) {
      const recipientDoc = await getDoc(
        doc(db, "users", capsuleData.recipientId)
      );
      if (!recipientDoc.exists() || recipientDoc.data().familyId !== familyId) {
        throw new Error("Recipient must be in the same family");
      }
    }

    // Validate delivery date is in the future
    const deliveryDate = new Date(capsuleData.deliveryDate);
    if (deliveryDate <= new Date()) {
      throw new Error("Delivery date must be in the future");
    }

    const capsuleRef = await addDoc(collection(db, "capsules"), {
      familyId,
      createdBy: auth.currentUser.uid,
      recipientId: capsuleData.recipientId,
      title: capsuleData.title.trim(),
      content: capsuleData.content.trim(),
      type: capsuleData.type || "text",
      deliveryDate: deliveryDate,
      status: "scheduled",
      createdAt: serverTimestamp(),
      isPrivate: true,
    });

    return { success: true, capsuleId: capsuleRef.id };
  } catch (error) {
    console.error("Create capsule error:", error);
    throw new Error(error.message || "Failed to create capsule");
  }
};

export const getCapsuleById = async (capsuleId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const capsuleDoc = await getDoc(doc(db, "capsules", capsuleId));
    if (!capsuleDoc.exists()) {
      throw new Error("Capsule not found");
    }

    const capsuleData = capsuleDoc.data();

    // Check if user has access to this capsule (same family)
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    if (capsuleData.familyId !== userData.familyId) {
      throw new Error("Access denied");
    }

    return { id: capsuleDoc.id, ...capsuleData };
  } catch (error) {
    console.error("Get capsule error:", error);
    throw error;
  }
};

export const updateCapsuleStatus = async (capsuleId, status) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const capsuleRef = doc(db, "capsules", capsuleId);
    await updateDoc(capsuleRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update capsule");
  }
};

export const updateCapsule = async (capsuleId, updateData) => {
  try {
    const db = getFirestore();
    const capsuleRef = doc(db, "capsules", capsuleId);

    // Prepare the update data with timestamp
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(capsuleRef, updatePayload);
    return { success: true, id: capsuleId };
  } catch (error) {
    console.error("Error updating capsule:", error);
    throw new Error("Failed to update capsule: " + error.message);
  }
};
