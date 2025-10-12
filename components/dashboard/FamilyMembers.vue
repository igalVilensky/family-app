<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
  >
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        <i class="fas fa-users text-green-500 mr-3"></i>Family Members
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        {{ familyMembers.length }} people
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div
        v-for="member in familyMembers.slice(0, 4)"
        :key="member.userId"
        class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
        @click="$emit('go-to-user-profile', member.userId)"
      >
        <div
          class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors"
        >
          <span class="text-sm font-bold text-blue-600">
            {{ member.name ? member.name.charAt(0).toUpperCase() : "?" }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 text-sm truncate">
            {{ member.name || member.email }}
          </p>
          <p class="text-xs text-gray-500 capitalize">{{ member.role }}</p>
        </div>
        <button
          @click.stop="
            $emit('send-message-to-member', member.userId, member.name)
          "
          class="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all"
        >
          <i class="fas fa-comment"></i>
        </button>
      </div>
    </div>

    <!-- View All Link -->
    <div class="text-center">
      <NuxtLink
        :to="`/family/${authStore.familyId}`"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        View all members
        <i class="fas fa-arrow-right text-sm"></i>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

defineProps({
  familyMembers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["go-to-user-profile", "send-message-to-member"]);
</script>
