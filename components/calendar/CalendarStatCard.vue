<!-- components/calendar/CalendarStatCard.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-center space-x-2 sm:space-x-3">
      <div :class="`bg-${iconBg}-100 p-2 sm:p-3 rounded-lg flex-shrink-0`">
        <i :class="`fas ${icon} text-${iconBg}-600 text-lg sm:text-xl`"></i>
      </div>
      <div class="min-w-0">
        <p class="text-xl sm:text-2xl font-bold text-gray-900">
          {{ value }}
        </p>
        <p class="text-xs text-gray-500 truncate">{{ label }}</p>
        <p v-if="subtext" class="text-xs text-gray-400">{{ subtext }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  iconBg: string;
  value: number;
  label: string;
  subtext?: string;
}

defineProps<Props>();
</script>
