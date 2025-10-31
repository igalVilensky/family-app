<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Loading State - Purpose: Show progress with minimal distraction -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div
            class="absolute inset-0 border-3 border-orange-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-3 border-orange-500 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Loading Family</h2>
        <p class="text-sm text-gray-600">Gathering family details...</p>
      </div>
    </div>

    <!-- Error State - Purpose: Clear error communication with actionable steps -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
        <div class="text-center">
          <div
            class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-lg"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Family
          </h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              v-if="!authStore.hasFamily"
              to="/family-setup"
              class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Set Up Family
            </NuxtLink>
            <button
              @click="fetchFamilyData"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Access Denied - Purpose: Clear permission messaging with alternatives -->
    <div v-else-if="!hasAccess" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
        <div class="text-center">
          <div
            class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-lock text-amber-600 text-lg"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p class="text-gray-600 mb-6">
            You don't have access to this family. Please check if you're a
            member or request to join.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              to="/dashboard"
              class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Dashboard
            </NuxtLink>
            <NuxtLink
              to="/join-family"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              Find Families
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - Purpose: Organized family information with clear hierarchy -->
    <main v-else class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Family Header - Purpose: Quick family identification and key metrics -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-home text-white text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 truncate">
              {{ familyData?.name || "Your Family" }}
            </h1>
            <p class="text-gray-600 text-sm">Private family space</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            class="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-users text-blue-600"></i>
            <span class="font-medium text-gray-800"
              >{{ familyData?.members?.length || 0 }} Members</span
            >
          </div>
          <div
            class="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-calendar text-emerald-600"></i>
            <span class="font-medium text-gray-800">{{
              formatDateCompact(familyData?.createdAt)
            }}</span>
          </div>
          <div
            v-if="userFamilyRole"
            class="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-user-tag text-purple-600"></i>
            <span class="font-medium text-gray-800 capitalize">{{
              userFamilyRole
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Main Content Area -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Family Members - Purpose: Clear member overview with relationship status -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-users text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Family Members
                  </h3>
                  <p class="text-gray-600 text-sm">Your family circle</p>
                </div>
              </div>
              <span
                class="px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-lg"
              >
                {{ familyData?.members?.length || 0 }}
              </span>
            </div>

            <!-- Relationship Alert - Purpose: Actionable setup reminder -->
            <div
              v-if="membersWithoutRelationships.length > 0"
              class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4"
            >
              <div class="flex items-center gap-2">
                <i class="fas fa-info-circle text-amber-600 text-sm"></i>
                <div>
                  <h4 class="font-medium text-amber-900 text-sm">
                    Complete Family Setup
                  </h4>
                  <p class="text-amber-800 text-xs">
                    {{ membersWithoutRelationships.length }} member{{
                      membersWithoutRelationships.length !== 1 ? "s" : ""
                    }}
                    need relationship setup
                  </p>
                </div>
              </div>
            </div>

            <!-- Members Grid - Purpose: Scannable member cards with clear relationships -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer"
                @click="goToUserProfile(member.userId)"
              >
                <!-- Admin Badge - Purpose: Quick role identification -->
                <div
                  v-if="member.role === 'admin'"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border border-white flex items-center justify-center"
                >
                  <i class="fas fa-crown text-white text-xs"></i>
                </div>

                <div class="relative">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="getRelationshipColor(member.relationship)"
                  >
                    <span class="text-white font-medium text-sm">
                      {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <!-- You Indicator - Purpose: Clear self-identification -->
                  <div
                    v-if="member.userId === authStore.userId"
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center"
                  >
                    <i class="fas fa-check text-white text-[6px]"></i>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 text-sm truncate">
                    {{ getMemberDisplayName(member) }}
                  </h4>
                  <p class="text-gray-600 text-xs truncate mb-1">
                    {{ member.email }}
                  </p>
                  <div class="flex items-center gap-1">
                    <i
                      class="text-xs"
                      :class="getRelationshipIcon(member.relationship)"
                    ></i>
                    <span class="text-xs text-gray-700 truncate">
                      {{ getRelationshipDisplay(member.relationship) }}
                    </span>
                    <span
                      v-if="!member.relationship"
                      class="px-1 bg-gray-200 text-gray-600 text-xs rounded font-medium"
                    >
                      Needs Setup
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Invite Section - Purpose: Streamlined member invitation -->
            <div v-if="isAdmin" class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-user-plus text-white text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Invite Members</h4>
                  <p class="text-gray-600 text-sm">Share invite link</p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                :disabled="generatingInvite"
              >
                <i
                  class="fas fa-link text-sm"
                  :class="{ 'animate-spin': generatingInvite }"
                ></i>
                <span>{{
                  generatingInvite ? "Generating..." : "Generate Invite Link"
                }}</span>
              </button>

              <div
                v-if="inviteLink"
                class="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <label class="block font-medium text-purple-900 text-sm mb-2">
                  Share this invite link:
                </label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Preview - Purpose: Informative upcoming features -->
          <div class="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <div class="text-center">
              <div
                class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="fas fa-rocket text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Family Timeline Coming Soon
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                We're building a beautiful family timeline to capture and share
                your precious memories.
              </p>
              <div class="flex flex-wrap justify-center gap-2">
                <div
                  class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-xs"
                >
                  <i class="fas fa-sitemap text-blue-500"></i>
                  <span class="font-medium text-gray-800">Family Tree</span>
                </div>
                <div
                  class="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-xs"
                >
                  <i class="fas fa-images text-emerald-500"></i>
                  <span class="font-medium text-gray-800">Memory Album</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Purpose: Quick actions and family insights -->
        <div class="space-y-6">
          <!-- Family Stats - Purpose: At-a-glance family metrics -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-chart-bar text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Family Stats</h3>
                <p class="text-gray-600 text-sm">Overview</p>
              </div>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-users text-blue-600 text-sm"></i>
                  <span class="font-medium text-gray-800 text-sm"
                    >Total Members</span
                  >
                </div>
                <span class="font-semibold text-gray-900">{{
                  familyData?.members?.length || 0
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-heart text-purple-600 text-sm"></i>
                  <span class="font-medium text-gray-800 text-sm"
                    >Relationships Set</span
                  >
                </div>
                <span class="font-semibold text-gray-900"
                  >{{ membersWithRelationships.length }}/{{
                    familyData?.members?.length || 0
                  }}</span
                >
              </div>
            </div>
          </div>

          <!-- Quick Actions - Purpose: Common task shortcuts -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-bolt text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Quick Actions</h3>
                <p class="text-gray-600 text-sm">Family tools</p>
              </div>
            </div>

            <div class="space-y-2">
              <NuxtLink
                to="/calendar"
                class="w-full flex items-center gap-3 p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-calendar-alt text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    View Calendar
                  </div>
                  <div class="text-gray-600 text-xs">See upcoming events</div>
                </div>
              </NuxtLink>

              <button
                v-if="isAdmin && membersWithoutRelationships.length > 0"
                @click="showRelationshipSetupHelp"
                class="w-full flex items-center gap-3 p-2 text-left bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    Setup Relationships
                  </div>
                  <div class="text-gray-600 text-xs">Complete family setup</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Settings - Purpose: Administrative controls -->
          <div
            v-if="isAdmin"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-cog text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Family Settings</h3>
                <p class="text-gray-600 text-sm">Manage your family</p>
              </div>
            </div>

            <div class="space-y-2">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-3 p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-edit text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    Edit Family Name
                  </div>
                  <div class="text-gray-600 text-xs">Update display name</div>
                </div>
              </button>

              <NuxtLink
                :to="`/family/manage/${route.params.id}`"
                class="w-full flex items-center gap-3 p-2 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    Manage Members
                  </div>
                  <div class="text-gray-600 text-xs">
                    Add, remove, or change roles
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification - Purpose: Brief, non-intrusive feedback -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4"
    >
      <div
        class="p-3 rounded-lg shadow-md border"
        :class="{
          'bg-green-50 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50 text-red-800 border-red-200': toastType === 'error',
        }"
      >
        <div class="flex items-center gap-2">
          <i
            class="text-sm"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-medium text-sm flex-1">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
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

// Computed properties for multi-family support
const currentFamilyId = computed(() => route.params.id);
const hasAccess = computed(() => {
  if (!currentFamilyId.value || !authStore.families) return false;
  return currentFamilyId.value in authStore.families;
});

const userFamilyRole = computed(() => {
  if (!hasAccess.value) return null;
  return authStore.families[currentFamilyId.value]?.role || "member";
});

const isAdmin = computed(() => {
  return userFamilyRole.value === "admin";
});

const membersWithRelationships = computed(() => {
  return (
    familyData.value?.members?.filter((member) => member.relationship) || []
  );
});

const membersWithoutRelationships = computed(() => {
  return (
    familyData.value?.members?.filter((member) => !member.relationship) || []
  );
});

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

    const familyId = currentFamilyId.value;

    if (!familyId || familyId === "null") {
      error.value = "No family specified.";
      return;
    }

    // Check if user has access to this family
    if (!hasAccess.value) {
      error.value = "You don't have access to this family.";
      loading.value = false;
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

// Relationship display functions
const getRelationshipDisplay = (relationship) => {
  const relationshipMap = {
    parent_1: "Father",
    parent_2: "Mother",
    child: "Child",
    spouse: "Spouse/Partner",
  };
  return relationshipMap[relationship] || "Relationship not set";
};

const getRelationshipIcon = (relationship) => {
  const iconMap = {
    parent_1: "fas fa-male text-blue-500",
    parent_2: "fas fa-female text-pink-500",
    child: "fas fa-child text-green-500",
    spouse: "fas fa-heart text-purple-500",
  };
  return iconMap[relationship] || "fas fa-question-circle text-gray-400";
};

const getRelationshipColor = (relationship) => {
  const colorMap = {
    parent_1: "bg-gradient-to-br from-blue-500 to-indigo-600",
    parent_2: "bg-gradient-to-br from-pink-500 to-rose-600",
    child: "bg-gradient-to-br from-green-500 to-emerald-600",
    spouse: "bg-gradient-to-br from-purple-500 to-violet-600",
  };
  return (
    colorMap[relationship] || "bg-gradient-to-br from-gray-500 to-gray-600"
  );
};

const getAdminCount = () => {
  return (
    familyData.value?.members?.filter((m) => m.role === "admin").length || 0
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

// New compact date format for mobile
const formatDateCompact = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

const goToUserProfile = (userId) => {
  if (userId === authStore.userId) {
    router.push("/profile");
  } else {
    router.push(`/user/${userId}`);
  }
};

const generateInviteLink = async () => {
  if (!isAdmin.value) {
    showToast("Only admins can generate invite links", "error");
    return;
  }

  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      currentFamilyId.value,
      familyData.value?.name,
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
    await updateDoc(doc(db, "families", currentFamilyId.value), {
      name: newName.trim(),
      updatedAt: new Date(),
    });

    familyData.value.name = newName.trim();
    showToast("Family name updated successfully", "success");
  } catch (error) {
    console.error("Error updating family name:", error);
    showToast("Failed to update family name", "error");
  }
};

const showRelationshipSetupHelp = () => {
  showToast(
    "To setup relationships, ask members to update their profiles or contact support for assistance.",
    "info"
  );
};

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.hasFamily) {
    router.push("/family-setup");
    return;
  }

  await fetchFamilyData();
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

/* Improved mobile touch targets */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
}
</style>
