import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

/**
 * PATCH: el residente aprueba o rechaza una visita a su apartamento.
 *
 * El sobre `{ success, message }` es distinto del `{ data }` del resto del panel porque lo
 * consume la app móvil ya publicada; no se puede cambiar hasta que salga una build nueva.
 */
export const PATCH = withResidente(async ({ user }, req) => {
  const body = await req.json();
  const { visitaId, estado } = body;

  if (!visitaId || !estado) {
    return NextResponse.json({ error: 'Faltan parámetros requeridos (visitaId o estado)' }, { status: 400 });
  }

  if (estado !== 'aprobado' && estado !== 'rechazado') {
    return NextResponse.json({ error: 'Estado de visita inválido (debe ser aprobado o rechazado)' }, { status: 400 });
  }

  const { data: visita } = await supabaseAdmin
    .from('visitas')
    .select('id, apartamento_id')
    .eq('id', visitaId)
    .maybeSingle();

  if (!visita) {
    return NextResponse.json({ error: 'La visita no existe' }, { status: 404 });
  }

  // Faltaba: sin esto, cualquier residente autenticado aprobaba la visita de otro
  // apartamento con solo conocer su id. Se comprueba el apartamento y no solo la persona,
  // porque un residente puede tener varias residencias.
  const { data: residencia } = await supabaseAdmin
    .from('residentes')
    .select('id')
    .eq('user_id', user.id)
    .eq('apartamento_id', visita.apartamento_id)
    .eq('activo', true)
    .maybeSingle();

  if (!residencia) {
    return NextResponse.json({ error: 'Esta visita no es de tu apartamento' }, { status: 403 });
  }

  // Condicionado a que siga pendiente: el residente y la portería pueden responder a la
  // vez, y sin esto gana el último y `autorizado_por` queda sobrescrito.
  const { data: actualizada, error } = await supabaseAdmin
    .from('visitas')
    .update({
      estado_autorizacion: estado,
      autorizado_por: user.id,
      fecha_autorizacion: new Date().toISOString(),
    })
    .eq('id', visitaId)
    .eq('estado_autorizacion', 'pendiente')
    .select('id');

  if (error) {
    console.error('Error al actualizar estado de visita:', error);
    return NextResponse.json({ error: 'Error interno del servidor al actualizar la visita' }, { status: 500 });
  }

  if (!actualizada || actualizada.length === 0) {
    return NextResponse.json({ error: 'Esta visita ya fue gestionada' }, { status: 409 });
  }

  return NextResponse.json({ success: true, message: `Visita ${estado} con éxito.` });
});
