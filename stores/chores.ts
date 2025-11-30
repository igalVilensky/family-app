import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { useNuxtApp } from '#app';
import { useAuthStore } from './auth';

export interface Chore {
    id: string;
    title: string;
    points: number;
    assignedTo: string | null; // userId or null for unassigned
    assignedToName?: string;
    assignedToAvatar?: string;
    isCompleted: boolean;
    completedBy?: string;
    completedAt?: any;
    dueDate?: string; // ISO date string
    createdAt: any;
    familyId: string;
}

export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    points: number;
    tasksCompleted: number;
}

export const useChoresStore = defineStore('chores', () => {
    const { $firestore } = useNuxtApp();
    const authStore = useAuthStore();

    const chores = ref<Chore[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    let unsubscribe: (() => void) | null = null;

    // Getters
    const myChores = computed(() => {
        if (!authStore.user) return [];
        return chores.value.filter(c => c.assignedTo === authStore.user?.uid && !c.isCompleted);
    });

    const availableChores = computed(() => {
        return chores.value.filter(c => !c.assignedTo && !c.isCompleted);
    });

    const completedChores = computed(() => {
        return chores.value.filter(c => c.isCompleted);
    });

    const leaderboard = computed(() => {
        const stats: Record<string, LeaderboardEntry> = {};

        // Initialize with family members
        authStore.familyMembers.forEach(member => {
            stats[member.userId] = {
                userId: member.userId,
                name: member.name || 'Unknown',
                avatar: member.avatar,
                points: 0,
                tasksCompleted: 0
            };
        });

        // Aggregate points from completed chores
        // Note: In a real app, you might want a separate 'points_history' collection 
        // to track points over time or reset them weekly. For now, we sum all completed chores.
        chores.value.forEach(chore => {
            if (chore.isCompleted && chore.completedBy && stats[chore.completedBy]) {
                stats[chore.completedBy].points += chore.points;
                stats[chore.completedBy].tasksCompleted += 1;
            }
        });

        return Object.values(stats).sort((a, b) => b.points - a.points);
    });

    // Actions
    const subscribeToChores = () => {
        if (!authStore.currentFamilyId) return;
        if (unsubscribe) unsubscribe();

        loading.value = true;
        const q = query(
            collection($firestore, `families/${authStore.currentFamilyId}/chores`),
            orderBy('createdAt', 'desc')
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
            chores.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Chore));
            loading.value = false;
        }, (err) => {
            console.error('Error fetching chores:', err);
            error.value = err.message;
            loading.value = false;
        });
    };

    const createChore = async (chore: Omit<Chore, 'id' | 'createdAt' | 'familyId' | 'isCompleted'>) => {
        if (!authStore.currentFamilyId) throw new Error('No family selected');

        // Remove undefined values
        const sanitizedChore = Object.fromEntries(
            Object.entries(chore).filter(([_, v]) => v !== undefined)
        );

        try {
            await addDoc(collection($firestore, `families/${authStore.currentFamilyId}/chores`), {
                ...sanitizedChore,
                isCompleted: false,
                familyId: authStore.currentFamilyId,
                createdAt: serverTimestamp()
            });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        }
    };

    const updateChore = async (id: string, updates: Partial<Chore>) => {
        if (!authStore.currentFamilyId) return;
        try {
            const choreRef = doc($firestore, `families/${authStore.currentFamilyId}/chores`, id);
            await updateDoc(choreRef, updates);
        } catch (e: any) {
            error.value = e.message;
            throw e;
        }
    };

    const assignChore = async (choreId: string, userId: string) => {
        await updateChore(choreId, { assignedTo: userId });
    };

    const toggleComplete = async (chore: Chore) => {
        if (!authStore.currentFamilyId || !authStore.user) return;

        const isCompleted = !chore.isCompleted;
        const updates: any = {
            isCompleted,
            completedBy: isCompleted ? authStore.user.uid : null,
            completedAt: isCompleted ? serverTimestamp() : null
        };

        await updateChore(chore.id, updates);
    };

    const deleteChore = async (id: string) => {
        if (!authStore.currentFamilyId) return;
        try {
            await deleteDoc(doc($firestore, `families/${authStore.currentFamilyId}/chores`, id));
        } catch (e: any) {
            error.value = e.message;
            throw e;
        }
    };

    const cleanup = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        chores.value = [];
    };

    return {
        chores,
        loading,
        error,
        myChores,
        availableChores,
        completedChores,
        leaderboard,
        subscribeToChores,
        createChore,
        updateChore,
        assignChore,
        toggleComplete,
        deleteChore,
        cleanup
    };
});
