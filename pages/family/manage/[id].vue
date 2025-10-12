<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="relative w-16 h-16 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-blue-200 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="text-gray-600">Loading family data...</p>
      </div>
    </div>

    <!-- Access Denied -->
    <div
      v-else-if="!isAdmin"
      class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p class="text-gray-600 mb-6">
            Only family admins can access this page.
          </p>
          <NuxtLink
            :to="`/family/${familyId}`"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            <i class="fas fa-home text-sm"></i>
            Return to Family
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="max-w-7xl mx-auto px-4 py-8 pb-20 sm:pb-8">
      <!-- Family Header -->
      <div
        class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-8 mb-4 sm:mb-8"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3 sm:gap-4">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-users-cog text-white text-lg sm:text-2xl"></i>
            </div>
            <div>
              <h2
                class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900"
              >
                {{ familyData?.name || "Family Management" }}
              </h2>
              <p class="text-sm sm:text-base text-gray-600 mt-1">
                Manage your family members and settings
              </p>
            </div>
          </div>
          <div
            class="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-full self-end sm:self-auto"
          >
            <i class="fas fa-users text-blue-600 text-sm"></i>
            <span class="font-semibold text-blue-700 text-sm sm:text-base">
              {{ familyData?.members?.length || 0 }} Members
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <!-- Left Column - Member Management -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-8">
          <!-- Member List -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
                >
                  <i class="fas fa-users text-white text-base sm:text-lg"></i>
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                    Family Members
                  </h3>
                  <p class="text-gray-500 text-xs sm:text-sm">
                    Manage member roles
                  </p>
                </div>
              </div>
              <span
                class="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full font-semibold"
              >
                {{ familyData?.members?.length || 0 }}
              </span>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div
                v-for="member in familyData?.members"
                :key="member.userId"
                class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200"
              >
                <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div class="relative flex-shrink-0">
                    <div
                      class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                    >
                      <span
                        class="text-white font-semibold text-sm sm:text-base"
                      >
                        {{ getMemberInitial(member) }}
                      </span>
                    </div>
                    <div
                      v-if="member.userId === authStore.userId"
                      class="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <i
                        class="fas fa-check text-white text-[8px] sm:text-xs"
                      ></i>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div
                      class="flex items-center gap-2 flex-wrap mb-0.5 sm:mb-1"
                    >
                      <h4
                        class="font-semibold text-gray-900 truncate text-sm sm:text-base"
                      >
                        {{ getMemberDisplayName(member) }}
                      </h4>
                      <span
                        v-if="member.userId === authStore.userId"
                        class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                      >
                        You
                      </span>
                    </div>
                    <p class="text-gray-600 truncate text-xs sm:text-sm">
                      {{ member.email }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2"
                >
                  <!-- Role Badge -->
                  <span
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap"
                    :class="{
                      'bg-gradient-to-r from-purple-500 to-indigo-600 text-white':
                        member.role === 'admin',
                      'bg-green-100 text-green-700': member.role === 'member',
                    }"
                  >
                    {{ member.role === "admin" ? "Admin" : "Member" }}
                  </span>

                  <!-- Action Menu Button -->
                  <button
                    v-if="member.userId !== authStore.userId"
                    @click.stop="openMemberActionsModal(member)"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <i class="fas fa-ellipsis-v text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="!familyData?.members?.length"
              class="text-center py-12 text-gray-500"
            >
              <i class="fas fa-users text-4xl mb-4 text-gray-300"></i>
              <p class="font-medium text-lg mb-2">No Members Yet</p>
              <p class="text-sm">Start by inviting family members to join.</p>
            </div>
          </div>

          <!-- Danger Zone -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-red-200 p-4 sm:p-6"
          >
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
              >
                <i
                  class="fas fa-exclamation-triangle text-white text-base sm:text-lg"
                ></i>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  Danger Zone
                </h3>
                <p class="text-gray-500 text-xs sm:text-sm">
                  Irreversible actions
                </p>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <!-- Leave Family -->
              <div
                v-if="!isLastAdmin"
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 text-sm sm:text-base">
                    Leave Family
                  </h4>
                  <p class="text-xs sm:text-sm text-gray-600 mt-1">
                    Remove yourself from this family
                  </p>
                </div>
                <button
                  @click="showLeaveFamilyModal = true"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Leave
                </button>
              </div>

              <!-- Delete Family -->
              <div
                v-if="isLastAdmin"
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 text-sm sm:text-base">
                    Delete Family
                  </h4>
                  <p class="text-xs sm:text-sm text-gray-600 mt-1">
                    Permanently delete this family and all its data
                  </p>
                </div>
                <button
                  @click="showDeleteFamilyModal = true"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Actions & Stats -->
        <div class="space-y-4 sm:space-y-8">
          <!-- Quick Actions -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-bolt text-white text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <p class="text-gray-500 text-xs sm:text-sm hidden sm:block">
                  Family management tools
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="showEditNameModal = true"
                class="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-edit text-blue-600 text-base sm:text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm sm:text-base">
                    Edit Family Name
                  </div>
                  <div class="text-xs text-gray-500 hidden sm:block">
                    Update family display name
                  </div>
                </div>
              </button>

              <button
                @click="generateInviteLink"
                class="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all duration-200 group"
              >
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <i
                    class="fas fa-link text-purple-600 text-base sm:text-lg"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm sm:text-base">
                    Invite Members
                  </div>
                  <div class="text-xs text-gray-500 hidden sm:block">
                    Generate invite link
                  </div>
                </div>
              </button>
            </div>

            <!-- Invite Link -->
            <div
              v-if="inviteLink"
              class="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
            >
              <label
                class="block text-xs sm:text-sm font-semibold text-purple-900 mb-2"
              >
                Invite Link:
              </label>
              <div class="flex flex-col gap-2">
                <input
                  type="text"
                  :value="inviteLink"
                  readonly
                  class="w-full px-3 py-2 border border-purple-300 rounded-lg bg-white text-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  @click="$event.target.select()"
                />
                <button
                  @click="copyInviteLink"
                  class="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap text-sm"
                >
                  <i class="fas fa-copy text-xs"></i>
                  {{ copyButtonText }}
                </button>
              </div>
            </div>
          </div>

          <!-- Family Stats -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6"
          >
            <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-chart-bar text-white text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  Family Stats
                </h3>
                <p class="text-gray-500 text-xs sm:text-sm hidden sm:block">
                  Member overview
                </p>
              </div>
            </div>

            <div class="space-y-3 sm:space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
              >
                <span class="font-medium text-gray-700 text-sm sm:text-base"
                  >Total Members</span
                >
                <span class="text-lg sm:text-xl font-bold text-gray-900">
                  {{ familyData?.members?.length || 0 }}
                </span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
              >
                <span class="font-medium text-gray-700 text-sm sm:text-base"
                  >Admins</span
                >
                <span class="text-lg sm:text-xl font-bold text-gray-900">
                  {{ adminCount }}
                </span>
              </div>

              <div
                class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
              >
                <span class="font-medium text-gray-700 text-sm sm:text-base"
                  >Members</span
                >
                <span class="text-lg sm:text-xl font-bold text-gray-900">
                  {{ memberCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <!-- Edit Family Name Modal -->
    <div
      v-if="showEditNameModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showEditNameModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-edit text-blue-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Edit Family Name</h3>
        </div>

        <input
          v-model="newFamilyName"
          type="text"
          placeholder="Enter new family name"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
          @keyup.enter="editFamilyName"
        />

        <div class="flex gap-3">
          <button
            @click="showEditNameModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="editFamilyName"
            class="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Member Actions Modal -->
    <div
      v-if="showMemberActionsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showMemberActionsModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
          >
            <span class="text-white font-semibold text-lg">
              {{ getMemberInitial(selectedMember) }}
            </span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ getMemberDisplayName(selectedMember) }}
            </h3>
            <p class="text-sm text-gray-500">{{ selectedMember?.email }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <button
            @click="
              showChangeRoleModal = true;
              showMemberActionsModal = false;
            "
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div
              class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-cog text-blue-600"></i>
            </div>
            <div>
              <div class="font-semibold text-gray-900">Change Role</div>
              <div class="text-xs text-gray-500">Promote or demote member</div>
            </div>
          </button>

          <button
            @click="
              showRemoveMemberModal = true;
              showMemberActionsModal = false;
            "
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-colors"
          >
            <div
              class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-user-times text-red-600"></i>
            </div>
            <div>
              <div class="font-semibold text-red-600">Remove Member</div>
              <div class="text-xs text-gray-500">Remove from family</div>
            </div>
          </button>
        </div>

        <button
          @click="showMemberActionsModal = false"
          class="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Change Role Modal -->
    <div
      v-if="showChangeRoleModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showChangeRoleModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-user-cog text-purple-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Change Role</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Change
          <strong>{{ getMemberDisplayName(selectedMember) }}'s</strong> role to
          <strong>{{
            selectedMember?.role === "admin" ? "Member" : "Admin"
          }}</strong
          >?
        </p>

        <div class="flex gap-3">
          <button
            @click="showChangeRoleModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="changeMemberRole"
            class="flex-1 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            Change Role
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Member Modal -->
    <div
      v-if="showRemoveMemberModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showRemoveMemberModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-user-times text-red-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Remove Member</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Are you sure you want to remove
          <strong>{{ getMemberDisplayName(selectedMember) }}</strong> from the
          family? This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <button
            @click="showRemoveMemberModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="removeMember"
            class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Leave Family Modal -->
    <div
      v-if="showLeaveFamilyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showLeaveFamilyModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-sign-out-alt text-orange-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Leave Family</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Are you sure you want to leave this family? You will need to be
          re-invited to join again.
        </p>

        <div class="flex gap-3">
          <button
            @click="showLeaveFamilyModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="leaveFamily"
            class="flex-1 px-4 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Family Modal -->
    <div
      v-if="showDeleteFamilyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showDeleteFamilyModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
          >
            <i class="fas fa-exclamation-triangle text-red-600 text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Delete Family</h3>
        </div>

        <p class="text-gray-600 mb-6">
          This will <strong>permanently delete</strong> this family and all its
          data. This action cannot be undone. Are you absolutely sure?
        </p>

        <div class="flex gap-3">
          <button
            @click="showDeleteFamilyModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteFamily"
            class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToastMessage"
      class="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm w-full sm:w-auto px-4 animate-slideIn"
    >
      <div
        class="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
        :class="{
          'bg-green-50/95 text-green-800 border-green-200':
            toastType === 'success',
          'bg-red-50/95 text-red-800 border-red-200': toastType === 'error',
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
          <p class="font-medium flex-1 text-sm sm:text-base">
            {{ toastMessage }}
          </p>
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useAuthStore } from "~/stores/auth";
import { useNuxtApp } from "#app";
import { generateInvite } from "~/utils/firebase";
import { useFamilyMembers } from "~/composables/useFamilyMembers";

