<template>
    <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <h2 class="text-xl font-bold flex items-center gap-2">
                <i class="fas fa-trophy text-yellow-300"></i>
                Leaderboard
            </h2>
            <p class="text-amber-100 text-sm mt-1">Who's leading the chores race?</p>
        </div>

        <div class="divide-y divide-gray-100">
            <div v-for="(entry, index) in leaderboard" :key="entry.userId"
                class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <!-- Rank -->
                <div class="w-8 h-8 flex items-center justify-center font-bold rounded-full text-sm"
                    :class="getRankClass(index)">
                    {{ index + 1 }}
                </div>

                <!-- Avatar/Name -->
                <div class="flex-1 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img v-if="entry.avatar" :src="entry.avatar" :alt="entry.name"
                            class="w-full h-full object-cover" />
                        <span v-else class="text-gray-500 font-bold">{{ entry.name.charAt(0) }}</span>
                    </div>
                    <div>
                        <div class="font-bold text-gray-900">{{ entry.name }}</div>
                        <div class="text-xs text-gray-500">{{ entry.tasksCompleted }} tasks done</div>
                    </div>
                </div>

                <!-- Points -->
                <div class="text-right">
                    <div class="font-bold text-amber-600 text-lg">{{ entry.points }}</div>
                    <div class="text-xs text-amber-600/70 font-medium">points</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from '~/stores/chores';

defineProps<{
    leaderboard: LeaderboardEntry[];
}>();

const getRankClass = (index: number) => {
    switch (index) {
        case 0: return 'bg-yellow-100 text-yellow-700';
        case 1: return 'bg-gray-100 text-gray-700';
        case 2: return 'bg-orange-100 text-orange-700';
        default: return 'text-gray-400';
    }
};
</script>
