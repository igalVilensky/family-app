// stores/auth.js
import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
  }),
  actions: {
    initAuth() {
      return new Promise((resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          this.userId = user ? user.uid : null;
          resolve();
        });
      });
    },
    setUserId(userId) {
      this.userId = userId;
    },
    clearAuth() {
      this.userId = null;
    },
  },
});
