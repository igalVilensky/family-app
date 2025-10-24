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
            <i class="fas fa-users text-white text-3xl"></i>
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-3">
            Join
            <span
              class="bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
              >FamilySpace</span
            >
          </h2>
          <p class="text-gray-600 text-lg font-medium">
            Create your account and start your family journey
          </p>
        </div>

        <!-- Already Logged In State -->
        <div
          v-if="authStore.userId"
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-emerald-200 p-8 text-center"
        >
          <div
            class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <i class="fas fa-check-circle text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
          <p class="text-gray-600 mb-6 font-medium">
            You are already logged in to your account.
          </p>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
          >
            <i class="fas fa-home"></i>
            <span>Go to Dashboard</span>
          </NuxtLink>
        </div>

        <!-- Registration Form -->
        <div
          v-else
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-8"
        >
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Name Field -->
            <div>
              <label
                for="name"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Full Name *
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-user text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  id="name"
                  v-model="name"
                  class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-orange-300"
                  placeholder="Your full name"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Email Address *
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
                Password *
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
                  placeholder="Create a strong password"
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
              <!-- Password Strength Meter -->
              <div class="flex items-center gap-3 mt-3">
                <div class="flex-1 bg-gray-200 rounded-full h-2 shadow-inner">
                  <div
                    class="h-2 rounded-full transition-all duration-300 shadow-lg"
                    :class="getPasswordStrengthClass"
                  ></div>
                </div>
                <span class="text-xs font-bold text-gray-600 min-w-16">
                  {{ getPasswordStrengthText }}
                </span>
              </div>
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
              <i v-else class="fas fa-user-plus text-lg"></i>
              <span class="text-lg">{{
                loading ? "Creating Your Account..." : "Create Family Account"
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
                >Already part of our family?</span
              >
            </div>
          </div>

          <!-- Login Link -->
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
          >
            <i class="fas fa-sign-in-alt text-lg"></i>
            <span class="text-lg">Sign In to Your Account</span>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-green-100 p-4"
          >
            <i class="fas fa-shield-alt text-green-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Secure</p>
          </div>
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-blue-100 p-4"
          >
            <i class="fas fa-lock text-blue-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Private</p>
          </div>
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-purple-100 p-4"
          >
            <i class="fas fa-heart text-purple-500 text-lg mb-2"></i>
            <p class="text-xs font-medium text-gray-700">Family-First</p>
          </div>
        </div>

        <!-- Demo Account Info -->
        <div
          class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 text-center"
        >
          <div class="flex items-center justify-center gap-2 mb-3">
            <i class="fas fa-sparkles text-amber-600 text-lg"></i>
            <h4 class="font-bold text-amber-900">New to FamilySpace?</h4>
          </div>
          <p class="text-amber-700 text-sm mb-4 font-medium">
            After creating your account, you'll be guided to set up your family
            space.
          </p>
          <div
            class="grid grid-cols-2 gap-3 text-xs text-amber-800 font-medium"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-users text-amber-600"></i>
              <span>Create Family</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar text-amber-600"></i>
              <span>Plan Events</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-images text-amber-600"></i>
              <span>Share Memories</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-comments text-amber-600"></i>
              <span>Family Chat</span>
            </div>
          </div>
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
import { registerUser } from "~/utils/firebase";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

const isFormValid = computed(() => {
  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value.length >= 6
  );
});

const getPasswordStrength = computed(() => {
  if (password.value.length === 0) return 0;
  if (password.value.length < 6) return 1;

  let strength = 0;
  if (password.value.length >= 8) strength++;
  if (/[A-Z]/.test(password.value)) strength++;
  if (/[0-9]/.test(password.value)) strength++;
  if (/[^A-Za-z0-9]/.test(password.value)) strength++;

  return Math.min(strength, 4);
});

const getPasswordStrengthClass = computed(() => {
  const strength = getPasswordStrength.value;
  const classes = {
    0: "bg-transparent w-0",
    1: "bg-red-500 w-1/4",
    2: "bg-amber-500 w-1/2",
    3: "bg-blue-500 w-3/4",
    4: "bg-green-500 w-full",
  };
  return classes[strength] || classes[0];
});

const getPasswordStrengthText = computed(() => {
  const strength = getPasswordStrength.value;
  const texts = {
    0: "Too weak",
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };
  return texts[strength] || "";
});

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = "Please fill all required fields correctly";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // Register user WITHOUT family creation
    const result = await registerUser(
      email.value,
      password.value,
      name.value.trim()
    );

    if (result.success) {
      // Refresh auth store
      await authStore.initAuth();

      // Always redirect to family-setup
      router.push("/family-setup");
    } else {
      error.value = result.message || "Registration failed";
    }
  } catch (err) {
    console.error("Registration error:", err);

    if (err.message.includes("email-already-in-use")) {
      error.value =
        "An account with this email already exists. Please sign in instead.";
    } else if (err.message.includes("weak-password")) {
      error.value = "Password is too weak. Please choose a stronger password.";
    } else if (err.message.includes("invalid-email")) {
      error.value = "Please enter a valid email address.";
    } else {
      error.value =
        err.message || "Failed to create account. Please try again.";
    }
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
        "Join FamilySpace to create or join your family's private digital home. Secure, private, and family-first.",
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

input:focus {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

input[type="checkbox"]:focus {
  outline: 2px solid rgb(249, 115, 22);
  outline-offset: 2px;
}
</style>
