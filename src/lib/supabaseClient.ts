// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Leemos las variables de entorno que guardamos en .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
console.log("CONECTANDO A URL:", supabaseUrl);
console.log("USANDO CLAVE QUE EMPIEZA POR:", supabaseAnonKey.substring(0, 10));
// Creamos y exportamos el cliente de Supabase para poder usarlo en toda la web
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' }
})  