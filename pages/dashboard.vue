<template>
  <div class="space-y-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading"
        class="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 z-50 flex items-center justify-center">
        <div class="text-center">
          <div class="relative w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 border-3 border-blue-200 dark:border-blue-700 rounded-full"></div>
            <div
              class="absolute inset-0 border-3 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin">
            </div>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Loading FamilySpace
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">Please wait...</p>
        </div>
      </div>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <!-- Header Section -->
        <div class="text-center space-y-4 py-6">
          <div class="flex flex-wrap items-center justify-center gap-3">
            <div class="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-orange-200">
              <i class="fas fa-home text-orange-500 text-sm"></i>
              <span class="text-sm font-medium text-gray-700">{{
                authStore.currentFamilyName || "Your Family Space"
              }}</span>
            </div>

            <!-- Family Selector -->
            <div v-if="
              authStore.hasFamily && Object.keys(authStore.families).length > 1
            " class="relative">
              <select v-model="selectedFamilyId" @change="switchFamily"
                class="px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors appearance-none text-sm font-medium text-gray-700 cursor-pointer pr-8">
                <option v-for="familyId in Object.keys(authStore.families)" :key="familyId" :value="familyId">
                  {{ getFamilyName(familyId) }}
                </option>
              </select>
              <i
                class="fas fa-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>

            <NuxtLink to="/profile"
              class="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <i class="fas fa-user text-gray-600 text-sm"></i>
              <span class="text-sm font-medium text-gray-700">Profile</span>
            </NuxtLink>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Home!
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {{ getGreeting() }}
          </p>
        </div>

        <!-- Pending Join Request -->
        <div v-if="hasPendingJoinRequest" class="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="fas fa-clock text-white text-lg"></i>
            </div>
            <div class="text-center sm:text-left flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Join Request Pending
              </h3>
              <p class="text-gray-700 text-sm mb-3">
                Your request to join <strong>{{ pendingFamilyName }}</strong> is
                pending approval.
              </p>
              <div class="flex flex-col sm:flex-row gap-2">
                <button @click="checkRequestStatus" :disabled="checkingStatus"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm">
                  <i v-if="checkingStatus" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-sync-alt"></i>
                  {{ checkingStatus ? "Checking..." : "Check Status" }}
                </button>
                <button @click="cancelJoinRequest" :disabled="cancelingRequest"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors border border-gray-300 disabled:opacity-50 text-sm">
                  <i v-if="cancelingRequest" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-times"></i>
                  {{ cancelingRequest ? "Canceling..." : "Cancel Request" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Family Prompt -->
        <div v-if="!authStore.hasFamily && !hasPendingJoinRequest"
          class="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <div class="text-center sm:text-left flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                Start Your Family Space
              </h3>
              <p class="text-gray-700 text-sm mb-3">
                Create a new family or join an existing one to get started.
              </p>
              <div class="flex flex-col sm:flex-row gap-2">
                <NuxtLink to="/family-setup"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded hover:bg-amber-700 transition-colors text-sm">
                  <i class="fas fa-users"></i>
                  Create Family
                </NuxtLink>
                <button @click="skipFamilySetup"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors border border-gray-300 text-sm">
                  <i class="fas fa-arrow-right"></i>
                  Continue Without Family
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Join Requests for Admin -->
        <div v-if="authStore.isAdmin && joinRequests.length > 0"
          class="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-user-plus text-white"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Join Requests</h3>
              <p class="text-gray-600 text-sm">
                Approve or deny family join requests
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="request in joinRequests" :key="request.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">
                  {{ request.name || request.email }}
                </p>
                <p class="text-gray-500 text-xs">{{ request.email }}</p>
                <p class="text-blue-600 text-xs">
                  {{ formatTimeAgo(request.requestedAt) }}
                </p>
              </div>
              <div class="flex gap-2">
                <button @click="
                  approveRequest(request.id, request.userId, request.email)
                  "
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium">
                  Approve
                </button>
                <button @click="denyRequest(request.id)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div v-if="authStore.hasFamily" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4">
            <div class="flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-calendar-day text-white text-sm sm:text-base"></i>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ todaysEventsCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm font-medium">
                  Today's Plans
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4">
            <div class="flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-birthday-cake text-white text-sm sm:text-base"></i>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ upcomingBirthdaysCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm font-medium">
                  Upcoming Birthdays
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4">
            <div class="flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-comment-dots text-white text-sm sm:text-base"></i>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ unreadMessagesCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm font-medium">
                  New Messages
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4">
            <div class="flex flex-col items-center text-center gap-2">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <i class="fas fa-users text-white text-sm sm:text-base"></i>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ familyMembers.length }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm font-medium">
                  Family Members
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Upcoming Events -->
            <div v-if="authStore.hasFamily && authStore.status === 'active'"
              class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-calendar-check text-blue-500"></i>
                  <span>What's Coming Up</span>
                </h2>
                <NuxtLink to="/calendar"
                  class="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-sm">
                  View Calendar
                  <i class="fas fa-arrow-right text-xs"></i>
                </NuxtLink>
              </div>

              <div v-if="upcomingEvents.length > 0" class="space-y-3">
                <div v-for="event in upcomingEvents.slice(0, 4)" :key="event.id"
                  class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div
                    class="w-12 h-12 bg-blue-500 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white">
                    <span class="text-lg font-bold">{{
                      new Date(event.startDate).getDate()
                    }}</span>
                    <span class="text-xs font-medium">{{
                      new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                      {{ event.title }}
                    </p>
                    <p class="text-gray-600 text-xs flex items-center gap-1">
                      <i class="fas fa-clock text-xs"></i>
                      {{ formatEventDate(event.startDate) }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <i class="fas fa-calendar-plus text-gray-300 text-3xl mb-3"></i>
                <p class="text-gray-500 text-sm mb-3">No upcoming events yet</p>
                <NuxtLink to="/calendar"
                  class="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors text-sm">
                  Add Your First Event
                </NuxtLink>
              </div>
            </div>

            <!-- Recent Messages -->
            <div v-if="authStore.hasFamily && recentConversations.length > 0"
              class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-comments text-purple-500"></i>
                  <span>Family Chats</span>
                </h2>
                <NuxtLink to="/messages"
                  class="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 rounded hover:bg-purple-100 transition-colors text-sm">
                  View All
                  <i class="fas fa-arrow-right text-xs"></i>
                </NuxtLink>
              </div>

              <div class="space-y-2">
                <div v-for="conversation in recentConversations.slice(0, 3)" :key="conversation.userId"
                  class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                  @click="goToConversation(conversation.userId)">
                  <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-medium text-sm">
                      {{
                        conversation.name
                          ? conversation.name.charAt(0).toUpperCase()
                          : "?"
                      }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <p class="font-medium text-gray-900 text-sm truncate">
                        {{ conversation.name }}
                      </p>
                      <span class="text-gray-500 text-xs bg-white px-2 py-1 rounded">
                        {{ formatTimeAgo(conversation.lastMessageTime) }}
                      </span>
                    </div>
                    <p class="text-gray-600 text-xs truncate">
                      {{ conversation.lastMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Family Circle -->
            <div v-if="authStore.hasFamily" class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-users text-indigo-600"></i>
                  Our Family
                </h2>
                <span class="text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                  {{ familyMembers.length }} members
                </span>
              </div>

              <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
                <div v-for="member in familyMembers" :key="member.userId"
                  class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                  @click="goToUserProfile(member.userId)">
                  <div class="relative w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-white font-medium text-xs">
                      {{
                        member.name ? member.name.charAt(0).toUpperCase() : "?"
                      }}
                    </span>
                    <div v-if="member.role === 'admin'"
                      class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                      <i class="fas fa-crown text-white text-[6px]"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 text-sm truncate">
                      {{ member.name || member.email }}
                    </p>
                    <p class="text-gray-500 text-xs capitalize">
                      {{ member.role }}
                    </p>
                  </div>
                </div>
              </div>

              <NuxtLink :to="`/family/${authStore.currentFamilyId}`"
                class="block w-full py-2 px-3 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium text-center transition-colors text-sm">
                View Family
              </NuxtLink>
            </div>

            <!-- Birthday Progress -->
            <div v-if="authStore.hasFamily" class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-birthday-cake text-purple-500"></i>
                Birthday Setup
              </h3>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 text-sm">Profiles Complete</span>
                  <span class="font-semibold text-purple-600">
                    {{ membersWithBirthdays.length }}/{{ familyMembers.length }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div class="bg-purple-500 h-2 rounded-full transition-all duration-500" :style="{
                    width: `${familyMembers.length > 0
                      ? (membersWithBirthdays.length / familyMembers.length) *
                      100
                      : 0
                      }%`,
                  }"></div>
                </div>
                <p class="text-gray-600 text-xs text-center">
                  {{
                    familyMembers.length > 0
                      ? Math.round(
                        (membersWithBirthdays.length / familyMembers.length) *
                        100
                      )
                      : 0
                  }}% of family birthdays added
                </p>
              </div>
            </div>

            <!-- Admin Invite -->
            <div v-if="authStore.isAdmin && authStore.hasFamily"
              class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i class="fas fa-user-plus text-emerald-600"></i>
                Invite Family Members
              </h3>

              <p class="text-gray-600 text-sm mb-4">
                Share an invite link with your family
              </p>

              <button @click="generateInviteLink" :disabled="generatingInvite"
                class="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors disabled:opacity-50 text-sm">
                <i class="fas fa-link mr-2" :class="{ 'animate-spin': generatingInvite }"></i>
                {{
                  generatingInvite ? "Creating Link..." : "Generate Invite Link"
                }}
              </button>

              <div v-if="inviteLink" class="mt-3 p-3 bg-gray-50 rounded-lg border">
                <input type="text" :value="inviteLink" readonly
                  class="w-full text-xs px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:ring-emerald-500 font-mono"
                  @click="$event.target.select()" />
                <button @click="copyInviteLink"
                  class="w-full mt-2 px-3 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition-colors text-sm">
                  <i class="fas fa-copy mr-2"></i>
                  {{ copyButtonText }}
                </button>
              </div>
            </div>

            <!-- Help Card -->
            <div class="bg-white dark:bg-stone-800 rounded-xl border border-gray-200 dark:border-stone-700 p-4 sm:p-6">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-question-circle text-blue-600"></i>
                Need Help?
              </h3>

              <div class="space-y-2">
                <NuxtLink to="/help"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <i class="fas fa-book text-white text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">Guide</p>
                    <p class="text-gray-500 text-xs">Learn the basics</p>
                  </div>
                </NuxtLink>

                <NuxtLink to="/support"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <i class="fas fa-headset text-white text-sm"></i>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">Support</p>
                    <p class="text-gray-500 text-xs">We're here to help</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Toast Notification -->
      <div v-if="showToastMessage" class="fixed top-4 right-4 z-50 max-w-sm w-full px-4">
        <div class="p-3 rounded-lg shadow-md border" :class="{
          'bg-green-50 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50 text-red-800 border-red-200': toastType === 'error',
        }">
          <div class="flex items-center gap-2">
            <i class="text-sm" :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"></i>
            <p class="font-medium text-sm flex-1">{{ toastMessage }}</p>
            <button @click="showToastMessage = false" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
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
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { generateInvite, getEventsByRange } from "~/utils/firebase";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();

// State
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const isLoading = ref(true);
const events = ref([]);
const recentConversations = ref([]);
const selectedFamilyId = ref(authStore.currentFamilyId);
const hasPendingJoinRequest = ref(false);
const pendingFamilyId = ref("");
const pendingFamilyName = ref("");
const checkingStatus = ref(false);
const cancelingRequest = ref(false);
const joinRequests = ref([]);

// Computed
const familyMembers = computed(() => authStore.familyMembers || []);
const membersWithBirthdays = computed(() =>
  familyMembers.value.filter((member) => member.birthday)
);

const upcomingEvents = computed(() => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return events.value
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= now && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
});

const todaysEventsCount = computed(() => {
  const today = new Date().toDateString();
  return events.value.filter(
    (event) => new Date(event.startDate).toDateString() === today
  ).length;
});

const upcomingBirthdaysCount = computed(() => {
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  return familyMembers.value.filter((member) => {
    if (!member.birthday) return false;
    const birthday = new Date(member.birthday);
    const now = new Date();
    const nextBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );

    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    return nextBirthday <= next30Days;
  }).length;
});

const unreadMessagesCount = computed(() => {
  return recentConversations.value.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );
});

// Functions
const getGreeting = () => {
  const hour = new Date().getHours();
  const name = authStore.name || "there";

  if (hour < 12) return `Good morning, ${name}! ☀️`;
  if (hour < 18) return `Good afternoon, ${name}! 🌤️`;
  return `Good evening, ${name}! 🌙`;
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Never";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatEventDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getFamilyName = (familyId) => {
  const familyData = authStore.families[familyId];

  if (familyData) {
    return familyData.name || "Unknown Family";
  }

  // Fallback for current family
  if (familyId === authStore.currentFamilyId) {
    return authStore.currentFamilyName || "Family";
  }

  return "Family";
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

const refreshEvents = async () => {
  if (!authStore.currentFamilyId) return;
  try {
    const now = new Date();
    const start = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1
    ).toISOString();
    const end = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      0
    ).toISOString();
    const calendarEvents = await getEventsByRange(
      authStore.currentFamilyId,
      start,
      end
    );
    const birthdayEvents = generateBirthdayEvents();
    events.value = [...calendarEvents, ...birthdayEvents];
  } catch (error) {
    console.error("Error refreshing events:", error);
    showToast("Failed to load calendar stats", "error");
  }
};

const generateBirthdayEvents = () => {
  const birthdayEvents = [];
  const currentYear = new Date().getFullYear();

  familyMembers.value.forEach((member) => {
    if (member.birthday) {
      try {
        const birthday = new Date(member.birthday);
        if (isNaN(birthday.getTime())) return;

        for (let year = currentYear; year <= currentYear + 1; year++) {
          const eventDate = new Date(
            year,
            birthday.getMonth(),
            birthday.getDate()
          );
          if (isNaN(eventDate.getTime())) continue;

          birthdayEvents.push({
            id: `birthday-${member.userId}-${year}`,
            title: `${member.name || member.email}'s Birthday`,
            startDate: eventDate.toISOString(),
            endDate: eventDate.toISOString(),
            eventType: "birthday",
            color: "pink",
            extendedProps: {
              isBirthday: true,
              memberId: member.userId,
              memberName: member.name || member.email,
            },
          });
        }
      } catch (error) {
        console.error(
          `Error processing birthday for member ${member.userId}:`,
          error
        );
      }
    }
  });

  return birthdayEvents;
};

const generateInviteLink = async () => {
  if (!authStore.isAdmin) {
    showToast("Only admins can generate invite links", "error");
    return;
  }
  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      authStore.currentFamilyId,
      authStore.currentFamilyName,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
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
    setTimeout(() => {
      copyButtonText.value = "Copy";
    }, 2000);
  } catch (error) {
    console.error("Error copying invite link:", error);
    showToast("Failed to copy invite link", "error");
  }
};

const goToUserProfile = (userId) => {
  router.push(`/user/${userId}`);
};

const goToConversation = (userId) => {
  router.push(`/messages/${userId}`);
};

const fetchRecentConversations = async () => {
  if (!authStore.currentFamilyId) return;

  try {
    const { getAllConversations } = await import("~/utils/firebase");
    recentConversations.value = await getAllConversations();
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const switchFamily = async () => {
  try {
    await authStore.setCurrentFamily(selectedFamilyId.value);
    await authStore.loadFamilyMembers();
    await refreshEvents();
    await fetchRecentConversations();
    await fetchJoinRequests();
    showToast(`Switched to ${authStore.currentFamilyName}`, "success");
  } catch (error) {
    console.error("Error switching family:", error);
    showToast("Failed to switch family", "error");
  }
};

const skipFamilySetup = () => {
  router.push("/dashboard");
};

// Join Request Functions
const checkRequestStatus = async () => {
  checkingStatus.value = true;
  try {
    if (!pendingFamilyId.value) {
      showToast("No pending request found", "error");
      return;
    }

    const familyDoc = await getDoc(doc(db, "families", pendingFamilyId.value));
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const isMember = familyData.members?.some(
        (member) => member.userId === authStore.userId
      );

      if (isMember) {
        // Update user's families map for multi-family support
        await updateDoc(doc(db, "users", authStore.userId), {
          [`families.${pendingFamilyId.value}`]: {
            membershipType: "core",
            role: "member",
          },
          status: "active",
          updatedAt: new Date(),
        });

        // Refresh auth store
        await authStore.initAuth();
        hasPendingJoinRequest.value = false;

        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );
      } else {
        showToast("Your request is still pending approval.", "error");
      }
    }
  } catch (error) {
    console.error("Error checking request status:", error);
    showToast("Failed to check request status", "error");
  } finally {
    checkingStatus.value = false;
  }
};

const cancelJoinRequest = async () => {
  if (
    !confirm(
      "Are you sure you want to cancel your join request? You'll need to request to join again if you change your mind."
    )
  ) {
    return;
  }

  cancelingRequest.value = true;
  try {
    const requestsQuery = query(
      collection(db, `families/${pendingFamilyId.value}/requests`),
      where("userId", "==", authStore.userId)
    );
    const querySnapshot = await getDocs(requestsQuery);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    hasPendingJoinRequest.value = false;
    pendingFamilyId.value = "";
    pendingFamilyName.value = "";

    showToast("Join request canceled successfully", "success");
  } catch (error) {
    console.error("Error canceling join request:", error);
    showToast("Failed to cancel join request", "error");
  } finally {
    cancelingRequest.value = false;
  }
};

const fetchJoinRequests = async () => {
  if (authStore.isAdmin && authStore.currentFamilyId) {
    try {
      const querySnapshot = await getDocs(
        collection(db, `families/${authStore.currentFamilyId}/requests`)
      );
      joinRequests.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching join requests:", error);
      showToast("Failed to fetch join requests", "error");
    }
  }
};

const approveRequest = async (requestId, userId, email, relationship) => {
  try {
    await updateDoc(doc(db, "families", authStore.currentFamilyId), {
      members: arrayUnion({
        userId,
        role: "member",
        email,
        relationship: relationship,
      }),
    });

    // Update user's families map
    await updateDoc(doc(db, "users", userId), {
      [`families.${authStore.currentFamilyId}`]: {
        membershipType: "core",
        role: "member",
      },
      status: "active",
    });

    await deleteDoc(
      doc(db, `families/${authStore.currentFamilyId}/requests`, requestId)
    );

    await fetchJoinRequests();
    await authStore.loadFamilyMembers();

    showToast("Request approved successfully", "success");
  } catch (error) {
    console.error("Error approving request:", error);
    showToast("Failed to approve request: " + error.message, "error");
  }
};

const denyRequest = async (requestId) => {
  try {
    await deleteDoc(
      doc(db, `families/${authStore.currentFamilyId}/requests`, requestId)
    );
    await fetchJoinRequests();
    showToast("Request denied successfully", "success");
  } catch (error) {
    console.error("Error denying request:", error);
    showToast("Failed to deny request", "error");
  }
};

// Check for pending join requests
const checkPendingRequests = async () => {
  try {
    // Check if user has any pending join requests
    const userDoc = await getDoc(doc(db, "users", authStore.userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // For now, we'll check if user has any pending requests in any family
      // This is a simplified approach - you might want to store pending request info in user document
      const families = Object.keys(authStore.families || {});
      if (families.length === 0) {
        // User has no families, check if they have pending requests
        // This would require storing pending request info in user document
        // For now, we'll assume no pending requests if no families
        hasPendingJoinRequest.value = false;
      } else {
        hasPendingJoinRequest.value = false;
      }
    }
  } catch (error) {
    console.error("Error checking pending requests:", error);
  }
};

onMounted(async () => {
  try {
    await authStore.initAuth();
    if (!authStore.isInitialized) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (authStore.hasFamily) {
      await authStore.loadFamilyMembers();
      await refreshEvents();
      await fetchRecentConversations();
      await fetchJoinRequests();
    }

    await checkPendingRequests();
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    showToast("Failed to load dashboard", "error");
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "FamilySpace - Dashboard",
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
