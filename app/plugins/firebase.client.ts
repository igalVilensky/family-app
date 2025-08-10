import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app);

  const provider = new GoogleAuthProvider();

  // Sign in with popup
  const signInWithGoogle = () => signInWithPopup(auth, provider);

  // Sign out
  const logout = () => signOut(auth);

  // Track auth state
  const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };

  return {
    provide: {
      auth,
      db,
      signInWithGoogle,
      logout,
      onAuthChange,
    },
  };
});
