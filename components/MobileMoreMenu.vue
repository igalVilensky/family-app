<template>
    <div class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center pointer-events-none">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
            @click="$emit('close')"></div>

        <!-- Menu Sheet -->
        <div
            class="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-transform duration-300 pointer-events-auto animate-in slide-in-from-bottom-10">
            <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

            <h3 class="text-lg font-bold text-gray-900 mb-4 px-2">More Features</h3>

            <div class="grid grid-cols-4 gap-4 mb-6">
                <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="$emit('close')"
                    class="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110"
                        :class="item.bgClass">
                        <i :class="['fas', item.icon, item.textClass]"></i>
                    </div>
                    <span class="text-xs font-medium text-gray-600 text-center leading-tight">{{ item.label }}</span>
                </NuxtLink>
            </div>

            <div class="border-t border-gray-100 pt-4">
                <button @click="$emit('logout')"
                    class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <span class="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineEmits(['close', 'logout']);

const menuItems = [
    {
        label: 'Feed',
        path: '/feed',
        icon: 'fa-heart',
        bgClass: 'bg-rose-100',
        textClass: 'text-rose-600'
    },
    {
        label: 'Family',
        path: '/family', // Note: Needs dynamic ID handling in parent or store
        icon: 'fa-users',
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-600'
    },
    {
        label: 'Chores',
        path: '/chores',
        icon: 'fa-broom',
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-600'
    },
    {
        label: 'Capsules',
        path: '/capsules',
        icon: 'fa-clock',
        bgClass: 'bg-purple-100',
        textClass: 'text-purple-600'
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: 'fa-user',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-600'
    },
    {
        label: 'Support',
        path: '/support',
        icon: 'fa-headset',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-600'
    },
];
</script>
