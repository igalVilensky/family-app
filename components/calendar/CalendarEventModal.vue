<template>
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
              <CalendarEventForm />
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
                  v-if="mode === 'edit' && isCreator"
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
                  :disabled="!form.title || !form.startDate || !currentFamilyId"
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
</template>

<script setup lang="ts">
import { deleteEvent, addEvent, updateEvent } from "~/utils/firebase";

const authStore = useAuthStore();
const route = useRoute();
const { openEventModal, mode, currentEvent, closeModal, clickedDate } =
  useCalendarModal();
const { form, resetForm } = useCalendarForm();
const { refreshEvents } = useCalendarEvents();

// Get current family ID from route or auth store
const currentFamilyId = computed(() => {
  return route.params.id || authStore.currentFamilyId;
});

watch(openEventModal, (newValue) => {
  if (newValue && mode.value === "create") {
    resetForm();

    // If there's a clicked date, prefill the form with it
    if (clickedDate.value) {
      // Create a new date object to avoid timezone issues
      const date = new Date(clickedDate.value);

      // Use local date methods to get the correct date without timezone offset
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      // Create the date string in local timezone (default to 12:00)
      const dateStr = `${year}-${month}-${day}T12:00`;

      form.startDate = dateStr;
      form.endDate = form.eventType === "event" ? dateStr : "";
    }
  }
});

const modalTitle = computed(() => {
  if (mode.value === "create") {
    return form.startDate
      ? `New ${form.eventType === "task" ? "Task" : "Event"} - ${new Date(
          form.startDate
        ).toLocaleDateString()}`
      : `New ${form.eventType === "task" ? "Task" : "Event"}`;
  } else if (mode.value === "edit") {
    return form.title;
  } else {
    return form.title;
  }
});

const modalIcon = computed(() => {
  if (mode.value === "create")
    return form.eventType === "task" ? "fa-plus-circle" : "fa-plus-circle";
  if (mode.value === "edit")
    return form.eventType === "task" ? "fa-edit" : "fa-edit";
  return form.eventType === "task" ? "fa-tasks" : "fa-calendar-alt";
});

const isCreator = computed(
  () => currentEvent.value?.creatorId === authStore.userId
);

const submitEvent = async () => {
  const familyId = currentFamilyId.value;

  // Debug: log form values to see what's happening
  console.log("Form values:", {
    title: form.title,
    startDate: form.startDate,
    familyId: familyId,
    form: { ...form },
  });

  if (!form.title || !form.startDate || !familyId) {
    alert(
      `Missing ${
        form.eventType === "task" ? "task title" : "event title"
      }, date, or family ID`
    );
    return;
  }

  try {
    const startDate = new Date(form.startDate);
    const startDateISO = startDate.toISOString();

    let endDateISO = null;
    if (form.endDate) {
      const endDate = new Date(form.endDate);
      endDateISO = endDate.toISOString();
    } else if (form.eventType === "event") {
      endDateISO = startDateISO;
    }

    const eventData = {
      ...form,
      startDate: startDateISO,
      endDate: endDateISO,
      familyId: familyId,
      creatorId:
        mode.value === "create"
          ? authStore.userId
          : currentEvent.value.creatorId,
    };

    console.log("Submitting event data:", eventData);

    if (mode.value === "create") {
      await addEvent(eventData);
    } else if (mode.value === "edit") {
      if (form.eventType === "event") {
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
      await updateEvent(familyId, currentEvent.value.id, eventData);
    }

    await refreshEvents();
    closeModal();
  } catch (error) {
    console.error("Submit error:", error);
    alert(
      `Failed to process ${form.eventType === "task" ? "task" : "event"}: ` +
        (error as Error).message
    );
  }
};

const confirmDelete = async () => {
  const familyId = currentFamilyId.value;
  const itemType = form.eventType === "task" ? "task" : "event";

  if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
    try {
      await deleteEvent(familyId, currentEvent.value.id);
      await refreshEvents();
      closeModal();
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete ${itemType}: ` + (error as Error).message);
    }
  }
};

// This function is used by the RSVP section component
const handleSetRSVP = async (status: string) => {
  try {
    const { setRSVP } = useCalendarEvents();
    await setRSVP(currentEvent.value.id, status);
    closeModal();
  } catch (error) {
    console.error("RSVP error:", error);
    alert("Failed to update RSVP: " + (error as Error).message);
  }
};

// Provide the modal functions to child components
provide("calendarModal", {
  handleSetRSVP,
});
</script>

<style scoped>
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
</style>
