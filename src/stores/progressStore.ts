// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User, type Module, type OnboardingFeedback, type CompletionDetails } from "../types";
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp, setDoc, getDoc } from "firebase/firestore"; // Added getDoc
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";
import { useModulesStore } from "./modulesStore";
import { differenceInDays } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { LEVELS } from "@/config/gamification";
import useNotificationStore from "./notificationStore";

export const availableBadges: Badge[] = [
  { id: "checkin-hc", name: "Iniciante HC", description: "Concluiu a jornada de boas-vindas e fez seu check-in na plataforma.", icon: "✅", category: "special", points: 100 },
  // Removed quiz-quem-somos badge, points handled by completePageQuiz
  { id: "first-module", name: "Primeiro Passo", description: "Complete seu primeiro item (módulo ou quiz de página)", icon: "🎯", category: "completion", points: 50 }, // Description updated slightly
  { id: "onboarding-sprint", name: "Maratonista", description: "Concluiu o onboarding (6 módulos obrigatórios) em 7 dias ou menos.", icon: "🏃‍♂️", category: "special", points: 250 }, // Description updated
  { id: "mago-hc", name: "Mago HC", description: "Atingiu o nível máximo de conhecimento no Onboarding.", icon: "🧙‍♂️", category: "special", points: 0 },
];

interface ProgressState {
  isLoading: boolean;
  showFeedbackModal: boolean; // State to control the feedback modal globally
  closeFeedbackModal: () => void; // Function to close the modal
  runRetroactiveChecks: (userId: string) => Promise<void>; // Pass userId
  completeModule: (userId: string, module: { id: string; points: number; isRequired: boolean }) => Promise<boolean>; // Returns true if onboarding completed NOW
  completePageQuiz: (userId: string, pageQuizId: string, points: number) => Promise<void>; // Function to mark page quizzes
  checkAndCompleteOnboarding: (userId: string) => Promise<boolean>; // Extracted logic, returns true if completed NOW
  markOnboardingAsCompleted: (userId: string) => Promise<void>; // Internal use
  awardBadgeAndPoints: (userId: string, badgeId: string) => Promise<void>;
}

// Helper to check if onboarding is complete based on required modules
const checkRequiredModulesCompletion = (user: User | null): boolean => {
    if (!user) return false;
    const allModules = useModulesStore.getState().modules;
    const requiredModules = allModules.filter((m) => m.isRequired);
    if (requiredModules.length === 0) return false; // Avoid completing if no required modules loaded
    return requiredModules.every((m) => user.completedModules?.includes(m.id));
};


