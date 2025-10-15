<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink
          to="/capsules"
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
        >
          <i class="fas fa-arrow-left text-sm"></i>
          Back to Capsules
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Create Memory Capsule
          </h1>
          <p class="text-gray-600 mt-2">
            Send a private message to a family member for the future
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-edit text-white text-lg"></i>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  Capsule Content
                </h3>
                <p class="text-gray-500 text-sm">
                  Create a private message for a family member's future
                </p>
              </div>
            </div>

            <form @submit.prevent="createCapsule" class="space-y-6">
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
                    @click="selectRecipient(member.userId)"
                    class="flex items-center gap-3 p-4 border-2 rounded-xl transition-all duration-200 text-left"
                    :class="
                      capsuleForm.recipientId === member.userId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    "
                  >
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-sm font-medium text-blue-600">
                        {{
                          member.name
                            ? member.name.charAt(0).toUpperCase()
                            : "?"
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
                      v-if="capsuleForm.recipientId === member.userId"
                      class="fas fa-check text-blue-500 text-sm flex-shrink-0"
                    ></i>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  Choose who will receive this message. They won't see it until
                  the delivery date.
                </p>
              </div>

              <!-- Title -->
              <div>
                <label
                  for="title"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Capsule Title *
                </label>
                <input
                  type="text"
                  id="title"
                  v-model="capsuleForm.title"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="e.g., Birthday Wishes, Letter for Your Graduation"
                  required
                  maxlength="100"
                />
                <div class="flex justify-between items-center mt-2">
                  <p class="text-xs text-gray-500">
                    Give your capsule a meaningful title
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ capsuleForm.title.length }}/100
                  </p>
                </div>
              </div>

              <!-- Content -->
              <div>
                <label
                  for="content"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Your Message *
                </label>
                <textarea
                  id="content"
                  v-model="capsuleForm.content"
                  rows="8"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                  placeholder="Write your heartfelt message here... This will be a surprise for your chosen recipient on the delivery date."
                  required
                  maxlength="2000"
                ></textarea>
                <div class="flex justify-between items-center mt-2">
                  <p class="text-xs text-gray-500">
                    Express your thoughts and feelings
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ capsuleForm.content.length }}/2000
                  </p>
                </div>
              </div>

              <!-- Delivery Date -->
              <div>
                <label
                  for="deliveryDate"
                  class="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Delivery Date *
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  v-model="capsuleForm.deliveryDate"
                  :min="minDate"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  required
                />
                <p class="text-xs text-gray-500 mt-2">
                  Choose when you want this capsule to be delivered to
                  {{ selectedRecipientName }}.
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

              <!-- Capsule Type -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Capsule Type
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <label
                    v-for="type in capsuleTypes"
                    :key="type.value"
                    class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
                    :class="
                      capsuleForm.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    "
                  >
                    <input
                      type="radio"
                      v-model="capsuleForm.type"
                      :value="type.value"
                      class="hidden"
                    />
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="type.bgColor"
                    >
                      <i class="text-white" :class="type.icon"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ type.label }}</p>
                      <p class="text-xs text-gray-500">
                        {{ type.description }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                :disabled="creating || !isFormValid"
              >
                <i
                  class="fas fa-plus text-sm"
                  :class="{ 'animate-spin': creating }"
                ></i>
                {{
                  creating
                    ? "Creating Capsule..."
                    : `Create for ${selectedRecipientName}`
                }}
              </button>
            </form>
          </div>
        </div>

        <!-- Sidebar - Tips & Info -->
        <div class="space-y-6">
          <!-- Privacy Info -->
          <div
            class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-lock text-lg"></i>
              </div>
              <div>
                <h3 class="font-semibold text-lg">Private & Secure</h3>
                <p class="text-purple-100 text-sm">
                  Only you and the recipient
                </p>
              </div>
            </div>
            <p class="text-purple-100 text-sm">
              This message is completely private.
              {{ selectedRecipientName }} won't know about it until the delivery
              date.
            </p>
          </div>

          <!-- Writing Tips -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-lightbulb text-white text-lg"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Writing Tips</h3>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  Write as if you're speaking directly to
                  {{ selectedRecipientName }}
                </p>
              </div>
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  Share memories, hopes, or advice for their future
                </p>
              </div>
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-check text-green-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  Consider what will be meaningful to them on that date
                </p>
              </div>
            </div>
          </div>

          <!-- Delivery Info -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
              >
                <i class="fas fa-paper-plane text-white text-lg"></i>
              </div>
              <h3 class="font-semibold text-gray-900">Delivery Details</h3>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-info-circle text-blue-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  Capsule will be automatically delivered to
                  {{ selectedRecipientName }}
                </p>
              </div>
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-info-circle text-blue-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  {{ selectedRecipientName }} will receive a notification
                </p>
              </div>
              <div class="flex items-start gap-2">
                <i
                  class="fas fa-info-circle text-blue-500 text-xs mt-1 flex-shrink-0"
                ></i>
                <p class="text-gray-600">
                  You can cancel delivery anytime before the date
                </p>
              </div>
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
import { useAuthStore } from "~/stores/auth";
import { useCapsules } from "~/composables/useCapsules";

const authStore = useAuthStore();
const router = useRouter();
const { createNewCapsule, loading: creating, error } = useCapsules();

const capsuleForm = ref({
  recipientId: "",
  title: "",
  content: "",
  deliveryDate: "",
  type: "text",
});

const familyMembers = ref([]);
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const capsuleTypes = [
  {
    value: "text",
    label: "Text Message",
    description: "A personal written message",
    icon: "fas fa-file-alt",
    bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    value: "letter",
    label: "Formal Letter",
    description: "A structured letter format",
    icon: "fas fa-envelope",
    bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
];

const minDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
});

