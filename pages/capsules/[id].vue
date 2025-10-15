<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink
          to="/capsules"
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Capsules
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-600 mt-4">Loading capsule...</p>
      </div>

      <div v-else-if="capsuleError" class="text-center py-12">
        <div
          class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Capsule
        </h3>
        <p class="text-gray-600 mb-6">{{ capsuleError }}</p>
        <button
          @click="loadCapsule"
          class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg"
        >
          <i class="fas fa-redo text-sm"></i>
          Try Again
        </button>
      </div>

      <div v-else-if="capsule" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
          >
            <!-- Status Badge -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="statusClass"
                >
                  <i class="text-white text-lg" :class="statusIcon"></i>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">
                    {{ capsule.title }}
                  </h1>
                  <p class="text-gray-500 capitalize">
                    {{ capsule.type }} capsule
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  :class="statusBadgeClass"
                >
                  <i class="fas fa-clock text-sm"></i>
                  {{ statusText }}
                </span>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatDate(capsule.deliveryDate) }}
                </p>
              </div>
            </div>

            <!-- Content -->
            <div class="prose max-w-none">
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p
                  class="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed"
                >
                  {{ capsule.content }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200"
            >
              <button
                v-if="capsule.status === 'scheduled'"
                @click="editCapsule"
                class="flex items-center gap-2 px-6 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium"
              >
                <i class="fas fa-edit text-sm"></i>
                Edit Capsule
              </button>
              <button
                v-if="capsule.status === 'scheduled'"
                @click="cancelCapsule"
                :disabled="cancelling"
                class="flex items-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i
                  class="fas fa-times text-sm"
                  :class="{ 'animate-spin': cancelling }"
                ></i>
                {{ cancelling ? "Cancelling..." : "Cancel Delivery" }}
              </button>
              <button
                @click="shareCapsule"
                class="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium ml-auto"
              >
                <i class="fas fa-share text-sm"></i>
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Capsule Info -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="font-semibold text-gray-900 mb-4">
              Capsule Information
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Created By</p>
                <p class="font-medium text-gray-900">
                  {{ capsule.createdByName || "You" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Created On</p>
                <p class="font-medium text-gray-900">
                  {{ formatDate(capsule.createdAt) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Scheduled Delivery</p>
                <p class="font-medium text-gray-900">
                  {{ formatDate(capsule.deliveryDate) }}
                </p>
              </div>
              <div v-if="capsule.status === 'scheduled'">
                <p class="text-sm text-gray-500 mb-1">Time Until Delivery</p>
                <p class="font-medium text-amber-600">
                  {{ daysUntilDelivery }} days
                </p>
              </div>
              <div v-if="capsule.updatedAt">
                <p class="text-sm text-gray-500 mb-1">Last Updated</p>
                <p class="font-medium text-gray-900">
                  {{ formatDate(capsule.updatedAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Delivery Status -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Delivery Status</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">
                    Capsule Created
                  </p>
                  <p class="text-gray-500 text-xs">
                    {{ formatDate(capsule.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                  :class="
                    capsule.status === 'delivered'
                      ? 'bg-green-100 border-green-500'
                      : capsule.status === 'cancelled'
                      ? 'bg-red-100 border-red-500'
                      : 'bg-gray-100 border-gray-300'
                  "
                >
                  <i
                    class="text-sm"
                    :class="
                      capsule.status === 'delivered'
                        ? 'fas fa-check text-green-600'
                        : capsule.status === 'cancelled'
                        ? 'fas fa-times text-red-600'
                        : 'fas fa-clock text-gray-400'
                    "
                  ></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">
                    Scheduled Delivery
                  </p>
                  <p class="text-gray-500 text-xs">
                    {{ formatDate(capsule.deliveryDate) }}
                  </p>
                  <p
                    v-if="capsule.status === 'delivered'"
                    class="text-green-600 text-xs font-medium"
                  >
                    Delivered
                  </p>
                  <p
                    v-else-if="capsule.status === 'cancelled'"
                    class="text-red-600 text-xs font-medium"
                  >
                    Cancelled
                  </p>
                  <p v-else class="text-amber-600 text-xs font-medium">
                    Scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                @click="createSimilar"
                class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium text-left"
              >
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-copy text-blue-600"></i>
                </div>
                <span>Create Similar Capsule</span>
              </button>
              <button
                @click="downloadCapsule"
                class="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium text-left"
              >
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-download text-green-600"></i>
                </div>
                <span>Download as PDF</span>
              </button>
              <button
                v-if="capsule.status === 'cancelled'"
                @click="restoreCapsule"
                :disabled="restoring"
                class="w-full flex items-center gap-3 px-4 py-3 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-all duration-200 font-medium text-left disabled:opacity-50"
              >
                <div
                  class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-undo text-amber-600"></i>
                </div>
                <span>{{
                  restoring ? "Restoring..." : "Restore Capsule"
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Capsule Not Found
        </h3>
        <p class="text-gray-600 mb-6">
          The memory capsule you're looking for doesn't exist or you don't have
          access to it.
        </p>
        <NuxtLink
          to="/capsules"
          class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Capsules
        </NuxtLink>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50/95 text-red-800 border-red-200': toastType === 'error',
          'bg-blue-50/95 text-blue-800 border-blue-200': toastType === 'info',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
              'fas fa-info-circle text-blue-500': toastType === 'info',
            }"
          ></i>
          <p class="font-medium flex-1">{{ toastMessage }}</p>
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
import { useRoute } from "vue-router";
import { useCapsules } from "~/composables/useCapsules";

const route = useRoute();
const capsuleId = route.params.id;
const { fetchCapsuleById, updateStatus, calculateDaysUntil } = useCapsules();

const capsule = ref(null);
const loading = ref(true);
const cancelling = ref(false);
const restoring = ref(false);
const capsuleError = ref(null);
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const statusClass = computed(() => {
  if (!capsule.value) return "";
  switch (capsule.value.status) {
    case "scheduled":
      return "bg-gradient-to-br from-blue-500 to-cyan-600";
    case "delivered":
      return "bg-gradient-to-br from-green-500 to-emerald-600";
    case "cancelled":
      return "bg-gradient-to-br from-gray-400 to-gray-500";
    default:
      return "bg-gradient-to-br from-blue-500 to-cyan-600";
  }
});

const statusIcon = computed(() => {
  if (!capsule.value) return "";
  switch (capsule.value.status) {
    case "scheduled":
      return "fas fa-clock";
    case "delivered":
      return "fas fa-check";
    case "cancelled":
      return "fas fa-ban";
    default:
      return "fas fa-clock";
  }
});

const statusBadgeClass = computed(() => {
  if (!capsule.value) return "";
  switch (capsule.value.status) {
    case "scheduled":
      return "bg-amber-100 text-amber-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
});

const statusText = computed(() => {
  if (!capsule.value) return "";
  switch (capsule.value.status) {
    case "scheduled":
      return `Delivery in ${daysUntilDelivery.value} days`;
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Scheduled";
  }
});

const daysUntilDelivery = computed(() => {
  if (!capsule.value || capsule.value.status !== "scheduled") return 0;
  return calculateDaysUntil(capsule.value.deliveryDate);
});

onMounted(async () => {
  await loadCapsule();
});

async function loadCapsule() {
  try {
    loading.value = true;
    capsuleError.value = null;

    // Use the proper function to get capsule by ID
    const foundCapsule = await fetchCapsuleById(capsuleId);
    capsule.value = foundCapsule;
  } catch (error) {
    capsuleError.value = "Error loading capsule: " + error.message;
    showToast(capsuleError.value, "error");
  } finally {
    loading.value = false;
  }
}

async function cancelCapsule() {
  try {
    cancelling.value = true;
    await updateStatus(capsuleId, "cancelled");
    capsule.value.status = "cancelled";
    showToast("Capsule delivery cancelled successfully", "success");
  } catch (error) {
    showToast("Error cancelling capsule: " + error.message, "error");
  } finally {
    cancelling.value = false;
  }
}

async function restoreCapsule() {
  try {
    restoring.value = true;
    await updateStatus(capsuleId, "scheduled");
    capsule.value.status = "scheduled";
    showToast("Capsule restored successfully", "success");
  } catch (error) {
    showToast("Error restoring capsule: " + error.message, "error");
  } finally {
    restoring.value = false;
  }
}

function editCapsule() {
  showToast("Edit feature coming soon!", "info");
  // navigateTo(`/capsules/${capsuleId}/edit`);
}

function shareCapsule() {
  showToast("Share feature coming soon!", "info");
}

function createSimilar() {
  navigateTo("/capsules/create");
}

function downloadCapsule() {
  showToast("PDF download feature coming soon!", "info");
}

function formatDate(date) {
  if (!date) return "Unknown";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
