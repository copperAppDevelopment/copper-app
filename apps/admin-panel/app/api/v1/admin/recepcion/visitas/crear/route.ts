import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: registra una visita.
 *
 * La RPC `crear_visita` inserta la visita **y** la fila de `notifications`, y un trigger
 * sobre esa tabla dispara la notificación push. Es decir: el aviso al residente lo hace la
 * base, no esta ruta.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, body }) => {
    const apartamentoId = String(body.apartamento_id ?? '').trim();
    const nombres = String(body.nombres ?? '').trim();

    if (!apartamentoId) return fail('Hay que elegir el apartamento', 400);
    if (!nombres) return fail('El nombre del visitante es obligatorio', 400);

    // El conjunto lo manda el cliente, así que el apartamento hay que atarlo a él.
    const { data: apartamento } = await supabaseAdmin
      .from('apartamentos')
      .select('id, conjunto_id')
      .eq('id', apartamentoId)
      .maybeSingle();

    if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
      return fail('El apartamento no pertenece a este conjunto', 404);
    }

    const { data, error } = await supabaseAdmin.rpc('crear_visita', {
      p_apartamento_id: apartamentoId,
      p_nombres: nombres,
      p_telefono: String(body.telefono ?? '').trim() || null,
      p_motivo: String(body.motivo ?? '').trim() || null,
      p_observaciones: String(body.observaciones ?? '').trim() || null,
      p_enviado_por: user.id,
    } as any);

    if (error) {
      console.error('Error al registrar la visita:', error);
      return fail(error.message, 400);
    }

    return ok({ visita_id: data }, 201);
  },
  { roles: ['Admin', 'Recepcion'] }
);
