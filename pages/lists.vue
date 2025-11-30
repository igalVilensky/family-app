<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50 pb-24 md:pb-8">
        <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
                        Shared Lists
                    </h1>
                    <p class="text-gray-600 mt-2 text-lg font-medium">
                        Manage shopping, to-dos, and more together.
                    </p>
                </div>

                <button @click="showCreateModal = true"
                    class="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 shadow-lg shadow-blue-200">
                    <i class="fas fa-plus"></i>
                    <span>New List</span>
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="listsStore.loading && listsStore.lists.length === 0" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- Lists Grid -->
            <div v-else-if="listsStore.lists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListCard v-for="list in listsStore.lists" :key="list.id" :list="list" @click="openList(list)" />
            </div>

            <!-- Empty State -->
            <div v-else
                class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300">
                <div
                    class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-3xl">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">No lists yet</h3>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">Create your first shared list to start organizing tasks
                    and shopping items with your family.</p>
                <button @click="showCreateModal = true"
                    class="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                    Create First List
                </button>
            </div>
        </div>

        <!-- List Detail Modal -->
        <div v-if="selectedList"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            @click.self="selectedList = null">
            <div class="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
                <ListDetail :list="selectedList" @close="selectedList = null" />
            </div>
        </div>

        <!-- Create List Modal -->
        <div v-if="showCreateModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            @click.self="showCreateModal = false">
            <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Create New List</h2>

                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">List Title</label>
                        <input v-model="newList.title" type="text" placeholder="e.g., Groceries, Weekend Chores"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <div class="grid grid-cols-2 gap-4">
                            <button @click="newList.type = 'shopping'; newList.icon = 'fa-shopping-cart'"
                                class="p-4 rounded-xl border-2 text-center transition-all"
                                :class="newList.type === 'shopping' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'">
                                <i class="fas fa-shopping-cart text-xl mb-2 block"></i>
                                <span class="font-bold text-sm">Shopping</span>
                            </button>
                            <button @click="newList.type = 'todo'; newList.icon = 'fa-check-square'"
                                class="p-4 rounded-xl border-2 text-center transition-all"
                                :class="newList.type === 'todo' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'">
                                <i class="fas fa-check-square text-xl mb-2 block"></i>
                                <span class="font-bold text-sm">To-Do</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div class="flex flex-wrap gap-3">
                            <button v-for="color in ['blue', 'red', 'green', 'orange', 'purple', 'pink']" :key="color"
                                @click="newList.color = color"
                                class="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2"
                                :class="[
                                    `bg-${color}-500`,
                                    newList.color === color ? 'ring-gray-400 scale-110' : 'ring-transparent'
                                ]"></button>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button @click="showCreateModal = false"
                            class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button @click="createList" :disabled="!newList.title"
                            class="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-200">
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useListsStore, type List } from '~/stores/lists';
import ListCard from '~/components/lists/ListCard.vue';
import ListDetail from '~/components/lists/ListDetail.vue';

const listsStore = useListsStore();
const showCreateModal = ref(false);
const selectedList = ref<List | null>(null);

const newList = ref({
    title: '',
    type: 'shopping' as 'shopping' | 'todo',
    icon: 'fa-shopping-cart',
    color: 'blue'
});

onMounted(() => {
    listsStore.initListsListener();
});

onUnmounted(() => {
    if (listsStore.unsubscribe) {
        listsStore.unsubscribe();
    }
});

const openList = (list: List) => {
    selectedList.value = list;
};

const createList = async () => {
    if (!newList.value.title) return;

    try {
        await listsStore.createList(newList.value);
        showCreateModal.value = false;
        // Reset form
        newList.value = {
            title: '',
            type: 'shopping',
            icon: 'fa-shopping-cart',
            color: 'blue'
        };
    } catch (e) {
        console.error(e);
    }
};

useHead({
    title: "Shared Lists",
});

definePageMeta({
    middleware: ["auth"],
});
</script>
