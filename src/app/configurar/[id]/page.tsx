// src/app/configurar/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { notFound } from 'next/navigation';
import ConfiguradorUI from "@/components/ConfiguradorUI";
import { Modelo, Motorizacion, Color } from "@/types";

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

  // Pedimos solo los datos de color, SIN la ruta de la imagen
  const { data: coloresData, error: coloresError } = await supabase
    .from('modelos_colores')
    .select(`
      colores (
        id,
        nombre_color,
        codigo_hex,
        sobrecoste_color
      )
    `)
    .eq('modelo_id', modeloId);
    
  const coloresDisponibles = coloresData ? coloresData.map((item: any) => item.colores).filter(Boolean) : [];

  if (motorizacionesError || coloresError || !motorizaciones) {
    return <div>Error al cargar las opciones de configuración.</div>;
  }

  return (
    <ConfiguradorUI 
      modelo={modelo as Modelo} 
      motorizaciones={motorizaciones as Motorizacion[]}
      colores={coloresDisponibles as Color[]}
    />
  );
}