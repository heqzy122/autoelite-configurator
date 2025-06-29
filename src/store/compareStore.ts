// src/store/compareStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car } from '@/types';

interface CompareState {
  selectedCars: Car[];
  garageItemCount: number; // <-- NUEVA PROPIEDAD
  searchTerm: string;
  fuelFilter: string;
  bodyTypeFilter: string;
  currentPage: number;
  itemsPerPage: number;
  toggleCarSelection: (car: Car) => void;
  clearSelection: () => void;
  setGarageItemCount: (count: number) => void; // <-- NUEVA FUNCIÓN
  setSearchTerm: (term: string) => void;
  setFuelFilter: (fuel: string) => void;
  setBodyTypeFilter: (bodyType: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      selectedCars: [],
      garageItemCount: 0, // <-- VALOR INICIAL
      searchTerm: '',
      fuelFilter: 'all',
      bodyTypeFilter: 'all',
      currentPage: 1,
      itemsPerPage: 12,
      toggleCarSelection: (car) =>
        set((state) => {
          const isSelected = state.selectedCars.some((c) => c.id === car.id);
          if (isSelected) {
            return { selectedCars: state.selectedCars.filter((c) => c.id !== car.id) };
          }
          if (state.selectedCars.length < 4) {
            return { selectedCars: [...state.selectedCars, car] };
          }
          return state;
        }),
      clearSelection: () => set({ selectedCars: [] }),
      setGarageItemCount: (count) => set({ garageItemCount: count }), // <-- LÓGICA DE LA NUEVA FUNCIÓN
      setSearchTerm: (term) => set({ searchTerm: term }),
      setFuelFilter: (fuel) => set({ fuelFilter: fuel, currentPage: 1 }),
      setBodyTypeFilter: (bodyType) => set({ bodyTypeFilter: bodyType, currentPage: 1 }),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'compare-storage', 
    }
  )
);