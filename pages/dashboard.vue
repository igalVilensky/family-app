<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Loading FamilySpace
        </h2>
        <p class="text-sm md:text-base text-gray-600">Please wait...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 pb-24 md:pb-8">
      <!-- Family Header - Warm Welcome -->
      <div class="text-center space-y-4 py-8">
        <div class="flex items-center justify-center gap-4">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-orange-200"
          >
            <i class="fas fa-home text-orange-500"></i>
            <span class="text-sm font-medium text-gray-700">{{
              authStore.familyName || "Your Family Space"
            }}</span>
          </div>
          <NuxtLink
            to="/profile"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-all"
          >
            <i class="fas fa-user text-gray-600"></i>
            <span class="text-sm font-medium text-gray-700">Profile</span>
          </NuxtLink>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-gray-900">
          Welcome Home!
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ getGreeting() }}
        </p>
      </div>

      <!-- Pending Join Request Alert -->
      <div
        v-if="hasPendingJoinRequest && !authStore.familyId"
        class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-lg animate-fadeIn"
      >
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            <i class="fas fa-hourglass-half text-white text-2xl"></i>
          </div>
          <div class="text-center sm:text-left flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Waiting to Join the Family
            </h3>
            <p class="text-gray-700 mb-4">
              Your request to join
              <strong class="text-amber-900">{{ pendingFamilyName }}</strong> is
              being reviewed by the family admin.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="checkRequestStatus"
                :disabled="checkingStatus"
                class="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-md disabled:opacity-50"
              >
                <i
                  class="fas fa-sync-alt"
                  :class="{ 'animate-spin': checkingStatus }"
                ></i>
                {{ checkingStatus ? "Checking..." : "Check Status" }}
              </button>
              <button
                @click="cancelJoinRequest"
                :disabled="cancelingRequest"
                class="flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all border-2 border-red-200 disabled:opacity-50"
              >
                <i class="fas fa-times"></i>
                {{ cancelingRequest ? "Canceling..." : "Cancel Request" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats - Family Style -->
      <div
        v-if="authStore.familyId"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      >
        <div
          class="bg-white rounded-3xl shadow-md border-2 border-rose-100 p-6 hover:shadow-xl transition-all"
        >
          <div class="flex flex-col items-center text-center gap-3">
            <div
              class="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-calendar-day text-white text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ todaysEventsCount }}
              </p>
              <p class="text-sm text-gray-600 font-medium">Today's Plans</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl shadow-md border-2 border-purple-100 p-6 hover:shadow-xl transition-all"
        >
          <div class="flex flex-col items-center text-center gap-3">
            <div
              class="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-birthday-cake text-white text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ upcomingBirthdaysCount }}
              </p>
              <p class="text-sm text-gray-600 font-medium">
                Upcoming Birthdays
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl shadow-md border-2 border-orange-100 p-6 hover:shadow-xl transition-all"
        >
          <div class="flex flex-col items-center text-center gap-3">
            <div
              class="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-comment-dots text-white text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ unreadMessagesCount }}
              </p>
              <p class="text-sm text-gray-600 font-medium">New Messages</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl shadow-md border-2 border-emerald-100 p-6 hover:shadow-xl transition-all"
        >
          <div class="flex flex-col items-center text-center gap-3">
            <div
              class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-users text-white text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ familyMembers.length }}
              </p>
              <p class="text-sm text-gray-600 font-medium">Family Members</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Upcoming Events -->
          <div
            v-if="authStore.familyId && authStore.status === 'active'"
            class="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-6 md:p-8"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
            >
              <h2
                class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2"
              >
                <i class="fas fa-calendar-check text-blue-500"></i>
                <span>What's Coming Up</span>
              </h2>
              <NuxtLink
                to="/calendar"
                class="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-sm whitespace-nowrap"
              >
                View Calendar
                <i class="fas fa-arrow-right text-xs"></i>
              </NuxtLink>
            </div>

            <div v-if="upcomingEvents.length > 0" class="space-y-4">
              <div
                v-for="event in upcomingEvents.slice(0, 4)"
                :key="event.id"
                class="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:shadow-md transition-all border border-blue-100"
              >
                <div
                  class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white shadow-lg"
                >
                  <span class="text-2xl font-bold">{{
                    new Date(event.startDate).getDate()
                  }}</span>
                  <span class="text-xs font-medium">{{
                    new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900 text-lg mb-1">
                    {{ event.title }}
                  </p>
                  <p class="text-gray-600 flex items-center gap-2">
                    <i class="fas fa-clock text-sm"></i>
                    {{ formatEventDate(event.startDate) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <i class="fas fa-calendar-plus text-gray-300 text-5xl mb-4"></i>
              <p class="text-gray-500">No upcoming events yet</p>
              <NuxtLink
                to="/calendar"
                class="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Add Your First Event
              </NuxtLink>
            </div>
          </div>

          <!-- Recent Messages -->
          <div
            v-if="authStore.familyId && recentConversations.length > 0"
            class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-6 md:p-8"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6"
            >
              <h2
                class="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2"
              >
                <i class="fas fa-comments text-purple-500"></i>
                <span>Family Chats</span>
              </h2>
              <NuxtLink
                to="/messages"
                class="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all text-sm whitespace-nowrap"
              >
                View All
                <i class="fas fa-arrow-right text-xs"></i>
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="conversation in recentConversations.slice(0, 3)"
                :key="conversation.userId"
                class="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all cursor-pointer border border-purple-100"
                @click="goToConversation(conversation.userId)"
              >
                <div
                  class="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg"
                >
                  <img
                    v-if="conversation.avatarUrl"
                    :src="conversation.avatarUrl"
                    :alt="conversation.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xl font-bold text-white">
                    {{
                      conversation.name
                        ? conversation.name.charAt(0).toUpperCase()
                        : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="font-bold text-gray-900 truncate">
                      {{ conversation.name }}
                    </p>
                    <span
                      class="text-xs text-gray-500 flex-shrink-0 bg-white px-2 py-1 rounded-lg"
                    >
                      {{ formatTimeAgo(conversation.lastMessageTime) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 truncate">
                    {{ conversation.lastMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          <!-- Family Circle -->
          <div
            v-if="authStore.familyId"
            class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg border-2 border-blue-200 p-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-2xl font-bold text-gray-900 flex items-center gap-3"
              >
                <i class="fas fa-users text-indigo-600"></i>
                Our Family
              </h2>
              <span
                class="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm"
              >
                {{ familyMembers.length }} members
              </span>
            </div>

            <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
              <div
                v-for="member in familyMembers"
                :key="member.userId"
                class="flex items-center gap-3 p-3 bg-white rounded-2xl hover:shadow-md transition-all cursor-pointer group"
                :class="{
                  'ring-2 ring-amber-400 bg-amber-50': member.role === 'admin',
                }"
                @click="goToUserProfile(member.userId)"
              >
                <div
                  class="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform overflow-hidden"
                  :class="
                    member.role === 'admin'
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  "
                >
                  <img
                    v-if="member.avatarUrl"
                    :src="member.avatarUrl"
                    :alt="member.name"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-white font-bold text-lg">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                  <div
                    v-if="member.role === 'admin'"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <i class="fas fa-crown text-white text-xs"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">
                    {{ member.name || member.email }}
                  </p>
                  <p
                    class="text-xs text-gray-500 capitalize flex items-center gap-1"
                  >
                    <i
                      class="fas"
                      :class="
                        member.role === 'admin'
                          ? 'fa-shield-alt text-amber-600'
                          : 'fa-user'
                      "
                    ></i>
                    {{ member.role }}
                  </p>
                </div>
              </div>
            </div>

            <NuxtLink
              :to="`/family/${authStore.familyId}`"
              class="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-2xl font-semibold text-center transition-all shadow-lg"
            >
              View Family Tree
            </NuxtLink>
          </div>

          <!-- Birthday Progress -->
          <div
            v-if="authStore.familyId"
            class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-lg border-2 border-purple-200 p-8"
          >
            <h3
              class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <i class="fas fa-birthday-cake text-purple-500"></i>
              Birthday Setup
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 font-medium">Profiles Complete</span>
                <span class="text-lg font-bold text-purple-600">
                  {{ membersWithBirthdays.length }}/{{ familyMembers.length }}
                </span>
              </div>
              <div
                class="w-full bg-purple-200 rounded-full h-4 overflow-hidden shadow-inner"
              >
                <div
                  class="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                  :style="{
                    width: `${
                      familyMembers.length > 0
                        ? (membersWithBirthdays.length / familyMembers.length) *
                          100
                        : 0
                    }%`,
                  }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 text-center font-medium">
                {{
                  familyMembers.length > 0
                    ? Math.round(
                        (membersWithBirthdays.length / familyMembers.length) *
                          100
                      )
                    : 0
                }}% of family birthdays added
              </p>
            </div>
          </div>

          <!-- Admin Invite -->
          <div
            v-if="authStore.permissions.role === 'admin' && authStore.familyId"
            class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200 p-8 shadow-lg"
          >
            <h3
              class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3"
            >
              <i class="fas fa-user-plus text-emerald-600"></i>
              Invite Family Members
            </h3>

            <p class="text-gray-600 mb-6 text-sm">
              Share an invite link with your family
            </p>

            <button
              @click="generateInviteLink"
              :disabled="generatingInvite"
              class="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50"
            >
              <i
                class="fas fa-link mr-2"
                :class="{ 'animate-spin': generatingInvite }"
              ></i>
              {{
                generatingInvite ? "Creating Link..." : "Generate Invite Link"
              }}
            </button>

            <div
              v-if="inviteLink"
              class="mt-4 p-4 bg-white rounded-2xl shadow-md"
            >
              <input
                type="text"
                :value="inviteLink"
                readonly
                class="w-full text-sm px-4 py-3 border-2 border-emerald-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 font-mono"
                @click="$event.target.select()"
              />
              <button
                @click="copyInviteLink"
                class="w-full mt-3 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
              >
                <i class="fas fa-copy mr-2"></i>
                {{ copyButtonText }}
              </button>
            </div>
          </div>

          <!-- Join Requests -->
          <div
            v-if="
              authStore.permissions.role === 'admin' &&
              authStore.familyId &&
              joinRequests.length
            "
            class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg border-2 border-amber-200 p-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h3
                class="text-xl font-bold text-gray-900 flex items-center gap-3"
              >
                <i class="fas fa-bell text-amber-600"></i>
                Join Requests
              </h3>
              <span
                class="px-4 py-2 bg-amber-200 text-amber-900 rounded-full font-bold shadow-sm"
              >
                {{ joinRequests.length }}
              </span>
            </div>

            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="request in joinRequests"
                :key="request.id"
                class="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md"
              >
                <p class="font-semibold text-gray-900 truncate">
                  {{ request.email }}
                </p>
                <div class="flex gap-2">
                  <button
                    @click="
                      approveRequest(request.id, request.userId, request.email)
                    "
                    class="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                  >
                    <i class="fas fa-check mr-1"></i>
                    Accept
                  </button>
                  <button
                    @click="denyRequest(request.id)"
                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                  >
                    <i class="fas fa-times mr-1"></i>
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div
            class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8 shadow-lg"
          >
            <h3
              class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <i class="fas fa-question-circle text-blue-600"></i>
              Need Help?
            </h3>

            <div class="space-y-3">
              <NuxtLink
                to="/help"
                class="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all group"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                >
                  <i class="fas fa-book text-white text-lg"></i>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">Guide</p>
                  <p class="text-xs text-gray-500">Learn the basics</p>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-gray-600"
                ></i>
              </NuxtLink>

              <NuxtLink
                to="/support"
                class="flex items-center gap-4 p-4 bg-white rounded-2xl hover:shadow-md transition-all group"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                >
                  <i class="fas fa-headset text-white text-lg"></i>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">Support</p>
                  <p class="text-xs text-gray-500">We're here to help</p>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-gray-600"
                ></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <ToastNotification
      :show="showToastMessage"
      :message="toastMessage"
      :type="toastType"
      @hide="showToastMessage = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { generateInvite, getEventsByRange } from "~/utils/firebase";
import DashboardHeading from "~/components/dashboard/DashboardHeading.vue";

const ToastNotification = {
  props: ["show", "message", "type"],
  emits: ["hide"],
  template: `
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-2xl shadow-xl border-2 backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-300': type === 'success',
          'bg-red-50/95 text-red-800 border-red-300': type === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-xl flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': type === 'success',
              'fas fa-exclamation-circle text-red-500': type === 'error',
            }"
          ></i>
          <p class="font-semibold flex-1">{{ message }}</p>
          <button @click="emit('hide')" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
};

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();
const joinRequests = ref([]);
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const hasPendingJoinRequest = ref(false);
const pendingFamilyName = ref("");
const pendingFamilyId = ref("");
const checkingStatus = ref(false);
const cancelingRequest = ref(false);
const isLoading = ref(true);
const events = ref([]);
const recentConversations = ref([]);

const familyMembers = computed(() => authStore.familyMembers || []);
const membersWithBirthdays = computed(() =>
  familyMembers.value.filter((member) => member.birthday)
);

const upcomingEvents = computed(() => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return events.value
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= now && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
});

const todaysEventsCount = computed(() => {
  const today = new Date().toDateString();
  return events.value.filter(
    (event) => new Date(event.startDate).toDateString() === today
  ).length;
});

const upcomingBirthdaysCount = computed(() => {
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  return familyMembers.value.filter((member) => {
    if (!member.birthday) return false;
    const birthday = new Date(member.birthday);
    const now = new Date();
    const nextBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );

    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    return nextBirthday <= next30Days;
  }).length;
});

const unreadMessagesCount = computed(() => {
  return recentConversations.value.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );
});

const getGreeting = () => {
  const hour = new Date().getHours();
  const name = authStore.name || "there";

  if (hour < 12) return `Good morning, ${name}! ☀️`;
  if (hour < 18) return `Good afternoon, ${name}! 🌤️`;
  return `Good evening, ${name}! 🌙`;
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Never";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatEventDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const refreshEvents = async () => {
  if (!authStore.familyId) return;
  try {
    const now = new Date();
    const start = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      1
    ).toISOString();
    const end = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      0
    ).toISOString();
    const calendarEvents = await getEventsByRange(
      authStore.familyId,
      start,
      end
    );
    const birthdayEvents = generateBirthdayEvents();
    events.value = [...calendarEvents, ...birthdayEvents];
  } catch (error) {
    console.error("Error refreshing events:", error);
    showToast("Failed to load calendar stats", "error");
  }
};

const generateBirthdayEvents = () => {
  const birthdayEvents = [];
  const currentYear = new Date().getFullYear();

  familyMembers.value.forEach((member) => {
    if (member.birthday) {
      try {
        const birthday = new Date(member.birthday);
        if (isNaN(birthday.getTime())) return;

        for (let year = currentYear; year <= currentYear + 1; year++) {
          const eventDate = new Date(
            year,
            birthday.getMonth(),
            birthday.getDate()
          );
          if (isNaN(eventDate.getTime())) continue;

          birthdayEvents.push({
            id: `birthday-${member.userId}-${year}`,
            title: `${member.name || member.email}'s Birthday`,
            startDate: eventDate.toISOString(),
            endDate: eventDate.toISOString(),
            eventType: "birthday",
            color: "pink",
            allDay: true,
            extendedProps: {
              isBirthday: true,
              memberId: member.userId,
              memberName: member.name || member.email,
            },
          });
        }
      } catch (error) {
        console.error(
          `Error processing birthday for member ${member.userId}:`,
          error
        );
      }
    }
  });

  return birthdayEvents;
};

const checkRequestStatus = async () => {
  checkingStatus.value = true;
  try {
    if (!pendingFamilyId.value) {
      showToast("No pending request found", "error");
      return;
    }

    const familyDoc = await getDoc(doc(db, "families", pendingFamilyId.value));
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const isMember = familyData.members?.some(
        (member) => member.userId === authStore.userId
      );

      if (isMember) {
        await updateDoc(doc(db, "users", authStore.userId), {
          status: "active",
          updatedAt: new Date(),
        });

        authStore.status = "active";
        hasPendingJoinRequest.value = false;

        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast("Your request is still pending approval.", "error");
      }
    }
  } catch (error) {
    console.error("Error checking request status:", error);
    showToast("Failed to check request status", "error");
  } finally {
    checkingStatus.value = false;
  }
};

const cancelJoinRequest = async () => {
  if (
    !confirm(
      "Are you sure you want to cancel your join request? You'll need to request to join again if you change your mind."
    )
  ) {
    return;
  }

  cancelingRequest.value = true;
  try {
    const requestsQuery = query(
      collection(db, `families/${pendingFamilyId.value}/requests`),
      where("userId", "==", authStore.userId)
    );
    const querySnapshot = await getDocs(requestsQuery);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: null,
      familyName: null,
      status: null,
      updatedAt: new Date(),
    });

    authStore.familyId = null;
    authStore.familyName = null;
    authStore.status = null;
    hasPendingJoinRequest.value = false;
    pendingFamilyId.value = "";
    pendingFamilyName.value = "";

    showToast("Join request canceled successfully", "success");
  } catch (error) {
    console.error("Error canceling join request:", error);
    showToast("Failed to cancel join request", "error");
  } finally {
    cancelingRequest.value = false;
  }
};

