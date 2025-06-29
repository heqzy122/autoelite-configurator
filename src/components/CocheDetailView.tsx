"use client";
import Image from "next/image";
import { Car } from "@/types";
import { useCompareStore } from "@/store/compareStore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CocheDetailView({ coche }: { coche: Car }) {
  const { selectedCars, toggleCarSelection } = useCompareStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isSelected = isClient ? selectedCars.some(c => c.id === coche.id) : false;

  const details = [
    { label: "Velocidad Máxima", value: coche.velocidadMaxima },
    { label: "Aceleración (0-100)", value: coche.aceleracion },
    { label: "Consumo Medio", value: coche.consumoMedio },
    { label: "Emisiones CO2", value: coche.emisionesCO2 },
    { label: "Carrocería", value: coche.carroceria },
    { label: "Longitud", value: coche.longitud },
    { label: "Anchura", value: coche.anchura },
    { label: "Altura", value: coche.altura },
    { label: "Maletero", value: coche.maletero },
    { label: "Combustible", value: coche.combustible },
    { label: "Cilindrada", value: coche.cilindrada },
    { label: "Potencia Máxima", value: coche.potenciaMaxima },
    { label: "Par Máximo", value: coche.parMaximo },
    { label: "Tracción", value: coche.traccion },
    { label: "Caja de Cambios", value: coche.cajaDeCambios },
  ];

  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Columna de la Imagen */}
          <div className="lg:col-span-3">
            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={coche.imagen}
                alt={`Imagen de ${coche.marca} ${coche.modelo}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>

          {/* Columna de Información Principal y Compra */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-white">{coche.marca} {coche.modelo}</h1>
            <p className="text-xl text-gray-400 mt-2">{coche.potencia} - {coche.motor}</p>
            <div className="my-6">
              <span className="text-5xl font-bold text-green-500">{coche.precio}</span>
            </div>
            <button
              onClick={() => toggleCarSelection(coche)}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                isSelected 
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/50" 
                  : "bg-green-600 hover:bg-green-700 shadow-green-500/50"
              } shadow-lg`}
            >
              {isSelected ? "Quitar de la Comparación" : "Añadir para Comparar"}
            </button>
             <Link href="/catalogo" className="block text-center mt-4 text-green-400 hover:underline">
              &larr; Volver al catálogo
            </Link>
          </div>
        </div>

        {/* Sección de Ficha Técnica */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold border-b-2 border-green-500 pb-2 mb-6">Ficha Técnica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {details.map(detail => (
              detail.value ? (
                <div key={detail.label} className="bg-gray-700 p-4 rounded-md">
                  <p className="text-sm text-gray-400">{detail.label}</p>
                  <p className="text-lg font-semibold">{detail.value}</p>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}