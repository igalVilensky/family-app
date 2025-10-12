// composables/useCalendarForm.ts

let formInstance: ReturnType<typeof createForm> | null = null;

const createForm = () => {
  const authStore = useAuthStore();
  const isDetectingLocation = ref(false);

  const form = reactive({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    attendees: [] as string[],
    eventType: "event" as "event" | "task",
    eventCategory: "custom",
    color: "amber",
    recurrence: "none",
    taskStatus: "pending",
  });

  const resetForm = () => {
    Object.assign(form, {
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      attendees: [],
      eventType: "event",
      eventCategory: "custom",
      color: "amber",
      recurrence: "none",
      taskStatus: "pending",
    });
  };

  const populateFormFromEvent = (event: any) => {
    const startDate = new Date(event.startDate);
    const localStartDate = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    let localEndDate = "";
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      localEndDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
    }

    Object.assign(form, {
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      startDate: localStartDate,
      endDate: localEndDate,
      attendees: event.attendees || [],
      eventType: event.eventType || "event",
      eventCategory: event.eventCategory || "custom",
      color: event.color || "amber",
      recurrence: event.recurrence || "none",
      taskStatus: event.taskStatus || "pending",
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    isDetectingLocation.value = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();
            form.location =
              data.city ||
              data.locality ||
              data.principalSubdivision ||
              "Current Location";
          } else {
            form.location = `Lat: ${latitude.toFixed(
              4
            )}, Lng: ${longitude.toFixed(4)}`;
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          form.location = "Current Location";
        } finally {
          isDetectingLocation.value = false;
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
        isDetectingLocation.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return {
    form,
    isDetectingLocation,
    resetForm,
    populateFormFromEvent,
    detectLocation,
  };
};

export const useCalendarForm = () => {
  if (!formInstance) {
    formInstance = createForm();
  }
  return formInstance;
};
