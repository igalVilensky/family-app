<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
  >
    <div class="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>
    <div class="relative z-10 max-w-md w-full">
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
          Join FamilySpace
        </h2>
      </div>
      <div v-if="!authStore.userId">
        <div v-if="error" class="text-center text-red-400 mb-4">
          {{ error }}
        </div>
        <form
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white border-opacity-20"
          @submit.prevent="handleRegister"
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
          <div class="mb-4">
            <label
              for="createFamily"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              Create a Family?
            </label>
            <select
              id="createFamily"
              v-model="createFamily"
              class="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            >
              <option value="yes">Yes, create a new family</option>
              <option value="no">No, I’ll join a family later</option>
            </select>
          </div>
          <div v-if="createFamily === 'yes'" class="mb-4">
            <label
              for="familyName"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              Family Group Name
            </label>
            <input
              type="text"
              id="familyName"
              v-model="familyName"
              class="w-full px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              placeholder="Enter your family group name"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>
      </div>
      <div v-else class="text-center text-white">
        <p>You are already logged in.</p>
        <NuxtLink
          to="/dashboard"
          class="text-emerald-400 hover:text-emerald-300"
        >
          Go to Dashboard
        </NuxtLink>
      </div>
      <p
        v-if="!authStore.userId"
        class="mt-4 text-center text-gray-300 text-sm"
      >
        Already have an account?
        <NuxtLink to="/login" class="text-emerald-400 hover:text-emerald-300">
          Sign in here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { registerUser } from "~/utils/firebase";

const authStore = useAuthStore();
const router = useRouter();
const familyName = ref("");
const email = ref("");
const password = ref("");
const createFamily = ref("yes");
const error = ref("");
const loading = ref(false);

const isFormValid = computed(() => {
  return (
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.length >= 6 &&
    (createFamily.value === "no" ||
      (createFamily.value === "yes" && familyName.value.trim() !== ""))
  );
});

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = "Please fill all fields correctly";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await registerUser(
      email.value,
      password.value,
      createFamily.value === "yes" ? familyName.value : null
    );
    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }
    await authStore.initAuth();
    router.push("/family-setup");
  } catch (err) {
    error.value = err.message || "Failed to register";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Register",
  meta: [
    {
      name: "description",
      content:
        "Join FamilySpace to create or join your family’s private digital home.",
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
