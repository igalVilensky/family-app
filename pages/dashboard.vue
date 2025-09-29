<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">FamilySpace</h1>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="fas fa-sign-out-alt text-sm"></i>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- User Profile Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div class="text-center">
          <NuxtLink to="/profile" class="inline-block group">
            <avatar
              :avatar-url="authStore.avatarUrl"
              :user-initial="userInitial"
              :size="80"
              :no-upload="true"
              class="hover:ring-4 hover:ring-blue-100 transition-all duration-200"
            />
          </NuxtLink>
          <h2 class="text-3xl font-bold text-gray-900 mt-4">
            Welcome, {{ authStore.name || "User" }}
          </h2>
          <div
            class="flex items-center justify-center gap-2 mt-2 text-gray-600"
          >
            <i class="fas fa-users text-sm"></i>
            <span class="text-lg">
              {{
                authStore.familyRole === "parent"
                  ? "Parent"
                  : authStore.permissions.role === "pending"
                  ? "Pending Member"
                  : authStore.permissions.role
              }}
              of {{ authStore.familyName || "Your Family" }}
            </span>
          </div>
          <NuxtLink
            to="/profile"
            class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-user-edit text-sm"></i>
            Edit Profile
          </NuxtLink>
        </div>
      </div>

      <!-- Family Status Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Status Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="fas fa-info-circle text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Family Status</h3>
          </div>

          <div v-if="!authStore.familyId" class="text-gray-600 mb-6">
            <p class="mb-4">You haven't joined a family yet.</p>
            <p class="text-sm text-gray-500">
              Create one or join an existing family to get started.
            </p>
          </div>

          <div
            v-else-if="authStore.status !== 'active'"
            class="text-gray-600 mb-6"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span class="font-medium text-amber-700">Pending Approval</span>
            </div>
            <p class="mb-4">
              Your join request is waiting for approval from a parent.
            </p>
            <button
              @click="checkApprovalStatus"
              class="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
              :disabled="checkingStatus"
            >
              <i
                class="fas fa-sync-alt text-sm"
                :class="{ 'animate-spin': checkingStatus }"
              ></i>
              {{ checkingStatus ? "Checking..." : "Check Status" }}
            </button>
          </div>

          <div v-else class="text-gray-600 mb-6">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span class="font-medium text-green-700">Active Member</span>
            </div>
            <p>You're all set! Manage your family's memories and events.</p>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="fas fa-bolt text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Quick Actions</h3>
          </div>

          <div class="space-y-3">
            <NuxtLink
              v-if="!authStore.familyId"
              to="/family-setup"
              class="flex items-center gap-3 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <i class="fas fa-plus-circle"></i>
              <span class="font-medium">Set Up Family</span>
            </NuxtLink>

            <NuxtLink
              v-if="authStore.familyId"
              :to="`/family/${authStore.familyId}`"
              class="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-home"></i>
              <span class="font-medium">View Family Profile</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Parent Only Sections -->
      <div
        v-if="authStore.permissions.role === 'admin' && authStore.familyId"
        class="space-y-6"
      >
        <!-- Invite Management -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-purple-100 rounded-lg">
              <i class="fas fa-user-plus text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Invite Family Members
            </h3>
          </div>

          <button
            @click="generateInviteLink"
            class="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors mb-4"
            :disabled="generatingInvite"
          >
            <i class="fas fa-link text-sm"></i>
            {{ generatingInvite ? "Generating..." : "Generate Invite Link" }}
          </button>

          <div
            v-if="inviteLink"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Share this link to invite members:
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                :value="inviteLink"
                readonly
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                @click="$event.target.select()"
              />
              <button
                @click="copyInviteLink"
                class="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-copy text-sm"></i>
                {{ copyButtonText }}
              </button>
            </div>
          </div>
        </div>

        <!-- Join Requests -->
        <div
          v-if="joinRequests.length"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-amber-100 rounded-lg">
              <i class="fas fa-user-clock text-amber-600"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              Pending Join Requests
              <span
                class="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
              >
                {{ joinRequests.length }}
              </span>
            </h3>
          </div>

          <div class="space-y-4">
            <div
              v-for="request in joinRequests"
              :key="request.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-200 rounded-full">
                  <i class="fas fa-user text-gray-600"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ request.email }}</p>
                  <p class="text-sm text-gray-500">wants to join your family</p>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="
                    approveRequest(request.id, request.userId, request.email)
                  "
                  class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-check text-sm"></i>
                  Approve
                </button>
                <button
                  @click="denyRequest(request.id)"
                  class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i class="fas fa-times text-sm"></i>
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="showToastMessage"
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div
          class="p-4 rounded-lg shadow-lg border"
          :class="{
            'bg-green-50 text-green-800 border-green-200':
              toastType === 'success',
            'bg-red-50 text-red-800 border-red-200': toastType === 'error',
          }"
        >
          <div class="flex items-center gap-3">
            <i
              class="text-sm"
              :class="{
                'fas fa-check-circle text-green-500': toastType === 'success',
                'fas fa-exclamation-circle text-red-500': toastType === 'error',
              }"
            ></i>
            <p class="font-medium">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { generateInvite } from "~/utils/firebase";
