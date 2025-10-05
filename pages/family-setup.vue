<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <NuxtLink
              to="/dashboard"
              class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Skip for Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-2xl w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            Complete Your
            <span
              class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >Profile</span
            >
          </h1>
          <p class="text-gray-600 text-lg max-w-md mx-auto">
            Add your details to personalize your FamilySpace experience and
            connect with your family
          </p>
        </div>

        <!-- Not Logged In State -->
        <div
          v-if="!authStore.userId"
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center"
        >
          <div
            class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Authentication Required
          </h3>
          <p class="text-gray-600 mb-6">
            Please log in to set up your profile and family space.
          </p>
          <div class="space-y-4">
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-sign-in-alt text-sm"></i>
              Sign In to Continue
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <i class="fas fa-user-plus text-sm"></i>
              Create New Account
            </NuxtLink>
          </div>
        </div>

        <!-- Profile Form -->
        <div
          v-else
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <!-- Form Header -->
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-user-cog text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <p class="text-gray-500 text-sm">
                Tell us about yourself and your family
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-slideIn"
          >
            <div class="flex items-center gap-3">
              <i
                class="fas fa-exclamation-circle text-red-500 text-lg flex-shrink-0"
              ></i>
              <p class="text-red-800 text-sm font-medium">{{ error }}</p>
            </div>
          </div>

          <form @submit.prevent="handleProfileSetup" class="space-y-6">
            <!-- Personal Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Full Name -->
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
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <!-- Date of Birth -->
              <div>
                <label
                  for="birthday"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Date of Birth *
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-calendar text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="date"
                    id="birthday"
                    v-model="birthday"
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white hover:border-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Family Role -->
            <div>
              <label
                for="familyRole"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Role in Family *
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-users text-gray-400 text-lg"></i>
                </div>
                <select
                  id="familyRole"
                  v-model="familyRole"
                  class="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none bg-white hover:border-gray-400 cursor-pointer"
                >
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Family Setup Section -->
            <div class="border-t border-gray-200 pt-6">
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-home text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Family Setup
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Choose how you'd like to set up your family space
                  </p>
                </div>
              </div>

              <!-- Create Family Option -->
              <div class="mb-4">
                <label
                  for="createFamily"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Family Setup Option *
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-cogs text-gray-400 text-lg"></i>
                  </div>
                  <select
                    id="createFamily"
                    v-model="createFamily"
                    class="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none bg-white hover:border-gray-400 cursor-pointer"
                  >
                    <option value="yes">Create a new family space</option>
                    <option value="no">Join a family later</option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
              </div>

              <!-- Family Name (Conditional) -->
              <div v-if="createFamily === 'yes'" class="animate-fadeIn">
                <label
                  for="familyName"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Family Name *
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
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                    placeholder="e.g., The Smith Family"
                    required
                  />
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  This will be your family's display name. You can invite
                  members later.
                </p>
              </div>

              <!-- Info Box for Join Later -->
              <div
                v-else
                class="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeIn"
              >
                <div class="flex items-center gap-3">
                  <i class="fas fa-info-circle text-blue-600 text-lg"></i>
                  <div>
                    <p class="text-sm font-medium text-blue-900">No Problem!</p>
                    <p class="text-xs text-blue-700">
                      You can join a family anytime from your dashboard using
                      search or invitation links.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="loading || !isFormValid"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-check-circle text-lg"></i>
              <span class="text-lg">
                {{
                  loading
                    ? "Setting Up Your Profile..."
                    : "Complete Profile Setup"
                }}
              </span>
            </button>
          </form>
        </div>

        <!-- Help & Links -->
        <div class="text-center space-y-4">
          <div class="flex justify-center gap-6 text-sm text-gray-500">
            <NuxtLink
              to="/privacy"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/settings/data"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Manage Data
            </NuxtLink>
            <NuxtLink
              to="/help"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Get Help
            </NuxtLink>
          </div>

          <!-- Trust Indicators -->
          <div
            class="grid grid-cols-3 gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200"
          >
            <div class="flex items-center gap-2 justify-center">
              <i class="fas fa-shield-check text-green-500"></i>
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

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50/95 text-red-800 border-red-200': toastType === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-medium flex-1">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { createProfile } from "~/utils/firebase";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();
const name = ref("");
const birthday = ref("");
const familyRole = ref("parent");
const createFamily = ref("no");
const familyName = ref("");
const error = ref("");
const loading = ref(false);
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const isFormValid = computed(() => {
  const nameTrimmed = name.value.trim();
  const isValidName = nameTrimmed !== "" && !nameTrimmed.includes("@");
  const isValidBirthday =
    birthday.value && !isNaN(new Date(birthday.value).getTime());
  return (
    isValidName &&
    isValidBirthday &&
    familyRole.value !== "" &&
    (createFamily.value === "no" ||
      (createFamily.value === "yes" && familyName.value.trim() !== ""))
  );
});

const calculateMinor = (birthday) => {
  if (!birthday) return false;
  const birthDate = new Date(birthday);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1 < 18;
  }
  return age < 18;
};

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 4000);
};

const handleProfileSetup = async () => {
  if (!isFormValid.value) {
    error.value = name.value.includes("@")
      ? "Name should not contain '@'. Please enter a valid full name."
      : "Please fill all required fields correctly";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    console.log("Submitting profile:", {
      userId: authStore.userId,
      name: name.value,
      birthday: birthday.value,
      familyRole: familyRole.value,
      createFamily: createFamily.value,
      familyName: familyName.value,
      permissions: {
        role: createFamily.value === "yes" ? "admin" : "member",
        minor: calculateMinor(birthday.value),
        privateMode: false,
      },
    });

    await createProfile(authStore.userId, {
      name: name.value,
      birthday: birthday.value,
      familyRole: familyRole.value,
      permissions: {
        role: createFamily.value === "yes" ? "admin" : "member",
        minor: calculateMinor(birthday.value),
        privateMode: false,
      },
      familyId: createFamily.value === "yes" ? null : authStore.familyId,
      familyName:
        createFamily.value === "yes" ? familyName.value : authStore.familyName,
    });

    console.log("Profile saved successfully, redirecting to /dashboard");
    await authStore.initAuth();

    showToast("Profile setup complete! Welcome to FamilySpace.", "success");

    // Redirect after a short delay for better UX
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (err) {
    console.error("Profile setup error:", err);
    error.value = err.message.includes("permission-denied")
      ? "Permission denied. Please ensure you are logged in."
      : err.message || "Failed to save profile";
    showToast("Failed to save profile. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Set Up Profile",
  meta: [
    {
      name: "description",
      content:
        "Complete your FamilySpace profile to connect with your family and set up your private digital home.",
    },
  ],
});
</script>

<style scoped>
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

/* Improve input focus states */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>
