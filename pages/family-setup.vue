<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Set Up Your Family</h1>
      <div v-if="!authStore.familyId">
        <div class="flex flex-col gap-4">
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Create a New Family
            </h2>
            <form @submit.prevent="createFamily">
              <div class="mb-4">
                <label
                  for="familyName"
                  class="block text-sm font-medium text-gray-600 mb-2"
                >
                  Family Name
                </label>
                <input
                  type="text"
                  id="familyName"
                  v-model="familyName"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your family name"
                  required
                />
              </div>
              <button
                type="submit"
                class="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
                :disabled="loading"
              >
                {{ loading ? "Creating..." : "Create Family" }}
              </button>
            </form>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Join an Existing Family
            </h2>
            <button
              @click="router.push('/join-family')"
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Find a Family
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-600">You’re already part of a family!</p>
        <NuxtLink
          to="/dashboard"
          class="text-emerald-400 hover:text-emerald-300"
        >
          Go to Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";
const { $firestore: db } = useNuxtApp();

const authStore = useAuthStore();
const router = useRouter();
const familyName = ref("");
const loading = ref(false);

const createFamily = async () => {
  if (!familyName.value.trim()) {
    alert("Please enter a family name");
    return;
  }

  loading.value = true;
  try {
    const familyRef = await addDoc(collection(db, "families"), {
      name: familyName.value,
      adminId: authStore.userId,
      members: [
        { userId: authStore.userId, role: "admin", email: authStore.email },
      ],
      createdAt: new Date(),
    });
    await setDoc(
      doc(db, "users", authStore.userId),
      { familyId: familyRef.id, role: "admin" },
      { merge: true }
    );
    await authStore.initAuth(); // Refresh auth state
    router.push("/dashboard");
  } catch (error) {
    console.error("Error creating family:", error);
    alert("Failed to create family");
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Family Setup",
});
</script>
