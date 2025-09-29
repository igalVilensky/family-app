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
              <span class="capitalize">{{
                authStore.familyRole || "Member"
              }}</span>
              <span class="text-gray-400">•</span>
              <span>{{ authStore.familyName || "No Family" }}</span>
              <span
                v-if="authStore.permissions.minor"
                class="ml-2 text-sm text-gray-500"
                >(Minor)</span
              >
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
                for="birthday"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="birthday"
                v-model="profileForm.birthday"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label
                for="familyRole"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Role in Family
              </label>
              <select
                id="familyRole"
                v-model="profileForm.familyRole"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="grandparent">Grandparent</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
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
              :disabled="saving || !isProfileFormValid"
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
                  {{ showPasswordForm ? "Cancel" : "Change" }}
                </button>
              </div>

              <form
                v-if="showPasswordForm"
                @submit.prevent="updatePassword"
                class="mt-4 space-y-3"
              >
                <div>
                  <label
                    for="current-password"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    v-model="passwordForm.current"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label
                    for="new-password"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    v-model="passwordForm.new"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                  <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <label
                    for="confirm-password"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    v-model="passwordForm.confirm"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    :disabled="updatingPassword || !isPasswordFormValid"
                  >
                    <i class="fas fa-check text-sm"></i>
                    {{ updatingPassword ? "Updating..." : "Update Password" }}
                  </button>
                  <button
                    type="button"
                    @click="cancelPasswordUpdate"
                    class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Private Mode -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Profile Privacy</h4>
                  <p class="text-sm text-gray-600">
                    Make your profile visible only to family members
                  </p>
                </div>
                <label class="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    v-model="profileForm.permissions.privateMode"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  Private Mode
                </label>
              </div>
            </div>

            <!-- Account Role -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Account Role</h4>
                  <p class="text-sm text-gray-600">
                    Your administrative role: {{ authStore.permissions.role }}
                  </p>
                </div>
                <button
                  class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg cursor-not-allowed"
                  disabled
                >
                  {{ authStore.permissions.role }}
                </button>
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
  getAuth,
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
  birthday: "",
  familyRole: "",
  permissions: {
    privateMode: false,
  },
  phone: "",
  bio: "",
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

const isProfileFormValid = computed(() => {
  const nameTrimmed = profileForm.value.name.trim();
  const isValidName = nameTrimmed !== "" && !nameTrimmed.includes("@");
  const isValidBirthday =
    profileForm.value.birthday &&
    !isNaN(new Date(profileForm.value.birthday).getTime());
  const isValidFamilyRole = [
    "parent",
    "child",
    "grandparent",
    "sibling",
    "other",
  ].includes(profileForm.value.familyRole);
  return isValidName && isValidBirthday && isValidFamilyRole;
});

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.current.trim() !== "" &&
    passwordForm.value.new.trim() !== "" &&
    passwordForm.value.confirm.trim() !== "" &&
    passwordForm.value.new.length >= 6 &&
    passwordForm.value.new === passwordForm.value.confirm
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
  }, 3000);
};

const initializeForm = () => {
  profileForm.value = {
    name: authStore.name || "",
    email: authStore.email || "",
    birthday: authStore.birthday || "",
    familyRole: authStore.familyRole || "other",
    permissions: {
      privateMode: authStore.permissions.privateMode || false,
    },
    phone: authStore.phone || "",
    bio: authStore.bio || "",
  };
};

const updateProfile = async () => {
  if (!isProfileFormValid.value) {
    showToast("Please fill all required fields correctly", "error");
    return;
  }

  saving.value = true;
  try {
    const userDoc = {
      name: profileForm.value.name,
      birthday: profileForm.value.birthday,
      familyRole: profileForm.value.familyRole,
      permissions: {
        role: authStore.permissions.role, // Preserve existing role
        minor: calculateMinor(profileForm.value.birthday),
        privateMode: profileForm.value.permissions.privateMode,
      },
      phone: profileForm.value.phone,
      bio: profileForm.value.bio.substring(0, 200),
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, "users", authStore.userId), userDoc);

    // Update auth store
    authStore.name = profileForm.value.name;
    authStore.birthday = profileForm.value.birthday;
    authStore.familyRole = profileForm.value.familyRole;
    authStore.permissions = {
      ...authStore.permissions,
      minor: userDoc.permissions.minor,
      privateMode: userDoc.permissions.privateMode,
    };
    authStore.phone = profileForm.value.phone;
    authStore.bio = profileForm.value.bio;

    showToast("Profile updated successfully", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("Failed to update profile: " + error.message, "error");
  } finally {
    saving.value = false;
  }
};

const updatePassword = async () => {
  if (!isPasswordFormValid.value) {
    if (passwordForm.value.new !== passwordForm.value.confirm) {
      showToast("New passwords don't match", "error");
      return;
    }
    if (passwordForm.value.new.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    showToast("Please fill all password fields", "error");
    return;
  }

  updatingPassword.value = true;
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordForm.value.current
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await firebaseUpdatePassword(user, passwordForm.value.new);

    // Clear form and hide it
    cancelPasswordUpdate();
    showToast("Password updated successfully", "success");
  } catch (error) {
    console.error("Error updating password:", {
      code: error.code,
      message: error.message,
    });
    if (error.code === "auth/wrong-password") {
      showToast("Current password is incorrect", "error");
    } else if (error.code === "auth/too-many-requests") {
      showToast("Too many attempts. Please try again later.", "error");
    } else {
      showToast("Failed to update password: " + error.message, "error");
    }
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
  // Implementation depends on Avatar component
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
    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: null,
      familyName: null,
      familyRole: null,
      status: null,
      updatedAt: new Date(),
    });

    authStore.familyId = null;
    authStore.familyName = null;
    authStore.familyRole = null;
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
