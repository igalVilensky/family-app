<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
  >
    <!-- Sticky Header - Mobile Optimized -->
    <header class="sticky top-0 z-20 bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div class="flex items-center justify-between py-3 sm:py-4">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div
              class="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg shadow-md flex-shrink-0"
            >
              <i class="fas fa-calendar-days text-white text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0">
              <h1
                class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate"
              >
                {{ familyName }}'s Calendar
              </h1>
              <p class="text-xs text-gray-500 hidden sm:block">
                Plan your family moments
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              v-if="!isToday"
              @click="goToToday"
              class="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <i class="fas fa-calendar-day mr-2"></i>Today
            </button>
            <button
              @click="refreshEvents"
              :disabled="isRefreshing"
              class="p-2 sm:p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 relative"
              title="Refresh"
            >
              <i
                :class="`fas fa-sync-alt text-sm sm:text-base ${
                  isRefreshing ? 'animate-spin' : ''
                }`"
              ></i>
              <span
                v-if="refreshSuccess"
                class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              ></span>
            </button>
            <button
              @click="openCreateModal"
              class="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <i class="fas fa-plus mr-0 sm:mr-2"></i>
              <span class="hidden sm:inline">New Event</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <!-- Calendar Card -->
      <div class="bg-white rounded-xl shadow-xl overflow-hidden">
        <ClientOnly>
          <FullCalendar
            ref="calendarRef"
            :options="calendarOptions"
            class="calendar-container"
          />
        </ClientOnly>
      </div>

      <!-- Quick Stats Grid - Mobile Responsive -->
      <div class="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <i
                class="fas fa-calendar-check text-blue-600 text-lg sm:text-xl"
              ></i>
            </div>
            <div class="min-w-0">
              <p class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ events.length }}
              </p>
              <p class="text-xs text-gray-500 truncate">Total Events</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <i class="fas fa-users text-green-600 text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0">
              <p class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ familyMembers.length }}
              </p>
              <p class="text-xs text-gray-500 truncate">Family Members</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-amber-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <i class="fas fa-clock text-amber-600 text-lg sm:text-xl"></i>
            </div>
            <div class="min-w-0">
              <p class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ upcomingCount }}
              </p>
              <p class="text-xs text-gray-500 truncate">Upcoming</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-purple-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <i
                class="fas fa-check-circle text-purple-600 text-lg sm:text-xl"
              ></i>
            </div>
            <div class="min-w-0">
              <p class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ confirmedCount }}
              </p>
              <p class="text-xs text-gray-500 truncate">Confirmed</p>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="bg-pink-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <i
                class="fas fa-birthday-cake text-pink-600 text-lg sm:text-xl"
              ></i>
            </div>
            <div class="min-w-0">
              <p class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ membersWithBirthdays.length }}
              </p>
              <p class="text-xs text-gray-500 truncate">Birthdays Set</p>
              <p class="text-xs text-gray-400">
                {{ familyMembers.length - membersWithBirthdays.length }} missing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal - Mobile Optimized -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="openEventModal"
          class="fixed inset-0 z-50 overflow-y-auto"
          @click.self="closeModal"
        >
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          ></div>

          <!-- Modal Container -->
          <div
            class="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div
              class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl transform transition-all max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            >
              <!-- Modal Header -->
              <div
                class="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0"
              >
                <div class="flex items-center justify-between">
                  <h2
                    class="text-lg sm:text-xl font-bold text-white flex items-center"
                  >
                    <i :class="`fas ${modalIcon} mr-2 sm:mr-3`"></i>
                    <span class="truncate">{{ modalTitle }}</span>
                  </h2>
                  <button
                    @click="closeModal"
                    class="text-white/90 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
                  >
                    <i class="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <!-- Modal Body - Scrollable -->
              <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                <div class="space-y-4">
                  <!-- Event Type Selection -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
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

                  <!-- Title Input -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {{
                        form.eventType === "task" ? "Task Title" : "Event Title"
                      }}
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
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                      class="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                    >
                      <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                      Location
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
                        {{
                          form.eventType === "task"
                            ? "Due Date"
                            : "Start Date & Time"
                        }}
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
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                  <div
                    v-if="
                      currentEvent &&
                      currentEvent.rsvps &&
                      (mode === 'view' || mode === 'edit') &&
                      form.eventType === 'event'
                    "
                  >
                    <label
                      class="text-sm font-semibold text-gray-700 mb-3 flex items-center"
                    >
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
                          <div
                            :class="`w-2 h-2 rounded-full ${getRSVPColor(
                              status
                            )}`"
                          ></div>
                          <span
                            class="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
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
                      <label
                        class="block text-sm font-semibold text-gray-700 mb-3"
                      >
                        Your Response
                      </label>
                      <div class="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          @click="setRSVP('yes')"
                          class="flex flex-col items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
                        >
                          <i class="fas fa-check-circle text-2xl mb-1"></i>
                          <span class="text-sm">Yes</span>
                        </button>
                        <button
                          type="button"
                          @click="setRSVP('maybe')"
                          class="flex flex-col items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
                        >
                          <i class="fas fa-question-circle text-2xl mb-1"></i>
                          <span class="text-sm">Maybe</span>
                        </button>
                        <button
                          type="button"
                          @click="setRSVP('no')"
                          class="flex flex-col items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold active:scale-95"
                        >
                          <i class="fas fa-times-circle text-2xl mb-1"></i>
                          <span class="text-sm">No</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div
                class="border-t-2 border-gray-100 px-4 sm:px-6 py-4 bg-gray-50 flex-shrink-0"
              >
                <div
                  class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3"
                >
                  <button
                    type="button"
                    @click="closeModal"
                    class="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                  >
                    {{ mode === "view" ? "Close" : "Cancel" }}
                  </button>
                  <button
                    v-if="mode === 'edit'"
                    type="button"
                    @click="confirmDelete"
                    class="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center active:scale-95"
                  >
                    <i class="fas fa-trash-alt mr-2"></i>
                    Delete {{ form.eventType === "task" ? "Task" : "Event" }}
                  </button>
                  <button
                    v-if="mode !== 'view'"
                    type="button"
                    @click="submitEvent"
                    :disabled="!form.title || !form.startDate"
                    class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    {{
                      mode === "create"
                        ? form.eventType === "task"
                          ? "Create Task"
                          : "Create Event"
                        : form.eventType === "task"
                        ? "Update Task"
                        : "Update Event"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  addEvent,
  getEventsByRange,
  updateEvent,
  deleteEvent,
  updateRSVP,
} from "~/utils/firebase";

const authStore = useAuthStore();
const calendarRef = ref(null);
const openEventModal = ref(false);
const events = ref([]);
const mode = ref("create");
const currentEvent = ref(null);
const isRefreshing = ref(false);
const currentView = ref("dayGridMonth");
const refreshSuccess = ref(false);
const today = new Date().toDateString();
const isToday = ref(true);

const form = ref({
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  attendees: [],
  familyId: computed(() => authStore.familyId),
  eventType: "event",
  color: "amber",
  recurrence: "none",
  taskStatus: "pending",
});

// Event colors for color-coding
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

const familyName = computed(() => authStore.familyName || "Your");
const familyMembers = computed(() => authStore.familyMembers || []);

const membersWithBirthdays = computed(() => {
  return familyMembers.value.filter((member) => member.birthday);
});

const upcomingCount = computed(() => {
  return events.value.filter((e) => new Date(e.startDate) > new Date()).length;
});

const confirmedCount = computed(() => {
  return events.value.filter((e) => e.rsvps?.[authStore.userId] === "yes")
    .length;
});

const modalTitle = computed(() => {
  if (mode.value === "create") {
    return form.value.startDate
      ? `New ${form.value.eventType === "task" ? "Task" : "Event"} - ${new Date(
          form.value.startDate
        ).toLocaleDateString()}`
      : `New ${form.value.eventType === "task" ? "Task" : "Event"}`;
  } else if (mode.value === "edit") {
    return form.value.title;
  } else {
    return form.value.title;
  }
});

const modalIcon = computed(() => {
  if (mode.value === "create")
    return form.value.eventType === "task"
      ? "fa-plus-circle"
      : "fa-plus-circle";
  if (mode.value === "edit")
    return form.value.eventType === "task" ? "fa-edit" : "fa-edit";
  return form.value.eventType === "task" ? "fa-tasks" : "fa-calendar-alt";
});

const isCreator = computed(
  () => currentEvent.value?.creatorId === authStore.userId
);

const checkIsToday = () => {
  if (!calendarRef.value) return;
  const calApi = calendarRef.value.getApi();
  const currentDate = calApi.getDate();
  const today = new Date();
  isToday.value =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === today.getDate();
};

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: window.innerWidth < 768 ? "dayGridMonth" : "dayGridMonth",
  events: events.value.map((e) => {
    const isBirthday = e.eventType === "birthday";
    const isTask = e.eventType === "task";
    const colorConfig =
      eventColors.find((c) => c.value === e.color) || eventColors[0];

    return {
      id: e.id,
      title: isBirthday ? `🎂 ${e.title}` : isTask ? `📝 ${e.title}` : e.title,
      start: e.startDate,
      end: e.endDate,
      backgroundColor: isBirthday ? "#ec4899" : colorConfig.hex,
      borderColor: isBirthday ? "#ec4899" : colorConfig.hex,
      textColor: isBirthday ? "#ffffff" : "#ffffff",
      extendedProps: e,
    };
  }),
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right:
      window.innerWidth < 768
        ? "dayGridMonth,timeGridWeek,timeGridDay"
        : "dayGridMonth,timeGridWeek,timeGridDay",
  },
  views: {
    timeGridDay: {
      type: "timeGrid",
      duration: { days: 1 },
      buttonText: "Day",
    },
  },
  height: "auto",
  editable: false,
  selectable: true,
  dayMaxEvents: 3,
  moreLinkText: "more",
  eventDisplay: "block",
  datesSet: () => checkIsToday(),
  dateClick: (info) => {
    const dateStr = info.dateStr + "T12:00";
    form.value.startDate = dateStr.slice(0, 16);
    form.value.endDate =
      form.value.eventType === "event" ? dateStr.slice(0, 16) : "";
    mode.value = "create";
    openEventModal.value = true;
  },
  eventClick: (info) => {
    currentEvent.value = info.event.extendedProps;
    populateFormFromEvent(currentEvent.value);
    mode.value = isCreator.value ? "edit" : "view";
    openEventModal.value = true;
  },
  eventContent: (arg) => {
    const event = arg.event.extendedProps;
    const isBirthday = event.eventType === "birthday";
    const isTask = event.eventType === "task";

    let content = `
      <div class="p-1 text-[10px] sm:text-xs">
        <div class="font-semibold truncate">${arg.event.title}</div>
    `;

    if (isTask) {
      const status = event.taskStatus || "pending";
      const statusColors = {
        pending: "bg-gray-400",
        "in-progress": "bg-yellow-400",
        completed: "bg-green-400",
      };
      content += `<div class="flex items-center mt-0.5">
        <div class="w-2 h-2 rounded-full ${statusColors[status]} mr-1"></div>
        <span class="text-white/90 text-[10px] sm:text-xs">${status}</span>
      </div>`;
    } else if (!isBirthday && event.rsvps) {
      const stats = getRSVPStats(event.rsvps);
      content += `<div class="text-white/90 text-[10px] sm:text-xs mt-0.5">
        ✓${stats.yes} ?${stats.maybe}
      </div>`;
    }

    content += `</div>`;
    return { html: content };
  },
  viewDidMount: (info) => {
    currentView.value = info.view.type;
  },
}));

const goToToday = () => {
  if (calendarRef.value) {
    calendarRef.value.getApi().today();
  }
};

const refreshEvents = async () => {
  if (!authStore.familyId) {
    return;
  }

  isRefreshing.value = true;
  refreshSuccess.value = false;
  try {
    const now = new Date();
    const start = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1
    ).toISOString();
    const end = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      0
    ).toISOString();
    const calendarEvents = await getEventsByRange(
      authStore.familyId,
      start,
      end
    );

    // Add birthday events
    const birthdayEvents = generateBirthdayEvents();
    events.value = [...calendarEvents, ...birthdayEvents];

    refreshSuccess.value = true;
  } catch (error) {
    console.error("Refresh error:", error);
  } finally {
    setTimeout(() => {
      isRefreshing.value = false;
    }, 500);
  }
};

const goToUserProfile = (userId) => {
  if (userId === authStore.userId) {
    router.push("/profile");
  } else {
    router.push(`/user/${userId}`);
  }
};

const generateBirthdayEvents = () => {
  const birthdayEvents = [];
  const currentYear = new Date().getFullYear();

  membersWithBirthdays.value.forEach((member) => {
    if (member.birthday) {
      try {
        const birthday = new Date(member.birthday);
        // Validate the birthday date
        if (isNaN(birthday.getTime())) {
          console.warn(
            `Invalid birthday for member ${member.userId}:`,
            member.birthday
          );
          return;
        }

        // Create birthday events for current and next year
        for (let year = currentYear; year <= currentYear + 1; year++) {
          const eventDate = new Date(
            year,
            birthday.getMonth(),
            birthday.getDate()
          );

          // Skip if the date is invalid
          if (isNaN(eventDate.getTime())) {
            console.warn(
              `Invalid event date for ${member.userId} birthday:`,
              birthday
            );
            continue;
          }

          birthdayEvents.push({
            id: `birthday-${member.userId}-${year}`,
            title: `${member.name || member.email}'s Birthday`,
            startDate: eventDate.toISOString(),
            endDate: eventDate.toISOString(),
            eventType: "birthday",
            color: "pink",
            allDay: true,
            extendedProps: {
              isBirthday: true,
              memberId: member.userId,
              memberName: member.name || member.email,
            },
          });
        }
      } catch (error) {
        console.error(
          `Error processing birthday for member ${member.userId}:`,
          error
        );
      }
    }
  });

  return birthdayEvents;
};

