// utils/firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";

import { auth, db } from "~/plugins/firebase";
export const registerUser = async (email, password, name) => {
  if (!auth || !db) {
    console.error("Auth or Firestore unavailable");
    return {
      success: false,
      message: "Authentication or database unavailable",
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create proper user document structure
    const userDoc = {
      email: email,
      name: name, // SET THE NAME
      families: {}, // Empty - will be populated in family-setup
      permissions: {
        minor: false,
        privateMode: false,
        // REMOVE role from here - role is per-family now
      },
      status: "pending", // User needs to complete family setup
      birthday: null,
      bio: null,
      avatarUrl: null,
      createdAt: new Date(),
      phone: null,
      // REMOVE familyId, familyRole - these are in families map now
    };

    await setDoc(doc(db, "users", user.uid), userDoc);

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

export const loginUser = async (email, password) => {
  if (!auth) {
    console.error("Auth unavailable");
    return { success: false, message: "Authentication service unavailable" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.message || "Login failed" };
  }
};

export const createProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);

    // Clean profile data - remove any legacy fields
    const cleanProfileData = {
      name: profileData.name,
      email: profileData.email,
      birthday: profileData.birthday,
      // REMOVE familyRole - this is now in families map
      permissions: {
        minor: profileData.permissions?.minor || false,
        privateMode: profileData.permissions?.privateMode || false,
        // REMOVE role from permissions
      },
      families: profileData.families || {},
      status: "active", // User is now fully set up
      updatedAt: new Date(),
    };

    // Remove any legacy fields that might be passed
    delete cleanProfileData.familyId;
    delete cleanProfileData.familyRole;
    if (cleanProfileData.permissions) {
      delete cleanProfileData.permissions.role;
    }

    await setDoc(userRef, cleanProfileData, { merge: true });
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

export const createFamily = async (userId, familyName, email, userName) => {
  try {
    const familyRef = doc(collection(db, "families"));
    const familyId = familyRef.id;

    // Create family document
    await setDoc(familyRef, {
      adminId: userId,
      name: familyName,
      createdAt: new Date(),
      members: [
        {
          userId,
          email,
          name: userName, // USE THE USER'S NAME
          role: "admin",
        },
      ],
      linkedFamilies: [],
      privacySettings: {
        coreOnlyFeatures: ["calendar", "albums"],
        extendedVisibility: ["names", "birthdays"],
      },
    });

    // Update user document with families map - CORRECT STRUCTURE
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`families.${familyId}`]: {
        membershipType: "core",
        role: "admin",
      },
      status: "active", // User is now active with a family
      updatedAt: new Date(),
    });

    return familyId;
  } catch (error) {
    console.error("Error creating family:", error);
    throw error;
  }
};

