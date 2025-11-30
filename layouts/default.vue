<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50">
    <!-- Header -->
    <header v-if="showHeader"
      class="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->

          <!-- Logo -->
          <NuxtLink to="/dashboard" class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
            <!-- Logo Image -->
            <img src="/family-space-logo.png" alt="Family Logo" class="w-10 h-10 rounded-xl shadow-md object-cover" />

            <!-- Header Text -->
            <div>
              <h1 class="text-lg font-bold text-gray-900">
                {{ headerTitle }}
              </h1>
              <p v-if="headerSubtitle" class="hidden sm:block text-xs text-gray-600 font-medium">
                {{ headerSubtitle }}
              </p>
            </div>
          </NuxtLink>

          <!-- Right Section -->
          <div class="flex items-center gap-2">
            <!-- Links for Authenticated Users -->
            <template v-if="isAuthenticated">
              <NuxtLink to="/dashboard"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-orange-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-orange-600 bg-orange-100 shadow-sm':
                    route.path.startsWith('/dashboard'),
                }">
                <i class="fas fa-home"></i>
                <span class="text-sm">Home</span>
              </NuxtLink>
              <NuxtLink to="/feed"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-rose-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-rose-600 bg-rose-100 shadow-sm':
                    route.path.startsWith('/feed'),
                }">
                <i class="fas fa-heart"></i>
                <span class="text-sm">Feed</span>
              </NuxtLink>

              <NuxtLink :to="calendarLink"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-blue-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-blue-600 bg-blue-100 shadow-sm':
                    route.path.startsWith('/calendar'),
                }">
                <i class="fas fa-calendar-alt"></i>
                <span class="text-sm">Calendar</span>
              </NuxtLink>

              <NuxtLink to="/lists"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-emerald-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-emerald-600 bg-emerald-100 shadow-sm':
                    route.path.startsWith('/lists'),
                }">
                <i class="fas fa-clipboard-list"></i>
                <span class="text-sm">Lists</span>
              </NuxtLink>

              <NuxtLink :to="familyLink"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-indigo-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-indigo-600 bg-indigo-100 shadow-sm':
                    route.path.startsWith('/family'),
                }">
                <i class="fas fa-users"></i>
                <span class="text-sm">Family</span>
              </NuxtLink>

              <NuxtLink :to="capsulesLink"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-xl transition-all font-medium"
                :class="{
                  'text-purple-600 bg-purple-100 shadow-sm':
                    route.path.startsWith('/capsules'),
                }">
                <i class="fas fa-clock"></i>
                <span class="text-sm">Capsules</span>
              </NuxtLink>

              <NuxtLink to="/messages"
                class="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-purple-50 rounded-xl transition-all font-medium relative"
                :class="{
                  'text-purple-600 bg-purple-100 shadow-sm':
                    route.path.startsWith('/messages'),
                }">
                <i class="fas fa-comments"></i>
                <span class="text-sm">Messages</span>
                <span v-if="unreadMessagesCount > 0"
                  class="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                  {{ unreadMessagesCount > 9 ? "9+" : unreadMessagesCount }}
                </span>
              </NuxtLink>

              <button @click="handleLogout"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
                <i class="fas fa-sign-out-alt"></i>
                <span class="text-sm">Logout</span>
              </button>
            </template>
            <!-- Non-authenticated users - Hide on auth pages and if authenticated -->
            <template v-else-if="!isAuthPage && isAuthenticated">
              <NuxtLink to="/login"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                Login
              </NuxtLink>
              <NuxtLink to="/register"
                class="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700 rounded-xl transition-all shadow-md">
                Sign Up
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-16 lg:pb-0">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- Bottom Navigation - Mobile Only, Authenticated Users -->
    <nav v-if="isAuthenticated"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div class="flex items-center justify-around px-2">
        <!-- 1. Home -->
        <NuxtLink to="/dashboard"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-all"
          :class="{ 'text-orange-600': route.path.startsWith('/dashboard') }">
          <div class="relative p-1.5 rounded-xl transition-colors"
            :class="route.path.startsWith('/dashboard') ? 'bg-orange-100' : ''">
            <i class="fas fa-home text-lg"></i>
          </div>
          <span>Home</span>
        </NuxtLink>

        <!-- 2. Calendar -->
        <NuxtLink :to="calendarLink"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-all"
          :class="{ 'text-blue-600': route.path.startsWith('/calendar') }">
          <div class="relative p-1.5 rounded-xl transition-colors"
            :class="route.path.startsWith('/calendar') ? 'bg-blue-100' : ''">
            <i class="fas fa-calendar-alt text-lg"></i>
          </div>
          <span>Calendar</span>
        </NuxtLink>

        <!-- 3. Lists (Center/Featured) -->
        <NuxtLink to="/lists"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-all"
          :class="{ 'text-emerald-600': route.path.startsWith('/lists') }">
          <div class="relative p-1.5 rounded-xl transition-colors"
            :class="route.path.startsWith('/lists') ? 'bg-emerald-100' : ''">
            <i class="fas fa-clipboard-list text-lg"></i>
          </div>
          <span>Lists</span>
        </NuxtLink>

        <!-- 4. Messages -->
        <NuxtLink to="/messages"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-all relative"
          :class="{ 'text-purple-600': route.path.startsWith('/messages') }">
          <div class="relative p-1.5 rounded-xl transition-colors"
            :class="route.path.startsWith('/messages') ? 'bg-purple-100' : ''">
            <i class="fas fa-comments text-lg"></i>
            <span v-if="unreadMessagesCount > 0"
              class="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white">
              {{ unreadMessagesCount > 9 ? "9+" : unreadMessagesCount }}
            </span>
          </div>
          <span>Chat</span>
        </NuxtLink>

        <!-- 5. More -->
        <button @click="showMobileMenu = true"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-all"
          :class="{ 'text-gray-900': showMobileMenu }">
          <div class="relative p-1.5 rounded-xl transition-colors" :class="showMobileMenu ? 'bg-gray-100' : ''">
            <i class="fas fa-bars text-lg"></i>
          </div>
          <span>More</span>
        </button>
      </div>
    </nav>

    <!-- Mobile More Menu -->
    <MobileMoreMenu v-if="showMobileMenu" @close="showMobileMenu = false" @logout="handleLogout" />
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { getAuth, signOut } from "firebase/auth";
import MobileMoreMenu from "~/components/MobileMoreMenu.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Use computed to reactively check authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated);

