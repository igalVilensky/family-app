<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <!-- Glass Morphism Overlay -->
    <div class="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-white">
          {{ familyData?.familyName || "Family Profile" }}
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
        </div>
        <div v-else>
          <p class="text-gray-200 mb-4">
            <strong>Family Name:</strong> {{ familyData?.familyName }}
          </p>
          <p class="text-gray-200 mb-4">
            <strong>Members:</strong>
            {{
              familyData?.createdBy === authStore.userId
                ? "You (Admin)"
                : "Guest"
            }}
          </p>
          <!-- Placeholder for future features -->
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "~/stores/auth";
import { useFirestore } from "~/plugins/firebase";

const route = useRoute();
const authStore = useAuthStore();
const firestore = useFirestore();
const familyData = ref(null);
const loading = ref(true);
const error = ref("");

// Fetch family data based on family ID
const fetchFamilyData = async () => {
  try {
    loading.value = true;
    const familyId = route.params.id;
    const docRef = doc(firestore, "families", familyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      familyData.value = docSnap.data();
    } else {
      error.value = "Family not found";
    }
  } catch (err) {
    error.value = "Failed to load family data: " + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFamilyData);

useHead({
  title: computed(
    () => `FamilySpace - ${familyData.value?.familyName || "Family Profile"}`
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
