<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
    >
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        <i class="fas fa-calendar-alt text-amber-500 mr-3"></i>Upcoming Events
      </h2>
    </div>

    <!-- Events List -->
    <div class="space-y-3 mb-6">
      <div
        v-if="upcomingEvents.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <i class="fas fa-calendar-plus text-3xl text-gray-300 mb-2"></i>
        <p class="font-medium text-sm">No upcoming events</p>
        <NuxtLink
          to="/calendar"
          class="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
        >
          Create one
        </NuxtLink>
      </div>

      <div
        v-for="event in upcomingEvents.slice(0, 4)"
        :key="event.id"
        class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
        @click="$emit('go-to-calendar', event.id)"
      >
        <div
          class="w-1 h-12 rounded-full flex-shrink-0"
          :style="`background-color: ${getEventColor(event)}`"
        ></div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 text-sm">{{ event.title }}</p>
          <p class="text-xs text-gray-500">
            {{ formatEventDate(event.startDate) }}
          </p>
        </div>
        <div
          v-if="event.rsvps && event.rsvps[authStore.userId]"
          :class="`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getRSVPBadgeClass(
            event.rsvps[authStore.userId]
          )}`"
        >
          {{ event.rsvps[authStore.userId] }}
        </div>
      </div>
    </div>

    <!-- View All Link -->
    <div class="text-center">
      <NuxtLink
        to="/calendar"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        View all events
        <i class="fas fa-arrow-right text-sm"></i>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

defineProps({
  upcomingEvents: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["go-to-calendar"]);

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

const getRSVPBadgeClass = (status) => {
  if (status === "yes") return "bg-green-100 text-green-800";
  if (status === "no") return "bg-red-100 text-red-800";
  if (status === "maybe") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};
</script>
