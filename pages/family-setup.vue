<!-- pages/family-setup.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50"
  >
    <!-- Main Content -->
    <main
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-2xl w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg mb-6"
          >
            <i class="fas fa-home text-white text-2xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            Set Up Your
            <span
              class="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent"
              >Family Space</span
            >
          </h1>
          <p class="text-gray-600 text-lg max-w-md mx-auto">
            Create your family workspace or join an existing one
          </p>
        </div>

        <!-- Not Logged In State -->
        <div
          v-if="!authStore.userId"
          class="bg-white rounded-2xl shadow-md border border-gray-200/60 p-8 text-center"
        >
          <!-- ... existing auth required state ... -->
        </div>

        <!-- Family Setup Options -->
        <div v-else class="space-y-6">
          <!-- Create New Family Card -->
          <div
            class="bg-white rounded-2xl shadow-md border border-gray-200/60 p-8"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-plus text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Create New Family
                </h3>
                <p class="text-gray-500 text-sm">
                  Start your own family workspace
                </p>
              </div>
            </div>

            <form @submit.prevent="createNewFamily" class="space-y-6">
              <!-- Family Name Input -->
              <div>
                <label
                  for="familyName"
                  class="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Family Name *
                </label>
                <input
                  type="text"
                  id="familyName"
                  v-model="newFamilyName"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="e.g., The Smith Family"
                  required
                />
              </div>

              <!-- Relationship Selection -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Your Role in this Family *
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Parent 1 (Father) -->
                  <button
                    type="button"
                    @click="selectedRelationship = 'parent_1'"
                    :class="{
                      'border-green-500 bg-green-50 ring-2 ring-green-200':
                        selectedRelationship === 'parent_1',
                      'border-gray-200 bg-white hover:bg-gray-50':
                        selectedRelationship !== 'parent_1',
                    }"
                    class="p-4 border-2 rounded-xl text-center transition-all duration-200 group"
                  >
                    <i
                      class="fas fa-male text-green-600 text-xl mb-2 group-hover:scale-110 transition-transform"
                    ></i>
                    <div class="font-medium text-gray-900">Parent</div>
                    <div class="text-xs text-gray-500 mt-1">Father</div>
                  </button>

                  <!-- Parent 2 (Mother) -->
                  <button
                    type="button"
                    @click="selectedRelationship = 'parent_2'"
                    :class="{
                      'border-pink-500 bg-pink-50 ring-2 ring-pink-200':
                        selectedRelationship === 'parent_2',
                      'border-gray-200 bg-white hover:bg-gray-50':
                        selectedRelationship !== 'parent_2',
                    }"
                    class="p-4 border-2 rounded-xl text-center transition-all duration-200 group"
                  >
                    <i
                      class="fas fa-female text-pink-600 text-xl mb-2 group-hover:scale-110 transition-transform"
                    ></i>
                    <div class="font-medium text-gray-900">Parent</div>
                    <div class="text-xs text-gray-500 mt-1">Mother</div>
                  </button>

                  <!-- Child -->
                  <button
                    type="button"
                    @click="selectedRelationship = 'child'"
                    :class="{
                      'border-blue-500 bg-blue-50 ring-2 ring-blue-200':
                        selectedRelationship === 'child',
                      'border-gray-200 bg-white hover:bg-gray-50':
                        selectedRelationship !== 'child',
                    }"
                    class="p-4 border-2 rounded-xl text-center transition-all duration-200 group"
                  >
                    <i
                      class="fas fa-child text-blue-600 text-xl mb-2 group-hover:scale-110 transition-transform"
                    ></i>
                    <div class="font-medium text-gray-900">Child</div>
                    <div class="text-xs text-gray-500 mt-1">Son/Daughter</div>
                  </button>

                  <!-- Spouse -->
                  <button
                    type="button"
                    @click="selectedRelationship = 'spouse'"
                    :class="{
                      'border-purple-500 bg-purple-50 ring-2 ring-purple-200':
                        selectedRelationship === 'spouse',
                      'border-gray-200 bg-white hover:bg-gray-50':
                        selectedRelationship !== 'spouse',
                    }"
                    class="p-4 border-2 rounded-xl text-center transition-all duration-200 group"
                  >
                    <i
                      class="fas fa-heart text-purple-600 text-xl mb-2 group-hover:scale-110 transition-transform"
                    ></i>
                    <div class="font-medium text-gray-900">Spouse</div>
                    <div class="text-xs text-gray-500 mt-1">Partner</div>
                  </button>
                </div>

                <!-- Relationship Help Text -->
                <p class="text-xs text-gray-500 mt-3 text-center">
                  This helps us build your family tree correctly
                </p>
              </div>

              <button
                type="submit"
                :disabled="
                  !newFamilyName.trim() ||
                  !selectedRelationship ||
                  creatingFamily
                "
                class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="creatingFamily" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-home"></i>
                {{
                  creatingFamily ? "Creating Family..." : "Create Family Space"
                }}
              </button>
            </form>
          </div>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="px-4 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 text-gray-500 font-medium"
                >OR</span
              >
            </div>
          </div>

          <!-- Join Existing Family Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Search Families -->
            <div
              class="bg-white rounded-2xl shadow-md border border-gray-200/60 p-6 text-center"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <i class="fas fa-search text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Search Families
              </h3>
              <p class="text-gray-500 text-sm mb-4">
                Find and request to join existing families
              </p>
              <NuxtLink
                to="/join-family"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                <i class="fas fa-search"></i>
                Search Families
              </NuxtLink>
            </div>

            <!-- Use Invite Link -->
            <div
              class="bg-white rounded-2xl shadow-md border border-gray-200/60 p-6 text-center"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <i class="fas fa-link text-white text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Use Invite Link
              </h3>
              <p class="text-gray-500 text-sm mb-4">
                Join instantly with a family invitation
              </p>
              <NuxtLink
                to="/join/invite"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all"
              >
                <i class="fas fa-external-link-alt"></i>
                Use Invite Link
              </NuxtLink>
            </div>
          </div>

          <!-- Skip for Now -->
          <div class="text-center">
            <button
              @click="skipFamilySetup"
              class="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Skip for now, I'll set up family later
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
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
            @click="showToast = false"
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
import { createFamily } from "~/utils/firebase";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const router = useRouter();

const newFamilyName = ref("");
const selectedRelationship = ref("");
const creatingFamily = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const createNewFamily = async () => {
  if (!newFamilyName.value.trim() || !selectedRelationship.value) return;

  creatingFamily.value = true;
  try {
    const familyId = await createFamily(
      authStore.userId,
      newFamilyName.value.trim(),
      authStore.email,
      authStore.name,
      selectedRelationship.value
    );

    // Update auth store with new family
    await authStore.initAuth();

    showToastMessage("Family created successfully! Redirecting...", "success");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    console.error("Error creating family:", error);
    showToastMessage(error.message || "Failed to create family", "error");
  } finally {
    creatingFamily.value = false;
  }
};

const skipFamilySetup = () => {
  router.push("/dashboard");
};

const showToastMessage = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 4000);
};

useHead({
  title: "FamilySpace - Set Up Family",
});

onMounted(async () => {
  await authStore.initAuth();
});
</script>
