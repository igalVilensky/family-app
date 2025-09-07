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
      role: familyName ? "admin" : "member",
    });

    let familyId = null;
    if (familyName) {
      const familyRef = await addDoc(collection(db, "families"), {
        name: familyName,
        adminId: user.uid,
        members: [{ userId: user.uid, role: "admin", email }],
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
