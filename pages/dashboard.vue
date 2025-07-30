<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
        FamilySpace Dashboard
      </h1>
      <button
        @click="handleLogout"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAuth, signOut } from "firebase/auth";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    authStore.clearAuth();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

useHead({
  title: "FamilySpace - Dashboard",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
