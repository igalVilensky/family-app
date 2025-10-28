<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 pt-16 pb-20 lg:pb-0"
  >
    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- Feed Header -->
      <div class="mb-8 text-center">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div
            class="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <i class="fas fa-heart text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Family Feed</h1>
            <p class="text-gray-600 font-medium">
              Your family's digital hearth
            </p>
          </div>
        </div>
      </div>

      <!-- Create Moment Card -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-orange-200 p-6 mb-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
        @click="showCreateMoment = true"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0"
          >
            <span class="text-white font-bold text-lg">{{ userInitial }}</span>
          </div>
          <div class="flex-1 text-left">
            <p class="text-gray-600 font-medium">
              Share a moment with your family...
            </p>
          </div>
          <div class="flex gap-2">
            <button
              class="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors flex items-center justify-center"
            >
              <i class="fas fa-image text-orange-600"></i>
            </button>
            <button
              class="w-10 h-10 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors flex items-center justify-center"
            >
              <i class="fas fa-camera text-rose-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Feed Content -->
      <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600 font-medium">Gathering family moments...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="feedItems.length === 0"
          class="text-center py-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-gray-200"
        >
          <i class="fas fa-heart text-6xl text-gray-300 mb-6"></i>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            Your family hearth is quiet
          </h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto font-medium">
            Be the first to share a moment with your family. Start a
            conversation, share a photo, or celebrate something special.
          </p>
          <button
            @click="showCreateMoment = true"
            class="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
          >
            <i class="fas fa-plus mr-3"></i>
            Share Your First Moment
          </button>
        </div>

        <!-- Feed Items -->
        <div v-else class="space-y-6">
          <FeedItem
            v-for="item in feedItems"
            :key="item.id"
            :item="item"
            @like="handleLike"
            @comment="handleComment"
          />
        </div>
      </div>
    </div>

    <!-- Create Moment Modal -->
    <CreateMomentModal
      v-if="showCreateMoment"
      @close="showCreateMoment = false"
      @created="handleMomentCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useFeed } from "~/composables/useFeed";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

const { $firestore: db } = useNuxtApp();
const authStore = useAuthStore();
const { feedItems, loading, fetchFeedData } = useFeed();
const showCreateMoment = ref(false);

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const handleLike = async (itemId) => {
  console.log("Like item:", itemId);
};

const handleComment = (itemId) => {
  console.log("Comment on item:", itemId);
};

const handleMomentCreated = () => {
  showCreateMoment.value = false;
};

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.isAuthenticated && authStore.currentFamilyId) {
    await authStore.loadFamilyMembers();
    await fetchFeedData();
  }
});

useHead({
  title: "Family Feed - FamilySpace",
});
</script>
