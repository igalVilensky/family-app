<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Main Content -->
    <main
      class="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12 pb-24 md:pb-12"
    >
      <!-- Hero Section -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-8 sm:p-12 text-center"
      >
        <!-- App Icon/Logo -->
        <div class="mb-8">
          <div
            class="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-[3px] shadow-2xl hover:scale-105 transition-transform duration-200"
          >
            <div class="w-full h-full rounded-xl overflow-hidden bg-white">
              <img
                src="/family-space-logo.png"
                alt="FamilySpace Logo"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Main Headline -->
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          <span
            class="bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
          >
            FamilySpace
          </span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-xl sm:text-2xl text-gray-800 font-semibold mb-4 max-w-2xl mx-auto"
        >
          Your family's private digital home
        </p>

        <!-- Description -->
        <p
          class="text-base sm:text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          A safe, private space where your family connects, shares memories,
          plans events, and preserves your legacy for generations to come.
        </p>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <NuxtLink
            v-if="!authStore.userId"
            to="/register"
            class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
          >
            <i
              class="fas fa-rocket text-lg group-hover:scale-110 transition-transform"
            ></i>
            Start Your Family Journey
          </NuxtLink>
          <NuxtLink
            v-if="!authStore.userId"
            to="/login"
            class="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
          >
            <i
              class="fas fa-sign-in-alt text-lg group-hover:scale-110 transition-transform"
            ></i>
            Welcome Back
          </NuxtLink>
          <NuxtLink
            v-if="authStore.userId"
            to="/dashboard"
            class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg"
          >
            <i
              class="fas fa-tachometer-alt text-lg group-hover:scale-110 transition-transform"
            ></i>
            Go to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <!-- Memory Keeper -->
        <div
          class="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-pink-200 p-8 hover:shadow-2xl hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg"
            >
              <i class="fas fa-images text-white text-2xl"></i>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900">
              Memory Keeper
            </h3>
          </div>
          <p class="text-gray-600 text-base md:text-lg leading-relaxed">
            Preserve and share family moments in private, secure digital albums
            that last forever.
          </p>
        </div>

        <!-- Legacy Builder -->
        <div
          class="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-8 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg"
            >
              <i class="fas fa-tree text-white text-2xl"></i>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900">
              Legacy Builder
            </h3>
          </div>
          <p class="text-gray-600 text-base md:text-lg leading-relaxed">
            Build your family tree and create digital time capsules for future
            generations.
          </p>
        </div>

        <!-- Event Planning -->
        <div
          class="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-amber-200 p-8 hover:shadow-2xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-lg"
            >
              <i class="fas fa-calendar-plus text-white text-2xl"></i>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900">
              Together Time
            </h3>
          </div>
          <p class="text-gray-600 text-base md:text-lg leading-relaxed">
            Plan family events, track birthdays, and coordinate schedules in one
            place.
          </p>
        </div>
      </div>

      <!-- Additional Features Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 border-blue-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div
            class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md"
          >
            <i class="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <p class="text-base font-bold text-gray-800 text-center">
            Private & Secure
          </p>
        </div>
        <div
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 border-rose-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div
            class="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md"
          >
            <i class="fas fa-users text-white text-xl"></i>
          </div>
          <p class="text-base font-bold text-gray-800 text-center">
            Family-First
          </p>
        </div>
        <div
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 border-purple-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div
            class="w-14 h-14 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md"
          >
            <i class="fas fa-mobile-alt text-white text-xl"></i>
          </div>
          <p class="text-base font-bold text-gray-800 text-center">
            Always Available
          </p>
        </div>
        <div
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 border-amber-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div
            class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md"
          >
            <i class="fas fa-infinity text-white text-xl"></i>
          </div>
          <p class="text-base font-bold text-gray-800 text-center">
            Forever Free
          </p>
        </div>
      </div>

      <!-- Trust Badge -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-gray-200 p-8"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 flex-wrap"
        >
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 rounded-full shadow-sm border border-green-200"
          >
            <i class="fas fa-shield-alt text-green-600 text-lg"></i>
            <span class="font-bold text-gray-800">100% Private & Secure</span>
          </div>
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 rounded-full shadow-sm border border-blue-200"
          >
            <i class="fas fa-users text-blue-600 text-lg"></i>
            <span class="font-bold text-gray-800">Family-First Design</span>
          </div>
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-violet-50 px-5 py-3 rounded-full shadow-sm border border-purple-200"
          >
            <i class="fas fa-lock text-purple-600 text-lg"></i>
            <span class="font-bold text-gray-800">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div
        v-if="!authStore.userId"
        class="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl shadow-xl border-2 border-orange-300 p-8 md:p-12 text-center"
      >
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Ready to Bring Your Family Closer?
        </h3>
        <p class="text-gray-700 text-base md:text-lg mb-8 font-medium">
          Join thousands of families already using FamilySpace to stay
          connected.
        </p>
        <NuxtLink
          to="/register"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1 shadow-lg text-lg"
        >
          <i class="fas fa-home text-xl"></i>
          Create Your Family Space
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-gray-200 p-8 mx-4 md:mx-8 mb-8"
    >
      <div class="text-center">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div
            class="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <i class="fas fa-home text-white text-xl"></i>
          </div>
          <span
            class="text-xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
          >
            FamilySpace
          </span>
        </div>
        <p class="text-gray-600 text-base font-medium">
          Made with <i class="fas fa-heart text-rose-500"></i> for families
          everywhere
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
.group:hover .group-hover\:-translate-y-2 {
  transform: translateY(-0.5rem);
}
</style>
