"use client";
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";
import { Car } from '@/types'; // <-- CORRECCIÓN 1: Importar desde /types
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MarcaGrid({ cars }: { cars: Car[] }) {
  const { selectedCars, toggleCarSelection, searchTerm } = useCompareStore(); 
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCarsBySearch = cars.filter(coche => {
    if (!searchTerm) return true; 
    const searchTermLower = searchTerm.toLowerCase();
    
    // CORRECCIÓN 2: Lógica de búsqueda aplanada
    const searchableString = `
      ${coche.marca} 
      ${coche.modelo} 
      ${coche.motor} 
      ${coche.combustible} 
      ${coche.carroceria} 
      ${coche.traccion}
    `.toLowerCase();
    
    return searchableString.includes(searchTermLower);
  });

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredCarsBySearch.length === 0 && searchTerm !== "" ? (
        <p className="col-span-full text-center text-gray-400 text-lg mt-8">
          No se encontraron coches para tu búsqueda: "{searchTerm}"
        </p>
      ) : (
        filteredCarsBySearch.map((coche, index) => {
          const isSelected = isClient ? selectedCars.some(c => c.id === coche.id) : false;
          return (
            <motion.div 
              key={coche.id} 
              className="border border-gray-700 rounded-lg shadow-md bg-gray-800 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}   
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }} 
              viewport={{ once: true, amount: 0.8 }} 
            >
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
                <h2 className="text-2xl font-semibold text-gray-100">{coche.marca} {coche.modelo}</h2>
                <p className="text-gray-300 mb-2">{coche.potencia} - {coche.motor}</p>
                <div className="flex-grow"><p className="text-2xl font-bold text-green-500">{coche.precio}</p></div>
                <button 
                  onClick={() => toggleCarSelection(coche)} 
                  className={`mt-4 w-full text-white py-2 rounded-lg shadow-md transform transition-all duration-200 ${isSelected ? "bg-red-600 hover:bg-red-700 active:scale-98 active:shadow-sm" : "bg-green-600 hover:bg-green-700 active:scale-98 active:shadow-sm"}`}
                >
                  {isSelected ? "Quitar de la comparación" : "Añadir para comparar"}
                </button>
                <Link 
                  href={`/coches/${coche.id}`} 
                  className="text-center mt-2 text-green-400 hover:underline text-sm hover:text-green-500 hover:translate-y-[-2px] transition-transform"
                >
                  Ver ficha completa
                </Link>
              </div>
            </motion.div> 
          );
        })
      )}
    </div>
  );
}