const fetchJoinRequests = async () => {
  if (authStore.permissions.role === "admin" && authStore.familyId) {
    try {
      const querySnapshot = await getDocs(
        collection(db, `families/${authStore.familyId}/requests`)
      );
      joinRequests.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching join requests:", error);
      showToast("Failed to fetch join requests", "error");
    }
  }
};

const approveRequest = async (requestId, userId, email) => {
  try {
    await updateDoc(doc(db, "families", authStore.familyId), {
      members: arrayUnion({ userId, role: "member", email }),
    });
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    await fetchJoinRequests();
    showToast("Request approved successfully", "success");
  } catch (error) {
    console.error("Error approving request:", error);
    showToast("Failed to approve request: " + error.message, "error");
  }
};

const denyRequest = async (requestId) => {
  try {
    await deleteDoc(
      doc(db, `families/${authStore.familyId}/requests`, requestId)
    );
    await fetchJoinRequests();
    showToast("Request denied successfully", "success");
  } catch (error) {
    console.error("Error denying request:", error);
    showToast("Failed to deny request", "error");
  }
};

const generateInviteLink = async () => {
  if (authStore.permissions.role !== "admin") {
    showToast("Only admins can generate invite links", "error");
    return;
  }
  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      authStore.familyId,
      authStore.familyName,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
  } catch (error) {
    console.error("Error generating invite link:", error);
    showToast("Failed to generate invite link: " + error.message, "error");
  } finally {
    generatingInvite.value = false;
  }
};

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    copyButtonText.value = "Copied!";
    setTimeout(() => {
      copyButtonText.value = "Copy";
    }, 2000);
  } catch (error) {
    console.error("Error copying invite link:", error);
    showToast("Failed to copy invite link", "error");
  }
};

