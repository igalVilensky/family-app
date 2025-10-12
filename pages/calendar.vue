<!-- pages/calendar.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
  >
    <CalendarHeader />

    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Calendar Card -->
      <div class="bg-white rounded-xl shadow-xl overflow-hidden">
        <ClientOnly>
          <CalendarGrid />
        </ClientOnly>
      </div>

      <CalendarStats />
    </div>

    <CalendarEventModal />
  </div>
</template>

<script setup lang="ts">
onMounted(async () => {
  const authStore = useAuthStore();
  const { refreshEvents } = useCalendarEvents();

  await authStore.initAuth();
  await authStore.loadFamilyMembers();
  await refreshEvents();
});
</script>
