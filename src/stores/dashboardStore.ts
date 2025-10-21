import { create } from 'zustand';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { INSTITUTOS_ARRAY, type Instituto, type User } from '@/types';

// Define a estrutura dos dados que vamos calcular
interface DashboardStats {
  totalUsers: number;
  usersByInstitute: { [key: string]: number };
  topProfessions: { [key: string]: number };
  totalCertificates: number;
  averageCompletionTime: number;
  npsScore: number;
  lastUpdated: Date;
  npsDistribution: { promoters: number, passives: number, detractors: number };
  completionTimeDistribution: { [key: string]: number };
  userAcquisition: { [key: string]: number };
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  calculateDashboardStats: (institute?: Instituto) => Promise<void>;
  allUsers: User[];
  fetchAllUsers: () => Promise<void>;
}


const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  isLoading: false,
  allUsers: [],
  
  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => doc.data() as User);
        set({ allUsers: users });
    } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
    } finally {
        set({ isLoading: false });
    }
  },

  calculateDashboardStats: async (institute?: Instituto) => {
    set({ isLoading: true });
    try {
      const q = institute 
        ? query(collection(db, 'users'), where('instituto', '==', institute))
        : collection(db, 'users');

      const usersSnapshot = await getDocs(q);
      if (usersSnapshot.empty) {
        set({ stats: null, isLoading: false });
        return;
      }

      let totalUsers = 0;
      const usersByInstitute: { [key: string]: number } = {};
      const usersByProfession: { [key: string]: number } = {};
      let totalCertificates = 0;
      let totalCompletionDays = 0;
      let completedUsersCount = 0;
      const npsScores: number[] = [];
      const completionTimeDistribution: { [key: string]: number } = { "0-7 dias": 0, "8-15 dias": 0, "16-30 dias": 0, "30+ dias": 0 };
      const userAcquisition: { [key: string]: number } = {};

      if (!institute) {
        INSTITUTOS_ARRAY.forEach(inst => { usersByInstitute[inst] = 0; });
      }

      usersSnapshot.forEach((doc) => {
        const user = doc.data() as any; // Usar 'any' temporariamente para acessar .toMillis()
        totalUsers++;

        if (user.instituto && usersByInstitute[user.instituto] !== undefined) {
          usersByInstitute[user.instituto]++;
        }
        if (user.profession) {
          usersByProfession[user.profession] = (usersByProfession[user.profession] || 0) + 1;
        }
        if (user.onboardingCompleted && user.completionDetails) {
          totalCertificates++;
          completedUsersCount++;
          totalCompletionDays += user.completionDetails.daysToComplete || 0;
        }
        if (user.onboardingFeedback?.rating !== undefined) {
          npsScores.push(user.onboardingFeedback.rating);
        }
        
        // ✅ CORREÇÃO APLICADA AQUI
        if (user.createdAt) {
            // Converte o Timestamp do Firebase para um objeto Date do JavaScript
            const createdAtDate = user.createdAt.toMillis ? new Date(user.createdAt.toMillis()) : new Date(user.createdAt);
            if (!isNaN(createdAtDate.getTime())) { // Verifica se a data é válida
                const dateKey = createdAtDate.toISOString().split('T')[0];
                userAcquisition[dateKey] = (userAcquisition[dateKey] || 0) + 1;
            }
        }
      });

      const averageCompletionTime = completedUsersCount > 0 ? totalCompletionDays / completedUsersCount : 0;
      const promoters = npsScores.filter(score => score >= 9).length;
      const passives = npsScores.filter(score => score >= 7 && score <= 8).length;
      const detractors = npsScores.filter(score => score <= 6).length;
      const npsScore = npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;
      
      const topProfessions = Object.entries(usersByProfession)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

      const finalStats: DashboardStats = {
        totalUsers,
        usersByInstitute,
        topProfessions,
        totalCertificates,
        averageCompletionTime: parseFloat(averageCompletionTime.toFixed(1)),
        npsScore,
        lastUpdated: new Date(),
        npsDistribution: { promoters, passives, detractors },
        completionTimeDistribution,
        userAcquisition,
      };

      set({ stats: finalStats, isLoading: false });

    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      set({ isLoading: false });
    }
  },
}));

export default useDashboardStore;
