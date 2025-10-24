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
              v-if="!authStore.hasFamily"
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

    <!-- Access Denied -->
    <div
      v-else-if="!hasAccess"
      class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4"
          >
            <i class="fas fa-lock text-amber-600 text-xl"></i>
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
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-home text-sm"></i>
              Back to Dashboard
            </NuxtLink>
            <NuxtLink
              to="/join-family"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-search text-sm"></i>
              Find Families
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Admin -->
    <div
      v-else-if="!isAdmin"
      class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4"
          >
            <i class="fas fa-user-shield text-amber-600 text-xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Admin Access Required
          </h2>
          <p class="text-gray-600 mb-6">
            You need to be an admin to manage family settings and members.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              :to="`/family/${route.params.id}`"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-home text-sm"></i>
              Back to Family
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-grid text-sm"></i>
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Family</h1>
          <p class="text-gray-600 mt-2">
            Manage members and settings for {{ familyData?.name }}
          </p>
        </div>
        <NuxtLink
          :to="`/family/${route.params.id}`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Family
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Left Column - Member Management -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Member Management -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-users-cog text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">
                    Manage Members
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Add, remove, or change roles
                  </p>
                </div>
              </div>
              <span
                class="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold"
              >
                {{ familyData?.members?.length || 0 }} Members
              </span>
            </div>

            <div class="space-y-4">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200"
              >
                <div class="relative">
                  <div
                    class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"
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
                    <h4 class="font-semibold text-gray-900 truncate text-lg">
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
                  <select
                    :value="member.role"
                    @change="
                      updateMemberRole(member.userId, $event.target.value)
                    "
                    :disabled="member.userId === authStore.userId"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    v-if="member.userId !== authStore.userId"
                    @click="removeMember(member.userId)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove member"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Invite Section -->
            <div class="mt-8 pt-6 border-t border-gray-200">
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
        </div>

        <!-- Right Column - Settings -->
        <div class="space-y-8">
          <!-- Family Settings -->
          <div
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

            <div class="space-y-4">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
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
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button
                @click="showTransferOwnership = true"
                class="w-full flex items-center gap-4 p-4 text-left bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
              >
                <div
                  class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-exchange-alt text-amber-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">
                    Transfer Ownership
                  </div>
                  <div class="text-xs text-gray-500">
                    Transfer admin rights to another member
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>

              <button
                @click="showDeleteFamily = true"
                class="w-full flex items-center gap-4 p-4 text-left bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-all duration-200 hover:shadow-sm"
              >
                <div
                  class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-trash text-red-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-900">Delete Family</div>
                  <div class="text-xs text-gray-500">
                    Permanently delete this family
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>
            </div>
          </div>

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
                  <span class="font-medium text-gray-700">Admins</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  getAdminCount()
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
        </div>
      </div>
    </main>

    <!-- Transfer Ownership Modal -->
    <div
      v-if="showTransferOwnership"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Transfer Ownership
        </h3>
        <p class="text-gray-600 mb-6">
          Select a member to transfer admin rights to. You will become a regular
          member.
        </p>

        <div class="space-y-3 mb-6">
          <div
            v-for="member in familyData?.members?.filter(
              (m) => m.userId !== authStore.userId && m.role === 'member'
            )"
            :key="member.userId"
            class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
            @click="selectedNewAdmin = member.userId"
          >
            <div
              class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold"
            >
              {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">
                {{ getMemberDisplayName(member) }}
              </div>
              <div class="text-sm text-gray-500">{{ member.email }}</div>
            </div>
            <div
              class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center"
            >
              <div
                v-if="selectedNewAdmin === member.userId"
                class="w-2 h-2 bg-blue-600 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showTransferOwnership = false"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="transferOwnership"
            :disabled="!selectedNewAdmin"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Family Modal -->
    <div
      v-if="showDeleteFamily"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Delete Family
          </h3>
          <p class="text-gray-600">
            This action cannot be undone. All family data will be permanently
            deleted.
          </p>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="confirmDelete"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span class="text-sm text-red-800 font-medium">
                I understand this action cannot be undone
              </span>
            </label>
          </div>

          <div class="flex gap-3">
            <button
              @click="showDeleteFamily = false"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteFamily"
              :disabled="!confirmDelete"
              class="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Family
            </button>
          </div>
        </div>
      </div>
    </div>

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
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
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
const showTransferOwnership = ref(false);
const showDeleteFamily = ref(false);
const selectedNewAdmin = ref(null);
const confirmDelete = ref(false);

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

const updateMemberRole = async (userId, newRole) => {
  try {
    const familyRef = doc(db, "families", currentFamilyId.value);
    const updatedMembers = familyData.value.members.map((member) =>
      member.userId === userId ? { ...member, role: newRole } : member
    );

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    familyData.value.members = updatedMembers;
    showToast("Member role updated successfully", "success");
  } catch (error) {
    console.error("Error updating member role:", error);
    showToast("Failed to update member role", "error");
  }
};

const removeMember = async (userId) => {
  if (
    !confirm("Are you sure you want to remove this member from the family?")
  ) {
    return;
  }

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);
    const userRef = doc(db, "users", userId);

    // Remove from family members
    const updatedMembers = familyData.value.members.filter(
      (member) => member.userId !== userId
    );
    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Remove family from user's families
    await updateDoc(userRef, {
      [`families.${currentFamilyId.value}`]: arrayRemove(),
    });

    familyData.value.members = updatedMembers;
    showToast("Member removed successfully", "success");
  } catch (error) {
    console.error("Error removing member:", error);
    showToast("Failed to remove member", "error");
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

const transferOwnership = async () => {
  if (!selectedNewAdmin.value) return;

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);

    // Update roles in family
    const updatedMembers = familyData.value.members.map((member) => {
      if (member.userId === selectedNewAdmin.value) {
        return { ...member, role: "admin" };
      } else if (member.userId === authStore.userId) {
        return { ...member, role: "member" };
      }
      return member;
    });

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Update user documents
    const currentUserRef = doc(db, "users", authStore.userId);
    const newAdminRef = doc(db, "users", selectedNewAdmin.value);

    await updateDoc(currentUserRef, {
      [`families.${currentFamilyId.value}.role`]: "member",
    });

    await updateDoc(newAdminRef, {
      [`families.${currentFamilyId.value}.role`]: "admin",
    });

    familyData.value.members = updatedMembers;
    showTransferOwnership.value = false;
    selectedNewAdmin.value = null;
    showToast("Ownership transferred successfully", "success");

    // Refresh auth store to get updated role
    await authStore.initAuth();
  } catch (error) {
    console.error("Error transferring ownership:", error);
    showToast("Failed to transfer ownership", "error");
  }
};

const deleteFamily = async () => {
  if (!confirmDelete.value) return;

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);

    // Remove family from all members
    const updatePromises = familyData.value.members.map(async (member) => {
      const userRef = doc(db, "users", member.userId);
      await updateDoc(userRef, {
        [`families.${currentFamilyId.value}`]: arrayRemove(),
      });
    });

    await Promise.all(updatePromises);
    await deleteDoc(familyRef);

    showToast("Family deleted successfully", "success");
    showDeleteFamily.value = false;

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Error deleting family:", error);
    showToast("Failed to delete family", "error");
  }
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
  title: computed(() => `Manage - ${familyData.value?.name || "Family"}`),
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
