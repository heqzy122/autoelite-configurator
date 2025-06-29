// src/types/index.ts

// El tipo para un coche ya configurado (para el comparador)
export interface Car {
  id: number;
  created_at?: string;
  marca: string;
  modelo: string;
  potencia: string | null;
  motor: string | null;
  precio: string | null;
  imagen: string;
  velocidadMaxima: string | null;
  aceleracion: string | null;
  consumoMedio: string | null;
  emisionesCO2: string | null;
  carroceria: string | null;
  longitud: string | null;
  anchura: string | null;
  altura: string | null;
  maletero: string | null;
  combustible: string | null;
  cilindrada: string | null;
  potenciaMaxima: string | null;
  parMaximo: string | null;
  traccion: string | null;
  cajaDeCambios: string | null;
}

// TIPOS PARA EL CONFIGURADOR
export interface Modelo {
  id: number;
  marca: string;
  nombre_modelo: string;
  imagen_base: string;
  precio_base: number;
  imagen_preview: string;
}

export interface Motorizacion {
  id: number;
  nombre_motor: string;
  sobrecoste_precio: number;
  [key: string]: any; 
}

export interface Color {
  id: number; 
  nombre_color: string; 
  codigo_hex: string; 
  sobrecoste_color: number;
  // La propiedad 'ruta_imagen' se ha quitado por ahora
}