<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12"
  >
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="mb-6 text-center">
        <h2 class="text-3xl font-bold text-gray-900">Join FamilySpace</h2>
        <p class="text-gray-600 text-sm mt-2">
          Create an account to start or join your family space.
        </p>
      </div>

      <!-- Registration Form or Logged-in State -->
      <div v-if="!authStore.userId">
        <div v-if="error" class="text-center text-red-600 mb-4">
          {{ error }}
        </div>
        <form
          class="bg-white border border-gray-200 rounded-lg p-6"
          @submit.prevent="handleRegister"
        >
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="createFamily"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Create a Family?
            </label>
            <select
              id="createFamily"
              v-model="createFamily"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="yes">Yes, create a new family</option>
              <option value="no">No, I’ll join a family later</option>
            </select>
          </div>
          <div v-if="createFamily === 'yes'" class="mb-4">
            <label
              for="familyName"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Family Group Name
            </label>
            <input
              type="text"
              id="familyName"
              v-model="familyName"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your family group name"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>
      </div>
      <div v-else class="text-center text-gray-700">
        <p>You are already logged in.</p>
        <NuxtLink to="/dashboard" class="text-blue-600 hover:underline">
          Go to Dashboard
        </NuxtLink>
      </div>
      <p
        v-if="!authStore.userId"
        class="mt-4 text-center text-gray-600 text-sm"
      >
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
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

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();
const familyName = ref("");
const email = ref("");
const password = ref("");
const createFamily = ref("no");
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
    error.value = err.message.includes("permission")
      ? "Permission denied. Please try again or contact support."
      : err.message || "Failed to register";
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
