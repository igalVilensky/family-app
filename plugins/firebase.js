// plugins/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

let analytics = null;
if (typeof window !== "undefined" && isSupported()) {
  analytics = getAnalytics(app);
}

export const useFirestore = () => firestore;

export default defineNuxtPlugin((nuxtApp) => {
  const userId = ref(null);
  onAuthStateChanged(auth, (user) => {
    userId.value = user ? user.uid : null;
    console.log(user ? `User logged in: ${userId.value}` : "User logged out");
  });

  nuxtApp.provide("auth", auth);
  nuxtApp.provide("firestore", firestore);
  nuxtApp.provide("userId", () => userId.value);
  if (analytics) {
    nuxtApp.provide("analytics", analytics);
  }
});
