<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading"
      class="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 border-4 border-orange-200 dark:border-orange-700 rounded-full">
            ></div>
          <div class="absolute inset-0 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Loading Profile
        </h2>
        <p class="text-gray-600">Getting user information...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
      <!-- Profile Header -->
      <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-6 md:p-8">
        <div class="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="relative">
              <div
                class="w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl"
                :class="getRelationshipColor(userRelationship)">
                <img v-if="userProfile.avatarUrl" :src="userProfile.avatarUrl" :alt="userProfile.name"
                  class="w-full h-full object-cover" />
                <div v-else class="text-4xl md:text-5xl font-bold text-white">
                  {{ userInitial }}
                </div>
              </div>
              <div v-if="isOnline"
                class="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <i class="fas fa-check text-white text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-1 text-center lg:text-left w-full">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
              <div class="w-full lg:w-auto">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {{ userProfile.name }}
                </h1>
                <div
                  class="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-3 md:gap-6 text-gray-600 mb-6">
                  <!-- Relationship Badge -->
                  <div v-if="userRelationship" class="flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-md"
                    :class="getRelationshipBadgeClass(userRelationship)">
                    <i :class="getRelationshipIcon(userRelationship)" class="text-sm text-white"></i>
                    <span class="font-bold text-white text-sm">
                      {{ getRelationshipDisplay(userRelationship) }}
                    </span>
                  </div>

                  <div
                    class="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border-2 border-blue-200">
                    <i class="fas fa-users text-blue-600"></i>
                    <span class="font-bold text-gray-800 capitalize">
                      {{ userProfile.familyRole || "Member" }}
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border-2 border-emerald-200">
                    <i class="fas fa-envelope text-emerald-600"></i>
                    <span class="font-bold text-gray-800 break-all">{{
                      userProfile.email
                      }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div v-if="authStore.userId !== userId"
                class="flex gap-4 justify-center lg:justify-start w-full lg:w-auto">
                <button v-if="canSendMessage" @click="showMessageModal = true" :disabled="isSendingMessage"
                  class="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  <i class="fas fa-envelope" :class="{ 'animate-spin': isSendingMessage }"></i>
                  <span>{{ isSendingMessage ? "Sending..." : "Message" }}</span>
                </button>
                <button @click="toggleFavorite"
                  class="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md">
                  <i class="fas text-lg" :class="isFavorited
                      ? 'fa-heart text-rose-500'
                      : 'fa-heart text-gray-400'
                    "></i>
                  <span>{{ isFavorited ? "Favorited" : "Favorite" }}</span>
                </button>
              </div>
            </div>

            <!-- Bio -->
            <div v-if="userProfile.bio"
              class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 md:p-6 mb-6 border-2 border-gray-200">
              <p class="text-gray-700 text-lg leading-relaxed font-medium italic">
                "{{ userProfile.bio }}"
              </p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                class="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-4 hover:shadow-lg transition-all">
                <div class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ userEvents.length }}
                </div>
                <div class="text-gray-600 font-bold">Events</div>
              </div>
              <div
                class="text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-4 hover:shadow-lg transition-all">
                <div class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ upcomingEventsCount }}
                </div>
                <div class="text-gray-600 font-bold">Upcoming</div>
              </div>
              <div
                class="text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-4 hover:shadow-lg transition-all">
                <div class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ confirmedEventsCount }}
                </div>
                <div class="text-gray-600 font-bold">Confirmed</div>
              </div>
              <div
                class="text-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200 p-4 hover:shadow-lg transition-all">
                <div class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ familyMembershipDuration }}
                </div>
                <div class="text-gray-600 font-bold">Months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Events & Activity -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Upcoming Events -->
          <div v-if="upcomingEvents.length > 0"
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-6 md:p-8">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-calendar-alt text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">
                  Upcoming Events
                </h3>
                <p class="text-gray-600 font-medium">
                  {{ userProfile.name }}'s schedule
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="event in upcomingEvents" :key="event.id"
                class="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                @click="viewEvent(event)">
                <div class="w-3 h-12 rounded-full flex-shrink-0 shadow-md"
                  :style="`background: ${getEventColor(event)}`"></div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 truncate text-lg">
                    {{ event.title }}
                  </p>
                  <p class="text-gray-600 flex flex-wrap items-center gap-3 font-medium">
                    <span class="flex items-center gap-2">
                      <i class="fas fa-clock text-emerald-600"></i>
                      {{ formatEventDate(event.startDate) }}
                    </span>
                    <span v-if="event.location" class="flex items-center gap-2">
                      <i class="fas fa-map-marker-alt text-rose-600"></i>
                      <span class="truncate max-w-[120px] md:max-w-none">{{
                        event.location
                        }}</span>
                    </span>
                  </p>
                </div>
                <div v-if="event.rsvps && event.rsvps[userId]" :class="`px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap shadow-md ${getRSVPBadgeClass(
                  event.rsvps[userId]
                )}`">
                  {{
                    event.rsvps[userId].charAt(0).toUpperCase() +
                    event.rsvps[userId].slice(1)
                  }}
                </div>
              </div>
            </div>

            <NuxtLink to="/calendar"
              class="block text-center mt-6 py-4 text-orange-600 hover:text-orange-700 font-bold border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-300 transition-all duration-200 text-lg hover:bg-orange-50">
              View Full Calendar
            </NuxtLink>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-purple-200 p-6 md:p-8">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-history text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">
                  Recent Activity
                </h3>
                <p class="text-gray-600 font-medium">Latest actions</p>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="activity in recentActivities" :key="activity.id"
                class="flex items-start gap-4 p-5 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-all">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                  :class="getActivityIconClass(activity.type)">
                  <i :class="getActivityIcon(activity.type)" class="text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 font-bold text-lg">
                    {{ activity.description }}
                  </p>
                  <p class="text-gray-600 font-medium mt-2">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>

              <div v-if="recentActivities.length === 0" class="text-center py-12 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
                <p class="font-bold text-xl">No recent activity</p>
                <p class="text-lg font-medium">Activity will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Personal Details -->
        <div class="space-y-8">
          <!-- Personal Information -->
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-6 md:p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">
              Personal Information
            </h3>

            <div class="space-y-4">
              <!-- Relationship Information -->
              <div v-if="userRelationship"
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                  <i :class="getRelationshipIcon(userRelationship)" class="text-white"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-gray-600 font-bold">Family Relationship</p>
                  <p class="font-bold text-gray-900 text-lg truncate">
                    {{ getRelationshipDisplay(userRelationship) }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                  <i class="fas fa-birthday-cake text-white"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-gray-600 font-bold">Birthday</p>
                  <p class="font-bold text-gray-900 text-lg truncate">
                    {{
                      userProfile.birthday
                        ? formatBirthday(userProfile.birthday)
                        : "Not set"
                    }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md">
                  <i class="fas fa-phone text-white"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-gray-600 font-bold">Phone</p>
                  <p class="font-bold text-gray-900 text-lg truncate">
                    {{ userProfile.phone || "Not provided" }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <i class="fas fa-calendar-plus text-white"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-gray-600 font-bold">Member Since</p>
                  <p class="font-bold text-gray-900 text-lg truncate">
                    {{ formatJoinDate(userProfile.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Participation -->
          <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-6 md:p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">
              Event Participation
            </h3>

            <div class="space-y-4">
              <div
                class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200">
                <span class="text-gray-700 font-bold">Total Events</span>
                <span class="font-bold text-gray-900 text-xl">{{
                  userEvents.length
                  }}</span>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-700 font-bold flex items-center gap-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    Confirmed
                  </span>
                  <span class="font-bold text-gray-900 text-xl">{{
                    confirmedEventsCount
                    }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-700 font-bold flex items-center gap-3">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                    Maybe
                  </span>
                  <span class="font-bold text-gray-900 text-xl">{{
                    maybeEventsCount
                    }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-700 font-bold flex items-center gap-3">
                    <div class="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    Declined
                  </span>
                  <span class="font-bold text-gray-900 text-xl">{{
                    declinedEventsCount
                    }}</span>
                </div>
              </div>

              <!-- Participation Chart -->
              <div class="mt-6 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-bold text-gray-700">Participation Rate</span>
                  <span class="font-bold text-gray-900 text-xl">{{ participationRate }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    class="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                    :style="{ width: `${participationRate}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Common Connections -->
          <div v-if="commonConnections.length > 0"
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-purple-200 p-6 md:p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">
              Common Connections
            </h3>

            <div class="space-y-3">
              <div v-for="member in commonConnections" :key="member.userId"
                class="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                @click="goToUserProfile(member.userId)">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                  :class="getRelationshipColor(member.relationship)">
                  <span class="text-white font-bold text-lg">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 text-lg truncate">
                    {{ member.name || member.email }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <i class="text-sm" :class="getRelationshipIcon(member.relationship)"></i>
                    <span class="text-gray-600 text-sm font-medium capitalize">
                      {{
                        getRelationshipDisplay(member.relationship) ||
                        member.role
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Message Modal -->
    <div v-if="showMessageModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showMessageModal = false">
      <div
        class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn border-2 border-orange-200">
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i class="fas fa-envelope text-white text-xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Send Message</h3>
        </div>

        <p class="text-gray-600 mb-6 text-lg font-medium">
          Send a message to <strong>{{ userProfile.name }}</strong>
        </p>

        <textarea v-model="messageText" placeholder="Type your message..." rows="4"
          class="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-6 resize-none font-medium text-lg hover:border-gray-300 transition-all"></textarea>

        <div class="flex gap-4">
          <button @click="showMessageModal = false"
            class="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md">
            Cancel
          </button>
          <button @click="sendMessageToUser" :disabled="isSendingMessage || !messageText.trim()"
            class="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {{ isSendingMessage ? "Sending..." : "Send" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToastMessage" class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn">
      <div class="p-5 rounded-2xl shadow-xl border-2 backdrop-blur-sm" :class="{
        'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300':
          toastType === 'success',
        'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300':
          toastType === 'error',
      }">
        <div class="flex items-center gap-4">
          <i class="text-xl flex-shrink-0" :class="{
            'fas fa-check-circle text-green-500': toastType === 'success',
            'fas fa-exclamation-circle text-red-500': toastType === 'error',
          }"></i>
          <p class="font-bold flex-1 text-lg">{{ toastMessage }}</p>
          <button @click="showToastMessage = false" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-lg"></i>
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
const isSendingMessage = ref(false);
const userRelationship = ref(""); // NEW: Store user's relationship

// Computed properties for multi-family support
const userInitial = computed(() =>
  userProfile.value.name ? userProfile.value.name.charAt(0).toUpperCase() : "?"
);

const canSendMessage = computed(() => {
  return isSameFamily.value && authStore.userId !== userId.value;
});

const isSameFamily = computed(() => {
  if (!authStore.currentFamilyId || !userProfile.value.families) return false;
  return userProfile.value.families[authStore.currentFamilyId] !== undefined;
});

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
  if (!authStore.familyMembers || !isSameFamily.value) return [];
  return authStore.familyMembers
    .filter(
      (member) =>
        member.userId !== userId.value && member.userId !== authStore.userId
    )
    .slice(0, 5);
});

