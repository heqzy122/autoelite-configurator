// src/app/garaje/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";
import AddToCompareButton from "@/components/AddToCompareButton";
import DeleteGarageButton from "@/components/DeleteGarageButton";

export default async function GarajePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: cochesGuardados, error } = await supabase
    .from("garaje")
    .select(`id, modelos (*), motorizaciones (*), colores (*)`)
    .eq("user_id", userId)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-center text-red-500 p-8">Error al cargar tu garaje.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <h1 className="text-5xl font-bold">Mi Garaje</h1>
            <p className="text-gray-400 mt-2 sm:mt-0">Aquí están tus configuraciones guardadas.</p>
        </div>

        {!cochesGuardados || cochesGuardados.length === 0 ? (
          <div className="text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-lg p-12">
            <p className="text-lg font-semibold">Tu garaje está vacío</p>
            <p className="mt-2">Añade coches desde el configurador para verlos aquí.</p>
            <Link href="/catalogo" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cochesGuardados.map((item) => {
              const modelo = Array.isArray(item.modelos) ? item.modelos[0] : item.modelos;
              const motor = Array.isArray(item.motorizaciones) ? item.motorizaciones[0] : item.motorizaciones;
              const color = Array.isArray(item.colores) ? item.colores[0] : item.colores;

              if (!modelo || !motor || !color) return null;

              const precioFinal = (modelo.precio_base || 0) + (motor.sobrecoste_precio || 0) + (color.sobrecoste_color || 0);
              
              // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
              // Creamos el objeto 'Car' completo con TODAS sus propiedades
              const configuredCar: Car = {
                id: modelo.id * 1000 + motor.id,
                marca: modelo.marca,
                modelo: `${modelo.nombre_modelo} (${motor.nombre_motor})`,
                imagen: modelo.imagen_preview,
                precio: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioFinal),
                potencia: motor.potencia,
                motor: motor.motor,
                velocidadMaxima: motor.velocidadMaxima,
                aceleracion: motor.aceleracion,
                consumoMedio: motor.consumoMedio,
                emisionesCO2: motor.emisionesCO2,
                carroceria: motor.carroceria,
                longitud: motor.longitud,
                anchura: motor.anchura,
                altura: motor.altura,
                maletero: motor.maletero,
                combustible: motor.combustible,
                cilindrada: motor.cilindrada,
                potenciaMaxima: motor.potenciaMaxima,
                parMaximo: motor.parMaximo,
                traccion: motor.traccion,
                cajaDeCambios: motor.cajaDeCambios,
              };

              return (
                <div key={item.id} className="border border-gray-700 rounded-lg shadow-lg bg-gray-800 overflow-hidden flex flex-col group">
                  <div className="relative w-full h-48">
                    <Image src={modelo.imagen_preview} alt={`Foto de ${modelo.marca} ${modelo.nombre_modelo}`} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-300" unoptimized/>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-white">{modelo.marca} {modelo.nombre_modelo}</h2>
                    <p className="text-gray-300">{motor.nombre_motor}</p>
                    <div className="mt-4 text-sm space-y-1">
                        <p><span className="font-semibold text-gray-400">Potencia: </span>{motor.potencia}</p>
                        <p><span className="font-semibold text-gray-400">Color: </span>{color.nombre_color}</p>
                    </div>
                    <div className="flex-grow mt-4">
                      <p className="text-2xl font-bold text-green-500">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(precioFinal)}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                       <Link href={`/configurar/${modelo.id}`} className="flex-1 flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-xs font-semibold">
                        Editar
                       </Link>
                       <AddToCompareButton car={configuredCar} />
                       <DeleteGarageButton garageItemId={item.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}