export const generateInvite = async (familyId, familyName, createdBy) => {
  if (!db || !auth) {
    console.error("Firestore or Auth unavailable");
    throw new Error("Database or authentication unavailable");
  }

  try {
    const inviteRef = await addDoc(collection(db, "invites"), {
      familyId,
      familyName,
      createdBy,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return inviteRef.id;
  } catch (error) {
    console.error("generateInvite error:", error);
    throw new Error(error.message || "Failed to generate invite");
  }
};

// Add Event (create with invites/RSVP init)
export const addEvent = async (eventData) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const familyId = eventData.familyId;
  if (!familyId) throw new Error("No family ID");

  try {
    const attendees = eventData.attendees || []; // From form checkboxes
    const rsvps = { [auth.currentUser.uid]: "yes" }; // Creator auto-yes
    attendees.forEach((userId) => {
      if (userId !== auth.currentUser.uid) rsvps[userId] = null;
    }); // Others pending

    const eventRef = await addDoc(
      collection(db, "families", familyId, "events"),
      {
        ...eventData,
        familyId,
        creatorId: auth.currentUser.uid,
        attendees,
        rsvps,
        color: eventData.color || "#f59e0b", // Default amber
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return { success: true, eventId: eventRef.id };
  } catch (error) {
    console.error("Add event error:", error);
    throw new Error(error.message || "Failed to add event");
  }
};

// Fetch Events by Date Range (manual for month view)
export const getEventsByRange = async (familyId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, "families", familyId, "events"),
      where("startDate", ">=", startDate),
      where("startDate", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Fetch events error:", error);
    return [];
  }
};

// Update RSVP (user's own status)
export const updateRSVP = async (familyId, eventId, status) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await updateDoc(eventRef, {
      [`rsvps.${auth.currentUser.uid}`]: status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update RSVP");
  }
};

// Update Event (edit details)
export const updateEvent = async (familyId, eventId, updates) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await updateDoc(eventRef, { ...updates, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update event");
  }
};

// Delete Event (admin only—check in UI)
export const deleteEvent = async (familyId, eventId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    // TODO: isAdmin check from store
    const eventRef = doc(db, "families", familyId, "events", eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to delete event");
  }
};

// Send Message (Basic)
export const sendMessage = async (recipientId, messageText) => {
  const authStore = useAuthStore();

  // Check if user has access to any family
  if (!authStore.hasFamily || !authStore.currentFamilyId) {
    throw new Error("No family access");
  }

  // Check if recipient is in the same current family
  const recipientDoc = await getDoc(doc(db, "users", recipientId));
  if (!recipientDoc.exists()) {
    throw new Error("Recipient not found");
  }

  const recipientData = recipientDoc.data();

  // Check if both users are in the same current family
  if (
    !recipientData.families ||
    !recipientData.families[authStore.currentFamilyId]
  ) {
    throw new Error("Cannot message users outside your family");
  }

  try {
    const messageData = {
      senderId: authStore.userId,
      recipientId: recipientId,
      message: messageText.trim(),
      timestamp: new Date(),
      familyId: authStore.currentFamilyId, // Ensure familyId is included
      read: false,
    };

    // Add message to the messages collection
    const messagesRef = collection(db, "messages");
    const docRef = await addDoc(messagesRef, messageData);

    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Send message error:", error);
    throw new Error("Failed to send message: " + error.message);
  }
};

// Get Message History between two users
export const getMessageHistory = async (otherUserId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const currentUserId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", currentUserId));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    const messagesQuery = query(
      collection(db, "messages"),
      where("familyId", "==", familyId),
      where("senderId", "in", [currentUserId, otherUserId]),
      where("receiverId", "in", [currentUserId, otherUserId]),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
};

// Get All Conversations (for message history page)
export const getAllConversations = async (familyId = null) => {
  const authStore = useAuthStore();

  // Use provided familyId or current family
  const targetFamilyId = familyId || authStore.currentFamilyId;

  if (!targetFamilyId) {
    console.error("No family ID provided for conversations");
    return [];
  }

  if (!authStore.userId) {
    console.error("No user ID available");
    return [];
  }

  console.log(
    "Fetching conversations for family:",
    targetFamilyId,
    "user:",
    authStore.userId
  );

  try {
    // Get all messages for the current family, ordered by timestamp
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("familyId", "==", targetFamilyId),
      orderBy("timestamp", "desc")
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    console.log("Total messages in family:", messagesSnapshot.docs.length);

    // Filter messages where current user is either sender or recipient
    const userMessages = messagesSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (message) =>
          message.senderId === authStore.userId ||
          message.recipientId === authStore.userId
      );

    console.log("User messages:", userMessages.length);

    // If no messages found, return empty array
    if (userMessages.length === 0) {
      return [];
    }

    // Group messages by conversation (other user ID)
    const conversationsMap = new Map();

    userMessages.forEach((message) => {
      const otherUserId =
        message.senderId === authStore.userId
          ? message.recipientId
          : message.senderId;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: message.message,
          lastMessageTime: message.timestamp,
          unreadCount: 0,
          messages: [],
        });
      }

      const conversation = conversationsMap.get(otherUserId);
      conversation.messages.push(message);

      // Update last message if this is newer
      const currentLastTime = conversation.lastMessageTime?.toDate
        ? conversation.lastMessageTime.toDate()
        : new Date(conversation.lastMessageTime);
      const newMessageTime = message.timestamp?.toDate
        ? message.timestamp.toDate()
        : new Date(message.timestamp);

      if (newMessageTime > currentLastTime) {
        conversation.lastMessage = message.message;
        conversation.lastMessageTime = message.timestamp;
      }

      // Count unread messages (messages sent to user that are unread)
      if (!message.read && message.recipientId === authStore.userId) {
        conversation.unreadCount++;
      }
    });

    console.log("Conversations found:", conversationsMap.size);

    // Get user details for each conversation
    const conversationsWithUserDetails = await Promise.all(
      Array.from(conversationsMap.values()).map(async (conversation) => {
        try {
          const userDoc = await getDoc(doc(db, "users", conversation.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              ...conversation,
              name: userData.name || userData.email || "Unknown User",
              avatarUrl: userData.avatarUrl,
              email: userData.email,
            };
          }
          return {
            ...conversation,
            name: "Unknown User",
            avatarUrl: null,
            email: null,
          };
        } catch (error) {
          console.error(`Error fetching user ${conversation.userId}:`, error);
          return {
            ...conversation,
            name: "Unknown User",
            avatarUrl: null,
            email: null,
          };
        }
      })
    );

    // Sort by last message time (newest first)
    const sortedConversations = conversationsWithUserDetails.sort((a, b) => {
      const timeA = a.lastMessageTime?.toDate
        ? a.lastMessageTime.toDate()
        : new Date(a.lastMessageTime);
      const timeB = b.lastMessageTime?.toDate
        ? b.lastMessageTime.toDate()
        : new Date(b.lastMessageTime);
      return timeB - timeA;
    });

    console.log("Final conversations:", sortedConversations);
    return sortedConversations;
  } catch (error) {
    console.error("Error getting conversations:", error);

    // If it's still an index error, provide helpful message
    if (error.code === "failed-precondition") {
      throw new Error(
        "Firestore index is still building. Please wait a few minutes and try again."
      );
    }

    throw new Error("Failed to load conversations: " + error.message);
  }
};

