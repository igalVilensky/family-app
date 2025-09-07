<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12"
  >
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="mb-6 text-center">
        <h2 class="text-3xl font-bold text-gray-900">Set Up Your Profile</h2>
        <p class="text-gray-600 text-sm mt-2">
          Add your details to join or start your family space.
        </p>
      </div>

      <!-- Profile Form -->
      <div v-if="authStore.userId">
        <div v-if="error" class="text-center text-red-600 mb-4">
          {{ error }}
        </div>
        <form
          class="bg-white border border-gray-200 rounded-lg p-6"
          @submit.prevent="handleProfileSetup"
        >
          <div class="mb-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="role"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Role in Family
            </label>
            <select
              id="role"
              v-model="role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="grandparent">Grandparent</option>
              <option value="sibling">Sibling</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? "Saving Profile..." : "Save Profile" }}
          </button>
        </form>
      </div>
      <div v-else class="text-center text-gray-700">
        <p>Please log in to set up your profile.</p>
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
          Sign in here
        </NuxtLink>
      </div>
      <p class="mt-4 text-center text-gray-600 text-sm">
        <NuxtLink to="/privacy" class="text-blue-600 hover:underline"
          >Privacy Policy</NuxtLink
        >
        |
        <NuxtLink to="/settings/data" class="text-blue-600 hover:underline"
          >Manage Data</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { createProfile } from "~/utils/firebase";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();
const name = ref("");
const role = ref("parent");
const error = ref("");
const loading = ref(false);

const isFormValid = computed(() => {
  const nameTrimmed = name.value.trim();
  // Ensure name is not empty and does not look like an email
  const isValidName = nameTrimmed !== "" && !nameTrimmed.includes("@");
  return isValidName && role.value !== "";
});

const handleProfileSetup = async () => {
  if (!isFormValid.value) {
    error.value = name.value.includes("@")
      ? "Name should not contain '@'. Please enter a valid full name."
      : "Please fill all required fields";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    console.log("Submitting profile:", {
      userId: authStore.userId,
      name: name.value,
      role: role.value,
    });
    await createProfile(authStore.userId, {
      name: name.value,
      role: role.value,
    });
    console.log("Profile saved successfully, redirecting to /dashboard");
    router.push("/dashboard");
  } catch (err) {
    console.error("Profile setup error:", err);
    error.value = err.message.includes("permission-denied")
      ? "Permission denied. Please ensure you are logged in."
      : err.message || "Failed to save profile";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Set Up Profile",
  meta: [
    {
      name: "description",
      content: "Complete your FamilySpace profile to connect with your family.",
    },
  ],
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=block");

* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
