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
          <h1 class="text-2xl font-bold text-gray-900">Family Profile</h1>
          <div class="w-32"></div>
          <!-- Spacer for centering -->
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-600 mt-4">Loading family data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <div class="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div
          class="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Unable to Load Family
        </h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <div class="flex gap-4 justify-center">
          <NuxtLink
            v-if="!authStore.familyId"
            to="/family-setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-plus text-sm"></i>
            Set Up Family
          </NuxtLink>
          <button
            @click="fetchFamilyData"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-redo text-sm"></i>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Family Header Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div class="text-center">
          <div
            class="p-3 sm:p-4 bg-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center"
          >
            <i class="fas fa-home text-blue-600 text-xl sm:text-2xl"></i>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ familyData?.name || "Your Family" }}
          </h2>
          <p class="text-base sm:text-lg text-gray-600 mb-4 px-2">
            A private space for your family to connect and share memories
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-500"
          >
            <div class="flex items-center gap-1">
              <i class="fas fa-users text-xs"></i>
              <span>{{ familyData?.members?.length || 0 }} Members</span>
            </div>
            <div class="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div class="flex items-center gap-1">
              <i class="fas fa-calendar text-xs"></i>
              <span>Created {{ formatDate(familyData?.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <!-- Family Members -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <i class="fas fa-users text-green-600"></i>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                Family Members
              </h3>
            </div>
            <span
              class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium self-start sm:self-auto"
            >
              {{ familyData?.members?.length || 0 }} members
            </span>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="member in familyData?.members"
              :key="member.userId"
              class="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <!-- Member Avatar -->
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-user text-gray-600 text-sm sm:text-base"></i>
              </div>

              <!-- Member Info -->
              <div class="flex-1 min-w-0">
                <div
                  class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
                >
                  <h4
                    class="font-medium text-gray-900 text-sm sm:text-base truncate"
                  >
                    {{ getMemberDisplayName(member) }}
                  </h4>
                  <span
                    v-if="member.userId === authStore.userId"
                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full self-start"
                  >
                    You
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 truncate">
                  {{ member.email }}
                </p>
              </div>

              <!-- Member Role -->
              <div class="flex-shrink-0">
                <span
                  class="px-2 sm:px-3 py-1 text-xs font-medium rounded-full block"
                  :class="{
                    'bg-purple-100 text-purple-700': member.role === 'parent',
                    'bg-green-100 text-green-700': member.role === 'member',
                    'bg-gray-100 text-gray-700': !member.role,
                  }"
                >
                  {{
                    member.role
                      ? member.role.charAt(0).toUpperCase() +
                        member.role.slice(1)
                      : "Member"
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Invite New Members (Parents Only) -->
          <div
            v-if="authStore.role === 'parent'"
            class="mt-6 pt-6 border-t border-gray-200"
          >
            <button
              @click="generateInviteLink"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="generatingInvite"
            >
              <i class="fas fa-user-plus text-sm"></i>
              {{ generatingInvite ? "Generating..." : "Invite Member" }}
            </button>

            <div
              v-if="inviteLink"
              class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <label class="block text-sm font-medium text-blue-900 mb-2">
                Share this invite link:
              </label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  :value="inviteLink"
                  readonly
                  class="flex-1 px-3 py-2 border border-blue-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @click="$event.target.select()"
                />
                <button
                  @click="copyInviteLink"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  <i class="fas fa-copy text-sm"></i>
                  {{ copyButtonText }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats & Actions Row -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <!-- Family Stats -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <i class="fas fa-chart-bar text-purple-600"></i>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                Family Stats
              </h3>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center justify-between py-1 sm:py-2">
                <span class="text-sm sm:text-base text-gray-600"
                  >Total Members</span
                >
                <span
                  class="font-semibold text-sm sm:text-base text-gray-900"
                  >{{ familyData?.members?.length || 0 }}</span
                >
              </div>
              <div class="flex items-center justify-between py-1 sm:py-2">
                <span class="text-sm sm:text-base text-gray-600">Parents</span>
                <span
                  class="font-semibold text-sm sm:text-base text-gray-900"
                  >{{ getParentCount() }}</span
                >
              </div>
              <div class="flex items-center justify-between py-1 sm:py-2">
                <span class="text-sm sm:text-base text-gray-600">Members</span>
                <span
                  class="font-semibold text-sm sm:text-base text-gray-900"
                  >{{ getMemberCount() }}</span
                >
              </div>
              <div
                class="flex items-center justify-between py-1 sm:py-2 border-t border-gray-200 pt-2"
              >
                <span class="text-sm sm:text-base text-gray-600">Created</span>
                <span
                  class="font-semibold text-xs sm:text-base text-gray-900"
                  >{{ formatDate(familyData?.createdAt) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <i class="fas fa-bolt text-amber-600"></i>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>

            <div class="space-y-2 sm:space-y-3">
              <button
                class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <i class="fas fa-photo-video text-gray-400 flex-shrink-0"></i>
                <span class="truncate">Share Memories</span>
                <span class="ml-auto text-xs text-gray-400 flex-shrink-0"
                  >Coming Soon</span
                >
              </button>

              <button
                class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <i class="fas fa-calendar-plus text-gray-400 flex-shrink-0"></i>
                <span class="truncate">Plan Events</span>
                <span class="ml-auto text-xs text-gray-400 flex-shrink-0"
                  >Coming Soon</span
                >
              </button>

              <button
                class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <i class="fas fa-comments text-gray-400 flex-shrink-0"></i>
                <span class="truncate">Family Chat</span>
                <span class="ml-auto text-xs text-gray-400 flex-shrink-0"
                  >Coming Soon</span
                >
              </button>
            </div>
          </div>

          <!-- Family Settings (Parents Only) -->
          <div
            v-if="authStore.role === 'parent'"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <i class="fas fa-cog text-red-600"></i>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                Family Settings
              </h3>
            </div>

            <div class="space-y-2 sm:space-y-3">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <i class="fas fa-edit text-gray-500 flex-shrink-0"></i>
                <span class="truncate">Edit Family Name</span>
              </button>

              <button
                @click="manageFamilySettings"
                class="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled
              >
                <i class="fas fa-users-cog text-gray-400 flex-shrink-0"></i>
                <span class="truncate">Manage Members</span>
                <span class="ml-auto text-xs text-gray-400 flex-shrink-0"
                  >Coming Soon</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Soon Section -->
      <div
        class="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 sm:p-8 text-center"
      >
        <div
          class="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center"
        >
          <i class="fas fa-rocket text-blue-600 text-lg sm:text-xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          More Features Coming Soon!
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
          We're working on exciting features like shared photo albums, family
          calendars, group chats, and memory timelines to make your family
          experience even better.
        </p>
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500"
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
import { ref, onMounted } from "vue";
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
    console.log("fetchFamilyData: Fetching family data", { familyId });

    if (!familyId || familyId === "null") {
      error.value = "No family assigned. Please set up or join a family.";
      console.log("fetchFamilyData: Invalid familyId", { familyId });
      return;
    }

    const docRef = doc(db, "families", familyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      familyData.value = docSnap.data();
      console.log("fetchFamilyData: Family data loaded", familyData.value);
    } else {
      error.value = "Family not found";
      console.log("fetchFamilyData: Family not found", { familyId });
    }
  } catch (err) {
    error.value = "Failed to load family data: " + err.message;
    console.error("fetchFamilyData: Error", {
      errorCode: err.code,
      errorMessage: err.message,
      familyId: route.params.id,
    });
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

const manageFamilySettings = () => {
  showToast("Member management features coming soon!", "error");
};

onMounted(async () => {
  await authStore.initAuth();
  console.log("onMounted: authStore state", {
    userId: authStore.userId,
    familyId: authStore.familyId,
    role: authStore.role,
    routeFamilyId: route.params.id,
  });

  if (!authStore.familyId) {
    console.log("onMounted: No familyId, redirecting to /family-setup");
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
</style>
