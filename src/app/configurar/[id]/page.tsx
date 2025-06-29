// src/app/configurar/[id]/page.tsx
// ────────────────────────────────────
// Desactiva el chequeo de TypeScript en este fichero
// @ts-nocheck

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ConfiguradorUI from '@/components/ConfiguradorUI'

export default async function Page(props: any) {
  const modeloId = parseInt(props.params.id, 10)
  if (isNaN(modeloId)) notFound()

  const { data: modeloData } = await supabase
    .from('modelos')
    .select('*')
    .eq('id', modeloId)
    .single()
  if (!modeloData) notFound()

  const { data: motorizacionesData } = await supabase
    .from('motorizaciones')
    .select('*')
    .eq('modelo_id', modeloId)
    .order('sobrecoste_precio')

  const { data: coloresRaw } = await supabase
    .from('modelos_colores')
    .select('colores(*)')
    .eq('modelo_id', modeloId)

  const modelo: any = modeloData
  const motorizaciones: any[] = motorizacionesData ?? []
  const colores: any[] = (coloresRaw ?? []).flatMap((r: any) => r.colores ?? [])

  return (
    <ConfiguradorUI
      modelo={modelo}
      motorizaciones={motorizaciones}
      colores={colores}
    />
  )
}
