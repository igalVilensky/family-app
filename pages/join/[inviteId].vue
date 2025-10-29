<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </NuxtLink>
          <div class="text-sm text-gray-600">
            <NuxtLink
              to="/join-family"
              class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Search Families
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-envelope-open-text text-white text-2xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            Family
            <span
              class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
              >Invitation</span
            >
          </h1>
          <p class="text-gray-600 text-lg">
            You've received a special invitation to join a family
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center"
        >
          <div class="relative w-16 h-16 mx-auto mb-4">
            <div
              class="absolute inset-0 border-4 border-blue-200 rounded-full"
            ></div>
            <div
              class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
            ></div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Loading Invitation
          </h3>
          <p class="text-gray-500">Checking your invitation details...</p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center"
        >
          <div
            class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Invitation Issue
          </h3>
          <p class="text-red-600 mb-6">{{ error }}</p>
          <div class="space-y-4">
            <NuxtLink
              to="/join-family"
              class="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-search text-sm"></i>
              Search for Families
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <i class="fas fa-home text-sm"></i>
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>

        <!-- Invitation Details -->
        <div
          v-else-if="invite"
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-users text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              You're Invited!
            </h2>
            <p class="text-gray-600">
              You've been invited to join a family on FamilySpace
            </p>
          </div>

          <!-- Family Details Card -->
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-home text-white text-lg"></i>
              </div>
              <div class="text-left">
                <h3 class="font-semibold text-gray-900 text-lg">
                  {{ invite.familyName }}
                </h3>
                <p class="text-gray-600 text-sm">Family Space</p>
              </div>
            </div>
          </div>

          <!-- Already Member Warning -->
          <div
            v-if="isAlreadyMember"
            class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-exclamation-triangle text-amber-600 text-lg"></i>
              <div>
                <p class="text-sm font-medium text-amber-900">
                  Already a Member
                </p>
                <p class="text-xs text-amber-700">
                  You're already a member of this family
                </p>
              </div>
            </div>
          </div>

          <!-- Invitation Status -->
          <div class="bg-blue-50 rounded-xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <i class="fas fa-info-circle text-blue-600 text-lg"></i>
              <div>
                <p class="text-sm font-medium text-blue-900">
                  Invitation Status
                </p>
                <p class="text-xs text-blue-700">
                  This invitation will expire on
                  {{ formatExpiryDate(invite.expiresAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              v-if="!isAlreadyMember"
              @click="showRelationshipModal = true"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="joining || !authStore.userId"
            >
              <i class="fas fa-check-circle text-lg"></i>
              <span class="text-lg">Accept Invitation</span>
            </button>

            <button
              v-else
              @click="goToFamily"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-home text-lg"></i>
              <span class="text-lg">Go to Family</span>
            </button>

            <div
              v-if="!authStore.userId"
              class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"
            >
              <div class="flex items-center gap-2 justify-center mb-2">
                <i class="fas fa-exclamation-triangle text-amber-600"></i>
                <p class="text-sm font-medium text-amber-800">
                  Authentication Required
                </p>
              </div>
              <p class="text-xs text-amber-700 mb-3">
                You need to be signed in to accept this invitation
              </p>
              <NuxtLink
                :to="`/login?redirect=/join/${route.params.inviteId}`"
                class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-all duration-200"
              >
                <i class="fas fa-sign-in-alt text-sm"></i>
                Sign In to Continue
              </NuxtLink>
            </div>

            <NuxtLink
              to="/join-family"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-search text-lg"></i>
              <span class="text-lg">Search Other Families</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Invalid Invitation -->
        <div
          v-else
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 text-center"
        >
          <div
            class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-times-circle text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Invalid Invitation
          </h3>
          <p class="text-gray-600 mb-6">
            This invitation link is invalid or has expired. Please request a new
            one from the family admin.
          </p>
          <div class="space-y-4">
            <NuxtLink
              to="/join-family"
              class="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-search text-sm"></i>
              Search for Families
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <i class="fas fa-home text-sm"></i>
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>

        <!-- Help Text -->
        <div class="text-center">
          <p class="text-gray-500 text-sm">
            Need help?
            <NuxtLink
              to="/support"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact support
            </NuxtLink>
          </p>
        </div>
      </div>
    </main>

    <!-- Relationship Selection Modal -->
    <div
      v-if="showRelationshipModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-users text-white text-xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Your Family Role
          </h3>
          <p class="text-gray-600">
            How are you related to the
            <strong>{{ invite?.familyName }}</strong> family?
          </p>
        </div>

        <!-- Relationship Selection -->
        <div class="space-y-3 mb-6">
          <!-- Parent 1 (Father) -->
          <button
            @click="selectedRelationship = 'parent_1'"
            :class="{
              'border-blue-500 bg-blue-50 ring-2 ring-blue-200':
                selectedRelationship === 'parent_1',
              'border-gray-200 bg-white hover:bg-gray-50':
                selectedRelationship !== 'parent_1',
            }"
            class="w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group flex items-center gap-4"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-male text-blue-600 text-lg"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Parent (Father)</div>
              <div class="text-xs text-gray-500">
                You are a father in this family
              </div>
            </div>
          </button>

          <!-- Parent 2 (Mother) -->
          <button
            @click="selectedRelationship = 'parent_2'"
            :class="{
              'border-pink-500 bg-pink-50 ring-2 ring-pink-200':
                selectedRelationship === 'parent_2',
              'border-gray-200 bg-white hover:bg-gray-50':
                selectedRelationship !== 'parent_2',
            }"
            class="w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group flex items-center gap-4"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-female text-pink-600 text-lg"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Parent (Mother)</div>
              <div class="text-xs text-gray-500">
                You are a mother in this family
              </div>
            </div>
          </button>

          <!-- Child -->
          <button
            @click="selectedRelationship = 'child'"
            :class="{
              'border-green-500 bg-green-50 ring-2 ring-green-200':
                selectedRelationship === 'child',
              'border-gray-200 bg-white hover:bg-gray-50':
                selectedRelationship !== 'child',
            }"
            class="w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group flex items-center gap-4"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-child text-green-600 text-lg"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Child</div>
              <div class="text-xs text-gray-500">
                You are a son or daughter in this family
              </div>
            </div>
          </button>

          <!-- Spouse -->
          <button
            @click="selectedRelationship = 'spouse'"
            :class="{
              'border-purple-500 bg-purple-50 ring-2 ring-purple-200':
                selectedRelationship === 'spouse',
              'border-gray-200 bg-white hover:bg-gray-50':
                selectedRelationship !== 'spouse',
            }"
            class="w-full p-4 border-2 rounded-xl text-left transition-all duration-200 group flex items-center gap-4"
          >
            <div
              class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-heart text-purple-600 text-lg"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Spouse/Partner</div>
              <div class="text-xs text-gray-500">
                You are married or partnered to a family member
              </div>
            </div>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="acceptInviteWithRelationship"
            :disabled="!selectedRelationship || joining"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="joining" class="fas fa-spinner fa-spin text-lg"></i>
            <i v-else class="fas fa-user-plus text-lg"></i>
            <span class="text-lg">
              {{ joining ? "Accepting Invitation..." : "Accept Invitation" }}
            </span>
          </button>

          <button
            @click="cancelRelationshipSelection"
            class="w-full px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            :disabled="joining"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50/95 text-red-800 border-red-200': toastType === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-medium flex-1">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

