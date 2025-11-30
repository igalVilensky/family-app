<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 transition-colors duration-300">
    <!-- Top Navigation (Desktop) -->
    <header v-if="isAuthenticated"
      class="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/dashboard" class="flex items-center gap-3 group">
            <div
              class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <i class="fas fa-home text-white text-base"></i>
            </div>
            <span class="text-xl font-bold text-stone-900 dark:text-white">
              FamilySpace
            </span>
          </NuxtLink>

          <!-- Desktop Nav Links -->
          <nav class="flex items-center gap-1">
            <NuxtLink v-for="link in desktopNavLinks" :key="link.to" :to="link.to"
              class="px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg relative group" :class="$route.path === link.to
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                ">
              {{ link.text }}
              <span v-if="$route.path === link.to"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
            </NuxtLink>
          </nav>

          <!-- Right Side: Dark Mode + Profile -->
          <div class="flex items-center gap-3">
            <!-- Dark Mode Toggle -->
            <button @click="toggleDarkMode"
              class="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
              <i class="fas text-sm" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
            </button>

            <!-- Profile Button -->
            <button @click="navigateTo('/profile')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
              <div
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 group-hover:border-primary-400 transition-colors">
                <img v-if="authStore.user?.photoURL" :src="authStore.user.photoURL" alt="Profile"
                  class="w-full h-full object-cover" />
                <div v-else
                  class="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400">
                  <i class="fas fa-user text-xs"></i>
                </div>
              </div>
              <div class="text-left hidden xl:block">
                <div class="text-sm font-semibold text-stone-900 dark:text-white leading-tight">
                  {{ authStore.user?.displayName || "Family Member" }}
                </div>
                <div class="text-xs text-stone-500 dark:text-stone-400">
                  {{ authStore.currentFamilyName || "No Family" }}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Header -->
    <header v-if="isAuthenticated"
      class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 shadow-sm px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <i class="fas fa-home text-white text-sm"></i>
          </div>
          <span class="text-xl font-bold text-stone-900 dark:text-white">
            {{ headerTitle }}
          </span>
        </div>
        <button @click="navigateTo('/profile')"
          class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200 dark:border-stone-700">
          <img v-if="authStore.user?.photoURL" :src="authStore.user.photoURL" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <i class="fas fa-user text-stone-400 dark:text-stone-500 text-xs"></i>
          </div>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" :class="{ 'pt-20 lg:pt-24': isAuthenticated }">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Nav -->
    <nav v-if="isAuthenticated"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-700 lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
      <div class="flex items-center justify-around px-2 py-1">
        <NuxtLink v-for="link in mobileNavLinks" :key="link.to" :to="link.to"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 transition-all duration-200 group"
          active-class="text-primary-600" :class="$route.path === link.to ? '' : 'text-stone-400 hover:text-stone-600'">
          <div class="relative p-1.5 rounded-2xl transition-all duration-300 group-active:scale-95"
            :class="$route.path === link.to ? 'bg-primary-50' : ''">
            <i
              :class="[link.icon, 'text-xl transition-transform duration-300', $route.path === link.to ? '-translate-y-0.5' : '']"></i>
            <span v-if="$route.path === link.to"
              class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></span>
          </div>
          <span class="text-[10px] font-bold tracking-wide">{{ link.text }}</span>
        </NuxtLink>

        <!-- More Button -->
        <button @click="showMobileMenu = true"
          class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 text-stone-400 hover:text-stone-600 transition-all group"
          :class="{ 'text-primary-600': showMobileMenu }">
          <div class="relative p-1.5 rounded-2xl transition-all" :class="showMobileMenu ? 'bg-primary-50' : ''">
            <i class="fas fa-bars text-xl"></i>
          </div>
          <span class="text-[10px] font-bold tracking-wide">More</span>
        </button>
      </div>
    </nav>

    <!-- Mobile More Menu -->
    <MobileMoreMenu v-if="showMobileMenu" @close="showMobileMenu = false" @logout="handleLogout" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter, useRoute } from "vue-router";
import MobileMoreMenu from '~/components/MobileMoreMenu.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isScrolled = ref(false);
const showMobileMenu = ref(false);
const isDark = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  // Check system preference or saved preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    showMobileMenu.value = false;
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const headerTitle = computed(() => {
  const path = route.path;
  if (path === "/") return "FamilySpace";
  if (path.startsWith("/calendar")) return "Calendar";
  if (path.startsWith("/lists")) return "Lists";
  if (path.startsWith("/messages")) return "Messages";
  if (path.startsWith("/chores")) return "Chores";
  if (path.startsWith("/feed")) return "Family Feed";
  if (path.startsWith("/family")) return "My Family";
  if (path.startsWith("/capsules")) return "Time Capsules";
  if (path.startsWith("/profile")) return "Profile";
  return "FamilySpace";
});

const desktopNavLinks = [
  { to: "/", text: "Home", icon: "fas fa-home" },
  { to: "/calendar", text: "Calendar", icon: "fas fa-calendar-alt" },
  { to: "/lists", text: "Lists", icon: "fas fa-clipboard-list" },
  { to: "/chores", text: "Chores", icon: "fas fa-broom" },
  { to: "/family", text: "Family", icon: "fas fa-users" },
  { to: "/capsules", text: "Capsules", icon: "fas fa-clock" },
  { to: "/messages", text: "Messages", icon: "fas fa-comments" },
];

const mobileNavLinks = [
  { to: "/", text: "Home", icon: "fas fa-home" },
  { to: "/calendar", text: "Calendar", icon: "fas fa-calendar-alt" },
  { to: "/lists", text: "Lists", icon: "fas fa-clipboard-list" },
  { to: "/messages", text: "Chat", icon: "fas fa-comments" },
];
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
