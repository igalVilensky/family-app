import { ref } from "vue";
import {
  createCapsule,
  getCapsules,
  updateCapsuleStatus,
  getCapsuleById,
  updateCapsule,
} from "~/utils/firebase";
import { useAuthStore } from "~/stores/auth";

export const useCapsules = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();
  const route = useRoute();

  // Get current family ID from route or auth store
  const getCurrentFamilyId = () => {
    // Allow viewing capsules for specific family via route
    if (route.params.familyId) {
      return route.params.familyId;
    }
    return authStore.currentFamilyId;
  };

  const ensureAuth = () => {
    if (!authStore.isAuthenticated) {
      throw new Error("Please sign in to access memory capsules");
    }
    const familyId = getCurrentFamilyId();
    if (!familyId) {
      throw new Error("You need to be part of a family to use memory capsules");
    }

    // Check if user has access to this family
    if (!authStore.families[familyId]) {
      throw new Error("You don't have access to this family's capsules");
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

      // Add current family ID to capsule data
      const capsuleWithFamily = {
        ...capsuleData,
        familyId: getCurrentFamilyId(),
      };

      const result = await createCapsule(capsuleWithFamily);
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

      const familyId = getCurrentFamilyId();
      const capsules = await getCapsules(familyId, status);

      // AUTO-DELIVERY: Check for capsules that should be delivered
      const now = new Date();
      const capsulesToDeliver = capsules.filter(
        (capsule) =>
          capsule.status === "scheduled" &&
          new Date(capsule.deliveryDate) <= now
      );

      // Update overdue capsules to 'delivered'
      if (capsulesToDeliver.length > 0) {
        const updatePromises = capsulesToDeliver.map((capsule) =>
          updateCapsuleStatus(capsule.id, "delivered")
        );
        await Promise.all(updatePromises);

        // Refresh capsules after updates
        const updatedCapsules = await getCapsules(familyId, status);

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
          currentUserId: authStore.userId,
          daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
          createdByName: getMemberName(capsule.createdBy),
          recipientName: getMemberName(capsule.recipientId),
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
        currentUserId: authStore.userId,
        daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
        createdByName: getMemberName(capsule.createdBy),
        recipientName: getMemberName(capsule.recipientId),
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

      const familyId = getCurrentFamilyId();

      // Use the proper function to get capsule by ID
      const capsule = await getCapsuleById(capsuleId);

      // Double-check security and family access
      const userId = authStore.userId;
      if (capsule.familyId !== familyId) {
        throw new Error("This capsule belongs to a different family");
      }

      if (
        capsule.createdBy !== userId &&
        (capsule.recipientId !== userId || capsule.status !== "delivered")
      ) {
        throw new Error("You don't have permission to view this capsule");
      }

      // Enhance capsule with additional data
      return {
        ...capsule,
        currentUserId: authStore.userId,
        daysUntilDelivery: calculateDaysUntil(capsule.deliveryDate),
        createdByName: getMemberName(capsule.createdBy),
        recipientName: getMemberName(capsule.recipientId),
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

  const updateCapsuleById = async (id, data) => {
    try {
      ensureAuth();
      loading.value = true;
      error.value = null;

      // Transform the data to match your Firebase structure
      const updateData = {
        title: data.title,
        content: data.content,
        deliveryDate: data.deliveryDate,
        type: data.type,
        ...(data.recipientId && { recipientId: data.recipientId }),
      };

      const result = await updateCapsule(id, updateData);
      return result;
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
    const delivery = new Date(deliveryDate);
    const diffTime = delivery - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getMemberName = (userId: string) => {
    if (userId === authStore.userId) return "You";

    const member = authStore.familyMembers.find((m) => m.userId === userId);
    return member?.name || "Family Member";
  };

  return {
    loading,
    error,
    createNewCapsule,
    fetchCapsules,
    fetchCapsuleById,
    updateCapsuleById,
    updateStatus,
    calculateDaysUntil,
    getCurrentFamilyId,
  };
};
