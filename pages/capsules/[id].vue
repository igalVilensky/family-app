<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <!-- Header -->
      <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <NuxtLink
          to="/capsules"
          class="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base"
        >
          <i class="fas fa-arrow-left text-xs sm:text-sm"></i>
          <span class="hidden xs:inline">Back to Capsules</span>
          <span class="xs:inline hidden">Back</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-sm sm:text-base text-gray-600 mt-4">
          Loading capsule...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="capsuleError" class="text-center py-8 sm:py-12 px-4">
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i
            class="fas fa-exclamation-triangle text-red-500 text-xl sm:text-2xl"
          ></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Error Loading Capsule
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-6">
          {{ capsuleError }}
        </p>
        <button
          @click="loadCapsule"
          class="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
        >
          <i class="fas fa-redo text-xs sm:text-sm"></i>
          Try Again
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="capsule" class="space-y-6 sm:space-y-8">
        <!-- Mobile: Single Column Layout -->
        <div class="lg:hidden space-y-4 sm:space-y-6">
          <!-- Status Header Card -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                  :class="statusClass"
                >
                  <i
                    class="text-white text-base sm:text-lg"
                    :class="statusIcon"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h1
                    class="text-xl sm:text-2xl font-bold text-gray-900 truncate"
                  >
                    {{ capsule.title }}
                  </h1>
                  <p class="text-xs sm:text-sm text-gray-500 capitalize">
                    {{ capsule.type }} capsule
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                :class="statusBadgeClass"
              >
                <i class="fas fa-clock text-xs sm:text-sm"></i>
                <span class="hidden xs:inline">{{ statusText }}</span>
                <span class="xs:hidden">{{ daysUntilDelivery }}d</span>
              </span>
              <p class="text-xs sm:text-sm text-gray-500">
                {{ formatDateShort(capsule.deliveryDate) }}
              </p>
            </div>
          </div>

          <!-- Content Card -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 sm:p-8"
          >
            <h2
              class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4"
            >
              Message
            </h2>
            <div
              class="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200"
            >
              <p
                class="text-gray-700 whitespace-pre-wrap text-sm sm:text-base lg:text-lg leading-relaxed"
              >
                {{ capsule.content }}
              </p>
            </div>
          </div>

          <!-- Info Card -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Details
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Created By</p>
                <p
                  class="text-sm sm:text-base font-medium text-gray-900 truncate"
                >
                  {{ capsule.createdByName || "You" }}
                </p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Recipient</p>
                <p
                  class="text-sm sm:text-base font-medium text-gray-900 truncate"
                >
                  {{ capsule.recipientName || "Unknown" }}
                </p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Created On</p>
                <p class="text-sm sm:text-base font-medium text-gray-900">
                  {{ formatDateShort(capsule.createdAt) }}
                </p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Delivery</p>
                <p class="text-sm sm:text-base font-medium text-gray-900">
                  {{ formatDateShort(capsule.deliveryDate) }}
                </p>
              </div>
              <div v-if="capsule.status === 'scheduled'" class="col-span-2">
                <p class="text-xs sm:text-sm text-gray-500 mb-1">
                  Time Until Delivery
                </p>
                <p class="text-sm sm:text-base font-medium text-amber-600">
                  {{ daysUntilDelivery }} days
                </p>
              </div>
            </div>
          </div>

          <!-- Mobile Actions Card -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-if="capsule.status === 'scheduled'"
                @click="editCapsule"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <i
                  class="fas fa-edit text-sm group-hover:scale-110 transition-transform"
                ></i>
                <span>Edit</span>
              </button>

              <button
                v-if="capsule.status === 'scheduled'"
                @click="cancelCapsule"
                :disabled="cancelling"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <i
                  class="fas fa-times text-sm group-hover:scale-110 transition-transform"
                  :class="{ 'animate-spin': cancelling }"
                ></i>
                <span>{{ cancelling ? "Cancelling..." : "Cancel" }}</span>
              </button>

              <button
                v-if="capsule.status === 'cancelled'"
                @click="restoreCapsule"
                :disabled="restoring"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <i
                  class="fas fa-undo text-sm group-hover:scale-110 transition-transform"
                ></i>
                <span>{{ restoring ? "Restoring..." : "Restore" }}</span>
              </button>

              <button
                @click="createSimilar"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <i
                  class="fas fa-copy text-sm group-hover:scale-110 transition-transform"
                ></i>
                <span>Create Similar</span>
              </button>

              <button
                @click="downloadCapsule"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <i
                  class="fas fa-download text-sm group-hover:scale-110 transition-transform"
                ></i>
                <span>Download PDF</span>
              </button>

              <button
                @click="shareCapsule"
                class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 sm:col-span-2"
              >
                <i
                  class="fas fa-share text-sm group-hover:scale-110 transition-transform"
                ></i>
                <span>Share Capsule</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop: Two Column Layout -->
        <div class="hidden lg:grid lg:grid-cols-3 gap-8">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Header -->
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
            >
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
              <div
                class="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6"
              >
                <p
                  class="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed"
                >
                  {{ capsule.content }}
                </p>
              </div>

              <!-- Desktop Actions -->
              <div class="bg-white rounded-2xl p-6 border border-gray-200/60">
                <h3 class="font-semibold text-gray-900 mb-4">Actions</h3>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    v-if="capsule.status === 'scheduled'"
                    @click="editCapsule"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    <i
                      class="fas fa-edit text-sm group-hover:scale-110 transition-transform"
                    ></i>
                    <span>Edit Capsule</span>
                  </button>

                  <button
                    v-if="capsule.status === 'scheduled'"
                    @click="cancelCapsule"
                    :disabled="cancelling"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <i
                      class="fas fa-times text-sm group-hover:scale-110 transition-transform"
                      :class="{ 'animate-spin': cancelling }"
                    ></i>
                    <span>{{
                      cancelling ? "Cancelling..." : "Cancel Delivery"
                    }}</span>
                  </button>

                  <button
                    v-if="capsule.status === 'cancelled'"
                    @click="restoreCapsule"
                    :disabled="restoring"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <i
                      class="fas fa-undo text-sm group-hover:scale-110 transition-transform"
                    ></i>
                    <span>{{
                      restoring ? "Restoring..." : "Restore Capsule"
                    }}</span>
                  </button>

                  <button
                    @click="createSimilar"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    <i
                      class="fas fa-copy text-sm group-hover:scale-110 transition-transform"
                    ></i>
                    <span>Create Similar</span>
                  </button>

                  <button
                    @click="downloadCapsule"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    <i
                      class="fas fa-download text-sm group-hover:scale-110 transition-transform"
                    ></i>
                    <span>Download PDF</span>
                  </button>

                  <button
                    @click="shareCapsule"
                    class="group flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 col-span-2"
                  >
                    <i
                      class="fas fa-share text-sm group-hover:scale-110 transition-transform"
                    ></i>
                    <span>Share Capsule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
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
                  <p class="text-sm text-gray-500 mb-1">Recipient</p>
                  <p class="font-medium text-gray-900">
                    {{ capsule.recipientName || "Unknown" }}
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
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-8 sm:py-12 px-4">
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i
            class="fas fa-exclamation-triangle text-gray-400 text-xl sm:text-2xl"
          ></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Capsule Not Found
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
          The memory capsule you're looking for doesn't exist or you don't have
          access to it.
        </p>
        <NuxtLink
          to="/capsules"
          class="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
        >
          <i class="fas fa-arrow-left text-xs sm:text-sm"></i>
          Back to Capsules
        </NuxtLink>
      </div>
    </main>

    <!-- Toast Notification -->
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

function formatDateShort(date) {
  if (!date) return "Unknown";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
