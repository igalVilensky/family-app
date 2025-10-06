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
              to="/join-family"
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Join Family
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
          class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
        >
          <i class="fas fa-headset text-white text-2xl"></i>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          How Can We
          <span
            class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >Help You?</span
          >
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Get support for your FamilySpace experience. We're here to help you
          connect with your family.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Contact Methods -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-envelope text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Contact Support
                </h2>
                <p class="text-gray-500 text-sm">
                  Get in touch with our support team
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                class="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                >
                  <i
                    class="fas fa-envelope-open-text text-blue-600 text-lg"
                  ></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p class="text-gray-600 text-sm mb-4">
                  Send us a detailed message and we'll get back to you within 24
                  hours.
                </p>
                <a
                  href="mailto:support@familyspace.com"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <i class="fas fa-paper-plane text-sm"></i>
                  support@familyspace.com
                </a>
              </div>

              <div
                class="border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                >
                  <i class="fas fa-comments text-green-600 text-lg"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p class="text-gray-600 text-sm mb-4">
                  Chat with our support team in real-time during business hours.
                </p>
                <button
                  class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <i class="fas fa-comment-dots text-sm"></i>
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>

          <!-- FAQ Section -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-question-circle text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p class="text-gray-500 text-sm">
                  Quick answers to common questions
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in faqs"
                :key="index"
                class="border border-gray-200 rounded-xl p-6 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
              >
                <button
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between text-left"
                >
                  <h3 class="font-semibold text-gray-900 pr-4">
                    {{ faq.question }}
                  </h3>
                  <i
                    class="fas text-gray-400 transition-transform duration-200 flex-shrink-0"
                    :class="faq.open ? 'fa-chevron-up' : 'fa-chevron-down'"
                  ></i>
                </button>
                <div
                  v-if="faq.open"
                  class="mt-4 text-gray-600 leading-relaxed animate-fadeIn"
                >
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Resources -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-book-open text-white text-lg"></i>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">
                  Help Resources
                </h2>
                <p class="text-gray-500 text-sm">
                  Learn more about FamilySpace features
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NuxtLink
                to="/guides/getting-started"
                class="border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                >
                  <i class="fas fa-rocket text-amber-600 text-lg"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  Getting Started Guide
                </h3>
                <p class="text-gray-600 text-sm">
                  Learn how to set up your family space and invite members.
                </p>
              </NuxtLink>

              <NuxtLink
                to="/guides/family-management"
                class="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                >
                  <i class="fas fa-users-cog text-blue-600 text-lg"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  Family Management
                </h3>
                <p class="text-gray-600 text-sm">
                  Manage family members, roles, and privacy settings.
                </p>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Quick Help -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-lightbulb text-blue-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Quick Help</h3>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <i class="fas fa-user-plus text-blue-600 text-sm"></i>
                <span class="text-sm text-blue-800">Can't join a family?</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <i class="fas fa-envelope text-green-600 text-sm"></i>
                <span class="text-sm text-green-800"
                  >Invitation not working?</span
                >
              </div>
              <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <i class="fas fa-lock text-amber-600 text-sm"></i>
                <span class="text-sm text-amber-800">Login issues?</span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
              ></div>
              <h3 class="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              All systems are operational
            </p>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-500">Family Services</span>
                <span class="text-green-600 font-medium">Online</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Authentication</span>
                <span class="text-green-600 font-medium">Online</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">File Storage</span>
                <span class="text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          <!-- Community -->
          <div
            class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6"
          >
            <div class="text-center">
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <i class="fas fa-users text-white text-lg"></i>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">
                Join Our Community
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                Connect with other FamilySpace users
              </p>
              <button
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all duration-200"
              >
                <i class="fab fa-discord text-sm"></i>
                Join Discord
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white/80 backdrop-blur-md border-t border-gray-200/60 py-12"
    >
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
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
            <p class="text-gray-600 text-sm">
              Your family's private digital home for connecting, sharing, and
              preserving memories.
            </p>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                <NuxtLink
                  to="/support"
                  class="hover:text-blue-600 transition-colors"
                  >Help Center</NuxtLink
                >
              </li>
              <li>
                <NuxtLink class="hover:text-blue-600 transition-colors"
                  >Contact Us</NuxtLink
                >
              </li>
              <li>
                <NuxtLink class="hover:text-blue-600 transition-colors"
                  >System Status</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>
                <NuxtLink class="hover:text-blue-600 transition-colors"
                  >About Us</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/privacy"
                  class="hover:text-blue-600 transition-colors"
                  >Privacy Policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink class="hover:text-blue-600 transition-colors"
                  >Terms of Service</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Connect</h4>
            <div class="flex gap-4">
              <a
                href="#"
                class="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <i class="fab fa-twitter text-lg"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <i class="fab fa-facebook text-lg"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <i class="fab fa-instagram text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-8 pt-8 text-center">
          <p class="text-gray-500 text-sm">
            © 2025 FamilySpace. Your private family digital home.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const faqs = ref([
  {
    question: "How do I invite family members to join?",
    answer:
      "Family admins can generate invite links from the Family Profile page. Go to your family settings and click 'Generate Invite Link' to create a shareable link that family members can use to join.",
    open: false,
  },
  {
    question: "Why can't I join a family with an invitation link?",
    answer:
      "Invitation links expire after 7 days for security. If your link isn't working, ask the family admin to generate a new one. Also ensure you're logged into the correct account.",
    open: false,
  },
  {
    question: "How do I change my family role?",
    answer:
      "Your family role can be changed by a family admin. Contact your family's admin to request a role change from member to parent or vice versa.",
    open: false,
  },
  {
    question: "Can I be part of multiple families?",
    answer:
      "Currently, each account can only be associated with one family at a time. You would need to leave your current family before joining a new one.",
    open: false,
  },
  {
    question: "What happens if I leave my family?",
    answer:
      "When you leave a family, you'll lose access to all family content and events. You can rejoin later with a new invitation, but your previous data access won't be restored.",
    open: false,
  },
]);

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open;
};

useHead({
  title: "FamilySpace - Support & Help Center",
  meta: [
    {
      name: "description",
      content:
        "Get help with FamilySpace. Find answers to common questions, contact support, and access helpful resources for your family digital home.",
    },
  ],
});
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