// Favorites functions - update these too
export const addToFavorites = async (favoriteUserId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) throw new Error("No family access");

    // Check if already favorited
    const existingFavoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("favoriteUserId", "==", favoriteUserId),
      where("familyId", "==", familyId)
    );

    const existingSnapshot = await getDocs(existingFavoriteQuery);

    if (!existingSnapshot.empty) {
      // Already favorited, so remove it (toggle behavior)
      await deleteDoc(existingSnapshot.docs[0].ref);
      return { success: true, action: "removed" };
    }

    // Add to favorites
    await addDoc(collection(db, "favorites"), {
      userId,
      favoriteUserId,
      familyId: familyId,
      createdAt: serverTimestamp(),
    });

    return { success: true, action: "added" };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw new Error(error.message || "Failed to update favorites");
  }
};

export const getFavorites = async () => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return [];

    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("familyId", "==", familyId)
    );

    const snapshot = await getDocs(favoritesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get favorites error:", error);
    return [];
  }
};

export const isUserFavorited = async (targetUserId) => {
  if (!auth.currentUser) return false;

  const userId = auth.currentUser.uid;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const familyId = userData.familyId;

    if (!familyId) return false;

    const favoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("favoriteUserId", "==", targetUserId),
      where("familyId", "==", familyId)
    );

    const snapshot = await getDocs(favoriteQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Check favorite error:", error);
    return false;
  }
};
// Mark messages as read
export const markMessagesAsRead = async (senderId) => {
  const authStore = useAuthStore();

  if (!authStore.currentFamilyId || !authStore.userId) {
    console.error("No family access or user ID");
    return;
  }

  try {
    const messagesRef = collection(db, "messages");
    const unreadMessagesQuery = query(
      messagesRef,
      where("familyId", "==", authStore.currentFamilyId),
      where("senderId", "==", senderId),
      where("recipientId", "==", authStore.userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(unreadMessagesQuery);

    const updatePromises = snapshot.docs.map(async (docSnap) => {
      await updateDoc(doc(db, "messages", docSnap.id), {
        read: true,
      });
    });

    await Promise.all(updatePromises);
    console.log(`Marked ${snapshot.docs.length} messages as read`);
  } catch (error) {
    console.error("Mark messages read error:", error);
    // Don't throw error here, just log it
  }
};

// Capsules functions
export const getCapsules = async (familyId = null, status = null) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();

    // Use provided familyId or check user's current family access
    let targetFamilyId = familyId;

    if (!targetFamilyId) {
      // If no familyId provided, use the first family the user has access to
      const userFamilies = Object.keys(userData.families || {});
      if (userFamilies.length === 0) {
        return [];
      }
      targetFamilyId = userFamilies[0];
    }

    // Verify user has access to the target family
    if (!userData.families || !userData.families[targetFamilyId]) {
      throw new Error("No access to this family");
    }

    // Build query based on status filter
    let capsulesQuery;
    if (status) {
      capsulesQuery = query(
        collection(db, "capsules"),
        where("familyId", "==", targetFamilyId),
        where("status", "==", status),
        orderBy("deliveryDate", "asc")
      );
    } else {
      capsulesQuery = query(
        collection(db, "capsules"),
        where("familyId", "==", targetFamilyId),
        orderBy("deliveryDate", "asc")
      );
    }

    const snapshot = await getDocs(capsulesQuery);

    // CRITICAL: Filter on client side for additional security
    const userId = auth.currentUser.uid;
    const filteredCapsules = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((capsule) => {
        // User can always see capsules they created
        if (capsule.createdBy === userId) return true;

        // User can only see received capsules if delivered
        if (capsule.recipientId === userId) {
          return capsule.status === "delivered";
        }

        return false;
      });

    return filteredCapsules;
  } catch (error) {
    console.error("Get capsules error:", error);
    return [];
  }
};

