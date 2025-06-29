// src/app/comparar/page.tsx

"use client";
import { useCompareStore } from "@/store/compareStore";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";

const parseStat = (value: string | null): number | null => {
  if (!value) return null;
  const match = String(value).match(/[\d,.]+/);
  if (!match) return null;
  const numericString = match[0].replace(/\./g, '').replace(',', '.');
  return parseFloat(numericString);
};

const statRules: { [key in keyof Car]?: { lowerIsBetter: boolean } } = {
  potencia: { lowerIsBetter: false },
  velocidadMaxima: { lowerIsBetter: false },
  parMaximo: { lowerIsBetter: false },
  maletero: { lowerIsBetter: false },
  aceleracion: { lowerIsBetter: true },
  consumoMedio: { lowerIsBetter: true },
  emisionesCO2: { lowerIsBetter: true },
};

export default function CompararPage() {
  const { selectedCars, clearSelection } = useCompareStore();

  if (selectedCars.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">No hay coches para comparar</h1>
        <p className="text-gray-400 mb-8">Añade hasta 4 coches desde el catálogo para ver sus características aquí.</p>
        <Link href="/catalogo" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Ir al Catálogo
        </Link>
      </main>
    );
  }

  const characteristics: (keyof Car)[] = [
    'potencia', 'motor', 'velocidadMaxima', 'aceleracion', 'consumoMedio', 'emisionesCO2', 'carroceria', 'combustible', 'cilindrada', 'potenciaMaxima', 'parMaximo', 'traccion', 'cajaDeCambios', 'longitud', 'anchura', 'altura', 'maletero'
  ];

  const formatLabel = (label: string): string => {
    return label.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Comparador</h1>
          <button
            onClick={clearSelection}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Limpiar Selección
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800">
              <tr>
                {/* CAMBIOS DE ESTILO AQUÍ: Padding y tamaño de texto responsivos */}
                <th className="p-2 md:p-4 text-sm md:text-base border-b-2 border-gray-700 font-semibold sticky left-0 bg-gray-800 z-10">Característica</th>
                {selectedCars.map((car) => (
                  // CAMBIOS DE ESTILO AQUÍ: Ancho mínimo responsivo
                  <th key={car.id} className="p-2 md:p-4 border-b-2 border-gray-700 min-w-[180px] md:min-w-[220px] text-center">
                    <div className="relative w-full h-20 md:h-24 mx-auto mb-2">
                      <Image src={car.imagen} alt={`${car.marca} ${car.modelo}`} fill style={{objectFit:"contain"}} unoptimized />
                    </div>
                    <p className="font-bold text-base md:text-lg text-white">{car.marca}</p>
                    <p className="font-semibold text-sm md:text-base text-gray-300">{car.modelo}</p>
                    <p className="text-green-500 font-bold mt-1 text-base md:text-lg">{car.precio}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {characteristics.map((key) => {
                const rule = statRules[key];
                let bestValue: number | null = null;

                if (rule && selectedCars.length > 1) {
                  const values = selectedCars.map(car => parseStat(car[key] as string | null)).filter((v): v is number => v !== null);
                  if (values.length > 0) {
                    bestValue = rule.lowerIsBetter ? Math.min(...values) : Math.max(...values);
                  }
                }

                return (
                  <tr key={key} className="odd:bg-gray-800/50">
                    {/* CAMBIOS DE ESTILO AQUÍ: Padding y tamaño de texto responsivos */}
                    <td className="p-2 md:p-4 text-sm md:text-base font-semibold sticky left-0 bg-gray-900 odd:bg-gray-800/50 z-10">{formatLabel(key)}</td>
                    {selectedCars.map((car) => {
                      const rawValue = car[key] as string | null;
                      const currentValue = parseStat(rawValue);
                      const isBest = rule && currentValue !== null && currentValue === bestValue;

                      return (
                        // CAMBIOS DE ESTILO AQUÍ: Padding y tamaño de texto responsivos
                        <td key={car.id} className={`p-2 md:p-4 text-xs md:text-sm text-center transition-colors ${isBest ? 'text-green-400 font-extrabold' : 'text-gray-300'}`}>
                          {rawValue || 'N/D'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
         <div className="text-center mt-12">
            <Link href="/catalogo" className="text-green-500 hover:underline text-lg">
                &larr; Volver al catálogo
            </Link>
        </div>
      </div>
    </main>
  );
}