const goToUserProfile = (userId) => {
  router.push(`/user/${userId}`);
};

const goToConversation = (userId) => {
  router.push(`/messages/${userId}`);
};

const fetchRecentConversations = async () => {
  if (!authStore.familyId) return;

  try {
    const { getAllConversations } = await import("~/utils/firebase");
    recentConversations.value = await getAllConversations();
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const checkForPendingRequests = async () => {
  if (!authStore.userId || authStore.familyId) return;

  try {
    if (authStore.familyId && authStore.status !== "active") {
      hasPendingJoinRequest.value = true;
      pendingFamilyId.value = authStore.familyId;

      try {
        const familyDoc = await getDoc(doc(db, "families", authStore.familyId));
        if (familyDoc.exists()) {
          pendingFamilyName.value = familyDoc.data().name || "Unknown Family";
        }
      } catch (error) {
        console.error("Error fetching family name:", error);
        pendingFamilyName.value = "Unknown Family";
      }
    }
  } catch (error) {
    console.error("Error checking for pending requests:", error);
  }
};

onMounted(async () => {
  try {
    await authStore.initAuth();
    if (!authStore.isInitialized) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (!authStore.familyId || authStore.status !== "active") {
      await checkForPendingRequests();
    }

    await authStore.loadFamilyMembers();
    await fetchJoinRequests();

    if (authStore.familyId && authStore.status === "active") {
      await refreshEvents();
      await fetchRecentConversations();
    }
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    showToast("Failed to load dashboard", "error");
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: "FamilySpace - Dashboard",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
