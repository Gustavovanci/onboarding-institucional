import { create } from 'zustand';
import { type User, type Instituto } from '../types'; // Usando sua nova e completa interface User
import { auth, googleProvider, db } from '../utils/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initializeAuthListener: () => () => void; // Retorna a função de unsubscribe
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
      // O onAuthStateChanged vai cuidar de atualizar o estado do usuário
    } catch (error: any) {
      console.error("Erro no login com Google:", error);
      set({ error: error.message || 'Falha no login', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateUserProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser) {
      throw new Error("Usuário não autenticado para atualizar o perfil.");
    }
    const userRef = doc(db, 'users', currentUser.uid);
    const updatedData = { ...data, lastAccess: Date.now() };

    await setDoc(userRef, updatedData, { merge: true });
    
    // Atualiza o estado local com os novos dados
    set({ user: { ...currentUser, ...updatedData } });
  },
  
  clearError: () => set({ error: null }),

  initializeAuthListener: () => {
    // onAuthStateChanged retorna uma função 'unsubscribe' que podemos usar para limpar o listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email?.endsWith('@hc.fm.usp.br')) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          // Usuário já existe, apenas atualiza o estado
          set({ user: docSnap.data() as User, isAuthenticated: true, isLoading: false });
        } else {
          // É o primeiro login, cria o perfil inicial com base na sua estrutura User
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Novo Colaborador',
            photoURL: firebaseUser.photoURL,
            instituto: 'Outros', // Valor padrão inicial
            role: 'employee',
            points: 0,
            badges: [],
            completedModules: [],
            createdAt: Date.now(),
            lastAccess: Date.now(),
            profileCompleted: false, // Força o redirecionamento para o setup de perfil
            onboardingCompleted: false,
          };
          await setDoc(userRef, newUser);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        }
      } else {
        // Usuário não logado ou de domínio inválido
        if (firebaseUser) {
            // Se o usuário está logado mas não é do domínio correto, desloga-o.
            await signOut(auth);
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe; // Retorna a função para limpar o listener
  },
}));