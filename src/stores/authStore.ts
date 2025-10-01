import { create } from 'zustand';
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
  fetchAndUpdateUser: (uid: string) => Promise<void>;
  initializeAuthListener: () => () => void;
}

const defaultPersonalizations: UserPersonalizations = {
  colorTheme: 'hc-classic',
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
    if (!currentUser) throw new Error("Usuário não autenticado para atualização.");

    const userRef = doc(db, "users", currentUser.uid);
    const updatedData = { ...data, lastAccess: serverTimestamp() };
    
    await updateDoc(userRef, updatedData);
    
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  fetchAndUpdateUser: async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const freshUserData = snap.data() as User;
      set({ user: freshUserData });
    }
  },

  initializeAuthListener: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const userData = snap.data() as User;
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } else {
          // CORREÇÃO: Garantindo que o photoURL seja sempre pego do provedor do Google
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || "Novo Colaborador",
            photoURL: firebaseUser.photoURL, // Esta linha é a mais importante
            instituto: "Outros",
            role: "employee",
            profession: '',
            bio: '',
            points: 10,
            badges: [],
            completedModules: [],
            certificates: [],
            createdAt: Date.now(),
            lastAccess: Date.now(),
            profileCompleted: false,
            onboardingCompleted: false,
            currentRank: 0,
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