export const createCapsule = async (capsuleData) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    const familyId = capsuleData.familyId;

    // Check if user has access to this family
    if (!familyId || !userData.families || !userData.families[familyId]) {
      throw new Error("No family access");
    }

    // Validate recipient is in same family
    if (capsuleData.recipientId) {
      const recipientDoc = await getDoc(
        doc(db, "users", capsuleData.recipientId)
      );
      if (!recipientDoc.exists()) {
        throw new Error("Recipient not found");
      }

      const recipientData = recipientDoc.data();
      // Check if recipient is in the same family
      if (!recipientData.families || !recipientData.families[familyId]) {
        throw new Error("Recipient must be in the same family");
      }
    }

    // Validate delivery date is in the future
    const deliveryDate = new Date(capsuleData.deliveryDate);
    if (deliveryDate <= new Date()) {
      throw new Error("Delivery date must be in the future");
    }

    const capsuleRef = await addDoc(collection(db, "capsules"), {
      familyId,
      createdBy: auth.currentUser.uid,
      recipientId: capsuleData.recipientId,
      title: capsuleData.title.trim(),
      content: capsuleData.content.trim(),
      type: capsuleData.type || "text",
      deliveryDate: deliveryDate,
      status: "scheduled",
      createdAt: serverTimestamp(),
      isPrivate: true,
    });

    return { success: true, capsuleId: capsuleRef.id };
  } catch (error) {
    console.error("Create capsule error:", error);
    throw new Error(error.message || "Failed to create capsule");
  }
};

export const getCapsuleById = async (capsuleId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const capsuleDoc = await getDoc(doc(db, "capsules", capsuleId));
    if (!capsuleDoc.exists()) {
      throw new Error("Capsule not found");
    }

    const capsuleData = capsuleDoc.data();

    // Check if user has access to this capsule's family
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    if (!userData.families || !userData.families[capsuleData.familyId]) {
      throw new Error("Access denied - not in this family");
    }

    return { id: capsuleDoc.id, ...capsuleData };
  } catch (error) {
    console.error("Get capsule error:", error);
    throw error;
  }
};

export const updateCapsuleStatus = async (capsuleId, status) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  try {
    const capsuleRef = doc(db, "capsules", capsuleId);
    await updateDoc(capsuleRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message || "Failed to update capsule");
  }
};

export const updateCapsule = async (capsuleId, updateData) => {
  try {
    const db = getFirestore();
    const capsuleRef = doc(db, "capsules", capsuleId);

    // Prepare the update data with timestamp
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(capsuleRef, updatePayload);
    return { success: true, id: capsuleId };
  } catch (error) {
    console.error("Error updating capsule:", error);
    throw new Error("Failed to update capsule: " + error.message);
  }
};
export const searchFamilies = async (searchQuery) => {
  try {
    console.log("🔍 Searching families with query:", searchQuery);

    const familiesRef = collection(db, "families");
    const q = query(
      familiesRef,
      where("name", ">=", searchQuery),
      where("name", "<=", searchQuery + "\uf8ff"),
      limit(10) // Add limit for safety
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      memberCount: doc.data().members?.length || 0,
    }));

    console.log("✅ Search results:", results.length, "families found");
    return results;
  } catch (error) {
    console.error("❌ Error searching families:", error);
    throw error;
  }
};

export const sendJoinRequest = async (
  familyId,
  userId,
  userEmail,
  userName
) => {
  try {
    console.log("📨 Sending join request:", { familyId, userId, userEmail });

    const requestData = {
      userId,
      email: userEmail,
      name: userName || userEmail.split("@")[0],
      requestedAt: serverTimestamp(),
      status: "pending",
    };

    const requestRef = await addDoc(
      collection(db, `families/${familyId}/requests`),
      requestData
    );

    console.log("✅ Join request sent successfully:", requestRef.id);
    return requestRef.id;
  } catch (error) {
    console.error("❌ Error sending join request:", error);
    throw error;
  }
};
