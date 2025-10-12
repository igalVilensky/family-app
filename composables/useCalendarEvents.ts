import { getEventsByRange, updateRSVP } from "~/utils/firebase";

export const useCalendarEvents = () => {
  const authStore = useAuthStore();
  const calendarStore = useCalendarStore();

  const isRefreshing = ref(false);
  const refreshSuccess = ref(false);

  const refreshEvents = async () => {
    if (!authStore.familyId) return;

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

      const calendarEvents: CalendarEvent[] = await getEventsByRange(
        authStore.familyId,
        start,
        end
      );
      const birthdayEvents = generateBirthdayEvents();

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
    try {
      await updateRSVP(authStore.familyId, eventId, status);
      await refreshEvents();
    } catch (error) {
      console.error("RSVP error:", error);
      throw error;
    }
  };

  const generateBirthdayEvents = () => {
    // Implementation from original calendar.vue
    const birthdayEvents: CalendarEvent[] = [];
    const currentYear = new Date().getFullYear();
    interface FamilyMember {
      userId: string;
      name?: string;
      email: string;
      birthday?: string;
    }

    const membersWithBirthdays = authStore.familyMembers.filter(
      (member: FamilyMember) => member.birthday
    );

    membersWithBirthdays.forEach((member: FamilyMember) => {
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
              familyId: authStore.familyId!,
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
