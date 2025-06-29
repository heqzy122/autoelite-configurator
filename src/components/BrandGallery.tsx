// src/components/BrandGallery.tsx

"use client";
import Image from "next/image";
import Link from "next/link";
// Ya no necesitamos importar 'Car' aquí

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

// CAMBIO IMPORTANTE: Ahora 'allCars' es una lista de objetos que solo necesitan tener 'marca'.
export default function BrandGallery({ allCars }: { allCars: { marca: string }[] }) {
  
  // Si no hay coches cargados, no mostramos nada.
  if (!allCars || allCars.length === 0) {
    return null; 
  }

  const marcas = [...new Set(allCars.map(coche => coche.marca))].sort();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold leading-8 text-gray-900">
          Trabajamos con las mejores marcas
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {marcas.map((marca) => (
            <Link 
              key={marca}
              href={`/marca/${marca}`}
              className="col-span-1 flex justify-center items-center py-4 px-8 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition duration-300"
            >
              <Image
                src={logoMap[marca]} 
                alt={`Logo de ${marca}`}
                width={158}
                height={48}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}