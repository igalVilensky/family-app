<!-- pages/calendar.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
      <!-- No Family Access Message -->
      <div
        v-if="!hasAccessToCurrentFamily"
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-amber-300 p-8 md:p-12 text-center"
      >
        <div
          class="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <i class="fas fa-calendar-times text-white text-2xl"></i>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          No Family Access
        </h3>
        <p class="text-gray-600 mb-8 text-lg font-medium">
          You don't have access to view this family's calendar.
        </p>
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
        >
          <i class="fas fa-home"></i>
          Back to Dashboard
        </NuxtLink>
      </div>

      <!-- Calendar Content -->
      <div v-else class="space-y-8">
        <!-- Calendar Header -->
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div class="text-center sm:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
              Family Calendar
            </h1>
            <p class="text-gray-600 mt-2 text-lg font-medium">
              {{
                currentFamilyName
                  ? `${currentFamilyName}'s Schedule`
                  : "Family Events & Tasks"
              }}
            </p>
          </div>
          <!-- Family Selector (if user has multiple families) -->
          <div
            v-if="userFamilies.length > 1"
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-6"
          >
            <div
              class="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-layer-group text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Select Family</h3>
                  <p class="text-gray-600 font-medium">
                    Choose which family's calendar to view
                  </p>
                </div>
              </div>
              <select
                v-model="selectedFamilyId"
                @change="switchFamily"
                class="px-5 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-300 transition-all font-medium"
              >
                <option
                  v-for="family in userFamilies"
                  :key="family.id"
                  :value="family.id"
                >
                  {{ family.name }} ({{ family.userRole }})
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="refreshEvents"
              class="flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
              :disabled="isRefreshing"
            >
              <i
                class="fas fa-sync text-lg"
                :class="{ 'animate-spin': isRefreshing }"
              ></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Calendar Card -->
        <div
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 overflow-hidden"
        >
          <ClientOnly>
            <CalendarGrid />
          </ClientOnly>
        </div>

        <!-- Stats Section -->
        <div
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-6"
        >
          <CalendarStats />
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <CalendarEventModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const authStore = useAuthStore();
const { refreshEvents, isRefreshing } = useCalendarEvents();

// Get family ID from route or use current family
const routeFamilyId = route.params.id as string;
const selectedFamilyId = ref(routeFamilyId || authStore.currentFamilyId);

// Computed properties for multi-family support
const userFamilies = computed(() => {
  if (!authStore.families) return [];

  return Object.keys(authStore.families).map((familyId) => {
    const familyData = authStore.families[familyId];

    return {
      id: familyId,
      name: familyData?.name || "Unknown Family", // Now this should work
      userRole: familyData?.role || "member",
      membershipType: familyData?.membershipType || "core",
    };
  });
});

const currentFamilyName = computed(() => {
  if (!selectedFamilyId.value || !authStore.families) return null;
  return authStore.families[selectedFamilyId.value]?.name || null;
});

const hasAccessToCurrentFamily = computed(() => {
  if (!selectedFamilyId.value || !authStore.families) return false;
  return selectedFamilyId.value in authStore.families;
});

const switchFamily = async () => {
  if (!selectedFamilyId.value) return;

  try {
    authStore.setCurrentFamily(selectedFamilyId.value);
    await authStore.loadFamilyMembers();
    await refreshEvents();
  } catch (error) {
    console.error("Error switching family:", error);
  }
};

onMounted(async () => {
  await authStore.initAuth();

  // Set initial family from route or default
  if (routeFamilyId && routeFamilyId in (authStore.families || {})) {
    selectedFamilyId.value = routeFamilyId;
    authStore.setCurrentFamily(routeFamilyId);
  } else if (authStore.currentFamilyId) {
    selectedFamilyId.value = authStore.currentFamilyId;
  }

  // Load family members and events for current family
  if (hasAccessToCurrentFamily.value) {
    await authStore.loadFamilyMembers();
    await refreshEvents();
  }
});

// Watch for route changes to handle direct family calendar links
watch(
  () => route.params.id,
  async (newFamilyId) => {
    if (newFamilyId && newFamilyId in (authStore.families || {})) {
      selectedFamilyId.value = newFamilyId;
      authStore.setCurrentFamily(newFamilyId);
      await authStore.loadFamilyMembers();
      await refreshEvents();
    }
  }
);

useHead({
  title: computed(() =>
    currentFamilyName.value
      ? `Calendar - ${currentFamilyName.value}`
      : "Family Calendar"
  ),
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
