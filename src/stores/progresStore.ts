import { create } from 'zustand';
import { type Badge, type User } from '../types';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuthStore } from './authStore';

// Badges disponíveis na plataforma
export const availableBadges: Badge[] = [
  {
    id: 'first-module',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro módulo',
    icon: '🎯',
    category: 'completion',
    points: 50,
    requirements: { modulesCompleted: 1 }
  },
  {
    id: 'institutional-expert',
    name: 'Especialista Institucional',
    description: 'Complete todos os módulos obrigatórios',
    icon: '🎓',
    category: 'completion',
    points: 200,
    requirements: { requiredModulesCompleted: true }
  },
];

interface ProgressState {
  isLoading: boolean;
  completeModule: (userId: string, module: { id: string, points: number, isRequired: boolean }) => Promise<void>;
  checkAndAwardBadges: (user: User) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  completeModule: async (userId, module) => {
    set({ isLoading: true });
    const userRef = doc(db, 'users', userId);

    try {
      // Atualiza o documento do usuário no Firestore
      await updateDoc(userRef, {
        completedModules: arrayUnion(module.id),
        points: increment(module.points),
        lastAccess: Date.now()
      });

      // Atualiza o estado local no authStore para refletir a mudança imediatamente
      const authState = useAuthStore.getState();
      const currentUser = authState.user;
      
      if(currentUser) {
        const updatedUser = {
            ...currentUser,
            points: currentUser.points + module.points,
            completedModules: [...currentUser.completedModules, module.id]
        };
        // Chama a função de atualização do authStore
        authState.updateUserProfile(userId, updatedUser);
        
        // Verifica se algum badge foi conquistado
        await get().checkAndAwardBadges(updatedUser);
      }

    } catch (error) {
      console.error('Erro ao completar módulo:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAndAwardBadges: async (user: User) => {
    const userRef = doc(db, 'users', user.uid);

    for (const badge of availableBadges) {
        // Se o usuário já tem o badge, pula para o próximo
        if (user.badges.includes(badge.id)) continue;

        let earned = false;
        // Lógica para o badge 'Primeiro Passo'
        if(badge.id === 'first-module' && user.completedModules.length >= badge.requirements.modulesCompleted) {
            earned = true;
        }

        // Adicione a lógica para outros badges aqui...

        if (earned) {
            console.log(`Conquistou o badge: ${badge.name}`);
            await updateDoc(userRef, {
                badges: arrayUnion(badge.id),
                points: increment(badge.points)
            });
            // Atualiza o estado local
            useAuthStore.getState().updateUserProfile(user.uid, {
                badges: [...user.badges, badge.id],
                points: user.points + badge.points
            });
        }
    }
  },
}));
