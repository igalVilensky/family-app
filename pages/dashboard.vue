<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Loading your dashboard...
        </h2>
        <p class="text-gray-600">Please wait a moment</p>
      </div>
    </div>

    <!-- Main Content -->
    <main
      class="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8"
    >
      <!-- Welcome Section -->
      <DashboardHeading />

      <!-- Pending Join Request Alert -->
      <div
        v-if="hasPendingJoinRequest && !authStore.familyId"
        class="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 animate-fadeIn"
      >
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div
            class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="fas fa-clock text-amber-600 text-xl"></i>
          </div>
          <div class="text-center sm:text-left flex-1">
            <h3 class="text-base md:text-lg font-semibold text-amber-900 mb-1">
              Join Request Pending
            </h3>
            <p class="text-amber-700 text-sm mb-4">
              Your request to join <strong>{{ pendingFamilyName }}</strong> is
              waiting for admin approval.
            </p>
            <div class="flex flex-col sm:flex-row gap-2">
              <button
                @click="checkRequestStatus"
                :disabled="checkingStatus"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50"
              >
                <i
                  class="fas fa-sync-alt"
                  :class="{ 'animate-spin': checkingStatus }"
                ></i>
                {{ checkingStatus ? "Checking..." : "Check Status" }}
              </button>
              <button
                @click="cancelJoinRequest"
                :disabled="cancelingRequest"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <i
                  class="fas fa-times"
                  :class="{ 'animate-spin': cancelingRequest }"
                ></i>
                {{ cancelingRequest ? "Canceling..." : "Cancel Request" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid - Compact on Mobile -->
      <div
        v-if="authStore.familyId"
        class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
      >
        <!-- Today's Events -->
        <div
          class="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200/60 p-4 md:p-6"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs md:text-sm text-gray-600">Today's Events</p>
            <i class="fas fa-calendar text-blue-500 text-base md:text-lg"></i>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">
            {{ todaysEventsCount }}
          </p>
        </div>

        <!-- Upcoming Birthdays -->
        <div
          class="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200/60 p-4 md:p-6"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs md:text-sm text-gray-600">Next 30 Days</p>
            <i
              class="fas fa-birthday-cake text-pink-500 text-base md:text-lg"
            ></i>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">
            {{ upcomingBirthdaysCount }}
          </p>
        </div>

        <!-- Unread Messages -->
        <div
          class="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200/60 p-4 md:p-6"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs md:text-sm text-gray-600">Messages</p>
            <i class="fas fa-envelope text-purple-500 text-base md:text-lg"></i>
          </div>
          <p class="text-2xl md:text-3xl font-bold text-gray-900">
            {{ unreadMessagesCount }}
          </p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Left Column: Events & Messages -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          <!-- Upcoming Events -->
          <div
            v-if="authStore.familyId && authStore.status === 'active'"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg md:text-2xl font-bold text-gray-900">
                <i class="fas fa-calendar-check text-blue-500 mr-3"></i>Upcoming
              </h2>
              <NuxtLink
                to="/calendar"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View all
                <i class="fas fa-arrow-right text-xs"></i>
              </NuxtLink>
            </div>

            <div v-if="upcomingEvents.length > 0" class="space-y-3">
              <div
                v-for="(event, idx) in upcomingEvents.slice(0, 4)"
                :key="event.id"
                class="flex items-start gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold text-blue-600"
                >
                  {{ new Date(event.startDate).getDate() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-medium text-gray-900 text-sm md:text-base truncate"
                  >
                    {{ event.title }}
                  </p>
                  <p class="text-xs md:text-sm text-gray-500">
                    {{ formatEventDate(event.startDate) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500 text-sm">No upcoming events</p>
            </div>
          </div>

          <!-- Recent Messages -->
          <div
            v-if="authStore.familyId && recentConversations.length > 0"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg md:text-2xl font-bold text-gray-900">
                <i class="fas fa-comments text-purple-500 mr-3"></i>Messages
              </h2>
              <NuxtLink
                to="/messages"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View all
                <i class="fas fa-arrow-right text-xs"></i>
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="conversation in recentConversations.slice(0, 3)"
                :key="conversation.userId"
                class="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                @click="goToConversation(conversation.userId)"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                >
                  <img
                    v-if="conversation.avatarUrl"
                    :src="conversation.avatarUrl"
                    :alt="conversation.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xs font-bold text-blue-600">
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
                    <span class="text-xs text-gray-500 flex-shrink-0">
                      {{ formatTimeAgo(conversation.lastMessageTime) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 truncate">
                    {{ conversation.lastMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Family & Setup -->
        <div class="space-y-6 md:space-y-8">
          <!-- Family Members -->
          <div
            v-if="authStore.familyId"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg md:text-2xl font-bold text-gray-900">
                <i class="fas fa-users text-indigo-500 mr-2"></i>Family
              </h2>
              <span
                class="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
              >
                {{ familyMembers.length }}
              </span>
            </div>

            <div class="space-y-2 mb-6">
              <div
                v-for="member in familyMembers.slice(0, 5)"
                :key="member.userId"
                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                @click="goToUserProfile(member.userId)"
              >
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0"
                >
                  {{ member.name ? member.name.charAt(0).toUpperCase() : "?" }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ member.name || member.email }}
                  </p>
                  <p
                    v-if="member.role"
                    class="text-xs text-gray-500 capitalize"
                  >
                    {{ member.role }}
                  </p>
                </div>
              </div>
            </div>

            <NuxtLink
              :to="`/family/${authStore.familyId}`"
              class="w-full py-2 px-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium text-center transition-colors"
            >
              View All Members
            </NuxtLink>
          </div>

          <!-- Birthday Setup Progress -->
          <div
            v-if="authStore.familyId"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>Birthday
              Setup
            </h3>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700">Profiles Complete</span>
                <span class="text-sm font-bold text-gray-900">
                  {{ membersWithBirthdays.length }}/{{ familyMembers.length }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width: `${
                      familyMembers.length > 0
                        ? (membersWithBirthdays.length / familyMembers.length) *
                          100
                        : 0
                    }%`,
                  }"
                ></div>
              </div>
              <p class="text-xs text-gray-600 text-center">
                {{
                  familyMembers.length > 0
                    ? Math.round(
                        (membersWithBirthdays.length / familyMembers.length) *
                          100
                      )
                    : 0
                }}% complete
              </p>
            </div>
          </div>

          <!-- Admin Invite Section -->
          <div
            v-if="authStore.permissions.role === 'admin' && authStore.familyId"
            class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6 md:p-8"
          >
            <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4">
              <i class="fas fa-user-plus text-purple-600 mr-2"></i>Invite
              Members
            </h3>

            <button
              @click="generateInviteLink"
              :disabled="generatingInvite"
              class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-sm disabled:opacity-50"
            >
              <i
                class="fas fa-link mr-2"
                :class="{ 'animate-spin': generatingInvite }"
              ></i>
              {{ generatingInvite ? "Generating..." : "Generate Invite" }}
            </button>

            <div v-if="inviteLink" class="mt-4 p-3 bg-white rounded-lg">
              <input
                type="text"
                :value="inviteLink"
                readonly
                class="w-full text-xs px-2 py-2 border border-gray-300 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-purple-500"
                @click="$event.target.select()"
              />
              <button
                @click="copyInviteLink"
                class="w-full mt-2 px-3 py-2 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-all"
              >
                <i class="fas fa-copy mr-1"></i>
                {{ copyButtonText }}
              </button>
            </div>
          </div>

          <!-- Join Requests Badge -->
          <div
            v-if="
              authStore.permissions.role === 'admin' &&
              authStore.familyId &&
              joinRequests.length
            "
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base md:text-lg font-bold text-gray-900">
                <i class="fas fa-inbox text-amber-500 mr-2"></i>Requests
              </h3>
              <span
                class="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium"
              >
                {{ joinRequests.length }}
              </span>
            </div>

            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                v-for="request in joinRequests"
                :key="request.id"
                class="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ request.email }}
                </p>
                <div class="flex gap-2">
                  <button
                    @click="
                      approveRequest(request.id, request.userId, request.email)
                    "
                    class="flex-1 px-2 py-1.5 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    @click="denyRequest(request.id)"
                    class="flex-1 px-2 py-1.5 bg-red-600 text-white text-xs rounded font-medium hover:bg-red-700 transition-all"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Help & Support -->
          <div
            class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 md:p-8"
          >
            <h3 class="text-base md:text-lg font-bold text-gray-900 mb-4">
              <i class="fas fa-circle-question text-blue-600 mr-2"></i>Help &
              Support
            </h3>

            <div class="space-y-3">
              <NuxtLink
                to="/help"
                class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                <i class="fas fa-book text-blue-600 text-lg"></i>
                <div>
                  <p class="text-sm font-medium text-gray-900">Documentation</p>
                  <p class="text-xs text-gray-500">
                    Learn how to use FamilySpace
                  </p>
                </div>
              </NuxtLink>
              <NuxtLink
                to="/support"
                class="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                <i class="fas fa-headset text-blue-600 text-lg"></i>
                <div>
                  <p class="text-sm font-medium text-gray-900">Support</p>
                  <p class="text-xs text-gray-500">Get help from our team</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <ToastNotification
      :show="showToastMessage"
      :message="toastMessage"
      :type="toastType"
      @hide="showToastMessage = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { generateInvite, getEventsByRange } from "~/utils/firebase";
import DashboardHeading from "~/components/dashboard/DashboardHeading.vue";

const ToastNotification = {
  props: ["show", "message", "type"],
  emits: ["hide"],
  template: `
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200': type === 'success',
          'bg-red-50/95 text-red-800 border-red-200': type === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': type === 'success',
              'fas fa-exclamation-circle text-red-500': type === 'error',
            }"
          ></i>
          <p class="font-medium flex-1">{{ message }}</p>
          <button @click="emit('hide')" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
};

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();
const joinRequests = ref([]);
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const hasPendingJoinRequest = ref(false);
const pendingFamilyName = ref("");
const pendingFamilyId = ref("");
const checkingStatus = ref(false);
const cancelingRequest = ref(false);
const isLoading = ref(true);
const events = ref([]);
const recentConversations = ref([]);

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
  if (!authStore.familyId) return;
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
      authStore.familyId,
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
            allDay: true,
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
        await updateDoc(doc(db, "users", authStore.userId), {
          status: "active",
          updatedAt: new Date(),
        });

        authStore.status = "active";
        hasPendingJoinRequest.value = false;

        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );

        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: null,
      familyName: null,
      status: null,
      updatedAt: new Date(),
    });

    authStore.familyId = null;
    authStore.familyName = null;
    authStore.status = null;
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
  if (authStore.permissions.role === "admin" && authStore.familyId) {
    try {
      const querySnapshot = await getDocs(
        collection(db, `families/${authStore.familyId}/requests`)
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

const approveRequest = async (requestId, userId, email) => {
  try {
    await updateDoc(doc(db, "families", authStore.familyId), {
      members: arrayUnion({ userId, role: "member", email }),
    });
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    await fetchJoinRequests();
    showToast("Request approved successfully", "success");
  } catch (error) {
    console.error("Error approving request:", error);
    showToast("Failed to approve request: " + error.message, "error");
  }
};

const denyRequest = async (requestId) => {
  try {
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    await fetchJoinRequests();
    showToast("Request denied successfully", "success");
  } catch (error) {
    console.error("Error denying request:", error);
    showToast("Failed to deny request", "error");
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
  if (!authStore.familyId) return;

  try {
    const { getAllConversations } = await import("~/utils/firebase");
    recentConversations.value = await getAllConversations();
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const checkForPendingRequests = async () => {
  if (!authStore.userId || authStore.familyId) return;

  try {
    if (authStore.familyId && authStore.status !== "active") {
      hasPendingJoinRequest.value = true;
      pendingFamilyId.value = authStore.familyId;

      try {
        const familyDoc = await getDoc(doc(db, "families", authStore.familyId));
        if (familyDoc.exists()) {
          pendingFamilyName.value = familyDoc.data().name || "Unknown Family";
        }
      } catch (error) {
        console.error("Error fetching family name:", error);
        pendingFamilyName.value = "Unknown Family";
      }
    }
  } catch (error) {
    console.error("Error checking for pending requests:", error);
  }
};

onMounted(async () => {
  try {
    await authStore.initAuth();
    if (!authStore.isInitialized) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (!authStore.familyId || authStore.status !== "active") {
      await checkForPendingRequests();
    }

    await authStore.loadFamilyMembers();
    await fetchJoinRequests();

    if (authStore.familyId && authStore.status === "active") {
      await refreshEvents();
      await fetchRecentConversations();
    }
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

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
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
</style>
