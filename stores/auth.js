import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userId: null,
    familyId: null,
    familyName: null,
    role: null,
    email: null,
  }),
  actions: {
    async initAuth() {
      const { $firestore: db } = useNuxtApp(); // Access Firestore via Nuxt plugin
      return new Promise((resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.userId = user.uid;
            this.email = user.email;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              this.familyId = data.familyId || null;
              this.familyName = data.familyName || null;
              this.role = data.role || "member";
            }
          } else {
            this.clearAuth();
          }
          resolve();
        });
      });
    },
    setUserId(userId) {
      this.userId = userId;
    },
    clearAuth() {
      this.userId = null;
      this.familyId = null;
      this.familyName = null;
      this.role = null;
      this.email = null;
    },
  },
});
