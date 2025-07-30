// utils/firebase.js
import { useNuxtApp } from "#app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (email, password, familyName) => {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth;
  const firestore = nuxtApp.$firestore;

  if (!auth || !firestore) {
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

    await setDoc(doc(firestore, "users", user.uid), {
      familyName,
      email,
      createdAt: new Date(),
    });

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