const isAuthPage = computed(() => {
  return route.path === "/login" || route.path === "/register";
});

// Updated computed properties for multi-family support
const familyLink = computed(() => {
  if (!authStore.currentFamilyId) return "/family-setup";
  return `/family/${authStore.currentFamilyId}`;
});

// FIX: Use generic routes instead of family-specific ones for calendar and capsules
const calendarLink = computed(() => {
  return "/calendar";
});

const capsulesLink = computed(() => {
  return "/capsules";
});

const showHeader = ref(true);
const headerIcon = ref("fa-home");
const headerTitle = ref("FamilySpace");
const headerSubtitle = ref("");
const unreadMessagesCount = ref(0);
const showMobileMenu = ref(false);

const updateHeaderConfig = (path) => {
  const configs = {
    "/dashboard": {
      icon: "fa-home",
      title: "FamilySpace",
      subtitle: "Your family's home",
    },
    "/feed": {
      icon: "fa-heart",
      title: "Family Feed",
      subtitle: "Your family hearth",
    },
    "/messages": {
      icon: "fa-comments",
      title: "Messages",
      subtitle: "Stay connected",
    },
    "/calendar": {
      icon: "fa-calendar-alt",
      title: "Calendar",
      subtitle: "Plan together",
    },
    "/lists": {
      icon: "fa-clipboard-list",
      title: "Shared Lists",
      subtitle: "Shopping & To-Dos",
    },
    "/family": {
      icon: "fa-users",
      title: "Family",
      subtitle: "Our circle",
    },
    "/capsules": {
      icon: "fa-clock",
      title: "Time Capsules",
      subtitle: "Messages to the future",
    },
    "/profile": {
      icon: "fa-user",
      title: "Profile",
      subtitle: "Your settings",
    },
    "/login": {
      icon: "fa-home",
      title: "FamilySpace",
      subtitle: "",
    },
    "/register": {
      icon: "fa-home",
      title: "FamilySpace",
      subtitle: "",
    },
    "/": {
      icon: "fa-home",
      title: "FamilySpace",
      subtitle: "",
    },
  };

  const config =
    Object.entries(configs).find(([key]) => path.startsWith(key))?.[1] ||
    configs["/dashboard"];

  headerIcon.value = config.icon;
  headerTitle.value = config.title;
  headerSubtitle.value = config.subtitle;
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
    const auth = getAuth();
    await signOut(auth);

    authStore.clearAuth();

    await navigateTo("/");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to log out. Please try again.");
  }
};

watch(
  () => route.path,
  (newPath) => {
    updateHeaderConfig(newPath);
  },
  { immediate: true }
);

watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth) {
      headerIcon.value = "fa-home";
      headerTitle.value = "FamilySpace";
      headerSubtitle.value = "";
    }
  }
);

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.currentFamilyId && authStore.status === "active") {
    await fetchUnreadMessages();
  }
});
</script>
