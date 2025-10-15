import { ref } from "vue";
import {
  createCapsule,
  getCapsules,
  updateCapsuleStatus,
  getCapsuleById,
} from "~/utils/firebase";
import { useAuthStore } from "~/stores/auth";

export const useCapsules = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const ensureAuth = () => {
    if (!authStore.isAuthenticated) {
      throw new Error("Please sign in to access memory capsules");
    }
    if (!authStore.familyId) {
      throw new Error("You need to be part of a family to use memory capsules");
    }
  };

  const createNewCapsule = async (capsuleData: {
    title: string;
    content: string;
    deliveryDate: string;
    type: string;
    recipientId: string;
  }) => {
    try {
      ensureAuth();
      loading.value = true;
      error.value = null;
      const result = await createCapsule(capsuleData);
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCapsules = async (status?: string) => {
    try {
      ensureAuth();
      loading.value = true;
      error.value = null;

      const capsules = await getCapsules(status);

      // AUTO-DELIVERY: Check for capsules that should be delivered
      const now = new Date();
      const capsulesToDeliver = capsules.filter(
        (capsule) =>
          capsule.status === "scheduled" && capsule.deliveryDate.toDate() <= now
      );

      // Update overdue capsules to 'delivered'
      if (capsulesToDeliver.length > 0) {
        const updatePromises = capsulesToDeliver.map((capsule) =>
          updateCapsuleStatus(capsule.id, "delivered")
        );
        await Promise.all(updatePromises);

        // Refresh capsules after updates
        const updatedCapsules = await getCapsules(status);

        // Double-check security on client side
        const userId = authStore.userId;
        const secureCapsules = updatedCapsules.filter((capsule) => {
          // User can always see their own capsules
          if (capsule.createdBy === userId) return true;

          // User can only see received capsules if delivered
          if (capsule.recipientId === userId) {
            return capsule.status === "delivered";
          }

          return false;
        });

        // Enhance capsules with additional data
        const enhancedCapsules = secureCapsules.map((capsule) => ({
          ...capsule,
          daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
          createdByName:
            capsule.createdBy === authStore.userId ? "You" : "Family Member",
          recipientName: "Family Member",
          isReceived: capsule.recipientId === authStore.userId,
          canCancel:
            capsule.createdBy === authStore.userId &&
            capsule.status === "scheduled",
          canView:
            capsule.createdBy === authStore.userId ||
            (capsule.recipientId === authStore.userId &&
              capsule.status === "delivered"),
        }));

        return enhancedCapsules;
      }

      // If no capsules need delivery, proceed normally
      const userId = authStore.userId;
      const secureCapsules = capsules.filter((capsule) => {
        if (capsule.createdBy === userId) return true;
        if (capsule.recipientId === userId) {
          return capsule.status === "delivered";
        }
        return false;
      });

      const enhancedCapsules = secureCapsules.map((capsule) => ({
        ...capsule,
        daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
        createdByName:
          capsule.createdBy === authStore.userId ? "You" : "Family Member",
        recipientName: "Family Member",
        isReceived: capsule.recipientId === authStore.userId,
        canCancel:
          capsule.createdBy === authStore.userId &&
          capsule.status === "scheduled",
        canView:
          capsule.createdBy === authStore.userId ||
          (capsule.recipientId === authStore.userId &&
            capsule.status === "delivered"),
      }));

      return enhancedCapsules;
    } catch (err: any) {
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCapsuleById = async (capsuleId: string) => {
    try {
      ensureAuth();
      loading.value = true;
      error.value = null;

      // Use the proper function to get capsule by ID
      const capsule = await getCapsuleById(capsuleId);

      // Double-check security
      const userId = authStore.userId;
      if (
        capsule.createdBy !== userId &&
        (capsule.recipientId !== userId || capsule.status !== "delivered")
      ) {
        throw new Error("You don't have permission to view this capsule");
      }

      // Enhance capsule with additional data
      return {
        ...capsule,
        daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
        createdByName:
          capsule.createdBy === authStore.userId ? "You" : "Family Member",
        recipientName: "Family Member",
        isReceived: capsule.recipientId === authStore.userId,
        canCancel:
          capsule.createdBy === authStore.userId &&
          capsule.status === "scheduled",
        canView: true, // If we got here, user has permission
      };
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (capsuleId: string, status: string) => {
    try {
      ensureAuth();
      loading.value = true;
      error.value = null;
      const result = await updateCapsuleStatus(capsuleId, status);
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const calculateDaysUntil = (deliveryDate: any) => {
    const now = new Date();
    const delivery = deliveryDate.toDate
      ? deliveryDate.toDate()
      : new Date(deliveryDate);
    const diffTime = delivery - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return {
    loading,
    error,
    createNewCapsule,
    fetchCapsules,
    fetchCapsuleById,
    updateStatus,
    calculateDaysUntil,
  };
};
