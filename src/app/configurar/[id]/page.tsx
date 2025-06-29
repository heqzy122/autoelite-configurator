// src/app/configurar/[id]/page.tsx

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ConfiguradorUI from '@/components/ConfiguradorUI'

export default async function Page(props: any) {
  // Obtenemos el id de la URL y forzamos 404 si no es numérico
  const modeloId = parseInt(props.params.id, 10)
  if (isNaN(modeloId)) notFound()

  // Cargamos el modelo
  const { data: modeloData } = await supabase
    .from('modelos')
    .select('*')
    .eq('id', modeloId)
    .single()
  if (!modeloData) notFound()

  // Cargamos las motorizaciones
  const { data: motorizacionesData } = await supabase
    .from('motorizaciones')
    .select('*')
    .eq('modelo_id', modeloId)
    .order('sobrecoste_precio')

  // Cargamos los colores relacionados
  const { data: coloresRaw } = await supabase
    .from('modelos_colores')
    .select('colores(*)')
    .eq('modelo_id', modeloId)

  // Convertimos todo a any para que TS no dé errores
  const modelo: any = modeloData
  const motorizaciones: any[] = motorizacionesData ?? []
  const colores: any[] = (coloresRaw ?? []).flatMap((r: any) => r.colores ?? [])

  // Renderizamos
  return (
    <ConfiguradorUI
      modelo={modelo}
      motorizaciones={motorizaciones}
      colores={colores}
    />
  )
}
