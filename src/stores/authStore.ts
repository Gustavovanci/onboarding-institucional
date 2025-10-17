import { create } from 'zustand';
import { type User, type UserPersonalizations, type Role, type CompletionDetails } from '@/types';
import { auth, googleProvider, db } from '@/utils/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type AuthError, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<boolean>;
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
    : (dbData?.createdAt as any)?.toMillis() ?? Date.now();

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? dbData?.email ?? '',
    displayName: firebaseUser.displayName ?? dbData?.displayName ?? '',
    photoURL: firebaseUser.photoURL ?? dbData?.photoURL ?? null,
    createdAt: creationTime,
    lastAccess: (dbData?.lastAccess as any)?.toMillis?.() ?? dbData?.lastAccess ?? Date.now(),
    role: dbData?.role ?? 'employee',
    instituto: dbData?.instituto ?? 'Outros',
    profession: dbData?.profession ?? '',
    bio: dbData?.bio ?? '',
    points: dbData?.points ?? 0,
    completedModules: dbData?.completedModules ?? [],
    badges: dbData?.badges ?? [],
    quizAttempts: dbData?.quizAttempts ?? {},
    profileCompleted: dbData?.profileCompleted ?? false,
    onboardingCompleted: dbData?.onboardingCompleted ?? false,
    welcomeModalSeen: dbData?.welcomeModalSeen ?? false,
    tourSeen: dbData?.tourSeen ?? false,
    currentRank: dbData?.currentRank ?? 0,
    instituteRank: dbData?.instituteRank ?? 0,
    personalizations: { ...DEFAULT_PERSONALIZATIONS, ...dbData?.personalizations },
    onboardingFeedback: dbData?.onboardingFeedback ?? null,
    completionDetails: dbData?.completionDetails ?? null,
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
      createdAt: serverTimestamp(),
      lastAccess: serverTimestamp(),
      role: 'employee',
      instituto: 'Outros',
      points: 0,
      completedModules: [],
      badges: [],
      profileCompleted: false,
      welcomeModalSeen: false,
      tourSeen: false,
      personalizations: DEFAULT_PERSONALIZATIONS,
      onboardingFeedback: null,
      completionDetails: null,
    };
    await setDoc(userRef, newUser);
    return (await getDoc(userRef)).data() as Partial<User>;
  }

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
      await signInWithPopup(auth, googleProvider);
      // O listener onAuthStateChanged cuidará do resto
    } catch (error) {
      const authError = error as AuthError;
      let msg = 'Ocorreu um erro ao tentar fazer login.';
      if (authError?.code === 'auth/popup-closed-by-user') {
        msg = 'O login foi cancelado.';
      }
      set({ isLoading: false, error: msg });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  updateUserProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), data);
      set(state => ({ user: state.user ? { ...state.user, ...data } : null }));
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  },
  
  updateUserRole: async (userId: string, role: Role) => {
    const currentUser = get().user;
    if (currentUser?.role !== 'admin') {
      console.error("Apenas admins podem alterar roles.");
      return false;
    }
    try {
      await updateDoc(doc(db, 'users', userId), { role });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar a role do usuário:", error);
      return false;
    }
  },

  initializeAuthListener: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ isLoading: true });
        try {
          const docData = await ensureUserDoc(firebaseUser);
          const user = normalizeUser(firebaseUser, docData);
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (e) {
          console.error('Falha ao carregar ou criar perfil:', e);
          await signOut(auth);
          set({ user: null, isAuthenticated: false, isLoading: false, error: 'Não foi possível carregar seu perfil.' });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));

