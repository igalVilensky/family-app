// plugins/initAuth.js
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async () => {
  if (process.client) {
    const authStore = useAuthStore();
    await authStore.initAuth();
  }
});
