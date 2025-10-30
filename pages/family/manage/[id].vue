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
              :to="`/family/${route.params.id}`"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i class="fas fa-arrow-left"></i>
              Back to Family
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
          </div>
        </div>
      </div>
    </div>

    <!-- Not Admin -->
    <div v-else-if="!isAdmin" class="max-w-2xl mx-auto px-4 py-16">
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-amber-300 p-8"
      >
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-6 shadow-lg"
          >
            <i class="fas fa-user-shield text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            Admin Access Required
          </h2>
          <p class="text-gray-600 mb-6 text-lg">
            You need to be an admin to manage family settings and members.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              :to="`/family/${route.params.id}`"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-rose-700 transition-all duration-200 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <i class="fas fa-home"></i>
              Back to Family
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
            >
              <i class="fas fa-grid"></i>
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Header -->
      <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-orange-200 p-6 md:p-8"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <i class="fas fa-cog text-white text-2xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl md:text-4xl font-bold text-gray-900 truncate">
                Manage {{ familyData?.name || "Family" }}
              </h1>
              <p class="text-gray-600 text-sm md:text-base font-medium">
                Family settings and member management
              </p>
            </div>
          </div>
          <NuxtLink
            :to="`/family/${route.params.id}`"
            class="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 transform hover:-translate-y-1 shadow-md"
          >
            <i class="fas fa-arrow-left"></i>
            Back to Family
          </NuxtLink>
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
            <i class="fas fa-user-shield text-emerald-600 text-xs"></i>
            <span class="font-semibold text-gray-800 text-xs"
              >{{ getAdminCount() }} Admins</span
            >
          </div>
          <div
            class="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 px-3 py-2 rounded-full shadow-sm border border-purple-200"
          >
            <i class="fas fa-calendar text-purple-600 text-xs"></i>
            <span class="font-semibold text-gray-800 text-xs">{{
              formatDateCompact(familyData?.createdAt)
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left Column - Member Management -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Member Management -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-emerald-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    Manage Members
                  </h3>
                  <p class="text-gray-600 text-sm font-medium">
                    Add, remove, or change roles
                  </p>
                </div>
              </div>
              <span
                class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-2xl shadow-md"
              >
                {{ familyData?.members?.length || 0 }}
              </span>
            </div>

            <div class="space-y-4">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
              >
                <div class="relative">
                  <div
                    class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                    :class="getRelationshipColor(member.relationship)"
                  >
                    <span class="text-white font-bold text-lg">
                      {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <!-- You Indicator -->
                  <div
                    v-if="member.userId === authStore.userId"
                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                  >
                    <i class="fas fa-check text-white text-[8px]"></i>
                  </div>
                  <!-- Admin Badge -->
                  <div
                    v-if="member.role === 'admin'"
                    class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                  >
                    <i class="fas fa-crown text-white text-[8px]"></i>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-2">
                    <h4 class="font-bold text-gray-900 truncate text-lg">
                      {{ getMemberDisplayName(member) }}
                    </h4>
                    <span
                      v-if="member.userId === authStore.userId"
                      class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      You
                    </span>
                  </div>
                  <p class="text-gray-600 truncate text-sm mb-2">
                    {{ member.email }}
                  </p>
                  <div class="flex items-center gap-2">
                    <i
                      class="text-xs"
                      :class="getRelationshipIcon(member.relationship)"
                    ></i>
                    <span class="text-xs font-medium text-gray-700">
                      {{ getRelationshipDisplay(member.relationship) }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-3 flex-shrink-0">
                  <select
                    :value="member.role"
                    @change="
                      updateMemberRole(member.userId, $event.target.value)
                    "
                    :disabled="member.userId === authStore.userId"
                    class="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    v-if="member.userId !== authStore.userId"
                    @click="removeMember(member.userId)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                    title="Remove member"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Invite Section -->
            <div class="mt-8 pt-6 border-t-2 border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <i class="fas fa-user-plus text-white text-lg"></i>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">
                    Invite Members
                  </h4>
                  <p class="text-gray-600 text-sm font-medium">
                    Share invite link with family
                  </p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                class="mt-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-300 shadow-md"
              >
                <label class="block text-sm font-bold text-purple-900 mb-3">
                  Share this invite link:
                </label>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md whitespace-nowrap"
                  >
                    <i class="fas fa-copy text-sm"></i>
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bulk Relationship Management -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-purple-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-lg"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    Relationship Management
                  </h3>
                  <p class="text-gray-600 text-sm font-medium">
                    Set relationships for family members
                  </p>
                </div>
              </div>
              <button
                @click="openBulkRelationshipModal"
                class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                <i class="fas fa-edit"></i>
                Bulk Edit Relationships
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="relationship in relationshipTypes"
                :key="relationship.value"
                class="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200"
              >
                <div class="flex items-center gap-3 mb-2">
                  <i :class="relationship.icon" class="text-lg"></i>
                  <span class="font-semibold text-gray-900">{{
                    relationship.label
                  }}</span>
                </div>
                <div class="text-2xl font-bold text-gray-900">
                  {{ getRelationshipCount(relationship.value) }}
                </div>
                <div class="text-xs text-gray-600 mt-1">members</div>
              </div>
            </div>

            <div
              class="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl"
              v-if="membersWithoutRelationships.length > 0"
            >
              <div class="flex items-center gap-3">
                <i class="fas fa-info-circle text-amber-600"></i>
                <div>
                  <h4 class="font-bold text-amber-900 text-sm mb-1">
                    Relationship Setup Needed
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
          </div>
        </div>

        <!-- Right Column - Settings -->
        <div class="space-y-6">
          <!-- Family Settings -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-rose-200 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <i class="fas fa-cog text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Family Settings</h3>
                <p class="text-gray-600 text-sm font-medium">
                  Manage your family
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-edit text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900">
                    Edit Family Name
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Update family display name
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"
                ></i>
              </button>

              <button
                @click="showTransferOwnership = true"
                class="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-exchange-alt text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900">
                    Transfer Ownership
                  </div>
                  <div class="text-xs text-gray-600 font-medium">
                    Transfer admin rights to another member
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-amber-500 transition-colors"
                ></i>
              </button>

              <button
                @click="showDeleteFamily = true"
                class="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border-2 border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-200 group"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                >
                  <i class="fas fa-trash text-white text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900">Delete Family</div>
                  <div class="text-xs text-gray-600 font-medium">
                    Permanently delete this family
                  </div>
                </div>
                <i
                  class="fas fa-chevron-right text-gray-400 group-hover:text-red-500 transition-colors"
                ></i>
              </button>
            </div>
          </div>

          <!-- Family Stats -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 p-6"
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

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-users text-white text-sm"></i>
                  </div>
                  <span class="font-semibold text-gray-800">Total Members</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  familyData?.members?.length || 0
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-user-shield text-white text-sm"></i>
                  </div>
                  <span class="font-semibold text-gray-800">Admins</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  getAdminCount()
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-user text-white text-sm"></i>
                  </div>
                  <span class="font-semibold text-gray-800">Members</span>
                </div>
                <span class="text-xl font-bold text-gray-900">{{
                  getMemberCount()
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <i class="fas fa-calendar text-white text-sm"></i>
                  </div>
                  <span class="font-semibold text-gray-800">Created</span>
                </div>
                <span class="text-sm font-bold text-gray-900">{{
                  formatDate(familyData?.createdAt)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Family Name Modal -->
    <div
      v-if="showEditFamilyName"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl border-2 border-blue-300 max-w-md w-full p-6"
      >
        <h3 class="text-xl font-bold text-gray-900 mb-4">Edit Family Name</h3>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Family Name
          </label>
          <input
            type="text"
            v-model="newFamilyName"
            placeholder="Enter family name"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
            @keyup.enter="updateFamilyName"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="showEditFamilyName = false"
            class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            @click="updateFamilyName"
            :disabled="!newFamilyName.trim()"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Name
          </button>
        </div>
      </div>
    </div>

    <!-- Transfer Ownership Modal -->
    <div
      v-if="showTransferOwnership"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl border-2 border-amber-300 max-w-md w-full p-6"
      >
        <h3 class="text-xl font-bold text-gray-900 mb-4">Transfer Ownership</h3>
        <p class="text-gray-600 mb-6">
          Select a member to transfer admin rights to. You will become a regular
          member.
        </p>

        <div class="space-y-3 mb-6 max-h-60 overflow-y-auto">
          <div
            v-for="member in familyData?.members?.filter(
              (m) => m.userId !== authStore.userId && m.role === 'member'
            )"
            :key="member.userId"
            class="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
            @click="selectedNewAdmin = member.userId"
          >
            <div
              class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-semibold"
            >
              {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900">
                {{ getMemberDisplayName(member) }}
              </div>
              <div class="text-sm text-gray-500">{{ member.email }}</div>
            </div>
            <div
              class="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center"
            >
              <div
                v-if="selectedNewAdmin === member.userId"
                class="w-2 h-2 bg-blue-600 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showTransferOwnership = false"
            class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            @click="transferOwnership"
            :disabled="!selectedNewAdmin"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Family Modal -->
    <div
      v-if="showDeleteFamily"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl border-2 border-red-300 max-w-md w-full p-6"
      >
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Family</h3>
          <p class="text-gray-600">
            This action cannot be undone. All family data will be permanently
            deleted.
          </p>
        </div>

        <div class="space-y-4">
          <div class="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="confirmDelete"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span class="text-sm text-red-800 font-medium">
                I understand this action cannot be undone
              </span>
            </label>
          </div>

          <div class="flex gap-3">
            <button
              @click="showDeleteFamily = false"
              class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="deleteFamily"
              :disabled="!confirmDelete"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Family
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Relationship Modal -->

    <div
      v-if="showBulkRelationship"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl border-2 border-purple-300 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div class="p-6 border-b-2 border-gray-200">
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Bulk Relationship Setup
          </h3>
          <p class="text-gray-600">
            Set relationships for each family member. Click Save All when
            finished.
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div
              v-for="member in familyData?.members"
              :key="member.userId"
              class="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200"
            >
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  :class="getRelationshipColor(member.relationship)"
                >
                  <span class="text-white font-bold text-sm">
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

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-2">
                  <h4 class="font-bold text-gray-900 truncate">
                    {{ getMemberDisplayName(member) }}
                  </h4>
                  <span
                    v-if="member.userId === authStore.userId"
                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    You
                  </span>
                </div>
                <p class="text-gray-600 truncate text-sm mb-2">
                  {{ member.email }}
                </p>
                <div class="text-xs text-gray-500" v-if="member.relationship">
                  Current: {{ getRelationshipDisplay(member.relationship) }}
                </div>
              </div>

              <div class="flex-shrink-0">
                <select
                  v-model="bulkRelationships[member.userId]"
                  class="px-3 py-2 border-2 border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[140px]"
                >
                  <option value="">Select relationship...</option>
                  <option
                    v-for="rel in relationshipTypes"
                    :key="rel.value"
                    :value="rel.value"
                  >
                    {{ rel.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t-2 border-gray-200 bg-gray-50">
          <div class="flex gap-3">
            <button
              @click="closeBulkRelationshipModal"
              class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="applyBulkRelationships"
              :disabled="!hasRelationshipChanges"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save All Relationships
            </button>
          </div>
        </div>
      </div>
    </div>

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
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
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
const showTransferOwnership = ref(false);
const showDeleteFamily = ref(false);
const selectedNewAdmin = ref(null);
const confirmDelete = ref(false);

// New UI State for bulk relationships and family name modal
const showEditFamilyName = ref(false);
const newFamilyName = ref("");
const showBulkRelationship = ref(false);
const bulkRelationship = ref("");
const selectedMembers = ref([]);
const bulkRelationships = ref({});

// Computed properties
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

const membersWithoutRelationships = computed(() => {
  return (
    familyData.value?.members?.filter((member) => !member.relationship) || []
  );
});

const relationshipTypes = computed(() => [
  { value: "parent_1", label: "Father", icon: "fas fa-male text-blue-500" },
  { value: "parent_2", label: "Mother", icon: "fas fa-female text-pink-500" },
  { value: "child", label: "Child", icon: "fas fa-child text-green-500" },
  {
    value: "spouse",
    label: "Spouse/Partner",
    icon: "fas fa-heart text-purple-500",
  },
]);

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
    grandparent: "Grandparent",
    sibling: "Sibling",
  };
  return relationshipMap[relationship] || "Relationship not set";
};

const getRelationshipIcon = (relationship) => {
  const iconMap = {
    parent_1: "fas fa-male text-blue-500",
    parent_2: "fas fa-female text-pink-500",
    child: "fas fa-child text-green-500",
    spouse: "fas fa-heart text-purple-500",
    grandparent: "fas fa-user-friends text-amber-500",
    sibling: "fas fa-users text-indigo-500",
  };
  return iconMap[relationship] || "fas fa-question-circle text-gray-400";
};

const getRelationshipColor = (relationship) => {
  const colorMap = {
    parent_1: "bg-gradient-to-br from-blue-500 to-indigo-600",
    parent_2: "bg-gradient-to-br from-pink-500 to-rose-600",
    child: "bg-gradient-to-br from-green-500 to-emerald-600",
    spouse: "bg-gradient-to-br from-purple-500 to-violet-600",
    grandparent: "bg-gradient-to-br from-amber-500 to-orange-600",
    sibling: "bg-gradient-to-br from-indigo-500 to-blue-600",
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

const getRelationshipCount = (relationship) => {
  return (
    familyData.value?.members?.filter((m) => m.relationship === relationship)
      .length || 0
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

const updateMemberRole = async (userId, newRole) => {
  try {
    const familyRef = doc(db, "families", currentFamilyId.value);
    const updatedMembers = familyData.value.members.map((member) =>
      member.userId === userId ? { ...member, role: newRole } : member
    );

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Update user document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`families.${currentFamilyId.value}.role`]: newRole,
    });

    familyData.value.members = updatedMembers;
    showToast("Member role updated successfully", "success");
  } catch (error) {
    console.error("Error updating member role:", error);
    showToast("Failed to update member role", "error");
  }
};

const removeMember = async (userId) => {
  if (
    !confirm("Are you sure you want to remove this member from the family?")
  ) {
    return;
  }

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);
    const userRef = doc(db, "users", userId);

    // Remove from family members
    const updatedMembers = familyData.value.members.filter(
      (member) => member.userId !== userId
    );
    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Remove family from user's families
    await updateDoc(userRef, {
      [`families.${currentFamilyId.value}`]: arrayRemove(),
    });

    familyData.value.members = updatedMembers;
    showToast("Member removed successfully", "success");
  } catch (error) {
    console.error("Error removing member:", error);
    showToast("Failed to remove member", "error");
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

const editFamilyName = () => {
  newFamilyName.value = familyData.value?.name || "";
  showEditFamilyName.value = true;
};

const updateFamilyName = async () => {
  if (!newFamilyName.value.trim()) return;

  try {
    await updateDoc(doc(db, "families", currentFamilyId.value), {
      name: newFamilyName.value.trim(),
      updatedAt: new Date(),
    });

    familyData.value.name = newFamilyName.value.trim();
    showEditFamilyName.value = false;
    newFamilyName.value = "";
    showToast("Family name updated successfully", "success");
  } catch (error) {
    console.error("Error updating family name:", error);
    showToast("Failed to update family name", "error");
  }
};

const transferOwnership = async () => {
  if (!selectedNewAdmin.value) return;

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);

    // Update roles in family
    const updatedMembers = familyData.value.members.map((member) => {
      if (member.userId === selectedNewAdmin.value) {
        return { ...member, role: "admin" };
      } else if (member.userId === authStore.userId) {
        return { ...member, role: "member" };
      }
      return member;
    });

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Update user documents
    const currentUserRef = doc(db, "users", authStore.userId);
    const newAdminRef = doc(db, "users", selectedNewAdmin.value);

    await updateDoc(currentUserRef, {
      [`families.${currentFamilyId.value}.role`]: "member",
    });

    await updateDoc(newAdminRef, {
      [`families.${currentFamilyId.value}.role`]: "admin",
    });

    familyData.value.members = updatedMembers;
    showTransferOwnership.value = false;
    selectedNewAdmin.value = null;
    showToast("Ownership transferred successfully", "success");

    // Refresh auth store to get updated role
    await authStore.initAuth();
  } catch (error) {
    console.error("Error transferring ownership:", error);
    showToast("Failed to transfer ownership", "error");
  }
};

const openBulkRelationshipModal = () => {
  // Initialize with current relationships
  bulkRelationships.value = {};
  familyData.value?.members?.forEach((member) => {
    bulkRelationships.value[member.userId] = member.relationship || "";
  });
  showBulkRelationship.value = true;
};

const closeBulkRelationshipModal = () => {
  showBulkRelationship.value = false;
  bulkRelationships.value = {};
};

const hasRelationshipChanges = computed(() => {
  if (!familyData.value?.members) return false;

  return familyData.value.members.some((member) => {
    const currentRelationship = member.relationship || "";
    const newRelationship = bulkRelationships.value[member.userId] || "";
    return currentRelationship !== newRelationship;
  });
});

const applyBulkRelationships = async () => {
  try {
    const familyRef = doc(db, "families", currentFamilyId.value);

    // Update members with new relationships
    const updatedMembers = familyData.value.members.map((member) => {
      const newRelationship = bulkRelationships.value[member.userId] || "";
      return {
        ...member,
        relationship: newRelationship,
      };
    });

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Update user documents
    const updatePromises = familyData.value.members.map(async (member) => {
      const newRelationship = bulkRelationships.value[member.userId] || "";
      const userRef = doc(db, "users", member.userId);
      await updateDoc(userRef, {
        [`families.${currentFamilyId.value}.relationship`]:
          newRelationship || null,
      });
    });

    await Promise.all(updatePromises);

    // Update local data
    familyData.value.members = updatedMembers;

    showBulkRelationship.value = false;
    bulkRelationships.value = {};

    showToast("All relationships updated successfully", "success");
  } catch (error) {
    console.error("Error updating bulk relationships:", error);
    showToast("Failed to update relationships", "error");
  }
};

const deleteFamily = async () => {
  if (!confirmDelete.value) return;

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);

    // Remove family from all members
    const updatePromises = familyData.value.members.map(async (member) => {
      const userRef = doc(db, "users", member.userId);
      await updateDoc(userRef, {
        [`families.${currentFamilyId.value}`]: arrayRemove(),
      });
    });

    await Promise.all(updatePromises);
    await deleteDoc(familyRef);

    showToast("Family deleted successfully", "success");
    showDeleteFamily.value = false;

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Error deleting family:", error);
    showToast("Failed to delete family", "error");
  }
};

// Bulk relationship methods
const toggleMemberSelection = (userId) => {
  const index = selectedMembers.value.indexOf(userId);
  if (index > -1) {
    selectedMembers.value.splice(index, 1);
  } else {
    selectedMembers.value.push(userId);
  }
};

const applyBulkRelationship = async () => {
  if (!bulkRelationship.value || selectedMembers.value.length === 0) return;

  try {
    const familyRef = doc(db, "families", currentFamilyId.value);
    const updatedMembers = familyData.value.members.map((member) => {
      if (selectedMembers.value.includes(member.userId)) {
        return { ...member, relationship: bulkRelationship.value };
      }
      return member;
    });

    await updateDoc(familyRef, {
      members: updatedMembers,
    });

    // Update user documents
    const updatePromises = selectedMembers.value.map(async (userId) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        [`families.${currentFamilyId.value}.relationship`]:
          bulkRelationship.value,
      });
    });

    await Promise.all(updatePromises);

    familyData.value.members = updatedMembers;
    showBulkRelationship.value = false;
    selectedMembers.value = [];
    bulkRelationship.value = "";

    showToast(
      `Relationship updated for ${updatePromises.length} members`,
      "success"
    );
  } catch (error) {
    console.error("Error updating bulk relationships:", error);
    showToast("Failed to update relationships", "error");
  }
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
  title: computed(() => `Manage - ${familyData.value?.name || "Family"}`),
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
    min-height: 100dvh;
  }
}
</style>
