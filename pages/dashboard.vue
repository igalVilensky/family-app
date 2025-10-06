<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="relative w-20 h-20 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Loading your dashboard...
        </h2>
        <p class="text-gray-600">Please wait a moment</p>
      </div>
    </div>

    <!-- Header -->
    <header
      class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-home text-white text-lg"></i>
            </div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent"
            >
              FamilySpace
            </h1>
          </div>
          <div class="flex items-center gap-4">
            <!-- Support Links -->
            <div class="hidden sm:flex items-center gap-4">
              <NuxtLink
                to="/help"
                class="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Help
              </NuxtLink>
              <NuxtLink
                to="/support"
                class="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Support
              </NuxtLink>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              <i class="fas fa-sign-out-alt text-sm"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- User Profile Card -->
        <div
          class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 hover:shadow-md transition-all duration-300"
        >
          <div
            class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
          >
            <NuxtLink to="/profile" class="group flex-shrink-0">
              <div class="relative">
                <avatar
                  :avatar-url="authStore.avatarUrl"
                  :user-initial="userInitial"
                  :size="96"
                  :no-upload="true"
                  class="hover:ring-4 hover:ring-blue-100 transition-all duration-300 rounded-2xl group-hover:scale-105"
                />
                <div
                  class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
                >
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            </NuxtLink>

            <div class="flex-1">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {{ authStore.name || "User" }}! 👋
              </h2>
              <div
                class="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-4"
              >
                <i class="fas fa-users text-sm"></i>
                <span class="text-lg">
                  {{
                    authStore.familyName !== null
                      ? authStore.familyRole
                      : "Pending member"
                  }}
                  of {{ authStore.familyName || "Your Family" }}
                </span>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink
                  to="/profile"
                  class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 min-w-[160px]"
                >
                  <i class="fas fa-user-edit text-sm"></i>
                  Edit Profile
                </NuxtLink>

                <NuxtLink
                  v-if="authStore.familyId"
                  :to="`/family/${authStore.familyId}`"
                  class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 min-w-[160px]"
                >
                  <i class="fas fa-eye text-sm"></i>
                  View Family
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Today's Overview
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-calendar-day text-blue-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-700"
                  >Today's Events</span
                >
              </div>
              <span class="text-xl font-bold text-gray-900">{{
                todaysEventsCount
              }}</span>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-birthday-cake text-green-600"></i>
                </div>
                <span class="text-sm font-medium text-gray-700"
                  >Upcoming Birthdays</span
                >
              </div>
              <span class="text-xl font-bold text-gray-900">{{
                upcomingBirthdaysCount
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Pending Join Request Status -->
      <div
        v-if="hasPendingJoinRequest && !authStore.familyId"
        class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 animate-fadeIn"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="fas fa-clock text-amber-600 text-xl"></i>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-amber-900 mb-1">
              Join Request Pending Approval
            </h3>
            <p class="text-amber-700 text-sm mb-3">
              Your request to join <strong>{{ pendingFamilyName }}</strong> is
              waiting for admin approval. The family admin will review your
              request soon.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="checkRequestStatus"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="checkingStatus"
              >
                <i
                  class="fas fa-sync-alt text-sm"
                  :class="{ 'animate-spin': checkingStatus }"
                ></i>
                {{ checkingStatus ? "Checking..." : "Check Status" }}
              </button>
              <button
                @click="cancelJoinRequest"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="cancelingRequest"
              >
                <i
                  class="fas fa-times text-sm"
                  :class="{ 'animate-spin': cancelingRequest }"
                ></i>
                {{ cancelingRequest ? "Canceling..." : "Cancel Request" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Quick Actions -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-bolt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <p class="text-gray-500 text-sm">Manage your family space</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink
                v-if="!authStore.familyId"
                to="/family-setup"
                class="group p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
              >
                <div
                  class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-plus-circle text-lg"></i>
                </div>
                <div>
                  <div class="font-semibold">Set Up Family</div>
                  <div class="text-white/80 text-sm">
                    Create your family space
                  </div>
                </div>
              </NuxtLink>

              <NuxtLink
                v-if="authStore.familyId"
                to="/calendar"
                class="group p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
              >
                <div
                  class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-calendar-days text-lg"></i>
                </div>
                <div>
                  <div class="font-semibold">View Calendar</div>
                  <div class="text-white/80 text-sm">Check upcoming events</div>
                </div>
              </NuxtLink>

              <NuxtLink
                v-if="authStore.familyId"
                :to="`/family/${authStore.familyId}`"
                class="group p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
              >
                <div
                  class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-home text-lg"></i>
                </div>
                <div>
                  <div class="font-semibold">Family Profile</div>
                  <div class="text-white/80 text-sm">
                    Manage family settings
                  </div>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/profile"
                class="group p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
              >
                <div
                  class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-user-cog text-lg"></i>
                </div>
                <div>
                  <div class="font-semibold">Settings</div>
                  <div class="text-white/80 text-sm">Update your profile</div>
                </div>
              </NuxtLink>

              <!-- Support Links for Mobile -->
              <div
                class="md:hidden grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200"
              >
                <NuxtLink
                  to="/help"
                  class="group p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
                >
                  <div
                    class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-book-open text-lg"></i>
                  </div>
                  <div>
                    <div class="font-semibold">Help Center</div>
                    <div class="text-white/80 text-sm">Guides & tutorials</div>
                  </div>
                </NuxtLink>

                <NuxtLink
                  to="/support"
                  class="group p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-4"
                >
                  <div
                    class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-headset text-lg"></i>
                  </div>
                  <div>
                    <div class="font-semibold">Support</div>
                    <div class="text-white/80 text-sm">Get help</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Calendar Overview -->
          <div
            v-if="authStore.familyId && authStore.status === 'active'"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-calendar-alt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Calendar Overview
                </h3>
                <p class="text-gray-500 text-sm">
                  Your family's schedule at a glance
                </p>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon="calendar-check"
                :value="events.length"
                label="Total Events"
                color="blue"
              />
              <StatCard
                icon="users"
                :value="familyMembers.length"
                label="Family Members"
                color="green"
              />
              <StatCard
                icon="clock"
                :value="upcomingCount"
                label="Upcoming"
                color="amber"
              />
              <StatCard
                icon="check-circle"
                :value="confirmedCount"
                label="Confirmed"
                color="purple"
              />
            </div>

            <!-- Birthday Progress -->
            <div
              class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-6 border border-pink-100"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <i class="fas fa-birthday-cake text-pink-600"></i>
                  <span class="font-semibold text-gray-900"
                    >Birthday Setup Progress</span
                  >
                </div>
                <span class="text-sm font-medium text-gray-700">
                  {{ membersWithBirthdays.length }}/{{ familyMembers.length }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-500"
                  :style="{
                    width: `${
                      (membersWithBirthdays.length / familyMembers.length) * 100
                    }%`,
                  }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span
                  >{{
                    familyMembers.length - membersWithBirthdays.length
                  }}
                  missing</span
                >
                <span
                  >{{
                    Math.round(
                      (membersWithBirthdays.length / familyMembers.length) * 100
                    )
                  }}% complete</span
                >
              </div>
            </div>
          </div>

          <!-- Parent Only Sections -->
          <div
            v-if="authStore.permissions.role === 'admin' && authStore.familyId"
            class="space-y-6"
          >
            <!-- Invite Management -->
            <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-user-plus text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">
                    Invite Family Members
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Share invite link with family
                  </p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="generatingInvite"
              >
                <i
                  class="fas fa-link text-sm"
                  :class="{ 'animate-spin': generatingInvite }"
                ></i>
                {{
                  generatingInvite ? "Generating..." : "Generate Invite Link"
                }}
              </button>

              <div
                v-if="inviteLink"
                class="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Share this link to invite members:
                </label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    <i class="fas fa-copy text-sm"></i>
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Join Requests -->
            <div
              v-if="joinRequests.length"
              class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-user-clock text-white text-lg"></i>
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-gray-900 flex items-center gap-2"
                  >
                    Pending Join Requests
                    <span
                      class="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium"
                    >
                      {{ joinRequests.length }}
                    </span>
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Approve or deny family requests
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="request in joinRequests"
                  :key="request.id"
                  class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <i class="fas fa-user text-gray-600"></i>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">
                        {{ request.email }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Wants to join your family
                      </p>
                    </div>
                  </div>

                  <div class="flex gap-2 w-full sm:w-auto">
                    <button
                      @click="
                        approveRequest(
                          request.id,
                          request.userId,
                          request.email
                        )
                      "
                      class="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
                    >
                      <i class="fas fa-check text-sm"></i>
                      Approve
                    </button>
                    <button
                      @click="denyRequest(request.id)"
                      class="flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                    >
                      <i class="fas fa-times text-sm"></i>
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Pending Approval Status -->

          <div
            v-if="authStore.status === 'pending' && authStore.familyId"
            class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 animate-fadeIn"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-clock text-amber-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-amber-900 mb-1">
                  Join Request Pending Approval
                </h3>
                <p class="text-amber-700 text-sm mb-3">
                  Your request to join
                  <strong>{{ authStore.familyName }}</strong> is waiting for
                  admin approval. The family admin will review your request
                  soon.
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    @click="checkApprovalStatus"
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="checkingStatus"
                  >
                    <i
                      class="fas fa-sync-alt text-sm"
                      :class="{ 'animate-spin': checkingStatus }"
                    ></i>
                    {{ checkingStatus ? "Checking..." : "Check Status" }}
                  </button>
                  <button
                    @click="cancelJoinRequest"
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="cancelingRequest"
                  >
                    <i
                      class="fas fa-times text-sm"
                      :class="{ 'animate-spin': cancelingRequest }"
                    ></i>
                    {{ cancelingRequest ? "Canceling..." : "Cancel Request" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Upcoming Events -->
        <div class="space-y-8">
          <!-- Upcoming Events -->
          <div
            v-if="authStore.familyId && authStore.status === 'active'"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-fire text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <p class="text-gray-500 text-sm">Next 7 days</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="event in upcomingEvents"
                :key="event.id"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-2 h-12 bg-blue-500 rounded-full flex-shrink-0"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">
                      {{ event.title }}
                    </p>
                    <p class="text-sm text-gray-500">
                      <i class="fas fa-clock text-xs mr-1"></i>
                      {{ formatEventDate(event.startDate) }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-if="upcomingEvents.length === 0"
                class="text-center py-8 text-gray-500"
              >
                <i class="fas fa-calendar-plus text-3xl mb-3 text-gray-300"></i>
                <p class="font-medium">No upcoming events</p>
                <p class="text-sm">Events in the next week will appear here</p>
              </div>
            </div>
          </div>

          <!-- Family Members -->
          <div
            v-if="authStore.familyId"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-users text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Family Members
                </h3>
                <p class="text-gray-500 text-sm">
                  {{ familyMembers.length }} people
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="member in familyMembers.slice(0, 5)"
                :key="member.userId"
                class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-sm font-medium text-blue-600">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate text-sm">
                    {{ member.name || member.email }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ member.role }}
                  </p>
                </div>
              </div>

              <NuxtLink
                v-if="familyMembers.length > 5"
                :to="`/family/${authStore.familyId}`"
                class="block text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all {{ familyMembers.length }} members
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
import Avatar from "~/components/Avatar.vue";

// Reusable Stat Card Component
const StatCard = {
  props: ["icon", "value", "label", "color"],
  setup(props) {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      amber: "bg-amber-100 text-amber-600",
      purple: "bg-purple-100 text-purple-600",
      pink: "bg-pink-100 text-pink-600",
    };

    return { colorClasses };
  },
  template: `
    <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow duration-200 border border-gray-200/60">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg flex-shrink-0" :class="colorClasses[color]">
          <i class="fas text-sm" :class="'fa-' + icon"></i>
        </div>
        <div class="min-w-0">
          <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
          <p class="text-xs text-gray-500 truncate">{{ label }}</p>
        </div>
      </div>
    </div>
  `,
};

// Reusable Toast Component
const ToastNotification = {
  props: ["show", "message", "type"],
  emits: ["hide"],
  setup(props, { emit }) {
    return { emit };
  },
  template: `
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200': type === 'success',
          'bg-red-50/95 text-red-800 border-red-200': type === 'error',
        }"
      >
        <div class="flex items-center gap-3">
          <i
            class="text-lg flex-shrink-0"
            :class="{
              'fas fa-check-circle text-green-500': type === 'success',
              'fas fa-exclamation-circle text-red-500': type === 'error',
            }"
          ></i>
          <p class="font-medium flex-1">{{ message }}</p>
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

const userHasPendingRequest = computed(() => {
  return hasPendingJoinRequest.value && !authStore.familyId;
});

const familyMembers = computed(() => authStore.familyMembers || []);
const membersWithBirthdays = computed(() =>
  familyMembers.value.filter((member) => member.birthday)
);

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const upcomingCount = computed(() => {
  return events.value.filter((e) => new Date(e.startDate) > new Date()).length;
});

const confirmedCount = computed(() => {
  return events.value.filter((e) => e.rsvps?.[authStore.userId] === "yes")
    .length;
});

const upcomingEvents = computed(() => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return events.value
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate >= now && eventDate <= nextWeek;
    })
    .slice(0, 5); // Limit to 5 events
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

const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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

const checkApprovalStatus = async () => {
  checkingStatus.value = true;
  try {
    const familyDoc = await getDoc(doc(db, "families", authStore.familyId));
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const isMember = familyData.members.some(
        (member) => member.userId === authStore.userId
      );

      if (isMember) {
        await updateDoc(doc(db, "users", authStore.userId), {
          role: "member",
          status: "active",
        });
        authStore.permissions.role = "member";
        authStore.status = "active";
        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );
      } else {
        showToast("Your request is still pending.", "error");
      }
    } else {
      showToast("Family not found. Please contact support.", "error");
    }
  } catch (error) {
    console.error("Error checking approval status:", error);
    showToast("Failed to check status: " + error.message, "error");
  } finally {
    checkingStatus.value = false;
  }
};

const checkForPendingRequests = async () => {
  if (!authStore.userId || authStore.familyId) return;

  try {
    // If user has a familyId but status is not active, they have a pending request
    if (authStore.familyId && authStore.status !== "active") {
      hasPendingJoinRequest.value = true;
      pendingFamilyId.value = authStore.familyId;

      // Get family name for display
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

const checkRequestStatus = async () => {
  checkingStatus.value = true;
  try {
    if (!pendingFamilyId.value) {
      showToast("No pending request found", "error");
      return;
    }

    // Check if the user has been added to the family members
    const familyDoc = await getDoc(doc(db, "families", pendingFamilyId.value));
    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const isMember = familyData.members?.some(
        (member) => member.userId === authStore.userId
      );

      if (isMember) {
        // User has been approved - update their status
        await updateDoc(doc(db, "users", authStore.userId), {
          status: "active",
          updatedAt: new Date(),
        });

        // Update auth store
        authStore.status = "active";
        hasPendingJoinRequest.value = false;

        showToast(
          "Your request has been approved! Welcome to the family.",
          "success"
        );

        // Refresh the page to show the new family data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast("Your request is still pending approval.", "info");
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
    // Remove user from family requests
    const requestsQuery = query(
      collection(db, `families/${pendingFamilyId.value}/requests`),
      where("userId", "==", authStore.userId)
    );
    const querySnapshot = await getDocs(requestsQuery);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Clear user's familyId
    await updateDoc(doc(db, "users", authStore.userId), {
      familyId: null,
      familyName: null,
      status: null,
      updatedAt: new Date(),
    });

    // Update auth store
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

const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    authStore.clearAuth();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
    showToast("Failed to log out", "error");
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
    console.error("Error approving request:", {
      errorCode: error.code,
      errorMessage: error.message,
      requestId,
      userId,
      familyId: authStore.familyId,
    });
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
    console.error("generateInviteLink: User is not an admin", {
      role: authStore.permissions.role,
      userId: authStore.userId,
    });
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

onMounted(async () => {
  try {
    await authStore.initAuth();
    if (!authStore.isInitialized) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    // Check for pending join requests if user doesn't have an active family
    if (!authStore.familyId || authStore.status !== "active") {
      await checkForPendingRequests();
    }

    await authStore.loadFamilyMembers();
    await fetchJoinRequests();

    if (authStore.familyId && authStore.status === "active") {
      await refreshEvents();
    }
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    showToast("Failed to load dashboard", "error");
  } finally {
    // Small delay for better UX
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
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
