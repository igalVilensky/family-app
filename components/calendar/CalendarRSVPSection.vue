<template>
  <div
    v-if="
      currentEvent &&
      currentEvent.rsvps &&
      (mode === 'view' || mode === 'edit') &&
      form.eventType === 'event'
    "
  >
    <label class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
      <i class="fas fa-clipboard-check text-gray-500 mr-2"></i>
      RSVPs
    </label>
    <div
      class="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200"
    >
      <div
        v-for="(status, userId) in currentEvent.rsvps"
        :key="userId"
        class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
      >
        <div
          class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          @click="goToUserProfile(userId)"
        >
          <div :class="`w-2 h-2 rounded-full ${getRSVPColor(status)}`"></div>
          <span class="text-sm font-medium text-gray-900 hover:text-blue-600">
            {{ getMemberName(userId) }}
          </span>
        </div>
        <span
          :class="`px-3 py-1 rounded-full text-xs font-semibold ${getRSVPBadgeClass(
            status
          )}`"
        >
          {{
            status
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : "Pending"
          }}
        </span>
      </div>
    </div>

    <!-- RSVP Buttons (for self, even in edit mode if desired) -->
    <div v-if="mode === 'edit' || mode === 'view'" class="mt-4">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        Your Response
      </label>
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="handleSetRSVP('yes')"
          class="flex flex-col items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
        >
          <i class="fas fa-check-circle text-2xl mb-1"></i>
          <span class="text-sm">Yes</span>
        </button>
        <button
          type="button"
          @click="handleSetRSVP('maybe')"
          class="flex flex-col items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
        >
          <i class="fas fa-question-circle text-2xl mb-1"></i>
          <span class="text-sm">Maybe</span>
        </button>
        <button
          type="button"
          @click="handleSetRSVP('no')"
          class="flex flex-col items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
        >
          <i class="fas fa-times-circle text-2xl mb-1"></i>
          <span class="text-sm">No</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const authStore = useAuthStore();
const { mode, currentEvent } = useCalendarModal();
const { form } = useCalendarForm();

// Get parent modal component to call handleSetRSVP
const modal = inject("calendarModal") as any;

const getRSVPColor = (status: string | null) => {
  if (status === "yes") return "bg-green-500";
  if (status === "no") return "bg-red-500";
  if (status === "maybe") return "bg-yellow-500";
  return "bg-gray-400";
};

const getRSVPBadgeClass = (status: string | null) => {
  if (status === "yes") return "bg-green-100 text-green-800";
  if (status === "no") return "bg-red-100 text-red-800";
  if (status === "maybe") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const getMemberName = (userId: string) => {
  const member = authStore.familyMembers.find((m) => m.userId === userId);
  return member ? member.name || member.email : "Unknown";
};

const goToUserProfile = (userId: string) => {
  if (userId === authStore.userId) {
    router.push("/profile");
  } else {
    router.push(`/user/${userId}`);
  }
};

const handleSetRSVP = async (status: string) => {
  if (modal && modal.handleSetRSVP) {
    await modal.handleSetRSVP(status);
  }
};
</script>
