import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware during SSR
  if (!process.client) {
    return;
  }

  const authStore = useAuthStore();

  // Wait for auth state to initialize
  await authStore.initAuth();

  // Redirect to login if not authenticated
  if (!authStore.userId) {
    console.log("Middleware: No user, redirecting to /login");
    return navigateTo("/login");
  }
});
