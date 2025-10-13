// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User } from "../types";
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";
import { differenceInDays } from "date-fns";

// NOVOS BADGES ADICIONADOS
export const availableBadges: Badge[] = [
  {
    id: "first-module",
    name: "Primeiro Passo",
    description: "Complete seu primeiro módulo",
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
  // Adicione outros badges conforme necessidade
];

interface ProgressState {
  isLoading: boolean;
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<void>;
  checkAndAwardBadges: (user: User) => Promise<void>;
  addFeedback: (feedback: { userId: string; rating: number; message: string }) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  completeModule: async (userId, module) => {
    set({ isLoading: true });
    const userRef = doc(db, "users", userId);

    try {
      await updateDoc(userRef, {
        completedModules: arrayUnion(module.id),
        points: increment(module.points),
        lastAccess: serverTimestamp(),
      });

      const authState = useAuthStore.getState();
      const currentUser = authState.user;
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          points: (currentUser.points || 0) + module.points,
          completedModules: [...(currentUser.completedModules || []), module.id],
          lastAccess: Date.now(),
        };
        useAuthStore.setState({ user: updatedUser });
        await get().checkAndAwardBadges(updatedUser);
      }
    } catch (error) {
      console.error("Erro ao completar módulo:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAndAwardBadges: async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const badgesToAward: Badge[] = [];

    for (const badge of availableBadges) {
      if (user.badges.includes(badge.id)) continue;

      let earned = false;
      if (badge.id === "first-module" && user.completedModules.length >= 1) {
        earned = true;
      }
      if (badge.id === "onboarding-sprint" && user.onboardingCompleted) {
        const daysToComplete = differenceInDays(new Date(), new Date(user.createdAt));
        if (daysToComplete <= 5) {
          earned = true;
        }
      }

      if (earned) {
        badgesToAward.push(badge);
      }
    }

    if (badgesToAward.length > 0) {
      const totalPoints = badgesToAward.reduce((sum, badge) => sum + badge.points, 0);
      const badgeIds = badgesToAward.map(b => b.id);

      await updateDoc(userRef, {
        badges: arrayUnion(...badgeIds),
        points: increment(totalPoints),
      });

      const updated = {
        ...user,
        badges: [...user.badges, ...badgeIds],
        points: user.points + totalPoints,
      };
      useAuthStore.setState({ user: updated });
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