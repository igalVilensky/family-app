<template>
  <div
    class="relative group rounded-full"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <!-- Avatar with Image -->
    <div
      v-if="avatarUrl && !loading"
      class="w-full h-full rounded-full overflow-hidden ring-4 ring-offset-4 ring-offset-gray-100 ring-emerald-500/30 transition-all duration-300"
    >
      <img
        :src="avatarUrl"
        alt="Avatar"
        class="w-full h-full object-cover rounded-full"
        :width="size"
        :height="size"
      />
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="w-full h-full rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-600/10 flex items-center justify-center ring-4 ring-offset-4 ring-offset-gray-100 ring-emerald-500/30"
    >
      <i
        class="fas fa-spinner fa-spin text-emerald-500"
        :style="{ fontSize: Math.max(size * 0.3) + 'px' }"
      ></i>
    </div>

    <!-- Initial State -->
    <div
      v-else
      class="w-full h-full rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-600/10 flex items-center justify-center ring-4 ring-offset-4 ring-offset-gray-100 ring-emerald-500/30"
    >
      <span
        class="font-bold text-emerald-500"
        :style="{ fontSize: Math.max(size * 0.4) + 'px' }"
      >
        {{ userInitial }}
      </span>
    </div>

    <!-- Upload Overlay -->
    <label
      v-if="!noUpload"
      class="absolute inset-0 w-full h-full cursor-pointer rounded-full"
    >
      <input
        type="file"
        @change="onFileChange"
        accept="image/*"
        class="hidden"
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
      >
        <div class="text-white flex flex-col items-center gap-2">
          <i class="fas fa-camera text-2xl"></i>
          <span class="text-sm font-medium">Change Photo</span>
        </div>
      </div>
    </label>

    <!-- Premium Badge (Placeholder for Freemium) -->
    <div v-if="!noUpload" class="absolute -top-2 -right-2">
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur opacity-75"
        ></div>
        <div
          class="relative px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border border-white/20"
        >
          FREE
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNuxtApp } from "#app";

const { $firestore: db } = useNuxtApp();

const props = defineProps({
  avatarUrl: String,
  loading: Boolean,
  userInitial: String,
  size: {
    type: Number,
    default: 170,
  },
  noUpload: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:avatarUrl", "notify"]);

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadAvatar(file);
    if (url) {
      emit("update:avatarUrl", url);
    }
  }
};

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=b19c8d945e3c37e4760b8ce4cf983904",
      { method: "POST", body: formData }
    );
    const result = await response.json();

    if (!result.success) throw new Error("Image upload failed");

    const { uid } = getAuth().currentUser;
    try {
      await updateDoc(doc(db, "users", uid), { avatarUrl: result.data.url });
      emit("notify", {
        message: "Avatar updated successfully!",
        type: "success",
      });
      return result.data.url;
    } catch (error) {
      console.error("Avatar update failed:", error);
      emit("notify", {
        message: "Failed to update avatar: " + error.message,
        type: "error",
      });
    }
  } catch (error) {
    console.error("Avatar upload error:", error.message);
    emit("notify", {
      message: "Failed to upload avatar. Please try again.",
      type: "error",
    });
  }
};
</script>
