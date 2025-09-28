<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-md w-full text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-gray-600">Loading...</div>

      <!-- Error State -->
      <div v-else-if="error" class="text-red-600">{{ error }}</div>

      <!-- Profile Content -->
      <div v-else class="bg-white p-6 rounded-lg shadow-lg">
        <!-- Avatar -->
        <avatar
          :avatar-url="form.avatarUrl"
          :loading="avatarLoading"
          :user-initial="userInitial"
          :size="120"
          @update:avatarUrl="form.avatarUrl = $event"
          @notify="showToast"
        />

        <!-- Family Membership -->
        <div
          v-if="authStore.familyId && authStore.status === 'active'"
          class="mt-4"
        >
          <p class="text-gray-600">
            Member of
            <NuxtLink
              :to="`/family/${authStore.familyId}`"
              class="text-emerald-500 hover:text-emerald-400"
            >
              {{ authStore.familyName || "Your Family" }}
            </NuxtLink>
          </p>
        </div>
        <div
          v-else-if="authStore.status === 'pending'"
          class="mt-4 text-gray-600"
        >
          Your join request for {{ authStore.familyName || "a family" }} is
          pending approval.
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile" class="mt-6 space-y-4">
          <div>
            <label for="name" class="block text-gray-600 font-medium"
              >Name</label
            >
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-800"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label for="role" class="block text-gray-600 font-medium"
              >Role</label
            >
            <select
              id="role"
              v-model="form.role"
              class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-800"
              :disabled="authStore.status !== 'active'"
              required
            >
              <option value="pending" disabled>Pending</option>
              <option value="Mom">Mom</option>
              <option value="Dad">Dad</option>
              <option value="Child">Child</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Sibling">Sibling</option>
              <option value="Aunt">Aunt</option>
              <option value="Uncle">Uncle</option>
              <option value="Cousin">Cousin</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label for="birthday" class="block text-gray-600 font-medium"
              >Birthday</label
            >
            <input
              id="birthday"
              v-model="form.birthday"
              type="date"
              class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-800"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label for="bio" class="block text-gray-600 font-medium">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-800"
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
            :disabled="saving"
          >
            {{ saving ? "Saving..." : "Save Profile" }}
          </button>
        </form>
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";
import Avatar from "~/components/Avatar.vue";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref("");
const saving = ref(false);
const avatarLoading = ref(false);
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");

const form = ref({
  name: "",
  role: "",
  birthday: "",
  bio: "",
  avatarUrl: "",
});

const userInitial = computed(() =>
  form.value.name ? form.value.name.charAt(0).toUpperCase() : "?"
);

const showToast = (event) => {
  toastMessage.value = event.message;
  toastType.value = event.type || "success";
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const fetchProfile = async () => {
  if (!authStore.userId) {
    router.push("/login?redirect=/profile");
    return;
  }
  try {
    const userDoc = await getDoc(doc(db, "users", authStore.userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      form.value = {
        name: data.name || "",
        role: data.role || "pending",
        birthday: data.birthday || "",
        bio: data.bio || "",
        avatarUrl: data.avatarUrl || "",
      };
    } else {
      error.value = "User profile not found";
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    error.value = "Failed to load profile";
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  if (!authStore.userId) {
    router.push("/login?redirect=/profile");
    return;
  }
  saving.value = true;
  try {
    const updates = {
      name: form.value.name,
      role: form.value.role,
      birthday: form.value.birthday || null,
      bio: form.value.bio || null,
      avatarUrl: form.value.avatarUrl || null,
    };
    await updateDoc(doc(db, "users", authStore.userId), updates);
    authStore.name = form.value.name;
    authStore.role = form.value.role;
    showToast({ message: "Profile updated successfully", type: "success" });
  } catch (err) {
    console.error("Error saving profile:", err);
    showToast({
      message: "Failed to save profile: " + err.message,
      type: "error",
    });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await authStore.initAuth();
  if (!authStore.isInitialized) {
    router.push("/login?redirect=/profile");
    return;
  }
  await fetchProfile();
});

useHead({
  title: "FamilySpace - Profile",
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
