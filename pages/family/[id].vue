<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div
            class="absolute inset-0 border-4 border-orange-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Loading Family
        </h2>
        <p class="text-sm md:text-base text-gray-600">
          Gathering family details...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-16">
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-red-200 p-8"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl mb-6 shadow-lg"
          >
            <i class="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            Unable to Load Family
          </h2>
          <p class="text-gray-600 mb-6 text-lg">{{ error }}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              v-if="!authStore.hasFamily"
              to="/family-setup"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i class="fas fa-plus"></i>
              Set Up Family
            </NuxtLink>
            <button
              @click="fetchFamilyData"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
            >
              <i class="fas fa-redo"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Access Denied -->
    <div v-else-if="!hasAccess" class="max-w-2xl mx-auto px-4 py-16">
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-amber-300 p-8"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg"
          >
            <i class="fas fa-lock text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
          <p class="text-gray-600 mb-6 text-lg">
            You don't have access to this family. Please check if you're a
            member or request to join.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i class="fas fa-home"></i>
              Back to Dashboard
            </NuxtLink>
            <NuxtLink
              to="/join-family"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
            >
              <i class="fas fa-search"></i>
              Find Families
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-8">
      <!-- Compact Family Header Card -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-6 md:p-8"
      >
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <i class="fas fa-home text-white text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl md:text-4xl font-bold text-gray-900 truncate">
              {{ familyData?.name || "Your Family" }}
            </h1>
            <p class="text-gray-600 text-sm md:text-base font-medium">
              Private family space
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm">
          <div
            class="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-full shadow-sm border border-blue-200"
          >
            <i class="fas fa-users text-blue-600 text-xs"></i>
            <span class="font-semibold text-gray-800 text-xs"
              >{{ familyData?.members?.length || 0 }} Members</span
            >
          </div>
          <div
            class="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-2 rounded-full shadow-sm border border-emerald-200"
          >
            <i class="fas fa-calendar text-emerald-600 text-xs"></i>
            <span class="font-semibold text-gray-800 text-xs">{{
              formatDateCompact(familyData?.createdAt)
            }}</span>
          </div>
          <div
            v-if="userFamilyRole"
            class="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-2 rounded-full shadow-sm border border-purple-200"
          >
            <i class="fas fa-user-tag text-purple-600 text-xs"></i>
            <span class="font-semibold text-gray-800 text-xs capitalize">{{
              userFamilyRole
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left Column - Main Content -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Family Members - Mobile Optimized -->

          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-4 md:p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <i class="fas fa-users text-white text-lg md:text-xl"></i>
                </div>
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-gray-900">
                    Family Members
                  </h3>
                  <p class="text-gray-600 text-sm font-medium">
                    Your family circle
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl md:rounded-2xl shadow-md"
                >
                  {{ familyData?.members?.length || 0 }}
                </span>
              </div>
            </div>

            <!-- Relationship Setup Alert -->
            <div
              v-if="membersWithoutRelationships.length > 0"
              class="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-4"
            >
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                  <i class="fas fa-info-circle text-amber-600 text-lg"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-amber-900 text-sm mb-1">
                    Complete Family Setup
                  </h4>
                  <p class="text-amber-800 text-xs">
                    {{ membersWithoutRelationships.length }} member{{
                      membersWithoutRelationships.length !== 1 ? "s" : ""
                    }}
                    need relationship setup.
                  </p>
                </div>
              </div>
            </div>

            <!-- Mobile Optimized Members Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg cursor-pointer group relative"
                @click="goToUserProfile(member.userId)"
              >
                <!-- Admin Badge - Top Right Corner -->
                <div
                  v-if="member.role === 'admin'"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg z-10"
                >
                  <i class="fas fa-crown text-white text-xs"></i>
                </div>

                <!-- Avatar with You Indicator -->
                <div class="relative">
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200"
                    :class="getRelationshipColor(member.relationship)"
                  >
                    <span class="text-white font-bold text-base">
                      {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <!-- You Indicator -->
                  <div
                    v-if="member.userId === authStore.userId"
                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                  >
                    <i class="fas fa-check text-white text-[8px]"></i>
                  </div>
                </div>

                <!-- Member Info -->
                <div class="flex-1 min-w-0">
                  <div class="mb-1">
                    <h4
                      class="font-bold text-gray-900 truncate text-sm group-hover:text-orange-600 transition-colors"
                    >
                      {{ getMemberDisplayName(member) }}
                    </h4>
                  </div>

                  <!-- Email -->
                  <p class="text-gray-600 text-xs truncate font-medium mb-2">
                    {{ member.email }}
                  </p>

                  <!-- Relationship -->
                  <div class="flex items-center gap-2">
                    <i
                      class="text-xs"
                      :class="getRelationshipIcon(member.relationship)"
                    ></i>
                    <span class="text-xs font-medium text-gray-700 truncate">
                      {{ getRelationshipDisplay(member.relationship) }}
                    </span>
                    <span
                      v-if="!member.relationship"
                      class="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium flex-shrink-0"
                    >
                      Needs Setup
                    </span>
                  </div>
                </div>

                <!-- Chevron - Centered on Right -->
                <div class="flex-shrink-0">
                  <i
                    class="fas fa-chevron-right text-gray-400 text-sm group-hover:text-orange-500 transition-colors transform group-hover:translate-x-0.5"
                  ></i>
                </div>
              </div>
            </div>

            <!-- Invite Section (Admins Only) -->
            <div v-if="isAdmin" class="mt-6 pt-6 border-t-2 border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <i
                    class="fas fa-user-plus text-white text-sm md:text-base"
                  ></i>
                </div>
                <div>
                  <h4 class="text-lg md:text-xl font-bold text-gray-900">
                    Invite Members
                  </h4>
                  <p class="text-gray-600 text-sm font-medium">
                    Share invite link
                  </p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold rounded-xl md:rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="generatingInvite"
              >
                <i
                  class="fas fa-link text-sm"
                  :class="{ 'animate-spin': generatingInvite }"
                ></i>
                <span class="text-sm md:text-base">
                  {{
                    generatingInvite ? "Generating..." : "Generate Invite Link"
                  }}
                </span>
              </button>

              <div
                v-if="inviteLink"
                class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl md:rounded-2xl border-2 border-purple-300 shadow-md"
              >
                <label
                  class="block text-sm md:text-base font-bold text-purple-900 mb-2"
                >
                  Share this invite link:
                </label>
                <div class="flex flex-col gap-2">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
                  >
                    <i class="fas fa-copy text-xs"></i>
                    <span class="text-sm">{{ copyButtonText }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Updated Coming Soon Banner -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-300 p-6 shadow-lg"
          >
            <div class="text-center">
              <div
                class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-xl"
              >
                <i class="fas fa-rocket text-white text-xl"></i>
              </div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Family Timeline Coming Soon!
              </h3>
              <p class="text-gray-600 mb-6 text-sm md:text-base font-medium">
                We're building a beautiful family timeline to capture and share
                your most precious memories and milestones together.
              </p>
              <div
                class="flex flex-wrap items-center justify-center gap-3 text-sm"
              >
                <div
                  class="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-blue-200"
                >
                  <i class="fas fa-sitemap text-blue-500"></i>
                  <span class="font-semibold text-gray-800">Family Tree</span>
                </div>
                <div
                  class="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-emerald-200"
                >
                  <i class="fas fa-images text-emerald-500"></i>
                  <span class="font-semibold text-gray-800">Memory Album</span>
                </div>
                <div
                  class="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-purple-200"
                >
                  <i class="fas fa-history text-purple-500"></i>
                  <span class="font-semibold text-gray-800">Timeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Family Stats -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-4 md:p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <i class="fas fa-chart-bar text-white"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Family Stats</h3>
                <p class="text-gray-600 text-sm font-medium">Overview</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-users text-white text-xs"></i>
                  </div>
                  <span class="font-semibold text-gray-800 text-sm"
                    >Total Members</span
                  >
                </div>
                <span class="text-lg font-bold text-gray-900">{{
                  familyData?.members?.length || 0
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-heart text-white text-xs"></i>
                  </div>
                  <span class="font-semibold text-gray-800 text-sm"
                    >Relationships Set</span
                  >
                </div>
                <span class="text-lg font-bold text-gray-900"
                  >{{ membersWithRelationships.length }}/{{
                    familyData?.members?.length || 0
                  }}</span
                >
              </div>

              <div
                class="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-user text-white text-xs"></i>
                  </div>
                  <span class="font-semibold text-gray-800 text-sm"
                    >Members</span
                  >
                </div>
                <span class="text-lg font-bold text-gray-900">{{
                  getMemberCount()
                }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-amber-200 p-4 md:p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <i class="fas fa-bolt text-white"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
                <p class="text-gray-600 text-sm font-medium">Family tools</p>
              </div>
            </div>

            <div class="space-y-3">
              <NuxtLink
                to="/calendar"
                class="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-calendar-alt text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm">
                    View Calendar
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    See upcoming events
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 text-xs group-hover:text-blue-500 transition-colors"
                ></i>
              </NuxtLink>

              <button
                v-if="isAdmin && membersWithoutRelationships.length > 0"
                @click="showRelationshipSetupHelp"
                class="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm">
                    Setup Relationships
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Complete family setup
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 text-xs group-hover:text-amber-500 transition-colors"
                ></i>
              </button>

              <button
                class="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl border border-gray-300 transition-all duration-200 group opacity-60 cursor-not-allowed"
                disabled
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-sitemap text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-400 text-sm">
                    Family Tree
                  </div>
                  <div class="text-xs text-gray-400 font-medium">
                    Coming soon
                  </div>
                </div>
                <i class="fas fa-lock text-gray-300 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Settings (Admins Only) -->
          <div
            v-if="isAdmin"
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-rose-200 p-4 md:p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <i class="fas fa-cog text-white"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Family Settings</h3>
                <p class="text-gray-600 text-sm font-medium">
                  Manage your family
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-edit text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm">
                    Edit Family Name
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Update display name
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 text-xs group-hover:text-blue-500 transition-colors"
                ></i>
              </button>

              <NuxtLink
                :to="`/family/manage/${route.params.id}`"
                class="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm">
                    Manage Members
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Add, remove, or change roles
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 text-xs group-hover:text-emerald-500 transition-colors"
                ></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-2xl shadow-xl border-2 backdrop-blur-sm"
        :class="{
          'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300':
            toastType === 'success',
          'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300':
            toastType === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-semibold flex-1 text-sm">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "~/stores/auth";
import { useNuxtApp } from "#app";
import { generateInvite } from "~/utils/firebase";

const { $firestore: db } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Data
const familyData = ref(null);
const loading = ref(true);
const error = ref("");

// UI State
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");

// Computed properties for multi-family support
const currentFamilyId = computed(() => route.params.id);
const hasAccess = computed(() => {
  if (!currentFamilyId.value || !authStore.families) return false;
  return currentFamilyId.value in authStore.families;
});

const userFamilyRole = computed(() => {
  if (!hasAccess.value) return null;
  return authStore.families[currentFamilyId.value]?.role || "member";
});

const isAdmin = computed(() => {
  return userFamilyRole.value === "admin";
});

const membersWithRelationships = computed(() => {
  return (
    familyData.value?.members?.filter((member) => member.relationship) || []
  );
});

const membersWithoutRelationships = computed(() => {
  return (
    familyData.value?.members?.filter((member) => !member.relationship) || []
  );
});

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 3000);
};

const fetchFamilyData = async () => {
  try {
    loading.value = true;
    error.value = "";

    const familyId = currentFamilyId.value;

    if (!familyId || familyId === "null") {
      error.value = "No family specified.";
      return;
    }

    // Check if user has access to this family
    if (!hasAccess.value) {
      error.value = "You don't have access to this family.";
      loading.value = false;
      return;
    }

    const docRef = doc(db, "families", familyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      familyData.value = docSnap.data();
    } else {
      error.value = "Family not found";
    }
  } catch (err) {
    const errorMessage =
      err?.message || err?.toString() || "An unknown error occurred";
    error.value = "Failed to load family data: " + errorMessage;
    console.error("Error fetching family data:", err);
  } finally {
    loading.value = false;
  }
};

const getMemberDisplayName = (member) => {
  if (member.name) return member.name;
  if (member.email) return member.email.split("@")[0];
  return "Unknown Member";
};

// Relationship display functions
const getRelationshipDisplay = (relationship) => {
  const relationshipMap = {
    parent_1: "Father",
    parent_2: "Mother",
    child: "Child",
    spouse: "Spouse/Partner",
  };
  return relationshipMap[relationship] || "Relationship not set";
};

const getRelationshipIcon = (relationship) => {
  const iconMap = {
    parent_1: "fas fa-male text-blue-500",
    parent_2: "fas fa-female text-pink-500",
    child: "fas fa-child text-green-500",
    spouse: "fas fa-heart text-purple-500",
  };
  return iconMap[relationship] || "fas fa-question-circle text-gray-400";
};

const getRelationshipColor = (relationship) => {
  const colorMap = {
    parent_1: "bg-gradient-to-br from-blue-500 to-indigo-600",
    parent_2: "bg-gradient-to-br from-pink-500 to-rose-600",
    child: "bg-gradient-to-br from-green-500 to-emerald-600",
    spouse: "bg-gradient-to-br from-purple-500 to-violet-600",
  };
  return (
    colorMap[relationship] || "bg-gradient-to-br from-gray-500 to-gray-600"
  );
};

const getAdminCount = () => {
  return (
    familyData.value?.members?.filter((m) => m.role === "admin").length || 0
  );
};

const getMemberCount = () => {
  return (
    familyData.value?.members?.filter((m) => m.role === "member").length || 0
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

// New compact date format for mobile
const formatDateCompact = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

const goToUserProfile = (userId) => {
  if (userId === authStore.userId) {
    router.push("/profile");
  } else {
    router.push(`/user/${userId}`);
  }
};

const generateInviteLink = async () => {
  if (!isAdmin.value) {
    showToast("Only admins can generate invite links", "error");
    return;
  }

  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      currentFamilyId.value,
      familyData.value?.name,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
    showToast("Invite link generated successfully", "success");
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
    showToast("Invite link copied to clipboard", "success");
    setTimeout(() => {
      copyButtonText.value = "Copy";
    }, 2000);
  } catch (error) {
    console.error("Error copying invite link:", error);
    showToast("Failed to copy invite link", "error");
  }
};

const editFamilyName = async () => {
  const newName = prompt(
    "Enter new family name:",
    familyData.value?.name || ""
  );
  if (!newName || newName.trim() === "") return;

  try {
    await updateDoc(doc(db, "families", currentFamilyId.value), {
      name: newName.trim(),
      updatedAt: new Date(),
    });

    familyData.value.name = newName.trim();
    showToast("Family name updated successfully", "success");
  } catch (error) {
    console.error("Error updating family name:", error);
    showToast("Failed to update family name", "error");
  }
};

const showRelationshipSetupHelp = () => {
  showToast(
    "To setup relationships, ask members to update their profiles or contact support for assistance.",
    "info"
  );
};

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.hasFamily) {
    router.push("/family-setup");
    return;
  }

  await fetchFamilyData();
});

useHead({
  title: computed(
    () => `FamilySpace - ${familyData.value?.name || "Family Profile"}`
  ),
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

/* Improved mobile touch targets */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
}
</style>
