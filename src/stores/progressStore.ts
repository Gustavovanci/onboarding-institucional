// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User, type Module, type OnboardingFeedback, type CompletionDetails } from "../types";
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";
import { useModulesStore } from "./modulesStore";
import { differenceInDays } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { LEVELS } from "@/config/gamification";
import useNotificationStore from "./notificationStore";

export const availableBadges: Badge[] = [
  { id: "checkin-hc", name: "Iniciante HC", description: "Concluiu a jornada de boas-vindas e fez seu check-in na plataforma.", icon: "✅", category: "special", points: 100 },
  { id: "quiz-quem-somos", name: "Conhecedor Institucional", description: "Completou o quiz da página Quem Somos.", icon: "🧭", category: "special", points: 50 },
  { id: "first-module", name: "Primeiro Passo", description: "Complete seu primeiro módulo da trilha institucional", icon: "🎯", category: "completion", points: 50 },
  { id: "onboarding-sprint", name: "Maratonista", description: "Concluiu o onboarding em 7 dias ou menos.", icon: "🏃‍♂️", category: "special", points: 250 },
  { id: "mago-hc", name: "Mago HC", description: "Atingiu o nível máximo de conhecimento no Onboarding.", icon: "🧙‍♂️", category: "special", points: 0 },
];

interface ProgressState {
  isLoading: boolean;
  runRetroactiveChecks: () => Promise<void>;
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<boolean>;
  addFeedback: (feedback: { userId: string; rating: number; message: string }) => Promise<void>;
  markOnboardingAsCompleted: (userId: string) => Promise<void>;
  awardBadgeAndPoints: (userId: string, badgeId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  awardBadgeAndPoints: async (userId, badgeId) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    const badge = availableBadges.find(b => b.id === badgeId);

    if (!user || !badge || user.badges.includes(badgeId)) {
      return;
    }

    set({ isLoading: true });
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        badges: arrayUnion(badge.id),
        points: increment(badge.points),
      });

      const updatedUser = {
        ...user,
        points: user.points + badge.points,
        badges: [...user.badges, badge.id],
      };
      updateUserProfile(updatedUser);
      
    } catch (error) {
      console.error(`Erro ao conceder o badge ${badgeId}:`, error);
    } finally {
      set({ isLoading: false });
    }
  },

  runRetroactiveChecks: async () => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user) return;

    const badgesToAward: Badge[] = [];

    const maxLevel = LEVELS[LEVELS.length - 1];
    if (user.points >= maxLevel.minPoints && !user.badges.includes('mago-hc')) {
      const magoBadge = availableBadges.find(b => b.id === 'mago-hc');
      if (magoBadge) badgesToAward.push(magoBadge);
    }

    if (user.onboardingCompleted && !user.badges.includes('onboarding-sprint')) {
      if (user.completionDetails && user.completionDetails.daysToComplete <= 7) {
        const sprintBadge = availableBadges.find(b => b.id === 'onboarding-sprint');
        if (sprintBadge) badgesToAward.push(sprintBadge);
      }
    }

    if (badgesToAward.length > 0) {
      const badgeIdsToAdd = badgesToAward.map(b => b.id);
      const pointsToAdd = badgesToAward.reduce((sum, b) => sum + b.points, 0);

      const userRef = doc(db, 'users', user.uid);
      const firestoreUpdate: { [key: string]: any } = {
        badges: arrayUnion(...badgeIdsToAdd),
      };
      if (pointsToAdd > 0) {
        firestoreUpdate.points = increment(pointsToAdd);
      }
      
      try {
        await updateDoc(userRef, firestoreUpdate);

        const newBadges = [...new Set([...user.badges, ...badgeIdsToAdd])];
        const newPoints = user.points + pointsToAdd;
        updateUserProfile({ ...user, badges: newBadges, points: newPoints });
      } catch (error) {
        console.error("Erro ao conceder badges retroativamente:", error);
      }
    }
  },

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
        const updatedUser = { ...user, points: user.points + module.points, completedModules: [...new Set([...user.completedModules, module.id])] };
        updateUserProfile(updatedUser);
        
        await get().runRetroactiveChecks();
        
        const allModules = useModulesStore.getState().modules;
        const requiredModules = allModules.filter((m) => m.isRequired);
        if (requiredModules.length > 0) {
          const allRequiredCompleted = requiredModules.every((m) => updatedUser.completedModules.includes(m.id));
          if (allRequiredCompleted && !updatedUser.onboardingCompleted) {
            await get().markOnboardingAsCompleted(userId);
            onboardingCompletedNow = true;
          }
        }
      }
    } catch (error) { console.error("Erro ao completar módulo:", error); } 
    finally { set({ isLoading: false }); }
    return onboardingCompletedNow;
  },

  markOnboardingAsCompleted: async (userId: string) => {
    const { user, updateUserProfile } = useAuthStore.getState();
    if (!user || user.onboardingCompleted) return;
    set({ isLoading: true });
    try {
      const completionTime = Date.now();
      const daysToComplete = differenceInDays(completionTime, new Date(user.createdAt));
      const earnedSprintBadge = daysToComplete <= 7;
      const completionDetails: CompletionDetails = { completedAt: completionTime, daysToComplete, wasOverdue: daysToComplete > 30 };
      const firestoreUpdate: Record<string, any> = { onboardingCompleted: true, completionDetails, lastAccess: serverTimestamp() };
      let localPointsUpdate = user.points;
      let localBadgesUpdate = [...user.badges];
      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find((b) => b.id === "onboarding-sprint")!;
        firestoreUpdate.badges = arrayUnion(sprintBadge.id);
        firestoreUpdate.points = increment(sprintBadge.points);
        localPointsUpdate += sprintBadge.points;
        localBadgesUpdate.push(sprintBadge.id);
      }
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, firestoreUpdate);
      const certRef = doc(collection(db, "certificates"));
      await setDoc(certRef, { userId: user.uid, moduleId: "trilha-institucional-completa", moduleTitle: "Conclusão da Trilha Institucional", completionDate: completionTime, certificateNumber: uuidv4() });
      
      useNotificationStore.getState().addNotification({
        userId: user.uid,
        message: 'Parabéns! Seu certificado de conclusão da trilha já está disponível para download.',
        link: '/certificates',
        type: 'badge_earned',
        read: false,
      });
      
      updateUserProfile({ onboardingCompleted: true, completionDetails, points: localPointsUpdate, badges: localBadgesUpdate });
    } catch (error) { console.error("Erro ao marcar onboarding como concluído:", error); } 
    finally { set({ isLoading: false }); }
  },

  addFeedback: async (feedback) => {
    set({ isLoading: true });
    try {
      const { userId, rating, message } = feedback;
      const feedbackTime = Date.now();
      await addDoc(collection(db, "feedback"), { ...feedback, createdAt: serverTimestamp() });
      const userFeedbackData: OnboardingFeedback = { rating, message, submittedAt: feedbackTime };
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { onboardingFeedback: userFeedbackData });
      useAuthStore.getState().updateUserProfile({ onboardingFeedback: userFeedbackData });
    } catch (error) { console.error("Erro ao adicionar feedback:", error); } 
    finally { set({ isLoading: false }); }
  },
}));