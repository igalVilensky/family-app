import { defineNuxtPlugin } from "#app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const auth = getAuth();
    const authStore = useAuthStore();

    // Initialize auth state
    onAuthStateChanged(auth, async (user) => {
      console.log("initAuth: onAuthStateChanged, user =", user?.uid);
      await authStore.initAuth();
      console.log("initAuth: Store initialized, userId =", authStore.userId);
    });
  }
});
