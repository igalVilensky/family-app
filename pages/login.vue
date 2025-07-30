<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
  >
    <!-- Glass Morphism Overlay -->
    <div class="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-md w-full">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div
          class="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-white mt-4">
          Welcome Back
        </h2>
      </div>

      <!-- Login Form -->
      <form
        class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white border-opacity-20"
        @submit.prevent="handleLogin"
      >
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-200 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-200 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            placeholder="Enter your password"
            required
          />
        </div>
        <div v-if="error" class="mb-4 text-red-400 text-sm text-center">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
          :disabled="loading"
        >
          {{ loading ? "Signing In..." : "Sign In" }}
        </button>
      </form>

      <!-- Link to Register -->
      <p class="mt-4 text-center text-gray-300 text-sm">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="text-emerald-400 hover:text-emerald-300"
        >
          Sign up here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { loginUser } from "~/utils/firebase";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const isFormValid = computed(() => {
  return (
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.length >= 6
  );
});

const handleLogin = async () => {
  if (!isFormValid.value) {
    error.value = "Please fill all fields correctly";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await loginUser(email.value, password.value);
    if (!response.success) {
      throw new Error(response.message || "Login failed");
    }
    await authStore.initAuth(); // Ensure auth state is updated
    router.push("/dashboard");
  } catch (err) {
    error.value =
      err.message || "Failed to sign in. Please check your credentials.";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Login",
  meta: [
    {
      name: "description",
      content:
        "Log in to FamilySpace to connect with your family and access your private digital home.",
    },
  ],
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
