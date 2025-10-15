// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User } from "../types";
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";
import { differenceInDays } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

export const availableBadges: Badge[] = [
  {
    id: "checkin-hc",
    name: "Iniciante HC",
    description: "Concluiu a jornada de boas-vindas e fez seu check-in na plataforma.",
    icon: "✅",
    category: "special",
    points: 100,
  },
  {
    id: "first-module",
    name: "Primeiro Passo",
    description: "Complete seu primeiro módulo da trilha institucional",
    icon: "🎯",
    category: "completion",
    points: 50,
  },
  {
    id: "onboarding-sprint",
    name: "Maratonista",
    description: "Conclua o onboarding em menos de 5 dias",
    icon: "🏃‍♂️",
    category: "special",
    points: 200,
  },
];

interface ProgressState {
  isLoading: boolean;
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<void>;
  checkAndAwardBadges: (user: User) => Promise<void>;
  addFeedback: (feedback: { userId: string; rating: number; message: string }) => Promise<void>;
  awardBadgeAndPoints: (userId: string, badgeId: string) => Promise<void>;
  markOnboardingAsCompleted: (userId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  completeModule: async (userId, module) => {
    set({ isLoading: true });
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        completedModules: arrayUnion(module.id),
        points: increment(module.points),
        lastAccess: serverTimestamp(),
      });

      const { user, updateUserProfile } = useAuthStore.getState();
      if (user) {
        const updatedCompletedModules = [...user.completedModules, module.id];
        const updatedPoints = user.points + module.points;
        
        const updatedUser = {
          ...user,
          points: updatedPoints,
          completedModules: updatedCompletedModules,
          lastAccess: Date.now()
        };
        
        updateUserProfile(updatedUser); // Atualiza o estado local
        await get().checkAndAwardBadges(updatedUser); // Verifica outros badges
      }
    } catch (error) {
      console.error("Erro ao completar módulo:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAndAwardBadges: async (user: User) => {
    // Esta função agora cuida apenas de badges que não dependem da conclusão final
    const firstModuleBadge = availableBadges.find(b => b.id === 'first-module')!;
    if (user.completedModules.length >= 1 && !user.badges.includes(firstModuleBadge.id)) {
      await get().awardBadgeAndPoints(user.uid, firstModuleBadge.id);
    }
  },

  awardBadgeAndPoints: async (userId, badgeId) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user || user.badges.includes(badgeId)) {
      return;
    }

    const badgeToAward = availableBadges.find(b => b.id === badgeId);
    if (!badgeToAward) return;

    // Atualiza o Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      badges: arrayUnion(badgeToAward.id),
      points: increment(badgeToAward.points),
    });

    // Atualiza o estado local
    updateUserProfile({
      badges: [...user.badges, badgeToAward.id],
      points: user.points + badgeToAward.points,
    });
  },
  
  markOnboardingAsCompleted: async (userId: string) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user || user.onboardingCompleted) return;

    set({ isLoading: true });
    
    try {
      const completionTime = Date.now();
      const daysToComplete = differenceInDays(completionTime, new Date(user.createdAt));
      const earnedSprintBadge = daysToComplete <= 5;
      
      const firestoreUpdateData: { [key: string]: any } = {
        onboardingCompleted: true,
        lastAccess: serverTimestamp(),
      };
      
      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find(b => b.id === 'onboarding-sprint')!;
        firestoreUpdateData.badges = arrayUnion(sprintBadge.id);
        firestoreUpdateData.points = increment(sprintBadge.points);
      }
      
      // 1. Atualiza o Firestore com tudo de uma vez
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, firestoreUpdateData);

      // 2. Atualiza o estado local com os dados corretos
      const updatedLocalUser: Partial<User> = {
        onboardingCompleted: true,
        lastAccess: completionTime,
      };
      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find(b => b.id === 'onboarding-sprint')!;
        updatedLocalUser.badges = [...user.badges, sprintBadge.id];
        updatedLocalUser.points = user.points + sprintBadge.points;
      }
      updateUserProfile(updatedLocalUser);
      
      // 3. Gera o certificado
      const certificateRef = doc(collection(db, "certificates"));
      await setDoc(certificateRef, {
        userId: user.uid,
        moduleId: 'trilha-institucional-completa',
        moduleTitle: 'Conclusão da Trilha Institucional',
        completionDate: serverTimestamp(),
        certificateNumber: uuidv4(),
      });

    } catch (error) {
      console.error("Erro ao marcar onboarding como concluído:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFeedback: async (feedback) => {
    set({ isLoading: true });
    try {
      await addDoc(collection(db, 'feedback'), {
        ...feedback,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao adicionar feedback:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));