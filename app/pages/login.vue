<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-6"
  >
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">
        Welcome Back to FamilyOS
      </h1>
      <p class="text-gray-600 text-center mb-8">
        Log in to your private family network and keep your memories safe.
      </p>

      <!-- Google Login -->
      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <span class="text-gray-700 font-medium">Log in with Google</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-3 text-gray-500 text-sm">or</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>

      <!-- Email Login -->
      <form @submit.prevent="loginWithEmail" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Log In
        </button>
      </form>

      <!-- Register link -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-blue-600 hover:underline">
          Register here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

let auth;
let signInWithEmailAndPassword;
let GoogleAuthProvider;
let signInWithPopup;

onMounted(async () => {
  if (process.client) {
    const firebaseAuth = await import("firebase/auth");
    auth = firebaseAuth.getAuth();
    signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    signInWithPopup = firebaseAuth.signInWithPopup;
  }
});

const loginWithEmail = async () => {
  if (!auth || !signInWithEmailAndPassword) {
    alert("Auth not ready yet, please try again.");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error logging in with email:", error);
    alert(error.message);
  }
};

const loginWithGoogle = async () => {
  if (!auth || !signInWithPopup || !GoogleAuthProvider) {
    alert("Auth not ready yet, please try again.");
    return;
  }
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error logging in with Google:", error);
    alert(error.message);
  }
};
</script>
