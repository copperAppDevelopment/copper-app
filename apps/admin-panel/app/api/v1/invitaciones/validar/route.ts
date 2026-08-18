import { NextResponse } from 'next/server';
import { validarToken, MOTIVOS } from '@/lib/invitaciones';

/**
 * GET: Datos de una invitación a partir de su token. Ruta **pública**: la abre alguien que
 * todavía no tiene cuenta.
 *
 * Solo devuelve lo necesario para pintar la pantalla (conjunto, rol y los datos que la
 * invitación ya traía); nada del resto del conjunto.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';

  if (!token) {
    return NextResponse.json({ error: 'Falta el token' }, { status: 400 });
  }

  const resultado = await validarToken(token);

  if (!resultado.ok) {
    return NextResponse.json({ error: MOTIVOS[resultado.motivo] }, { status: 404 });
  }

  const { id, conjunto_id, ...visible } = resultado.invitacion;
  return NextResponse.json({ data: visible });
}
