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
          Loading your profile...
        </h2>
        <p class="text-gray-600">Please wait a moment</p>
      </div>
    </div>

    <!-- Main Content -->
    <main
      class="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8 pb-24 md:pb-8"
    >
      <!-- Profile Header -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sm:p-8"
      >
        <div class="flex flex-col items-center text-center gap-4 sm:gap-6">
          <div class="relative group">
            <Avatar
              :avatar-url="authStore.avatarUrl"
              :user-initial="userInitial"
              :size="96"
              :no-upload="false"
              class="hover:ring-4 hover:ring-blue-100 transition-all duration-300 group-hover:scale-105 rounded-2xl"
              @avatar-updated="handleAvatarUpdate"
            />
            <div
              class="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
            >
              <i class="fas fa-check text-white text-xs"></i>
            </div>
          </div>

          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {{ authStore.name || "Your Name" }}
            </h1>
            <p class="text-base sm:text-lg text-gray-600 mb-4">
              {{ authStore.email }}
            </p>

            <div class="flex flex-wrap items-center justify-center gap-3">
              <div
                v-if="currentFamilyRole"
                class="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-users text-blue-600 text-sm"></i>
                <span class="font-medium text-gray-700 capitalize">
                  {{ currentFamilyRole }}
                </span>
              </div>
              <div
                v-if="currentFamilyName"
                class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-home text-green-600 text-sm"></i>
                <span class="font-medium text-gray-700">{{
                  currentFamilyName
                }}</span>
              </div>
              <div
                v-if="authStore.permissions.minor"
                class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-child text-amber-600 text-sm"></i>
                <span class="font-medium text-gray-700">Minor</span>
              </div>
              <div
                v-if="userFamilies.length > 1"
                class="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full"
              >
                <i class="fas fa-layer-group text-purple-600 text-sm"></i>
                <span class="font-medium text-gray-700"
                  >{{ userFamilies.length }} Families</span
                >
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink
              :to="`/user/${authStore.userId}`"
              class="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium border border-blue-200"
            >
              <i class="fas fa-eye text-sm"></i>
              View Public Profile
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 font-medium border border-gray-200"
            >
              <i class="fas fa-arrow-left text-sm"></i>
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Family Selection (if user has multiple families) -->
      <div
        v-if="userFamilies.length > 1"
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="fas fa-layer-group text-white text-lg"></i>
          </div>
          <div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-900">
              Your Families
            </h3>
            <p class="text-gray-500 text-sm">
              Switch between your family accounts
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="family in userFamilies"
            :key="family.id"
            class="border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-lg"
            :class="
              family.id === authStore.currentFamilyId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            "
            @click="switchFamily(family.id)"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-home text-white"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 truncate">
                  {{ family.name }}
                </h4>
                <p class="text-sm text-gray-600 capitalize">
                  {{ family.userRole }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center justify-between text-xs text-gray-500"
            >
              <span>{{ family.memberCount }} members</span>
              <span
                v-if="family.id === authStore.currentFamilyId"
                class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
              >
                Current
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <!-- Left Column - Personal Information -->
        <div class="xl:col-span-2 space-y-6 md:space-y-8">
          <!-- Personal Information -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-user text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg md:text-xl font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p class="text-gray-500 text-sm">
                  Update your personal details
                </p>
              </div>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="profileForm.name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                    readonly
                  />
                  <p class="text-xs text-gray-500 mt-2">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label
                    for="birthday"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    v-model="profileForm.birthday"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  />
                </div>

                <div>
                  <label
                    for="phone"
                    class="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Phone Number
                    <span class="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="profileForm.phone"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <!-- Family Relationships Section -->
              <div
                class="border-2 border-blue-200 rounded-xl p-5 bg-blue-50/50"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fas fa-users text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      Family Relationships
                    </h4>
                    <p class="text-sm text-gray-600">
                      Set your role in each family
                    </p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div
                    v-for="family in userFamilies"
                    :key="family.id"
                    class="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0"
                        >
                          <i class="fas fa-home text-white text-sm"></i>
                        </div>
                        <div>
                          <h5 class="font-semibold text-gray-900 text-sm">
                            {{ family.name }}
                          </h5>
                          <p class="text-xs text-gray-600 capitalize">
                            {{ family.userRole }}
                          </p>
                        </div>
                      </div>
                      <span
                        v-if="family.id === authStore.currentFamilyId"
                        class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                      >
                        Current
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        @click="setRelationship(family.id, 'parent_1')"
                        :class="{
                          'border-blue-500 bg-blue-50 ring-2 ring-blue-200':
                            getCurrentRelationship(family.id) === 'parent_1',
                          'border-gray-200 bg-white hover:bg-gray-50':
                            getCurrentRelationship(family.id) !== 'parent_1',
                        }"
                        class="p-3 border-2 rounded-lg text-center transition-all duration-200 group"
                      >
                        <i class="fas fa-male text-blue-600 text-sm mb-1"></i>
                        <div class="text-xs font-medium text-gray-900">
                          Father
                        </div>
                      </button>

                      <button
                        type="button"
                        @click="setRelationship(family.id, 'parent_2')"
                        :class="{
                          'border-pink-500 bg-pink-50 ring-2 ring-pink-200':
                            getCurrentRelationship(family.id) === 'parent_2',
                          'border-gray-200 bg-white hover:bg-gray-50':
                            getCurrentRelationship(family.id) !== 'parent_2',
                        }"
                        class="p-3 border-2 rounded-lg text-center transition-all duration-200 group"
                      >
                        <i class="fas fa-female text-pink-600 text-sm mb-1"></i>
                        <div class="text-xs font-medium text-gray-900">
                          Mother
                        </div>
                      </button>

                      <button
                        type="button"
                        @click="setRelationship(family.id, 'child')"
                        :class="{
                          'border-green-500 bg-green-50 ring-2 ring-green-200':
                            getCurrentRelationship(family.id) === 'child',
                          'border-gray-200 bg-white hover:bg-gray-50':
                            getCurrentRelationship(family.id) !== 'child',
                        }"
                        class="p-3 border-2 rounded-lg text-center transition-all duration-200 group"
                      >
                        <i class="fas fa-child text-green-600 text-sm mb-1"></i>
                        <div class="text-xs font-medium text-gray-900">
                          Child
                        </div>
                      </button>

                      <button
                        type="button"
                        @click="setRelationship(family.id, 'spouse')"
                        :class="{
                          'border-purple-500 bg-purple-50 ring-2 ring-purple-200':
                            getCurrentRelationship(family.id) === 'spouse',
                          'border-gray-200 bg-white hover:bg-gray-50':
                            getCurrentRelationship(family.id) !== 'spouse',
                        }"
                        class="p-3 border-2 rounded-lg text-center transition-all duration-200 group"
                      >
                        <i
                          class="fas fa-heart text-purple-600 text-sm mb-1"
                        ></i>
                        <div class="text-xs font-medium text-gray-900">
                          Spouse
                        </div>
                      </button>
                    </div>

                    <!-- Current Relationship Display -->
                    <div class="mt-3 flex items-center gap-2">
                      <i
                        class="text-sm"
                        :class="
                          getRelationshipIcon(getCurrentRelationship(family.id))
                        "
                      ></i>
                      <span class="text-xs font-medium text-gray-700">
                        {{
                          getRelationshipDisplay(
                            getCurrentRelationship(family.id)
                          )
                        }}
                      </span>
                      <span
                        v-if="!getCurrentRelationship(family.id)"
                        class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium"
                      >
                        Not Set
                      </span>
                    </div>
                  </div>
                </div>

                <p class="text-xs text-gray-500 mt-3">
                  This helps build accurate family trees for each family you
                  belong to.
                </p>
              </div>

              <div>
                <label
                  for="bio"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Bio <span class="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="bio"
                  v-model="profileForm.bio"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                  placeholder="Tell us a bit about yourself..."
                  maxlength="200"
                ></textarea>
                <div class="flex justify-between items-center mt-2">
                  <p class="text-xs text-gray-500">
                    Share your interests, hobbies, or a fun fact about yourself
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ profileForm.bio.length }}/200
                  </p>
                </div>
              </div>

              <button
                type="submit"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="saving || !isProfileFormValid"
              >
                <i
                  class="fas fa-save text-sm"
                  :class="{ 'animate-spin': saving }"
                ></i>
                {{ saving ? "Saving Changes..." : "Save Changes" }}
              </button>
            </form>
          </div>
        </div>

        <!-- Right Column - Security & Settings -->
        <div class="space-y-6 md:space-y-8">
          <!-- Security & Privacy -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg md:text-xl font-semibold text-gray-900">
                  Security & Privacy
                </h3>
                <p class="text-gray-500 text-sm">
                  Manage your account security
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Change Password -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <i class="fas fa-key text-green-600"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">Password</h4>
                      <p class="text-sm text-gray-600">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <button
                    @click="showPasswordForm = !showPasswordForm"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium flex-shrink-0"
                  >
                    <i class="fas fa-edit text-sm"></i>
                    {{ showPasswordForm ? "Cancel" : "Change" }}
                  </button>
                </div>

                <form
                  v-if="showPasswordForm"
                  @submit.prevent="updatePassword"
                  class="mt-4 space-y-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <label
                      for="current-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      v-model="passwordForm.current"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="new-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      v-model="passwordForm.new"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter new password"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-2">
                      Minimum 6 characters
                    </p>
                  </div>
                  <div>
                    <label
                      for="confirm-password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      v-model="passwordForm.confirm"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div class="flex gap-3">
                    <button
                      type="submit"
                      class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-1"
                      :disabled="updatingPassword || !isPasswordFormValid"
                    >
                      <i
                        class="fas fa-check text-sm"
                        :class="{ 'animate-spin': updatingPassword }"
                      ></i>
                      {{ updatingPassword ? "Updating..." : "Update" }}
                    </button>
                    <button
                      type="button"
                      @click="cancelPasswordUpdate"
                      class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <!-- Privacy Settings -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fas fa-eye text-purple-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Profile Privacy</h4>
                    <p class="text-sm text-gray-600">
                      Make profile visible only to family
                    </p>
                  </div>
                  <label
                    class="relative inline-flex items-center cursor-pointer flex-shrink-0"
                  >
                    <input
                      type="checkbox"
                      v-model="profileForm.permissions.privateMode"
                      class="sr-only peer"
                      @change="updatePrivacyMode"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                    ></div>
                  </label>
                </div>
              </div>

              <!-- Account Role -->
              <div class="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <i class="fas fa-user-tag text-blue-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">Account Role</h4>
                    <p class="text-sm text-gray-600">
                      Your primary family permissions
                    </p>
                  </div>
                  <span
                    class="px-4 py-2 text-sm font-semibold rounded-xl capitalize flex-shrink-0"
                    :class="{
                      'bg-gradient-to-r from-purple-500 to-indigo-600 text-white':
                        currentFamilyRole === 'admin',
                      'bg-green-100 text-green-700':
                        currentFamilyRole === 'member',
                    }"
                  >
                    {{ currentFamilyRole || "member" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-info-circle text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg md:text-xl font-semibold text-gray-900">
                  Account Status
                </h3>
                <p class="text-gray-500 text-sm">Your account information</p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-blue-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Member Since</span>
                <span class="font-semibold text-gray-900">{{
                  formatJoinDate(authStore.createdAt)
                }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Family Count</span>
                <span class="font-semibold text-gray-900">{{
                  userFamilies.length
                }}</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-purple-50 rounded-xl"
              >
                <span class="font-medium text-gray-700">Last Updated</span>
                <span class="font-semibold text-gray-900 text-sm">{{
                  formatJoinDate(authStore.updatedAt)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-red-200 p-6 md:p-8"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <i class="fas fa-exclamation-triangle text-white text-lg"></i>
          </div>
          <div>
            <h3 class="text-lg md:text-xl font-semibold text-gray-900">
              Danger Zone
            </h3>
            <p class="text-gray-500 text-sm">Irreversible actions</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div class="border border-red-200 rounded-xl p-5 bg-red-50/50">
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-sign-out-alt text-red-600"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  Leave Current Family
                </h4>
                <p class="text-sm text-gray-600">
                  Remove yourself from
                  {{ currentFamilyName || "current family" }}
                </p>
              </div>
            </div>
            <button
              @click="leaveCurrentFamily"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="leaving"
            >
              <i
                class="fas fa-sign-out-alt text-sm"
                :class="{ 'animate-spin': leaving }"
              ></i>
              {{ leaving ? "Leaving..." : "Leave Family" }}
            </button>
          </div>

          <div class="border border-red-200 rounded-xl p-5 bg-red-50/50">
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-trash text-red-600"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Delete Account</h4>
                <p class="text-sm text-gray-600">
                  Permanently delete your account and data
                </p>
              </div>
            </div>
            <button
              @click="deleteAccount"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="deleting"
            >
              <i
                class="fas fa-trash text-sm"
                :class="{ 'animate-spin': deleting }"
              ></i>
              {{ deleting ? "Deleting..." : "Delete Account" }}
            </button>
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
          <p class="font-medium flex-1">{{ toastMessage }}</p>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import {
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getAuth,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import Avatar from "~/components/Avatar.vue";

const { $firestore: db } = useNuxtApp();
const router = useRouter();
const authStore = useAuthStore();

// Form data
const profileForm = ref({
  name: "",
  email: "",
  birthday: "",
  phone: "",
  bio: "",
  permissions: {
    privateMode: false,
  },
});

const familyRelationships = ref({});

const passwordForm = ref({
  current: "",
  new: "",
  confirm: "",
});

// UI state
const isLoading = ref(true);
const saving = ref(false);
const updatingPassword = ref(false);
const leaving = ref(false);
const deleting = ref(false);
const showPasswordForm = ref(false);
const toastMessage = ref("");
const showToastMessage = ref(false);
const toastType = ref("success");
const updatingPrivacy = ref(false);

// Computed properties for multi-family support
const userFamilies = computed(() => {
  if (!authStore.families) return [];
  return Object.keys(authStore.families).map((familyId) => ({
    id: familyId,
    name: authStore.families[familyId]?.name || "Unknown Family",
    userRole: authStore.families[familyId]?.role || "member",
    memberCount: authStore.families[familyId]?.memberCount || 0,
  }));
});

const currentFamilyId = computed(() => authStore.currentFamilyId);
const currentFamilyName = computed(() => authStore.currentFamilyName);
const currentFamilyRole = computed(() => {
  if (!currentFamilyId.value || !authStore.families) return null;
  return authStore.families[currentFamilyId.value]?.role || "member";
});

const userInitial = computed(() =>
  authStore.name ? authStore.name.charAt(0).toUpperCase() : "?"
);

const isProfileFormValid = computed(() => {
  const nameTrimmed = profileForm.value.name.trim();
  const isValidName = nameTrimmed !== "" && !nameTrimmed.includes("@");
  const isValidBirthday =
    profileForm.value.birthday &&
    !isNaN(new Date(profileForm.value.birthday).getTime());
  return isValidName && isValidBirthday;
});

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.current.trim() !== "" &&
    passwordForm.value.new.trim() !== "" &&
    passwordForm.value.confirm.trim() !== "" &&
    passwordForm.value.new.length >= 6 &&
    passwordForm.value.new === passwordForm.value.confirm
  );
});

// Relationship helper functions
const getCurrentRelationship = (familyId) => {
  return familyRelationships.value[familyId] || null;
};

const setRelationship = (familyId, relationship) => {
  familyRelationships.value[familyId] = relationship;
};

const getRelationshipDisplay = (relationship) => {
  const relationshipMap = {
    parent_1: "Father",
    parent_2: "Mother",
    child: "Child",
    spouse: "Spouse/Partner",
  };
  return relationshipMap[relationship] || "Select your role";
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

const calculateMinor = (birthday) => {
  if (!birthday) return false;
  const birthDate = new Date(birthday);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1 < 18;
  }
  return age < 18;
};

const formatJoinDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "Unknown";
  }
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

const loadCurrentRelationships = async () => {
  for (const family of userFamilies.value) {
    try {
      const familyDoc = await getDoc(doc(db, "families", family.id));
      if (familyDoc.exists()) {
        const familyData = familyDoc.data();
        const currentMember = familyData.members?.find(
          (member) => member.userId === authStore.userId
        );
        if (currentMember?.relationship) {
          familyRelationships.value[family.id] = currentMember.relationship;
        }
      }
    } catch (error) {
      console.error(
        `Error loading relationship for family ${family.id}:`,
        error
      );
    }
  }
};

const initializeForm = () => {
  profileForm.value = {
    name: authStore.name || "",
    email: authStore.email || "",
    birthday: authStore.birthday || "",
    phone: authStore.phone || "",
    bio: authStore.bio || "",
    permissions: {
      privateMode: authStore.permissions.privateMode || false,
    },
  };
};

const switchFamily = async (familyId) => {
  if (familyId === authStore.currentFamilyId) return;

  try {
    authStore.setCurrentFamily(familyId);
    showToast(`Switched to ${authStore.currentFamilyName}`, "success");
  } catch (error) {
    console.error("Error switching family:", error);
    showToast("Failed to switch family", "error");
  }
};

const updateProfile = async () => {
  if (!isProfileFormValid.value) {
    showToast("Please fill all required fields correctly", "error");
    return;
  }

  saving.value = true;
  try {
    const userDoc = {
      name: profileForm.value.name,
      birthday: profileForm.value.birthday,
      permissions: {
        role: currentFamilyRole.value,
        minor: calculateMinor(profileForm.value.birthday),
        privateMode: profileForm.value.permissions.privateMode,
      },
      phone: profileForm.value.phone,
      bio: profileForm.value.bio.substring(0, 200),
      updatedAt: new Date(),
    };

    await updateDoc(doc(db, "users", authStore.userId), userDoc);

    // Update relationships in each family
    const relationshipPromises = Object.keys(familyRelationships.value).map(
      async (familyId) => {
        const relationship = familyRelationships.value[familyId];
        if (!relationship) return;

        try {
          const familyRef = doc(db, "families", familyId);
          const familyDoc = await getDoc(familyRef);

          if (familyDoc.exists()) {
            const familyData = familyDoc.data();
            const updatedMembers = familyData.members.map((member) =>
              member.userId === authStore.userId
                ? { ...member, relationship }
                : member
            );

            await updateDoc(familyRef, {
              members: updatedMembers,
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error(
            `Error updating relationship for family ${familyId}:`,
            error
          );
          throw error;
        }
      }
    );

    await Promise.all(relationshipPromises);

    // Update auth store
    authStore.name = profileForm.value.name;
    authStore.birthday = profileForm.value.birthday;
    authStore.permissions = {
      ...authStore.permissions,
      minor: userDoc.permissions.minor,
      privateMode: userDoc.permissions.privateMode,
    };
    authStore.phone = profileForm.value.phone;
    authStore.bio = profileForm.value.bio;

    showToast("Profile and relationships updated successfully", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("Failed to update profile: " + error.message, "error");
  } finally {
    saving.value = false;
  }
};

const updatePrivacyMode = async () => {
  if (updatingPrivacy.value) return;
  updatingPrivacy.value = true;

  const newPrivateMode = profileForm.value.permissions.privateMode;
  const previousPrivateMode = authStore.permissions.privateMode;

  try {
    // Optimistically update store
    authStore.permissions.privateMode = newPrivateMode;

    await updateDoc(doc(db, "users", authStore.userId), {
      "permissions.privateMode": newPrivateMode,
      updatedAt: new Date(),
    });

    showToast("Privacy settings updated successfully", "success");
  } catch (error) {
    console.error("Error updating privacy mode:", error);
    // Revert on failure
    profileForm.value.permissions.privateMode = previousPrivateMode;
    authStore.permissions.privateMode = previousPrivateMode;
    showToast("Failed to update privacy settings: " + error.message, "error");
  } finally {
    updatingPrivacy.value = false;
  }
};

const updatePassword = async () => {
  if (!isPasswordFormValid.value) {
    if (passwordForm.value.new !== passwordForm.value.confirm) {
      showToast("New passwords don't match", "error");
      return;
    }
    if (passwordForm.value.new.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    showToast("Please fill all password fields", "error");
    return;
  }

  updatingPassword.value = true;
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordForm.value.current
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await firebaseUpdatePassword(user, passwordForm.value.new);

    // Clear form and hide it
    cancelPasswordUpdate();
    showToast("Password updated successfully", "success");
  } catch (error) {
    console.error("Error updating password:", {
      code: error.code,
      message: error.message,
    });
    if (error.code === "auth/wrong-password") {
      showToast("Current password is incorrect", "error");
    } else if (error.code === "auth/too-many-requests") {
      showToast("Too many attempts. Please try again later.", "error");
    } else {
      showToast("Failed to update password: " + error.message, "error");
    }
  } finally {
    updatingPassword.value = false;
  }
};

const cancelPasswordUpdate = () => {
  showPasswordForm.value = false;
  passwordForm.value = { current: "", new: "", confirm: "" };
};

const handleAvatarUpdate = (newAvatarUrl) => {
  authStore.avatarUrl = newAvatarUrl;
  showToast("Profile photo updated successfully", "success");
};

const leaveCurrentFamily = async () => {
  if (!currentFamilyId.value) {
    showToast("No current family selected", "error");
    return;
  }

  if (
    !confirm(
      `Are you sure you want to leave ${currentFamilyName.value}? You'll need a new invite to rejoin.`
    )
  ) {
    return;
  }

  leaving.value = true;
  try {
    const familyId = currentFamilyId.value;

    // Remove user from family members
    const familyRef = doc(db, "families", familyId);
    const familyDoc = await getDoc(familyRef);

    if (familyDoc.exists()) {
      const familyData = familyDoc.data();
      const updatedMembers = familyData.members.filter(
        (member) => member.userId !== authStore.userId
      );

      await updateDoc(familyRef, {
        members: updatedMembers,
        updatedAt: new Date(),
      });
    }

    // Remove family from user's families
    const userRef = doc(db, "users", authStore.userId);
    await updateDoc(userRef, {
      [`families.${familyId}`]: arrayRemove(),
      updatedAt: new Date(),
    });

    // Update auth store
    delete authStore.families[familyId];

    // Set new current family if available
    const remainingFamilies = Object.keys(authStore.families);
    if (remainingFamilies.length > 0) {
      authStore.setCurrentFamily(remainingFamilies[0]);
    } else {
      authStore.currentFamilyId = null;
      authStore.currentFamilyName = null;
    }

    showToast(`Successfully left ${currentFamilyName.value}`, "success");

    // Refresh family members if we have a new current family
    if (authStore.currentFamilyId) {
      await authStore.loadFamilyMembers();
    }
  } catch (error) {
    console.error("Error leaving family:", error);
    showToast("Failed to leave family: " + error.message, "error");
  } finally {
    leaving.value = false;
  }
};

const deleteAccount = async () => {
  const confirmation = prompt("Type 'DELETE' to confirm account deletion:");
  if (confirmation !== "DELETE") {
    return;
  }

  deleting.value = true;
  try {
    // Remove user from all families
    const familyPromises = Object.keys(authStore.families || {}).map(
      async (familyId) => {
        const familyRef = doc(db, "families", familyId);
        const familyDoc = await getDoc(familyRef);

        if (familyDoc.exists()) {
          const familyData = familyDoc.data();
          const updatedMembers = familyData.members.filter(
            (member) => member.userId !== authStore.userId
          );

          return updateDoc(familyRef, {
            members: updatedMembers,
            updatedAt: new Date(),
          });
        }
      }
    );

    await Promise.all(familyPromises);

    // Delete user document
    await deleteDoc(doc(db, "users", authStore.userId));

    // Delete Firebase auth user
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await user.delete();
    }

    authStore.clearAuth();
    router.push("/");
    showToast("Account deleted successfully", "success");
  } catch (error) {
    console.error("Error deleting account:", error);
    showToast("Failed to delete account: " + error.message, "error");
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await authStore.initAuth();
  if (!authStore.isInitialized) {
    router.push("/login?redirect=/profile");
    return;
  }

  // Load family members if user has a current family
  if (authStore.currentFamilyId) {
    await authStore.loadFamilyMembers();
  }

  initializeForm();
  await loadCurrentRelationships();
  isLoading.value = false;
});

useHead({
  title: "FamilySpace - Profile Settings",
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

textarea {
  resize: none;
}

input:disabled,
input:read-only {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}
</style>
