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
import useGamificationStore from './gamificationStore';

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

const DEFAULT_PERSONALIZATIONS: UserPersonalizations = {
  colorTheme: 'classic',
  statusEmoji: 'happy',
  customTitle: 'explorer',
};

function normalizeUser(firebaseUser: FirebaseUser, dbData: Partial<User> | undefined): User {
  const creationTime = firebaseUser.metadata.creationTime 
    ? new Date(firebaseUser.metadata.creationTime).getTime() 
    : (dbData?.createdAt as number) ?? Date.now();

  const personalizations = { ...DEFAULT_PERSONALIZATIONS, ...dbData?.personalizations };

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? dbData?.email ?? '',
    displayName: firebaseUser.displayName ?? dbData?.displayName ?? '',
    photoURL: firebaseUser.photoURL ?? dbData?.photoURL ?? null,
    createdAt: creationTime,
    lastAccess: (dbData?.lastAccess as any)?.toMillis?.() ?? dbData?.lastAccess ?? Date.now(),
    
    // Campos do domínio da aplicação com padrões seguros
    role: dbData?.role ?? 'employee',
    instituto: dbData?.instituto ?? 'Outros',
    profession: dbData?.profession ?? '',
    bio: dbData?.bio ?? '',
    points: dbData?.points ?? 0,
    completedModules: dbData?.completedModules ?? [],
    badges: dbData?.badges ?? [],
    quizAttempts: dbData?.quizAttempts ?? {},

    // Campos de progresso e estado
    profileCompleted: dbData?.profileCompleted ?? false,
    onboardingCompleted: dbData?.onboardingCompleted ?? false,
    welcomeModalSeen: dbData?.welcomeModalSeen ?? false,
    tourSeen: dbData?.tourSeen ?? false,

    // Campos de ranking
    currentRank: dbData?.currentRank ?? 0,
    instituteRank: dbData?.instituteRank ?? 0,

    // Personalizações
    personalizations: personalizations,
  };
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
      profileCompleted: false,
      welcomeModalSeen: false,
      tourSeen: false,
      personalizations: DEFAULT_PERSONALIZATIONS,
    };
    await setDoc(userRef, newUser);
    // Após criar, buscamos novamente para obter os timestamps corretos do servidor
    const createdSnap = await getDoc(userRef);
    return createdSnap.data() as Partial<User>;
  }

  // Se o usuário já existe, apenas atualiza o último acesso
  await updateDoc(userRef, { lastAccess: serverTimestamp() });
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
      // O listener onAuthStateChanged cuidará de setar o usuário.
    } catch (error) {
      const authError = error as AuthError;
      console.error('Erro no login com Google:', authError.code, authError.message);
      let errorMessage = 'Ocorreu um erro ao tentar fazer login.';
      if (authError?.code === 'auth/popup-closed-by-user') {
        errorMessage = 'O login foi cancelado. Tente novamente.';
      }
      set({ isLoading: false, error: errorMessage, isAuthenticated: false, user: null });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  updateUserProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    try {
      await updateDoc(userRef, data);

      // Mescla os dados novos com o usuário atual no estado
      const updatedUser = { ...user, ...data };
      set({ user: updatedUser });

      // Item 3: Se o instituto mudou, força a atualização do ranking do instituto
      if (data.instituto && data.instituto !== user.instituto) {
        useGamificationStore.getState().fetchInstituteLeaderboard(data.instituto);
      }

    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  },

  initializeAuthListener: () => {
    // Retorna a função de unsubscribe para limpeza
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ isLoading: true });
        try {
          const docData = await ensureUserDoc(firebaseUser);
          const user = normalizeUser(firebaseUser, docData);
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (e) {
          console.error('Falha ao carregar ou criar perfil do usuário:', e);
          await signOut(auth); // Desloga o usuário se houver erro no perfil
          set({ user: null, isAuthenticated: false, isLoading: false, error: 'Não foi possível carregar seu perfil.' });
        }
      } else {
        // Usuário deslogado
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));