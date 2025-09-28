<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <!-- Hero Section -->
    <div class="text-center max-w-4xl mx-auto w-full">
      <!-- App Icon/Logo -->
      <div class="mb-6">
        <div
          class="w-20 h-20 mx-auto bg-gray-300 rounded-xl flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Main Headline -->
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        FamilySpace
      </h1>

      <!-- Subtitle -->
      <p class="text-lg sm:text-xl text-gray-600 mb-3 max-w-3xl mx-auto">
        Your family's private digital home
      </p>

      <!-- Description -->
      <p class="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
        A safe, private space where your family connects, shares memories, plans
        events, and preserves your legacy.
      </p>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
      >
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700"
        >
          Start Your Family Journey
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200"
        >
          Welcome Back
        </NuxtLink>
      </div>

      <!-- Feature Highlights -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <!-- Memory Keeper -->
        <div class="p-4 bg-white border border-gray-200 rounded-lg">
          <div class="text-3xl mb-3">📸</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Memory Keeper</h3>
          <p class="text-gray-500 text-sm">
            Preserve and share family moments in private albums.
          </p>
        </div>

        <!-- Family Tree -->
        <div class="p-4 bg-white border border-gray-200 rounded-lg">
          <div class="text-3xl mb-3">🌳</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Legacy Builder</h3>
          <p class="text-gray-500 text-sm">
            Build your family tree and create digital time capsules.
          </p>
        </div>

        <!-- Event Planning -->
        <div class="p-4 bg-white border border-gray-200 rounded-lg">
          <div class="text-3xl mb-3">🎉</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Together Time</h3>
          <p class="text-gray-500 text-sm">
            Plan family events and track birthdays.
          </p>
        </div>
      </div>

      <!-- Trust Badge -->
      <div
        class="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-500"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm">100% Private & Secure</span>
        </div>
        <div class="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></div>
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">Family-First Design</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from "#imports";

// SEO Meta
useHead({
  title: "FamilySpace - Your Family's Digital Home",
  meta: [
    {
      name: "description",
      content:
        "A private, secure space for families to connect, share memories, and preserve their legacy for future generations.",
    },
    {
      property: "og:title",
      content: "FamilySpace - Your Family's Digital Home",
    },
    {
      property: "og:description",
      content:
        "Connect, share, and preserve your family's precious moments in one private space.",
    },
  ],
});
</script>
