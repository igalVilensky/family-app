<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i class="fas fa-arrow-left text-sm"></i>
              <span>Back to Dashboard</span>
            </NuxtLink>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <div class="w-32"></div>
          <!-- Spacer for centering -->
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center gap-4">
            <avatar
              :avatar-url="authStore.avatarUrl"
              :user-initial="userInitial"
              :size="120"
              :no-upload="false"
              class="hover:ring-4 hover:ring-blue-100 transition-all duration-200"
              @avatar-updated="handleAvatarUpdate"
            />
            <button
              @click="triggerAvatarUpload"
              class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <i class="fas fa-camera text-sm"></i>
              Change Photo
            </button>
          </div>

          <!-- Basic Info -->
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              {{ authStore.name || "Your Name" }}
            </h2>
            <div
              class="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-4"
            >
              <i class="fas fa-envelope text-sm"></i>
              <span>{{ authStore.email }}</span>
            </div>
            <div
              class="flex items-center justify-center sm:justify-start gap-2 text-gray-600"
            >
              <i class="fas fa-users text-sm"></i>
              <span class="capitalize">{{ authStore.role || "Member" }}</span>
              <span class="text-gray-400">•</span>
              <span>{{ authStore.familyName || "No Family" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="fas fa-user text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Personal Information
            </h3>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                v-model="profileForm.name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                v-model="profileForm.email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
                readonly
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span class="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                v-model="profileForm.phone"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label
                for="bio"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio <span class="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="bio"
                v-model="profileForm.bio"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us a bit about yourself..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                {{ profileForm.bio.length }}/200 characters
              </p>
            </div>

            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="saving"
            >
              <i class="fas fa-save text-sm"></i>
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </form>
        </div>

        <!-- Security & Privacy -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="fas fa-shield-alt text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Security & Privacy
            </h3>
          </div>

          <div class="space-y-6">
            <!-- Change Password -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="font-medium text-gray-900">Password</h4>
                  <p class="text-sm text-gray-600">
                    Update your account password
                  </p>
                </div>
                <button
                  @click="showPasswordForm = !showPasswordForm"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <i class="fas fa-key text-sm"></i>
                  Change
                </button>
              </div>

              <div v-if="showPasswordForm" class="mt-4 space-y-3">
                <input
                  type="password"
                  v-model="passwordForm.current"
                  placeholder="Current password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  type="password"
                  v-model="passwordForm.new"
                  placeholder="New password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <input
                  type="password"
                  v-model="passwordForm.confirm"
                  placeholder="Confirm new password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div class="flex gap-2">
                  <button
                    @click="updatePassword"
                    class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    :disabled="updatingPassword"
                  >
                    <i class="fas fa-check text-sm"></i>
                    {{ updatingPassword ? "Updating..." : "Update" }}
                  </button>
                  <button
                    @click="cancelPasswordUpdate"
                    class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h4>
                  <p class="text-sm text-gray-600">
                    Add an extra layer of security
                  </p>
                </div>
                <button
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled
                >
                  <i class="fas fa-mobile-alt text-sm"></i>
                  Coming Soon
                </button>
              </div>
            </div>

            <!-- Account Visibility -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Profile Visibility</h4>
                  <p class="text-sm text-gray-600">
                    Who can see your profile information
                  </p>
                </div>
                <select
                  v-model="profileForm.visibility"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                >
                  <option value="family">Family Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white rounded-xl shadow-sm border border-red-200 p-6 mt-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-red-100 rounded-lg">
            <i class="fas fa-exclamation-triangle text-red-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Danger Zone</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-red-200 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">Leave Family</h4>
            <p class="text-sm text-gray-600 mb-4">
              Remove yourself from your current family. You'll need a new invite
              to rejoin.
            </p>
            <button
              @click="leaveFamily"
              class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              :disabled="leaving"
            >
              <i class="fas fa-sign-out-alt text-sm"></i>
              {{ leaving ? "Leaving..." : "Leave Family" }}
            </button>
          </div>

          <div class="border border-red-200 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">Delete Account</h4>
            <p class="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
            <button
              @click="deleteAccount"
              class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              :disabled="deleting"
            >
              <i class="fas fa-trash text-sm"></i>
              {{ deleting ? "Deleting..." : "Delete Account" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="showToastMessage"
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div
          class="p-4 rounded-lg shadow-lg border"
          :class="{
            'bg-green-50 text-green-800 border-green-200':
              toastType === 'success',
            'bg-red-50 text-red-800 border-red-200': toastType === 'error',
          }"
        >
          <div class="flex items-center gap-3">
            <i
              class="text-sm"
              :class="{
                'fas fa-check-circle text-green-500': toastType === 'success',
                'fas fa-exclamation-circle text-red-500': toastType === 'error',
              }"
            ></i>
            <p class="font-medium">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";
import Avatar from "~/components/Avatar.vue";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();

// Form data
const profileForm = ref({
  name: "",
  email: "",
  phone: "",
  bio: "",
  visibility: "family",
});

const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

// UI state
const saving = ref(false);
const updatingPassword = ref(false);
const leaving = ref(false);
const deleting = ref(false);
const showPasswordForm = ref(false);
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const initializeForm = () => {
  profileForm.value = {
    name: authStore.name || "",
    email: authStore.email || "",
    phone: authStore.phone || "",
    bio: authStore.bio || "",
    visibility: authStore.visibility || "family",
  };
};

const updateProfile = async () => {
  saving.value = true;
  try {
    await updateDoc(doc(db, "users", authStore.userId), {
      name: profileForm.value.name,
      phone: profileForm.value.phone,
      bio: profileForm.value.bio.substring(0, 200), // Limit bio length
      visibility: profileForm.value.visibility,
      updatedAt: new Date(),
    });

    // Update auth store
    authStore.name = profileForm.value.name;
    authStore.phone = profileForm.value.phone;
    authStore.bio = profileForm.value.bio;
    authStore.visibility = profileForm.value.visibility;

    showToast("Profile updated successfully", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("Failed to update profile: " + error.message, "error");
  } finally {
    saving.value = false;
  }
};

const updatePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    showToast("New passwords don't match", "error");
    return;
  }

  if (passwordForm.value.new.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  updatingPassword.value = true;
  try {
    const user = authStore.user;
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordForm.value.current
    );

    await reauthenticateWithCredential(user, credential);
    await firebaseUpdatePassword(user, passwordForm.value.new);

    cancelPasswordUpdate();
    showToast("Password updated successfully", "success");
  } catch (error) {
    console.error("Error updating password:", error);
    showToast("Failed to update password: " + error.message, "error");
  } finally {
    updatingPassword.value = false;
  }
};

const cancelPasswordUpdate = () => {
  showPasswordForm.value = false;
  passwordForm.value = { current: "", new: "", confirm: "" };
};

const handleAvatarUpdate = (newAvatarUrl) => {
  authStore.avatarUrl = newAvatarUrl;
  showToast("Profile photo updated successfully", "success");
};

const triggerAvatarUpload = () => {
  // This would trigger the avatar upload functionality
  // Implementation depends on your Avatar component
  console.log("Trigger avatar upload");
};

const leaveFamily = async () => {
  if (
    !confirm(
      "Are you sure you want to leave your family? You'll need a new invite to rejoin."
    )
  ) {
    return;
  }

  leaving.value = true;
  try {
    // Implementation depends on your family structure
    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: null,
      familyName: null,
      role: null,
      status: null,
      updatedAt: new Date(),
    });

    authStore.familyId = null;
    authStore.familyName = null;
    authStore.role = null;
    authStore.status = null;

    showToast("Successfully left family", "success");
    setTimeout(() => router.push("/dashboard"), 2000);
  } catch (error) {
    console.error("Error leaving family:", error);
    showToast("Failed to leave family: " + error.message, "error");
  } finally {
    leaving.value = false;
  }
};

const deleteAccount = async () => {
  const confirmation = prompt("Type 'DELETE' to confirm account deletion:");
  if (confirmation !== "DELETE") {
    return;
  }

  deleting.value = true;
  try {
    await deleteDoc(doc(db, "users", authStore.userId));
    await authStore.user.delete();

    authStore.clearAuth();
    router.push("/");
    showToast("Account deleted successfully", "success");
  } catch (error) {
    console.error("Error deleting account:", error);
    showToast("Failed to delete account: " + error.message, "error");
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await authStore.initAuth();
  if (!authStore.isInitialized) {
    router.push("/login?redirect=/profile");
    return;
  }
  initializeForm();
});

useHead({
  title: "FamilySpace - Profile Settings",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
textarea {
  resize: none;
}

input:disabled,
input:read-only {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}
</style>
