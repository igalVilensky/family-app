import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  arrayRemove,
  increment,
  serverTimestamp,
  getDoc,
  query,
  runTransaction,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "~/plugins/firebase";
import { useAuthStore } from "~/stores/auth";

// Like/Unlike a post
export const toggleLike = async (postId, familyId) => {
  if (!auth.currentUser) {
    console.error("Not authenticated");
    throw new Error("Not authenticated");
  }

  const userId = auth.currentUser.uid;
  const likeRef = doc(db, "posts", postId, "likes", userId);
  const postRef = doc(db, "posts", postId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      // Check if like exists
      const likeDoc = await transaction.get(likeRef);
      const postDoc = await transaction.get(postRef);

      if (likeDoc.exists()) {
        transaction.delete(likeRef);
        transaction.update(postRef, {
          likesCount: increment(-1),
          updatedAt: serverTimestamp(),
        });
        return "unliked";
      } else {
        transaction.set(likeRef, {
          userId,
          familyId,
          createdAt: serverTimestamp(),
        });
        transaction.update(postRef, {
          likesCount: increment(1),
          updatedAt: serverTimestamp(),
        });
        return "liked";
      }
    });

    return { success: true, action: result };
  } catch (error) {
    console.error("Toggle like error:", error);
    throw new Error("Failed to update like: " + error.message);
  }
};

// Add comment to a post
export const addComment = async (postId, familyId, commentText) => {
  if (!auth.currentUser) throw new Error("Not authenticated");
  if (!commentText.trim()) throw new Error("Comment cannot be empty");

  const userId = auth.currentUser.uid;
  const authStore = useAuthStore();

  try {
    // Add comment to subcollection
    const commentRef = await addDoc(
      collection(db, "posts", postId, "comments"),
      {
        userId,
        userEmail: authStore.email,
        userName: authStore.name,
        userInitial: authStore.name
          ? authStore.name.charAt(0).toUpperCase()
          : "?",
        content: commentText.trim(),
        familyId,
        createdAt: serverTimestamp(),
      }
    );

    // Update comment count on post
    await updateDoc(doc(db, "posts", postId), {
      commentsCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      commentId: commentRef.id,
    };
  } catch (error) {
    console.error("Add comment error:", error);
    throw new Error("Failed to add comment");
  }
};

// Get comments for a post
export const getComments = async (postId) => {
  try {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(commentsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get comments error:", error);
    return [];
  }
};

// Check if user liked a post
export const checkUserLike = async (postId) => {
  if (!auth.currentUser) return false;

  const userId = auth.currentUser.uid;
  const likeRef = doc(db, "posts", postId, "likes", userId);

  try {
    const likeDoc = await getDoc(likeRef);
    return likeDoc.exists();
  } catch (error) {
    console.error("Check like error:", error);
    return false;
  }
};

// Get likes for a post
export const getLikes = async (postId) => {
  try {
    const likesQuery = query(
      collection(db, "posts", postId, "likes"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(likesQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Get likes error:", error);
    return [];
  }
};