const { $firestore: db } = useNuxtApp();
const { fetchMembersWithUserData } = useFamilyMembers();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Data
const familyData = ref(null);
const loading = ref(true);
const familyId = ref("");

// UI State
const inviteLink = ref("");
const generatingInvite = ref(false);
const copyButtonText = ref("Copy");
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");

// Modal State
const showEditNameModal = ref(false);
const showMemberActionsModal = ref(false);
const showChangeRoleModal = ref(false);
const showRemoveMemberModal = ref(false);
const showLeaveFamilyModal = ref(false);
const showDeleteFamilyModal = ref(false);
const selectedMember = ref(null);
const newFamilyName = ref("");

// Computed
const isAdmin = computed(() => authStore.permissions.role === "admin");
const adminCount = computed(
  () => familyData.value?.members?.filter((m) => m.role === "admin").length || 0
);
const memberCount = computed(
  () =>
    familyData.value?.members?.filter((m) => m.role === "member").length || 0
);
const isLastAdmin = computed(() => {
  const admins =
    familyData.value?.members?.filter((m) => m.role === "admin") || [];
  return admins.length === 1 && admins[0].userId === authStore.userId;
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
    familyId.value = route.params.id;

    if (!familyId.value || familyId.value === "null") {
      showToast("No family specified", "error");
      return;
    }

    const docRef = doc(db, "families", familyId.value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const familyDataRaw = docSnap.data();
      const membersWithUserData = await fetchMembersWithUserData(
        familyDataRaw.members || []
      );

      familyData.value = {
        ...familyDataRaw,
        members: membersWithUserData,
      };
    } else {
      showToast("Family not found", "error");
    }
  } catch (err) {
    console.error("Error fetching family data:", err);
    showToast("Failed to load family data", "error");
  } finally {
    loading.value = false;
  }
};

