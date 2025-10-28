<template>
  <div
    class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl"
    :class="borderColor"
  >
    <!-- Item Header -->
    <div class="p-6 pb-4">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
          :class="avatarGradient"
        >
          <img
            v-if="item.authorAvatar"
            :src="item.authorAvatar"
            :alt="item.authorName"
            class="w-full h-full rounded-2xl object-cover"
          />
          <span v-else class="text-white font-bold text-lg">{{
            item.authorInitial
          }}</span>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-lg truncate">
            {{ item.authorName }}
          </h3>
          <p class="text-gray-600 text-sm font-medium">{{ formattedTime }}</p>
        </div>

        <!-- Item Type Icon -->
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          :class="typeIconClass"
        >
          <i :class="typeIcon" class="text-white text-sm"></i>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 pb-6">
      <!-- Text Content -->
      <p
        v-if="item.content"
        class="text-gray-800 text-lg leading-relaxed mb-4 font-medium"
      >
        {{ item.content }}
      </p>

      <!-- Media -->
      <div v-if="item.media && item.media.length > 0" class="mb-4">
        <img
          v-for="(media, index) in item.media"
          :key="index"
          :src="media"
          :alt="item.content"
          class="rounded-2xl shadow-md max-w-full h-auto"
          @click="openMediaViewer(media)"
        />
      </div>

      <!-- Event Details -->
      <div
        v-if="item.type === 'event'"
        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 mb-4"
      >
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-calendar-alt text-blue-600"></i>
          <span class="font-bold text-gray-900">{{
            formatEventDate(item.startDate)
          }}</span>
        </div>
        <p class="text-gray-700 font-medium">
          {{ item.location || "Location not specified" }}
        </p>
        <div v-if="item.rsvps" class="mt-3 flex items-center gap-2">
          <div class="flex -space-x-2">
            <div
              v-for="(rsvp, userId) in item.rsvps"
              :key="userId"
              class="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold text-white"
              :class="getRSVPColor(rsvp)"
            >
              {{ rsvp === "yes" ? "✓" : rsvp === "no" ? "✗" : "?" }}
            </div>
          </div>
          <span class="text-sm text-gray-600 font-medium"
            >{{ getRSVPCount(item.rsvps) }} responses</span
          >
        </div>
      </div>

      <!-- Capsule Details -->
      <div
        v-if="item.type === 'capsule'"
        class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border-2 border-purple-200 mb-4"
      >
        <div class="flex items-center gap-3">
          <i class="fas fa-clock text-purple-600"></i>
          <span class="font-bold text-gray-900">Time Capsule</span>
        </div>
        <p class="text-gray-700 font-medium mt-2">
          Delivered to {{ item.recipientName }}
        </p>
      </div>

      <!-- Birthday Details -->
      <div
        v-if="item.type === 'birthday'"
        class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border-2 border-rose-200 mb-4"
      >
        <div class="flex items-center gap-3">
          <i class="fas fa-birthday-cake text-rose-600"></i>
          <span class="font-bold text-gray-900">🎉 Happy Birthday!</span>
        </div>
        <p class="text-gray-700 font-medium mt-2">
          Wish {{ item.authorName }} a wonderful day!
        </p>
      </div>

      <!-- Actions -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-200 px-6 pb-6"
      >
        <button
          @click="handleLike"
          :disabled="liking"
          class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
          :class="
            isLiked
              ? 'text-rose-600 bg-rose-50'
              : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50'
          "
        >
          <i
            class="fas text-lg"
            :class="
              liking
                ? 'fa-spinner animate-spin'
                : isLiked
                ? 'fa-heart'
                : 'fa-heart'
            "
          ></i>
          <span class="font-bold">{{ item.likescOUNT || 0 }}</span>
        </button>

        <button
          @click="showComments = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
        >
          <i class="fas fa-comment text-lg"></i>
          <span class="font-bold">{{ item.commentsCount || 0 }}</span>
        </button>

        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 hover:scale-105"
        >
          <i class="fas fa-share text-lg"></i>
          <span class="font-bold">Share</span>
        </button>
      </div>
    </div>
    <div
      v-if="showComments"
      class="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showComments = false"
    >
      <div
        class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-slideUp border-2 border-blue-200"
      >
        <!-- Comments Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-comments text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Comments</h3>
              <p class="text-gray-600 font-medium">
                {{ item.commentsCount || 0 }} comments
              </p>
            </div>
          </div>
          <button
            @click="showComments = false"
            class="w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <i class="fas fa-times text-gray-500 text-lg"></i>
          </button>
        </div>

        <!-- Comments List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="loadingComments" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
            ></div>
            <p class="text-gray-600 mt-2 font-medium">Loading comments...</p>
          </div>

          <div
            v-else-if="comments.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <i class="fas fa-comment-slash text-4xl mb-4 text-gray-300"></i>
            <p class="font-bold text-lg">No comments yet</p>
            <p class="font-medium">Be the first to comment!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200"
            >
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
              >
                <span class="text-white font-bold text-sm">{{
                  comment.userInitial
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-gray-900 text-sm">{{
                    comment.userName
                  }}</span>
                  <span class="text-gray-500 text-xs">{{
                    formatCommentTime(comment.createdAt)
                  }}</span>
                </div>
                <p class="text-gray-800 text-sm leading-relaxed">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Comment -->
        <div class="p-6 border-t border-gray-200">
          <div class="flex gap-3">
            <input
              v-model="newComment"
              @keypress.enter="addNewComment"
              placeholder="Write a comment..."
              class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium placeholder-gray-400 hover:border-gray-300 transition-all"
              :disabled="addingComment"
            />
            <button
              @click="addNewComment"
              :disabled="!newComment.trim() || addingComment"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i
                class="fas text-sm"
                :class="
                  addingComment ? 'fa-spinner animate-spin' : 'fa-paper-plane'
                "
              ></i>
              <span class="hidden sm:inline">Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import {
  toggleLike,
  addComment,
  getComments,
  checkUserLike,
} from "~/utils/feedInteractions";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["like", "comment"]);

