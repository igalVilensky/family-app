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

  console.log("Middleware check:", {
    userId: authStore.userId,
    hasFirestoreUser: authStore.hasFirestoreUser,
    path: to.path,
  });

  // If user is authenticated but doesn't have a Firestore profile yet
  if (authStore.userId && !authStore.hasFirestoreUser) {
    if (to.path !== "/family-setup" && to.path !== "/logout") {
      console.log("Middleware: New user, redirecting to /family-setup");
      return navigateTo("/family-setup");
    }
    return; // Allow access to family-setup
  }

  // If user is authenticated and has complete profile
  if (authStore.userId && authStore.hasFirestoreUser) {
    if (to.path === "/login" || to.path === "/register") {
      console.log("Middleware: Authenticated user, redirecting to /dashboard");
      return navigateTo("/dashboard");
    }
    return; // Allow access to other pages
  }

  // If user is not authenticated
  if (!authStore.userId) {
    if (to.path !== "/login" && to.path !== "/register") {
      console.log("Middleware: No user, redirecting to /login");
      return navigateTo("/login");
    }
    return; // Allow access to login/register
  }
});
