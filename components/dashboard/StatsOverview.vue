<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 text-center"
    >
      <div class="text-4xl font-bold text-blue-600 mb-2">
        {{ todaysEventsCount }}
      </div>
      <p class="text-sm text-gray-600">Events Today</p>
    </div>
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 text-center"
    >
      <div class="text-4xl font-bold text-green-600 mb-2">
        {{ upcomingBirthdaysCount }}
      </div>
      <p class="text-sm text-gray-600">Upcoming Birthdays</p>
    </div>
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6 text-center"
    >
      <div class="text-4xl font-bold text-purple-600 mb-2">
        {{ unreadMessagesCount }}
      </div>
      <p class="text-sm text-gray-600">Unread Messages</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  todaysEventsCount: {
    type: Number,
    default: 0,
  },
  upcomingBirthdaysCount: {
    type: Number,
    default: 0,
  },
  unreadMessagesCount: {
    type: Number,
    default: 0,
  },
});
</script>
