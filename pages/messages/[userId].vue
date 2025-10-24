<template>
  <ClientOnly>
    <div>
      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Loading messages...</p>
        </div>

        <!-- Access Denied -->
        <div
          v-else-if="!canAccessConversation"
          class="text-center py-12 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <div
            class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-lock text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p class="text-gray-600 mb-6">
            You can only message members of your current family.
          </p>
          <NuxtLink
            to="/messages"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Messages
          </NuxtLink>
        </div>

        <!-- Messages Container -->
        <div
          v-else
          ref="messagesContainer"
          class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 mb-4 max-h-[60vh] overflow-y-auto"
        >
          <!-- Debug info (remove in production) -->
          <div class="text-xs text-gray-500 mb-2">
            Messages: {{ messages.length }} | User: {{ userId }}
          </div>

          <!-- Empty State -->
          <div
            v-if="messages.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <i
              class="fas fa-comments text-3xl sm:text-4xl mb-4 text-gray-300"
            ></i>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">
              No messages yet
            </h3>
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
                <NuxtLink
                  :to="`/user/${userId}`"
                  class="block hover:opacity-80 transition-opacity duration-200"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white cursor-pointer"
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
                </NuxtLink>
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
                  {{ message.message }}
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
                <NuxtLink
                  :to="`/user/${authStore.userId}`"
                  class="block hover:opacity-80 transition-opacity duration-200"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white cursor-pointer"
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
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div
          v-if="canAccessConversation"
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

    <!-- Loading fallback for SSR -->
    <template #fallback>
      <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Loading messages...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
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
const showToast = ref(false);
const toastMessage = ref("");
const messagesContainer = ref(null);
const messageUnsubscribe = ref(null);
const hasInitialLoad = ref(false);

// Computed properties for multi-family support
const currentFamilyId = computed(() => authStore.currentFamilyId);
const canAccessConversation = computed(() => {
  if (!currentFamilyId.value || !otherUser.value.families) return false;
  return otherUser.value.families[currentFamilyId.value] !== undefined;
});

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
  if (!authStore.userId || !userId.value || !currentFamilyId.value) {
    console.error("Missing required data for message listener");
    return;
  }

  // Clear existing listener
  if (messageUnsubscribe.value) {
    console.log("Clearing existing message listener");
    messageUnsubscribe.value();
  }

  try {
    const messagesRef = collection(db, "messages");

    console.log(
      "Setting up message listener for family:",
      currentFamilyId.value
    );
    console.log("Between users:", authStore.userId, "and", userId.value);

    // Create query for messages in current family between these two users
    const messagesQuery = query(
      messagesRef,
      where("familyId", "==", currentFamilyId.value),
      where("senderId", "in", [authStore.userId, userId.value]),
      where("recipientId", "in", [authStore.userId, userId.value]),
      orderBy("timestamp", "asc")
    );

    messageUnsubscribe.value = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Messages updated:", newMessages.length, "messages");
        messages.value = newMessages;

        // Mark received messages as read
        if (newMessages.length > 0) {
          markMessagesAsRead(userId.value);
        }

        // Scroll to bottom on initial load or when new messages arrive
        if (!hasInitialLoad.value || isNewMessage(newMessages)) {
          scrollToBottom();
          hasInitialLoad.value = true;
        }
      },
      (error) => {
        console.error("Message listener error:", error);
        showErrorToast("Failed to load messages: " + error.message);
      }
    );

    console.log("Message listener setup complete");
  } catch (error) {
    console.error("Error setting up message listener:", error);
    showErrorToast("Failed to set up message listener: " + error.message);
  }
};

// Check if there are new messages since last update
const isNewMessage = (newMessages) => {
  if (messages.value.length === 0) return true;
  if (newMessages.length > messages.value.length) return true;

  const lastOldMessage = messages.value[messages.value.length - 1];
  const lastNewMessage = newMessages[newMessages.length - 1];

  return lastNewMessage.id !== lastOldMessage.id;
};

const sendMessage = async () => {
  if (
    !newMessage.value.trim() ||
    isSending.value ||
    !canAccessConversation.value
  ) {
    console.log("Cannot send message:", {
      hasMessage: !!newMessage.value.trim(),
      isSending: isSending.value,
      canAccess: canAccessConversation.value,
    });
    return;
  }

  isSending.value = true;
  const messageText = newMessage.value.trim();

  try {
    console.log("Sending message to:", userId.value);
    await sendMessageApi(userId.value, messageText);
    newMessage.value = "";
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Send message error:", error);
    showErrorToast(error.message || "Failed to send message");
  } finally {
    isSending.value = false;
  }
};

// Watch for route changes
watch(
  () => route.params.userId,
  (newUserId) => {
    if (newUserId && newUserId !== userId.value) {
      userId.value = newUserId;
      hasInitialLoad.value = false;
      messages.value = [];
      loadOtherUser().then(() => {
        if (canAccessConversation.value) {
          setupMessageListener();
        } else {
          isLoading.value = false;
        }
      });
    }
  }
);

// Watch for family changes
watch(currentFamilyId, (newFamilyId) => {
  if (newFamilyId && canAccessConversation.value) {
    console.log("Family changed, resetting message listener");
    hasInitialLoad.value = false;
    messages.value = [];
    setupMessageListener();
  }
});

onMounted(async () => {
  // Use ClientOnly to avoid hydration issues
  await authStore.initAuth();

  // Check if user has any family access
  if (!authStore.hasFamily) {
    console.log("No family access, redirecting to dashboard");
    router.push("/dashboard");
    return;
  }

  await loadOtherUser();

  // Check if users are in the same current family
  if (!canAccessConversation.value) {
    console.log("No conversation access between users");
    isLoading.value = false;
    return;
  }

  console.log("Setting up initial message listener");
  setupMessageListener();
  isLoading.value = false;
});

onUnmounted(() => {
  if (messageUnsubscribe.value) {
    console.log("Cleaning up message listener");
    messageUnsubscribe.value();
  }
});

definePageMeta({
  middleware: ["auth"],
  layout: "default",
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
