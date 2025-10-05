<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink
              v-if="!authStore.userId"
              to="/login"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              v-if="authStore.userId"
              to="/dashboard"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i class="fas fa-tachometer-alt text-sm"></i>
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center">
          <!-- App Icon/Logo -->
          <div class="mb-8">
            <div
              class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-home text-white text-3xl"></i>
            </div>
          </div>

          <!-- Main Headline -->
          <h1
            class="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
          >
            <span
              class="bg-gradient-to-r from-gray-900 via-blue-700 to-purple-600 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </h1>

          <!-- Subtitle -->
          <p
            class="text-2xl sm:text-3xl text-gray-600 mb-6 max-w-3xl mx-auto font-light"
          >
            Your family's private digital home
          </p>

          <!-- Description -->
          <p
            class="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A safe, private space where your family connects, shares memories,
            plans events, and preserves your legacy for generations to come.
          </p>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <NuxtLink
              v-if="!authStore.userId"
              to="/register"
              class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i
                class="fas fa-rocket text-sm group-hover:scale-110 transition-transform"
              ></i>
              Start Your Family Journey
            </NuxtLink>
            <NuxtLink
              v-if="!authStore.userId"
              to="/login"
              class="group flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              <i
                class="fas fa-sign-in-alt text-sm group-hover:scale-110 transition-transform"
              ></i>
              Welcome Back
            </NuxtLink>
            <NuxtLink
              v-if="authStore.userId"
              to="/dashboard"
              class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i
                class="fas fa-tachometer-alt text-sm group-hover:scale-110 transition-transform"
              ></i>
              Go to Dashboard
            </NuxtLink>
          </div>

          <!-- Feature Highlights -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20"
          >
            <!-- Memory Keeper -->
            <div
              class="group p-6 bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-images text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                Memory Keeper
              </h3>
              <p class="text-gray-500 leading-relaxed">
                Preserve and share family moments in private, secure digital
                albums that last forever.
              </p>
            </div>

            <!-- Legacy Builder -->
            <div
              class="group p-6 bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-tree text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                Legacy Builder
              </h3>
              <p class="text-gray-500 leading-relaxed">
                Build your family tree and create digital time capsules for
                future generations.
              </p>
            </div>

            <!-- Event Planning -->
            <div
              class="group p-6 bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-xl hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-calendar-star text-white text-2xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                Together Time
              </h3>
              <p class="text-gray-500 leading-relaxed">
                Plan family events, track birthdays, and coordinate schedules in
                one place.
              </p>
            </div>
          </div>

          <!-- Additional Features Grid -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
          >
            <div class="text-center p-4">
              <div
                class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 mx-auto"
              >
                <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Private & Secure</p>
            </div>
            <div class="text-center p-4">
              <div
                class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3 mx-auto"
              >
                <i class="fas fa-heart text-green-600 text-xl"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Family-First</p>
            </div>
            <div class="text-center p-4">
              <div
                class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 mx-auto"
              >
                <i class="fas fa-mobile-alt text-purple-600 text-xl"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Always Available</p>
            </div>
            <div class="text-center p-4">
              <div
                class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-3 mx-auto"
              >
                <i class="fas fa-infinity text-amber-600 text-xl"></i>
              </div>
              <p class="text-sm font-medium text-gray-700">Forever Free</p>
            </div>
          </div>

          <!-- Trust Badge -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200/60"
          >
            <div
              class="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600"
            >
              <div
                class="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl"
              >
                <i class="fas fa-shield-alt text-green-600 text-lg"></i>
                <span class="font-semibold text-gray-700"
                  >100% Private & Secure</span
                >
              </div>
              <div
                class="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl"
              >
                <i class="fas fa-people-roof text-blue-600 text-lg"></i>
                <span class="font-semibold text-gray-700"
                  >Family-First Design</span
                >
              </div>
              <div
                class="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-xl"
              >
                <i class="fas fa-lock text-purple-600 text-lg"></i>
                <span class="font-semibold text-gray-700"
                  >End-to-End Encrypted</span
                >
              </div>
            </div>
          </div>

          <!-- Final CTA -->
          <div
            v-if="!authStore.userId"
            class="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 max-w-2xl mx-auto"
          >
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Ready to Bring Your Family Closer?
            </h3>
            <p class="text-gray-600 mb-6">
              Join thousands of families already using FamilySpace to stay
              connected.
            </p>
            <NuxtLink
              to="/register"
              class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i class="fas fa-home text-sm"></i>
              Create Your Family Space
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Background Decorations -->
      <div
        class="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
      ></div>
      <div
        class="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
      ></div>
    </div>

    <!-- Footer -->
    <footer
      class="bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-home text-white text-sm"></i>
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
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>
