<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <div>
            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
            >
              Memory Capsules
            </h1>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600">
              Private messages to family members for the future
            </p>
          </div>
          <NuxtLink
            v-if="authStore.isAuthenticated && authStore.familyId"
            to="/capsules/create"
            class="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base whitespace-nowrap"
          >
            <i class="fas fa-plus text-xs sm:text-sm"></i>
            <span class="hidden xs:inline">Create New Capsule</span>
            <span class="xs:hidden">New Capsule</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Auth Required State -->
      <div
        v-if="!authStore.isAuthenticated"
        class="text-center py-8 sm:py-12 px-4"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-user-lock text-gray-400 text-xl sm:text-2xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Sign In Required
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
          Please sign in to view your memory capsules.
        </p>
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
        >
          <i class="fas fa-sign-in-alt text-xs sm:text-sm"></i>
          Sign In
        </NuxtLink>
      </div>

      <!-- No Family State -->
      <div
        v-else-if="!authStore.familyId"
        class="text-center py-8 sm:py-12 px-4"
      >
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-users text-gray-400 text-xl sm:text-2xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Join a Family First
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
          You need to be part of a family to use memory capsules.
        </p>
        <NuxtLink
          to="/join-family"
          class="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
        >
          <i class="fas fa-home text-xs sm:text-sm"></i>
          Join a Family
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div
        v-else-if="loading && capsules.length === 0"
        class="text-center py-8 sm:py-12"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-sm sm:text-base text-gray-600 mt-4">
          Loading your memory capsules...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="capsulesError"
        class="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <div class="flex items-start gap-3">
          <i
            class="fas fa-exclamation-triangle text-red-500 text-lg sm:text-xl flex-shrink-0 mt-0.5"
          ></i>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-red-800 text-sm sm:text-base">
              Error Loading Capsules
            </h3>
            <p class="text-red-600 text-xs sm:text-sm mt-1 break-words">
              {{ capsulesError }}
            </p>
          </div>
        </div>
        <button
          @click="loadCapsules"
          class="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm"
        >
          <i class="fas fa-redo text-xs"></i>
          Try Again
        </button>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Stats Cards - Improved Mobile Layout -->
        <div
          class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
        >
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
            >
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-paper-plane text-white text-sm sm:text-lg"></i>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ sentCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm">Sent</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
            >
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-inbox text-white text-sm sm:text-lg"></i>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ receivedCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm">Received</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
            >
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-clock text-white text-sm sm:text-lg"></i>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ scheduledCount }}
                </p>
                <p class="text-gray-600 text-xs sm:text-sm">Scheduled</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4"
            >
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-gift text-white text-sm sm:text-lg"></i>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-xl sm:text-2xl font-bold text-gray-900">
                  1 Free
                </p>
                <p class="text-gray-600 text-xs sm:text-sm">Available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs - Mobile Dropdown, Desktop Tabs -->
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <!-- Mobile Dropdown -->
          <div class="lg:hidden mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Filter by</label
            >
            <div class="relative">
              <select
                v-model="activeTab"
                class="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
                  {{ tab.label }} ({{ tab.count }})
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
          </div>

          <!-- Desktop Tabs -->
          <div class="hidden lg:flex border-b border-gray-200 mb-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              "
            >
              {{ tab.label }} ({{ tab.count }})
            </button>
          </div>

          <!-- Capsules Grid - Better Mobile Spacing -->
          <div
            v-if="filteredCapsules.length > 0"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            <CapsuleCard
              v-for="capsule in filteredCapsules"
              :key="capsule.id"
              :capsule="capsule"
              @view="viewCapsule"
              @cancel="cancelCapsule"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8 sm:py-12 px-4">
            <div
              class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i
                class="fas fa-hourglass-half text-gray-400 text-xl sm:text-2xl"
              ></i>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No {{ activeTabLabel }} capsules
            </h3>
            <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              {{ emptyStateMessage }}
            </p>
            <NuxtLink
              v-if="showCreateButton"
              to="/capsules/create"
              class="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
            >
              <i class="fas fa-plus text-xs sm:text-sm"></i>
              Create Your First Capsule
            </NuxtLink>
          </div>
        </div>

        <!-- How It Works - Stack on Mobile -->
        <div
          class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
        >
          <h2
            class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left"
          >
            How Memory Capsules Work
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div class="text-center">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <i class="fas fa-edit text-white text-lg sm:text-xl"></i>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                1. Write & Choose
              </h3>
              <p class="text-gray-600 text-sm">
                Compose a private message and select a family member to receive
                it
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <i
                  class="fas fa-calendar-alt text-white text-lg sm:text-xl"
                ></i>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                2. Set Future Date
              </h3>
              <p class="text-gray-600 text-sm">
                Choose when you want it delivered - birthdays, anniversaries, or
                special moments
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <i class="fas fa-gift text-white text-lg sm:text-xl"></i>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                3. Surprise Delivery
              </h3>
              <p class="text-gray-600 text-sm">
                Your private message will be automatically delivered as a
                beautiful surprise
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification - Better Mobile Positioning -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50/95 text-red-800 border-red-200': toastType === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-medium flex-1 text-sm sm:text-base">
            {{ toastMessage }}
          </p>
          <button
            @click="showToastMessage = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCapsules } from "~/composables/useCapsules";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const {
  fetchCapsules,
  updateStatus,
  loading,
  error: capsulesError,
} = useCapsules();

