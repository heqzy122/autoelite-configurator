// src/store/compareStore.ts
import { create } from 'zustand';
import { Car } from '@/data/coches';

type CompareState = {
  selectedCars: Car[];
  toggleCarSelection: (car: Car) => void;
  // --- AÑADIMOS ESTO ---
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  // --------------------
};

export const useCompareStore = create<CompareState>((set) => ({
  selectedCars: [],
  searchTerm: "", // El término de búsqueda empieza vacío

  toggleCarSelection: (car) =>
    set((state) => {
      const carExists = state.selectedCars.find((c) => c.id === car.id);
      if (carExists) {
        return {
          selectedCars: state.selectedCars.filter((c) => c.id !== car.id),
        };
      } else {
        if (state.selectedCars.length < 6) {
          return { selectedCars: [...state.selectedCars, car] };
        }
      }
      return state;
    }),

  // --- AÑADIMOS ESTO ---
  // Función que actualiza el término de búsqueda en el almacén
  setSearchTerm: (term) => set({ searchTerm: term }),
  // --------------------
}));