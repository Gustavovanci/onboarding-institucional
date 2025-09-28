// src/stores/authStore.ts
import { create } from 'zustand';
// ++ CORREÇÃO: Importando TODOS os tipos necessários do arquivo central 'types' ++
import { type User, type UserPersonalizations } from '../types';
import { auth, googleProvider, db } from '../utils/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initializeAuthListener: () => () => void;
}

const defaultPersonalizations: UserPersonalizations = {
  colorTheme: 'classic',
  statusEmoji: 'happy',
  customTitle: 'explorer',
  favoriteQuote: '',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateUserProfile: async (data: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error("Usuário não autenticado.");

    const userRef = doc(db, "users", currentUser.uid);
    const updatedData = { ...data, lastAccess: serverTimestamp() };
    
    await setDoc(userRef, updatedData, { merge: true });
    
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  initializeAuthListener: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const userData = snap.data() as User;
          if (!userData.personalizations) {
            userData.personalizations = defaultPersonalizations;
          }
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } else {
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || "Novo Colaborador",
            photoURL: firebaseUser.photoURL,
            instituto: "Outros",
            role: "employee",
            profession: '',
            bio: '',
            points: 0,
            badges: [],
            completedModules: [],
            certificates: [],
            createdAt: Date.now(),
            lastAccess: Date.now(),
            profileCompleted: false,
            onboardingCompleted: false,
            currentRank: 0,
            previousRank: 0,
            instituteRank: 0,
            welcomeModalSeen: false,
            personalizations: defaultPersonalizations,
          };
          await setDoc(userRef, newUser);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));