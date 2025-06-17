// src/app/coches/[id]/page.tsx
import { listaDeCoches } from "@/data/coches";
import Link from "next/link";
import Image from "next/image";

function getCoche(id: string) {
  const coche = listaDeCoches.find((c) => c.id.toString() === id);
  return coche;
}

export default function CocheDetallePage({ params }: { params: { id: string } }) {
  const coche = getCoche(params.id);
  if (!coche) { return <div>Coche no encontrado</div>; }
  const { fichaTecnica } = coche;

  function FichaDato({ label, value }: { label: string; value: string | undefined }) {
    if (!value) return null;
    return (
      <li className="flex justify-between items-center py-2 border-b border-gray-200">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="text-gray-800 text-right">{value}</span>
      </li>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
           <div className="relative w-full h-64 md:h-96 mb-4 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={coche.imagen}
              alt={`Foto de ${coche.marca} ${coche.modelo}`}
              fill
              style={{objectFit: 'cover'}}
              priority
            />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900">{coche.marca} {coche.modelo}</h1>
          <p className="text-2xl text-gray-700 mt-1">{coche.motor}</p>
          <p className="text-4xl font-bold text-blue-600 mt-4">{coche.precio}</p>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4">Prestaciones y Consumos</h2><ul><FichaDato label="Velocidad Máxima" value={fichaTecnica.velocidadMaxima} /><FichaDato label="Aceleración (0-100 km/h)" value={fichaTecnica.aceleracion} /><FichaDato label="Consumo Medio" value={fichaTecnica.consumoMedio} /><FichaDato label="Emisiones de CO₂" value={fichaTecnica.emisionesCO2} /></ul></div>
          <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4">Dimensiones</h2><ul><FichaDato label="Carrocería" value={fichaTecnica.carroceria} /><FichaDato label="Longitud" value={fichaTecnica.longitud} /><FichaDato label="Anchura" value={fichaTecnica.anchura} /><FichaDato label="Altura" value={fichaTecnica.altura} /><FichaDato label="Volumen de Maletero" value={fichaTecnica.maletero} /></ul></div>
          <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4">Mecánica</h2><ul><FichaDato label="Combustible" value={fichaTecnica.combustible} /><FichaDato label="Potencia Máxima" value={fichaTecnica.potenciaMaxima} /><FichaDato label="Par Máximo" value={fichaTecnica.parMaximo} /><FichaDato label="Cilindrada" value={fichaTecnica.cilindrada} /><FichaDato label="Tracción" value={fichaTecnica.traccion} /><FichaDato label="Caja de Cambios" value={fichaTecnica.cajaDeCambios} /></ul></div>
        </div>
        <div className="text-center mt-12"><Link href="/" className="text-blue-600 hover:underline text-lg">&larr; Volver a la lista de coches</Link></div>
      </div>
    </div>
  );
}