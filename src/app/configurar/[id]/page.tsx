// src/app/configurar/[id]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { notFound } from 'next/navigation';
import ConfiguradorUI from "@/components/ConfiguradorUI";
import { Modelo, Motorizacion, Color } from "@/types";

// ✅ Tipado explícito y correcto para los props de la página
interface PageProps {
  params: { id: string };
}

// Componente "trabajador" que carga los datos de forma asíncrona
async function ConfiguratorLoader({ modeloId }: { modeloId: number }) {
  
  const [modeloRes, motorizacionesRes, coloresRes] = await Promise.all([
    supabase.from('modelos').select('*').eq('id', modeloId).single(),
    supabase.from('motorizaciones').select('*').eq('modelo_id', modeloId).order('sobrecoste_precio'),
    supabase.from('modelos_colores').select('colores(*)').eq('modelo_id', modeloId)
  ]);

  const { data: modelo, error: modeloError } = modeloRes;
  const { data: motorizaciones, error: motorizacionesError } = motorizacionesRes;
  const { data: coloresData, error: coloresError } = coloresRes;

  if (modeloError || !modelo) {
    notFound();
  }

  const coloresDisponibles: Color[] = coloresData 
    ? coloresData.map((item: any) => item.colores).filter(Boolean) as Color[]
    : [];

  if (motorizacionesError || coloresError || !motorizaciones) {
    return <div className="text-center text-red-500 p-8">Error al cargar las opciones de configuración.</div>;
  }

  // Pasamos los datos al componente de la interfaz
  return (
    <ConfiguradorUI 
      modelo={modelo} 
      motorizaciones={motorizaciones}
      colores={coloresDisponibles}
    />
  );
}

// ✅ Página principal que recibe los props con el tipado correcto
export default function ConfigurarPage({ params }: PageProps) {
  const modeloId = parseInt(params.id, 10); // Usamos base 10 para más seguridad

  return <ConfiguratorLoader modeloId={modeloId} />;
}