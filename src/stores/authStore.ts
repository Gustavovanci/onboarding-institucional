// src/stores/authStore.ts
import { create } from 'zustand';
import { auth, googleProvider, db } from '../utils/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// As importações do 'firebase/storage' foram removidas daqui

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  institute?: string;
  profession?: string;
  bio?: string;
  profileCompleted: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  // A função 'uploadProfilePicture' foi removida daqui
  _initializeUser: (firebaseUser: FirebaseUser | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  loginWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  },

  updateUserProfile: async (data) => {
    const user = get().user;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data, { merge: true });
    set({ user: { ...user, ...data } });
  },

  _initializeUser: async (firebaseUser) => {
    if (firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userProfile = docSnap.data() as UserProfile;
        set({ user: userProfile, isAuthenticated: true, isLoading: false });
      } else {
        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          profileCompleted: false,
          bio: '',
        };
        await setDoc(userRef, newUserProfile);
        set({ user: newUserProfile, isAuthenticated: true, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState()._initializeUser(user);
});