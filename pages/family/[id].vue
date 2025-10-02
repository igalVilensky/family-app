<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i class="fas fa-arrow-left text-sm"></i>
            <span class="hidden sm:inline">Back to Dashboard</span>
            <span class="sm:hidden">Back</span>
          </NuxtLink>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
            Family Profile
          </h1>
          <div class="w-20 sm:w-32"></div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="text-gray-600">Loading family data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Family
          </h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              v-if="!authStore.familyId"
              to="/family-setup"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-plus text-sm"></i>
              Set Up Family
            </NuxtLink>
            <button
              @click="fetchFamilyData"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-redo text-sm"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Family Header Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-2xl mb-4"
          >
            <i class="fas fa-home text-blue-600 text-2xl sm:text-3xl"></i>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ familyData?.name || "Your Family" }}
          </h2>
          <p class="text-sm sm:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
            A private space for your family to connect and share memories
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-gray-500"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-users"></i>
              <span>{{ familyData?.members?.length || 0 }} Members</span>
            </div>
            <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar"></i>
              <span>Created {{ formatDate(familyData?.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Members -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="fas fa-users text-green-600"></i>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
              Family Members
            </h3>
          </div>
          <span
            class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
          >
            {{ familyData?.members?.length || 0 }}
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="member in familyData?.members"
            :key="member.userId"
            class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div
              class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-user text-gray-600"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900 truncate">
                  {{ getMemberDisplayName(member) }}
                </h4>
                <span
                  v-if="member.userId === authStore.userId"
                  class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  You
                </span>
              </div>
              <p class="text-sm text-gray-600 truncate">{{ member.email }}</p>
            </div>

            <span
              class="px-3 py-1 text-xs font-medium rounded-full flex-shrink-0"
              :class="{
                'bg-purple-100 text-purple-700': member.role === 'admin',
                'bg-green-100 text-green-700': member.role === 'member',
                'bg-gray-100 text-gray-700': !member.role,
              }"
            >
              {{
                member.role
                  ? member.role.charAt(0).toUpperCase() + member.role.slice(1)
                  : "Member"
              }}
            </span>
          </div>
        </div>

        <!-- Invite Section (Parents Only) -->
        <div
          v-if="authStore.permissions.role === 'admin'"
          class="mt-6 pt-6 border-t border-gray-200"
        >
          <button
            @click="generateInviteLink"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="generatingInvite"
          >
            <i class="fas fa-user-plus text-sm"></i>
            {{ generatingInvite ? "Generating..." : "Invite Member" }}
          </button>

          <div
            v-if="inviteLink"
            class="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <label class="block text-sm font-medium text-purple-900 mb-2">
              Share this invite link:
            </label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                :value="inviteLink"
                readonly
                class="flex-1 px-3 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                @click="$event.target.select()"
              />
              <button
                @click="copyInviteLink"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <i class="fas fa-copy text-sm"></i>
                {{ copyButtonText }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <!-- Family Stats -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="fas fa-chart-bar text-blue-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Stats</h3>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between py-2">
              <span class="text-gray-600">Total Members</span>
              <span class="font-semibold text-gray-900">{{
                familyData?.members?.length || 0
              }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-gray-600">Parents</span>
              <span class="font-semibold text-gray-900">{{
                getParentCount()
              }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-gray-600">Members</span>
              <span class="font-semibold text-gray-900">{{
                getMemberCount()
              }}</span>
            </div>
            <div
              class="flex items-center justify-between py-2 border-t border-gray-200 pt-2"
            >
              <span class="text-gray-600">Created</span>
              <span class="font-semibold text-gray-900 text-sm">{{
                formatDate(familyData?.createdAt)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-amber-100 rounded-lg">
              <i class="fas fa-bolt text-amber-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>

          <div class="space-y-2">
            <button
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
              disabled
            >
              <i class="fas fa-photo-video"></i>
              <span class="flex-1">Share Memories</span>
              <span class="text-xs">Soon</span>
            </button>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
              disabled
            >
              <i class="fas fa-calendar-plus"></i>
              <span class="flex-1">Plan Events</span>
              <span class="text-xs">Soon</span>
            </button>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
              disabled
            >
              <i class="fas fa-comments"></i>
              <span class="flex-1">Family Chat</span>
              <span class="text-xs">Soon</span>
            </button>
          </div>
        </div>

        <!-- Settings (Parents Only) -->
        <div
          v-if="authStore.permissions.role === 'admin'"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-red-100 rounded-lg">
              <i class="fas fa-cog text-red-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Settings</h3>
          </div>

          <div class="space-y-2">
            <button
              @click="editFamilyName"
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <i class="fas fa-edit text-gray-500"></i>
              <span>Edit Family Name</span>
            </button>
            <button
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
              disabled
            >
              <i class="fas fa-users-cog"></i>
              <span class="flex-1">Manage Members</span>
              <span class="text-xs">Soon</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Coming Soon Banner -->
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 sm:p-8"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4"
          >
            <i class="fas fa-rocket text-blue-600 text-xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            More Features Coming Soon!
          </h3>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're working on exciting features like shared photo albums, family
            calendars, group chats, and memory timelines to make your family
            experience even better.
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-images text-blue-500"></i>
              <span>Photo Albums</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar-alt text-green-500"></i>
              <span>Shared Calendar</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-history text-purple-500"></i>
              <span>Memory Timeline</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4"
    >
      <div
        class="p-4 rounded-lg shadow-lg border animate-slideIn"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "~/stores/auth";
import { useNuxtApp } from "#app";
import { generateInvite } from "~/utils/firebase";

const { $firestore: db } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Data
const familyData = ref(null);
const loading = ref(true);
const error = ref("");

// UI State
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const fetchFamilyData = async () => {
  try {
    loading.value = true;
    error.value = "";

    const familyId = route.params.id;

    if (!familyId || familyId === "null") {
      error.value = "No family assigned. Please set up or join a family.";
      return;
    }

    const docRef = doc(db, "families", familyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      familyData.value = docSnap.data();
    } else {
      error.value = "Family not found";
    }
  } catch (err) {
    const errorMessage =
      err?.message || err?.toString() || "An unknown error occurred";
    error.value = "Failed to load family data: " + errorMessage;
    console.error("Error fetching family data:", err);
  } finally {
    loading.value = false;
  }
};

const getMemberDisplayName = (member) => {
  if (member.name) return member.name;
  if (member.email) return member.email.split("@")[0];
  return "Unknown Member";
};

const getParentCount = () => {
  return (
    familyData.value?.members?.filter((m) => m.role === "parent").length || 0
  );
};

const getMemberCount = () => {
  return (
    familyData.value?.members?.filter((m) => m.role === "member").length || 0
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

const generateInviteLink = async () => {
  if (authStore.role !== "parent") {
    showToast("Only parents can generate invite links", "error");
    return;
  }

  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      authStore.familyId,
      authStore.familyName,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
    showToast("Invite link generated successfully", "success");
  } catch (error) {
    console.error("Error generating invite link:", error);
    showToast("Failed to generate invite link: " + error.message, "error");
  } finally {
    generatingInvite.value = false;
  }
};

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    copyButtonText.value = "Copied!";
    showToast("Invite link copied to clipboard", "success");
    setTimeout(() => {
      copyButtonText.value = "Copy";
    }, 2000);
  } catch (error) {
    console.error("Error copying invite link:", error);
    showToast("Failed to copy invite link", "error");
  }
};

const editFamilyName = async () => {
  const newName = prompt(
    "Enter new family name:",
    familyData.value?.name || ""
  );
  if (!newName || newName.trim() === "") return;

  try {
    await updateDoc(doc(db, "families", route.params.id), {
      name: newName.trim(),
      updatedAt: new Date(),
    });

    familyData.value.name = newName.trim();
    authStore.familyName = newName.trim();
    showToast("Family name updated successfully", "success");
  } catch (error) {
    console.error("Error updating family name:", error);
    showToast("Failed to update family name", "error");
  }
};

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.familyId) {
    router.push("/family-setup");
  } else {
    await fetchFamilyData();
  }
});

useHead({
  title: computed(
    () => `FamilySpace - ${familyData.value?.name || "Family Profile"}`
  ),
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
</style>
