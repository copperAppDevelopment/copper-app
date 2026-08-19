import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { RESPUESTAS_VISITA, ETIQUETA_ESTADO_VISITA } from '@/lib/recepcion';
import type { EstadoVisita } from '@/lib/recepcion';

/**
 * POST: la portería aprueba o rechaza una visita en nombre del residente.
 *
 * El `conjunto_id` sale de la propia visita y no del cuerpo: si lo eligiera el cliente,
 * bastaría con mandar el conjunto propio y el id de una visita ajena para colarse.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, rol, body }) => {
    const visitaId = String(body.visita_id ?? '');
    const estado = String(body.estado ?? '') as EstadoVisita;

    if (!RESPUESTAS_VISITA.includes(estado)) {
      return fail('El estado debe ser aprobado o rechazado', 400);
    }

    const { data: visita } = await supabaseAdmin
      .from('visitas')
      .select('id, nombres, apartamento_id')
      .eq('id', visitaId)
      .maybeSingle();

    if (!visita) return fail('La visita no existe', 404);

    // Condicionado a que siga pendiente: el residente puede estar respondiendo desde el
    // móvil a la vez, y sin esto gana el último y `autorizado_por` queda sobrescrito.
    const { data: actualizada, error } = await supabaseAdmin
      .from('visitas')
      .update({
        estado_autorizacion: estado,
        autorizado_por: user.id,
        fecha_autorizacion: new Date().toISOString(),
      } as any)
      .eq('id', visitaId)
      .eq('estado_autorizacion', 'pendiente')
      .select('id');

    if (error) {
      console.error('Error al responder la visita:', error);
      return fail('No se pudo actualizar la visita', 500);
    }

    if (!actualizada || actualizada.length === 0) {
      return fail('Esta visita ya fue gestionada', 409);
    }

    // Al residente hay que avisarle de que se decidió sin él. El insert en
    // `notifications` es lo que dispara el push, vía el trigger de esa tabla.
    const { data: residentes } = await supabaseAdmin
      .from('residentes')
      .select('user_id, users!inner(estado)')
      .eq('apartamento_id', visita.apartamento_id)
      .eq('activo', true);

    const destinos = (residentes ?? [])
      .filter((r: any) => (Array.isArray(r.users) ? r.users[0]?.estado : r.users?.estado) !== false)
      .map((r: any) => String(r.user_id));

    if (destinos.length > 0) {
      await supabaseAdmin.from('notifications').insert({
        title: `Visita ${ETIQUETA_ESTADO_VISITA[estado].toLowerCase()} en portería`,
        content: `${visita.nombres} fue ${ETIQUETA_ESTADO_VISITA[estado].toLowerCase()} por ${rol === 'Recepcion' ? 'la portería' : 'la administración'}.`,
        userIds: destinos,
        conjunto_id: conjuntoId,
        tipo_notificacion: 'visita_pendiente',
        enviado_por: user.id,
        visita_id: visitaId,
      } as any);
    }

    return ok({ visita_id: visitaId, estado });
  },
  {
    roles: ['Admin', 'Recepcion'],
    resolverConjunto: async (body) => {
      const { data } = await supabaseAdmin
        .from('vista_visitas_recepcion')
        .select('conjunto_id')
        .eq('id', String(body?.visita_id ?? ''))
        .maybeSingle();

      return data?.conjunto_id ?? null;
    },
  }
);
