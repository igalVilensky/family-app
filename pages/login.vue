<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 pb-4"
  >
    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Welcome Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 hover:scale-105 transition-transform duration-200"
          >
            <i class="fas fa-home text-white text-3xl"></i>
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-3">
            Welcome
            <span
              class="bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
              >Back</span
            >
          </h2>
          <p class="text-gray-600 text-lg font-medium">
            Sign in to your family's private space
          </p>
        </div>

        <!-- Login Form -->
        <div
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-8"
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
                  class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-orange-300"
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
                  class="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-orange-300"
                  placeholder="Enter your password"
                  required
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
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
                  class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                class="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-4 animate-fadeIn"
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
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
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
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
          >
            <i class="fas fa-user-plus text-lg"></i>
            <span class="text-lg">Create Family Account</span>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-green-100 p-4"
          >
            <i class="fas fa-shield-alt text-green-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Secure Login</p>
          </div>
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-blue-100 p-4"
          >
            <i class="fas fa-lock text-blue-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Encrypted</p>
          </div>
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-purple-100 p-4"
          >
            <i class="fas fa-users text-purple-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Family-First</p>
          </div>
        </div>

        <!-- Demo Account Info -->
        <div
          class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-3">
            <i class="fas fa-sparkles text-amber-600 text-lg"></i>
            <h4 class="font-bold text-amber-900">Try Demo Account</h4>
          </div>
          <p class="text-amber-700 text-sm mb-4 font-medium">
            Explore FamilySpace with our demo account to see all features in
            action.
          </p>
          <button
            @click="fillDemoCredentials"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg transform hover:-translate-y-0.5"
          >
            <i class="fas fa-magic"></i>
            Fill Demo Credentials
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-gray-200 p-8 mx-4"
    >
      <div class="text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <i class="fas fa-home text-white text-lg"></i>
          </div>
          <span
            class="text-xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
          >
            FamilySpace
          </span>
        </div>
        <p class="text-gray-600 font-medium">
          Made with <i class="fas fa-heart text-rose-500"></i> for families
          everywhere
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Improve input focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

/* Custom checkbox styling */
input[type="checkbox"]:focus {
  outline: 2px solid rgb(249, 115, 22);
  outline-offset: 2px;
}
</style>