const getMemberDisplayName = (member) => {
  if (!member) return "Unknown Member";
  if (member.name) return member.name;
  return "Unknown Member";
};

const getMemberInitial = (member) => {
  return getMemberDisplayName(member).charAt(0).toUpperCase();
};

const openMemberActionsModal = (member) => {
  selectedMember.value = member;
  showMemberActionsModal.value = true;
};

const changeMemberRole = async () => {
  if (!selectedMember.value) return;

  const newRole = selectedMember.value.role === "admin" ? "member" : "admin";

  try {
    showChangeRoleModal.value = false;

    // Update member role in family
    const updatedMembers = familyData.value.members.map((m) =>
      m.userId === selectedMember.value.userId ? { ...m, role: newRole } : m
    );

    await updateDoc(doc(db, "families", familyId.value), {
      members: updatedMembers,
    });

    // Update user's permissions if they're in the family
    await updateDoc(doc(db, "users", selectedMember.value.userId), {
      "permissions.role": newRole,
      familyRole: newRole === "admin" ? "parent" : "member",
    });

    familyData.value.members = updatedMembers;
    showToast(`Role updated to ${newRole}`, "success");
    selectedMember.value = null;
  } catch (error) {
    console.error("Error changing role:", error);
    showToast("Failed to change role", "error");
  }
};

