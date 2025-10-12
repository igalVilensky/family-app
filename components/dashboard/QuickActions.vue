<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
  >
    <h2
      class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left"
    >
      Quick Access
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Family -->
      <NuxtLink
        v-if="!authStore.familyId"
        to="/family-setup"
        class="group p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-plus-circle text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Set Up Family</div>
          <div class="text-white/80 text-sm">Create your space</div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-else
        :to="`/family/${authStore.familyId}`"
        class="group p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-home text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Family Profile</div>
          <div class="text-white/80 text-sm">View members</div>
        </div>
      </NuxtLink>

      <!-- Calendar -->
      <NuxtLink
        v-if="authStore.familyId"
        to="/calendar"
        class="group p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-calendar-days text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Calendar</div>
          <div class="text-white/80 text-sm">View schedule</div>
        </div>
      </NuxtLink>

      <!-- Messages -->
      <NuxtLink
        v-if="authStore.familyId"
        to="/messages"
        class="group p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 relative"
        >
          <i class="fas fa-comments text-2xl"></i>
          <span
            v-if="unreadMessagesCount > 0"
            class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {{ unreadMessagesCount }}
          </span>
        </div>
        <div>
          <div class="font-semibold text-base">Messages</div>
          <div class="text-white/80 text-sm">Chat with family</div>
        </div>
      </NuxtLink>

      <!-- Settings -->
      <NuxtLink
        to="/profile"
        class="group p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-user-cog text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Settings</div>
          <div class="text-white/80 text-sm">Update profile</div>
        </div>
      </NuxtLink>

      <!-- Help (Mobile) -->
      <NuxtLink
        to="/help"
        class="sm:hidden group p-6 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-book-open text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Help</div>
          <div class="text-white/80 text-sm">Guides & FAQs</div>
        </div>
      </NuxtLink>

      <!-- Support (Mobile) -->
      <NuxtLink
        to="/support"
        class="sm:hidden group p-6 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
      >
        <div
          class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <i class="fas fa-headset text-2xl"></i>
        </div>
        <div>
          <div class="font-semibold text-base">Support</div>
          <div class="text-white/80 text-sm">Get help</div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

defineProps({
  unreadMessagesCount: {
    type: Number,
    default: 0,
  },
});
</script>
