<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
        Welcome to {{ authStore.familyName || "Your Family" }}’s Dashboard
      </h1>
      <p v-if="!authStore.familyId" class="text-lg text-gray-600 mb-8">
        You haven’t joined a family yet. Create one or join an existing family!
      </p>
      <p v-else class="text-lg text-gray-600 mb-8">
        Manage your family’s memories, events, and more.
      </p>
      <div
        v-if="!authStore.familyId"
        class="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <NuxtLink
          to="/family-setup"
          class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
        >
          Set Up Family
        </NuxtLink>
      </div>
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
          :disabled="generatingInvite || authStore.role !== 'parent'"
        >
          {{ generatingInvite ? "Generating..." : "Generate Invite Link" }}
        </button>
        <div v-if="inviteLink" class="mt-4">
          <p class="text-gray-600">Share this link to invite members:</p>
          <input
            type="text"
            :value="inviteLink"
            readonly
            class="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-50 text-gray-800"
            @click="$event.target.select()"
          />
        </div>
      </div>
      <div
        v-if="authStore.role === 'parent' && joinRequests.length"
        class="mt-8"
      >
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Join Requests</h2>
        <div
          v-for="request in joinRequests"
          :key="request.id"
          class="bg-white p-4 rounded-lg shadow mb-4"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { generateInvite } from "~/utils/firebase";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();
const joinRequests = ref([]);
const inviteLink = ref("");
const generatingInvite = ref(false);

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    authStore.clearAuth();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to log out");
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
    }
  }
};

const approveRequest = async (requestId, userId, email) => {
  try {
    const auth = getAuth();
    console.log("approveRequest: Approving request", {
      requestId,
      userId,
      email,
      familyId: authStore.familyId,
      currentUserId: auth.currentUser?.uid,
    });
    await updateDoc(doc(db, "families", authStore.familyId), {
      members: arrayUnion({ userId, role: "member", email }),
    });
    console.log("approveRequest: Family members updated");
    console.log("approveRequest: Updating user document", {
      userId,
      data: { familyId: authStore.familyId, role: "member" },
    });
    await updateDoc(doc(db, "users", userId), {
      familyId: authStore.familyId,
      role: "member",
    });
    console.log("approveRequest: User document updated");
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    console.log("approveRequest: Join request deleted");
    fetchJoinRequests();
    alert("Request approved successfully");
  } catch (error) {
    console.error("Error approving request:", {
      errorCode: error.code,
      errorMessage: error.message,
      requestId,
      userId,
      familyId: authStore.familyId,
    });
    alert("Failed to approve request: " + error.message);
  }
};

const denyRequest = async (requestId) => {
  try {
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    fetchJoinRequests();
  } catch (error) {
    console.error("Error denying request:", error);
    alert("Failed to deny request");
  }
};

const generateInviteLink = async () => {
  if (authStore.role !== "parent") {
    console.error("generateInviteLink: User is not a parent", {
      role: authStore.role,
      userId: authStore.userId,
    });
    alert("Only parents can generate invite links");
    return;
  }
  generatingInvite.value = true;
  try {
    const baseUrl = "https://family-app.netlify.app";
    console.log("generateInviteLink: Calling generateInvite", {
      familyId: authStore.familyId,
      familyName: authStore.familyName,
      userId: authStore.userId,
    });
    const inviteId = await generateInvite(
      authStore.familyId,
      authStore.familyName,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
  } catch (error) {
    console.error("Error generating invite link:", error);
    alert("Failed to generate invite link: " + error.message);
  } finally {
    generatingInvite.value = false;
  }
};

onMounted(fetchJoinRequests);

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
