// composables/useCalendarModal.ts

let modalInstance: ReturnType<typeof createModal> | null = null;

const createModal = () => {
  const openEventModal = ref(false);
  const mode = ref<"create" | "edit" | "view">("create");
  const currentEvent = ref<any>(null);
  const clickedDate = ref<Date | null>(null); // Add this to store the clicked date

  const openCreateModal = (date?: Date) => {
    // Accept optional date parameter
    mode.value = "create";
    clickedDate.value = date || null; // Store the clicked date
    openEventModal.value = true;
  };

  const openEditModal = (event: any) => {
    currentEvent.value = event;
    mode.value = "edit";
    clickedDate.value = null; // Clear clicked date for edit mode
    openEventModal.value = true;
  };

  const openViewModal = (event: any) => {
    currentEvent.value = event;
    mode.value = "view";
    clickedDate.value = null; // Clear clicked date for view mode
    openEventModal.value = true;
  };

  const closeModal = () => {
    openEventModal.value = false;
    resetModal();
  };

  const resetModal = () => {
    currentEvent.value = null;
    mode.value = "create";
    clickedDate.value = null; // Reset clicked date
  };

  return {
    openEventModal,
    mode,
    currentEvent,
    clickedDate, // Export clickedDate
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    resetModal,
  };
};

export const useCalendarModal = () => {
  if (!modalInstance) {
    modalInstance = createModal();
  }
  return modalInstance;
};
