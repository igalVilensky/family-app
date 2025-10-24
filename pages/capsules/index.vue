<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Family Header -->
    <div class="bg-white/90 backdrop-blur-sm border-b-2 border-orange-200">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-rose-50 rounded-full shadow-sm border-2 border-orange-200"
            >
              <i class="fas fa-home text-orange-500"></i>
              <span class="font-bold text-gray-800">{{
                authStore.currentFamilyName || "Family Capsules"
              }}</span>
            </div>
            <!-- Family Selector -->
            <div
              v-if="
                authStore.hasFamily &&
                Object.keys(authStore.families).length > 1
              "
              class="relative"
            >
              <select
                v-model="selectedFamilyId"
                @change="switchFamily"
                class="px-4 py-2 bg-white border-2 border-gray-200 rounded-full font-bold text-gray-700 cursor-pointer appearance-none pr-8 hover:border-orange-300 transition-all"
              >
                <option
                  v-for="familyId in Object.keys(authStore.families)"
                  :key="familyId"
                  :value="familyId"
                >
                  {{ getFamilyName(familyId) }}
                </option>
              </select>
              <i
                class="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
              ></i>
            </div>
          </div>
          <div
            class="text-sm font-bold text-gray-700 bg-white/80 px-3 py-1.5 rounded-full border border-gray-200"
          >
            {{ familyMembers.length }} family members
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div class="text-center lg:text-left">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Memory Capsules
          </h1>
          <p class="text-xl text-gray-600 font-medium max-w-2xl">
            Private messages to
            {{ authStore.currentFamilyName || "family" }} members for the future
          </p>
        </div>
        <NuxtLink
          v-if="authStore.isAuthenticated && authStore.hasFamily"
          to="/capsules/create"
          class="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
        >
          <i class="fas fa-plus"></i>
          <span>Create New Capsule</span>
        </NuxtLink>
      </div>

      <!-- Auth Required State -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12">
        <div
          class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <i class="fas fa-user-lock text-white text-3xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h3>
        <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto font-medium">
          Please sign in to view your memory capsules.
        </p>
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
        >
          <i class="fas fa-sign-in-alt"></i>
          Sign In
        </NuxtLink>
      </div>

      <!-- No Family State -->
      <div v-else-if="!authStore.hasFamily" class="text-center py-12">
        <div
          class="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <i class="fas fa-users text-white text-3xl"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">
          Join a Family First
        </h3>
        <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto font-medium">
          You need to be part of a family to use memory capsules.
        </p>
        <NuxtLink
          to="/family-setup"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
        >
          <i class="fas fa-home"></i>
          Setup Family
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div
        v-else-if="loading && capsules.length === 0"
        class="text-center py-12"
      >
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div
            class="absolute inset-0 border-4 border-orange-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="text-gray-600 text-lg font-medium">
          Loading memory capsules for {{ authStore.currentFamilyName }}...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="capsulesError"
        class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-3xl p-6"
      >
        <div class="flex items-start gap-4">
          <i
            class="fas fa-exclamation-triangle text-red-500 text-2xl flex-shrink-0 mt-1"
          ></i>
          <div class="flex-1">
            <h3 class="font-bold text-red-800 text-xl mb-2">
              Error Loading Capsules
            </h3>
            <p class="text-red-600 text-base break-words">
              {{ capsulesError }}
            </p>
          </div>
        </div>
        <button
          @click="loadCapsules"
          class="mt-4 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg transform hover:-translate-y-1"
        >
          <i class="fas fa-redo"></i>
          Try Again
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-paper-plane text-white text-xl"></i>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900">{{ sentCount }}</p>
                <p class="text-gray-600 font-bold">Sent</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-inbox text-white text-xl"></i>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900">
                  {{ receivedCount }}
                </p>
                <p class="text-gray-600 font-bold">Received</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-amber-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-clock text-white text-xl"></i>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900">
                  {{ scheduledCount }}
                </p>
                <p class="text-gray-600 font-bold">Scheduled</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-gift text-white text-xl"></i>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900">1 Free</p>
                <p class="text-gray-600 font-bold">Available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs and Capsules Content -->
        <div
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-6 md:p-8"
        >
          <!-- Mobile Dropdown -->
          <div class="lg:hidden mb-6">
            <label class="block text-lg font-bold text-gray-700 mb-3"
              >Filter by</label
            >
            <div class="relative">
              <select
                v-model="activeTab"
                class="w-full appearance-none bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 pr-12 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300"
              >
                <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
                  {{ tab.label }} ({{ tab.count }})
                </option>
              </select>
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Desktop Tabs -->
          <div class="hidden lg:flex border-b-2 border-gray-200 mb-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-8 py-4 font-bold text-base border-b-2 transition-all duration-200 whitespace-nowrap hover:bg-orange-50 hover:text-orange-600"
              :class="
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500'
              "
            >
              {{ tab.label }} ({{ tab.count }})
            </button>
          </div>

          <!-- Capsules Grid -->
          <div
            v-if="filteredCapsules.length > 0"
            class="grid grid-cols-1 lg:grid-cols-2 gap-6"
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
          <div v-else class="text-center py-12">
            <div
              class="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <i class="fas fa-hourglass-half text-white text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">
              No {{ activeTabLabel }} capsules
            </h3>
            <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto font-medium">
              {{ emptyStateMessage }}
            </p>
            <NuxtLink
              v-if="showCreateButton"
              to="/capsules/create"
              class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
            >
              <i class="fas fa-plus"></i>
              Create Your First Capsule
            </NuxtLink>
          </div>
        </div>

        <!-- How It Works -->
        <div
          class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-8"
        >
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
            How Memory Capsules Work
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center group">
              <div
                class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-200"
              >
                <i class="fas fa-edit text-white text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 mb-3 text-xl">
                1. Write & Choose
              </h3>
              <p class="text-gray-600 text-base font-medium">
                Compose a private message and select a family member to receive
                it
              </p>
            </div>
            <div class="text-center group">
              <div
                class="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-200"
              >
                <i class="fas fa-calendar-alt text-white text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 mb-3 text-xl">
                2. Set Future Date
              </h3>
              <p class="text-gray-600 text-base font-medium">
                Choose when you want it delivered - birthdays, anniversaries, or
                special moments
              </p>
            </div>
            <div class="text-center group">
              <div
                class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-200"
              >
                <i class="fas fa-gift text-white text-2xl"></i>
              </div>
              <h3 class="font-bold text-gray-900 mb-3 text-xl">
                3. Surprise Delivery
              </h3>
              <p class="text-gray-600 text-base font-medium">
                Your private message will be automatically delivered as a
                beautiful surprise
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-5 rounded-2xl shadow-xl border-2 backdrop-blur-sm"
        :class="{
          'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300':
            toastType === 'success',
          'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300':
            toastType === 'error',
        }"
      >
        <div class="flex items-center gap-4">
          <i
            class="text-xl flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-bold flex-1 text-lg">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCapsules } from "~/composables/useCapsules";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const {
  fetchCapsules,
  updateStatus,
  loading,
  error: capsulesError,
  getCurrentFamilyId,
} = useCapsules();

const capsules = ref([]);
const activeTab = ref("sent");
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const selectedFamilyId = ref(authStore.currentFamilyId);

// Computed
const familyMembers = computed(() => authStore.familyMembers || []);

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

// Methods
const getFamilyName = (familyId) => {
  if (familyId === authStore.currentFamilyId) {
    return authStore.currentFamilyName || "Family";
  }
  return "Family";
};

const switchFamily = async () => {
  try {
    await authStore.setCurrentFamily(selectedFamilyId.value);
    await loadCapsules();
    showToast(`Switched to ${authStore.currentFamilyName} capsules`, "success");
  } catch (error) {
    console.error("Error switching family:", error);
    showToast("Failed to switch family", "error");
  }
};

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

// Watch for family changes
watch(
  () => authStore.currentFamilyId,
  (newFamilyId) => {
    if (newFamilyId) {
      selectedFamilyId.value = newFamilyId;
      loadCapsules();
    }
  }
);

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.isAuthenticated && authStore.hasFamily) {
    await authStore.loadFamilyMembers();
    await loadCapsules();
  }
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

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
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
</style>