const selectedRecipientName = computed(() => {
  if (!capsuleForm.value.recipientId) return "a family member";
  const member = familyMembers.value.find(
    (m) => m.userId === capsuleForm.value.recipientId
  );
  return member?.name || "this person";
});

const daysUntilDelivery = computed(() => {
  if (!capsuleForm.value.deliveryDate) return 0;
  const delivery = new Date(capsuleForm.value.deliveryDate);
  const today = new Date();
  const diffTime = delivery - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

const isFormValid = computed(() => {
  return (
    capsuleForm.value.recipientId &&
    capsuleForm.value.title.trim() &&
    capsuleForm.value.content.trim() &&
    capsuleForm.value.deliveryDate &&
    daysUntilDelivery.value >= 7
  );
});

onMounted(async () => {
  // Load family members
  await authStore.loadFamilyMembers();
  familyMembers.value = authStore.getFamilyMembers.filter(
    (member) => member.userId !== authStore.userId
  );

  // Set default date (30 days from now)
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  capsuleForm.value.deliveryDate = defaultDate.toISOString().split("T")[0];

  // Auto-select first family member if available
  if (familyMembers.value.length > 0) {
    capsuleForm.value.recipientId = familyMembers.value[0].userId;
  }
});

function selectRecipient(userId) {
  capsuleForm.value.recipientId = userId;
}

async function createCapsule() {
  try {
    if (!isFormValid.value) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    const result = await createNewCapsule(capsuleForm.value);

    if (error.value) {
      showToast(error.value, "error");
      return;
    }

    showToast(
      `Memory capsule created for ${selectedRecipientName.value}! 🎉`,
      "success"
    );

    setTimeout(() => {
      router.push("/capsules");
    }, 2000);
  } catch (err) {
    console.error("Create capsule error:", err);
    showToast(
      err.message || "Failed to create capsule. Please try again.",
      "error"
    );
  }
}

function showToast(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;
  setTimeout(() => {
    showToastMessage.value = false;
  }, 5000);
}
</script>
