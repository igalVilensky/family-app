<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>
    <div class="relative z-10 max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-white">
          {{ familyData?.name || "Family Profile" }}
        </h1>
        <p class="text-lg text-gray-300 mt-2">
          A private space for your family to connect and share.
        </p>
      </div>
      <div
        class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white border-opacity-20"
      >
        <h2 class="text-xl sm:text-2xl font-semibold text-white mb-4">
          Family Details
        </h2>
        <div v-if="loading" class="text-center text-gray-300">
          Loading family data...
        </div>
        <div v-else-if="error" class="text-center text-red-400">
          {{ error }}
          <div v-if="!authStore.familyId" class="mt-4">
            <NuxtLink
              to="/family-setup"
              class="text-emerald-400 hover:text-emerald-300"
            >
              Set up your family
            </NuxtLink>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-200 mb-4">
            <strong>Family Name:</strong> {{ familyData?.name }}
          </p>
          <p class="text-gray-200 mb-4">
            <strong>Members:</strong>
            <span
              v-for="(member, index) in familyData?.members"
              :key="member.userId"
            >
              {{ member.userId === authStore.userId ? "You" : member.email }}
              ({{ member.role }})
              {{ index < familyData.members.length - 1 ? ", " : "" }}
            </span>
          </p>
          <div class="mt-6">
            <p class="text-gray-300 italic">
              Coming soon: Add members, share memories, and plan events!
            </p>
          </div>
        </div>
      </div>
      <div class="mt-6 text-center">
        <NuxtLink
          to="/dashboard"
          class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
        >
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "~/stores/auth";
import { useFirestore } from "~/plugins/firebase";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const firestore = useFirestore();
const familyData = ref(null);
const loading = ref(true);
const error = ref("");

const fetchFamilyData = async () => {
  try {
    loading.value = true;
    const familyId = route.params.id;
    console.log("fetchFamilyData: Fetching family data", { familyId });
    if (!familyId || familyId === "null") {
      error.value = "No family assigned. Please set up or join a family.";
      console.log("fetchFamilyData: Invalid familyId", { familyId });
      return;
    }
    const docRef = doc(firestore, "families", familyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      familyData.value = docSnap.data();
      console.log("fetchFamilyData: Family data loaded", familyData.value);
    } else {
      error.value = "Family not found";
      console.log("fetchFamilyData: Family not found", { familyId });
    }
  } catch (err) {
    error.value = "Failed to load family data: " + err.message;
    console.error("fetchFamilyData: Error", {
      errorCode: err.code,
      errorMessage: err.message,
      familyId: route.params.id,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await authStore.initAuth();
  console.log("onMounted: authStore state", {
    userId: authStore.userId,
    familyId: authStore.familyId,
    role: authStore.role,
    routeFamilyId: route.params.id,
  });
  if (!authStore.familyId) {
    console.log("onMounted: No familyId, redirecting to /family-setup");
    router.push("/family-setup");
  } else {
    await fetchFamilyData();
  }
});

useHead({
  title: computed(
    () => `FamilySpace - ${familyData.value?.name || "Family Profile"}`
  ),
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