import Avatar from "~/components/Avatar.vue";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();
const joinRequests = ref([]);
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const checkingStatus = ref(false);

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const checkApprovalStatus = async () => {
  checkingStatus.value = true;
  try {
    const familyDoc = await getDoc(doc(db, "families", authStore.familyId));
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const isMember = familyData.members.some(
        (member) => member.userId === authStore.userId
      );
      console.log("checkApprovalStatus: isMember =", isMember);

      if (isMember) {
        await updateDoc(doc(db, "users", authStore.userId), {
          role: "member",
          status: "active",
        });
        authStore.permissions.role = "member";
        authStore.status = "active";
        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );
      } else {
        showToast("Your request is still pending.", "error");
      }
    } else {
      showToast("Family not found. Please contact support.", "error");
    }
  } catch (error) {
    console.error("Error checking approval status:", error);
    showToast("Failed to check status: " + error.message, "error");
  } finally {
    checkingStatus.value = false;
  }
};

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    authStore.clearAuth();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
    showToast("Failed to log out", "error");
  }
};

const fetchJoinRequests = async () => {
  if (authStore.permissions.role === "admin" && authStore.familyId) {
    try {
      const querySnapshot = await getDocs(
        collection(db, `families/${authStore.familyId}/requests`)
      );
      joinRequests.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching join requests:", error);
      showToast("Failed to fetch join requests", "error");
    }
  }
};

const approveRequest = async (requestId, userId, email) => {
  try {
    const auth = getAuth();
    await updateDoc(doc(db, "families", authStore.familyId), {
      members: arrayUnion({ userId, role: "member", email }),
    });
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    fetchJoinRequests();
    showToast("Request approved successfully", "success");
  } catch (error) {
    console.error("Error approving request:", {
      errorCode: error.code,
      errorMessage: error.message,
      requestId,
      userId,
      familyId: authStore.familyId,
    });
    showToast("Failed to approve request: " + error.message, "error");
  }
};

const denyRequest = async (requestId) => {
  try {
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    fetchJoinRequests();
    showToast("Request denied successfully", "success");
  } catch (error) {
    console.error("Error denying request:", error);
    showToast("Failed to deny request", "error");
  }
};

const generateInviteLink = async () => {
  if (authStore.permissions.role !== "admin") {
    console.error("generateInviteLink: User is not a admin", {
      role: authStore.permissions.role,
      userId: authStore.userId,
    });
    showToast("Only admins can generate invite links", "error");
    return;
  }
  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      authStore.familyId,
      authStore.familyName,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
  } catch (error) {
    console.error("Error generating invite link:", error);
    showToast("Failed to generate invite link: " + error.message, "error");
  } finally {
    generatingInvite.value = false;
  }
};

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    copyButtonText.value = "Copied";
    setTimeout(() => {
      copyButtonText.value = "Copy";
    }, 1000);
  } catch (error) {
    console.error("Error copying invite link:", error);
    showToast("Failed to copy invite link", "error");
  }
};

onMounted(async () => {
  await authStore.initAuth();
  if (!authStore.isInitialized) {
    router.push("/login?redirect=/dashboard");
    return;
  }
  await fetchJoinRequests();
});

useHead({
  title: "FamilySpace - Dashboard",
});

definePageMeta({
  middleware: ["auth"],
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
</style>
