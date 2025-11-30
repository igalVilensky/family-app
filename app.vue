<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import "@fortawesome/fontawesome-free/css/all.min.css"; // For all icons

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - FamilySpace` : "FamilySpace";
  },
  link: [
    { rel: "icon", type: "image/png", href: "/family-space-logo.png" }, // Assuming this file exists based on layout usage
  ],
});
</script>
