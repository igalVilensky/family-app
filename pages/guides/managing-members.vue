<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NuxtLink
          to="/help"
          class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          ← Back to Help
        </NuxtLink>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center"
      >
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Managing Family Members
        </h1>
        <p class="text-gray-600 mb-8">Guide coming soon</p>
        <NuxtLink
          to="/help"
          class="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Return to Help Center
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: "Managing Members - FamilySpace Guides",
});
</script>