const removeMember = async () => {
  if (!selectedMember.value) return;

  try {
    showRemoveMemberModal.value = false;

    // Find the exact member object from the family data (as stored in Firestore)
    const exactMember = familyData.value.members.find(
      (m) => m.userId === selectedMember.value.userId
    );

    if (!exactMember) {
      showToast("Member not found in family", "error");
      return;
    }

    // Create a clean member object with only the properties that exist in Firestore
    const cleanMember = {
      userId: exactMember.userId,
      email: exactMember.email,
      role: exactMember.role,
    };

    // Remove member from family using the clean object
    await updateDoc(doc(db, "families", familyId.value), {
      members: arrayRemove(cleanMember),
    });

    // Update user's family data
    await updateDoc(doc(db, "users", selectedMember.value.userId), {
      familyId: null,
      familyName: null,
      familyRole: null,
      status: null,
      updatedAt: new Date(),
    });

    // Refresh family data to get the updated members list
    await fetchFamilyData();

    showToast("Member removed successfully", "success");
    selectedMember.value = null;
  } catch (error) {
    console.error("Error removing member:", {
      error: error.message,
      code: error.code,
      member: selectedMember.value,
    });
    showToast("Failed to remove member: " + error.message, "error");
  }
};

const leaveFamily = async () => {
  try {
    showLeaveFamilyModal.value = false;

    const currentUserMember = familyData.value.members.find(
      (m) => m.userId === authStore.userId
    );

    if (currentUserMember) {
      // Remove yourself from family
      await updateDoc(doc(db, "families", familyId.value), {
        members: arrayRemove(currentUserMember),
      });

      // Update your own user data
      await updateDoc(doc(db, "users", authStore.userId), {
        familyId: null,
        familyName: null,
        familyRole: null,
        status: null,
      });

      // Update auth store
      authStore.familyId = null;
      authStore.familyName = null;
      authStore.familyRole = null;
      authStore.status = null;

      showToast("You have left the family", "success");
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Error leaving family:", error);
    showToast("Failed to leave family", "error");
  }
};

const deleteFamily = async () => {
  try {
    showDeleteFamilyModal.value = false;

    // Remove family reference from all members
    const updatePromises = familyData.value.members.map((member) =>
      updateDoc(doc(db, "users", member.userId), {
        familyId: null,
        familyName: null,
        familyRole: null,
        status: null,
      })
    );

    await Promise.all(updatePromises);

    // Delete the family document
    await deleteDoc(doc(db, "families", familyId.value));

    // Update auth store for current user
    authStore.familyId = null;
    authStore.familyName = null;
    authStore.familyRole = null;
    authStore.status = null;

    showToast("Family deleted successfully", "success");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error deleting family:", error);
    showToast("Failed to delete family", "error");
  }
};

const editFamilyName = async () => {
  if (!newFamilyName.value || newFamilyName.value.trim() === "") {
    showToast("Please enter a valid name", "error");
    return;
  }

  try {
    showEditNameModal.value = false;

    await updateDoc(doc(db, "families", familyId.value), {
      name: newFamilyName.value.trim(),
      updatedAt: new Date(),
    });

    familyData.value.name = newFamilyName.value.trim();
    authStore.familyName = newFamilyName.value.trim();
    showToast("Family name updated successfully", "success");
  } catch (error) {
    console.error("Error updating family name:", error);
    showToast("Failed to update family name", "error");
  }
};

const generateInviteLink = async () => {
  generatingInvite.value = true;
  try {
    const baseUrl = "https://my-nest.netlify.app";
    const inviteId = await generateInvite(
      familyId.value,
      familyData.value?.name,
      authStore.userId
    );
    inviteLink.value = `${baseUrl}/join/${inviteId}`;
    showToast("Invite link generated successfully", "success");
  } catch (error) {
    console.error("Error generating invite link:", error);
    showToast("Failed to generate invite link", "error");
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

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.familyId) {
    router.push("/family-setup");
    return;
  }

  if (!isAdmin.value) {
    router.push(`/family/${authStore.familyId}`);
    return;
  }

  await fetchFamilyData();
});

useHead({
  title: "FamilySpace - Manage Family",
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

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
