// src/components/MarcaGrid.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";
import { Car } from "@/data/coches";
import { useState, useEffect } from "react";

export default function MarcaGrid({ cars }: { cars: Car[] }) {
  const { selectedCars, toggleCarSelection } = useCompareStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {cars.map((coche) => {
        const isSelected = isClient ? selectedCars.some(c => c.id === coche.id) : false;
        return (
          <div key={coche.id} className="border rounded-lg shadow-lg bg-white overflow-hidden flex flex-col">
            <Link href={`/coches/${coche.id}`}>
                <div className="relative w-full h-48 cursor-pointer">
                <Image
                    src={coche.imagen}
                    alt={`Foto de ${coche.marca} ${coche.modelo}`}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold">{coche.marca} {coche.modelo}</h2>
                <p className="text-gray-500 mb-2">{coche.potencia} - {coche.motor}</p>
                <div className="flex-grow"><p className="text-2xl font-bold">{coche.precio}</p></div>
                <button onClick={() => toggleCarSelection(coche)} className={`mt-4 w-full text-white py-2 rounded-lg transition-colors ${isSelected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                    {isSelected ? "Quitar de la comparación" : "Añadir para comparar"}
                </button>
                <Link href={`/coches/${coche.id}`} className="text-center mt-2 text-blue-500 hover:underline text-sm">
                    Ver ficha completa
                </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}