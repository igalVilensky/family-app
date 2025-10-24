<template>
  <FullCalendar
    ref="calendarRef"
    :options="calendarOptions"
    class="calendar-container"
  />
</template>

<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref, computed, watch } from "vue";

const authStore = useAuthStore();
const calendarStore = useCalendarStore();
const { calendarRef, checkIsToday } = useCalendar();
const { openCreateModal, openEditModal, openViewModal } = useCalendarModal();
const { form, populateFormFromEvent, resetForm } = useCalendarForm();

const currentView = ref("dayGridMonth");

// Event types and colors (moved from original file)
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

// Watch for events changes to refresh calendar
watch(
  () => calendarStore.events,
  () => {
    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi();
      calendarApi.refetchEvents();
    }
  },
  { deep: true }
);

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: window.innerWidth < 768 ? "dayGridMonth" : "dayGridMonth",
  events: calendarStore.events.map((e) => {
    const isBirthday = e.eventType === "birthday";
    const isTask = e.eventType === "task";
    const eventType =
      eventTypes.find((et) => et.value === e.eventCategory) || eventTypes[0];
    const colorConfig =
      eventColors.find((c) => c.value === e.color) || eventColors[0];

    const startTime = new Date(e.startDate);
    const timeText = !e.allDay
      ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

    return {
      id: e.id,
      title: isTask
        ? `📝 ${e.title}`
        : `${timeText ? timeText + " " : ""}${e.title}`,
      start: e.startDate,
      end: e.endDate,
      backgroundColor: isBirthday ? "#ec4899" : colorConfig?.hex,
      borderColor: isBirthday ? "#ec4899" : colorConfig?.hex,
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
    resetForm();
    form.startDate = dateStr.slice(0, 16);
    form.endDate = form.eventType === "event" ? dateStr.slice(0, 16) : "";
    openCreateModal(info.date);
  },
  eventClick: (info) => {
    const event = info.event.extendedProps;
    populateFormFromEvent(event);

    const isCreator = event.creatorId === authStore.userId;
    if (isCreator) {
      openEditModal(event);
    } else {
      openViewModal(event);
    }
  },
  eventContent: (arg) => {
    const event = arg.event.extendedProps;
    const isBirthday = event.eventType === "birthday";
    const isTask = event.eventType === "task";
    const eventType =
      eventTypes.find((et) => et.value === event.eventCategory) ||
      eventTypes[0];

    // Format time
    const startTime = new Date(event.startDate);
    const timeText = !event.allDay
      ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

    let content = `
  <div class="p-1 text-[10px] sm:text-xs w-full">
    <div class="flex flex-col gap-0.5">
  `;

    // Row 1: Time
    if (timeText) {
      content += `
      <div class="font-semibold text-white/90 text-[9px] leading-none">
        ${timeText}
      </div>
    `;
    }

    // Row 2: Title and Icon
    content += `
    <div class="flex items-center gap-1 leading-none min-h-[12px]">
      ${
        !isTask && !isBirthday
          ? `<i class="fas ${eventType.icon} flex-shrink-0 text-[8px] sm:text-[10px]"></i>`
          : ""
      }
      <div class="font-semibold truncate ${
        isBirthday ? "text-pink-200" : "text-white"
      }">
        ${isBirthday ? "🎂" : isTask ? "📝" : ""} ${event.title}
      </div>
    </div>
  `;

    // Row 3: Stats (Task status or RSVP counts)
    if (isTask) {
      const status = event.taskStatus || "pending";
      const statusColors = {
        pending: "bg-gray-400",
        "in-progress": "bg-yellow-400",
        completed: "bg-green-400",
      };
      content += `
      <div class="flex items-center gap-1 leading-none">
        <div class="w-1.5 h-1.5 rounded-full ${statusColors[status]} flex-shrink-0"></div>
        <span class="text-white/90 text-[9px] truncate">${status}</span>
      </div>
    `;
    } else if (!isBirthday && event.rsvps) {
      const stats = getRSVPStats(event.rsvps);
      content += `
      <div class="hidden sm:flex items-center gap-1 text-white/90 text-[9px] leading-none">
        <span class="text-green-300">✓${stats.yes}</span>
        <span class="text-yellow-300">?${stats.maybe}</span>
        ${stats.no > 0 ? `<span class="text-red-300">✗${stats.no}</span>` : ""}
      </div>
    `;
    }

    content += `
    </div>
  </div>
  `;

    return { html: content };
  },
  viewDidMount: (info) => {
    currentView.value = info.view.type;
  },
}));

const getRSVPStats = (rsvps: Record<string, string | null>) => {
  if (!rsvps) return { yes: 0, maybe: 0, no: 0, pending: 0 };
  const stats = { yes: 0, maybe: 0, no: 0, pending: 0 };
  Object.values(rsvps).forEach((status) => {
    if (status) stats[status]++;
    else stats.pending++;
  });
  return stats;
};
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
  line-height: 1.2;
}

:deep(.fc-event) {
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: auto !important;
}

:deep(.fc-daygrid-event) {
  white-space: normal;
  min-height: auto !important;
}

:deep(.fc-event-time) {
  font-weight: 600;
  margin-right: 2px;
}

/* Make sure events are properly spaced */
:deep(.fc-daygrid-day-events) {
  margin-top: 2px;
}

:deep(.fc-daygrid-event-harness) {
  margin-bottom: 2px;
}

/* Birthday event style */
:deep(.fc-event[data-event-type="birthday"]) {
  background: linear-gradient(135deg, #ec4899, #db2777) !important;
  border: none !important;
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
