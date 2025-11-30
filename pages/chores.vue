<template>
    <div class="min-h-screen pb-24">
        <!-- Header -->
        <div class="bg-white pt-16 pb-6 px-4 shadow-sm">
            <div class="max-w-3xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Chores</h1>
                        <p class="text-gray-500 text-sm">Keep the house clean & earn points!</p>
                    </div>
                    <button @click="showCreateModal = true"
                        class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>

                <!-- Tabs -->
                <div class="flex p-1 bg-gray-100 rounded-xl">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                        :class="activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                        {{ tab.label }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>

            <!-- Leaderboard View -->
            <div v-else-if="activeTab === 'leaderboard'">
                <Leaderboard :leaderboard="leaderboard" />
            </div>

            <!-- Chores List View -->
            <div v-else class="space-y-4">
                <div v-if="filteredChores.length === 0" class="text-center py-12">
                    <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-broom text-amber-500 text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">No chores found</h3>
                    <p class="text-gray-500 text-sm mt-1">
                        {{ activeTab === 'my_chores' ? "You're all caught up!" : "No chores in this list." }}
                    </p>
                </div>

                <ChoreCard v-for="chore in filteredChores" :key="chore.id" :chore="chore" @toggle="handleToggle"
                    @delete="handleDelete" @claim="handleClaim" />
            </div>
        </div>

        <!-- Create Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showCreateModal = false"></div>
            <div
                class="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
                <h2 class="text-xl font-bold text-gray-900 mb-6">New Chore</h2>

                <form @submit.prevent="handleCreate" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input v-model="newChore.title" type="text" required placeholder="e.g., Wash the dishes"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                            <select v-model="newChore.points"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all">
                                <option :value="10">10 pts (Easy)</option>
                                <option :value="25">25 pts (Medium)</option>
                                <option :value="50">50 pts (Hard)</option>
                                <option :value="100">100 pts (Epic)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input v-model="newChore.dueDate" type="date"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        <select v-model="newChore.assignedTo"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all">
                            <option :value="null">Unassigned (Anyone)</option>
                            <option v-for="member in authStore.familyMembers" :key="member.userId"
                                :value="member.userId">
                                {{ member.name }}
                            </option>
                        </select>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" @click="showCreateModal = false"
                            class="flex-1 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            class="flex-1 py-3 font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-lg transition-all"
                            :disabled="creating">
                            {{ creating ? 'Creating...' : 'Create Chore' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useChoresStore } from '~/stores/chores';
import { useAuthStore } from '~/stores/auth';
import { storeToRefs } from 'pinia';
import ChoreCard from '~/components/chores/ChoreCard.vue';
import Leaderboard from '~/components/chores/Leaderboard.vue';

useHead({
    title: "Chores",
});

definePageMeta({
    middleware: ["auth"],
});

const choresStore = useChoresStore();
const authStore = useAuthStore();
const { chores, loading, leaderboard, myChores, availableChores, completedChores } = storeToRefs(choresStore);

const activeTab = ref('my_chores');
const showCreateModal = ref(false);
const creating = ref(false);

const tabs = [
    { id: 'my_chores', label: 'My Chores' },
    { id: 'available', label: 'Available' },
    { id: 'completed', label: 'Completed' },
    { id: 'leaderboard', label: 'Leaderboard' },
];

const newChore = ref({
    title: '',
    points: 10,
    dueDate: '',
    assignedTo: null as string | null
});

const filteredChores = computed(() => {
    switch (activeTab.value) {
        case 'my_chores': return myChores.value;
        case 'available': return availableChores.value;
        case 'completed': return completedChores.value;
        default: return [];
    }
});

onMounted(() => {
    choresStore.subscribeToChores();
});

onUnmounted(() => {
    choresStore.cleanup();
});

const handleCreate = async () => {
    if (!newChore.value.title) return;

    creating.value = true;
    try {
        await choresStore.createChore({
            title: newChore.value.title,
            points: newChore.value.points,
            assignedTo: newChore.value.assignedTo,
            dueDate: newChore.value.dueDate || undefined
        });
        showCreateModal.value = false;
        newChore.value = { title: '', points: 10, dueDate: '', assignedTo: null };
    } catch (e) {
        console.error(e);
        alert('Failed to create chore');
    } finally {
        creating.value = false;
    }
};

const handleToggle = async (chore: any) => {
    try {
        await choresStore.toggleComplete(chore);
    } catch (e) {
        console.error(e);
        alert('Failed to update chore');
    }
};

const handleClaim = async (choreId: string) => {
    if (!authStore.user) return;
    try {
        await choresStore.assignChore(choreId, authStore.user.uid);
        activeTab.value = 'my_chores'; // Switch to my chores to show it
    } catch (e) {
        console.error(e);
        alert('Failed to claim chore');
    }
};

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chore?')) return;
    try {
        await choresStore.deleteChore(id);
    } catch (e) {
        console.error(e);
        alert('Failed to delete chore');
    }
};
</script>
