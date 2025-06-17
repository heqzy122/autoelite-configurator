// src/app/coches/[id]/page.tsx

import { listaDeCoches } from "@/data/coches";
import CocheDetailView from "@/components/CocheDetailView"; // 1. Importamos el nuevo componente

type Props = {
  params: { id: string };
};

// Esta página ahora es un Componente de Servidor simple
export default function CocheDetallePage({ params }: Props) {
  // 2. Busca el coche
  const coche = listaDeCoches.find((c) => c.id.toString() === params.id);

  // 3. Si no lo encuentra, muestra un mensaje
  if (!coche) {
    return <div>Coche no encontrado</div>;
  }

  // 4. Se lo pasa al nuevo componente para que lo muestre
  return <CocheDetailView coche={coche} />;
}