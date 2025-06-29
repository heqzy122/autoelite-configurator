import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

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
};

// Para SSG (build-time generation)
export async function generateStaticParams() {
  const { data, error } = await supabase.from("modelos").select("marca");
  if (error || !data) return [];
  const marcas = Array.from(new Set(data.map((item: any) => item.marca)));
  return marcas.map((marca) => ({ nombreMarca: marca }));
}

// Esta es la firma que Next.js espera:
export default async function Page({
  params,
}: {
  params: { nombreMarca: string };
}) {
  const nombre = decodeURIComponent(params.nombreMarca);
  const logoPath = logoMap[nombre];

  const { data: modelos, error } = await supabase
    .from("modelos")
    .select("*")
    .eq("marca", nombre)
    .order("nombre_modelo", { ascending: true });

  if (error || !modelos || modelos.length === 0) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-900 text-gray-100">
      {/* Encabezado de marca */}
      <div className="text-center mb-12">
        <div className="relative h-20 w-48 mx-auto">
          {logoPath && (
            <Image
              src={logoPath}
              alt={`Logo de ${nombre}`}
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <p className="text-lg text-gray-400 mt-4">
          Modelos disponibles para configurar
        </p>
      </div>

      {/* Grid con fade-in */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {modelos.map((mod: any, i: number) => (
          <Link
            key={mod.id}
            href={`/configurar/${mod.id}`}
            className={`
              group border border-gray-700 rounded-lg shadow-md
              bg-gray-800 overflow-hidden flex flex-col
              hover:border-green-500 transition-all duration-300
              fade-in-up
            `}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative w-full h-48">
              <Image
                src={mod.imagen_preview}
                alt={`${mod.marca} ${mod.nombre_modelo}`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-2xl font-semibold text-gray-100">
                {mod.nombre_modelo}
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
        ))}
      </div>

      {/* Botón volver */}
      <div className="text-center mt-12">
        <Link href="/catalogo" className="text-green-500 hover:underline text-lg">
          &larr; Volver al catálogo completo
        </Link>
      </div>
    </main>
  );
}
