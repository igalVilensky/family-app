// middleware/auth.js
import { getAuth } from "firebase/auth";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.initAuth(); // Ensure auth state is loaded
  if (!authStore.userId) {
    return navigateTo("/login");
  }
});