const authStore = useAuthStore();
const showComments = ref(false);
const comments = ref([]);
const loadingComments = ref(false);
const addingComment = ref(false);
const newComment = ref("");
const isLiked = ref(false);
const liking = ref(false);

// Computed properties for styling
const borderColor = computed(() => {
  const colors = {
    post: "border-orange-200",
    event: "border-blue-200",
    capsule: "border-purple-200",
    birthday: "border-rose-200",
    memory: "border-amber-200",
  };
  return colors[props.item.type] || "border-gray-200";
});

const avatarGradient = computed(() => {
  const gradients = {
    post: "bg-gradient-to-br from-orange-500 to-rose-600",
    event: "bg-gradient-to-br from-blue-500 to-indigo-600",
    capsule: "bg-gradient-to-br from-purple-500 to-violet-600",
    birthday: "bg-gradient-to-br from-rose-500 to-pink-600",
    memory: "bg-gradient-to-br from-amber-500 to-orange-600",
  };
  return (
    gradients[props.item.type] || "bg-gradient-to-br from-gray-500 to-gray-600"
  );
});

const typeIcon = computed(() => {
  const icons = {
    post: "fa-feather",
    event: "fa-calendar-alt",
    capsule: "fa-clock",
    birthday: "fa-birthday-cake",
    memory: "fa-history",
  };
  return `fas ${icons[props.item.type] || "fa-bell"}`;
});

const typeIconClass = computed(() => {
  const classes = {
    post: "bg-orange-500",
    event: "bg-blue-500",
    capsule: "bg-purple-500",
    birthday: "bg-rose-500",
    memory: "bg-amber-500",
  };
  return classes[props.item.type] || "bg-gray-500";
});

const formattedTime = computed(() => {
  if (!props.item.createdAt) return "";
  const date = props.item.createdAt.toDate
    ? props.item.createdAt.toDate()
    : new Date(props.item.createdAt);
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
});

// Methods
const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getRSVPColor = (rsvp) => {
  if (rsvp === "yes") return "bg-green-500";
  if (rsvp === "no") return "bg-red-500";
  if (rsvp === "maybe") return "bg-yellow-500";
  return "bg-gray-400";
};

const getRSVPCount = (rsvps) => {
  return Object.values(rsvps).filter((rsvp) => rsvp !== null).length;
};

const openMediaViewer = (mediaUrl) => {
  console.log("Open media:", mediaUrl);
};

// Load comments when modal opens
const loadComments = async () => {
  if (props.item.type !== "post") return;

  loadingComments.value = true;
  try {
    console.log("Loading comments for post:", props.item.id);
    comments.value = await getComments(props.item.id);
    console.log("Comments loaded:", comments.value.length);
  } catch (error) {
    console.error("Error loading comments:", error);
  } finally {
    loadingComments.value = false;
  }
};

// Check if user liked this post
const checkLikeStatus = async () => {
  if (props.item.type !== "post") return;

  try {
    console.log("Checking like status for post:", props.item.id);
    isLiked.value = await checkUserLike(props.item.id);
    console.log("Like status:", isLiked.value);
  } catch (error) {
    console.error("Error checking like status:", error);
  }
};

// Handle like action
const handleLike = async () => {
  if (props.item.type !== "post") {
    console.log("Cannot like non-post item:", props.item.type);
    return;
  }

  console.log("Handling like for post:", props.item.id);
  liking.value = true;
  try {
    const result = await toggleLike(props.item.id, props.item.familyId);
    console.log("Like result:", result);
    isLiked.value = !isLiked.value;
    emit("like", props.item.id);
  } catch (error) {
    console.error("Like error:", error);
  } finally {
    liking.value = false;
  }
};

// Add new comment
const addNewComment = async () => {
  if (!newComment.value.trim() || props.item.type !== "post") {
    console.log("Cannot add comment - invalid input or non-post item");
    return;
  }

  console.log("Adding comment to post:", props.item.id);
  addingComment.value = true;
  try {
    const result = await addComment(
      props.item.id,
      props.item.familyId,
      newComment.value
    );
    console.log("Comment added:", result);
    newComment.value = "";
    await loadComments(); // Refresh comments
    emit("comment", props.item.id);
  } catch (error) {
    console.error("Add comment error:", error);
  } finally {
    addingComment.value = false;
  }
};

const formatCommentTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

// CRITICAL: Watch for comments modal opening
watch(showComments, (newVal) => {
  console.log("Comments modal state changed:", newVal);
  if (newVal && props.item.type === "post") {
    console.log("Loading comments because modal opened");
    loadComments();
    checkLikeStatus();
  }
});

// Check like status when component mounts for post items
onMounted(() => {
  console.log("FeedItem mounted, type:", props.item.type);
  if (props.item.type === "post") {
    checkLikeStatus();
  }
});
</script>

<style scoped>
.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
