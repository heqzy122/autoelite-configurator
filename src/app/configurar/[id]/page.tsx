// src/app/configurar/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { notFound } from 'next/navigation';
import ConfiguradorUI from "@/components/ConfiguradorUI";
import { Modelo, Motorizacion, Color } from "@/types";

// ¡NUEVA FUNCIÓN! Le dice a Next.js qué páginas debe construir
export async function generateStaticParams() {
  const { data: modelos, error } = await supabase.from('modelos').select('id');

  // Si hay un error o no hay modelos, no construye ninguna página
  if (error || !modelos) {
    return [];
  }

  // Devuelve una lista de todos los IDs posibles para la URL
  return modelos.map((modelo) => ({
    id: modelo.id.toString(),
  }));
}

type Props = {
  params: { id: string };
};

export default async function ConfigurarPage({ params }: Props) {
  const modeloId = parseInt(params.id);

  const { data: modelo, error: modeloError } = await supabase
    .from('modelos')
    .select('*')
    .eq('id', modeloId)
    .single();

  if (modeloError || !modelo) {
    notFound();
  }

  const { data: motorizaciones, error: motorizacionesError } = await supabase
    .from('motorizaciones')
    .select('*')
    .eq('modelo_id', modeloId)
    .order('sobrecoste_precio', { ascending: true });

  const { data: coloresData, error: coloresError } = await supabase
    .from('modelos_colores')
    .select(`colores (id, nombre_color, codigo_hex, sobrecoste_color)`)
    .eq('modelo_id', modeloId);
    
  const coloresDisponibles: Color[] = coloresData 
    ? coloresData.map((item: any) => item.colores).filter(Boolean) as Color[]
    : [];

  if (motorizacionesError || coloresError || !motorizaciones) {
    return <div>Error al cargar las opciones de configuración.</div>;
  }

  return (
    <ConfiguradorUI 
      modelo={modelo} 
      motorizaciones={motorizaciones}
      colores={coloresDisponibles}
    />
  );
}