const openCreateModal = () => {
  resetForm();
  mode.value = "create";
  openEventModal.value = true;
};

const populateFormFromEvent = (event) => {
  form.value.title = event.title;
  form.value.description = event.description || "";
  form.value.location = event.location || "";
  form.value.startDate = new Date(event.startDate).toISOString().slice(0, 16);
  form.value.endDate = event.endDate
    ? new Date(event.endDate).toISOString().slice(0, 16)
    : "";
  form.value.attendees = event.attendees || [];
  form.value.eventType = event.eventType || "event";
  form.value.color = event.color || "amber";
  form.value.recurrence = event.recurrence || "none";
  form.value.taskStatus = event.taskStatus || "pending";
};

const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    attendees: [],
    familyId: authStore.familyId,
    eventType: "event",
    color: "amber",
    recurrence: "none",
    taskStatus: "pending",
  };
  currentEvent.value = null;
};

const submitEvent = async () => {
  if (!form.value.title || !form.value.startDate || !authStore.familyId) {
    alert(
      `Missing ${
        form.value.eventType === "task" ? "task title" : "event title"
      }, date, or family ID`
    );
    return;
  }

  try {
    // Set end date to start date if not provided for events, or leave empty for tasks
    let endDate = form.value.endDate;
    if (form.value.eventType === "event" && !endDate) {
      endDate = form.value.startDate;
    }

    const eventData = {
      ...form.value,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      creatorId:
        mode.value === "create"
          ? authStore.userId
          : currentEvent.value.creatorId,
    };

    if (mode.value === "create") {
      await addEvent(eventData);
    } else if (mode.value === "edit") {
      if (form.value.eventType === "event") {
        const oldAttendees = currentEvent.value.attendees || [];
        const newAttendees = eventData.attendees;
        const rsvps = { ...currentEvent.value.rsvps };
        newAttendees.forEach((uid) => {
          if (!rsvps[uid]) rsvps[uid] = null;
        });
        oldAttendees.forEach((uid) => {
          if (!newAttendees.includes(uid)) delete rsvps[uid];
        });
        eventData.rsvps = rsvps;
      }
      await updateEvent(authStore.familyId, currentEvent.value.id, eventData);
    }

    await refreshEvents();
    closeModal();
  } catch (error) {
    console.error("Submit error:", error);
    alert(
      `Failed to process ${
        form.value.eventType === "task" ? "task" : "event"
      }: ` + error.message
    );
  }
};