// NEW: Relationship helper functions
const getRelationshipDisplay = (relationship) => {
  const relationshipMap = {
    parent_1: "Father",
    parent_2: "Mother",
    child: "Child",
    spouse: "Spouse/Partner",
  };
  return relationshipMap[relationship] || "Family Member";
};

const getRelationshipIcon = (relationship) => {
  const iconMap = {
    parent_1: "fas fa-male",
    parent_2: "fas fa-female",
    child: "fas fa-child",
    spouse: "fas fa-heart",
  };
  return iconMap[relationship] || "fas fa-user text-gray-500";
};

const getRelationshipColor = (relationship) => {
  const colorMap = {
    parent_1: "bg-gradient-to-br from-blue-500 to-indigo-600",
    parent_2: "bg-gradient-to-br from-pink-500 to-rose-600",
    child: "bg-gradient-to-br from-green-500 to-emerald-600",
    spouse: "bg-gradient-to-br from-purple-500 to-violet-600",
  };
  return (
    colorMap[relationship] || "bg-gradient-to-br from-orange-500 to-rose-600"
  );
};

const getRelationshipBadgeClass = (relationship) => {
  const badgeMap = {
    parent_1: "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-300",
    parent_2: "bg-gradient-to-r from-pink-500 to-rose-600 border-pink-300",
    child: "bg-gradient-to-r from-green-500 to-emerald-600 border-green-300",
    spouse: "bg-gradient-to-r from-purple-500 to-violet-600 border-purple-300",
  };
  return (
    badgeMap[relationship] ||
    "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300"
  );
};

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
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
  if (status === "yes")
    return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
  if (status === "no")
    return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
  if (status === "maybe")
    return "bg-gradient-to-r from-yellow-500 to-amber-600 text-white";
  return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
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
    rsvp: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
    event_created: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
    comment: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white",
    task_completed: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
    joined: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
  };
  return (
    classes[type] || "bg-gradient-to-br from-gray-500 to-gray-600 text-white"
  );
};

