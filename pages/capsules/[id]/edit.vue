<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink
          :to="`/capsules/${capsuleId}`"
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Capsule
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Edit Capsule</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-gray-600 mt-4">Loading capsule...</p>
      </div>

      <!-- Edit Form -->
      <div
        v-else-if="capsule"
        class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8"
      >
        <form @submit.prevent="updateCapsule" class="space-y-6">
          <!-- Recipient Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Send To *
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                v-for="member in familyMembers"
                :key="member.userId"
                type="button"
                @click="form.recipientId = member.userId"
                class="flex items-center gap-3 p-4 border-2 rounded-xl transition-all duration-200 text-left"
                :class="
                  form.recipientId === member.userId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                "
              >
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-sm font-medium text-blue-600">
                    {{
                      member.name ? member.name.charAt(0).toUpperCase() : "?"
                    }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">
                    {{ member.name || member.email }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ member.familyRole }}
                  </p>
                </div>
                <i
                  v-if="form.recipientId === member.userId"
                  class="fas fa-check text-blue-500 text-sm flex-shrink-0"
                ></i>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Choose who will receive this message. They won't see it until the
              delivery date.
            </p>
          </div>

          <!-- Title -->
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Capsule Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter a meaningful title for your capsule"
            />
            <div class="flex justify-between items-center mt-2">
              <p class="text-xs text-gray-500">
                Give your capsule a meaningful title
              </p>
              <p class="text-xs text-gray-500">{{ form.title.length }}/100</p>
            </div>
          </div>

          <!-- Content -->
          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Message *
            </label>
            <textarea
              id="content"
              v-model="form.content"
              rows="8"
              required
              maxlength="2000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
              placeholder="Write your message here..."
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <p class="text-xs text-gray-500">
                Express your thoughts and feelings
              </p>
              <p class="text-xs text-gray-500">
                {{ form.content.length }}/2000
              </p>
            </div>
          </div>

          <!-- Delivery Date -->
          <div>
            <label
              for="deliveryDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Delivery Date *
            </label>
            <input
              id="deliveryDate"
              v-model="form.deliveryDate"
              type="date"
              required
              :min="minDate"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p class="text-sm text-gray-500 mt-2">
              Select when you want this capsule to be delivered
            </p>
            <div
              v-if="daysUntilDelivery > 0"
              class="mt-3 p-3 bg-blue-50 rounded-xl"
            >
              <div class="flex items-center gap-2 text-blue-700">
                <i class="fas fa-clock"></i>
                <span class="font-medium">
                  {{ selectedRecipientName }} will receive this in
                  {{ daysUntilDelivery }} days
                </span>
              </div>
            </div>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Capsule Type
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label
                v-for="type in capsuleTypes"
                :key="type.value"
                class="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all duration-200"
                :class="{
                  'border-blue-500 bg-blue-50': form.type === type.value,
                }"
              >
                <input
                  v-model="form.type"
                  type="radio"
                  :value="type.value"
                  class="hidden"
                />
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="type.class"
                  >
                    <i :class="type.icon" class="text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ type.label }}</p>
                    <p class="text-xs text-gray-500">{{ type.description }}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$router.push(`/capsules/${capsuleId}`)"
              class="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="updating"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                class="fas fa-save text-sm"
                :class="{ 'animate-spin': updating }"
              ></i>
              {{ updating ? "Updating..." : "Update Capsule" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Capsule Not Found
        </h3>
        <p class="text-gray-600 mb-6">
          The capsule you're trying to edit doesn't exist.
        </p>
        <NuxtLink
          to="/capsules"
          class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Capsules
        </NuxtLink>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useCapsules } from "~/composables/useCapsules";

const route = useRoute();
const router = useRouter();
const capsuleId = route.params.id;
const authStore = useAuthStore();
const { updateCapsuleById, fetchCapsuleById } = useCapsules();

const capsule = ref(null);
const loading = ref(true);
const updating = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const familyMembers = ref([]);

const form = ref({
  title: "",
  content: "",
  deliveryDate: "",
  type: "personal",
  recipientId: "",
});

const minDate = new Date().toISOString().split("T")[0];

const capsuleTypes = [
  {
    value: "personal",
    label: "Personal",
    description: "For yourself",
    icon: "fas fa-user",
    class: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    value: "shared",
    label: "Shared",
    description: "For someone else",
    icon: "fas fa-share-alt",
    class: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
];

// Computed properties
const selectedRecipientName = computed(() => {
  const member = familyMembers.value.find(
    (m) => m.userId === form.value.recipientId
  );
  return member ? member.name || member.email : "Recipient";
});

const daysUntilDelivery = computed(() => {
  if (!form.value.deliveryDate) return 0;
  const delivery = new Date(form.value.deliveryDate);
  const now = new Date();
  const diffTime = delivery - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

onMounted(async () => {
  await loadFamilyMembers();
  await loadCapsule();
});

async function loadFamilyMembers() {
  try {
    await authStore.loadFamilyMembers();
    familyMembers.value = authStore.getFamilyMembers.filter(
      (member) => member.userId !== authStore.userId
    );
  } catch (error) {
    console.error("Error loading family members:", error);
    showToastMessage("Error loading family members", "error");
  }
}

async function loadCapsule() {
  try {
    loading.value = true;
    const foundCapsule = await fetchCapsuleById(capsuleId);
    capsule.value = foundCapsule;

    // Populate form with existing data
    form.value = {
      title: foundCapsule.title,
      content: foundCapsule.content,
      deliveryDate: formatDateForInput(foundCapsule.deliveryDate),
      type: foundCapsule.type,
      recipientId: foundCapsule.recipientId,
    };
  } catch (error) {
    showToastMessage("Error loading capsule: " + error.message, "error");
  } finally {
    loading.value = false;
  }
}

async function updateCapsule() {
  try {
    updating.value = true;

    // Transform the form data to match your Firebase structure
    const updateData = {
      title: form.value.title,
      content: form.value.content,
      deliveryDate: new Date(form.value.deliveryDate),
      type: form.value.type,
      recipientId: form.value.recipientId,
    };

    await updateCapsuleById(capsuleId, updateData);

    showToastMessage("Capsule updated successfully!", "success");

    // Redirect back to capsule detail page after a short delay
    setTimeout(() => {
      router.push(`/capsules/${capsuleId}`);
    }, 1500);
  } catch (error) {
    showToastMessage("Error updating capsule: " + error.message, "error");
  } finally {
    updating.value = false;
  }
}

function formatDateForInput(date) {
  if (!date) return "";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toISOString().split("T")[0];
}

function showToastMessage(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
}
</script>
