// src/stores/authStore.ts
import { create } from 'zustand';
import { type User, type UserPersonalizations, type Instituto, INSTITUTOS_ARRAY } from '../types';
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

// ESTRUTURA PADRÃO DE UM USUÁRIO PARA GARANTIR QUE TODOS OS CAMPOS EXISTAM
const defaultUserStructure: Omit<User, 'uid' | 'email' | 'displayName' | 'photoURL' | 'createdAt'> = {
  instituto: INSTITUTOS_ARRAY[0],
  role: "employee",
  profession: '',
  bio: 'Bem-vindo(a) à jornada de Onboarding do HC!',
  points: 0,
  badges: [],
  completedModules: [],
  quizAttempts: [],
  certificates: [],
  lastAccess: 0,
  profileCompleted: false,
  onboardingCompleted: false,
  currentRank: 0,
  instituteRank: 0,
  welcomeModalSeen: false,
  tourSeen: false,
  personalizations: defaultPersonalizations,
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
    set({ user: null, isAuthenticated: false });
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

  initializeAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          // --- ESTA É A NOVA LÓGICA ROBUSTA ---
          // 1. Pega os dados que existem no banco
          const existingData = snap.data();

          // 2. Mescla com a estrutura padrão para garantir que campos novos (como personalizations) existam
          const safeUserData: User = {
            ...defaultUserStructure, // Garante todos os campos
            ...existingData,        // Sobrescreve com os dados salvos
            uid: firebaseUser.uid,  // Garante os dados do provedor
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || existingData.displayName,
            photoURL: firebaseUser.photoURL,
          };
          
          // 3. Atualiza o banco com a foto mais recente e o último acesso
          await updateDoc(userRef, {
            displayName: safeUserData.displayName,
            photoURL: safeUserData.photoURL,
            lastAccess: serverTimestamp(),
          });
          
          // 4. Define o estado local com o objeto completo e seguro
          set({ user: safeUserData, isAuthenticated: true, isLoading: false });

        } else {
          // Usuário não existe (primeiro login), cria com a estrutura completa
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || "Novo Colaborador",
            photoURL: firebaseUser.photoURL,
            createdAt: Date.now(),
            ...defaultUserStructure, // Aplica toda a estrutura padrão
          };
          await setDoc(userRef, newUser);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe;
  },
}));