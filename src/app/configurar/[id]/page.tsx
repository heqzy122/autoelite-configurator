// src/app/configurar/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import ConfiguradorUI from "@/components/ConfiguradorUI";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const modeloId = Number(params.id);

  if (isNaN(modeloId)) {
    return (
      <main className="p-4 text-red-500 text-center">
        <h1 className="text-xl font-bold">ID inválido</h1>
        <p>La URL no contiene un ID de modelo válido.</p>
      </main>
    );
  }

  const { data: modelo, error: modeloError } = await supabase
    .from("modelos")
    .select("*")
    .eq("id", modeloId)
    .single();

  const { data: motorizaciones, error: motorError } = await supabase
    .from("motorizaciones")
    .select("*")
    .eq("modelo_id", modeloId);

  const { data: colores, error: colorError } = await supabase
    .from("colores")
    .select("*");

  if (modeloError || !modelo) {
    return (
      <main className="p-4 text-red-500 text-center">
        <h1 className="text-xl font-bold">Modelo no encontrado</h1>
        <p>Verifica que el modelo exista o regresa al catálogo.</p>
      </main>
    );
  }

  if (motorError || !motorizaciones || motorizaciones.length === 0) {
    return (
      <main className="p-4 text-red-500 text-center">
        <h1 className="text-xl font-bold">Sin motorizaciones disponibles</h1>
        <p>No hay motores configurados para este modelo.</p>
      </main>
    );
  }

  return (
    <ConfiguradorUI
      modelo={modelo}
      motorizaciones={motorizaciones}
      colores={colores || []}
    />
  );
}
