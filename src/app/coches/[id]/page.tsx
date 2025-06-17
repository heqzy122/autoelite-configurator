// src/app/coches/[id]/page.tsx

import { listaDeCoches } from "@/data/coches";
import CocheDetailView from "@/components/CocheDetailView";

export async function generateStaticParams() {
  return listaDeCoches.map((coche) => ({
    id: coche.id.toString(),
  }));
}

// --- TIPO DE PROPS CORREGIDO ---
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
// ------------------------------

export default function CocheDetallePage({ params }: Props) {
  const coche = listaDeCoches.find((c) => c.id.toString() === params.id);

  if (!coche) {
    return <div>Coche no encontrado</div>;
  }

  return <CocheDetailView coche={coche} />;
}