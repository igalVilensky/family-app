<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn border-2 border-orange-200"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <i class="fas fa-feather text-white text-xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Share a Moment</h3>
            <p class="text-gray-600 font-medium">With your family</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <i class="fas fa-times text-gray-500 text-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Author -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0"
          >
            <span class="text-white font-bold text-lg">{{ userInitial }}</span>
          </div>
          <div>
            <p class="font-bold text-gray-900 text-lg">{{ authStore.name }}</p>
            <p class="text-gray-600 text-sm">
              Sharing with {{ currentFamilyName }}
            </p>
          </div>
        </div>

        <!-- Text Input -->
        <textarea
          v-model="momentText"
          placeholder="What's happening with your family?"
          rows="4"
          class="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4 resize-none font-medium text-lg hover:border-gray-300 transition-all placeholder-gray-400"
          maxlength="500"
        ></textarea>

        <!-- Character Counter -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex gap-3">
            <!-- Image Upload -->
            <button
              @click="triggerImageUpload"
              class="w-12 h-12 rounded-2xl bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center group"
              :disabled="uploadingImage"
            >
              <i
                class="fas text-blue-600 text-lg"
                :class="uploadingImage ? 'fa-spinner animate-spin' : 'fa-image'"
              ></i>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </button>

            <!-- Camera -->
            <button
              class="w-12 h-12 rounded-2xl bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-center group"
            >
              <i class="fas fa-camera text-green-600 text-lg"></i>
            </button>

            <!-- Feeling -->
            <button
              class="w-12 h-12 rounded-2xl bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center group"
            >
              <i class="fas fa-smile text-amber-600 text-lg"></i>
            </button>
          </div>

          <div
            class="text-sm font-medium"
            :class="characterCount > 450 ? 'text-rose-600' : 'text-gray-500'"
          >
            {{ characterCount }}/500
          </div>
        </div>

        <!-- Preview Image -->
        <div v-if="previewImage" class="mb-6 relative">
          <img
            :src="previewImage"
            alt="Preview"
            class="rounded-2xl shadow-md w-full h-48 object-cover"
          />
          <button
            @click="removeImage"
            class="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <i class="fas fa-times text-white text-xs"></i>
          </button>
        </div>

        <!-- Quick Prompts -->
        <div v-if="momentText.length === 0" class="mb-6">
          <p class="text-gray-600 font-medium mb-3">Quick ideas:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              @click="momentText = prompt"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors text-sm"
            >
              {{ prompt }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-4 p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
        >
          Cancel
        </button>
        <button
          @click="createMoment"
          :disabled="!canCreateMoment || creatingMoment"
          class="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          <i
            class="fas text-lg"
            :class="
              creatingMoment ? 'fa-spinner animate-spin' : 'fa-paper-plane'
            "
          ></i>
          {{ creatingMoment ? "Sharing..." : "Share Moment" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNuxtApp } from "#app";

const { $firestore: db } = useNuxtApp();
const authStore = useAuthStore();
const emit = defineEmits(["close", "created"]);

const momentText = ref("");
const previewImage = ref(null);
const imageFile = ref(null);
const uploadingImage = ref(false);
const creatingMoment = ref(false);
const imageInput = ref(null);

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const currentFamilyName = computed(
  () => authStore.currentFamilyName || "your family"
);

const characterCount = computed(() => momentText.value.length);

const canCreateMoment = computed(
  () => momentText.value.trim().length > 0 && !uploadingImage.value
);

const quickPrompts = [
  "Just had a great family dinner! 🍽️",
  "Celebrating a special achievement today! 🎉",
  "Family vacation memories ✈️",
  "Proud parent moment 👨‍👩‍👧‍👦",
  "Beautiful day with the family ☀️",
];

const triggerImageUpload = () => {
  imageInput.value?.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // For now, we'll just create a preview
    // In production, you'd upload to Firebase Storage
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
      imageFile.value = file;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  previewImage.value = null;
  imageFile.value = null;
  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const createMoment = async () => {
  if (!canCreateMoment.value) return;

  creatingMoment.value = true;

  try {
    let imageUrl = null;

    // TODO: Upload image to Firebase Storage if imageFile exists
    // if (imageFile.value) {
    //   imageUrl = await uploadToStorage(imageFile.value)
    // }

    const momentData = {
      type: "post",
      familyId: authStore.currentFamilyId,
      authorId: authStore.userId,
      authorName: authStore.name,
      authorInitial: userInitial.value,
      content: momentText.value.trim(),
      media: imageUrl ? [imageUrl] : [],
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "posts"), momentData);

    emit("created");
    emit("close");

    // Reset form
    momentText.value = "";
    removeImage();
  } catch (error) {
    console.error("Error creating moment:", error);
    alert("Failed to share moment. Please try again.");
  } finally {
    creatingMoment.value = false;
  }
};
</script>

<style scoped>
.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
