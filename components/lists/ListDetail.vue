<template>
    <div
        class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white overflow-hidden flex flex-col h-[80vh] md:h-[600px]">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
            <div class="flex items-center gap-4">
                <button @click="$emit('close')"
                    class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {{ list.title }}
                        <span class="text-sm font-normal px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                            {{ items.length }} items
                        </span>
                    </h2>
                    <p class="text-sm text-gray-500">
                        {{ list.type === 'shopping' ? 'Shopping List' : 'To-Do List' }}
                    </p>
                </div>
            </div>

            <button @click="deleteList" class="text-red-400 hover:text-red-600 p-2 transition-colors"
                title="Delete List">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-3">
            <!-- Add Item Input -->
            <div class="flex gap-3 mb-6">
                <input v-model="newItemText" @keyup.enter="addItem" type="text" placeholder="Add a new item..."
                    class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
                <button @click="addItem" :disabled="!newItemText.trim()"
                    class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <!-- Active Items -->
            <div v-if="activeItems.length > 0" class="space-y-2">
                <div v-for="item in activeItems" :key="item.id"
                    class="group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                    <button @click="toggleItem(item)"
                        class="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors">
                    </button>
                    <span class="flex-1 text-gray-800 font-medium">{{ item.text }}</span>
                    <button @click="deleteItem(item.id)"
                        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 transition-all">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="completedItems.length === 0" class="text-center py-12 text-gray-400">
                <i class="fas fa-clipboard-list text-4xl mb-3 opacity-50"></i>
                <p>List is empty. Add your first item!</p>
            </div>

            <!-- Completed Items -->
            <div v-if="completedItems.length > 0" class="mt-8">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    Completed
                    <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{{ completedItems.length
                        }}</span>
                </h3>
                <div class="space-y-2 opacity-60">
                    <div v-for="item in completedItems" :key="item.id"
                        class="group flex items-center gap-3 p-3 bg-gray-50 border border-transparent rounded-xl">
                        <button @click="toggleItem(item)"
                            class="w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center text-white text-xs">
                            <i class="fas fa-check"></i>
                        </button>
                        <span class="flex-1 text-gray-500 line-through">{{ item.text }}</span>
                        <button @click="deleteItem(item.id)"
                            class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useListsStore, type List, type ListItem } from '~/stores/lists';

const props = defineProps<{
    list: List;
}>();

const emit = defineEmits(['close', 'delete']);

const listsStore = useListsStore();
const newItemText = ref('');
const items = ref<ListItem[]>([]);
let unsubscribe: (() => void) | null = null;

const activeItems = computed(() => items.value.filter(i => !i.isCompleted));
const completedItems = computed(() => items.value.filter(i => i.isCompleted));

onMounted(() => {
    unsubscribe = listsStore.subscribeToListItems(props.list.id, (newItems) => {
        items.value = newItems;
    });
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});

const addItem = async () => {
    if (!newItemText.value.trim()) return;
    try {
        await listsStore.addItem(props.list.id, newItemText.value);
        newItemText.value = '';
    } catch (e) {
        console.error(e);
    }
};

const toggleItem = async (item: ListItem) => {
    try {
        await listsStore.toggleItem(props.list.id, item.id, !item.isCompleted);
    } catch (e) {
        console.error(e);
    }
};

const deleteItem = async (itemId: string) => {
    if (!confirm('Delete this item?')) return;
    try {
        await listsStore.deleteItem(props.list.id, itemId);
    } catch (e) {
        console.error(e);
    }
};

const deleteList = async () => {
    if (!confirm('Are you sure you want to delete this entire list?')) return;
    try {
        await listsStore.deleteList(props.list.id);
        emit('close');
    } catch (e) {
        console.error(e);
    }
};
</script>
