<script setup lang="ts">
import { ref, onMounted } from "vue";

const { $auth, $logout, $onAuthChange } = useNuxtApp();
const user = ref(null);

onMounted(() => {
  $onAuthChange((u) => {
    if (!u) {
      navigateTo("/");
    } else {
      user.value = u;
    }
  });
});

const signout = async () => {
  await $logout();
  navigateTo("/");
};

const createFamily = () => {
  alert("Create Family option selected");
};

const joinFamily = () => {
  alert("Join Family option selected");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          alt="Avatar"
          class="w-12 h-12 rounded-full"
        />
        <span class="text-lg font-semibold">{{ user?.displayName }}</span>
      </div>
      <button
        @click="signout"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    <div class="space-x-4">
      <button
        @click="createFamily"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Family
      </button>

      <button
        @click="joinFamily"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Join Family
      </button>
    </div>
  </div>
</template>
