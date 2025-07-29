<template>
  <div
    class="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"
  >
    <!-- Animated Background Particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="i in 30"
        :key="i"
        class="absolute w-1 h-1 bg-white rounded-full opacity-40 sm:opacity-60"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Glass Morphism Overlay -->
    <div class="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm"></div>

    <!-- Main Content -->
    <div
      class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
    >
      <!-- Hero Section -->
      <div class="text-center max-w-4xl mx-auto w-full">
        <!-- App Icon/Logo -->
        <div class="mb-6 sm:mb-8 relative">
          <div
            class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 animate-pulse"
          >
            <svg
              class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <!-- Floating hearts around logo -->
          <div
            class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-red-400 text-lg sm:text-xl animate-bounce"
          >
            ❤️
          </div>
          <div
            class="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 text-pink-400 text-base sm:text-lg animate-bounce delay-700"
          >
            💝
          </div>
        </div>

        <!-- Main Headline -->
        <h1
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight px-2"
        >
          <span
            class="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse"
          >
            FamilySpace
          </span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-lg sm:text-xl md:text-2xl text-gray-200 font-light mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4"
        >
          Your family's private digital home
        </p>

        <!-- Description -->
        <p
          class="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
        >
          A safe, private space where your family connects, shares precious
          memories, plans adventures, and preserves your legacy for generations
          to come.
        </p>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
        >
          <NuxtLink
            to="/register"
            class="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden text-center"
          >
            <span class="relative z-10">Start Your Family Journey</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white border-opacity-30 text-white text-base sm:text-lg font-medium rounded-xl sm:rounded-2xl backdrop-blur-sm bg-white bg-opacity-10 hover:bg-opacity-20 transform hover:scale-105 transition-all duration-300 text-center"
          >
            Welcome Back
          </NuxtLink>
        </div>

        <!-- Feature Highlights -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4"
        >
          <!-- Memory Keeper -->
          <div
            class="group p-4 sm:p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              📸
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2">
              Memory Keeper
            </h3>
            <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
              Preserve and share your most precious family moments in beautiful,
              private albums
            </p>
          </div>

          <!-- Family Tree -->
          <div
            class="group p-4 sm:p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              🌳
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2">
              Legacy Builder
            </h3>
            <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
              Build your family tree and create digital time capsules for future
              generations
            </p>
          </div>

          <!-- Event Planning -->
          <div
            class="group p-4 sm:p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1"
          >
            <div
              class="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              🎉
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2">
              Together Time
            </h3>
            <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
              Plan family events, track birthdays, and never miss a special
              moment
            </p>
          </div>
        </div>

        <!-- Trust Badge -->
        <div
          class="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 px-4"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-xs sm:text-sm">100% Private & Secure</span>
          </div>
          <div class="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
          <div class="flex items-center space-x-2">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs sm:text-sm">Family-First Design</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Particle animation setup
const particles = ref([]);

const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + "%",
    animationDelay: Math.random() * 8 + "s",
    animationDuration: Math.random() * 3 + 5 + "s",
  };
};

// SEO Meta
useHead({
  title: "FamilySpace - Your Family's Digital Home",
  meta: [
    {
      name: "description",
      content:
        "A private, secure space for families to connect, share memories, and preserve their legacy for future generations.",
    },
    {
      property: "og:title",
      content: "FamilySpace - Your Family's Digital Home",
    },
    {
      property: "og:description",
      content:
        "Connect, share, and preserve your family's precious moments in one beautiful, private space.",
    },
  ],
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(-1deg);
  }
  75% {
    transform: translateY(-15px) rotate(1deg);
  }
}

@keyframes particle-drift {
  0% {
    transform: translateY(100vh) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(50px);
    opacity: 0;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-particle {
  animation: particle-drift 15s linear infinite;
}

/* Ensure proper font loading */
* {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}
</style>
