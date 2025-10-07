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
          Loading profile...
        </h2>
      </div>
    </div>

    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-home text-white text-lg"></i>
              </div>
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
              >
                FamilySpace
              </h1>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <i class="fas fa-arrow-left text-sm"></i>
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 mb-8"
      >
        <div
          class="flex flex-col lg:flex-row items-center lg:items-start gap-8"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="relative">
              <div
                class="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  v-if="userProfile.avatarUrl"
                  :src="userProfile.avatarUrl"
                  :alt="userProfile.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-4xl font-bold text-blue-600">
                  {{ userInitial }}
                </div>
              </div>
              <div
                v-if="isOnline"
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
              >
                <i class="fas fa-check text-white text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-1 text-center lg:text-left">
            <div
              class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4"
            >
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ userProfile.name }}
                </h1>
                <div
                  class="flex items-center justify-center lg:justify-start gap-4 text-gray-600 mb-4"
                >
                  <div class="flex items-center gap-2">
                    <i class="fas fa-users text-sm"></i>
                    <span class="text-lg capitalize">
                      {{ userProfile.familyRole || "Member" }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-envelope text-sm"></i>
                    <span class="text-lg">{{ userProfile.email }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                v-if="authStore.userId !== userId"
                class="flex gap-3 justify-center lg:justify-start mt-4 lg:mt-0"
              >
                <button
                  @click="sendMessage"
                  class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                >
                  <i class="fas fa-envelope text-sm"></i>
                  Message
                </button>
                <button
                  @click="toggleFavorite"
                  class="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  <i
                    class="fas text-sm"
                    :class="
                      isFavorited
                        ? 'fa-heart text-red-500'
                        : 'fa-heart text-gray-400'
                    "
                  ></i>
                  {{ isFavorited ? "Favorited" : "Favorite" }}
                </button>
              </div>
            </div>

            <!-- Bio -->
            <div v-if="userProfile.bio" class="bg-gray-50 rounded-xl p-4 mb-6">
              <p class="text-gray-700 text-lg leading-relaxed">
                "{{ userProfile.bio }}"
              </p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">
                  {{ userEvents.length }}
                </div>
                <div class="text-sm text-gray-500">Events</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">
                  {{ upcomingEventsCount }}
                </div>
                <div class="text-sm text-gray-500">Upcoming</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">
                  {{ confirmedEventsCount }}
                </div>
                <div class="text-sm text-gray-500">Confirmed</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">
                  {{ familyMembershipDuration }}
                </div>
                <div class="text-sm text-gray-500">Months in Family</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Personal Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Upcoming Events -->
          <div
            v-if="upcomingEvents.length > 0"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-calendar-alt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <p class="text-gray-500 text-sm">
                  {{ userProfile.name }}'s schedule
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="event in upcomingEvents"
                :key="event.id"
                class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                @click="viewEvent(event)"
              >
                <div
                  class="w-3 h-12 rounded-full flex-shrink-0"
                  :style="`background-color: ${getEventColor(event)}`"
                ></div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">
                    {{ event.title }}
                  </p>
                  <p class="text-sm text-gray-500 flex items-center gap-2">
                    <i class="fas fa-clock text-xs"></i>
                    {{ formatEventDate(event.startDate) }}
                    <span v-if="event.location" class="flex items-center gap-1">
                      <i class="fas fa-map-marker-alt text-xs"></i>
                      {{ event.location }}
                    </span>
                  </p>
                </div>
                <div
                  v-if="event.rsvps && event.rsvps[userId]"
                  :class="`px-3 py-1 rounded-full text-xs font-semibold ${getRSVPBadgeClass(
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
              class="block text-center mt-6 py-3 text-blue-600 hover:text-blue-700 font-medium border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-300 transition-all duration-200"
            >
              View Full Calendar
            </NuxtLink>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-history text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <p class="text-gray-500 text-sm">
                  Latest actions and participation
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getActivityIconClass(activity.type)"
                >
                  <i :class="getActivityIcon(activity.type)"></i>
                </div>
                <div class="flex-1">
                  <p class="text-gray-900 font-medium">
                    {{ activity.description }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>

              <div
                v-if="recentActivities.length === 0"
                class="text-center py-8 text-gray-500"
              >
                <i class="fas fa-inbox text-3xl mb-3 text-gray-300"></i>
                <p class="font-medium">No recent activity</p>
                <p class="text-sm">Activity will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Personal Details -->
        <div class="space-y-8">
          <!-- Personal Information -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-birthday-cake text-blue-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Birthday</p>
                  <p class="font-medium text-gray-900">
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
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-phone text-green-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Phone</p>
                  <p class="font-medium text-gray-900">
                    {{ userProfile.phone || "Not provided" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user-tag text-purple-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Family Role</p>
                  <p class="font-medium text-gray-900 capitalize">
                    {{ userProfile.familyRole || "Member" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-calendar-plus text-amber-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Member Since</p>
                  <p class="font-medium text-gray-900">
                    {{ formatJoinDate(userProfile.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Participation -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Event Participation
            </h3>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Total Events</span>
                <span class="font-semibold text-gray-900">{{
                  userEvents.length
                }}</span>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    Confirmed
                  </span>
                  <span class="font-semibold text-gray-900">{{
                    confirmedEventsCount
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Maybe
                  </span>
                  <span class="font-semibold text-gray-900">{{
                    maybeEventsCount
                  }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600 flex items-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    Declined
                  </span>
                  <span class="font-semibold text-gray-900">{{
                    declinedEventsCount
                  }}</span>
                </div>
              </div>

              <!-- Participation Chart -->
              <div class="mt-4 bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700"
                    >Participation Rate</span
                  >
                  <span class="text-sm font-bold text-gray-900"
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
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Common Connections
            </h3>

            <div class="space-y-3">
              <div
                v-for="member in commonConnections"
                :key="member.userId"
                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer"
                @click="goToUserProfile(member.userId)"
              >
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-sm font-medium text-blue-600">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ member.name || member.email }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ member.role }}
                  </p>
                </div>
              </div>
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

// Computed properties
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

const sendMessage = () => {
  showToast(`Message sent to ${userProfile.value.name}`, "success");
};

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
  showToast(
    isFavorited.value
      ? `Added ${userProfile.value.name} to favorites`
      : `Removed ${userProfile.value.name} from favorites`,
    "success"
  );
};

const viewEvent = (event) => {
  // Navigate to calendar with event focused
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

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.familyId || authStore.status !== "active") {
    router.push("/dashboard");
    return;
  }

  await Promise.all([fetchUserProfile(), authStore.loadFamilyMembers()]);

  if (userProfile.value.familyId === authStore.familyId) {
    await fetchUserEvents();
  }

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
</style>
