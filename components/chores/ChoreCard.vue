<template>
    <div class="group bg-white dark:bg-stone-800 rounded-3xl p-5 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        :class="{ 'opacity-60 bg-stone-50 dark:bg-stone-900': chore.isCompleted }">
        <!-- Checkbox/Status -->
        <button @click="$emit('toggle', chore)"
            class="w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300"
            :class="chore.isCompleted
                ? 'bg-secondary-500 border-secondary-500 scale-110'
                : 'border-stone-200 dark:border-stone-600 hover:border-secondary-400 dark:hover:border-secondary-400 text-transparent hover:text-secondary-200'">
            <i class="fas fa-check text-white text-sm" :class="{ 'opacity-0': !chore.isCompleted }"></i>
        </button>

        <!-- Content -->
        <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="font-bold text-stone-800 dark:text-stone-100 truncate transition-all"
                    :class="{ 'line-through text-stone-400 dark:text-stone-500': chore.isCompleted }">
                    {{ chore.title }}
                </h3>
                <span
                    class="px-2.5 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-bold rounded-full flex-shrink-0 shadow-sm">
                    {{ chore.points }} pts
                </span>
            </div>

            <div class="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <!-- Assignee -->
                <div v-if="chore.assignedTo"
                    class="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded-lg">
                    <div
                        class="w-4 h-4 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center overflow-hidden">
                        <img v-if="getAssigneeAvatar(chore.assignedTo)" :src="getAssigneeAvatar(chore.assignedTo)"
                            class="w-full h-full object-cover" />
                        <i v-else class="fas fa-user text-[8px] text-white"></i>
                    </div>
                    <span>{{ getAssigneeName(chore.assignedTo) }}</span>
                </div>
                <div v-else class="flex items-center gap-1 text-stone-400 dark:text-stone-500 italic">
                    <i class="fas fa-user-slash"></i>
                    Unassigned
                </div>

                <!-- Due Date -->
                <div v-if="chore.dueDate" class="flex items-center gap-1"
                    :class="{ 'text-primary-600 dark:text-primary-400': isOverdue(chore.dueDate) }">
                    <i class="fas fa-clock"></i>
                    {{ formatDate(chore.dueDate) }}
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <!-- Claim Button -->
            <button v-if="!chore.assignedTo" @click="$emit('claim', chore.id)"
                class="px-3 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 text-xs font-bold rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-800/50 transition-colors">
                Claim
            </button>

            <!-- Delete Button -->
            <button @click="$emit('delete', chore.id)"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Chore } from '~/stores/chores';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
    chore: Chore;
}>();

defineEmits(['toggle', 'delete', 'claim']);

const authStore = useAuthStore();

const getAssigneeName = (userId: string) => {
    const member = authStore.familyMembers.find(m => m.userId === userId);
    return member ? member.name : 'Unknown';
};

const getAssigneeAvatar = (userId: string) => {
    const member = authStore.familyMembers.find(m => m.userId === userId);
    return member ? member.avatar : null;
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (dateStr: string) => {
    if (props.chore.isCompleted) return false;
    const due = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return due < now;
};
</script>
