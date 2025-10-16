// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User, type Module } from "../types";
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp, setDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";
import { useModulesStore } from "./modulesStore";
import { differenceInDays } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

export const availableBadges: Badge[] = [
  { id: "checkin-hc", name: "Iniciante HC", description: "Concluiu a jornada de boas-vindas e fez seu check-in na plataforma.", icon: "✅", category: "special", points: 100 },
  { id: "first-module", name: "Primeiro Passo", description: "Complete seu primeiro módulo da trilha institucional", icon: "🎯", category: "completion", points: 50 },
  { id: "onboarding-sprint", name: "Maratonista", description: "Conclua o onboarding em menos de 5 dias", icon: "🏃‍♂️", category: "special", points: 200 },
];

interface ProgressState {
  isLoading: boolean;
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<boolean>;
  checkAndAwardBadges: (user: User) => Promise<void>;
  addFeedback: (feedback: { userId: string; rating: number; message: string }) => Promise<void>;
  awardBadgeAndPoints: (userId: string, badgeId: string) => Promise<void>;
  markOnboardingAsCompleted: (userId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  completeModule: async (userId, module) => {
    set({ isLoading: true });
    let onboardingCompletedNow = false;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        completedModules: arrayUnion(module.id),
        points: increment(module.points),
        lastAccess: serverTimestamp(),
      });

      const { user, updateUserProfile } = useAuthStore.getState();

      if (user) {
        // Atualiza o usuário localmente
        const updatedUser: User = {
          ...user,
          points: user.points + module.points,
          completedModules: [...new Set([...user.completedModules, module.id])],
        };
        updateUserProfile(updatedUser);

        await get().checkAndAwardBadges(updatedUser);

        // 🔍 Carrega módulos obrigatórios (garante que realmente estejam disponíveis)
        let allModules: Module[] = useModulesStore.getState().modules;
        if (!allModules || allModules.length === 0) {
          const snapshot = await getDocs(collection(db, "modules"));
          allModules = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Module[];
        }

        const requiredModules = allModules.filter((m) => m.isRequired);

        if (requiredModules.length > 0) {
          const allRequiredCompleted = requiredModules.every((m) =>
            updatedUser.completedModules.includes(m.id)
          );

          if (allRequiredCompleted && !updatedUser.onboardingCompleted) {
            await get().markOnboardingAsCompleted(userId);
            onboardingCompletedNow = true;
          }
        }
      }
    } catch (error) {
      console.error("Erro ao completar módulo:", error);
    } finally {
      set({ isLoading: false });
    }

    return onboardingCompletedNow;
  },

  markOnboardingAsCompleted: async (userId: string) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user || user.onboardingCompleted) return;

    set({ isLoading: true });
    try {
      const completionTime = Date.now();
      const daysToComplete = differenceInDays(completionTime, new Date(user.createdAt));
      const earnedSprintBadge = daysToComplete <= 5;

      const firestoreUpdate: Record<string, any> = {
        onboardingCompleted: true,
        certificateIssued: true,
        lastAccess: serverTimestamp(),
      };

      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find((b) => b.id === "onboarding-sprint")!;
        firestoreUpdate.badges = arrayUnion(sprintBadge.id);
        firestoreUpdate.points = increment(sprintBadge.points);
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, firestoreUpdate);

      // 🔖 Cria certificado
      const certRef = doc(collection(db, "certificates"));
      await setDoc(certRef, {
        userId: user.uid,
        moduleId: "trilha-institucional-completa",
        moduleTitle: "Conclusão da Trilha Institucional",
        completionDate: completionTime,
        certificateNumber: uuidv4(),
      });

      const updatedLocalUser: Partial<User> = {
        onboardingCompleted: true,
        certificateIssued: true,
        lastAccess: completionTime,
      };

      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find((b) => b.id === "onboarding-sprint")!;
        updatedLocalUser.badges = [...user.badges, sprintBadge.id];
        updatedLocalUser.points = user.points + sprintBadge.points;
      }

      updateUserProfile(updatedLocalUser);
    } catch (error) {
      console.error("Erro ao marcar onboarding como concluído:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFeedback: async (feedback) => {
    set({ isLoading: true });
    try {
      await addDoc(collection(db, "feedback"), {
        ...feedback,
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", feedback.userId);
      await updateDoc(userRef, { feedbackSubmitted: true });

      useAuthStore.getState().updateUserProfile({ feedbackSubmitted: true });
    } catch (error) {
      console.error("Erro ao adicionar feedback:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAndAwardBadges: async (user: User) => {
    const firstModuleBadge = availableBadges.find((b) => b.id === "first-module")!;
    if (user.completedModules.length >= 1 && !user.badges.includes(firstModuleBadge.id)) {
      await get().awardBadgeAndPoints(user.uid, firstModuleBadge.id);
    }
  },

  awardBadgeAndPoints: async (userId, badgeId) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user || user.badges.includes(badgeId)) return;

    const badge = availableBadges.find((b) => b.id === badgeId);
    if (!badge) return;

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      badges: arrayUnion(badge.id),
      points: increment(badge.points),
    });

    updateUserProfile({
      badges: [...user.badges, badge.id],
      points: user.points + badge.points,
    });
  },
}));