// NEW: Fetch user's relationship in current family
const fetchUserRelationship = async () => {
  if (!authStore.currentFamilyId) return;

  try {
    const familyDoc = await getDoc(
      doc(db, "families", authStore.currentFamilyId)
    );
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const currentMember = familyData.members?.find(
        (member) => member.userId === userId.value
      );
      if (currentMember?.relationship) {
        userRelationship.value = currentMember.relationship;
      }
    }
  } catch (error) {
    console.error("Error fetching user relationship:", error);
  }
};

// Basic messaging function
const sendMessageToUser = async () => {
  if (!messageText.value || !messageText.value.trim()) {
    showToast("Please enter a message", "error");
    return;
  }

  if (!canSendMessage.value) {
    showToast("Cannot send message to this user", "error");
    return;
  }

  isSendingMessage.value = true;

  try {
    await sendMessage(userId.value, messageText.value);
    showMessageModal.value = false;
    showToast(`Message sent to ${userProfile.value.name}`, "success");
    messageText.value = "";
  } catch (error) {
    console.error("Send message error:", error);
    showToast(error.message || "Failed to send message", "error");
  } finally {
    isSendingMessage.value = false;
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
  if (!authStore.currentFamilyId) return;

  try {
    const eventsQuery = query(
      collection(db, "families", authStore.currentFamilyId, "events"),
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
  if (!authStore.hasFamily) {
    router.push("/dashboard");
    return;
  }

  await Promise.all([
    fetchUserProfile(),
    authStore.loadFamilyMembers(),
    checkFavoriteStatus(),
  ]);

  // Check if the target user is in the same current family
  if (!isSameFamily.value) {
    showToast("You can only view profiles of family members", "error");
    router.push("/dashboard");
    return;
  }

  await Promise.all([
    fetchUserEvents(),
    fetchUserRelationship(), // NEW: Fetch relationship
  ]);
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
