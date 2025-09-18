<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">
        Join Family via Invitation
      </h1>
      <div v-if="loading">Loading...</div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { doc, getDoc, addDoc, collection } from "firebase/firestore"; // Add collection
import { useNuxtApp } from "#app";

const { $firestore: db } = useNuxtApp();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const invite = ref(null);
const loading = ref(true);
const joining = ref(false);

const fetchInvite = async () => {
  try {
    console.log(
      "fetchInvite: Attempting to fetch invite with ID:",
      route.params.inviteId
    );
    const inviteDoc = await getDoc(doc(db, "invites", route.params.inviteId));
    if (inviteDoc.exists()) {
      const inviteData = inviteDoc.data();
      console.log("fetchInvite: Invite data:", inviteData);
      const now = new Date();
      if (inviteData.expiresAt.toDate() < now) {
        console.error("Invite has expired:", route.params.inviteId);
        invite.value = null;
        return;
      }
      invite.value = {
        familyId: inviteData.familyId,
        familyName: inviteData.familyName,
      };
    } else {
      console.error("Invite does not exist:", route.params.inviteId);
      invite.value = null;
    }
  } catch (error) {
    console.error("Error fetching invite:", error, {
      inviteId: route.params.inviteId,
      errorCode: error.code,
      errorMessage: error.message,
    });
    invite.value = null;
  } finally {
    loading.value = false;
  }
};

const acceptInvite = async () => {
  if (!authStore.userId) {
    console.log("acceptInvite: User not authenticated, redirecting to /login");
    router.push("/login");
    return;
  }
  joining.value = true;
  try {
    console.log("acceptInvite: Sending join request", {
      familyId: invite.value.familyId,
      userId: authStore.userId,
      email: authStore.email,
    });
    const requestRef = await addDoc(
      collection(db, `families/${invite.value.familyId}/requests`),
      {
        userId: authStore.userId,
        email: authStore.email,
        requestedAt: new Date(),
      }
    );
    console.log("acceptInvite: Join request created with ID:", requestRef.id);
    alert("Join request sent! Waiting for parent approval.");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error sending join request:", {
      errorCode: error.code,
      errorMessage: error.message,
      familyId: invite.value.familyId,
      userId: authStore.userId,
    });
    alert("Failed to send join request: " + error.message);
  } finally {
    joining.value = false;
  }
};

onMounted(fetchInvite);

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
