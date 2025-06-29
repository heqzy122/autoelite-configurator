// src/components/ConfiguradorUI.tsx

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCompareStore } from '@/store/compareStore';
import { Car, Modelo, Motorizacion, Color } from '@/types';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { saveConfiguration } from '@/app/_actions/garageActions';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';

interface Props {
  modelo: Modelo;
  motorizaciones: Motorizacion[];
  colores: Color[];
}

export default function ConfiguradorUI({ modelo, motorizaciones, colores }: Props) {
  const [selectedEngine, setSelectedEngine] = useState<Motorizacion>(motorizaciones[0]);
  const [selectedColor, setSelectedColor] = useState<Color>(colores[0] || null);
  const { toggleCarSelection, selectedCars } = useCompareStore();
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [dontAskSave, setDontAskSave] = useState(false);

  const finalPrice = (modelo.precio_base || 0) + (selectedEngine?.sobrecoste_precio || 0) + (selectedColor?.sobrecoste_color || 0);

  const configuredCar: Car | null = selectedColor && selectedEngine ? {
    id: modelo.id * 1000 + selectedEngine.id,
    marca: modelo.marca,
    modelo: `${modelo.nombre_modelo} (${selectedEngine.nombre_motor})`,
    imagen: modelo.imagen_preview,
    precio: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(finalPrice),
    potencia: selectedEngine.potencia,
    motor: selectedEngine.motor,
    velocidadMaxima: selectedEngine.velocidadMaxima,
    aceleracion: selectedEngine.aceleracion,
    consumoMedio: selectedEngine.consumoMedio,
    emisionesCO2: selectedEngine.emisionesCO2,
    carroceria: selectedEngine.carroceria,
    longitud: selectedEngine.longitud,
    anchura: selectedEngine.anchura,
    altura: selectedEngine.altura,
    maletero: selectedEngine.maletero,
    combustible: selectedEngine.combustible,
    cilindrada: selectedEngine.cilindrada,
    potenciaMaxima: selectedEngine.potenciaMaxima,
    parMaximo: selectedEngine.parMaximo,
    traccion: selectedEngine.traccion,
    cajaDeCambios: selectedEngine.cajaDeCambios,
  } : null;
  
  const isSelectedForCompare = configuredCar ? selectedCars.some(c => c.id === configuredCar.id) : false;

  const handleToggleCompare = () => { if (configuredCar) { toggleCarSelection(configuredCar); } };

  const performSave = async () => {
    if (!selectedColor || !selectedEngine) return;
    const toastId = toast.loading('Guardando en tu garaje...');
    const result = await saveConfiguration({
      modelo_id: modelo.id,
      motorizacion_id: selectedEngine.id,
      color_id: selectedColor.id,
    });
    if (result.success) {
      toast.success(result.message || '¡Guardado con éxito!', { id: toastId });
    } else {
      toast.error(result.error || 'No se pudo guardar.', { id: toastId });
    }
  };

  const handleSaveClick = () => {
    const preference = localStorage.getItem('dontAskSaveConfirmation');
    if (preference === 'true') {
      performSave();
    } else {
      setIsSaveModalOpen(true);
    }
  };

  const handleConfirmSave = () => {
    if (dontAskSave) {
      localStorage.setItem('dontAskSaveConfirmation', 'true');
    }
    performSave();
  };

  return (
    <>
      <main className="bg-gray-900 text-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            <div className="lg:sticky top-8 self-start">
              <h1 className="text-4xl font-extrabold text-white mb-2">{modelo.marca} {modelo.nombre_modelo}</h1>
              <p className="text-xl text-green-400 font-semibold">{selectedEngine?.nombre_motor}</p>
              
              <div className="relative w-full h-52 lg:h-80 rounded-lg overflow-hidden shadow-2xl mt-4">
                <Image src={modelo.imagen_base} alt={`Imagen de ${modelo.marca} ${modelo.nombre_modelo}`} fill style={{ objectFit: 'cover' }} priority />
                <div 
                  className="absolute inset-0 transition-colors duration-300" 
                  style={{ backgroundColor: selectedColor?.codigo_hex, mixBlendMode: 'color' }}
                ></div>
              </div>

              <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-2xl text-gray-300">Precio Total:</span>
                  <span className="text-4xl font-bold text-green-500">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(finalPrice)}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={handleToggleCompare} className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${ isSelectedForCompare ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700" }`}>
                      {isSelectedForCompare ? 'Quitar del Comparador' : 'Añadir para Comparar'}
                  </button>
                  <SignedIn>
                      <button onClick={handleSaveClick} className="w-full py-3 rounded-lg font-semibold text-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                          Guardar en mi Garaje
                      </button>
                  </SignedIn>
                  <SignedOut>
                      <div className="p-3 bg-gray-800 rounded-lg text-center flex items-center justify-center">
                          <p className="text-sm text-gray-400">
                             <SignInButton mode="modal">
                               <a className="text-blue-400 font-semibold hover:underline cursor-pointer">Inicia sesión</a>
                             </SignInButton> para guardar.
                          </p>
                      </div>
                  </SignedOut>
              </div>
              <Link href="/catalogo" className="block text-center mt-4 text-green-400 hover:underline">&larr; Volver al catálogo</Link>
            </div>

            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold border-b-2 border-gray-700 pb-2 mb-4">Motor</h2>
                <div className="flex flex-col gap-3">
                  {motorizaciones?.map(engine => (
                    <button key={engine.id} onClick={() => setSelectedEngine(engine)} className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${selectedEngine?.id === engine.id ? 'bg-green-800/50 border-green-500' : 'bg-gray-800 border-transparent hover:border-gray-600'}`}>
                      <p className="font-bold text-lg">{engine.nombre_motor}</p>
                      <p className="text-sm text-gray-300">{engine.potencia}</p>
                      <p className="font-semibold text-md mt-2">{engine.sobrecoste_precio > 0 ? `+ ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(engine.sobrecoste_precio)}` : 'Motor base'}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold border-b-2 border-gray-700 pb-2 mb-4">Pintura</h2>
                <div className="flex flex-wrap gap-4">
                  {colores?.map(color => (
                    <button key={color.id} onClick={() => setSelectedColor(color)} className={`w-28 text-center transition-all ${selectedColor?.id === color.id ? 'font-bold' : ''}`}>
                      <div className="w-16 h-16 rounded-full mx-auto border-4 transition-all" style={{ backgroundColor: color.codigo_hex, borderColor: selectedColor?.id === color.id ? '#10B981' : 'transparent' }}></div>
                      <p className="text-xs mt-2">{color.nombre_color}</p>
                      <p className="text-xs font-semibold">{color.sobrecoste_color > 0 ? `+ ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(color.sobrecoste_color)}` : 'Incluido'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        onDontAskAgainChange={setDontAskSave}
        title="Guardar Configuración"
        message="¿Quieres añadir esta configuración a tu garaje personal?"
        confirmButtonText="Sí, Guardar"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700"
      />
    </>
  );
}