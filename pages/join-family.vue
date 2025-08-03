<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Join a Family</h1>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Search for a Family
        </h2>
        <form @submit.prevent="searchFamilies">
          <div class="mb-4">
            <label
              for="search"
              class="block text-sm font-medium text-gray-600 mb-2"
            >
              Family Name
            </label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter family name"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            :disabled="loading"
          >
            {{ loading ? "Searching..." : "Search" }}
          </button>
        </form>
        <div v-if="searchResults.length" class="mt-4">
          <h3 class="text-lg font-medium text-gray-800 mb-2">Results</h3>
          <div
            v-for="family in searchResults"
            :key="family.id"
            class="bg-gray-50 p-4 rounded-lg mb-2"
          >
            <p>{{ family.name }}</p>
            <button
              @click="requestToJoin(family.id)"
              class="px-4 py-2 bg-teal-600 text-white rounded-lg mt-2"
              :disabled="loading"
            >
              Request to Join
            </button>
          </div>
        </div>
      </div>
      <p class="mt-4 text-gray-600">
        Have an invitation link?
        <NuxtLink
          to="/join/[inviteId]"
          class="text-emerald-400 hover:text-emerald-300"
        >
          Join via link
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";
const { $firestore: db } = useNuxtApp();

const authStore = useAuthStore();
const router = useRouter();
const searchQuery = ref("");
const searchResults = ref([]);
const loading = ref(false);

const searchFamilies = async () => {
  loading.value = true;
  searchResults.value = [];
  try {
    const q = query(
      collection(db, "families"),
      where("name", ">=", searchQuery.value),
      where("name", "<=", searchQuery.value + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    searchResults.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error searching families:", error);
    alert("Failed to search families");
  } finally {
    loading.value = false;
  }
};

const requestToJoin = async (familyId) => {
  loading.value = true;
  try {
    await addDoc(collection(db, `families/${familyId}/requests`), {
      userId: authStore.userId,
      email: authStore.email,
      requestedAt: new Date(),
    });
    alert("Join request sent!");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error sending join request:", error);
    alert("Failed to send join request");
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Join Family",
});
</script>