const capsules = ref([]);
const activeTab = ref("sent");
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

// Enhanced tabs with short labels for mobile
const tabs = computed(() => [
  {
    id: "sent",
    label: "Sent by You",
    shortLabel: "Sent",
    count: sentCount.value,
  },
  {
    id: "received",
    label: "Received",
    shortLabel: "Received",
    count: receivedCount.value,
  },
  {
    id: "scheduled",
    label: "Scheduled",
    shortLabel: "Scheduled",
    count: scheduledCount.value,
  },
  {
    id: "delivered",
    label: "Delivered",
    shortLabel: "Delivered",
    count: deliveredCount.value,
  },
  {
    id: "all",
    label: "All Capsules",
    shortLabel: "All",
    count: capsules.value.length,
  },
]);

const sentCount = computed(
  () => capsules.value.filter((c) => c.createdBy === authStore.userId).length
);

const receivedCount = computed(
  () =>
    capsules.value.filter(
      (c) => c.recipientId === authStore.userId && c.status === "delivered"
    ).length
);

const scheduledCount = computed(
  () => capsules.value.filter((c) => c.status === "scheduled").length
);

const deliveredCount = computed(
  () => capsules.value.filter((c) => c.status === "delivered").length
);

const activeTabLabel = computed(() => {
  const tab = tabs.value.find((t) => t.id === activeTab.value);
  return tab ? tab.label.toLowerCase().replace(" by you", "") : activeTab.value;
});

const emptyStateMessage = computed(() => {
  switch (activeTab.value) {
    case "sent":
      return "You haven't sent any memory capsules yet. Create your first one to surprise a family member!";
    case "received":
      return "No capsules have been delivered to you yet. You'll see them here once they arrive.";
    case "scheduled":
      return "No capsules are currently scheduled for delivery.";
    case "delivered":
      return "No capsules have been delivered yet.";
    default:
      return "You don't have any memory capsules yet.";
  }
});

const showCreateButton = computed(() => {
  return ["sent", "scheduled", "all"].includes(activeTab.value);
});

const filteredCapsules = computed(() => {
  const allCapsules = capsules.value;

  switch (activeTab.value) {
    case "sent":
      return allCapsules.filter(
        (capsule) => capsule.createdBy === authStore.userId
      );
    case "received":
      return allCapsules.filter(
        (capsule) =>
          capsule.recipientId === authStore.userId &&
          capsule.status === "delivered"
      );
    case "scheduled":
      return allCapsules.filter((capsule) => capsule.status === "scheduled");
    case "delivered":
      return allCapsules.filter((capsule) => capsule.status === "delivered");
    default:
      return allCapsules;
  }
});

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.isAuthenticated && authStore.familyId) {
    await loadCapsules();
  }
});

async function loadCapsules() {
  try {
    capsules.value = await fetchCapsules();
    if (capsulesError.value) {
      showToast(capsulesError.value, "error");
    }
  } catch (error) {
    showToast("Failed to load capsules: " + error.message, "error");
  }
}

async function cancelCapsule(capsule) {
  try {
    await updateStatus(capsule.id, "cancelled");
    const index = capsules.value.findIndex((c) => c.id === capsule.id);
    if (index !== -1) {
      capsules.value[index].status = "cancelled";
    }
    showToast("Capsule delivery cancelled successfully", "success");
  } catch (error) {
    showToast("Error cancelling capsule: " + error.message, "error");
  }
}

function viewCapsule(capsule) {
  navigateTo(`/capsules/${capsule.id}`);
}

function showToast(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
  }, 5000);
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
</style>
