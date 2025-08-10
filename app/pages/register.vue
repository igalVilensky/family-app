<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-6"
  >
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">
        Create Your FamilyOS Account
      </h1>
      <p class="text-gray-600 text-center mb-8">
        Join your private, smart family network and start preserving memories
        today.
      </p>

      <!-- Google Register -->
      <button
        @click="signUpWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <span class="text-gray-700 font-medium">Sign up with Google</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-1 border-t border-gray-300"></div>
        <span class="px-3 text-gray-500 text-sm">or</span>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>

      <!-- Email Register -->
      <form @submit.prevent="registerWithEmail" class="space-y-4">
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
          Create Account
        </button>
      </form>

      <!-- Login link -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
          Log in here
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
let createUserWithEmailAndPassword;
let GoogleAuthProvider;
let signInWithPopup;

onMounted(async () => {
  if (process.client) {
    // Import Firebase auth functions dynamically only on client
    const firebaseAuth = await import("firebase/auth");
    auth = firebaseAuth.getAuth();
    createUserWithEmailAndPassword =
      firebaseAuth.createUserWithEmailAndPassword;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    signInWithPopup = firebaseAuth.signInWithPopup;
  }
});

const registerWithEmail = async () => {
  if (!auth || !createUserWithEmailAndPassword) {
    alert("Auth is not ready yet, please try again.");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error registering with email:", error);
    alert(error.message);
  }
};

const signUpWithGoogle = async () => {
  if (!auth || !signInWithPopup || !GoogleAuthProvider) {
    alert("Auth is not ready yet, please try again.");
    return;
  }
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error signing up with Google:", error);
    alert(error.message);
  }
};
</script>
