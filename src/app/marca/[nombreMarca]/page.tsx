// src/app/marca/[nombreMarca]/page.tsx
// @ts-nocheck

import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { containerFade, itemFade } from "@/lib/animations"

const logoMap: { [key: string]: string } = {
  Audi: "/logos/audi.svg",
  BMW: "/logos/bmw.svg",
  Cupra: "/logos/cupra.png",
  Hyundai: "/logos/hyundai.png",
  Jaguar: "/logos/jaguar.png",
  Maserati: "/logos/maserati.png",
  Mercedes: "/logos/mercedes.png",
  Mini: "/logos/mini.png",
  Porsche: "/logos/porsche.png",
  Renault: "/logos/renault.png",
  Tesla: "/logos/tesla.png",
  Toyota: "/logos/toyota.png",
  Volkswagen: "/logos/vw.png",
}

export async function generateStaticParams() {
  const { data, error } = await supabase.from("modelos").select("marca")
  if (error || !data) return []
  const marcas = Array.from(new Set(data.map((item: any) => item.marca)))
  return marcas.map((marca) => ({ nombreMarca: marca }))
}

export default async function MarcaPage(props: any) {
  const nombreMarca = decodeURIComponent(props.params.nombreMarca as string)
  const logoPath = logoMap[nombreMarca]

  const { data: modelos, error } = await supabase
    .from("modelos")
    .select("*")
    .eq("marca", nombreMarca)
    .order("nombre_modelo", { ascending: true })

  if (error || !modelos || modelos.length === 0) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-gray-100">
      <div className="text-center mb-12">
        <div className="relative h-20 w-48 mx-auto">
          {logoPath && (
            <Image
              src={logoPath}
              alt={`Logo de ${nombreMarca}`}
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <p className="text-lg text-gray-400 mt-4">
          Modelos disponibles para configurar
        </p>
      </div>

      {/* Grid con efecto fade-in */}
      <motion.div
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial="hidden"
        animate="show"
        variants={containerFade}
      >
        {modelos.map((modelo: any) => (
          <motion.div key={modelo.id} variants={itemFade}>
            <Link
              href={`/configurar/${modelo.id}`}
              className="group border border-gray-700 rounded-lg shadow-md bg-gray-800 overflow-hidden flex flex-col hover:border-green-500 transition-all duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={modelo.imagen_preview}
                  alt={`Foto de ${modelo.marca} ${modelo.nombre_modelo}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold text-gray-100">
                  {modelo.nombre_modelo}
                </h2>
                <div className="flex-grow mt-2">
                  <p className="text-gray-400">Desde</p>
                  <p className="text-2xl font-bold text-green-500">
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                    }).format(modelo.precio_base)}
                  </p>
                </div>
                <div className="mt-4 bg-green-600 text-white text-center py-2 rounded-lg group-hover:bg-green-700 transition-colors">
                  Configurar
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center mt-12">
        <Link href="/catalogo" className="text-green-500 hover:underline text-lg">
          &larr; Volver al catálogo completo
        </Link>
      </div>
    </main>
  )
}
