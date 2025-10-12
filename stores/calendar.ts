import { defineStore } from "pinia";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  eventType: "event" | "task" | "birthday";
  eventCategory: string;
  color: string;
  recurrence: string;
  taskStatus?: string;
  attendees: string[];
  rsvps?: Record<string, string | null>;
  creatorId: string;
  familyId: string;
  allDay?: boolean;
}

export interface CalendarForm {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  attendees: string[];
  eventType: "event" | "task";
  eventCategory: string;
  color: string;
  recurrence: string;
  taskStatus: string;
}

export const useCalendarStore = defineStore("calendar", () => {
  const events = ref<CalendarEvent[]>([]);
  const isLoading = ref(false);
  const currentView = ref("dayGridMonth");

  const upcomingCount = computed(() => {
    return events.value.filter((e) => new Date(e.startDate) > new Date())
      .length;
  });

  const confirmedCount = computed(() => {
    const authStore = useAuthStore();
    return events.value.filter(
      (e) => authStore.userId && e.rsvps?.[authStore.userId] === "yes"
    ).length;
  });

  return {
    events,
    isLoading,
    currentView,
    upcomingCount,
    confirmedCount,
  };
});
