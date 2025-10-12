<template>
  <div class="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <CalendarStatCard
      icon="fa-calendar-check"
      icon-bg="blue"
      :value="events.length"
      label="Total Events"
    />
    <CalendarStatCard
      icon="fa-users"
      icon-bg="green"
      :value="familyMembers.length"
      label="Family Members"
    />
    <CalendarStatCard
      icon="fa-clock"
      icon-bg="amber"
      :value="upcomingCount"
      label="Upcoming"
    />
    <CalendarStatCard
      icon="fa-check-circle"
      icon-bg="purple"
      :value="confirmedCount"
      label="Confirmed"
    />
    <CalendarStatCard
      icon="fa-birthday-cake"
      icon-bg="pink"
      :value="membersWithBirthdays.length"
      label="Birthdays Set"
      :subtext="`${familyMembers.length - membersWithBirthdays.length} missing`"
    />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const calendarStore = useCalendarStore();

const membersWithBirthdays = computed(() => {
  return authStore.familyMembers.filter((member) => member.birthday);
});

const { events, upcomingCount, confirmedCount } = storeToRefs(calendarStore);
const familyMembers = computed(() => authStore.familyMembers || []);
</script>
