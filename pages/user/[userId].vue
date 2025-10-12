<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Loading profile...
        </h2>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 pb-20 sm:pb-8">
      <!-- Profile Header -->
      <div
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-8 mb-4 sm:mb-8"
      >
        <div
          class="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-8"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="relative">
              <div
                class="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  v-if="userProfile.avatarUrl"
                  :src="userProfile.avatarUrl"
                  :alt="userProfile.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="text-3xl sm:text-4xl font-bold text-blue-600"
                >
                  {{ userInitial }}
                </div>
              </div>
              <div
                v-if="isOnline"
                class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
              >
                <i class="fas fa-check text-white text-[8px] sm:text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-1 text-center lg:text-left w-full">
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4"
            >
              <div class="w-full lg:w-auto">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {{ userProfile.name }}
                </h1>
                <div
                  class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-gray-600 mb-4"
                >
                  <div class="flex items-center gap-2">
                    <i class="fas fa-users text-xs sm:text-sm"></i>
                    <span class="text-sm sm:text-lg capitalize">
                      {{ userProfile.familyRole || "Member" }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-envelope text-xs sm:text-sm"></i>
                    <span class="text-sm sm:text-lg break-all">{{
                      userProfile.email
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                v-if="authStore.userId !== userId"
                class="flex gap-2 sm:gap-3 justify-center lg:justify-start w-full lg:w-auto"
              >
                <button
                  @click="showMessageModal = true"
                  class="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
                >
                  <i class="fas fa-envelope text-xs sm:text-sm"></i>
                  <span>Message</span>
                </button>
                <button
                  @click="toggleFavorite"
                  class="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
                >
                  <i
                    class="fas text-xs sm:text-sm"
                    :class="
                      isFavorited
                        ? 'fa-heart text-red-500'
                        : 'fa-heart text-gray-400'
                    "
                  ></i>
                  <span>{{ isFavorited ? "Favorited" : "Favorite" }}</span>
                </button>
              </div>
            </div>

            <!-- Bio -->
            <div
              v-if="userProfile.bio"
              class="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <p class="text-gray-700 text-sm sm:text-lg leading-relaxed">
                "{{ userProfile.bio }}"
              </p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div class="text-center bg-gray-50 rounded-xl p-3 sm:p-4">
                <div class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ userEvents.length }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">Events</div>
              </div>
              <div class="text-center bg-gray-50 rounded-xl p-3 sm:p-4">
                <div class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ upcomingEventsCount }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">Upcoming</div>
              </div>
              <div class="text-center bg-gray-50 rounded-xl p-3 sm:p-4">
                <div class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ confirmedEventsCount }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">Confirmed</div>
              </div>
              <div class="text-center bg-gray-50 rounded-xl p-3 sm:p-4">
                <div class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ familyMembershipDuration }}
                </div>
                <div class="text-xs sm:text-sm text-gray-500">Months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <!-- Left Column - Events & Activity -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-8">
          <!-- Upcoming Events -->
          <div
            v-if="upcomingEvents.length > 0"
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i
                  class="fas fa-calendar-alt text-white text-base sm:text-lg"
                ></i>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <p class="text-gray-500 text-xs sm:text-sm">
                  {{ userProfile.name }}'s schedule
                </p>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div
                v-for="event in upcomingEvents"
                :key="event.id"
                class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                @click="viewEvent(event)"
              >
                <div
                  class="w-1 sm:w-3 h-10 sm:h-12 rounded-full flex-shrink-0"
                  :style="`background-color: ${getEventColor(event)}`"
                ></div>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-semibold text-gray-900 truncate text-sm sm:text-base"
                  >
                    {{ event.title }}
                  </p>
                  <p
                    class="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-2"
                  >
                    <span class="flex items-center gap-1">
                      <i class="fas fa-clock text-[10px] sm:text-xs"></i>
                      {{ formatEventDate(event.startDate) }}
                    </span>
                    <span v-if="event.location" class="flex items-center gap-1">
                      <i
                        class="fas fa-map-marker-alt text-[10px] sm:text-xs"
                      ></i>
                      <span class="truncate max-w-[120px] sm:max-w-none">{{
                        event.location
                      }}</span>
                    </span>
                  </p>
                </div>
                <div
                  v-if="event.rsvps && event.rsvps[userId]"
                  :class="`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${getRSVPBadgeClass(
                    event.rsvps[userId]
                  )}`"
                >
                  {{
                    event.rsvps[userId].charAt(0).toUpperCase() +
                    event.rsvps[userId].slice(1)
                  }}
                </div>
              </div>
            </div>

            <NuxtLink
              to="/calendar"
              class="block text-center mt-4 sm:mt-6 py-2.5 sm:py-3 text-blue-600 hover:text-blue-700 font-medium border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-300 transition-all duration-200 text-sm sm:text-base"
            >
              View Full Calendar
            </NuxtLink>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-history text-white text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <p class="text-gray-500 text-xs sm:text-sm">Latest actions</p>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div
                  class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getActivityIconClass(activity.type)"
                >
                  <i
                    :class="getActivityIcon(activity.type)"
                    class="text-sm"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 font-medium text-sm sm:text-base">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-500 mt-1">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>

              <div
                v-if="recentActivities.length === 0"
                class="text-center py-8 sm:py-12 text-gray-500"
              >
                <i
                  class="fas fa-inbox text-2xl sm:text-3xl mb-3 text-gray-300"
                ></i>
                <p class="font-medium text-sm sm:text-base">
                  No recent activity
                </p>
                <p class="text-xs sm:text-sm">Activity will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Personal Details -->
        <div class="space-y-4 sm:space-y-8">
          <!-- Personal Information -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>

            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-birthday-cake text-blue-600 text-sm"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Birthday</p>
                  <p
                    class="font-medium text-gray-900 text-sm sm:text-base truncate"
                  >
                    {{
                      userProfile.birthday
                        ? formatBirthday(userProfile.birthday)
                        : "Not set"
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-phone text-green-600 text-sm"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p
                    class="font-medium text-gray-900 text-sm sm:text-base truncate"
                  >
                    {{ userProfile.phone || "Not provided" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user-tag text-purple-600 text-sm"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Family Role</p>
                  <p
                    class="font-medium text-gray-900 capitalize text-sm sm:text-base truncate"
                  >
                    {{ userProfile.familyRole || "Member" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-calendar-plus text-amber-600 text-sm"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Member Since</p>
                  <p
                    class="font-medium text-gray-900 text-sm sm:text-base truncate"
                  >
                    {{ formatJoinDate(userProfile.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Participation -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Event Participation
            </h3>

            <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm text-gray-600"
                  >Total Events</span
                >
                <span
                  class="font-semibold text-gray-900 text-sm sm:text-base"
                  >{{ userEvents.length }}</span
                >
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span
                    class="text-xs sm:text-sm text-gray-600 flex items-center gap-2"
                  >
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    Confirmed
                  </span>
                  <span
                    class="font-semibold text-gray-900 text-sm sm:text-base"
                    >{{ confirmedEventsCount }}</span
                  >
                </div>

                <div class="flex justify-between items-center">
                  <span
                    class="text-xs sm:text-sm text-gray-600 flex items-center gap-2"
                  >
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Maybe
                  </span>
                  <span
                    class="font-semibold text-gray-900 text-sm sm:text-base"
                    >{{ maybeEventsCount }}</span
                  >
                </div>

                <div class="flex justify-between items-center">
                  <span
                    class="text-xs sm:text-sm text-gray-600 flex items-center gap-2"
                  >
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    Declined
                  </span>
                  <span
                    class="font-semibold text-gray-900 text-sm sm:text-base"
                    >{{ declinedEventsCount }}</span
                  >
                </div>
              </div>

              <!-- Participation Chart -->
              <div class="mt-4 bg-gray-50 rounded-lg p-3 sm:p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs sm:text-sm font-medium text-gray-700"
                    >Participation Rate</span
                  >
                  <span class="text-xs sm:text-sm font-bold text-gray-900"
                    >{{ participationRate }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: `${participationRate}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Common Connections -->
          <div
            v-if="commonConnections.length > 0"
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Common Connections
            </h3>

            <div class="space-y-2 sm:space-y-3">
              <div
                v-for="member in commonConnections"
                :key="member.userId"
                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                @click="goToUserProfile(member.userId)"
              >
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-xs sm:text-sm font-medium text-blue-600">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-xs sm:text-sm font-medium text-gray-900 truncate"
                  >
                    {{ member.name || member.email }}
                  </p>
                  <p class="text-[10px] sm:text-xs text-gray-500 capitalize">
                    {{ member.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Message Modal -->
    <div
      v-if="showMessageModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showMessageModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-envelope text-blue-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Send Message</h3>
        </div>

        <p class="text-gray-600 mb-4">
          Send a message to <strong>{{ userProfile.name }}</strong>
        </p>

        <textarea
          v-model="messageText"
          placeholder="Type your message..."
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 resize-none"
        ></textarea>

        <div class="flex gap-3">
          <button
            @click="showMessageModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="sendMessageToUser"
            class="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm w-full sm:w-auto px-4 animate-slideIn"
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
          <p class="font-medium flex-1 text-sm sm:text-base">
            {{ toastMessage }}
          </p>
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
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  sendMessage,
  addToFavorites,
  isUserFavorited,
  markMessagesAsRead,
} from "~/utils/firebase";
import { useNuxtApp } from "#app";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { $firestore: db } = useNuxtApp();

const userId = ref(route.params.userId);
const userProfile = ref({});
const userEvents = ref([]);
const isLoading = ref(true);
const isFavorited = ref(false);
const isOnline = ref(true);
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const showMessageModal = ref(false);
const messageText = ref("");

// Computed properties (keep all your existing computed properties)
const userInitial = computed(() =>
  userProfile.value.name ? userProfile.value.name.charAt(0).toUpperCase() : "?"
);

const upcomingEvents = computed(() => {
  const now = new Date();
  return userEvents.value
    .filter((event) => new Date(event.startDate) >= now)
    .slice(0, 5);
});

const upcomingEventsCount = computed(() => upcomingEvents.value.length);

const confirmedEventsCount = computed(() => {
  return userEvents.value.filter(
    (event) => event.rsvps && event.rsvps[userId.value] === "yes"
  ).length;
});

const maybeEventsCount = computed(() => {
  return userEvents.value.filter(
    (event) => event.rsvps && event.rsvps[userId.value] === "maybe"
  ).length;
});

const declinedEventsCount = computed(() => {
  return userEvents.value.filter(
    (event) => event.rsvps && event.rsvps[userId.value] === "no"
  ).length;
});

const participationRate = computed(() => {
  const totalEvents = userEvents.value.length;
  if (totalEvents === 0) return 0;
  return Math.round((confirmedEventsCount.value / totalEvents) * 100);
});

const familyMembershipDuration = computed(() => {
  if (!userProfile.value.createdAt) return 0;
  const joinDate = userProfile.value.createdAt.toDate();
  const now = new Date();
  const diffMonths =
    (now.getFullYear() - joinDate.getFullYear()) * 12 +
    (now.getMonth() - joinDate.getMonth());
  return Math.max(1, diffMonths);
});

const commonConnections = computed(() => {
  if (!authStore.familyMembers || !userProfile.value.familyId) return [];
  return authStore.familyMembers
    .filter(
      (member) =>
        member.userId !== userId.value && member.userId !== authStore.userId
    )
    .slice(0, 5);
});

// Mock recent activities (you can replace with real data)
const recentActivities = computed(() => [
  {
    id: 1,
    type: "rsvp",
    description: `Confirmed attendance for "Family Dinner"`,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "event_created",
    description: `Created event "Weekend Hike"`,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    type: "comment",
    description: `Commented on "Birthday Party Planning"`,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
]);

// Methods
const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const getEventColor = (event) => {
  const colors = {
    amber: "#f59e0b",
    blue: "#3b82f6",
    green: "#10b981",
    red: "#ef4444",
    purple: "#8b5cf6",
    pink: "#ec4899",
  };
  return colors[event.color] || colors.amber;
};

const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatBirthday = (birthdayString) => {
  const date = new Date(birthdayString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

const formatJoinDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

const formatTimeAgo = (date) => {
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

const getRSVPBadgeClass = (status) => {
  if (status === "yes") return "bg-green-100 text-green-800";
  if (status === "no") return "bg-red-100 text-red-800";
  if (status === "maybe") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const getActivityIcon = (type) => {
  const icons = {
    rsvp: "fa-calendar-check",
    event_created: "fa-calendar-plus",
    comment: "fa-comment",
    task_completed: "fa-check-circle",
    joined: "fa-user-plus",
  };
  return `fas ${icons[type] || "fa-bell"}`;
};

const getActivityIconClass = (type) => {
  const classes = {
    rsvp: "bg-green-100 text-green-600",
    event_created: "bg-blue-100 text-blue-600",
    comment: "bg-purple-100 text-purple-600",
    task_completed: "bg-emerald-100 text-emerald-600",
    joined: "bg-amber-100 text-amber-600",
  };
  return classes[type] || "bg-gray-100 text-gray-600";
};

// Basic messaging function
const sendMessageToUser = async () => {
  if (!messageText.value || !messageText.value.trim()) {
    showToast("Please enter a message", "error");
    return;
  }

  try {
    await sendMessage(userId.value, messageText.value);
    showMessageModal.value = false;
    showToast(`Message sent to ${userProfile.value.name}`, "success");
    messageText.value = "";

    // Optionally redirect to conversation page
    router.push(`/messages/${userId.value}`);
  } catch (error) {
    console.error("Send message error:", error);
    showToast(error.message || "Failed to send message", "error");
  }
};

const toggleFavorite = async () => {
  try {
    const result = await addToFavorites(userId.value);
    isFavorited.value = result.action === "added";
    showToast(
      isFavorited.value
        ? `Added ${userProfile.value.name} to favorites`
        : `Removed ${userProfile.value.name} from favorites`,
      "success"
    );
  } catch (error) {
    console.error("Toggle favorite error:", error);
    showToast(error.message || "Failed to update favorites", "error");
  }
};

const viewEvent = (event) => {
  router.push(`/calendar?event=${event.id}`);
};

const goToUserProfile = (targetUserId) => {
  router.push(`/user/${targetUserId}`);
};

// Data fetching
const fetchUserProfile = async () => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId.value));
    if (userDoc.exists()) {
      userProfile.value = userDoc.data();
    } else {
      showToast("User not found", "error");
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    showToast("Failed to load profile", "error");
  }
};

const fetchUserEvents = async () => {
  if (!userProfile.value.familyId) return;

  try {
    const eventsQuery = query(
      collection(db, "families", userProfile.value.familyId, "events"),
      orderBy("startDate", "desc")
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    userEvents.value = eventsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (event) =>
          event.attendees?.includes(userId.value) ||
          event.creatorId === userId.value
      );
  } catch (error) {
    console.error("Error fetching user events:", error);
  }
};

const checkFavoriteStatus = async () => {
  try {
    isFavorited.value = await isUserFavorited(userId.value);
  } catch (error) {
    console.error("Check favorite status error:", error);
  }
};

onMounted(async () => {
  await authStore.initAuth();

  // Only redirect if user doesn't belong to any family at all
  if (!authStore.familyId) {
    router.push("/dashboard");
    return;
  }

  // Allow users to view profiles even if status is not 'active'
  // (like pending members who should still see family profiles)

  await Promise.all([
    fetchUserProfile(),
    authStore.loadFamilyMembers(),
    checkFavoriteStatus(),
  ]);

  // Check if the target user is in the same family
  if (
    userProfile.value.familyId &&
    userProfile.value.familyId !== authStore.familyId
  ) {
    showToast("You can only view profiles of family members", "error");
    router.push("/dashboard");
    return;
  }

  await fetchUserEvents();
  isLoading.value = false;
});

useHead({
  title: computed(() =>
    userProfile.value.name
      ? `${userProfile.value.name} - FamilySpace`
      : "User Profile - FamilySpace"
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

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
