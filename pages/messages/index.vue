<template>
  <div>
    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Family Header -->
      <div v-if="currentFamilyName" class="mb-6 text-center">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Messages
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Conversations with {{ currentFamilyName }} family members
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading messages...</p>
      </div>

      <!-- Conversations List -->
      <div v-else-if="conversations.length > 0"
        class="bg-white dark:bg-stone-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-stone-700 overflow-hidden">
        <div v-for="conversation in conversations" :key="conversation.userId"
          class="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-stone-700 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors duration-200 cursor-pointer"
          @click="openConversation(conversation.userId)">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
              <img v-if="conversation.avatarUrl" :src="conversation.avatarUrl" :alt="conversation.name"
                class="w-full h-full object-cover" />
              <div v-else class="text-lg font-bold text-blue-600">
                {{
                  conversation.name
                    ? conversation.name.charAt(0).toUpperCase()
                    : "?"
                }}
              </div>
              <!-- Unread indicator -->
              <div v-if="conversation.unreadCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {{
                  conversation.unreadCount > 9 ? "9+" : conversation.unreadCount
                }}
              </div>
            </div>
          </div>

          <!-- Conversation Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                {{ conversation.name }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                {{ formatTimeAgo(conversation.lastMessageTime) }}
              </span>
            </div>
            <p class="text-sm truncate" :class="conversation.unreadCount > 0
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400'
              ">
              {{ conversation.lastMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else
        class="bg-white dark:bg-stone-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-stone-700 p-8 sm:p-12 text-center">
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-stone-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-comment-dots text-gray-400 dark:text-gray-500 text-2xl sm:text-3xl"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No messages yet
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto">
          Start a conversation with {{ currentFamilyName || "family" }} members
          by visiting their profiles and sending them a message.
        </p>
        <NuxtLink :to="familyLink"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200">
          <i class="fas fa-users"></i>
          View Family Members
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAllConversations } from "~/utils/firebase";

const router = useRouter();
const authStore = useAuthStore();

const conversations = ref([]);
const isLoading = ref(true);
const debugInfo = ref("");

// Computed properties for multi-family support
const currentFamilyName = computed(() => authStore.currentFamilyName);
const currentFamilyId = computed(() => authStore.currentFamilyId);

const familyLink = computed(() => {
  if (!currentFamilyId.value) return "/family-setup";
  return `/family/${currentFamilyId.value}`;
});

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
    if (!currentFamilyId.value) {
      conversations.value = [];
      return;
    }

    conversations.value = await getAllConversations(currentFamilyId.value);
  } catch (error) {
    console.error("Error loading conversations:", error);
    conversations.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch for family changes
watch(currentFamilyId, (newFamilyId) => {
  if (newFamilyId) {
    loadConversations();
  }
});

onMounted(async () => {
  await authStore.initAuth();

  if (authStore.hasFamily && currentFamilyId.value) {
    await loadConversations();
  } else {
    isLoading.value = false;
  }
});

definePageMeta({
  middleware: ["auth"],
  layout: "default",
});
</script>
