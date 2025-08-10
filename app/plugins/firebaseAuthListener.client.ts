// /plugins/firebaseAuthListener.client.ts
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email || "",
          name: user.displayName || "",
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
});
