<template>
    <div class="group bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-700 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
        @click="$emit('click', list.id)">
        <!-- Header -->
        <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <i class="fas fa-list-ul"></i>
                </div>
                <div>
                    <h3
                        class="font-bold text-stone-800 dark:text-stone-100 text-lg leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {{ list.name }}
                    </h3>
                    <p class="text-xs text-stone-400 dark:text-stone-500 font-medium mt-0.5">
                        Created {{ formatDate(list.createdAt) }}
                    </p>
                </div>
            </div>

            <button @click.stop="$emit('delete', list.id)"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-stone-300 dark:text-stone-600 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all opacity-0 group-hover:opacity-100">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>

        <!-- Progress Bar (Mockup) -->
        <div class="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-primary-400 to-primary-500 h-full rounded-full w-1/3"></div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <div class="flex -space-x-2">
                <!-- Mock Avatars (In real app, fetch contributors) -->
                <div
                    class="w-6 h-6 rounded-full border-2 border-white dark:border-stone-800 bg-secondary-200 dark:bg-secondary-700">
                </div>
                <div
                    class="w-6 h-6 rounded-full border-2 border-white dark:border-stone-800 bg-accent-200 dark:bg-accent-700">
                </div>
            </div>
            <span>View Items <i
                    class="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { List } from '~/stores/lists';

const props = defineProps<{
    list: List;
}>();

defineEmits(['click', 'delete']);

const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Handle Firestore timestamp or Date object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>
