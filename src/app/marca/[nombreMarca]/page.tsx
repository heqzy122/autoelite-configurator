// src/app/marca/[nombreMarca]/page.tsx
import { listaDeCoches } from "@/data/coches";
import Link from "next/link";
import MarcaGrid from "@/components/MarcaGrid";

export default function MarcaPage({ params }: { params: { nombreMarca: string } }) {
  const marca = decodeURIComponent(params.nombreMarca);
  const cochesDeLaMarca = listaDeCoches.filter(coche => coche.marca === marca);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">{marca}</h1>
        <p className="text-lg text-gray-600 mt-2">
          Modelos disponibles de la marca
        </p>
      </div>
      <MarcaGrid cars={cochesDeLaMarca} />
      <div className="text-center mt-12">
        <Link href="/" className="text-blue-600 hover:underline text-lg">
            &larr; Volver a la lista completa
        </Link>
      </div>
    </main>
  );
}