"use server";

import { supabase } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface SaveData {
  modelo_id: number;
  motorizacion_id: number;
  color_id: number;
}

export async function saveConfiguration(data: SaveData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Usuario no autenticado." };
  }

  const { error } = await supabase.from("garaje").insert({
    user_id: userId,
    modelo_id: data.modelo_id,
    motorizacion_id: data.motorizacion_id,
    color_id: data.color_id,
  });

  if (error) {
    console.error("Error al guardar en el garaje:", error);
    if (error.code === '23505') { 
        return { success: false, error: "Esta configuración ya está en tu garaje." };
    }
    return { success: false, error: "No se pudo guardar la configuración." };
  }

  revalidatePath("/garaje"); 

  return { success: true, message: "¡Coche guardado en tu garaje!" };
}

export async function deleteConfiguration(garageItemId: number) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Usuario no autenticado." };
  }

  const { error } = await supabase
    .from("garaje")
    .delete()
    .eq("id", garageItemId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error al borrar del garaje:", error);
    return { success: false, error: "No se pudo borrar la configuración." };
  }

  revalidatePath("/garaje");

  return { success: true, message: "Configuración eliminada." };
}