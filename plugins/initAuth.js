import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const auth = nuxtApp.$auth; // Use injected auth from firebase.js
    const authStore = useAuthStore();

    // Initialize auth state
    auth.onAuthStateChanged(async (user) => {
      console.log("initAuth: onAuthStateChanged, user =", user?.uid);
      await authStore.initAuth();
      console.log("initAuth: Store initialized, userId =", authStore.userId);
    });
  }
});
