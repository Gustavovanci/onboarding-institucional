// Arquivo: src/stores/authStore.ts

import { create } from 'zustand';
import { type User, type UserPersonalizations } from '@/types';
import { auth, googleProvider, db } from '@/utils/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type AuthError,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initializeAuthListener: () => () => void;
}

const DEFAULT_PERSONALIZATIONS = {} as UserPersonalizations;

function normalizeUser(firebaseUser: FirebaseUser, data: Partial<User> | undefined): User {
  const creationTime = firebaseUser.metadata.creationTime 
    ? new Date(firebaseUser.metadata.creationTime).getTime() 
    : (data?.createdAt as number) ?? Date.now();

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? data?.email ?? '',
    displayName: firebaseUser.displayName ?? data?.displayName ?? '',
    photoURL: firebaseUser.photoURL ?? data?.photoURL ?? null,
    createdAt: creationTime,

    // Campos do domínio da aplicação com padrões seguros
    role: data?.role ?? 'employee',
    instituto: data?.instituto ?? 'Outros',
    profession: data?.profession ?? '',
    bio: data?.bio ?? '',
    points: data?.points ?? 0,
    completedModules: data?.completedModules ?? [],
    badges: data?.badges ?? [],

    // Campos de progresso e estado
    profileCompleted: data?.profileCompleted ?? false,
    welcomeModalSeen: data?.welcomeModalSeen ?? false,
    tourSeen: data?.tourSeen ?? false,

    // Personalizações
    personalizations: data?.personalizations ?? DEFAULT_PERSONALIZATIONS,
  } as User;
}

async function ensureUserDoc(firebaseUser: FirebaseUser): Promise<Partial<User>> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const newUser: Partial<User> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
      photoURL: firebaseUser.photoURL ?? null,
      createdAt: serverTimestamp() as any,
      lastAccess: serverTimestamp() as any,
      role: 'employee',
      instituto: 'Outros',
      points: 0,
      completedModules: [],
      badges: [],
      profileCompleted: false, // Inicia como falso
      welcomeModalSeen: false,
      tourSeen: false,
      personalizations: DEFAULT_PERSONALIZATIONS,
    };
    await setDoc(userRef, newUser);
    const createdSnap = await getDoc(userRef);
    return createdSnap.data() as Partial<User>;
  }

  await updateDoc(userRef, { lastLogin: serverTimestamp() });
  return snap.data() as Partial<User>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (!firebaseUser.email?.endsWith('@hc.fm.usp.br')) {
        await signOut(auth);
        throw new Error('Somente contas @hc.fm.usp.br são permitidas.');
      }

      const docData = await ensureUserDoc(firebaseUser);
      const user = normalizeUser(firebaseUser, docData);

      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Erro no login com Google:', authError.code, authError.message);
      let errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      if (authError?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'O login foi cancelado. Tente novamente.';
      }
      set({ isLoading: false, error: errorMessage });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  // FUNÇÃO CORRIGIDA
  updateUserProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true });
    const userRef = doc(db, 'users', user.uid);

    try {
      await updateDoc(userRef, data);

      // Mescla os dados novos com o usuário atual no estado
      const updatedUser = { ...user, ...data };

      set({ user: updatedUser, isLoading: false });

    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      set({ isLoading: false });
    }
  },

  initializeAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docData = await ensureUserDoc(firebaseUser);
          const user = normalizeUser(firebaseUser, docData);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (e) {
          console.error('Falha ao carregar perfil do usuário:', e);
          await signOut(auth);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe;
  },
}));