export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,
  showFeedbackModal: false, // Initial state for feedback modal

  closeFeedbackModal: () => set({ showFeedbackModal: false }), // Action to close modal

  awardBadgeAndPoints: async (userId, badgeId) => {
    // --- No change needed here, logic remains the same ---
    const badge = availableBadges.find(b => b.id === badgeId);
    // Fetch the latest user data directly before awarding
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentUserData = userSnap.data() as User | undefined;

    if (!currentUserData || !badge || currentUserData.badges?.includes(badgeId)) {
      console.log(`[awardBadge] Badge ${badgeId} já existe ou usuário/badge inválido.`);
      return;
    }

    console.log(`[awardBadge] Concedendo badge ${badgeId} (+${badge.points} pts) para ${userId}`);
    set({ isLoading: true });
    try {
      await updateDoc(userRef, {
        badges: arrayUnion(badge.id),
        points: increment(badge.points),
      });

      // Update local authStore state optimistically
      const { user: localUser, updateUserProfile } = useAuthStore.getState();
      if(localUser && localUser.uid === userId) {
          updateUserProfile({
              points: (localUser.points || 0) + badge.points,
              badges: [...(localUser.badges || []), badge.id],
          });
      }

    } catch (error) {
      console.error(`Erro ao conceder o badge ${badgeId}:`, error);
    } finally {
      set({ isLoading: false });
    }
  },

  runRetroactiveChecks: async (userId: string) => {
    // --- No change needed here, logic remains the same ---
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const user = userSnap.data() as User | undefined;
    if (!user) return;

    const badgesToAward: Badge[] = [];
    let pointsToAdd = 0;

    // Check Mago HC badge
    const maxLevel = LEVELS[LEVELS.length - 1];
    if (user.points >= maxLevel.minPoints && !user.badges?.includes('mago-hc')) {
      const magoBadge = availableBadges.find(b => b.id === 'mago-hc');
      if (magoBadge) {
          badgesToAward.push(magoBadge);
          pointsToAdd += magoBadge.points; // Though it's 0 currently
        }
    }

    // Check Onboarding Sprint badge
    if (user.onboardingCompleted && !user.badges?.includes('onboarding-sprint')) {
      if (user.completionDetails && user.completionDetails.daysToComplete <= 7) {
        const sprintBadge = availableBadges.find(b => b.id === 'onboarding-sprint');
         if (sprintBadge) {
             badgesToAward.push(sprintBadge);
             pointsToAdd += sprintBadge.points;
            }
      }
    }

    // Award badges if any are found
    if (badgesToAward.length > 0) {
      const badgeIdsToAdd = badgesToAward.map(b => b.id);
      console.log(`[Retro Checks] Concedendo badges retroativos: ${badgeIdsToAdd.join(', ')} (+${pointsToAdd} pts) para ${userId}`);

      const firestoreUpdate: { [key: string]: any } = {
        badges: arrayUnion(...badgeIdsToAdd),
      };
      if (pointsToAdd > 0) {
        firestoreUpdate.points = increment(pointsToAdd);
      }

      try {
        await updateDoc(userRef, firestoreUpdate);

        // Update local authStore state optimistically
        const { user: localUser, updateUserProfile } = useAuthStore.getState();
        if (localUser && localUser.uid === userId) {
            updateUserProfile({
                points: (localUser.points || 0) + pointsToAdd,
                badges: [...new Set([...(localUser.badges || []), ...badgeIdsToAdd])]
            });
        }
      } catch (error) {
        console.error("Erro ao conceder badges retroativamente:", error);
      }
    } else {
        console.log(`[Retro Checks] Nenhum badge retroativo para conceder a ${userId}`);
    }
  },

  // --- CORREÇÃO: completeModule now triggers the overall completion check ---
  completeModule: async (userId, module) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentUserData = userSnap.data() as User | undefined;

    if (!currentUserData || currentUserData.completedModules?.includes(module.id)) {
        console.log(`[completeModule] Módulo ${module.id} já completo ou usuário inválido.`);
        // Ensure onboarding check runs even if module was already complete locally but not on backend perhaps
        return await get().checkAndCompleteOnboarding(userId);
    }

    console.log(`[completeModule] Completando módulo ${module.id} (+${module.points} pts) para ${userId}`);
    set({ isLoading: true });
    let onboardingCompletedNow = false;
    try {
      await updateDoc(userRef, {
        completedModules: arrayUnion(module.id),
        points: increment(module.points),
        lastAccess: serverTimestamp(),
      });

      // Update local authStore state optimistically BEFORE checking completion
      const { user: localUser, updateUserProfile } = useAuthStore.getState();
      if(localUser && localUser.uid === userId) {
          const updatedUser = {
              ...localUser,
              points: (localUser.points || 0) + module.points,
              completedModules: [...new Set([...(localUser.completedModules || []), module.id])]
          };
          updateUserProfile(updatedUser); // Update the store

          // Now check if onboarding is complete with the updated local state
          onboardingCompletedNow = await get().checkAndCompleteOnboarding(userId); // Use the updated state
      } else {
           // If local user doesn't match, still run check based on potentially updated backend data
          onboardingCompletedNow = await get().checkAndCompleteOnboarding(userId);
      }

       // Run retroactive checks after module completion and potential onboarding completion
       await get().runRetroactiveChecks(userId);


    } catch (error) {
        console.error("Erro ao completar módulo:", error);
    } finally {
        set({ isLoading: false });
    }
    // Return whether the onboarding was marked as completed in this specific call
    return onboardingCompletedNow;
  },
  // --- FIM CORREÇÃO ---

  // --- CORREÇÃO: completePageQuiz only marks the quiz and adds points, NO LONGER checks overall completion ---
  completePageQuiz: async (userId, pageQuizId, points) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentUserData = userSnap.data() as User | undefined;

    if (!currentUserData || currentUserData.completedPageQuizzes?.includes(pageQuizId)) {
        console.log(`[completePageQuiz] Quiz ${pageQuizId} já completo ou usuário inválido.`);
        return;
    }

    console.log(`[completePageQuiz] Completando quiz de página ${pageQuizId} (+${points} pts) para ${userId}`);
    set({ isLoading: true });
    try {
        await updateDoc(userRef, {
            completedPageQuizzes: arrayUnion(pageQuizId),
            points: increment(points),
            lastAccess: serverTimestamp(),
        });

        // Update local authStore state optimistically
        const { user: localUser, updateUserProfile } = useAuthStore.getState();
        if(localUser && localUser.uid === userId) {
            updateUserProfile({
                points: (localUser.points || 0) + points,
                completedPageQuizzes: [...new Set([...(localUser.completedPageQuizzes || []), pageQuizId])]
            });
        }

        // Award first-step badge if applicable (check happens in Dashboard useEffect)
        // No longer checks overall onboarding completion here

    } catch (error) {
        console.error(`Erro ao completar quiz de página ${pageQuizId}:`, error);
    } finally {
        set({ isLoading: false });
    }
  },
  // --- FIM CORREÇÃO ---

  // --- CORREÇÃO: Extracted logic to check and potentially mark onboarding completion ---
  checkAndCompleteOnboarding: async (userId) => {
    const { user: currentUser } = useAuthStore.getState(); // Get potentially updated user state

    if (!currentUser || currentUser.uid !== userId || currentUser.onboardingCompleted) {
        return false; // Already completed or not the right user
    }

    const allRequiredModulesCompleted = checkRequiredModulesCompletion(currentUser);

    if (allRequiredModulesCompleted) {
        console.log(`[checkAndComplete] Todos os ${useModulesStore.getState().modules.filter(m => m.isRequired).length} módulos obrigatórios completos para ${userId}. Marcando onboarding...`);
        await get().markOnboardingAsCompleted(userId); // Mark completion
        set({ showFeedbackModal: true }); // Set flag to show feedback modal
        return true; // Indicate completion happened now
    }
    return false; // Not completed yet
  },
  // --- FIM CORREÇÃO ---

  markOnboardingAsCompleted: async (userId: string) => {
    // --- Logic remains largely the same, ensures it only runs once ---
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentUserData = userSnap.data() as User | undefined;

    // Double check to prevent multiple executions
    if (!currentUserData || currentUserData.onboardingCompleted) {
        console.log(`[markOnboarding] Onboarding já completo para ${userId} ou usuário inválido.`);
        return;
    }

    console.log(`[markOnboarding] Marcando onboarding como completo para ${userId}`);
    set({ isLoading: true });
    try {
      const completionTime = Date.now();
      const daysToComplete = differenceInDays(completionTime, new Date(currentUserData.createdAt));
      const completionDetails: CompletionDetails = { completedAt: completionTime, daysToComplete, wasOverdue: daysToComplete > 30 };
      const firestoreUpdate: Record<string, any> = { onboardingCompleted: true, completionDetails, lastAccess: serverTimestamp() };

      // Check for sprint badge *only* when marking completion
      const earnedSprintBadge = daysToComplete <= 7 && !currentUserData.badges?.includes("onboarding-sprint");
      let localPointsUpdate = currentUserData.points || 0;
      let localBadgesUpdate = [...(currentUserData.badges || [])];

      if (earnedSprintBadge) {
        const sprintBadge = availableBadges.find((b) => b.id === "onboarding-sprint")!;
        firestoreUpdate.badges = arrayUnion(sprintBadge.id);
        firestoreUpdate.points = increment(sprintBadge.points);
        localPointsUpdate += sprintBadge.points;
        localBadgesUpdate.push(sprintBadge.id);
         console.log(`[markOnboarding] Concedendo badge 'onboarding-sprint' para ${userId}`);
      }

      await updateDoc(userRef, firestoreUpdate);

      // Create Certificate Entry
      const certRef = doc(collection(db, "certificates"));
      await setDoc(certRef, { userId: currentUserData.uid, moduleId: "trilha-institucional-completa", moduleTitle: "Conclusão da Trilha Institucional", completionDate: completionTime, certificateNumber: uuidv4() });
      console.log(`[markOnboarding] Certificado de conclusão gerado para ${userId}`);

      // Add Notification
      useNotificationStore.getState().addNotification({
        userId: currentUserData.uid,
        message: 'Parabéns! Seu certificado de conclusão da trilha já está disponível para download.',
        link: '/certificates',
        type: 'badge_earned', // Reusing type, could add a specific 'certificate' type
        read: false,
      });

      // Update local authStore state
       const { user: localUser, updateUserProfile } = useAuthStore.getState();
        if(localUser && localUser.uid === userId) {
            updateUserProfile({ onboardingCompleted: true, completionDetails, points: localPointsUpdate, badges: localBadgesUpdate });
        }

    } catch (error) { console.error("Erro ao marcar onboarding como concluído:", error); }
    finally { set({ isLoading: false }); }
  },

  addFeedback: async (feedback) => {
    // --- No change needed here, logic remains the same ---
    set({ isLoading: true });
    try {
      const { userId, rating, message } = feedback;
      const feedbackTime = Date.now();
      await addDoc(collection(db, "feedback"), { ...feedback, createdAt: serverTimestamp() });
      const userFeedbackData: OnboardingFeedback = { rating, message, submittedAt: feedbackTime };
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { onboardingFeedback: userFeedbackData });
      useAuthStore.getState().updateUserProfile({ onboardingFeedback: userFeedbackData });
       console.log(`[addFeedback] Feedback adicionado para ${userId}`);
    } catch (error) { console.error("Erro ao adicionar feedback:", error); }
    finally { set({ isLoading: false }); }
  },
}));