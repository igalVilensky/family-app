import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userId: null,
    email: null,
    name: null,
    familyId: null,
    familyName: null,
    permissions: {
      role: null,
      minor: false,
      privateMode: false,
    },
    familyRole: null,
    status: null,
    phone: null,
    bio: null,
    avatarUrl: null,
    birthday: null,
    isInitialized: false,
    hasFirestoreUser: false,
    authPromise: null, // Track the auth initialization promise
    familyMembers: [],
  }),

  getters: {
    isAuthenticated: (state) => !!state.userId,
    isAdmin: (state) => state.permissions.role === "admin",
    isMinor: (state) => state.permissions.minor,
    isPrivate: (state) => state.permissions.privateMode,
    isProfileComplete: (state) => !!state.name && !!state.familyId,
    getFamilyMembers: (state) => state.familyMembers,
  },

  actions: {
    async loadFamilyMembers() {
      if (!this.familyId || this.familyMembers.length > 0) {
        return; // Already loaded or no family
      }

      const { $firestore: db } = useNuxtApp();
      try {
        const familyDocRef = doc(db, "families", this.familyId);
        const familyDocSnap = await getDoc(familyDocRef);
        if (familyDocSnap.exists()) {
          const familyData = familyDocSnap.data();
          this.familyMembers = familyData.members || []; // e.g., [{userId, role, email, name?}]
          console.log("Family members loaded:", this.familyMembers.length);
        }
      } catch (error) {
        console.error("Load family members error:", error);
      }
    },
    async initAuth() {
      // If already initialized, return the existing promise
      if (this.authPromise) {
        return this.authPromise;
      }

      // If fully initialized, return immediately
      if (this.isInitialized && this.userId) {
        return Promise.resolve();
      }

      const { $firestore: db, $auth: auth } = useNuxtApp();
      if (!db || !auth) {
        console.error("Firestore or Auth unavailable");
        this.isInitialized = true;
        return Promise.resolve();
      }

      // Create a promise that resolves when auth is ready
      this.authPromise = new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          console.log("Auth store - onAuthStateChanged:", firebaseUser?.uid);
          unsubscribe(); // Unsubscribe after first call

          try {
            if (firebaseUser) {
              this.user = firebaseUser;
              this.userId = firebaseUser.uid;
              this.email = firebaseUser.email;

              // Try to fetch user document
              const userDocRef = doc(db, "users", firebaseUser.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                this.hasFirestoreUser = true;

                this.name = userData.name || null;
                this.familyId = userData.familyId || null;
                this.phone = userData.phone || null;
                this.bio = userData.bio || null;
                this.avatarUrl = userData.avatarUrl || null;
                this.birthday = userData.birthday || null;
                this.status = userData.status || null;

                // Fetch family name if family exists
                if (userData.familyId) {
                  const familyDocRef = doc(db, "families", userData.familyId);
                  const familyDocSnap = await getDoc(familyDocRef);
                  if (familyDocSnap.exists()) {
                    this.familyName = familyDocSnap.data().name || null;
                  }
                }

                // Set permissions
                this.familyRole = userData.familyRole || userData.role || null;
                this.permissions = {
                  role:
                    userData.permissions?.role ||
                    (userData.familyRole === "parent" ? "admin" : "member"),
                  minor:
                    userData.permissions?.minor ||
                    userData.familyRole === "child",
                  privateMode: userData.permissions?.privateMode || false,
                };
              } else {
                // User authenticated but no Firestore doc - this is normal for new users
                console.log("No Firestore user document found - new user");
                this.hasFirestoreUser = false;
                // Keep auth state but clear profile data
                this.name = null;
                this.familyId = null;
                this.familyName = null;
                this.familyRole = null;
                this.status = null;
                this.phone = null;
                this.bio = null;
                this.avatarUrl = null;
                this.birthday = null;
                this.permissions = {
                  role: null,
                  minor: false,
                  privateMode: false,
                };
              }
            } else {
              // No user authenticated
              this.clearAuth();
            }
          } catch (error) {
            console.error("Error in auth store init:", error);
            // Don't clear everything on error - keep basic auth info
            if (firebaseUser) {
              this.userId = firebaseUser.uid;
              this.email = firebaseUser.email;
              this.hasFirestoreUser = false;
            } else {
              this.clearAuth();
            }
          } finally {
            this.isInitialized = true;
            console.log("Auth store fully initialized, userId:", this.userId);
            resolve();
          }
        });
      });

      return this.authPromise;
    },

    clearAuth() {
      this.user = null;
      this.userId = null;
      this.email = null;
      this.name = null;
      this.familyId = null;
      this.familyName = null;
      this.permissions = {
        role: null,
        minor: false,
        privateMode: false,
      };
      this.familyRole = null;
      this.status = null;
      this.phone = null;
      this.bio = null;
      this.avatarUrl = null;
      this.birthday = null;
      this.isInitialized = true;
      this.hasFirestoreUser = false;
      this.authPromise = null;
    },

    // Add a method to update auth state after profile creation
    updateAuthProfile(userData) {
      this.name = userData.name;
      this.familyId = userData.familyId;
      this.familyRole = userData.familyRole;
      this.birthday = userData.birthday;
      this.phone = userData.phone;
      this.bio = userData.bio;
      this.avatarUrl = userData.avatarUrl;
      this.status = userData.status || "active";
      this.hasFirestoreUser = true;
      this.permissions = {
        role: userData.familyRole === "parent" ? "admin" : "member",
        minor: userData.familyRole === "child",
        privateMode: false,
      };
    },
  },
});
