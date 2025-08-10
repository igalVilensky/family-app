<script setup lang="ts">
import { ref, onMounted } from "vue";

const { $signInWithGoogle, $logout, $onAuthChange } = useNuxtApp();

const user = ref(null);

onMounted(() => {
  $onAuthChange((u) => {
    user.value = u;
  });
});

const login = async () => {
  try {
    await $signInWithGoogle();
  } catch (err) {
    console.error("Login failed:", err);
  }
};

const signout = async () => {
  await $logout();
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100"
  >
    <div v-if="!user">
      <button
        @click="login"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>

    <div v-else class="text-center">
      <img
        :src="user.photoURL"
        alt="Profile"
        class="w-16 h-16 rounded-full mx-auto mb-2"
      />
      <p class="mb-4">Hello, {{ user.displayName }}</p>
      <button
        @click="signout"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign out
      </button>
    </div>
  </div>
</template>
