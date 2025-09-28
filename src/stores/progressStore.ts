// src/stores/progressStore.ts
import { create } from "zustand";
import { type Badge, type User } from "../types";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuthStore } from "./authStore";

// AJUSTE DE PONTUAÇÃO (Erro #6)
// Você pode diminuir os pontos aqui, se desejar.
export const availableBadges: Badge[] = [
  {
    id: "first-module",
    name: "Primeiro Passo",
    description: "Complete seu primeiro módulo",
    icon: "🎯",
    category: "completion",
    points: 25, // <-- Pontos diminuídos
    requirements: { modulesCompleted: 1 },
  },
];

// ...
export const useProgressStore = create<ProgressState>((set, get) => ({
  isLoading: false,

  completeModule: async (userId, module) => {
    // ...
    // Dentro do `if (currentUser)`
    if (currentUser) {
        // ... (código para atualizar o usuário)

        // CORREÇÃO: Chama a verificação de badges após o estado ser atualizado
        await get().checkAndAwardBadges(updatedUser);
    }
    // ...
  },

  checkAndAwardBadges: async (user) => {
    // A lógica existente aqui está correta e será chamada agora.
  },
}));