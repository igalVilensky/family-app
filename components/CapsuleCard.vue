<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 hover:shadow-md transition-all duration-300 group"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="statusClass"
        >
          <i class="text-white text-lg" :class="statusIcon"></i>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 text-lg">
            {{ capsule.title }}
          </h3>
          <p class="text-sm text-gray-500">
            <span v-if="capsule.isReceived"
              >From {{ capsule.createdByName }}</span
            >
            <span v-else>To {{ capsule.recipientName }}</span>
          </p>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center gap-2 text-sm" :class="countdownClass">
          <i class="fas fa-clock"></i>
          <span v-if="capsule.status === 'scheduled'">
            {{ capsule.daysUntilDelivery }} days
          </span>
          <span v-else class="capitalize">{{ capsule.status }}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          {{ formatDate(capsule.deliveryDate) }}
        </p>
      </div>
    </div>

    <!-- Content Preview - HIDDEN for scheduled received capsules -->
    <div v-if="canShowContent" class="mb-4">
      <p class="text-gray-600 line-clamp-3 text-sm">{{ capsule.content }}</p>
    </div>
    <div v-else class="mb-4">
      <div
        class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center"
      >
        <i class="fas fa-lock text-amber-500 text-lg mb-2"></i>
        <p class="text-amber-700 text-sm font-medium">
          This capsule will be unlocked on the delivery date
        </p>
        <p class="text-amber-600 text-xs mt-1">
          {{ formatDate(capsule.deliveryDate) }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="flex items-center justify-between pt-4 border-t border-gray-100"
    >
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <i
          class="fas"
          :class="capsule.isReceived ? 'fa-inbox' : 'fa-paper-plane'"
        ></i>
        <span>{{ capsule.isReceived ? "Received" : "Sent" }}</span>
      </div>
      <button
        v-if="capsule.canView"
        @click="$emit('view', capsule)"
        class="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium text-sm group-hover:bg-blue-50"
      >
        <i class="fas fa-eye text-sm"></i>
        View Details
      </button>
      <div v-else class="text-sm text-gray-400">
        <i class="fas fa-lock"></i>
        Locked until delivery
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  capsule: {
    type: Object,
    required: true,
  },
});

defineEmits(["view", "cancel"]);

const canShowContent = computed(() => {
  // Creator can always see content
  if (props.capsule.createdBy === props.capsule.currentUserId) return true;

  // Recipient can see content only after delivery
  if (props.capsule.recipientId === props.capsule.currentUserId) {
    return props.capsule.status === "delivered"; // This should be TRUE for delivered capsules
  }

  return false;
});

const statusClass = computed(() => {
  switch (props.capsule.status) {
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
  switch (props.capsule.status) {
    case "scheduled":
      return "fas fa-time";
    case "delivered":
      return "fas fa-check";
    case "cancelled":
      return "fas fa-ban";
    default:
      return "fas fa-time";
  }
});

const countdownClass = computed(() => {
  if (props.capsule.status !== "scheduled") return "text-gray-500";

  if (props.capsule.daysUntilDelivery <= 7) {
    return "text-amber-600 font-semibold";
  } else if (props.capsule.daysUntilDelivery <= 30) {
    return "text-blue-600";
  } else {
    return "text-gray-500";
  }
});

const formatDate = (date) => {
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
