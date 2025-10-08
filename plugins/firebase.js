import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyBUt5D3lD02ampSCKXNRYFddLABVF6Y6CQ",
  authDomain: "family-app-59c2b.firebaseapp.com",
  databaseURL:
    "https://family-app-59c2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "family-app-59c2b",
  storageBucket: "family-app-59c2b.firebasestorage.app",
  messagingSenderId: "545243499565",
  appId: "1:545243499565:web:e3d64117ad13cc48787ca4",
  measurementId: "G-ZEHDH2MK9T",
};

// Initialize Firebase app only if it doesn't already exist
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp("[DEFAULT]");
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

let analytics = null;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}

// Export the instances for direct use in utilities
export { auth, db, firestore };

// Export the createProfile function with access to db
export const createProfile = async (userData) => {
  try {
    const userDocRef = doc(db, "users", userData.userId);
    await setDoc(userDocRef, {
      name: userData.name,
      email: userData.email,
      birthday: userData.birthday,
      familyRole: userData.familyRole,
      status: userData.status || "active",
      phone: userData.phone || null,
      bio: userData.bio || null,
      avatarUrl: userData.avatarUrl || null,
      familyId: userData.familyId || null,
      permissions: {
        role: userData.familyRole === "parent" ? "admin" : "member",
        minor: userData.familyRole === "child",
        privateMode: false,
      },
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

export const useFirestore = () => firestore;

export default defineNuxtPlugin((nuxtApp) => {
  const userId = ref(null);
  onAuthStateChanged(auth, (user) => {
    userId.value = user ? user.uid : null;
  });

  nuxtApp.provide("auth", auth);
  nuxtApp.provide("firestore", firestore);
  nuxtApp.provide("userId", () => userId.value);
  nuxtApp.provide("createProfile", createProfile);
  if (analytics) {
    nuxtApp.provide("analytics", analytics);
  }
});
