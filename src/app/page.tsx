// src/app/page.tsx

"use client"; // <-- ¡CAMBIO IMPORTANTE! Lo convertimos en Componente de Cliente.

import Link from 'next/link';
import Image from 'next/image';
import BrandGallery from '@/components/BrandGallery';
import { supabase } from "@/lib/supabaseClient";
import { Car } from '@/types';
import { motion } from "framer-motion";
import { useState, useEffect } from 'react'; // Importamos useState y useEffect

// Definimos un tipo para los modelos
interface Modelo {
  id: number;
  marca: string;
  nombre_modelo: string;
  imagen_preview: string;
  precio_base: number;
}

export default function HomePage() {
  
  // Creamos estados para guardar los datos y el estado de carga
  const [todosLosModelos, setTodosLosModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);

  // Usamos useEffect para cargar los datos en el lado del cliente
  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('modelos')
        .select('*');

      if (error) {
        console.error("Error fetching models for homepage:", error);
      } else {
        setTodosLosModelos(data || []);
      }
      setLoading(false);
    };

    fetchModels();
  }, []); // El array vacío asegura que se ejecuta solo una vez

  // La lógica para seleccionar los destacados ahora se ejecuta después de cargar los datos
  const featuredCars = todosLosModelos.slice(0, 4);

  return (
    <main>
      {/* Sección Hero */}
      <div className="relative h-screen flex items-center justify-center">
        <Image src="/hero-background.jpg" alt="Fondo de coche" fill style={{ objectFit: 'cover', zIndex: -1 }} priority />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">Bienvenido a AutoElite</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 drop-shadow-lg">Configura, compara y encuentra el coche de tus sueños.</p>
          <Link href="/catalogo" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 transition-transform hover:scale-105 active:scale-95 active:shadow-sm">
            Explorar Catálogo
          </Link>
        </div>
      </div>

      <BrandGallery allCars={todosLosModelos} />

      <section className="bg-gray-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-gray-100 mb-12">
            Modelos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {loading ? (
              <p className="col-span-full text-center text-gray-400">Cargando modelos destacados...</p>
            ) : (
              featuredCars.map((modelo, index) => (
                <motion.div 
                  key={modelo.id} 
                  className="border border-gray-700 rounded-lg shadow-xl bg-gray-800 overflow-hidden transform transition-transform duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }}   
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }} 
                  viewport={{ once: true, amount: 0.8 }} 
                >
                  <Link href={`/configurar/${modelo.id}`}>
                    <div className="relative w-full h-56 cursor-pointer">
                      <Image 
                        src={modelo.imagen_preview}
                        alt={`Foto de ${modelo.marca} ${modelo.nombre_modelo}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={index < 4}
                        unoptimized
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col items-center text-center">
                    <h3 className="text-xl font-semibold text-gray-100 mb-1">{modelo.marca} {modelo.nombre_modelo}</h3>
                    <p className="text-gray-300 text-sm mb-3">Desde</p>
                    <p className="text-3xl font-bold text-green-500 mb-4">
                       {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(modelo.precio_base)}
                    </p>
                    <div 
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-base hover:bg-green-700 transition-colors"
                    >
                      Configurar
                    </div>
                  </div>
                </motion.div> 
              ))
            )}
          </div>
          <div className="text-center mt-16">
            <Link href="/catalogo" className="inline-block border border-green-600 text-green-500 px-8 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-green-600 hover:text-white transition-colors transform hover:scale-105 active:scale-95 active:shadow-sm">
              Ver Todo el Catálogo &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}