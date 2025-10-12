<template>
  <div class="space-y-4">
    <!-- Event Type Selection -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Event Type
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          @click="form.eventType = 'event'"
          :class="[
            'p-3 rounded-lg border-2 transition-all text-center',
            form.eventType === 'event'
              ? 'border-amber-500 bg-amber-50 text-amber-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
          ]"
        >
          <i class="fas fa-calendar-day mb-1"></i>
          <div class="text-sm font-medium">Event</div>
        </button>
        <button
          type="button"
          @click="form.eventType = 'task'"
          :class="[
            'p-3 rounded-lg border-2 transition-all text-center',
            form.eventType === 'task'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
          ]"
        >
          <i class="fas fa-tasks mb-1"></i>
          <div class="text-sm font-medium">Task</div>
        </button>
      </div>
    </div>

    <!-- Event Category Selection -->
    <div v-if="mode !== 'view' && form.eventType === 'event'">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Event Category
      </label>
      <div
        class="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl"
      >
        <button
          v-for="type in eventTypes"
          :key="type.value"
          type="button"
          @click="
            form.eventCategory = type.value;
            form.color = type.color;
          "
          :class="[
            'p-2 rounded-lg border-2 transition-all text-center group',
            form.eventCategory === type.value
              ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
          ]"
        >
          <i :class="`fas ${type.icon} mb-1 text-lg`"></i>
          <div class="text-xs font-medium truncate">
            {{ type.label }}
          </div>
        </button>
      </div>
    </div>

    <!-- Title Input -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        {{ form.eventType === "task" ? "Task Title" : "Event Title" }}
        <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.title"
        type="text"
        required
        :disabled="mode === 'view'"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all text-base"
        :placeholder="
          form.eventType === 'task'
            ? 'e.g., Grocery shopping, Homework'
            : 'e.g., Family Dinner, Movie Night'
        "
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Description
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        :disabled="mode === 'view'"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all text-base resize-none"
        :placeholder="
          form.eventType === 'task'
            ? 'Add task details...'
            : 'Add details about the event...'
        "
      ></textarea>
    </div>

    <!-- Color Selection -->
    <div v-if="mode !== 'view'">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Color
      </label>
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="color in eventColors"
          :key="color.value"
          type="button"
          @click="form.color = color.value"
          :class="[
            'w-8 h-8 rounded-full border-2 transition-all',
            form.color === color.value
              ? 'border-gray-800 scale-110'
              : 'border-gray-300 hover:scale-105',
          ]"
          :style="`background-color: ${color.hex}`"
          :title="color.name"
        ></button>
      </div>
    </div>

    <!-- Location -->
    <div v-if="form.eventType === 'event'">
      <label
        class="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between"
      >
        <div class="flex items-center">
          <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
          Location
        </div>
        <button
          v-if="mode !== 'view'"
          type="button"
          @click="detectLocation"
          :disabled="isDetectingLocation"
          class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          <i
            :class="`fas fa-location-arrow mr-1 ${
              isDetectingLocation ? 'animate-pulse' : ''
            }`"
          ></i>
          Detect
        </button>
      </label>
      <input
        v-model="form.location"
        type="text"
        :disabled="mode === 'view'"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all text-base"
        placeholder="e.g., Home, Park, Restaurant"
      />
    </div>

    <!-- Date/Time Inputs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          class="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
        >
          <i class="fas fa-play-circle text-gray-500 mr-2"></i>
          {{ form.eventType === "task" ? "Due Date" : "Start Date & Time" }}
          <span class="text-red-500 ml-1">*</span>
        </label>
        <input
          v-model="form.startDate"
          type="datetime-local"
          required
          :disabled="mode === 'view'"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all text-base"
        />
      </div>
      <div v-if="form.eventType === 'event'">
        <label
          class="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
        >
          <i class="fas fa-stop-circle text-gray-500 mr-2"></i>
          End Date & Time
        </label>
        <input
          v-model="form.endDate"
          type="datetime-local"
          :disabled="mode === 'view'"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all text-base"
        />
      </div>
    </div>

    <!-- Recurring Events -->
    <div v-if="form.eventType === 'event' && mode !== 'view'">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="fas fa-repeat text-gray-500 mr-2"></i>
        Repeat
      </label>
      <select
        v-model="form.recurrence"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
      >
        <option value="none">Does not repeat</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>

    <!-- Task Status -->
    <div v-if="form.eventType === 'task' && mode !== 'view'">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Status
      </label>
      <select
        v-model="form.taskStatus"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Attendees Selection (Create/Edit) -->
    <div v-if="mode !== 'view' && form.eventType === 'event'">
      <label
        class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
      >
        <i class="fas fa-user-friends text-gray-500 mr-2"></i>
        Invite Family Members ({{ familyMembers.length }} total)
      </label>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
      >
        <label
          v-for="member in familyMembers"
          :key="member.userId"
          class="flex items-center space-x-3 p-3 border-2 border-transparent hover:border-amber-200 bg-white rounded-lg hover:bg-amber-50 cursor-pointer transition-all"
        >
          <input
            type="checkbox"
            :value="member.userId"
            v-model="form.attendees"
            :disabled="mode === 'view'"
            class="rounded-md w-5 h-5 text-amber-500 focus:ring-2 focus:ring-amber-500 cursor-pointer"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ member.name || member.email }}
            </p>
            <p class="text-xs text-gray-500">{{ member.role }}</p>
          </div>
        </label>
      </div>
    </div>

    <!-- RSVP Display (View/Edit Mode) -->
    <CalendarRSVPSection />
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { mode, currentEvent } = useCalendarModal();
const { form, isDetectingLocation, detectLocation } = useCalendarForm();

const eventTypes = [
  { value: "custom", label: "Custom", icon: "fa-calendar", color: "amber" },
  {
    value: "birthday",
    label: "Birthday",
    icon: "fa-birthday-cake",
    color: "pink",
  },
  { value: "party", label: "Party", icon: "fa-glass-cheers", color: "purple" },
  {
    value: "vacation",
    label: "Vacation",
    icon: "fa-umbrella-beach",
    color: "green",
  },
  { value: "flight", label: "Flight", icon: "fa-plane", color: "blue" },
  { value: "meeting", label: "Meeting", icon: "fa-users", color: "indigo" },
  {
    value: "appointment",
    label: "Appointment",
    icon: "fa-stethoscope",
    color: "teal",
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: "fa-shopping-cart",
    color: "orange",
  },
  { value: "school", label: "School", icon: "fa-graduation-cap", color: "red" },
  { value: "sports", label: "Sports", icon: "fa-running", color: "green" },
  { value: "dinner", label: "Dinner", icon: "fa-utensils", color: "amber" },
  { value: "movie", label: "Movie", icon: "fa-film", color: "purple" },
];

const eventColors = [
  { name: "Amber", value: "amber", hex: "#f59e0b" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Green", value: "green", hex: "#10b981" },
  { name: "Red", value: "red", hex: "#ef4444" },
  { name: "Purple", value: "purple", hex: "#8b5cf6" },
  { name: "Pink", value: "pink", hex: "#ec4899" },
  { name: "Indigo", value: "indigo", hex: "#6366f1" },
  { name: "Teal", value: "teal", hex: "#14b8a6" },
  { name: "Orange", value: "orange", hex: "#f97316" },
  { name: "Gray", value: "gray", hex: "#6b7280" },
];

const familyMembers = computed(() => authStore.familyMembers || []);

// Watch for event type changes to adjust form
watch(
  () => form.eventType,
  (newType) => {
    if (newType === "task") {
      // Clear end date for tasks
      form.endDate = "";
    }
  }
);
</script>
