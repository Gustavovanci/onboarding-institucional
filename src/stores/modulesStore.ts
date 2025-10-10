// ARQUIVO: src/stores/modulesStore.ts
import { create } from 'zustand';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { type Module } from '../types';

interface ModulesState {
  modules: Module[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchModules: () => Promise<void>;
}

export const useModulesStore = create<ModulesState>((set, get) => ({
  modules: [],
  isLoading: false,
  hasFetched: false,
  fetchModules: async () => {
    // Evita buscar os dados mais de uma vez se já foram carregados
    if (get().hasFetched || get().isLoading) return;

    set({ isLoading: true });
    try {
      const q = query(collection(db, 'modules'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const modulesList: Module[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Module, 'id'>),
      }));
      set({ modules: modulesList, hasFetched: true, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar módulos no store:", err);
      set({ isLoading: false });
    }
  },
}));