const confirmDelete = async () => {
  const itemType = form.value.eventType === "task" ? "task" : "event";
  if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
    try {
      await deleteEvent(authStore.familyId, currentEvent.value.id);
      await refreshEvents();
      closeModal();
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete ${itemType}: ` + error.message);
    }
  }
};

const setRSVP = async (status) => {
  try {
    await updateRSVP(authStore.familyId, currentEvent.value.id, status);
    await refreshEvents();
    closeModal();
  } catch (error) {
    console.error("RSVP error:", error);
    alert("Failed to update RSVP: " + error.message);
  }
};

const closeModal = () => {
  openEventModal.value = false;
  resetForm();
};

const getRSVPStats = (rsvps) => {
  if (!rsvps) return { yes: 0, maybe: 0, no: 0, pending: 0 };
  const stats = { yes: 0, maybe: 0, no: 0, pending: 0 };
  Object.values(rsvps).forEach((status) => {
    if (status) stats[status]++;
    else stats.pending++;
  });
  return stats;
};

const getRSVPColor = (status) => {
  if (status === "yes") return "bg-green-500";
  if (status === "no") return "bg-red-500";
  if (status === "maybe") return "bg-yellow-500";
  return "bg-gray-400";
};

const getRSVPBadgeClass = (status) => {
  if (status === "yes") return "bg-green-100 text-green-800";
  if (status === "no") return "bg-red-100 text-red-800";
  if (status === "maybe") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const getMemberName = (userId) => {
  const member = familyMembers.value.find((m) => m.userId === userId);
  return member ? member.name || member.email : "Unknown";
};

// Watch for event type changes to adjust form
watch(
  () => form.value.eventType,
  (newType) => {
    if (newType === "task") {
      // Clear end date for tasks
      form.value.endDate = "";
    }
  }
);

onMounted(async () => {
  await authStore.initAuth();
  await authStore.loadFamilyMembers();
  await refreshEvents();
});
</script>

<style scoped>
.calendar-container {
  padding: 1rem;
  min-height: 500px;
}

@media (max-width: 640px) {
  .calendar-container {
    padding: 0.5rem;
    min-height: 400px;
  }
}

/* FullCalendar Mobile Optimizations */
:deep(.fc) {
  font-size: 0.875rem;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 700;
}

@media (max-width: 640px) {
  :deep(.fc-toolbar-title) {
    font-size: 1rem !important;
  }

  :deep(.fc-col-header-cell-cushion) {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }

  :deep(.fc-daygrid-day-number) {
    font-size: 0.875rem;
    padding: 0.25rem;
  }

  :deep(.fc-event) {
    font-size: 0.75rem;
    margin-bottom: 1px;
  }

  :deep(.fc-timeGridDay-view .fc-event) {
    font-size: 0.7rem;
  }
}

:deep(.fc-button) {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  transition: all 0.2s ease !important;
}

:deep(.fc-button:hover) {
  transform: translateY(-1px);
}

:deep(.fc-button:active) {
  transform: translateY(0);
}

@media (max-width: 640px) {
  :deep(.fc-button) {
    padding: 0.4rem 0.6rem !important;
    font-size: 0.75rem !important;
  }
}

:deep(.fc-event-main) {
  padding: 2px 4px;
}

:deep(.fc-event) {
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.fc-daygrid-event) {
  white-space: normal;
}

/* Birthday event style */
:deep(.fc-event[data-event-type="birthday"]) {
  background: linear-gradient(135deg, #ec4899, #db2777) !important;
  border: none !important;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
  transform: scale(0.95) translateY(20px);
}

.modal-leave-to .bg-white {
  transform: scale(0.95) translateY(20px);
}

@media (max-width: 640px) {
  .modal-enter-from .bg-white {
    transform: translateY(100%);
  }

  .modal-leave-to .bg-white {
    transform: translateY(100%);
  }
}

/* Custom Scrollbar */
:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 10px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: #cbd5e0;
  border-radius: 10px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: #a0aec0;
}

/* Animation for refresh button */
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
