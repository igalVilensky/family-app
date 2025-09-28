<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
      <!-- User Info Section -->
      <div class="text-center">
        <NuxtLink to="/profile" class="inline-block group">
          <avatar
            :avatar-url="authStore.avatarUrl"
            :user-initial="userInitial"
            :size="100"
            :no-upload="true"
            class="hover:ring-emerald-500/50 transition-all duration-300"
          />
        </NuxtLink>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mt-4">
          Welcome, {{ authStore.name || "User" }}
        </h1>
        <p class="text-lg text-gray-600 mt-2">
          {{
            authStore.role === "parent"
              ? "Parent"
              : authStore.role === "pending"
              ? "Pending Member"
              : authStore.role
          }}
          of
          {{ authStore.familyName || "Your Family" }}
        </p>
        <NuxtLink
          to="/profile"
          class="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
        >
          Edit Profile
        </NuxtLink>
      </div>

      <!-- Family Status and Actions -->
      <div class="mt-8 text-center">
        <p v-if="!authStore.familyId" class="text-lg text-gray-600 mb-6">
          You haven’t joined a family yet. Create one or join an existing
          family!
        </p>
        <div
          v-else-if="authStore.status !== 'active'"
          class="text-lg text-gray-600 mb-6"
        >
          <p>Your join request is pending approval.</p>
          <button
            @click="checkApprovalStatus"
            class="mt-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
            :disabled="checkingStatus"
          >
            {{ checkingStatus ? "Checking..." : "Check Approval Status" }}
          </button>
        </div>
        <p v-else class="text-lg text-gray-600 mb-6">
          Manage your family’s memories, events, and more.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            v-if="!authStore.familyId"
            to="/family-setup"
            class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Set Up Family
          </NuxtLink>
          <NuxtLink
            v-if="authStore.familyId"
            :to="`/family/${authStore.familyId}`"
            class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
          >
            View Family Profile
          </NuxtLink>
          <button
            @click="handleLogout"
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Manage Invitations (Parents Only) -->
      <div
        v-if="authStore.role === 'parent' && authStore.familyId"
        class="mt-8"
      >
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Manage Invitations
        </h2>
        <button
          @click="generateInviteLink"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          :disabled="generatingInvite"
        >
          {{ generatingInvite ? "Generating..." : "Generate Invite Link" }}
        </button>
        <div v-if="inviteLink" class="mt-4 flex items-center gap-2">
          <p class="text-gray-600">Share this link to invite members:</p>
          <input
            type="text"
            :value="inviteLink"
            readonly
            class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-800"
            @click="$event.target.select()"
          />
          <button
            @click="copyInviteLink"
            class="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow hover:shadow-teal-600/25 transition-all duration-300"
          >
            {{ copyButtonText }}
          </button>
        </div>
      </div>

      <!-- Join Requests (Parents Only) -->
      <div
        v-if="
          authStore.role === 'parent' &&
          joinRequests.length &&
          authStore.familyId
        "
        class="mt-8"
      >
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Join Requests</h2>
        <div
          v-for="request in joinRequests"
          :key="request.id"
          class="bg-gray-50 p-4 rounded-lg shadow mb-4"
        >
          <p>{{ request.email }} wants to join your family</p>
          <div class="flex gap-2 mt-2">
            <button
              @click="approveRequest(request.id, request.userId, request.email)"
              class="px-4 py-2 bg-teal-600 text-white rounded-lg"
            >
              Approve
            </button>
            <button
              @click="denyRequest(request.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Deny
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="showToastMessage"
        class="absolute top-0 left-0 right-0 mt-[-4rem] bg-green-500 text-white text-center py-2 rounded-lg shadow-lg"
        :class="{ 'bg-red-500': toastType === 'error' }"
      >
        {{ toastMessage }}
      </div>
    </div>
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
        authStore.role = "member";
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
  if (authStore.role === "parent" && authStore.familyId) {
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
  if (authStore.role !== "parent") {
    console.error("generateInviteLink: User is not a parent", {
      role: authStore.role,
      userId: authStore.userId,
    });
    showToast("Only parents can generate invite links", "error");
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
