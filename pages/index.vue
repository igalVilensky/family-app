<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main
      class="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8"
    >
      <!-- Hero Section -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8 text-center"
      >
        <!-- App Icon/Logo -->
        <div class="mb-6">
          <div
            class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <i class="fas fa-home text-white text-2xl"></i>
          </div>
        </div>

        <!-- Main Headline -->
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          <span
            class="bg-gradient-to-r from-gray-900 via-blue-700 to-blue-600 bg-clip-text text-transparent"
          >
            FamilySpace
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Your family's private digital home
        </p>

        <!-- Description -->
        <p
          class="text-base sm:text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed"
        >
          A safe, private space where your family connects, shares memories,
          plans events, and preserves your legacy for generations to come.
        </p>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <NuxtLink
            v-if="!authStore.userId"
            to="/register"
            class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i
              class="fas fa-rocket text-sm group-hover:scale-110 transition-transform"
            ></i>
            Start Your Family Journey
          </NuxtLink>
          <NuxtLink
            v-if="!authStore.userId"
            to="/login"
            class="group flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <i
              class="fas fa-sign-in-alt text-sm group-hover:scale-110 transition-transform"
            ></i>
            Welcome Back
          </NuxtLink>
          <NuxtLink
            v-if="authStore.userId"
            to="/dashboard"
            class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <i
              class="fas fa-tachometer-alt text-sm group-hover:scale-110 transition-transform"
            ></i>
            Go to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <!-- Memory Keeper -->
        <div
          class="group bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-images text-white text-lg"></i>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-900">
              Memory Keeper
            </h3>
          </div>
          <p class="text-gray-500 text-sm md:text-base leading-relaxed">
            Preserve and share family moments in private, secure digital albums
            that last forever.
          </p>
        </div>

        <!-- Legacy Builder -->
        <div
          class="group bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-tree text-white text-lg"></i>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-900">
              Legacy Builder
            </h3>
          </div>
          <p class="text-gray-500 text-sm md:text-base leading-relaxed">
            Build your family tree and create digital time capsules for future
            generations.
          </p>
        </div>

        <!-- Event Planning -->
        <div
          class="group bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 hover:shadow-lg hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-calendar-plus text-white text-lg"></i>
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-900">
              Together Time
            </h3>
          </div>
          <p class="text-gray-500 text-sm md:text-base leading-relaxed">
            Plan family events, track birthdays, and coordinate schedules in one
            place.
          </p>
        </div>
      </div>

      <!-- Additional Features Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 text-center"
        >
          <div
            class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto"
          >
            <i class="fas fa-shield-alt text-blue-600 text-base"></i>
          </div>
          <p class="text-sm font-medium text-gray-700">Private & Secure</p>
        </div>
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 text-center"
        >
          <div
            class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto"
          >
            <i class="fas fa-heart text-green-600 text-base"></i>
          </div>
          <p class="text-sm font-medium text-gray-700">Family-First</p>
        </div>
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 text-center"
        >
          <div
            class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto"
          >
            <i class="fas fa-mobile-alt text-purple-600 text-base"></i>
          </div>
          <p class="text-sm font-medium text-gray-700">Always Available</p>
        </div>
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-4 text-center"
        >
          <div
            class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 mx-auto"
          >
            <i class="fas fa-infinity text-amber-600 text-base"></i>
          </div>
          <p class="text-sm font-medium text-gray-700">Forever Free</p>
        </div>
      </div>

      <!-- Trust Badge -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
        >
          <div
            class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full"
          >
            <i class="fas fa-shield-alt text-green-600 text-sm"></i>
            <span class="font-medium text-gray-700">100% Private & Secure</span>
          </div>
          <div
            class="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full"
          >
            <i class="fas fa-people-roof text-blue-600 text-sm"></i>
            <span class="font-medium text-gray-700">Family-First Design</span>
          </div>
          <div
            class="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full"
          >
            <i class="fas fa-lock text-purple-600 text-sm"></i>
            <span class="font-medium text-gray-700">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div
        v-if="!authStore.userId"
        class="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 md:p-8 text-center"
      >
        <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          Ready to Bring Your Family Closer?
        </h3>
        <p class="text-gray-600 text-sm md:text-base mb-6">
          Join thousands of families already using FamilySpace to stay
          connected.
        </p>
        <NuxtLink
          to="/register"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <i class="fas fa-home text-sm"></i>
          Create Your Family Space
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 mx-4 md:mx-8"
    >
      <div class="text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-home text-white text-lg"></i>
          </div>
          <span
            class="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
          >
            FamilySpace
          </span>
        </div>
        <p class="text-gray-500 text-sm">
          Made with ❤️ for families everywhere
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useHead } from "#imports";

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.userId && authStore.isInitialized) {
    router.push("/dashboard");
  }
});

// SEO Meta
useHead({
  title: "FamilySpace - Your Family's Digital Home",
  meta: [
    {
      name: "description",
      content:
        "A private, secure space for families to connect, share memories, and preserve their legacy for future generations. Family-first design with end-to-end encryption.",
    },
    {
      property: "og:title",
      content: "FamilySpace - Your Family's Digital Home",
    },
    {
      property: "og:description",
      content:
        "Connect, share, and preserve your family's precious moments in one private, secure space designed specifically for families.",
    },
    {
      property: "og:image",
      content: "/familyspace-og.jpg",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],
});
</script>

<style scoped>
/* Ensure smooth hover transitions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
.group:hover .group-hover\:-translate-y-1 {
  transform: translateY(-0.25rem);
}
</style>
