import { doc, getDoc } from "firebase/firestore";

export const useFamilyMembers = () => {
  const { $firestore: db } = useNuxtApp();

  const fetchMembersWithUserData = async (members) => {
    if (!members || !members.length) return [];

    const membersWithUserData = await Promise.all(
      members.map(async (member) => {
        try {
          const userDocRef = doc(db, "users", member.userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return {
              ...member,
              name: userData.name || member.email.split("@")[0],
              avatarUrl: userData.avatarUrl || null,
              birthday: userData.birthday || null,
              phone: userData.phone || null,
              bio: userData.bio || null,
              status: userData.status || "active",
              permissions: userData.permissions || {
                role: member.role,
                minor: false,
                privateMode: false,
              },
              familyRole: userData.familyRole || member.role,
              createdAt: userData.createdAt || null,
              updatedAt: userData.updatedAt || null,
            };
          }

          return {
            ...member,
            name: member.email.split("@")[0],
            avatarUrl: null,
            birthday: null,
            phone: null,
            bio: null,
            status: "active",
            permissions: {
              role: member.role,
              minor: false,
              privateMode: false,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching user data for ${member.userId}:`,
            error
          );
          return {
            ...member,
            name: member.email.split("@")[0],
            avatarUrl: null,
            birthday: null,
            phone: null,
            bio: null,
            status: "active",
            permissions: {
              role: member.role,
              minor: false,
              privateMode: false,
            },
          };
        }
      })
    );

    return membersWithUserData;
  };

  return {
    fetchMembersWithUserData,
  };
};
