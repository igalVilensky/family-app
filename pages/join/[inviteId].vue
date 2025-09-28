<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">
        Join Family via Invitation
      </h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else-if="invite">
        <p class="text-gray-600 mb-4">
          You’ve been invited to join <strong>{{ invite.familyName }}</strong
          >.
        </p>
        <button
          @click="acceptInvite"
          class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
          :disabled="joining"
        >
          {{ joining ? "Requesting..." : "Request to Join" }}
        </button>
      </div>
      <div v-else>
        <p class="text-red-600">Invalid or expired invitation.</p>
        <NuxtLink
          to="/join-family"
          class="text-emerald-400 hover:text-emerald-300"
        >
          Search for a family
        </NuxtLink>
      </div>
      <div
        v-if="showToastMessage"
        class="absolute top-0 left-0 right-0 mt-[-4rem] bg-green-500 text-white text-center py-2 rounded-lg shadow-lg"
      >
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
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

const fetchInvite = async () => {
  try {
    // console.log(
    //   "fetchInvite: Attempting to fetch invite with ID:",
    //   route.params.inviteId
    // );
    const inviteDoc = await getDoc(doc(db, "invites", route.params.inviteId));
    if (inviteDoc.exists()) {
      const inviteData = inviteDoc.data();
      // console.log("fetchInvite: Invite data:", inviteData);
      const now = new Date();
      if (inviteData.expiresAt.toDate() < now) {
        console.error("Invite has expired:", route.params.inviteId);
        error.value = "Invite has expired";
        invite.value = null;
        return;
      }
      invite.value = {
        familyId: inviteData.familyId,
        familyName: inviteData.familyName,
      };
    } else {
      console.error("Invite does not exist:", route.params.inviteId);
      error.value = "Invite does not exist";
      invite.value = null;
    }
  } catch (error) {
    console.error("Error fetching invite:", {
      errorCode: error.code,
      errorMessage: error.message,
      inviteId: route.params.inviteId,
    });
    error.value = "Failed to fetch invite: " + error.message;
    invite.value = null;
  } finally {
    loading.value = false;
  }
};

const acceptInvite = async () => {
  if (!authStore.userId) {
    console.log("acceptInvite: User not authenticated, redirecting to /login");
    router.push(`/login?redirect=/join/${route.params.inviteId}`);
    return;
  }
  joining.value = true;
  try {
    // console.log("acceptInvite: Updating user document", {
    //   userId: authStore.userId,
    //   familyId: invite.value.familyId,
    // });
    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: invite.value.familyId,
      role: "pending",
      status: "pending",
    });
    // console.log("acceptInvite: User document updated");
    // console.log("acceptInvite: Sending join request", {
    //   familyId: invite.value.familyId,
    //   userId: authStore.userId,
    //   email: authStore.email,
    // });
    const requestRef = await addDoc(
      collection(db, `families/${invite.value.familyId}/requests`),
      {
        userId: authStore.userId,
        email: authStore.email,
        status: "pending",
        requestedAt: serverTimestamp(),
      }
    );
    // console.log("acceptInvite: Join request created with ID:", requestRef.id);
    showToast("Join request sent! Waiting for parent approval.", "success");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error sending join request:", {
      errorCode: error.code,
      errorMessage: error.message,
      familyId: invite.value.familyId,
      userId: authStore.userId,
    });
    showToast("Failed to send join request: " + error.message, "error");
  } finally {
    joining.value = false;
  }
};

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

onMounted(async () => {
  await authStore.initAuth();
  await fetchInvite();
});

useHead({
  title: "FamilySpace - Accept Invitation",
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
