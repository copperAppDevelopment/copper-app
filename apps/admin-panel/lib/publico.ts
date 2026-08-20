import { NextResponse } from 'next/server';

/**
 * Piezas de las rutas públicas: CORS, límite por IP y trampa para bots.
 *
 * Estaban copiadas en `contact` y en `auth/register`, y el registro de administradores sería la
 * tercera copia. Las rutas públicas son las únicas del panel sin sesión que las proteja, así que
 * conviene que estas tres defensas vivan en un solo sitio.
 */

export const corsHeaders = {
  // En producción se puede restringir al dominio de la landing.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const responderCors = () => NextResponse.json({}, { headers: corsHeaders });

export const okPublico = (payload: Record<string, unknown>, status = 200) =>
  NextResponse.json(payload, { status, headers: corsHeaders });

export const falloPublico = (error: string, status: number) =>
  NextResponse.json({ error }, { status, headers: corsHeaders });

/**
 * Límite por IP, en memoria del proceso.
 *
 * No sobrevive a un despliegue ni se comparte entre instancias: frena el abuso torpe, no a
 * alguien decidido. Para eso haría falta almacenarlo fuera.
 */
const marcas = new Map<string, number[]>();

export interface OpcionesLimite {
  max?: number;
  ventanaMs?: number;
}

/** `true` si la petición se pasa del límite y hay que rechazarla. */
export function superaLimite(
  req: Request,
  { max = 3, ventanaMs = 5 * 60 * 1000 }: OpcionesLimite = {}
): boolean {
  const reenviada = req.headers.get('x-forwarded-for');
  const ip = (reenviada ? reenviada.split(',')[0]?.trim() : 'desconocida') || 'desconocida';
  const ahora = Date.now();

  const vigentes = (marcas.get(ip) ?? []).filter(t => ahora - t < ventanaMs);

  if (vigentes.length >= max) {
    console.warn(`Límite de peticiones excedido para la IP: ${ip}`);
    marcas.set(ip, vigentes);
    return true;
  }

  vigentes.push(ahora);
  marcas.set(ip, vigentes);
  return false;
}

/**
 * La trampa: un campo que el formulario mantiene oculto y que una persona nunca rellena.
 * Se responde 200 fingiendo éxito para no enseñarle al bot que lo detectamos.
 */
export const esBot = (body: any) => Boolean(body?.website);
