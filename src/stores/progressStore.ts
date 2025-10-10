// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User } from "../types";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";

export const availableBadges: Badge[] = [
  {
    id: "first-module",
    name: "Primeiro Passo",
    description: "Complete seu primeiro módulo",
    icon: "🎯",
    category: "completion",
    points: 50,
    requirements: { modulesCompleted: 1 },
  },
  // Adicione outros badges conforme necessidade
];

interface ProgressState {
  isLoading: boolean;
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<void>;
  checkAndAwardBadges: (user: User) => Promise<void>;
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
        lastAccess: Date.now(),
      });

      // Atualiza estado local sem sobrescrever perfil inteiro
      const authState = useAuthStore.getState();
      const currentUser = authState.user;
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          points: (currentUser.points || 0) + module.points,
          completedModules: [...(currentUser.completedModules || []), module.id],
          lastAccess: Date.now(),
        };
        // set localmente
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

    for (const badge of availableBadges) {
      if (user.badges.includes(badge.id)) continue;

      let earned = false;
      if (badge.id === "first-module" && user.completedModules.length >= (badge.requirements.modulesCompleted || 1)) {
        earned = true;
      }

      if (earned) {
        await updateDoc(userRef, {
          badges: arrayUnion(badge.id),
          points: increment(badge.points),
        });

        const updated = {
          ...user,
          badges: [...user.badges, badge.id],
          points: user.points + badge.points,
        };
        useAuthStore.setState({ user: updated });
      }
    }
  },
}));
