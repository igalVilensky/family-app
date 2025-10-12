<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
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
      <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4"
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
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-plus text-sm"></i>
              Set Up Family
            </NuxtLink>
            <button
              @click="fetchFamilyData"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-redo text-sm"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-8">
      <!-- Family Header Card -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 mb-8"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-6"
          >
            <i class="fas fa-home text-white text-3xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            {{ familyData?.name || "Your Family" }}
          </h2>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
            A private space for your family to connect and share memories
          </p>
          <div
            class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500"
          >
            <div
              class="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full"
            >
              <i class="fas fa-users text-blue-600"></i>
              <span class="font-medium text-gray-700"
                >{{ familyData?.members?.length || 0 }} Members</span
              >
            </div>
            <div
              class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full"
            >
              <i class="fas fa-calendar text-green-600"></i>
              <span class="font-medium text-gray-700"
                >Created {{ formatDate(familyData?.createdAt) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Family Members -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-users text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">
                    Family Members
                  </h3>
                  <p class="text-gray-500 text-sm">Your family circle</p>
                </div>
              </div>
              <span
                class="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold"
              >
                {{ familyData?.members?.length || 0 }}
              </span>
            </div>

            <div class="space-y-4">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm cursor-pointer group"
                @click="goToUserProfile(member.userId)"
              >
                <div class="relative">
                  <div
                    class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-600 group-hover:to-purple-700 transition-all"
                  >
                    <span class="text-white font-semibold text-lg">
                      {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div
                    v-if="member.userId === authStore.userId"
                    class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <i class="fas fa-check text-white text-xs"></i>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h4
                      class="font-semibold text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors"
                    >
                      {{ getMemberDisplayName(member) }}
                    </h4>
                    <span
                      v-if="member.userId === authStore.userId"
                      class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      You
                    </span>
                  </div>
                  <p class="text-gray-600 truncate text-sm">
                    {{ member.email }}
                  </p>
                </div>

                <div class="flex items-center gap-3 flex-shrink-0">
                  <span
                    class="px-4 py-2 text-sm font-semibold rounded-xl"
                    :class="{
                      'bg-gradient-to-r from-purple-500 to-indigo-600 text-white':
                        member.role === 'admin',
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
                  <i
                    class="fas fa-chevron-right text-gray-400 text-sm group-hover:text-blue-500 transition-colors"
                  ></i>
                </div>
              </div>
            </div>

            <!-- Invite Section (Parents Only) -->
            <div
              v-if="authStore.permissions.role === 'admin'"
              class="mt-8 pt-6 border-t border-gray-200"
            >
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-user-plus text-white text-lg"></i>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">
                    Invite Members
                  </h4>
                  <p class="text-gray-500 text-sm">
                    Share invite link with family
                  </p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="generatingInvite"
              >
                <i
                  class="fas fa-link text-sm"
                  :class="{ 'animate-spin': generatingInvite }"
                ></i>
                {{
                  generatingInvite ? "Generating..." : "Generate Invite Link"
                }}
              </button>

              <div
                v-if="inviteLink"
                class="mt-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
              >
                <label class="block text-sm font-semibold text-purple-900 mb-3">
                  Share this invite link:
                </label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="flex-1 px-4 py-3 border border-purple-300 rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    <i class="fas fa-copy text-sm"></i>
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Coming Soon Banner -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8"
          >
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4"
              >
                <i class="fas fa-rocket text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-semibold text-gray-900 mb-3">
                More Features Coming Soon!
              </h3>
              <p class="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
                We're working on exciting features like shared photo albums,
                family calendars, group chats, and memory timelines to make your
                family experience even better.
              </p>
              <div
                class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
              >
                <div
                  class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <i class="fas fa-images text-blue-500 text-lg"></i>
                  <span class="font-medium">Photo Albums</span>
                </div>
                <div
                  class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <i class="fas fa-calendar-alt text-green-500 text-lg"></i>
                  <span class="font-medium">Shared Calendar</span>
                </div>
                <div
                  class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <i class="fas fa-history text-purple-500 text-lg"></i>
                  <span class="font-medium">Memory Timeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-8">
          <!-- Family Stats -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-chart-bar text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Family Stats
                </h3>
                <p class="text-gray-500 text-sm">Overview</p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-users text-blue-600"></i>
                  </div>
                  <span class="font-medium text-gray-700">Total Members</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  familyData?.members?.length || 0
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-user-shield text-purple-600"></i>
                  </div>
                  <span class="font-medium text-gray-700">Parents</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  getParentCount()
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-user text-green-600"></i>
                  </div>
                  <span class="font-medium text-gray-700">Members</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  getMemberCount()
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-amber-50 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-calendar text-amber-600"></i>
                  </div>
                  <span class="font-medium text-gray-700">Created</span>
                </div>
                <span class="text-sm font-bold text-gray-900">{{
                  formatDate(familyData?.createdAt)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-bolt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <p class="text-gray-500 text-sm">Family tools</p>
              </div>
            </div>

            <div class="space-y-3">
              <NuxtLink
                to="/calendar"
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 group hover:shadow-sm cursor-pointer"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-calendar-alt text-blue-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">View Calendar</div>
                  <div class="text-xs text-gray-500">See upcoming events</div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"
                ></i>
              </NuxtLink>

              <button
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 group"
                disabled
              >
                <div
                  class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-photo-video text-gray-400 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-400">Share Memories</div>
                  <div class="text-xs text-gray-400">Coming soon</div>
                </div>
                <i
                  class="fas fa-lock text-gray-300 group-hover:text-gray-400"
                ></i>
              </button>

              <button
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 group"
                disabled
              >
                <div
                  class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-comments text-gray-400 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-400">Family Chat</div>
                  <div class="text-xs text-gray-400">Coming soon</div>
                </div>
                <i
                  class="fas fa-lock text-gray-300 group-hover:text-gray-400"
                ></i>
              </button>
            </div>
          </div>

          <!-- Settings (Parents Only) -->
          <div
            v-if="authStore.permissions.role === 'admin'"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-cog text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Family Settings
                </h3>
                <p class="text-gray-500 text-sm">Manage your family</p>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 group hover:shadow-sm"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-edit text-blue-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">
                    Edit Family Name
                  </div>
                  <div class="text-xs text-gray-500">
                    Update family display name
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-gray-600"
                ></i>
              </button>

              <NuxtLink
                :to="`/family/manage/${route.params.id}`"
                class="w-full flex items-center gap-4 p-4 text-left bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-200 group hover:shadow-sm"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-blue-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">Manage Members</div>
                  <div class="text-xs text-gray-500">
                    Add, remove, or change roles
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500"
                ></i>
              </NuxtLink>
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

// Add this method for navigation to user profiles
const goToUserProfile = (userId) => {
  if (userId === authStore.userId) {
    router.push("/profile"); // Goes to editable profile page
  } else {
    router.push(`/user/${userId}`); // Goes to view-only profile page
  }
};

const generateInviteLink = async () => {
  if (authStore.permissions.role !== "admin") {
    showToast("Only admins can generate invite links", "error");
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
