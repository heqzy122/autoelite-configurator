// src/app/configurar/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { notFound } from 'next/navigation';
import ConfiguradorUI from "@/components/ConfiguradorUI";
import { Modelo, Motorizacion, Color } from "@/types";

export async function generateStaticParams() {
  const { data: modelos } = await supabase.from('modelos').select('id');
  if (!modelos) return [];
  return modelos.map((modelo) => ({ id: modelo.id.toString() }));
}

type Props = {
  params: { id: string };
};

export default async function ConfigurarPage({ params }: Props) {
  const modeloId = parseInt(params.id);

  const { data: modelo } = await supabase.from('modelos').select('*').eq('id', modeloId).single();
  if (!modelo) notFound();

  const { data: motorizaciones } = await supabase.from('motorizaciones').select('*').eq('modelo_id', modeloId).order('sobrecoste_precio');
  
  const { data: coloresData } = await supabase
    .from('modelos_colores')
    .select(`colores (id, nombre_color, codigo_hex, sobrecoste_color)`) // <-- Petición simple
    .eq('modelo_id', modeloId);
    
  const coloresDisponibles = coloresData ? coloresData.map((item: any) => item.colores).filter(Boolean) : [];

  if (!motorizaciones || !coloresDisponibles) {
    return <div>Error al cargar las opciones.</div>;
  }

  return (
    <ConfiguradorUI 
      modelo={modelo} 
      motorizaciones={motorizaciones}
      colores={coloresDisponibles as Color[]}
    />
  );
}