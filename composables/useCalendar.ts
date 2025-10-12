import type { CalendarEvent } from "~/stores/calendar";

export const useCalendar = () => {
  const authStore = useAuthStore();
  const calendarStore = useCalendarStore();

  const calendarRef = ref();
  const isToday = ref(true);

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

  const goToToday = () => {
    if (calendarRef.value) {
      calendarRef.value.getApi().today();
    }
  };

  return {
    calendarRef,
    isToday,
    checkIsToday,
    goToToday,
  };
};
