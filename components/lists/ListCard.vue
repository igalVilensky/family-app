<template>
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300 cursor-pointer group overflow-hidden"
        @click="$emit('click')">
        <div class="p-5">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-300"
                    :class="iconBgColor">
                    <i :class="['fas', list.icon || 'fa-list', 'text-xl']"></i>
                </div>
                <div class="flex gap-2">
                    <span class="px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider"
                        :class="typeBadgeClass">
                        {{ list.type }}
                    </span>
                </div>
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {{ list.title }}
            </h3>

            <p class="text-gray-500 text-xs mb-4">
                Created {{ formatDate(list.createdAt) }}
            </p>

            <!-- Mini Preview of Items (if available) -->
            <div v-if="previewItems.length > 0" class="space-y-2 mb-4">
                <div v-for="item in previewItems" :key="item.id" class="flex items-center gap-2 text-sm text-gray-600">
                    <div class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div v-if="item.isCompleted" class="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span :class="{ 'line-through text-gray-400': item.isCompleted }" class="truncate">
                        {{ item.text }}
                    </span>
                </div>
                <div v-if="items.length > 3" class="text-xs text-gray-400 pl-6">
                    + {{ items.length - 3 }} more items
                </div>
            </div>
            <div v-else class="text-sm text-gray-400 italic mb-4">
                No items yet
            </div>

            <!-- Progress Bar (Fake for now as we might not have all items loaded in card view, but good for visual) -->
            <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="progressBarColor"
                    :style="{ width: completionPercentage + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useListsStore, type List, type ListItem } from '~/stores/lists';

const props = defineProps<{
    list: List;
}>();

defineEmits(['click']);

const listsStore = useListsStore();
const items = ref<ListItem[]>([]);
let unsubscribe: (() => void) | null = null;

onMounted(() => {
    unsubscribe = listsStore.subscribeToListItems(props.list.id, (newItems) => {
        items.value = newItems;
    });
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});

const iconBgColor = computed(() => {
    const colors: Record<string, string> = {
        red: 'bg-gradient-to-br from-red-400 to-red-600',
        orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
        amber: 'bg-gradient-to-br from-amber-400 to-amber-600',
        green: 'bg-gradient-to-br from-green-400 to-green-600',
        blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
        indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
        purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
        pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
        gray: 'bg-gradient-to-br from-gray-400 to-gray-600',
    };
    return colors[props.list.color] || colors.blue;
});

const progressBarColor = computed(() => {
    const colors: Record<string, string> = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        amber: 'bg-amber-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        gray: 'bg-gray-500',
    };
    return colors[props.list.color] || 'bg-blue-500';
});

const typeBadgeClass = computed(() => {
    return props.list.type === 'shopping'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-blue-100 text-blue-700';
});

const previewItems = computed(() => {
    return items.value.slice(0, 3);
});

const completionPercentage = computed(() => {
    if (items.value.length === 0) return 0;
    const completed = items.value.filter(i => i.isCompleted).length;
    return (completed / items.value.length) * 100;
});

const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
</script>
