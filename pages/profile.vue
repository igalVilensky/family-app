<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <i class="fas fa-arrow-left text-sm"></i>
            <span>Back to Dashboard</span>
          </NuxtLink>
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-user-cog text-white text-lg"></i>
            </div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent"
            >
              Profile Settings
            </h1>
          </div>
          <div class="w-32"></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header Card -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 mb-8"
      >
        <div class="flex flex-col sm:flex-row items-center gap-8">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center gap-4">
            <div class="relative group">
              <avatar
                :avatar-url="authStore.avatarUrl"
                :user-initial="userInitial"
                :size="120"
                :no-upload="false"
                class="hover:ring-4 hover:ring-blue-100 transition-all duration-300 group-hover:scale-105 rounded-2xl"
                @avatar-updated="handleAvatarUpdate"
              />
              <div
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
              >
                <i class="fas fa-check text-white text-xs"></i>
              </div>
            </div>
            <button
              @click="triggerAvatarUpload"
              class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
            >
              <i class="fas fa-camera text-sm"></i>
              Change Photo
            </button>
          </div>

          <!-- Basic Info -->
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
              {{ authStore.name || "Your Name" }}
            </h2>
            <div
              class="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-4 text-lg"
            >
              <i class="fas fa-envelope text-blue-500"></i>
              <span>{{ authStore.email }}</span>
            </div>
            <div
              class="flex flex-wrap items-center justify-center sm:justify-start gap-3"
            >
              <div
                class="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-users text-blue-600 text-sm"></i>
                <span class="font-medium text-gray-700 capitalize">
                  {{ authStore.familyRole || "Member" }}
                </span>
              </div>
              <div
                class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-home text-green-600 text-sm"></i>
                <span class="font-medium text-gray-700">{{
                  authStore.familyName || "No Family"
                }}</span>
              </div>
              <div
                v-if="authStore.permissions.minor"
                class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-child text-amber-600 text-sm"></i>
                <span class="font-medium text-gray-700">Minor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Left Column - Personal Information -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Personal Information -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-user text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p class="text-gray-500 text-sm">
                  Update your personal details
                </p>
              </div>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="profileForm.name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                    readonly
                  />
                  <p class="text-xs text-gray-500 mt-2">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="birthday"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    v-model="profileForm.birthday"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    for="familyRole"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Role in Family *
                  </label>
                  <select
                    id="familyRole"
                    v-model="profileForm.familyRole"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Phone Number
                  <span class="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  v-model="profileForm.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  for="bio"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Bio <span class="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="bio"
                  v-model="profileForm.bio"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                  placeholder="Tell us a bit about yourself..."
                  maxlength="200"
                ></textarea>
                <div class="flex justify-between items-center mt-2">
                  <p class="text-xs text-gray-500">
                    Share your interests, hobbies, or a fun fact about yourself
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ profileForm.bio.length }}/200
                  </p>
                </div>
              </div>

              <button
                type="submit"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="saving || !isProfileFormValid"
              >
                <i
                  class="fas fa-save text-sm"
                  :class="{ 'animate-spin': saving }"
                ></i>
                {{ saving ? "Saving Changes..." : "Save Changes" }}
              </button>
            </form>
          </div>

          <!-- Danger Zone -->
          <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-exclamation-triangle text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Danger Zone</h3>
                <p class="text-gray-500 text-sm">Irreversible actions</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="border border-red-200 rounded-xl p-5 bg-red-50/50">
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-sign-out-alt text-red-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Leave Family</h4>
                    <p class="text-sm text-gray-600">
                      Remove yourself from your current family
                    </p>
                  </div>
                </div>
                <button
                  @click="leaveFamily"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  :disabled="leaving"
                >
                  <i
                    class="fas fa-sign-out-alt text-sm"
                    :class="{ 'animate-spin': leaving }"
                  ></i>
                  {{ leaving ? "Leaving..." : "Leave Family" }}
                </button>
              </div>

              <div class="border border-red-200 rounded-xl p-5 bg-red-50/50">
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-trash text-red-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Delete Account</h4>
                    <p class="text-sm text-gray-600">
                      Permanently delete your account and data
                    </p>
                  </div>
                </div>
                <button
                  @click="deleteAccount"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  :disabled="deleting"
                >
                  <i
                    class="fas fa-trash text-sm"
                    :class="{ 'animate-spin': deleting }"
                  ></i>
                  {{ deleting ? "Deleting..." : "Delete Account" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Security & Settings -->
        <div class="space-y-8">
          <!-- Security & Privacy -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Security & Privacy
                </h3>
                <p class="text-gray-500 text-sm">
                  Manage your account security
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Change Password -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <i class="fas fa-key text-green-600"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">Password</h4>
                      <p class="text-sm text-gray-600">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <button
                    @click="showPasswordForm = !showPasswordForm"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <i class="fas fa-edit text-sm"></i>
                    {{ showPasswordForm ? "Cancel" : "Change" }}
                  </button>
                </div>

                <form
                  v-if="showPasswordForm"
                  @submit.prevent="updatePassword"
                  class="mt-4 space-y-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <label
                      for="current-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      v-model="passwordForm.current"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="new-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      v-model="passwordForm.new"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter new password"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-2">
                      Minimum 6 characters
                    </p>
                  </div>
                  <div>
                    <label
                      for="confirm-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      v-model="passwordForm.confirm"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div class="flex gap-3">
                    <button
                      type="submit"
                      class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-1"
                      :disabled="updatingPassword || !isPasswordFormValid"
                    >
                      <i
                        class="fas fa-check text-sm"
                        :class="{ 'animate-spin': updatingPassword }"
                      ></i>
                      {{ updatingPassword ? "Updating..." : "Update" }}
                    </button>
                    <button
                      type="button"
                      @click="cancelPasswordUpdate"
                      class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <!-- Privacy Settings -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-eye text-purple-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Profile Privacy</h4>
                    <p class="text-sm text-gray-600">
                      Make profile visible only to family
                    </p>
                  </div>
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      v-model="profileForm.permissions.privateMode"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                    ></div>
                  </label>
                </div>
              </div>

              <!-- Account Role -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-user-tag text-blue-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Account Role</h4>
                    <p class="text-sm text-gray-600">
                      Your administrative permissions
                    </p>
                  </div>
                  <span
                    class="px-4 py-2 text-sm font-semibold rounded-xl capitalize"
                    :class="{
                      'bg-gradient-to-r from-purple-500 to-indigo-600 text-white':
                        authStore.permissions.role === 'admin',
                      'bg-green-100 text-green-700':
                        authStore.permissions.role === 'member',
                    }"
                  >
                    {{ authStore.permissions.role }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-info-circle text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Account Status
                </h3>
                <p class="text-gray-500 text-sm">Your account information</p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Member Since</span>
                <span class="font-semibold text-gray-900">{{
                  formatJoinDate(authStore.createdAt)
                }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Family Status</span>
                <span class="font-semibold text-gray-900 capitalize">{{
                  authStore.status || "Active"
                }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Last Updated</span>
                <span class="font-semibold text-gray-900 text-sm">{{
                  formatJoinDate(authStore.updatedAt)
                }}</span>
              </div>
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

const formatJoinDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "Unknown";
  }
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
.animate-spin {
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
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

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
