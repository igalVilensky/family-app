<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/join-family"
              class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Search Families
            </NuxtLink>
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-link text-white text-2xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            Join with
            <span
              class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
              >Invite Link</span
            >
          </h1>
          <p class="text-gray-600 text-lg">
            Enter your family invitation link below
          </p>
        </div>

        <!-- Invite Form -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <form @submit.prevent="processInviteLink" class="space-y-6">
            <!-- Invite Link Input -->
            <div>
              <label
                for="inviteLink"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Invitation Link
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-external-link-alt text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  id="inviteLink"
                  v-model="inviteLink"
                  class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                  placeholder="https://my-nest.netlify.app/join/abc123..."
                  required
                  :disabled="loading"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2">
                Paste the full invitation link sent to you by the family admin
              </p>
            </div>

            <!-- Error Message -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 rounded-xl p-4 animate-slideIn"
            >
              <div class="flex items-center gap-3">
                <i
                  class="fas fa-exclamation-circle text-red-500 text-lg flex-shrink-0"
                ></i>
                <p class="text-red-800 text-sm font-medium">{{ error }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="loading || !inviteLink.trim()"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-arrow-right text-lg"></i>
              <span class="text-lg">
                {{ loading ? "Processing..." : "Join Family" }}
              </span>
            </button>
          </form>

          <!-- Help Text -->
          <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div class="flex items-center gap-3">
              <i class="fas fa-info-circle text-blue-600 text-lg"></i>
              <div>
                <p class="text-sm text-blue-800 font-medium">
                  Where to find your invite link?
                </p>
                <p class="text-xs text-blue-700 mt-1">
                  The family admin should send you a link that looks like:
                  <code class="bg-blue-100 px-1 rounded"
                    >https://my-nest.netlify.app/join/abc123...</code
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Alternative Options -->
        <div class="text-center space-y-4">
          <p class="text-gray-500 text-sm">
            Don't have a link?
            <NuxtLink
              to="/join-family"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              Search for families instead
            </NuxtLink>
          </p>

          <!-- Show create family option for authenticated users without families -->
          <div
            v-if="authStore.isAuthenticated && !authStore.hasFamily"
            class="pt-4 border-t border-gray-200"
          >
            <p class="text-gray-500 text-sm mb-2">Or start your own family</p>
            <NuxtLink
              to="/family-setup"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
            >
              <i class="fas fa-plus text-sm"></i>
              Create Family
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const inviteLink = ref("");
const loading = ref(false);
const error = ref("");

onMounted(async () => {
  await authStore.initAuth();
});

const processInviteLink = () => {
  if (!inviteLink.value.trim()) return;

  loading.value = true;
  error.value = "";

  try {
    // Extract the invite ID from the URL
    const url = new URL(inviteLink.value);
    const pathParts = url.pathname.split("/");
    const inviteId = pathParts[pathParts.length - 1];

    if (!inviteId) {
      throw new Error("Invalid invitation link format");
    }

    // Redirect to the join page with the invite ID
    router.push(`/join/${inviteId}`);
  } catch (err) {
    console.error("Error processing invite link:", err);
    error.value =
      "Please enter a valid FamilySpace invitation link. Make sure it starts with https://my-nest.netlify.app/join/";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Join with Invite Link",
});
</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
