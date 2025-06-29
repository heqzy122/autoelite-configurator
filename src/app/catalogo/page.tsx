// src/app/catalogo/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useCompareStore } from "@/store/compareStore";
import { motion } from "framer-motion"; // 👈 Importante

interface Modelo {
  id: number;
  marca: string;
  nombre_modelo: string;
  imagen_preview: string;
  precio_base: number;
}

export default function CatalogoPage() {
  const {
    selectedCars,
    clearSelection,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchTerm,
  } = useCompareStore();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<"default" | "price_asc" | "price_desc">("default");

  useEffect(() => {
    const fetchModelos = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("modelos").select("*");
      if (error) console.error("Error fetching modelos:", error);
      else if (data) setModelos(data as Modelo[]);
      setLoading(false);
    };
    fetchModelos();
  }, []);

  const filtered = modelos.filter((m) => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return (`${m.marca} ${m.nombre_modelo}`.toLowerCase()).includes(t);
  });

  const sorted = filtered.slice().sort((a, b) => {
    if (sortOption === "price_asc") return a.precio_base - b.precio_base;
    if (sortOption === "price_desc") return b.precio_base - a.precio_base;
    return a.id - b.id;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = sorted.slice(start, start + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-gray-100">
        <h1 className="text-4xl font-bold">Cargando Modelos…</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-gray-100">
      {/* Título */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-100">Catálogo completo</h1>
        <p className="text-lg text-gray-400 mt-2">Elige un coche para configurar</p>
      </div>

      {/* Controles */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-800 text-gray-100"
        >
          <option value="default">Orden por defecto</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>

        {selectedCars.length > 0 && (
          <button
            onClick={clearSelection}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Limpiar selección ({selectedCars.length})
          </button>
        )}
      </div>

      {/* Grid con fade-in usando Framer Motion */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginated.map((mod, i) => {
          const isSelected = selectedCars.some(
            (c) =>
              c.marca === mod.marca &&
              c.modelo.startsWith(mod.nombre_modelo)
          );

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/configurar/${mod.id}`}
                className={`group border-2 rounded-lg shadow-md bg-gray-800 overflow-hidden flex flex-col transition-all duration-300 ${
                  isSelected
                    ? "border-green-500 ring-2 ring-green-500/50"
                    : "border-gray-700 hover:border-green-500"
                }`}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={mod.imagen_preview}
                    alt={`${mod.marca} ${mod.nombre_modelo}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-100">
                    {mod.marca} {mod.nombre_modelo}
                  </h2>
                  <div className="flex-grow mt-2">
                    <p className="text-gray-400">Desde</p>
                    <p className="text-2xl font-bold text-green-500">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      }).format(mod.precio_base)}
                    </p>
                  </div>
                  <div className="mt-4 bg-green-600 text-white text-center py-2 rounded-lg group-hover:bg-green-700 transition-colors">
                    Configurar
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50"
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === idx + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-100 hover:bg-gray-600"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </main>
  );
}
