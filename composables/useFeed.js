import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { useNuxtApp } from "#app";
import { checkUserLike } from "~/utils/feedInteractions";

export const useFeed = () => {
  const { $firestore: db } = useNuxtApp();
  const authStore = useAuthStore();

  const posts = ref([]);
  const events = ref([]);
  const capsules = ref([]);
  const loading = ref(true);

  // Fetch all feed data
  const fetchFeedData = async () => {
    if (!authStore.currentFamilyId) return;

    loading.value = true;
    try {
      await Promise.all([fetchPosts(), fetchEvents(), fetchCapsules()]);
    } catch (error) {
      console.error("Error fetching feed data:", error);
    } finally {
      loading.value = false;
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    if (!authStore.currentFamilyId) return;

    const postsQuery = query(
      collection(db, "posts"),
      where("familyId", "==", authStore.currentFamilyId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          // Check if current user liked this post
          const isLiked = await checkUserLike(doc.id);

          return {
            id: doc.id,
            ...data,
            type: "post",
            isLiked,
          };
        })
      );

      posts.value = postsData;
    });

    return unsubscribe;
  };

  // Fetch events (last 30 days and future)
  const fetchEvents = async () => {
    if (!authStore.currentFamilyId) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const eventsQuery = query(
      collection(db, "families", authStore.currentFamilyId, "events"),
      where("startDate", ">=", thirtyDaysAgo.toISOString()),
      orderBy("startDate", "desc"),
      limit(20)
    );

    try {
      const snapshot = await getDocs(eventsQuery);
      events.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "event",
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch recent capsules
  const fetchCapsules = async () => {
    if (!authStore.currentFamilyId) return;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const capsulesQuery = query(
      collection(db, "capsules"),
      where("familyId", "==", authStore.currentFamilyId),
      where("status", "in", ["delivered", "scheduled"]),
      orderBy("deliveryDate", "desc"),
      limit(20)
    );

    try {
      const snapshot = await getDocs(capsulesQuery);
      capsules.value = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          type: "capsule",
          // Only show content if delivered and user is recipient or creator
          content:
            data.status === "delivered" &&
            (data.recipientId === authStore.userId ||
              data.createdBy === authStore.userId)
              ? data.content
              : "A time capsule was delivered",
        };
      });
    } catch (error) {
      console.error("Error fetching capsules:", error);
    }
  };
  const setupPostLikesListener = (postId) => {
    if (!authStore.currentFamilyId) return;

    const likesQuery = query(
      collection(db, "posts", postId, "likes"),
      where("userId", "==", authStore.userId)
    );

    return onSnapshot(likesQuery, (snapshot) => {
      const postIndex = posts.value.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        posts.value[postIndex].isLiked = !snapshot.empty;
      }
    });
  };

  // Generate birthday items from family members
  const birthdayItems = computed(() => {
    if (!authStore.familyMembers.length) return [];

    const today = new Date();
    const items = [];

    authStore.familyMembers.forEach((member) => {
      if (member.birthday) {
        const birthDate = new Date(member.birthday);
        const nextBirthday = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate()
        );

        // If birthday has passed this year, set for next year
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        // Show birthdays happening in the next 7 days
        const daysUntilBirthday = Math.ceil(
          (nextBirthday - today) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilBirthday <= 7 && daysUntilBirthday >= 0) {
          items.push({
            id: `birthday-${member.userId}`,
            type: "birthday",
            authorId: member.userId,
            authorName: member.name,
            authorInitial: member.name
              ? member.name.charAt(0).toUpperCase()
              : "?",
            daysUntil: daysUntilBirthday,
            createdAt: new Date(), // For sorting
          });
        }
      }
    });

    return items;
  });

  // Generate contextual prompts
  const contextualPrompts = computed(() => {
    const prompts = [];

    // Check for recent events that might need photos
    const recentEvents = events.value.filter((event) => {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      const hoursSinceEvent = (now - eventDate) / (1000 * 60 * 60);
      return hoursSinceEvent > 0 && hoursSinceEvent < 24; // Events that ended in last 24 hours
    });

    if (recentEvents.length > 0 && posts.value.length < 3) {
      prompts.push({
        id: "prompt-event-photos",
        type: "prompt",
        content: `Share photos from ${recentEvents[0].title}?`,
        event: recentEvents[0],
        createdAt: new Date(),
      });
    }

    // Check for quiet feed
    const postsThisWeek = posts.value.filter((post) => {
      const postDate = post.createdAt?.toDate
        ? post.createdAt.toDate()
        : new Date(post.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return postDate > oneWeekAgo;
    });

    if (postsThisWeek.length < 2) {
      prompts.push({
        id: "prompt-quiet-feed",
        type: "prompt",
        content:
          "Your family would love to hear from you! Share a small update?",
        createdAt: new Date(),
      });
    }

    return prompts;
  });

  // Combined feed items
  const feedItems = computed(() => {
    const allItems = [
      ...posts.value,
      ...events.value,
      ...capsules.value,
      ...birthdayItems.value,
      ...contextualPrompts.value,
    ];

    // Sort by date (newest first)
    return allItems.sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt);
      return dateB - dateA;
    });
  });

  return {
    posts,
    events,
    capsules,
    birthdayItems,
    contextualPrompts,
    feedItems,
    loading,
    fetchFeedData,
    fetchPosts,
    fetchEvents,
    fetchCapsules,
  };
};
