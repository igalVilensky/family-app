<template>
  <header class="sticky top-0 z-20 bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between py-3 sm:py-4">
        <!-- Logo & Title -->
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div
            class="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg shadow-md flex-shrink-0"
          >
            <i class="fas fa-calendar-days text-white text-lg sm:text-xl"></i>
          </div>
          <div class="min-w-0">
            <h1
              class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate"
            >
              {{ familyName }}'s Calendar
            </h1>
            <p class="text-xs text-gray-500 hidden sm:block">
              Plan your family moments
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button
            @click="$router.push('/dashboard')"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            title="Back to Dashboard"
          >
            <i class="fas fa-home sm:mr-2"></i>
            <span class="hidden sm:inline">Dashboard</span>
          </button>

          <button
            v-if="!isToday"
            @click="goToToday"
            class="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            <i class="fas fa-calendar-day mr-2"></i>Today
          </button>
          <button
            @click="refreshEvents"
            :disabled="isRefreshing"
            class="p-2 sm:p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 relative"
            title="Refresh"
          >
            <i
              :class="`fas fa-sync-alt text-sm sm:text-base ${
                isRefreshing ? 'animate-spin' : ''
              }`"
            ></i>
            <span
              v-if="refreshSuccess"
              class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
            ></span>
          </button>
          <button
            @click="handleCreateEvent"
            class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <i class="fas fa-plus mr-0 sm:mr-2"></i>
            <span class="hidden sm:inline">New Event</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { isToday, goToToday } = useCalendar();
const { isRefreshing, refreshSuccess, refreshEvents } = useCalendarEvents();
const { openCreateModal } = useCalendarModal();
const { resetForm } = useCalendarForm();

const familyName = computed(() => authStore.familyName || "Your");

const handleCreateEvent = () => {
  resetForm();
  openCreateModal();
};
</script>
