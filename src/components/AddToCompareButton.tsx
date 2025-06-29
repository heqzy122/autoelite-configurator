"use client";
    
import { useCompareStore } from "@/store/compareStore";
import { Car } from "@/types";
    
export default function AddToCompareButton({ car }: { car: Car }) {
  const { selectedCars, toggleCarSelection } = useCompareStore();
  const isSelected = selectedCars.some(c => c.id === car.id);
    
  return (
    <button
      onClick={() => toggleCarSelection(car)}
      className={`flex-1 text-center px-3 py-2 rounded-md transition-colors text-xs font-semibold ${
        isSelected 
        ? 'bg-red-600 text-white hover:bg-red-700' 
        : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {isSelected ? 'Quitar' : 'Comparar'}
    </button>
  );
}