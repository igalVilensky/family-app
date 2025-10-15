<template>
  <div
    class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 hover:shadow-md transition-all duration-300 group"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4 gap-3">
      <div class="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
        <div
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
          :class="statusClass"
        >
          <i class="text-white text-base sm:text-lg" :class="statusIcon"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 text-base sm:text-lg truncate">
            {{ capsule.title }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-500 truncate">
            <span v-if="capsule.isReceived"
              >From {{ capsule.createdByName }}</span
            >
            <span v-else>To {{ capsule.recipientName }}</span>
          </p>
        </div>
      </div>

      <div class="text-right flex-shrink-0">
        <div
          class="flex items-center justify-end gap-1.5 sm:gap-2 text-xs sm:text-sm"
          :class="countdownClass"
        >
          <i class="fas fa-clock"></i>
          <span v-if="capsule.status === 'scheduled'" class="whitespace-nowrap">
            {{ capsule.daysUntilDelivery }}d
          </span>
          <span v-else class="capitalize whitespace-nowrap">{{
            capsule.status
          }}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          {{ formatDate(capsule.deliveryDate) }}
        </p>
      </div>
    </div>

    <!-- Content Preview - HIDDEN for scheduled received capsules -->
    <div v-if="canShowContent" class="mb-4">
      <p
        class="text-gray-600 line-clamp-3 text-sm sm:text-base leading-relaxed"
      >
        {{ capsule.content }}
      </p>
    </div>
    <div v-else class="mb-4">
      <div
        class="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 text-center"
      >
        <i class="fas fa-lock text-amber-500 text-base sm:text-lg mb-2"></i>
        <p class="text-amber-700 text-xs sm:text-sm font-medium">
          This capsule will be unlocked on the delivery date
        </p>
        <p class="text-amber-600 text-xs mt-1">
          {{ formatDate(capsule.deliveryDate) }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 pt-4 border-t border-gray-100"
    >
      <div
        class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 justify-center xs:justify-start"
      >
        <i
          class="fas"
          :class="capsule.isReceived ? 'fa-inbox' : 'fa-paper-plane'"
        ></i>
        <span>{{ capsule.isReceived ? "Received" : "Sent" }}</span>
      </div>

      <button
        v-if="capsule.canView"
        @click="$emit('view', capsule)"
        class="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm group-hover:bg-blue-50"
      >
        <i class="fas fa-eye text-xs sm:text-sm"></i>
        View Details
      </button>

      <div
        v-else
        class="flex items-center justify-center xs:justify-end gap-2 text-xs sm:text-sm text-gray-400"
      >
        <i class="fas fa-lock"></i>
        <span class="hidden xs:inline">Locked until delivery</span>
        <span class="xs:hidden">Locked</span>
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
  const currentUserId = props.capsule.currentUserId;

  // 1. Creator can ALWAYS see content (they wrote it!)
  if (props.capsule.createdBy === currentUserId) return true;

  // 2. Recipient can see content if delivery date has passed
  if (props.capsule.recipientId === currentUserId) {
    const now = new Date();
    const deliveryDate = props.capsule.deliveryDate.toDate
      ? props.capsule.deliveryDate.toDate()
      : new Date(props.capsule.deliveryDate);
    return deliveryDate <= now;
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
      return "fas fa-hourglass-half";
    case "delivered":
      return "fas fa-check";
    case "cancelled":
      return "fas fa-ban";
    default:
      return "fas fa-hourglass-half";
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

@media (min-width: 475px) {
  .xs\:flex-row {
    flex-direction: row;
  }

  .xs\:items-center {
    align-items: center;
  }

  .xs\:justify-start {
    justify-content: flex-start;
  }

  .xs\:justify-end {
    justify-content: flex-end;
  }

  .xs\:inline {
    display: inline;
  }

  .xs\:hidden {
    display: none;
  }
}
</style>
