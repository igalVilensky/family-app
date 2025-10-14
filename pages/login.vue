<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </NuxtLink>
          <div class="text-sm text-gray-600">
            New to FamilySpace?
            <NuxtLink
              to="/register"
              class="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors"
            >
              Create Account
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Welcome Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-home text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            Welcome
            <span
              class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
              >Back</span
            >
          </h2>
          <p class="text-gray-600 text-lg">
            Sign in to access your family space
          </p>
        </div>

        <!-- Login Form -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Email Address
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400 text-lg"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
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
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Password
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400 text-lg"></i>
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  class="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                  placeholder="Enter your password"
                  required
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  :disabled="loading"
                >
                  <i
                    class="text-lg"
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label
                class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="rememberMe"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-xl p-4 animate-slideIn"
            >
              <div class="flex items-center gap-3">
                <i
                  class="fas fa-exclamation-circle text-red-500 text-lg flex-shrink-0"
                ></i>
                <p class="text-red-800 text-sm font-medium">{{ error }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-sign-in-alt text-lg"></i>
              <span class="text-lg">{{
                loading ? "Signing You In..." : "Sign In to FamilySpace"
              }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500 font-medium"
                >New to our family?</span
              >
            </div>
          </div>

          <!-- Register Link -->
          <NuxtLink
            to="/register"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i class="fas fa-user-plus text-lg"></i>
            <span class="text-lg">Create Your Family Account</span>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="text-center">
          <div class="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-shield-check text-green-500"></i>
              <span>Secure Login</span>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-lock text-blue-500"></i>
              <span>Encrypted</span>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-family text-purple-500"></i>
              <span>Family-First</span>
            </div>
          </div>
        </div>

        <!-- Demo Account Info -->
        <div
          class="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-3">
            <i class="fas fa-info-circle text-blue-600 text-lg"></i>
            <h4 class="font-semibold text-blue-900">Demo Access</h4>
          </div>
          <p class="text-blue-700 text-sm mb-3">
            Want to explore first? Use our demo account to see FamilySpace in
            action.
          </p>
          <button
            @click="fillDemoCredentials"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            <i class="fas fa-magic text-sm"></i>
            Try Demo Account
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-home text-white text-sm"></i>
            </div>
            <span
              class="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </div>
          <p class="text-gray-500 text-sm">
            © 2025 FamilySpace. Your private family digital home.
          </p>
        </div>
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
const rememberMe = ref(false);

const isFormValid = computed(() => {
  return (
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.length >= 6
  );
});

const fillDemoCredentials = () => {
  email.value = "demo@familyspace.com";
  password.value = "demopassword123";
  showToast(
    "Demo credentials filled! You can now sign in to explore FamilySpace.",
    "success"
  );
};

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

    // Show success message before redirect
    showToast("Welcome back! Redirecting to your dashboard...", "success");

    // Small delay for better UX
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  } catch (err) {
    console.error("Login error:", err);

    // More user-friendly error messages
    if (
      err.message.includes("invalid-credential") ||
      err.message.includes("wrong-password")
    ) {
      error.value = "Invalid email or password. Please try again.";
    } else if (err.message.includes("too-many-requests")) {
      error.value = "Too many failed attempts. Please try again later.";
    } else if (err.message.includes("user-not-found")) {
      error.value =
        "No account found with this email. Please check or create an account.";
    } else {
      error.value =
        err.message || "Failed to sign in. Please check your credentials.";
    }
  } finally {
    loading.value = false;
  }
};

const showToast = (message, type = "success") => {
  // You can implement a toast notification system here
  // For now, we'll use a simple alert or console log
  console.log(`${type}: ${message}`);
  // In a real implementation, you might use a toast component
  alert(message);
};

useHead({
  title: "FamilySpace - Login",
  meta: [
    {
      name: "description",
      content:
        "Log in to FamilySpace to connect with your family and access your private digital home. Secure, encrypted, and family-first.",
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

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Improve input focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Custom checkbox styling */
input[type="checkbox"]:focus {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}
</style>
