<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-stone-700">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Family</h1>
                    <p class="text-gray-500 dark:text-gray-400 mt-1">Manage members and settings for {{
                        authStore.currentFamilyName }}</p>
                </div>
                <button @click="showInviteModal = true"
                    class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-user-plus"></i>
                    Invite Member
                </button>
            </div>
        </div>

        <!-- Members Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="member in authStore.familyMembers" :key="member.userId"
                class="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-stone-700 flex items-center gap-4">
                <div
                    class="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-stone-600 shadow-sm">
                    <img v-if="member.avatar" :src="member.avatar" :alt="member.name"
                        class="w-full h-full object-cover" />
                    <i v-else class="fas fa-user text-stone-400 dark:text-stone-500 text-xl"></i>
                </div>
                <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                    <p class="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider mt-0.5">
                        {{ member.role || 'Member' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const showInviteModal = ref(false);
</script>
