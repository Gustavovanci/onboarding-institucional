import { create } from 'zustand';
import { type User, type Instituto } from '../types';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';

interface LeaderboardUser extends Pick<User, 'uid' | 'displayName' | 'photoURL' | 'instituto' | 'profession' | 'points'> {
  rank: number;
}

interface GamificationState {
  leaderboard: LeaderboardUser[];
  instituteLeaderboards: Record<Instituto, LeaderboardUser[]>;
  isLoading: boolean;
  
  fetchLeaderboard: (filterInstitute?: Instituto) => Promise<void>;
  fetchInstituteLeaderboard: (instituto: Instituto) => Promise<void>;
  fetchAllLeaderboards: () => Promise<void>;
}

const useGamificationStore = create<GamificationState>((set, get) => ({
  leaderboard: [],
  instituteLeaderboards: {} as Record<Instituto, LeaderboardUser[]>,
  isLoading: false,

  fetchLeaderboard: async (filterInstitute?: Instituto) => {
    set({ isLoading: true });
    try {
      let q;
      if (filterInstitute) {
        q = query(
          collection(db, 'users'),
          where('instituto', '==', filterInstitute),
          orderBy('points', 'desc'),
          limit(50)
        );
      } else {
        q = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(100)
        );
      }

      const querySnapshot = await getDocs(q);
      const leaderboardData: LeaderboardUser[] = querySnapshot.docs.map((doc, index) => ({
        uid: doc.id,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        instituto: doc.data().instituto,
        profession: doc.data().profession,
        points: doc.data().points || 0,
        rank: index + 1
      }));

      set({ leaderboard: leaderboardData });
    } catch (error) {
      console.error('Erro ao buscar leaderboard:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInstituteLeaderboard: async (instituto: Instituto) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('instituto', '==', instituto),
        orderBy('points', 'desc'),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const instituteLeaderboard: LeaderboardUser[] = querySnapshot.docs.map((doc, index) => ({
        uid: doc.id,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        instituto: doc.data().instituto,
        profession: doc.data().profession,
        points: doc.data().points || 0,
        rank: index + 1
      }));

      set(state => ({
        instituteLeaderboards: {
          ...state.instituteLeaderboards,
          [instituto]: instituteLeaderboard
        }
      }));
    } catch (error) {
      console.error(`Erro ao buscar leaderboard do ${instituto}:`, error);
    }
  },

  fetchAllLeaderboards: async () => {
    // Usando a lista de institutos do arquivo de tipos
    const institutos: Instituto[] = ['ICHC', 'InCor', 'IOT', 'IPQ', 'InRad', 'ICr', 'PA', 'ICESP', 'IPer', 'IMREA', 'LIMs'];
    
    const promises = institutos.map(instituto => 
      get().fetchInstituteLeaderboard(instituto)
    );
    
    await Promise.all(promises);
  }
}));

export default useGamificationStore;