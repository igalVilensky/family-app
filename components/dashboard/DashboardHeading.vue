<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
  >
    <div class="flex flex-col items-center text-center gap-4 sm:gap-6">
      <NuxtLink :to="`/user/${authStore.userId}`" class="group">
        <div class="relative w-24 h-24 mx-auto">
          <Avatar
            :avatar-url="authStore.avatarUrl"
            :user-initial="userInitial"
            :size="96"
            :no-upload="true"
            class="hover:ring-4 hover:ring-blue-100 transition-all rounded-2xl group-hover:scale-105 cursor-pointer w-full h-full"
          />
          <div
            class="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
          >
            <i class="fas fa-check text-white text-xs"></i>
          </div>
        </div>
      </NuxtLink>

      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {{ authStore.name || "User" }}!
        </h1>
        <p class="text-base sm:text-lg text-gray-600">
          {{
            authStore.familyName !== null
              ? `${authStore.familyRole} of ${authStore.familyName}`
              : "Pending family approval"
          }}
        </p>
      </div>

      <NuxtLink
        to="/profile"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <i class="fas fa-user-edit"></i>
        Manage Profile
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);
</script>