const { $firestore: db } = useNuxtApp();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const invite = ref(null);
const loading = ref(true);
const joining = ref(false);
const error = ref("");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const showRelationshipModal = ref(false);
const selectedRelationship = ref("");

// Computed property to check if user is already a member
const isAlreadyMember = computed(() => {
  if (!invite.value || !authStore.families) return false;
  return authStore.families[invite.value.familyId] !== undefined;
});

const fetchInvite = async () => {
  try {
    const inviteDoc = await getDoc(doc(db, "invites", route.params.inviteId));
    if (inviteDoc.exists()) {
      const inviteData = inviteDoc.data();
      const now = new Date();

      // Check if invite is expired
      if (inviteData.expiresAt.toDate() < now) {
        error.value =
          "This invitation has expired. Please request a new one from the family admin.";
        invite.value = null;
        return;
      }

      // Check if family still exists
      const familyDoc = await getDoc(doc(db, "families", inviteData.familyId));
      if (!familyDoc.exists()) {
        error.value =
          "The family associated with this invitation no longer exists.";
        invite.value = null;
        return;
      }

      invite.value = {
        id: inviteDoc.id,
        familyId: inviteData.familyId,
        familyName: inviteData.familyName,
        expiresAt: inviteData.expiresAt,
        createdBy: inviteData.createdBy,
      };
    } else {
      error.value =
        "Invalid invitation link. Please check the URL or request a new invitation.";
      invite.value = null;
    }
  } catch (error) {
    console.error("Error fetching invite:", {
      errorCode: error.code,
      errorMessage: error.message,
      inviteId: route.params.inviteId,
    });
    error.value = "Failed to load invitation. Please try again.";
    invite.value = null;
  } finally {
    loading.value = false;
  }
};

const formatExpiryDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown";
  }
};

const acceptInviteWithRelationship = async () => {
  if (!selectedRelationship.value) {
    showToast("Please select your relationship to the family", "error");
    return;
  }

  if (!authStore.userId) {
    router.push(`/login?redirect=/join/${route.params.inviteId}`);
    return;
  }

  if (isAlreadyMember.value) {
    showToast("You're already a member of this family!", "info");
    return;
  }

  joining.value = true;
  try {
    // Send join request to the family with relationship
    await addDoc(collection(db, `families/${invite.value.familyId}/requests`), {
      userId: authStore.userId,
      email: authStore.email,
      name: authStore.name || authStore.email.split("@")[0],
      status: "pending",
      requestedAt: serverTimestamp(),
      viaInvite: true,
      inviteId: route.params.inviteId,
      relationship: selectedRelationship.value,
    });

    showToast(
      "Invitation accepted! Your request has been sent to the family admin for approval.",
      "success"
    );

    showRelationshipModal.value = false;
    selectedRelationship.value = "";

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  } catch (error) {
    console.error("Error accepting invitation:", {
      errorCode: error.code,
      errorMessage: error.message,
      familyId: invite.value.familyId,
      userId: authStore.userId,
    });

    if (error.code === "permission-denied") {
      showToast("Permission denied. Please contact the family admin.", "error");
    } else {
      showToast("Failed to accept invitation. Please try again.", "error");
    }
  } finally {
    joining.value = false;
  }
};

const cancelRelationshipSelection = () => {
  showRelationshipModal.value = false;
  selectedRelationship.value = "";
};

const goToFamily = () => {
  if (invite.value && invite.value.familyId) {
    // Set as current family and redirect to dashboard
    authStore.setCurrentFamily(invite.value.familyId);
    router.push("/dashboard");
  }
};

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 4000);
};

onMounted(async () => {
  await authStore.initAuth();
  await fetchInvite();
});

useHead({
  title: "FamilySpace - Accept Invitation",
  meta: [
    {
      name: "description",
      content:
        "Accept your family invitation to join FamilySpace and connect with your loved ones in a private, secure space.",
    },
  ],
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}
</style>
