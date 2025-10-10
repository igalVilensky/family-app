<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 sm:gap-3">
            <NuxtLink
              to="/messages"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i class="fas fa-arrow-left text-sm sm:text-base"></i>
            </NuxtLink>
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-comments text-white text-sm sm:text-lg"></i>
            </div>
            <div>
              <h1
                class="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
              >
                {{ otherUser.name }}
              </h1>
              <p class="text-xs sm:text-sm text-gray-500">
                {{ isOnline ? "Online" : "Offline" }}
              </p>
            </div>
          </div>
          <button
            @click="showUserProfile"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <i class="fas fa-user text-xs sm:text-sm"></i>
            <span class="hidden sm:inline">View Profile</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Loading messages...</p>
      </div>

      <!-- Messages Container -->
      <div
        v-else
        ref="messagesContainer"
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 mb-4 max-h-[60vh] overflow-y-auto"
      >
        <!-- Empty State -->
        <div
          v-if="messages.length === 0"
          class="text-center py-12 text-gray-500"
        >
          <i
            class="fas fa-comments text-3xl sm:text-4xl mb-4 text-gray-300"
          ></i>
          <h3 class="text-lg sm:text-xl font-semibold mb-2">No messages yet</h3>
          <p class="text-sm sm:text-base">
            Start a conversation with {{ otherUser.name }}
          </p>
        </div>

        <!-- Messages List -->
        <div v-else class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'flex gap-3',
              message.senderId === authStore.userId
                ? 'justify-end'
                : 'justify-start',
            ]"
          >
            <!-- Other User's Avatar (only show for received messages) -->
            <div
              v-if="message.senderId !== authStore.userId"
              class="flex-shrink-0"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white"
              >
                <img
                  v-if="otherUser.avatarUrl"
                  :src="otherUser.avatarUrl"
                  :alt="otherUser.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-xs font-bold text-blue-600">
                  {{
                    otherUser.name
                      ? otherUser.name.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
              </div>
            </div>

            <!-- Message Bubble -->
            <div
              :class="[
                'max-w-xs sm:max-w-md px-4 py-3 rounded-2xl',
                message.senderId === authStore.userId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none',
              ]"
            >
              <p class="text-sm sm:text-base break-words">
                {{ message.content }}
              </p>
              <p
                :class="[
                  'text-xs mt-1',
                  message.senderId === authStore.userId
                    ? 'text-blue-200'
                    : 'text-gray-500',
                ]"
              >
                {{ formatMessageTime(message.timestamp) }}
                <span
                  v-if="message.senderId === authStore.userId && message.read"
                  class="ml-1"
                >
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>

            <!-- Current User's Avatar (only show for sent messages) -->
            <div
              v-if="message.senderId === authStore.userId"
              class="flex-shrink-0"
            >
              <div
                class="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white"
              >
                <img
                  v-if="authStore.avatarUrl"
                  :src="authStore.avatarUrl"
                  :alt="authStore.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-xs font-bold text-green-600">
                  {{
                    authStore.name
                      ? authStore.name.charAt(0).toUpperCase()
                      : "?"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4"
      >
        <div class="flex gap-3">
          <textarea
            v-model="newMessage"
            @keypress.enter.prevent="sendMessage"
            placeholder="Type your message..."
            rows="1"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            :disabled="isSending"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || isSending"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <i v-if="isSending" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm w-full sm:w-auto px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm bg-red-50/95 text-red-800 border-red-200"
      >
        <div class="flex items-center gap-3">
          <i
            class="fas fa-exclamation-circle text-red-500 text-lg flex-shrink-0"
          ></i>
          <p class="font-medium flex-1 text-sm sm:text-base">
            {{ toastMessage }}
          </p>
          <button
            @click="showToast = false"
            class="flex-shrink-0 text-red-400 hover:text-red-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  getMessageHistory,
  sendMessage as sendMessageApi,
  markMessagesAsRead,
} from "~/utils/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { $firestore: db } = useNuxtApp();

const userId = ref(route.params.userId);
const otherUser = ref({});
const messages = ref([]);
const newMessage = ref("");
const isLoading = ref(true);
const isSending = ref(false);
const isOnline = ref(true);
const showToast = ref(false);
const toastMessage = ref("");
const messagesContainer = ref(null);
const messageUnsubscribe = ref(null);

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const showErrorToast = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const loadOtherUser = async () => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId.value));
    if (userDoc.exists()) {
      otherUser.value = userDoc.data();
    } else {
      showErrorToast("User not found");
      router.push("/messages");
    }
  } catch (error) {
    console.error("Error loading user:", error);
    showErrorToast("Failed to load user");
  }
};

const setupMessageListener = () => {
  if (!authStore.userId || !userId.value) return;

  const messagesQuery = query(
    collection(db, "messages"),
    where("familyId", "==", authStore.familyId),
    where("senderId", "in", [authStore.userId, userId.value]),
    where("receiverId", "in", [authStore.userId, userId.value]),
    orderBy("timestamp", "asc")
  );

  messageUnsubscribe.value = onSnapshot(
    messagesQuery,
    (snapshot) => {
      messages.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Mark received messages as read
      markMessagesAsRead(userId.value);

      // Scroll to bottom when new messages arrive
      scrollToBottom();
    },
    (error) => {
      console.error("Message listener error:", error);
      showErrorToast("Failed to load messages");
    }
  );
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  isSending.value = true;

  try {
    await sendMessageApi(userId.value, newMessage.value);
    newMessage.value = "";
  } catch (error) {
    console.error("Send message error:", error);
    showErrorToast(error.message || "Failed to send message");
  } finally {
    isSending.value = false;
  }
};

const showUserProfile = () => {
  router.push(`/user/${userId.value}`);
};

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.familyId) {
    router.push("/dashboard");
    return;
  }

  await loadOtherUser();
  setupMessageListener();

  isLoading.value = false;

  // Scroll to bottom after initial load
  setTimeout(scrollToBottom, 100);
});

onUnmounted(() => {
  if (messageUnsubscribe.value) {
    messageUnsubscribe.value();
  }
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
