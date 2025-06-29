// src/app/catalogo/page.tsx

"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompareStore } from "@/store/compareStore";

// Definimos un tipo para los modelos que vienen de la BD
interface Modelo {
  id: number;
  marca: string;
  nombre_modelo: string;
  imagen_preview: string;
  precio_base: number;
}

export default function CatalogoPage() {
  // 1. OBTENEMOS TODO LO NECESARIO DEL ESTADO GLOBAL
  const { 
    selectedCars, 
    clearSelection, 
    currentPage, 
    setCurrentPage, 
    itemsPerPage, 
    searchTerm 
  } = useCompareStore();
  
  const [sortOption, setSortOption] = useState('default');
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelos = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('modelos').select('*');
      if (error) {
        console.error("Error fetching modelos:", error);
      } else {
        setModelos(data as Modelo[]);
      }
      setLoading(false);
    };
    fetchModelos();
  }, []);

  const filteredModelos = modelos.filter(modelo => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const searchableString = `${modelo.marca} ${modelo.nombre_modelo}`.toLowerCase();
    return searchableString.includes(searchTermLower);
  });

  const sortedModelos = [...filteredModelos].sort((a, b) => {
    switch (sortOption) {
      case 'price_asc': return a.precio_base - b.precio_base;
      case 'price_desc': return b.precio_base - a.precio_base;
      default: return a.id - b.id;
    }
  });

  const totalPages = Math.ceil(sortedModelos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedModelos = sortedModelos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-gray-100">
        <h1 className="text-4xl font-bold">Cargando Modelos...</h1>
      </main>
    );
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-gray-100">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-100">Elige un Modelo para Configurar</h1>
        <p className="text-lg text-gray-400 mt-2">Selecciona un vehículo para empezar a personalizarlo a tu gusto.</p>
      </div>

      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-800 text-gray-100">
          <option value="default">Orden por defecto</option>
          <option value="price_asc">Precio: de menor a mayor</option>
          <option value="price_desc">Precio: de mayor a menor</option>
        </select>
        
        {/* 2. BOTÓN PARA LIMPIAR LA SELECCIÓN */}
        {selectedCars.length > 0 && (
          <button onClick={clearSelection} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2">
            Limpiar todo ({selectedCars.length})
          </button>
        )}
      </div>
      
      {paginatedModelos.length === 0 && searchTerm ? (
        <div className="text-center text-gray-400 mt-16">
            <h2 className="text-2xl">Sin resultados</h2>
            <p>No se encontraron modelos para tu búsqueda: "{searchTerm}"</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedModelos.map((modelo) => {
            // 3. LÓGICA DE SELECCIÓN VISUAL
            const isSelected = selectedCars.some(car => car.marca === modelo.marca && car.modelo.startsWith(modelo.nombre_modelo));

            return (
              <Link
                key={modelo.id}
                href={`/configurar/${modelo.id}`}
                // 4. ESTILO CONDICIONAL
                className={`group border-2 rounded-lg shadow-md bg-gray-800 overflow-hidden flex flex-col transition-all duration-300 ${
                  isSelected ? 'border-green-500 ring-2 ring-green-500/50' : 'border-gray-700 hover:border-green-500'
                }`}
              >
                <div className="relative w-full h-48">
                  <Image src={modelo.imagen_preview} alt={`Foto de ${modelo.marca} ${modelo.nombre_modelo}`} fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105" unoptimized />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-100">{modelo.marca} {modelo.nombre_modelo}</h2>
                  <div className="flex-grow mt-2">
                    <p className="text-gray-400">Desde</p>
                    <p className="text-2xl font-bold text-green-500">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(modelo.precio_base)}</p>
                  </div>
                  <div className="mt-4 bg-green-600 text-white text-center py-2 rounded-lg group-hover:bg-green-700 transition-colors">Configurar</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50">Anterior</button>
          {[...Array(totalPages)].map((_, index) => (<button key={index} onClick={() => handlePageChange(index + 1)} className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-100 hover:bg-gray-600'}`}>{index + 1}</button>))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50">Siguiente</button>
        </div>
      )}
    </main>
  );
}