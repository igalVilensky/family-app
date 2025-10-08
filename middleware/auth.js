import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) {
    return;
  }

  const authStore = useAuthStore();

  // Wait for auth initialization
  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }

  // If user is authenticated but doesn't have a Firestore profile yet
  if (authStore.userId && !authStore.hasFirestoreUser) {
    if (to.path !== "/family-setup" && to.path !== "/logout") {
      return navigateTo("/family-setup");
    }
    return; // Allow access to family-setup
  }

  // If user is authenticated and has complete profile
  if (authStore.userId && authStore.hasFirestoreUser) {
    if (to.path === "/login" || to.path === "/register") {
      return navigateTo("/dashboard");
    }
    return; // Allow access to other pages
  }

  // If user is not authenticated
  if (!authStore.userId) {
    if (to.path !== "/login" && to.path !== "/register") {
      return navigateTo("/login");
    }
    return; // Allow access to login/register
  }
});
