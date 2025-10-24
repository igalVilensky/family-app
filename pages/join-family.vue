<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-2xl w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            Join a
            <span
              class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
              >Family</span
            >
          </h1>
          <p class="text-gray-600 text-lg max-w-md mx-auto">
            Search for families or join with an invitation link to start
            connecting
          </p>
        </div>

        <!-- Search Card -->
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
            >
              <i class="fas fa-search text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                Search for a Family
              </h2>
              <p class="text-gray-500 text-sm">
                Find families by name and request to join
              </p>
            </div>
          </div>

          <!-- FIX: Change to searchFamiliesHandler -->
          <form @submit.prevent="searchFamiliesHandler" class="space-y-6">
            <!-- Search Input -->
            <div>
              <label
                for="search"
                class="block text-sm font-semibold text-gray-700 mb-3"
              >
                Family Name
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <i class="fas fa-users text-gray-400 text-lg"></i>
                </div>
                <input
                  type="text"
                  id="search"
                  v-model="searchQuery"
                  class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-gray-400"
                  placeholder="Enter family name to search..."
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Search Button -->
            <button
              type="submit"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="loading || !searchQuery.trim()"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-lg"></i>
              <i v-else class="fas fa-search text-lg"></i>
              <span class="text-lg">{{
                loading ? "Searching Families..." : "Search Families"
              }}</span>
            </button>
          </form>

          <!-- Search Results -->
          <div v-if="searchResults.length" class="mt-8 animate-fadeIn">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-check text-green-600 text-sm"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                Found {{ searchResults.length }} Family{{
                  searchResults.length !== 1 ? "ies" : ""
                }}
              </h3>
            </div>

            <div class="space-y-4">
              <div
                v-for="family in searchResults"
                :key="family.id"
                class="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
                    >
                      <i class="fas fa-home text-white text-lg"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 text-lg">
                        {{ family.name }}
                      </h4>
                      <p class="text-gray-500 text-sm">
                        {{ family.members?.length || 0 }} member{{
                          family.members?.length !== 1 ? "s" : ""
                        }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="requestToJoin(family.id, family.name)"
                    class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group-hover:scale-105"
                    :disabled="loading"
                  >
                    <i class="fas fa-user-plus text-sm"></i>
                    Request to Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div
            v-else-if="searched && searchResults.length === 0"
            class="mt-8 text-center py-8 animate-fadeIn"
          >
            <div
              class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-search text-gray-400 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              No Families Found
            </h3>
            <p class="text-gray-500 text-sm">
              No families match your search. Try a different name or check your
              spelling.
            </p>
          </div>
        </div>

        <!-- Alternative Options -->
        <div
          class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-8"
        >
          <div class="text-center">
            <div
              class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-link text-white text-xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Have an Invitation?
            </h3>
            <p class="text-gray-600 mb-6">
              If you have a family invitation link, you can join instantly
              without searching
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink
                to="/join/invite"
                class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i class="fas fa-external-link-alt text-sm"></i>
                Join with Invite Link
              </NuxtLink>
              <NuxtLink
                to="/family-setup"
                class="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <i class="fas fa-plus-circle text-sm"></i>
                Create New Family
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Help Text -->
        <div class="text-center">
          <p class="text-gray-500 text-sm">
            Need help? Contact the family admin for an invitation link or
            <NuxtLink
              to="/support"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              get support
            </NuxtLink>
          </p>
        </div>
      </div>
    </main>

    <!-- Authentication Required Modal -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-user-lock text-white text-xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Join Request Requires Account
          </h3>
          <p class="text-gray-600">
            You need to create an account or sign in to send a join request to
            <strong>{{ selectedFamilyName }}</strong>
          </p>
        </div>

        <div class="space-y-4">
          <NuxtLink
            :to="`/register?redirect=/join-family&family=${selectedFamilyId}`"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200 hover:shadow-lg"
          >
            <i class="fas fa-user-plus text-lg"></i>
            Create Free Account
          </NuxtLink>

          <NuxtLink
            :to="`/login?redirect=/join-family&family=${selectedFamilyId}`"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <i class="fas fa-sign-in-alt text-lg"></i>
            Sign In to Existing Account
          </NuxtLink>

          <button
            @click="showAuthModal = false"
            class="w-full px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { searchFamilies, sendJoinRequest } from "~/utils/firebase";

const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref("");
const searchResults = ref([]);
const loading = ref(false);
const searched = ref(false);
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const showAuthModal = ref(false);
const selectedFamilyId = ref("");
const selectedFamilyName = ref("");

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
    toastMessage.value = "";
  }, 4000);
};

const searchFamiliesHandler = async () => {
  if (!searchQuery.value.trim()) return;

  loading.value = true;
  searchResults.value = [];
  searched.value = true;

  try {
    // Make sure we're passing the string value, not the event
    const query = searchQuery.value.trim();

    searchResults.value = await searchFamilies(query);

    if (searchResults.value.length === 0) {
      showToast(
        "No families found with that name. Try a different search term.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error searching families:", error);
    showToast("Failed to search families. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};

const requestToJoin = async (familyId, familyName) => {
  if (!authStore.userId) {
    selectedFamilyId.value = familyId;
    selectedFamilyName.value = familyName;
    showAuthModal.value = true;
    return;
  }

  loading.value = true;
  try {
    await sendJoinRequest(
      familyId,
      authStore.userId,
      authStore.email,
      authStore.name
    );

    showToast(
      `Join request sent to ${familyName}! The family admin will review your request.`,
      "success"
    );

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  } catch (error) {
    console.error("Error sending join request:", error);
    showToast("Failed to send join request. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "FamilySpace - Join a Family",
  meta: [
    {
      name: "description",
      content:
        "Search for families to join or use an invitation link to connect with your family on FamilySpace.",
    },
  ],
});
</script>

<style scoped>
.fa-spinner {
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
