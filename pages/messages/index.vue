<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-comments text-white text-sm sm:text-lg"></i>
            </div>
            <h1
              class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              Messages
            </h1>
          </div>
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <i class="fas fa-arrow-left text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">Back to Dashboard</span>
            <span class="sm:hidden">Back</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Loading messages...</p>
      </div>

      <!-- Conversations List -->
      <div
        v-else-if="conversations.length > 0"
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden"
      >
        <div
          v-for="conversation in conversations"
          :key="conversation.userId"
          class="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          @click="openConversation(conversation.userId)"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
            >
              <img
                v-if="conversation.avatarUrl"
                :src="conversation.avatarUrl"
                :alt="conversation.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-lg font-bold text-blue-600">
                {{
                  conversation.name
                    ? conversation.name.charAt(0).toUpperCase()
                    : "?"
                }}
              </div>
            </div>
          </div>

          <!-- Conversation Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 truncate">
                {{ conversation.name }}
              </h3>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                {{ formatTimeAgo(conversation.lastMessageTime) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 truncate">
              {{ conversation.lastMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-8 sm:p-12 text-center"
      >
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-comments text-gray-400 text-2xl sm:text-3xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          No messages yet
        </h3>
        <p class="text-gray-600 mb-6 max-w-sm mx-auto">
          Start a conversation with family members by visiting their profiles
          and sending them a message.
        </p>
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          <i class="fas fa-users"></i>
          View Family Members
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAllConversations } from "~/utils/firebase";

const router = useRouter();
const authStore = useAuthStore();

const conversations = ref([]);
const isLoading = ref(true);

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Never";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const openConversation = (userId) => {
  router.push(`/messages/${userId}`);
};

const loadConversations = async () => {
  try {
    conversations.value = await getAllConversations();
  } catch (error) {
    console.error("Error loading conversations:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await authStore.initAuth();

  if (authStore.familyId) {
    await loadConversations();
  } else {
    isLoading.value = false;
  }
});

definePageMeta({
  middleware: ["auth"],
});
</script>
