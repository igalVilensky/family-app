import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) {
    return;
  }

  const authStore = useAuthStore();

  await authStore.initAuth();

  if (to.path === "/register" && authStore.userId) {
    if (!authStore.isProfileComplete) {
      console.log(
        "Middleware: Authenticated user, incomplete profile, redirecting to /family-setup"
      );
      return navigateTo("/family-setup");
    } else {
      console.log(
        "Middleware: Authenticated user, complete profile, redirecting to /dashboard"
      );
      return navigateTo("/dashboard");
    }
  }

  if (!authStore.userId && to.path !== "/login" && to.path !== "/register") {
    console.log("Middleware: No user, redirecting to /login");
    return navigateTo("/login");
  }
});
