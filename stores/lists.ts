import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { useAuthStore } from "./auth";

export interface ListItem {
  id: string;
  text: string;
  isCompleted: boolean;
  addedBy: string;
  createdAt: any;
}

export interface List {
  id: string;
  title: string;
  icon: string;
  color: string;
  type: "shopping" | "todo";
  createdAt: any;
  createdBy: string;
  items?: ListItem[];
}

export const useListsStore = defineStore("lists", {
  state: () => ({
    lists: [] as List[],
    loading: false,
    error: null as string | null,
    unsubscribe: null as (() => void) | null,
  }),

  actions: {
    async initListsListener() {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId) return;

      this.loading = true;

      // Unsubscribe from previous listener if exists
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      const listsRef = collection(
        $firestore,
        `families/${authStore.currentFamilyId}/lists`
      );
      const q = query(listsRef, orderBy("createdAt", "desc"));

      this.unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          this.lists = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            items: [], // Items will be loaded separately or via subcollection listener if needed
          })) as List[];
          this.loading = false;
        },
        (error) => {
          console.error("Error fetching lists:", error);
          this.error = error.message;
          this.loading = false;
        }
      );
    },

    async createList(list: Omit<List, "id" | "createdAt" | "createdBy">) {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId || !authStore.user) return;

      try {
        await addDoc(
          collection($firestore, `families/${authStore.currentFamilyId}/lists`),
          {
            ...list,
            createdAt: serverTimestamp(),
            createdBy: authStore.user.uid,
          }
        );
      } catch (error: any) {
        console.error("Error creating list:", error);
        this.error = error.message;
        throw error;
      }
    },

    async deleteList(listId: string) {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId) return;

      try {
        await deleteDoc(
          doc($firestore, `families/${authStore.currentFamilyId}/lists`, listId)
        );
      } catch (error: any) {
        console.error("Error deleting list:", error);
        this.error = error.message;
        throw error;
      }
    },

    // Sub-collection for items
    async addItem(listId: string, text: string) {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId || !authStore.user) return;

      try {
        await addDoc(
          collection(
            $firestore,
            `families/${authStore.currentFamilyId}/lists/${listId}/items`
          ),
          {
            text,
            isCompleted: false,
            addedBy: authStore.user.uid,
            createdAt: serverTimestamp(),
          }
        );
      } catch (error: any) {
        console.error("Error adding item:", error);
        this.error = error.message;
        throw error;
      }
    },

    async toggleItem(listId: string, itemId: string, isCompleted: boolean) {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId) return;

      try {
        await updateDoc(
          doc(
            $firestore,
            `families/${authStore.currentFamilyId}/lists/${listId}/items`,
            itemId
          ),
          {
            isCompleted,
          }
        );
      } catch (error: any) {
        console.error("Error toggling item:", error);
        this.error = error.message;
        throw error;
      }
    },

    async deleteItem(listId: string, itemId: string) {
      const { $firestore } = useNuxtApp();
      const authStore = useAuthStore();

      if (!authStore.currentFamilyId) return;

      try {
        await deleteDoc(
          doc(
            $firestore,
            `families/${authStore.currentFamilyId}/lists/${listId}/items`,
            itemId
          )
        );
      } catch (error: any) {
        console.error("Error deleting item:", error);
        this.error = error.message;
        throw error;
      }
    },
    
    // Helper to listen to items of a specific list
    subscribeToListItems(listId: string, callback: (items: ListItem[]) => void) {
       const { $firestore } = useNuxtApp();
       const authStore = useAuthStore();
       
       if (!authStore.currentFamilyId) return () => {};

       const itemsRef = collection($firestore, `families/${authStore.currentFamilyId}/lists/${listId}/items`);
       // Order by created at usually makes sense, or maybe by completion status
       const q = query(itemsRef, orderBy("createdAt", "asc"));
       
       return onSnapshot(q, (snapshot) => {
         const items = snapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data()
         })) as ListItem[];
         callback(items);
       });
    }
  },
});
