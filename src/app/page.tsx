// src/app/page.tsx
"use client"; 

import { listaDeCoches } from "@/data/coches"; 
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";
import { useState, useEffect } from "react";

const parseValue = (value: string): number => {
  const cleanedString = value.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedString);
};

export default function Home() {
  const { selectedCars, toggleCarSelection, searchTerm } = useCompareStore();
  const [isClient, setIsClient] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCars = listaDeCoches.filter(coche => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const ficha = coche.fichaTecnica;
    const searchableString = `${coche.marca} ${coche.modelo} ${coche.motor} ${ficha.combustible} ${ficha.carroceria} ${ficha.traccion}`.toLowerCase();
    return searchableString.includes(searchTermLower);
  });

  const sortedAndFilteredCars = [...filteredCars].sort((a, b) => {
    switch (sortOption) {
      case 'price_asc':
        return parseValue(a.precio) - parseValue(b.precio);
      case 'price_desc':
        return parseValue(b.precio) - parseValue(a.precio);
      case 'power_desc':
        return parseValue(b.potencia) - parseValue(a.potencia);
      case 'power_asc':
        return parseValue(a.potencia) - parseValue(b.potencia);
      default:
        return a.id - b.id;
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold">AutoElite</h1>
        <p className="text-lg text-gray-600 mt-2">
          Elige hasta 6 coches para ver su ficha y compararlos
        </p>
      </div>

      <div className="w-full max-w-7xl flex justify-end mb-6">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Orden por defecto</option>
          <option value="price_asc">Precio: de menor a mayor</option>
          <option value="price_desc">Precio: de mayor a menor</option>
          <option value="power_desc">Potencia: de mayor a menor</option>
          <option value="power_asc">Potencia: de menor a mayor</option>
        </select>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedAndFilteredCars.map((coche) => {
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
                    priority={coche.id <= 4}
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold">{coche.marca} {coche.modelo}</h2>
                <p className="text-gray-500 mb-2">{coche.potencia} - {coche.motor}</p>
                <div className="flex-grow"><p className="text-2xl font-bold">{coche.precio}</p></div>
                <button onClick={() => toggleCarSelection(coche)} className={`mt-4 w-full text-white py-2 rounded-lg transition-colors ${ isSelected ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700" }`} >
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
    </main>
  );
}