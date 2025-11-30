<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div
      class="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-stone-700 transition-colors">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {{ authStore.user?.displayName?.split(' ')[0] || 'Family Member' }}! 👋
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening in your family space.</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink to="/lists"
        class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-all group">
        <div
          class="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <i class="fas fa-clipboard-list text-emerald-600 dark:text-emerald-300 text-xl"></i>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Lists</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage tasks</p>
      </NuxtLink>

      <NuxtLink to="/calendar"
        class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all group">
        <div
          class="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <i class="fas fa-calendar-alt text-blue-600 dark:text-blue-300 text-xl"></i>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Calendar</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">View events</p>
      </NuxtLink>

      <NuxtLink to="/messages"
        class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 hover:shadow-md transition-all group">
        <div
          class="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <i class="fas fa-comments text-purple-600 dark:text-purple-300 text-xl"></i>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Messages</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">Chat with family</p>
      </NuxtLink>

      <NuxtLink to="/family"
        class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:shadow-md transition-all group">
        <div
          class="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <i class="fas fa-users text-indigo-600 dark:text-indigo-300 text-xl"></i>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Family</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage members</p>
      </NuxtLink>
    </div>

    <!-- Recent Activity Placeholder -->
    <div
      class="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-stone-700 transition-colors">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <div class="text-center py-8 text-gray-400 dark:text-gray-500">
        <i class="fas fa-stream text-4xl mb-3 opacity-20"></i>
        <p>No recent activity to show</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>
