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
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div
            class="absolute inset-0 border-3 border-orange-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-3 border-orange-500 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Loading Family</h2>
        <p class="text-sm text-gray-600">Gathering family details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
        <div class="text-center">
          <div
            class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-lg"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Family
          </h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              :to="`/family/${route.params.id}`"
              class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Family
            </NuxtLink>
            <button
              @click="fetchFamilyData"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Access Denied -->
    <div v-else-if="!hasAccess" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
        <div class="text-center">
          <div
            class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-lock text-amber-600 text-lg"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p class="text-gray-600 mb-6">
            You don't have access to this family. Please check if you're a
            member or request to join.
          </p>
          <NuxtLink
            to="/dashboard"
            class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Not Admin -->
    <div v-else-if="!isAdmin" class="max-w-2xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
        <div class="text-center">
          <div
            class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-user-shield text-amber-600 text-lg"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Admin Access Required
          </h2>
          <p class="text-gray-600 mb-6">
            You need to be an admin to manage family settings and members.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              :to="`/family/${route.params.id}`"
              class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Family
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Header - Fixed responsive layout -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-cog text-white text-sm sm:text-lg"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Manage {{ familyData?.name || "Family" }}
              </h1>
              <p class="text-gray-600 text-sm">
                Family settings and member management
              </p>
            </div>
          </div>
          <NuxtLink
            :to="`/family/${route.params.id}`"
            class="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors text-center sm:text-left"
          >
            Back to Family
          </NuxtLink>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            class="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-users text-blue-600"></i>
            <span class="font-medium text-gray-800"
              >{{ familyData?.members?.length || 0 }} Members</span
            >
          </div>
          <div
            class="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-user-shield text-emerald-600"></i>
            <span class="font-medium text-gray-800"
              >{{ getAdminCount() }} Admins</span
            >
          </div>
          <div
            class="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg text-xs"
          >
            <i class="fas fa-calendar text-purple-600"></i>
            <span class="font-medium text-gray-800">{{
              formatDateCompact(familyData?.createdAt)
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Left Column - Member Management -->
        <div class="xl:col-span-2 space-y-6">
          <!-- Member Management - Fixed responsive member cards -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Manage Members
                  </h3>
                  <p class="text-gray-600 text-sm">
                    Add, remove, or change roles
                  </p>
                </div>
              </div>
              <span
                class="px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-lg w-fit sm:w-auto"
              >
                {{ familyData?.members?.length || 0 }}
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <!-- Mobile Layout -->
                <div class="sm:hidden space-y-3">
                  <!-- Top Row: Avatar and Name -->
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <div
                        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        :class="getRelationshipColor(member.relationship)"
                      >
                        <span class="text-white font-medium text-sm">
                          {{
                            getMemberDisplayName(member).charAt(0).toUpperCase()
                          }}
                        </span>
                      </div>
                      <!-- You Indicator -->
                      <div
                        v-if="member.userId === authStore.userId"
                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center"
                      >
                        <i class="fas fa-check text-white text-[6px]"></i>
                      </div>
                      <!-- Admin Badge -->
                      <div
                        v-if="member.role === 'admin'"
                        class="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center"
                      >
                        <i class="fas fa-crown text-white text-[6px]"></i>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-medium text-gray-900 text-sm truncate">
                          {{ getMemberDisplayName(member) }}
                        </h4>
                        <span
                          v-if="member.userId === authStore.userId"
                          class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                        >
                          You
                        </span>
                      </div>
                      <p class="text-gray-600 truncate text-xs mt-1">
                        {{ member.email }}
                      </p>
                    </div>
                  </div>

                  <!-- Middle Row: Relationship -->
                  <div class="flex items-center gap-2">
                    <i
                      class="text-xs"
                      :class="getRelationshipIcon(member.relationship)"
                    ></i>
                    <span class="text-xs text-gray-700">
                      {{ getRelationshipDisplay(member.relationship) }}
                    </span>
                  </div>

                  <!-- Bottom Row: Actions -->
                  <div
                    class="flex items-center gap-2 pt-2 border-t border-gray-200"
                  >
                    <select
                      :value="member.role"
                      @change="
                        updateMemberRole(member.userId, $event.target.value)
                      "
                      :disabled="member.userId === authStore.userId"
                      class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      v-if="member.userId !== authStore.userId"
                      @click="removeMember(member.userId)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="Remove member"
                    >
                      <i class="fas fa-times text-sm"></i>
                    </button>
                  </div>
                </div>

                <!-- Desktop Layout -->
                <div class="hidden sm:flex sm:items-center sm:gap-3">
                  <div class="relative">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="getRelationshipColor(member.relationship)"
                    >
                      <span class="text-white font-medium text-sm">
                        {{
                          getMemberDisplayName(member).charAt(0).toUpperCase()
                        }}
                      </span>
                    </div>
                    <!-- You Indicator -->
                    <div
                      v-if="member.userId === authStore.userId"
                      class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center"
                    >
                      <i class="fas fa-check text-white text-[6px]"></i>
                    </div>
                    <!-- Admin Badge -->
                    <div
                      v-if="member.role === 'admin'"
                      class="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center"
                    >
                      <i class="fas fa-crown text-white text-[6px]"></i>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h4 class="font-medium text-gray-900 text-sm truncate">
                        {{ getMemberDisplayName(member) }}
                      </h4>
                      <span
                        v-if="member.userId === authStore.userId"
                        class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                      >
                        You
                      </span>
                    </div>
                    <p class="text-gray-600 truncate text-xs mb-1">
                      {{ member.email }}
                    </p>
                    <div class="flex items-center gap-1">
                      <i
                        class="text-xs"
                        :class="getRelationshipIcon(member.relationship)"
                      ></i>
                      <span class="text-xs text-gray-700">
                        {{ getRelationshipDisplay(member.relationship) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 flex-shrink-0">
                    <select
                      :value="member.role"
                      @change="
                        updateMemberRole(member.userId, $event.target.value)
                      "
                      :disabled="member.userId === authStore.userId"
                      class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      v-if="member.userId !== authStore.userId"
                      @click="removeMember(member.userId)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove member"
                    >
                      <i class="fas fa-times text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Invite Section -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-user-plus text-white text-xs"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Invite Members</h4>
                  <p class="text-gray-600 text-sm">
                    Share invite link with family
                  </p>
                </div>
              </div>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
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
                class="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <label class="block font-medium text-purple-900 text-sm mb-2">
                  Share this invite link:
                </label>
                <div class="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    :value="inviteLink"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm focus:ring-1 focus:ring-purple-500"
                    @click="$event.target.select()"
                  />
                  <button
                    @click="copyInviteLink"
                    class="px-4 py-2 bg-purple-500 text-white font-medium rounded hover:bg-purple-600 transition-colors whitespace-nowrap"
                  >
                    {{ copyButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Relationship Management - Fixed responsive header -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users-cog text-white text-sm"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Relationship Management
                  </h3>
                  <p class="text-gray-600 text-sm">
                    Set relationships for family members
                  </p>
                </div>
              </div>
              <button
                @click="openBulkRelationshipModal"
                class="w-full sm:w-auto px-3 py-2 bg-purple-500 text-white font-medium rounded hover:bg-purple-600 transition-colors text-sm"
              >
                Bulk Edit
              </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="relationship in relationshipTypes"
                :key="relationship.value"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex items-center gap-2 mb-1">
                  <i :class="relationship.icon" class="text-sm"></i>
                  <span class="font-medium text-gray-900 text-sm">{{
                    relationship.label
                  }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{ getRelationshipCount(relationship.value) }}
                </div>
                <div class="text-xs text-gray-600">members</div>
              </div>
            </div>

            <!-- Setup Alert -->
            <div
              class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
              v-if="membersWithoutRelationships.length > 0"
            >
              <div class="flex items-center gap-2">
                <i class="fas fa-info-circle text-amber-600 text-sm"></i>
                <div>
                  <h4 class="font-medium text-amber-900 text-sm">
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
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-cog text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Family Settings</h3>
                <p class="text-gray-600 text-sm">Manage your family</p>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="editFamilyName"
                class="w-full flex items-center gap-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-edit text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    Edit Family Name
                  </div>
                  <div class="text-gray-600 text-xs">
                    Update family display name
                  </div>
                </div>
              </button>

              <button
                @click="showTransferOwnership = true"
                class="w-full flex items-center gap-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-exchange-alt text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900 text-sm">
                    Transfer Ownership
                  </div>
                  <div class="text-gray-600 text-xs">
                    Transfer admin rights to another member
                  </div>
                </div>
              </button>

              <button
                @click="showDeleteFamily = true"
                class="w-full flex items-center gap-3 p-3 text-left bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-trash text-white text-xs"></i>
                </div>
                <div>
                  <div class="font-medium text-red-900 text-sm">
                    Delete Family
                  </div>
                  <div class="text-red-700 text-xs">
                    Permanently delete this family
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Family Stats -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-chart-bar text-white text-sm"></i>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Family Stats</h3>
                <p class="text-gray-600 text-sm">Overview</p>
              </div>
            </div>

            <div class="space-y-2">
              <div
                class="flex items-center justify-between p-2 bg-blue-50 rounded"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-users text-blue-600 text-sm"></i>
                  <span class="font-medium text-gray-800 text-sm"
                    >Total Members</span
                  >
                </div>
                <span class="font-semibold text-gray-900">{{
                  familyData?.members?.length || 0
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-2 bg-purple-50 rounded"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-user-shield text-purple-600 text-sm"></i>
                  <span class="font-medium text-gray-800 text-sm">Admins</span>
                </div>
                <span class="font-semibold text-gray-900">{{
                  getAdminCount()
                }}</span>
              </div>

              <div
                class="flex items-center justify-between p-2 bg-emerald-50 rounded"
              >
                <div class="flex items-center gap-2">
                  <i class="fas fa-user text-emerald-600 text-sm"></i>
                  <span class="font-medium text-gray-800 text-sm">Members</span>
                </div>
                <span class="font-semibold text-gray-900">{{
                  getMemberCount()
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals remain the same as previous version -->
    <!-- Edit Family Name Modal -->
    <div
      v-if="showEditFamilyName"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Edit Family Name
        </h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Family Name
          </label>
          <input
            type="text"
            v-model="newFamilyName"
            placeholder="Enter family name"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="updateFamilyName"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="showEditFamilyName = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="updateFamilyName"
            :disabled="!newFamilyName.trim()"
            class="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
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
        class="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Transfer Ownership
        </h3>
        <p class="text-gray-600 mb-4 text-sm">
          Select a member to transfer admin rights to. You will become a regular
          member.
        </p>

        <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
          <div
            v-for="member in familyData?.members?.filter(
              (m) => m.userId !== authStore.userId && m.role === 'member'
            )"
            :key="member.userId"
            class="flex items-center gap-3 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
            @click="selectedNewAdmin = member.userId"
          >
            <div
              class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-medium text-sm"
            >
              {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900 text-sm">
                {{ getMemberDisplayName(member) }}
              </div>
              <div class="text-gray-500 text-xs">{{ member.email }}</div>
            </div>
            <div
              class="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center"
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
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="transferOwnership"
            :disabled="!selectedNewAdmin"
            class="flex-1 px-4 py-2 bg-amber-500 text-white font-medium rounded hover:bg-amber-600 transition-colors disabled:opacity-50"
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
        class="bg-white rounded-xl shadow-lg border border-red-200 max-w-md w-full p-6"
      >
        <div class="text-center mb-4">
          <div
            class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-lg"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Delete Family
          </h3>
          <p class="text-gray-600 text-sm">
            This action cannot be undone. All family data will be permanently
            deleted.
          </p>
        </div>

        <div class="space-y-3">
          <div class="p-3 bg-red-50 border border-red-200 rounded">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="confirmDelete"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span class="text-red-800 text-sm font-medium">
                I understand this action cannot be undone
              </span>
            </label>
          </div>

          <div class="flex gap-3">
            <button
              @click="showDeleteFamily = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteFamily"
              :disabled="!confirmDelete"
              class="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors disabled:opacity-50"
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
        class="bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Bulk Relationship Setup
          </h3>
          <p class="text-gray-600 text-sm">
            Set relationships for each family member. Click Save All when
            finished.
          </p>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div class="space-y-3">
            <div
              v-for="member in familyData?.members"
              :key="member.userId"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="relative">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="getRelationshipColor(member.relationship)"
                >
                  <span class="text-white font-medium text-sm">
                    {{ getMemberDisplayName(member).charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div
                  v-if="member.userId === authStore.userId"
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center"
                >
                  <i class="fas fa-check text-white text-[6px]"></i>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h4 class="font-medium text-gray-900 text-sm truncate">
                    {{ getMemberDisplayName(member) }}
                  </h4>
                  <span
                    v-if="member.userId === authStore.userId"
                    class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                  >
                    You
                  </span>
                </div>
                <p class="text-gray-600 truncate text-xs mb-1">
                  {{ member.email }}
                </p>
                <div class="text-gray-500 text-xs" v-if="member.relationship">
                  Current: {{ getRelationshipDisplay(member.relationship) }}
                </div>
              </div>

              <div class="flex-shrink-0">
                <select
                  v-model="bulkRelationships[member.userId]"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 min-w-[140px]"
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

        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex gap-3">
            <button
              @click="closeBulkRelationshipModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="applyBulkRelationships"
              :disabled="!hasRelationshipChanges"
              class="flex-1 px-4 py-2 bg-purple-500 text-white font-medium rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
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
      class="fixed top-4 right-4 z-50 max-w-sm w-full px-4"
    >
      <div
        class="p-3 rounded-lg shadow-md border"
        :class="{
          'bg-green-50 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50 text-red-800 border-red-200': toastType === 'error',
        }"
      >
        <div class="flex items-center gap-2">
          <i
            class="text-sm"
            :class="{
              'fas fa-check-circle text-green-500': toastType === 'success',
              'fas fa-exclamation-circle text-red-500': toastType === 'error',
            }"
          ></i>
          <p class="font-medium text-sm flex-1">{{ toastMessage }}</p>
          <button
            @click="showToastMessage = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-sm"></i>
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
</style>
