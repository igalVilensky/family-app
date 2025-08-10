<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-6"
  >
    <!-- Title -->
    <h1 class="text-5xl font-bold mb-4 text-gray-800">FamilyOS</h1>

    <!-- Short description -->
    <p class="text-lg text-gray-600 text-center max-w-lg mb-8">
      The private, smart, and living family network — keep your memories safe,
      plan events, and stay connected without the noise of social media.
    </p>

    <!-- Call to action -->
    <p class="text-md text-gray-700 mb-6">
      Start your journey by creating an account or logging in.
    </p>

    <!-- Buttons -->
    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="navigateTo('/register')"
        class="w-48 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded hover:bg-green-700 transition"
      >
        Register
      </button>

      <button
        @click="navigateTo('/login')"
        class="w-48 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </div>
  </div>
</template>
