<!-- pages/calendar.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
  >
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Family Selector (if user has multiple families) -->
      <div
        v-if="userFamilies.length > 1"
        class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-layer-group text-white"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Select Family</h3>
              <p class="text-sm text-gray-600">
                Choose which family's calendar to view
              </p>
            </div>
          </div>
          <select
            v-model="selectedFamilyId"
            @change="switchFamily"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      <!-- No Family Access Message -->
      <div
        v-if="!hasAccessToCurrentFamily"
        class="bg-white rounded-xl shadow-sm border border-amber-200 p-8 text-center"
      >
        <div
          class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-calendar-times text-amber-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          No Family Access
        </h3>
        <p class="text-gray-600 mb-6">
          You don't have access to view this family's calendar.
        </p>
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          <i class="fas fa-home text-sm"></i>
          Back to Dashboard
        </NuxtLink>
      </div>

      <!-- Calendar Content -->
      <div v-else>
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
              Family Calendar
            </h1>
            <p class="text-gray-600 mt-1">
              {{
                currentFamilyName
                  ? `${currentFamilyName}'s Schedule`
                  : "Family Events & Tasks"
              }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshEvents"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
              :disabled="isRefreshing"
            >
              <i
                class="fas fa-sync text-gray-600"
                :class="{ 'animate-spin': isRefreshing }"
              ></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Calendar Card -->
        <div class="bg-white rounded-xl shadow-xl overflow-hidden">
          <ClientOnly>
            <CalendarGrid />
          </ClientOnly>
        </div>

        <CalendarStats />
      </div>
    </div>

    <CalendarEventModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
  return Object.keys(authStore.families).map((familyId) => ({
    id: familyId,
    name: authStore.families[familyId]?.name || "Unknown Family",
    userRole: authStore.families[familyId]?.role || "member",
  }));
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
