// src/app/comparar/page.tsx
"use client";

import { useCompareStore } from "@/store/compareStore";
import Link from "next/link";
import Image from "next/image";
import { Car } from "@/data/coches";
import { useState, useEffect } from 'react';

const parseValue = (value: string): number => {
    const cleanedString = value.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedString);
};

export default function CompararPage() {
    const { selectedCars } = useCompareStore();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    if (!isClient) { return <div className="text-center p-10"><h1 className="text-4xl font-bold mb-4">Cargando comparativa...</h1></div>; }
    if (selectedCars.length === 0) { return <div className="text-center p-10"><h1 className="text-4xl font-bold mb-4">No hay coches para comparar</h1><p className="text-lg mb-8">Añade coches desde la página principal para verlos aquí.</p><Link href="/" className="text-blue-500 hover:underline">&larr; Volver al inicio</Link></div>; }

    const specsToShow = [
        { key: 'precio', label: 'Precio', comparisonType: 'lower' },
        { key: 'potenciaMaxima', label: 'Potencia Máxima', comparisonType: 'higher' },
        { key: 'aceleracion', label: 'Aceleración (0-100km/h)', comparisonType: 'lower' },
        { key: 'velocidadMaxima', label: 'Velocidad Máxima', comparisonType: 'higher' },
        { key: 'consumoMedio', label: 'Consumo Medio', comparisonType: 'lower' },
        { key: 'maletero', label: 'Maletero', comparisonType: 'higher' },
        { key: 'emisionesCO2', label: 'Emisiones de CO₂', comparisonType: 'lower' },
        { key: 'combustible', label: 'Combustible' },
        { key: 'traccion', label: 'Tracción' },
        { key: 'cajaDeCambios', label: 'Caja de Cambios' },
        { key: 'longitud', label: 'Longitud' },
        { key: 'anchura', label: 'Anchura' },
        { key: 'altura', label: 'Altura' },
    ];

    const bestValues = new Map<string, number>();
    specsToShow.forEach(spec => {
        if (spec.comparisonType) {
            const values = selectedCars.map(c => parseValue(spec.key === 'precio' ? c.precio : c.fichaTecnica[spec.key as keyof typeof c.fichaTecnica])).filter(v => !isNaN(v));
            if (values.length > 0) {
                const bestValue = spec.comparisonType === 'lower' ? Math.min(...values) : Math.max(...values);
                bestValues.set(spec.key, bestValue);
            }
        }
    });

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `minmax(150px, 1.5fr) repeat(${selectedCars.length}, minmax(120px, 1fr))`,
        gap: '1.5rem',
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Comparativa de Vehículos</h1>
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                <div className="inline-block min-w-full">
                    <div style={gridStyle} className="mb-6">
                        <div className="col-span-1"></div>
                        {selectedCars.map(coche => (
                            <div key={coche.id} className="text-center">
                                <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden">
                                    <Image
                                        src={coche.imagen}
                                        alt={`Foto de ${coche.marca} ${coche.modelo}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">{coche.marca}</h2>
                                <h3 className="text-md text-gray-600">{coche.modelo}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="divide-y divide-gray-200">
                        {specsToShow.map(spec => {
                            const bestValueForSpec = bestValues.get(spec.key);
                            return (
                                <div key={spec.key} style={gridStyle} className="py-4 items-center">
                                    <div className="col-span-1 flex items-center"><strong className="text-sm text-gray-600">{spec.label}</strong></div>
                                    {selectedCars.map(coche => {
                                        let rawValue: string;
                                        if (spec.key === 'precio') {
                                            rawValue = coche.precio;
                                        } else {
                                            const fichaKey = spec.key as keyof typeof coche.fichaTecnica;
                                            rawValue = coche.fichaTecnica[fichaKey];
                                        }
                                        const numericValue = parseValue(rawValue);
                                        const isBest = bestValueForSpec !== undefined && numericValue === bestValueForSpec;
                                        return (
                                            <div key={coche.id} className="col-span-1 text-center flex items-center justify-center">
                                                <span className={`text-md ${isBest ? 'text-green-600 font-bold' : 'text-gray-800'}`}>{rawValue}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="text-center mt-12"><Link href="/" className="text-blue-600 hover:underline text-lg">&larr; Volver y cambiar selección</Link></div>
        </div>
    );
}