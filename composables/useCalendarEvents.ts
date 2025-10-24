import { getEventsByRange, updateRSVP } from "~/utils/firebase";

export const useCalendarEvents = () => {
  const authStore = useAuthStore();
  const calendarStore = useCalendarStore();
  const route = useRoute();

  const isRefreshing = ref(false);
  const refreshSuccess = ref(false);

  // Get current family ID from route or auth store
  const getCurrentFamilyId = () => {
    return route.params.id || authStore.currentFamilyId;
  };

  const refreshEvents = async () => {
    const familyId = getCurrentFamilyId();
    if (!familyId) return;

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

      const calendarEvents = await getEventsByRange(familyId, start, end);
      const birthdayEvents = generateBirthdayEvents(familyId);

      calendarStore.events = [...calendarEvents, ...birthdayEvents];
      refreshSuccess.value = true;
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setTimeout(() => {
        isRefreshing.value = false;
      }, 500);
    }
  };

  const setRSVP = async (eventId: string, status: string) => {
    const familyId = getCurrentFamilyId();
    if (!familyId) throw new Error("No family selected");

    try {
      await updateRSVP(familyId, eventId, status);
      await refreshEvents();
    } catch (error) {
      console.error("RSVP error:", error);
      throw error;
    }
  };

  const generateBirthdayEvents = (familyId: string) => {
    const birthdayEvents = [];
    const currentYear = new Date().getFullYear();

    const membersWithBirthdays = authStore.familyMembers.filter(
      (member) => member.birthday
    );

    membersWithBirthdays.forEach((member) => {
      if (member.birthday) {
        try {
          const birthday = new Date(member.birthday);
          if (isNaN(birthday.getTime())) return;

          for (let year = currentYear; year <= currentYear + 1; year++) {
            const eventDate = new Date(
              year,
              birthday.getMonth(),
              birthday.getDate()
            );
            birthdayEvents.push({
              id: `birthday-${member.userId}-${year}`,
              title: `${member.name || member.email}'s Birthday`,
              startDate: eventDate.toISOString(),
              endDate: eventDate.toISOString(),
              eventType: "birthday",
              eventCategory: "birthday",
              color: "pink",
              allDay: true,
              attendees: [],
              creatorId: "system",
              familyId: familyId,
              recurrence: "",
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

  return {
    isRefreshing,
    refreshSuccess,
    refreshEvents,
    setRSVP,
  };
};
