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
            class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6"
          >
            <i class="fas fa-home text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Sign in to access your family space</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
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
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
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
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
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
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-exclamation-circle text-red-500 text-sm"></i>
                <p class="text-red-800 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-sm"></i>
              <i v-else class="fas fa-sign-in-alt text-sm"></i>
              <span>{{ loading ? "Signing In..." : "Sign In" }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500"
                >New to FamilySpace?</span
              >
            </div>
          </div>

          <!-- Register Link -->
          <NuxtLink
            to="/register"
            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-user-plus text-sm"></i>
            <span>Create an Account</span>
          </NuxtLink>
        </div>

        <!-- Additional Links -->
        <div class="text-center text-sm text-gray-600">
          <a href="#" class="hover:text-blue-600 transition-colors">
            Forgot your password?
          </a>
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
import { loginUser } from "~/utils/firebase";

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

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
    error.value = "Please enter a valid email and password (min 6 characters)";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await loginUser(email.value, password.value);
    if (!response.success) {
      throw new Error(response.message || "Login failed");
    }
    await authStore.initAuth();
    router.push("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
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
</style>
