<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12"
  >
    <div class="max-w-md w-full">
      <h2 class="text-3xl font-bold text-gray-900">Privacy Policy</h2>
      <p class="text-gray-600 mt-4">
        Our privacy policy is coming soon. We are committed to protecting your
        data.
      </p>
      <p class="mt-4 text-gray-600">
        <NuxtLink to="/dashboard" class="text-blue-600 hover:underline"
          >Back to Dashboard</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "FamilySpace - Privacy Policy",
  meta: [
    {
      name: "description",
      content: "Privacy policy for FamilySpace.",
    },
  ],
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
