<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col"
  >
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">FamilySpace</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Welcome Section -->
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-lg mb-6"
          >
            <i class="fas fa-users text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Join FamilySpace
          </h2>
          <p class="text-gray-600">
            Create your account and start connecting with family
          </p>
        </div>

        <!-- Already Logged In State -->
        <div
          v-if="authStore.userId"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <div class="mb-4">
            <i class="fas fa-check-circle text-green-500 text-4xl"></i>
          </div>
          <p class="text-gray-900 font-medium mb-4">
            You are already logged in
          </p>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-home text-sm"></i>
            <span>Go to Dashboard</span>
          </NuxtLink>
        </div>

        <!-- Registration Form -->
        <div
          v-else
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400 text-sm"></i>
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="Min 6 characters"
                  required
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  :disabled="loading"
                >
                  <i
                    class="text-sm"
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            <!-- Create Family Option -->
            <div>
              <label
                for="createFamily"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Family Setup
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-home text-gray-400 text-sm"></i>
                </div>
                <select
                  id="createFamily"
                  v-model="createFamily"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 appearance-none bg-white"
                  :disabled="loading"
                >
                  <option value="yes">Create a new family</option>
                  <option value="no">Join a family later</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Family Name Field (Conditional) -->
            <div v-if="createFamily === 'yes'" class="animate-fadeIn">
              <label
                for="familyName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Family Name
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-users text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  id="familyName"
                  v-model="familyName"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="e.g., The Smiths"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex items-center gap-3">
                <i
                  class="fas fa-exclamation-circle text-red-500 text-sm flex-shrink-0"
                ></i>
                <p class="text-red-800 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-sm"></i>
              <i v-else class="fas fa-user-plus text-sm"></i>
              <span>{{
                loading ? "Creating Account..." : "Create Account"
              }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500"
                >Already have an account?</span
              >
            </div>
          </div>

          <!-- Login Link -->
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-sign-in-alt text-sm"></i>
            <span>Sign In</span>
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2025 FamilySpace. Your private family digital home.
        </p>
      </div>
    </footer>
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
const showPassword = ref(false);

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
    console.error("Registration error:", err);
    error.value = err.message.includes("permission")
      ? "Permission denied. Please try again or contact support."
      : err.message || "Failed to register. Please try again.";
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
        "Join FamilySpace to create or join your family's private digital home.",
    },
  ],
});
</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom select styling */
select {
  background-image: none;
}
</style>
