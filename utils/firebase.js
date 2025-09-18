import { useNuxtApp } from "#app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export const registerUser = async (email, password, familyName) => {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth;
  const db = nuxtApp.$firestore;

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

    await setDoc(doc(db, "users", user.uid), {
      email,
      createdAt: new Date(),
      familyId: null,
      role: familyName ? "parent" : "member", // Changed from 'admin' to 'parent'
    });

    let familyId = null;
    if (familyName) {
      const familyRef = await addDoc(collection(db, "families"), {
        name: familyName,
        adminId: user.uid,
        members: [{ userId: user.uid, role: "parent", email }], // Changed from 'admin' to 'parent'
        createdAt: new Date(),
      });
      familyId = familyRef.id;
      await setDoc(doc(db, "users", user.uid), { familyId }, { merge: true });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

export const loginUser = async (email, password) => {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth;

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

export const createProfile = async (userId, profileData) => {
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$firestore;

  if (!db) {
    console.error("Firestore unavailable");
    throw new Error("Database unavailable");
  }

  if (!userId || !profileData || typeof profileData !== "object") {
    console.error("Invalid profile data:", { userId, profileData });
    throw new Error("Invalid profile data");
  }

  try {
    console.log("createProfile: Updating user document", {
      userId,
      profileData,
    });
    await setDoc(doc(db, "users", userId), profileData, { merge: true });
    console.log("createProfile: User document updated successfully");
    return { success: true };
  } catch (error) {
    console.error("createProfile error:", error);
    throw new Error(error.message || "Failed to create profile");
  }
};

export const generateInvite = async (familyId, familyName, createdBy) => {
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$firestore;
  const auth = nuxtApp.$auth;

  if (!db || !auth) {
    console.error("Firestore or Auth unavailable");
    throw new Error("Database or authentication unavailable");
  }

  try {
    console.log("generateInvite: Creating invite", {
      familyId,
      familyName,
      createdBy,
      uid: auth.currentUser?.uid,
    });
    const inviteRef = await addDoc(collection(db, "invites"), {
      familyId,
      familyName,
      createdBy,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiration
    });
    console.log("generateInvite: Invite created with ID", inviteRef.id);
    return inviteRef.id;
  } catch (error) {
    console.error("generateInvite error:", error);
    throw new Error(error.message || "Failed to generate invite");
  }
};
