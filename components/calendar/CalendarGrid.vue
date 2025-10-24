<template>
  <div class="calendar-wrapper">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="calendar-container"
    />
  </div>
</template>

<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const authStore = useAuthStore();
const calendarStore = useCalendarStore();
const { calendarRef, checkIsToday } = useCalendar();
const { openCreateModal, openEditModal, openViewModal } = useCalendarModal();
const { form, populateFormFromEvent, resetForm } = useCalendarForm();

const currentView = ref("dayGridMonth");
const isMobile = ref(false);

// Event types and colors with enhanced design
const eventTypes = [
  {
    value: "custom",
    label: "Custom",
    icon: "fa-calendar",
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    value: "birthday",
    label: "Birthday",
    icon: "fa-birthday-cake",
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    value: "party",
    label: "Party",
    icon: "fa-glass-cheers",
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    value: "vacation",
    label: "Vacation",
    icon: "fa-umbrella-beach",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    value: "flight",
    label: "Flight",
    icon: "fa-plane",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    value: "meeting",
    label: "Meeting",
    icon: "fa-users",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    value: "appointment",
    label: "Appointment",
    icon: "fa-stethoscope",
    color: "teal",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: "fa-shopping-cart",
    color: "orange",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    value: "school",
    label: "School",
    icon: "fa-graduation-cap",
    color: "red",
    gradient: "from-red-500 to-pink-500",
  },
  {
    value: "sports",
    label: "Sports",
    icon: "fa-running",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    value: "dinner",
    label: "Dinner",
    icon: "fa-utensils",
    color: "amber",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    value: "movie",
    label: "Movie",
    icon: "fa-film",
    color: "purple",
    gradient: "from-purple-500 to-violet-500",
  },
];

const eventColors = [
  {
    name: "Amber",
    value: "amber",
    hex: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Blue",
    value: "blue",
    hex: "#3b82f6",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Green",
    value: "green",
    hex: "#10b981",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Red",
    value: "red",
    hex: "#ef4444",
    gradient: "from-red-500 to-rose-500",
  },
  {
    name: "Purple",
    value: "purple",
    hex: "#8b5cf6",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    name: "Pink",
    value: "pink",
    hex: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Indigo",
    value: "indigo",
    hex: "#6366f1",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    name: "Teal",
    value: "teal",
    hex: "#14b8a6",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    name: "Orange",
    value: "orange",
    hex: "#f97316",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Gray",
    value: "gray",
    hex: "#6b7280",
    gradient: "from-gray-500 to-gray-600",
  },
];

