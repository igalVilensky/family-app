// composables/useCalendarModal.ts

let modalInstance: ReturnType<typeof createModal> | null = null;

const createModal = () => {
  const openEventModal = ref(false);
  const mode = ref<"create" | "edit" | "view">("create");
  const currentEvent = ref<any>(null);

  const openCreateModal = () => {
    mode.value = "create";
    openEventModal.value = true;
  };

  const openEditModal = (event: any) => {
    currentEvent.value = event;
    mode.value = "edit";
    openEventModal.value = true;
  };

  const openViewModal = (event: any) => {
    currentEvent.value = event;
    mode.value = "view";
    openEventModal.value = true;
  };

  const closeModal = () => {
    openEventModal.value = false;
    resetModal();
  };

  const resetModal = () => {
    currentEvent.value = null;
    mode.value = "create";
  };

  return {
    openEventModal,
    mode,
    currentEvent,
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
