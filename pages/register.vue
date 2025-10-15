<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Welcome Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-users text-white text-2xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            Join
            <span
              class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >FamilySpace</span
            >
          </h2>
          <p class="text-gray-600 text-lg">
            Create your account and start your family journey
          </p>
        </div>

        <!-- Already Logged In State -->
        <div
          v-if="authStore.userId"
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center"
        >
          <div
            class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-check-circle text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Welcome Back!
          </h3>
          <p class="text-gray-600 mb-6">
            You are already logged in to your account.
          </p>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i class="fas fa-home text-sm"></i>
            <span>Go to Dashboard</span>
          </NuxtLink>
        </div>

        <!-- Registration Form -->
        <div
          v-else
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <form @submit.prevent="handleRegister" class="space-y-6">
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
                  class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
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
                  class="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                  placeholder="Create a strong password"
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
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getPasswordStrengthClass"
                  ></div>
                </div>
                <span class="text-xs font-medium text-gray-500">
                  {{ getPasswordStrengthText }}
                </span>
              </div>
            </div>

            <!-- Create Family Option -->
            <div>
              <label
                for="createFamily"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Family Setup
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-home text-gray-400 text-lg"></i>
                </div>
                <select
                  id="createFamily"
                  v-model="createFamily"
                  class="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 appearance-none bg-white hover:border-gray-400 cursor-pointer"
                  :disabled="loading"
                >
                  <option value="yes">Create a new family</option>
                  <option value="no">Join a family later</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Family Name Field (Conditional) -->
            <div v-if="createFamily === 'yes'" class="animate-fadeIn">
              <label
                for="familyName"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Family Name
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-users text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  id="familyName"
                  v-model="familyName"
                  class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                  placeholder="e.g., The Smith Family"
                  required
                  :disabled="loading"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2">
                This will be your family's display name
              </p>
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
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-user-plus text-lg"></i>
              <span class="text-lg">{{
                loading ? "Creating Your Account..." : "Create Account"
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
                >Already part of a family?</span
              >
            </div>
          </div>

          <!-- Login Link -->
          <NuxtLink
            to="/login"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i class="fas fa-sign-in-alt text-lg"></i>
            <span class="text-lg">Sign In to Your Account</span>
          </NuxtLink>
        </div>

        <!-- Trust Indicators -->
        <div class="text-center">
          <div class="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-shield-alt text-green-500"></i>
              <span>Secure</span>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-lock text-blue-500"></i>
              <span>Private</span>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-heart text-red-500"></i>
              <span>Family-First</span>
            </div>
          </div>
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

/* Custom select styling */
select {
  background-image: none;
  cursor: pointer;
}

select:focus {
  outline: none;
  outline-width: 2px;
}

/* Improve input focus states */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>