// Check mobile viewport
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

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
  initialView: isMobile.value ? "dayGridMonth" : "dayGridMonth",
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
      textColor: "#ffffff",
      classNames: [
        "custom-event",
        isBirthday ? "birthday-event" : "",
        isTask ? "task-event" : "",
        `event-${e.eventCategory}`,
      ],
      extendedProps: e,
    };
  }),
  headerToolbar: {
    left: isMobile.value ? "prev,next" : "prev,next today",
    center: "title",
    right: isMobile.value
      ? "dayGridMonth,timeGridDay"
      : "dayGridMonth,timeGridWeek,timeGridDay",
  },
  views: {
    timeGridDay: {
      type: "timeGrid",
      duration: { days: 1 },
      buttonText: isMobile.value ? "Day" : "Day View",
    },
    timeGridWeek: {
      type: "timeGrid",
      duration: { days: 7 },
      buttonText: "Week",
    },
    dayGridMonth: {
      type: "dayGrid",
      duration: { months: 1 },
      buttonText: "Month",
    },
  },
  height: "auto",
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: isMobile.value ? 2 : 3,
  moreLinkText: isMobile.value ? "+ more" : "+ more events",
  moreLinkClick: "popover",
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

    const startTime = new Date(event.startDate);
    const timeText = !event.allDay
      ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

    const isCompactView = arg.view.type === "dayGridMonth" && isMobile.value;

    let content = `
      <div class="event-content ${isCompactView ? "compact" : "detailed"}">
        <div class="event-inner">
    `;

    if (!isCompactView && timeText) {
      content += `
        <div class="event-time">${timeText}</div>
      `;
    }

    content += `
      <div class="event-main">
        <div class="event-icon-title">
          ${
            !isTask && !isBirthday
              ? `<i class="fas ${eventType?.icon} event-icon"></i>`
              : ""
          }
          <span class="event-title">
            ${isBirthday ? "🎂" : isTask ? "📝" : ""} ${event.title}
          </span>
        </div>
    `;

    if (!isCompactView) {
      if (isTask) {
        const status = event.taskStatus || "pending";
        const statusColors = {
          pending: "bg-gray-400",
          "in-progress": "bg-yellow-400",
          completed: "bg-green-400",
        };
        content += `
          <div class="event-status">
            <div class="status-dot ${statusColors[status]}"></div>
            <span>${status}</span>
          </div>
        `;
      } else if (!isBirthday && event.rsvps) {
        const stats = getRSVPStats(event.rsvps);
        if (stats.yes + stats.maybe + stats.no > 0) {
          content += `
            <div class="event-rsvp">
              <span class="rsvp-yes">✓${stats.yes}</span>
              ${
                stats.maybe > 0
                  ? `<span class="rsvp-maybe">?${stats.maybe}</span>`
                  : ""
              }
              ${stats.no > 0 ? `<span class="rsvp-no">✗${stats.no}</span>` : ""}
            </div>
          `;
        }
      }
    }

    content += `
        </div>
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

// Lifecycle
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.calendar-wrapper {
  position: relative;
  min-height: 600px;
}

.calendar-container {
  padding: 1rem;
  min-height: 600px;
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 0.5rem;
    min-height: 500px;
  }
}

/* Enhanced FullCalendar Styling */
:deep(.fc) {
  font-family: "Inter", system-ui, sans-serif;
  --fc-border-color: rgb(229 231 235);
  --fc-today-bg-color: rgb(254 252 232);
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: rgb(249 250 251);
}

:deep(.fc-toolbar) {
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 1rem 1rem 0 0;
  margin: 0 !important;
}

@media (min-width: 768px) {
  :deep(.fc-toolbar) {
    flex-direction: row;
  }
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem !important;
  font-weight: 800;
  background: linear-gradient(135deg, #f97316, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.fc-button) {
  background: white !important;
  border: 2px solid rgb(229 231 235) !important;
  color: rgb(75 85 99) !important;
  font-weight: 600 !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.fc-button:hover) {
  border-color: rgb(249 115 22) !important;
  color: rgb(249 115 22) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

:deep(.fc-button:active),
:deep(.fc-button:focus) {
  transform: translateY(0) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.fc-button.fc-button-active) {
  background: linear-gradient(135deg, #f97316, #ec4899) !important;
  border-color: transparent !important;
  color: white !important;
}

:deep(.fc-col-header) {
  background: white;
}

:deep(.fc-col-header-cell) {
  padding: 1rem 0.5rem;
  border-bottom: 2px solid rgb(249 250 251);
}

:deep(.fc-col-header-cell-cushion) {
  color: rgb(31 41 55);
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none !important;
  padding: 0.5rem;
}

:deep(.fc-daygrid-day) {
  background: white;
  border: 1px solid rgb(243 244 246);
  transition: all 0.2s ease;
}

:deep(.fc-daygrid-day:hover) {
  background: rgb(255 251 235);
}

:deep(.fc-day-today) {
  background: linear-gradient(135deg, #fffbeb, #fef3c7) !important;
}

:deep(.fc-daygrid-day-number) {
  color: rgb(75 85 99);
  font-weight: 600;
  padding: 0.75rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  color: rgb(249 115 22);
  font-weight: 800;
}

/* Enhanced Event Styling */
:deep(.fc-event) {
  border: none !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  margin: 2px 4px !important;
  min-height: auto !important;
  transition: all 0.3s ease !important;
  background: linear-gradient(
    135deg,
    var(--fc-event-bg-color, #3b82f6),
    var(--fc-event-border-color, #3b82f6)
  ) !important;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

:deep(.fc-event.birthday-event) {
  background: linear-gradient(135deg, #ec4899, #db2777) !important;
}

:deep(.fc-event.task-event) {
  background: linear-gradient(135deg, #6b7280, #4b5563) !important;
}

:deep(.event-content) {
  padding: 0.375rem;
  width: 100%;
}

:deep(.event-content.compact) {
  padding: 0.25rem;
}

:deep(.event-inner) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

:deep(.event-time) {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
}

:deep(.event-main) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

:deep(.event-icon-title) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.2;
}

:deep(.event-icon) {
  font-size: 0.7rem;
  flex-shrink: 0;
  opacity: 0.9;
}

:deep(.event-title) {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

:deep(.event-status),
:deep(.event-rsvp) {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.65rem;
  line-height: 1;
}

:deep(.status-dot) {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

:deep(.rsvp-yes) {
  color: #86efac;
}
:deep(.rsvp-maybe) {
  color: #fde047;
}
:deep(.rsvp-no) {
  color: #fca5a5;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  :deep(.fc-toolbar-title) {
    font-size: 1.25rem !important;
  }

  :deep(.fc-button) {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.75rem !important;
  }

  :deep(.fc-col-header-cell-cushion) {
    font-size: 0.75rem;
    padding: 0.25rem;
  }

  :deep(.fc-daygrid-day-number) {
    font-size: 0.75rem;
    padding: 0.5rem 0.25rem;
  }

  :deep(.fc-event) {
    margin: 1px 2px !important;
    border-radius: 0.5rem !important;
  }

  :deep(.event-content) {
    padding: 0.25rem;
  }

  :deep(.event-title) {
    font-size: 0.7rem;
    -webkit-line-clamp: 1;
  }

  :deep(.event-time) {
    font-size: 0.65rem;
  }
}

/* Scrollbar Styling */
:deep(*::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 10px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 10px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
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

/* Loading state */
:deep(.fc-loading) {
  opacity: 0.7;
}

/* Popover enhancements */
:deep(.fc-popover) {
  border: none !important;
  border-radius: 1rem !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
  background: white !important;
}

:deep(.fc-popover-header) {
  background: linear-gradient(135deg, #f97316, #ec4899) !important;
  color: white !important;
  border-radius: 1rem 1rem 0 0 !important;
  padding: 1rem !important;
  font-weight: 600 !important;
}

:deep(.fc-popover-close) {
  color: white !important;
  opacity: 0.8 !important;
}

:deep(.fc-popover-close:hover) {
  opacity: 1 !important;
}
</style>
