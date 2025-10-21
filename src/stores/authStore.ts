// src/stores/authStore.ts
import { create } from 'zustand';
import { type User, type UserPersonalizations, type Role, type CompletionDetails } from '@/types'; // Ensure types are correctly imported
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
  initializeAuthListener: () => () => void; // Keep this signature
}

const DEFAULT_PERSONALIZATIONS: UserPersonalizations = {
  colorTheme: 'classic',
  statusEmoji: 'happy',
  customTitle: 'explorer',
};

// ✅ FUNÇÃO MOVIDA PARA CÁ E REFINADA
const cleanPhotoURL = (url: string | null | undefined): string | null => {
    if (!url) return null;
    // Verifica se a URL contém "=s" que é comum em URLs do Google com parâmetros de tamanho
    // Se contiver, remove tudo a partir do '='.
    // Se for uma URL como ".../picture/0" ou ".../picture/1" (sem '='), mantém como está.
    if (url.includes('=s')) {
        return url.split('=')[0];
    }
    // Para outros formatos (incluindo .../picture/0), retorna a URL original.
    return url;
};

// ✅ FUNÇÃO normalizeUser APLICANDO a cleanPhotoURL
function normalizeUser(firebaseUser: FirebaseUser, dbData: Partial<User> | undefined): User {
  const creationTime = firebaseUser.metadata.creationTime
    ? new Date(firebaseUser.metadata.creationTime).getTime()
    : (dbData?.createdAt as any)?.toMillis?.() ?? Date.now(); // Handling potential Firestore Timestamp

  // ✅ Aplica a limpeza da URL aqui
  const photoURL = cleanPhotoURL(firebaseUser.photoURL) ?? dbData?.photoURL ?? null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? dbData?.email ?? '',
    displayName: firebaseUser.displayName ?? dbData?.displayName ?? '',
    photoURL: photoURL, // Usa a URL limpa ou original (ou do DB)
    createdAt: creationTime,
    lastAccess: (dbData?.lastAccess as any)?.toMillis?.() ?? dbData?.lastAccess ?? Date.now(),
    role: dbData?.role ?? 'employee',
    instituto: dbData?.instituto ?? 'Outros',
    profession: dbData?.profession ?? '',
    bio: dbData?.bio ?? '',
    points: dbData?.points ?? 0,
    completedModules: dbData?.completedModules ?? [],
    completedPageQuizzes: dbData?.completedPageQuizzes ?? [], // Mantém campo adicionado
    badges: dbData?.badges ?? [],
    quizAttempts: dbData?.quizAttempts ?? {},
    profileCompleted: dbData?.profileCompleted ?? false,
    onboardingCompleted: dbData?.onboardingCompleted ?? false,
    welcomeModalSeen: dbData?.welcomeModalSeen ?? false,
    tourSeen: dbData?.tourSeen ?? false,
    currentRank: dbData?.currentRank ?? 0,
    instituteRank: dbData?.instituteRank ?? 0,
    personalizations: { ...DEFAULT_PERSONALIZATIONS, ...(dbData?.personalizations ?? {}) }, // Merge safely
    onboardingFeedback: dbData?.onboardingFeedback ?? null,
    completionDetails: dbData?.completionDetails ?? null,
  };
}

// ensureUserDoc - Sem alterações necessárias aqui
async function ensureUserDoc(firebaseUser: FirebaseUser): Promise<Partial<User>> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const newUser: Partial<User> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
      photoURL: firebaseUser.photoURL ?? null, // Salva a URL original no DB
      createdAt: serverTimestamp(),
      lastAccess: serverTimestamp(),
      role: 'employee',
      instituto: 'Outros', // Default institute
      points: 0,
      completedModules: [],
      completedPageQuizzes: [],
      badges: [],
      profileCompleted: false, // Perfil não completo inicialmente
      welcomeModalSeen: false, // Modal não visto inicialmente
      tourSeen: false, // Tour não visto inicialmente
      personalizations: DEFAULT_PERSONALIZATIONS,
      onboardingFeedback: null,
      completionDetails: null,
      // Add other default fields as needed
    };
    await setDoc(userRef, newUser, { merge: true }); // Use merge to avoid overwriting existing fields if any race condition happened
     // Re-fetch after creation to get server timestamp resolved
    const newSnap = await getDoc(userRef);
    return newSnap.data() as Partial<User>;
  } else {
    // Only update lastAccess if the document already exists
    await updateDoc(userRef, { lastAccess: serverTimestamp() });
    return snap.data() as Partial<User>;
  }
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
      } else if (authError?.code) {
          msg += ` (Código: ${authError.code})`; // Add more details for debugging
      }
      console.error("Erro no login:", authError); // Log detailed error
      set({ isLoading: false, error: msg });
    } finally {
        // Ensure loading is set to false even if listener hasn't fired yet
        // setTimeout(() => set(state => ({ isLoading: state.isAuthenticated ? false : state.isLoading })), 500);
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, isLoading: false }); // Ensure isLoading is false on logout
  },

  updateUserProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    set(state => ({ user: state.user ? { ...state.user, ...data } : null })); // Optimistic update
    try {
      await updateDoc(doc(db, 'users', user.uid), data);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      // Revert optimistic update on error if needed, or refetch user
       set(state => ({ user: state.user ? { ...state.user, /* revert changes */ } : null })); // Basic revert example
    }
  },

  updateUserRole: async (userId: string, role: Role) => {
    // Logic remains the same
    const currentUser = get().user;
    // Allow admin or coordinator to change roles, maybe coordinators can only change to 'employee'? Add specific logic if needed.
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'coordinator') {
      console.error("Permissão insuficiente para alterar roles.");
      return false;
    }
    // Add logic here if coordinators have limited role changing ability
    try {
      await updateDoc(doc(db, 'users', userId), { role });
       // Optionally refetch allUsers in dashboardStore if this page is active
      return true;
    } catch (error) {
      console.error("Erro ao atualizar a role do usuário:", error);
      return false;
    }
  },

  initializeAuthListener: () => {
    // This runs once when the app loads
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user state is already set and matches, maybe skip refetch unless forced?
        // const currentState = get();
        // if (currentState.user && currentState.user.uid === firebaseUser.uid && !forceRefresh) {
        //     set({ isLoading: false }); // Already loaded this user
        //     return;
        // }
        set({ isLoading: true }); // Set loading true while fetching/creating doc
        try {
          const docData = await ensureUserDoc(firebaseUser);
          const user = normalizeUser(firebaseUser, docData);
          set({ user, isAuthenticated: true, isLoading: false, error: null });
        } catch (e) {
          console.error('Falha ao carregar ou criar perfil do Firestore:', e);
          await signOut(auth); // Log out if Firestore interaction fails
          set({ user: null, isAuthenticated: false, isLoading: false, error: 'Não foi possível carregar ou criar seu perfil.' });
        }
      } else {
        // User is signed out
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },
}));

// Initialize listener when store is created (or call it in your App.tsx useEffect)
// useAuthStore.getState().initializeAuthListener(); // Or manage this in App.tsx