// stores/auth.js
import { defineStore } from "pinia";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userId: null,
    email: null,
    name: null,
    families: {},
    currentFamilyId: null,
    currentFamilyName: null,
    permissions: {
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
    authPromise: null,
    familyMembers: [],
  }),

  getters: {
    isAuthenticated: (state) => !!state.userId,
    isAdmin: (state) =>
      state.currentFamilyId
        ? state.families[state.currentFamilyId]?.role === "admin"
        : false,
    isMinor: (state) => state.permissions.minor,
    isPrivate: (state) => state.permissions.privateMode,
    isProfileComplete: (state) =>
      !!state.name && Object.keys(state.families).length > 0,
    getFamilyMembers: (state) => state.familyMembers,
    hasFamily: (state) => {
      const hasFamily = Object.keys(state.families || {}).length > 0;
      console.log("🔍 hasFamily getter called:", {
        families: state.families,
        count: Object.keys(state.families || {}).length,
        result: hasFamily,
      });
      return hasFamily;
    },
  },

  actions: {
    async loadFamilyMembers() {
      console.log(
        "🔄 loadFamilyMembers called, currentFamilyId:",
        this.currentFamilyId
      );
      if (!this.currentFamilyId) {
        console.log("❌ No currentFamilyId, skipping loadFamilyMembers");
        return;
      }

      const { $firestore: db } = useNuxtApp();
      try {
        const familyDocRef = doc(db, "families", this.currentFamilyId);
        const familyDocSnap = await getDoc(familyDocRef);

        if (familyDocSnap.exists()) {
          const familyData = familyDocSnap.data();
          const members = familyData.members || [];
          console.log("👨‍👩‍👧‍👦 Found family members:", members.length);

          const membersWithDetails = await Promise.all(
            members.map(async (member) => {
              try {
                const userDocRef = doc(db, "users", member.userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                  const userData = userDocSnap.data();
                  return {
                    ...member,
                    name: userData.name || member.email,
                    birthday: userData.birthday || null,
                    avatarUrl: userData.avatarUrl || null,
                    status: userData.status || null,
                    phone: userData.phone || null,
                    bio: userData.bio || null,
                  };
                }
                return member;
              } catch (error) {
                console.error(
                  `Error fetching user data for ${member.userId}:`,
                  error
                );
                return member;
              }
            })
          );

          this.familyMembers = membersWithDetails;
          console.log("✅ Family members loaded:", this.familyMembers.length);
        } else {
          console.log(
            "❌ Family document not found for ID:",
            this.currentFamilyId
          );
        }
      } catch (error) {
        console.error("❌ Load family members error:", error);
      }
    },

    async initAuth() {
      console.log("🔄 initAuth called");
      if (this.authPromise) {
        console.log("♻️ Returning existing auth promise");
        return this.authPromise;
      }

      if (this.isInitialized && this.userId) {
        console.log("✅ Already initialized, returning");
        return Promise.resolve();
      }

      const { $firestore: db, $auth: auth } = useNuxtApp();
      if (!db || !auth) {
        console.error("❌ Firestore or Auth unavailable");
        this.isInitialized = true;
        return Promise.resolve();
      }

      this.authPromise = new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          unsubscribe();
          console.log("🔥 Auth state changed, user:", firebaseUser?.uid);

          try {
            if (firebaseUser) {
              this.user = firebaseUser;
              this.userId = firebaseUser.uid;
              this.email = firebaseUser.email;
              console.log("👤 Firebase user authenticated:", this.userId);

              const userDocRef = doc(db, "users", firebaseUser.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                this.hasFirestoreUser = true;
                console.log("📄 User document found:", userData);

                this.name = userData.name || null;
                this.families = userData.families || {};
                this.phone = userData.phone || null;
                this.bio = userData.bio || null;
                this.avatarUrl = userData.avatarUrl || null;
                this.birthday = userData.birthday || null;
                this.status = userData.status || null;
                this.familyRole = userData.familyRole || null;
                await this.loadFamiliesData();
                console.log("🏠 Families data loaded:", this.families);
                console.log(
                  "🔢 Families count:",
                  Object.keys(this.families).length
                );

                const familyKeys = Object.keys(this.families);
                if (familyKeys.length > 0) {
                  // FIX: Try to preserve the current family, or use the first one
                  let targetFamilyId =
                    localStorage.getItem("currentFamilyId") ||
                    this.currentFamilyId;

                  // If currentFamilyId is not valid or not in user's families, use first one
                  if (!targetFamilyId || !this.families[targetFamilyId]) {
                    targetFamilyId = familyKeys[0];
                    console.log(
                      "🎯 Setting initial currentFamilyId to:",
                      targetFamilyId
                    );
                  } else {
                    console.log(
                      "💾 Preserving currentFamilyId:",
                      targetFamilyId
                    );
                  }

                  this.currentFamilyId = targetFamilyId;

                  const familyDocRef = doc(
                    db,
                    "families",
                    this.currentFamilyId
                  );
                  const familyDocSnap = await getDoc(familyDocRef);
                  if (familyDocSnap.exists()) {
                    this.currentFamilyName = familyDocSnap.data().name || null;
                    console.log(
                      "🏡 Setting currentFamilyName to:",
                      this.currentFamilyName
                    );
                  } else {
                    console.log(
                      "❌ Family document not found for ID:",
                      this.currentFamilyId
                    );
                    // Fallback to first available family
                    if (
                      familyKeys.length > 0 &&
                      familyKeys[0] !== this.currentFamilyId
                    ) {
                      this.currentFamilyId = familyKeys[0];
                      const fallbackFamilyDoc = await getDoc(
                        doc(db, "families", this.currentFamilyId)
                      );
                      if (fallbackFamilyDoc.exists()) {
                        this.currentFamilyName = fallbackFamilyDoc.data().name;
                        console.log(
                          "🔄 Fallback to family:",
                          this.currentFamilyName
                        );
                      }
                    }
                  }
                } else {
                  this.currentFamilyId = null;
                  this.currentFamilyName = null;
                  console.log("🚫 No families found in user data");
                }

                this.permissions = {
                  minor: userData.permissions?.minor || false,
                  privateMode: userData.permissions?.privateMode || false,
                };

                console.log("✅ Auth store initialized with family data");
              } else {
                console.log("📭 No user document found for:", this.userId);
                this.hasFirestoreUser = false;
                this.name = null;
                this.families = {};
                this.currentFamilyId = null;
                this.currentFamilyName = null;
                this.familyRole = null;
                this.status = null;
                this.phone = null;
                this.bio = null;
                this.avatarUrl = null;
                this.birthday = null;
                this.permissions = {
                  minor: false,
                  privateMode: false,
                };
              }
            } else {
              console.log("🚪 No user authenticated, clearing auth");
              this.clearAuth();
            }
          } catch (error) {
            console.error("💥 Error in auth store init:", error);
            if (firebaseUser) {
              this.userId = firebaseUser.uid;
              this.email = firebaseUser.email;
              this.hasFirestoreUser = false;
            } else {
              this.clearAuth();
            }
          } finally {
            this.isInitialized = true;
            console.log("🏁 Auth initialization complete");
            resolve();
          }
        });
      });

      return this.authPromise;
    },

    clearAuth() {
      console.log("🧹 Clearing auth store");
      this.user = null;
      this.userId = null;
      this.email = null;
      this.name = null;
      this.families = {};
      this.currentFamilyId = null;
      this.currentFamilyName = null;
      this.permissions = {
        minor: false,
        privateMode: false,
      };
      this.familyRole = null;
      this.status = null;
      this.phone = null;
      this.bio = null;
      this.avatarUrl = null;
      this.birthday = null;
      this.isInitialized = false;
      this.hasFirestoreUser = false;
      this.authPromise = null;
      this.familyMembers = [];
    },

    updateAuthProfile(userData) {
      console.log("📝 Updating auth profile:", userData);
      this.name = userData.name;
      this.familyRole = userData.familyRole;
      this.birthday = userData.birthday;
      this.phone = userData.phone;
      this.bio = userData.bio;
      this.avatarUrl = userData.avatarUrl;
      this.status = userData.status || "active";
      this.hasFirestoreUser = true;
      this.permissions = {
        role: userData.permissions.role,
        minor: userData.permissions.minor,
        privateMode: userData.permissions.privateMode,
      };
      if (userData.familyId) {
        this.families[userData.familyId] = {
          membershipType: "core",
          role: userData.permissions.role || "member",
        };
        this.currentFamilyId = userData.familyId;
        this.currentFamilyName = userData.familyName;
      }
    },

    setCurrentFamily(familyId) {
      console.log("🔄 setCurrentFamily called:", familyId);
      if (familyId in this.families) {
        this.currentFamilyId = familyId;
        localStorage.setItem("currentFamilyId", familyId); // Persist to localStorage

        const { $firestore: db } = useNuxtApp();
        getDoc(doc(db, "families", familyId)).then((snap) => {
          if (snap.exists()) {
            this.currentFamilyName = snap.data().name || null;
            console.log("✅ Current family set to:", this.currentFamilyName);
          }
        });
        this.loadFamilyMembers();
      } else {
        console.log("❌ Family ID not found in user's families:", familyId);
      }
    },

    persistCurrentFamily() {
      if (this.currentFamilyId) {
        localStorage.setItem("currentFamilyId", this.currentFamilyId);
      }
    },
    async loadFamiliesData() {
      console.log("🔄 loadFamiliesData called");
      const { $firestore: db } = useNuxtApp();

      const familyKeys = Object.keys(this.families);
      if (familyKeys.length === 0) return;

      try {
        const familyPromises = familyKeys.map(async (familyId) => {
          try {
            const familyDocRef = doc(db, "families", familyId);
            const familyDocSnap = await getDoc(familyDocRef);
            if (familyDocSnap.exists()) {
              const familyData = familyDocSnap.data();
              return {
                id: familyId,
                ...this.families[familyId],
                ...familyData,
              };
            }
            return {
              id: familyId,
              ...this.families[familyId],
              name: "Unknown Family",
            };
          } catch (error) {
            console.error(`Error loading family ${familyId}:`, error);
            return {
              id: familyId,
              ...this.families[familyId],
              name: "Unknown Family",
            };
          }
        });

        const familiesWithData = await Promise.all(familyPromises);

        const enrichedFamilies = {};
        familiesWithData.forEach((family) => {
          if (family) {
            enrichedFamilies[family.id] = family;
          }
        });

        this.families = enrichedFamilies;
      } catch (error) {
        console.error("❌ Error loading families data:", error);
      }
    },
  },
});
