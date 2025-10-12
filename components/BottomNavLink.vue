<template>
  <NuxtLink
    :to="to"
    class="flex flex-col items-center py-2 px-3 text-xs transition-all duration-200 flex-1"
    :class="isActive ? 'text-blue-600' : 'text-gray-600'"
  >
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all duration-200"
      :class="isActive ? 'bg-blue-50' : 'hover:bg-gray-100'"
    >
      <i class="fas text-lg" :class="`fa-${icon}`"></i>
    </div>
    <span class="font-medium">{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  to: String,
  icon: String,
  label: String,
});

const route = useRoute();
const isActive = computed(() => route.path.startsWith(props.to));
</script>
