import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
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

  const signInWithGoogle = () => signInWithPopup(auth, provider);
  const registerWithEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  const loginWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const onAuthChange = (callback: (user: User | null) => void) =>
    onAuthStateChanged(auth, callback);

  return {
    provide: {
      auth,
      db,
      signInWithGoogle,
      registerWithEmail,
      loginWithEmail,
      logout,
      onAuthChange,
    },
  };
});
