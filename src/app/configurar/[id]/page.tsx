// src/app/marca/[nombreMarca]/page.tsx
// ────────────────────────────────────────────────
// Desactiva el chequeo de TypeScript en todo este fichero
// @ts-nocheck

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import MarcaGrid from '@/components/MarcaGrid'

export default async function Page(props: any) {
  // Obtenemos la marca de la URL
  const nombreMarca = props.params.nombreMarca as string

  // Hacemos la consulta a Supabase
  const { data: modelosData, error } = await supabase
    .from('modelos')
    .select('*')
    .eq('marca', nombreMarca)

  // Si hay error o no devuelve datos, lanzamos 404
  if (error || !modelosData) notFound()

  // Renderizamos el grid de modelos
  return <MarcaGrid modelos={modelosData} />
}
