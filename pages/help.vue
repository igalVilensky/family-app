<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Navigation Bar -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </span>
          </NuxtLink>
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/dashboard"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/support"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Support
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <div
          class="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
        >
          <i class="fas fa-book-open text-white text-2xl"></i>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          FamilySpace
          <span
            class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            >Help Center</span
          >
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Step-by-step guides and tutorials to help you make the most of your
          family space.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <i class="fas fa-search text-gray-400 text-lg"></i>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400 shadow-sm"
            placeholder="Search for help articles, guides, and tutorials..."
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-8"
          >
            <h3 class="font-semibold text-gray-900 mb-4">Help Categories</h3>
            <nav class="space-y-2">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="setActiveCategory(category.id)"
                class="w-full text-left px-3 py-2 rounded-lg transition-all duration-200"
                :class="
                  activeCategory === category.id
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                "
              >
                <div class="flex items-center gap-3">
                  <i :class="category.icon" class="text-sm w-5"></i>
                  <span>{{ category.name }}</span>
                </div>
              </button>
            </nav>

            <!-- Quick Actions -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-4">Quick Help</h4>
              <div class="space-y-3">
                <NuxtLink
                  to="/support"
                  class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <i class="fas fa-headset text-blue-600 text-sm"></i>
                  <span class="text-sm text-blue-800 font-medium"
                    >Contact Support</span
                  >
                </NuxtLink>
                <NuxtLink
                  to="/join-family"
                  class="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <i class="fas fa-user-plus text-green-600 text-sm"></i>
                  <span class="text-sm text-green-800 font-medium"
                    >Join a Family</span
                  >
                </NuxtLink>
                <NuxtLink
                  to="/family-setup"
                  class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <i class="fas fa-cog text-purple-600 text-sm"></i>
                  <span class="text-sm text-purple-800 font-medium"
                    >Family Setup</span
                  >
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Getting Started Section -->
          <div v-if="activeCategory === 'getting-started'" class="space-y-8">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-rocket text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Getting Started
                  </h2>
                  <p class="text-gray-500 text-sm">
                    New to FamilySpace? Start here.
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="guide in gettingStartedGuides"
                  :key="guide.id"
                  class="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div
                    class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                  >
                    <i :class="guide.icon" class="text-blue-600 text-lg"></i>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-3">
                    {{ guide.title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    {{ guide.description }}
                  </p>
                  <NuxtLink
                    :to="guide.link"
                    class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read Guide
                    <i
                      class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                    ></i>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Family Management Section -->
          <div v-if="activeCategory === 'family-management'" class="space-y-8">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-users-cog text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Family Management
                  </h2>
                  <p class="text-gray-500 text-sm">
                    Manage your family members and settings
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div
                  v-for="guide in familyManagementGuides"
                  :key="guide.id"
                  class="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4">
                      <div
                        class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      >
                        <i
                          :class="guide.icon"
                          class="text-purple-600 text-lg"
                        ></i>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900 mb-2">
                          {{ guide.title }}
                        </h3>
                        <p class="text-gray-600 text-sm mb-3">
                          {{ guide.description }}
                        </p>
                        <div
                          class="flex items-center gap-4 text-xs text-gray-500"
                        >
                          <span class="flex items-center gap-1">
                            <i class="fas fa-clock"></i>
                            {{ guide.duration }}
                          </span>
                          <span class="flex items-center gap-1">
                            <i class="fas fa-chart-bar"></i>
                            {{ guide.difficulty }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <NuxtLink
                      :to="guide.link"
                      class="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm whitespace-nowrap"
                    >
                      View Guide
                      <i
                        class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                      ></i>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Troubleshooting Section -->
          <div v-if="activeCategory === 'troubleshooting'" class="space-y-8">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-tools text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Troubleshooting
                  </h2>
                  <p class="text-gray-500 text-sm">
                    Solve common issues and problems
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div
                  v-for="issue in troubleshootingIssues"
                  :key="issue.id"
                  class="border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                >
                  <h3 class="font-semibold text-gray-900 mb-3">
                    {{ issue.title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    {{ issue.description }}
                  </p>
                  <div
                    class="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <div class="flex items-start gap-3">
                      <i
                        class="fas fa-lightbulb text-amber-600 text-sm mt-0.5 flex-shrink-0"
                      ></i>
                      <div>
                        <p class="text-amber-800 text-sm font-medium mb-2">
                          Solution:
                        </p>
                        <p class="text-amber-700 text-sm">
                          {{ issue.solution }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Tutorials Section -->
          <div v-if="activeCategory === 'tutorials'" class="space-y-8">
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-play-circle text-white text-lg"></i>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">
                    Video Tutorials
                  </h2>
                  <p class="text-gray-500 text-sm">
                    Watch and learn with video guides
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="tutorial in videoTutorials"
                  :key="tutorial.id"
                  class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group"
                >
                  <div class="aspect-video bg-gray-200 relative">
                    <div
                      class="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 opacity-90 flex items-center justify-center"
                    >
                      <i
                        class="fas fa-play text-white text-4xl group-hover:scale-110 transition-transform"
                      ></i>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="font-semibold text-gray-900 mb-2">
                      {{ tutorial.title }}
                    </h3>
                    <p class="text-gray-600 text-sm mb-3">
                      {{ tutorial.description }}
                    </p>
                    <div
                      class="flex items-center justify-between text-xs text-gray-500"
                    >
                      <span>{{ tutorial.duration }}</span>
                      <span>{{ tutorial.level }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div
            v-if="filteredArticles.length === 0 && searchQuery"
            class="text-center py-12"
          >
            <div
              class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-search text-gray-400 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p class="text-gray-500 text-sm">
              Try different keywords or browse the categories above.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-12 mt-16"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            © 2025 FamilySpace. Your private family digital home.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const activeCategory = ref("getting-started");

const categories = [
  { id: "getting-started", name: "Getting Started", icon: "fas fa-rocket" },
  {
    id: "family-management",
    name: "Family Management",
    icon: "fas fa-users-cog",
  },
  { id: "troubleshooting", name: "Troubleshooting", icon: "fas fa-tools" },
  { id: "tutorials", name: "Video Tutorials", icon: "fas fa-play-circle" },
];

const gettingStartedGuides = [
  {
    id: 1,
    title: "Creating Your First Family",
    description:
      "Learn how to set up your family space and become the family admin.",
    icon: "fas fa-home",
    link: "/guides/creating-first-family",
  },
  {
    id: 2,
    title: "Inviting Family Members",
    description:
      "Step-by-step guide to inviting members and managing invitations.",
    icon: "fas fa-user-plus",
    link: "/guides/inviting-members",
  },
  {
    id: 3,
    title: "Setting Up Your Profile",
    description: "Complete your profile and customize your family role.",
    icon: "fas fa-user-cog",
    link: "/guides/setting-up-profile",
  },
  {
    id: 4,
    title: "FamilySpace Basics",
    description: "Overview of key features and how to navigate the platform.",
    icon: "fas fa-compass",
    link: "/guides/basics",
  },
];

const familyManagementGuides = [
  {
    id: 1,
    title: "Managing Family Members",
    description:
      "Learn how to add, remove, and manage roles for family members.",
    icon: "fas fa-users",
    link: "/guides/managing-members",
    duration: "5 min read",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Family Privacy Settings",
    description:
      "Configure privacy options and control what family members can see.",
    icon: "fas fa-shield-alt",
    link: "/guides/privacy-settings",
    duration: "8 min read",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    title: "Advanced Family Features",
    description:
      "Explore advanced features like events, memories, and family calendar.",
    icon: "fas fa-star",
    link: "/guides/advanced-features",
    duration: "12 min read",
    difficulty: "Advanced",
  },
];

const troubleshootingIssues = [
  {
    id: 1,
    title: "Can't Join a Family",
    description:
      "Having trouble accepting an invitation or joining a family space?",
    solution:
      "Check if the invitation link has expired. Ask the family admin to send a new invitation. Ensure you're logged into the correct account.",
  },
  {
    id: 2,
    title: "Invitation Links Not Working",
    description: "Invitation links are expired or returning errors.",
    solution:
      "Invitation links expire after 7 days. Request a new link from the family admin. Make sure you're using the complete URL.",
  },
  {
    id: 3,
    title: "Profile Setup Issues",
    description: "Problems completing your profile or family setup.",
    solution:
      "Clear your browser cache and cookies. Ensure all required fields are filled correctly. Try using a different browser.",
  },
];

const videoTutorials = [
  {
    id: 1,
    title: "Getting Started with FamilySpace",
    description: "Complete walkthrough of setting up your family space.",
    duration: "4:32",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Managing Your Family Members",
    description: "Learn how to invite and manage family members.",
    duration: "6:15",
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Privacy and Security Features",
    description: "Understanding FamilySpace privacy controls.",
    duration: "5:48",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Advanced Family Settings",
    description: "Deep dive into advanced family management.",
    duration: "8:22",
    level: "Advanced",
  },
];

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
  searchQuery.value = ""; // Clear search when switching categories
};

const filteredArticles = computed(() => {
  // This would filter articles based on search query in a real implementation
  return [];
});

useHead({
  title: "FamilySpace - Help Center & Guides",
  meta: [
    {
      name: "description",
      content:
        "Comprehensive help center with guides, tutorials, and troubleshooting for FamilySpace. Learn how to manage your family digital home.",
    },
  ],
});
</script>

<style scoped>
.sticky {
  position: sticky;
}
</style>
