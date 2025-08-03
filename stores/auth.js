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
    isInitialized: false,
  }),
  actions: {
    async initAuth() {
      if (this.isInitialized) return;
      const { $firestore: db } = useNuxtApp();
      try {
        await Promise.race([
          new Promise((resolve) => {
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
              if (user) {
                this.userId = user.uid;
                this.email = user.email;
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                  const data = userDoc.data();
                  this.familyId = data.familyId || null;
                  this.role = data.role || "member";
                  if (data.familyId) {
                    const familyDoc = await getDoc(
                      doc(db, "families", data.familyId)
                    );
                    if (familyDoc.exists()) {
                      this.familyName = familyDoc.data().name || null;
                    }
                  } else {
                    this.familyName = null;
                  }
                }
                this.isInitialized = true;
              } else {
                this.clearAuth();
              }
              resolve();
            });
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Auth timeout")), 5000)
          ),
        ]);
      } catch (error) {
        console.error("initAuth error:", error);
        this.clearAuth();
      }
    },
    clearAuth() {
      this.userId = null;
      this.familyId = null;
      this.familyName = null;
      this.role = null;
      this.email = null;
      this.isInitialized = true;
    },
  },
});
