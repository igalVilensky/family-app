<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      v-if="showHeader"
      class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
            >
              <i class="fas text-white text-lg" :class="headerIcon"></i>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ headerTitle }}
              </h1>
              <p
                v-if="headerSubtitle"
                class="hidden sm:block text-xs text-gray-500"
              >
                {{ headerSubtitle }}
              </p>
            </div>
          </NuxtLink>

          <!-- Right Section -->
          <div class="flex items-center gap-4">
            <!-- Messages Badge -->
            <NuxtLink
              v-if="showMessagesBadge"
              to="/messages"
              class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i class="fas fa-comments text-lg"></i>
              <span
                v-if="unreadMessagesCount > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </NuxtLink>

            <!-- Header Actions Slot -->
            <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
              <slot name="header-actions" />
            </div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16 pb-20 lg:pb-0">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- Bottom Navigation - Mobile -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden"
    >
      <div class="flex items-center justify-around">
        <NuxtLink
          to="/dashboard"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          :class="{ 'text-blue-600': route.path.startsWith('/dashboard') }"
        >
          <i class="fas fa-home text-lg"></i>
          <span>Home</span>
        </NuxtLink>

        <NuxtLink
          to="/calendar"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          :class="{ 'text-blue-600': route.path.startsWith('/calendar') }"
        >
          <i class="fas fa-calendar-alt text-lg"></i>
          <span>Calendar</span>
        </NuxtLink>

        <NuxtLink
          :to="familyLink"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          :class="{ 'text-blue-600': route.path.startsWith('/family') }"
        >
          <i class="fas fa-users text-lg"></i>
          <span>Family</span>
        </NuxtLink>

        <NuxtLink
          to="/messages"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors relative"
          :class="{ 'text-blue-600': route.path.startsWith('/messages') }"
        >
          <i class="fas fa-comments text-lg"></i>
          <span>Messages</span>
          <span
            v-if="unreadMessagesCount > 0"
            class="absolute top-2 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {{ unreadMessagesCount > 9 ? "9+" : unreadMessagesCount }}
          </span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();

const familyLink = computed(
  () => authStore.familyId && `/family/${authStore.familyId}`
);

const showHeader = ref(true);
const headerIcon = ref("fa-home");
const headerTitle = ref("FamilySpace");
const headerSubtitle = ref("");
const showMessagesBadge = ref(true);
const unreadMessagesCount = ref(0);

const updateHeaderConfig = (path) => {
  const configs = {
    "/dashboard": {
      icon: "fa-home",
      title: "FamilySpace",
      subtitle: "",
      badge: true,
    },
    "/messages": {
      icon: "fa-comments",
      title: "Messages",
      subtitle: "",
      badge: false,
    },
    "/calendar": {
      icon: "fa-calendar-alt",
      title: "Calendar",
      subtitle: "Plan your moments",
      badge: true,
    },
    "/family": {
      icon: "fa-users",
      title: "Family Members",
      subtitle: "",
      badge: true,
    },
  };

  const config =
    Object.entries(configs).find(([key]) => path.startsWith(key))?.[1] ||
    configs["/dashboard"];

  headerIcon.value = config.icon;
  headerTitle.value = config.title;
  headerSubtitle.value = config.subtitle;
  showMessagesBadge.value = config.badge;
};

const fetchUnreadMessages = async () => {
  try {
    const { getAllConversations } = await import("~/utils/firebase");
    const conversations = await getAllConversations();
    unreadMessagesCount.value = conversations.reduce(
      (total, conv) => total + (conv.unreadCount || 0),
      0
    );
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

watch(
  () => route.path,
  (newPath) => {
    updateHeaderConfig(newPath);
  },
  { immediate: true }
);

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.familyId && authStore.status === "active") {
    await fetchUnreadMessages();
  }
});
</script>
