// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listaDeCoches } from "@/data/coches";
import { useCompareStore } from "@/store/compareStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Obtenemos los datos y funciones del almacén global
  const { selectedCars, searchTerm, setSearchTerm } = useCompareStore();

  // Estado para solucionar el error de hidratación
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtenemos la lista de marcas para el menú
  const todasLasMarcas = [...new Set(listaDeCoches.map(coche => coche.marca))].sort();

  // Efecto para evitar el scroll del fondo cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <>
      {/* Encabezado Principal */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Lado Izquierdo: Hamburguesa y Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Abrir menú"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                AutoElite
              </Link>
            </div>

            {/* Lado Derecho: Comparador */}
            <div className="flex items-center">
              <Link href="/comparar" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                {/* El contador ahora está protegido contra errores de hidratación */}
                Comparar coches ({isClient ? selectedCars.length : 0})
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay con el estilo directo para asegurar la transparencia */}
      <div
        style={{
          backgroundColor: isMenuOpen ? 'rgba(31, 41, 55, 0.6)' : 'transparent',
          backdropFilter: isMenuOpen ? 'blur(4px)' : 'none',
          pointerEvents: isMenuOpen ? 'auto' : 'none',
        }}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* El Panel del Menú que se desliza */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-600">Menú</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Cerrar menú">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <input 
              type="text"
              placeholder="Buscar por marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <nav className="flex flex-col space-y-1">
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Marcas</p>
            {todasLasMarcas.map((marca) => (
              <Link 
                key={marca}
                href={`/marca/${marca}`}
                className="text-gray-700 block px-3 py-2 text-base rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {marca}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}