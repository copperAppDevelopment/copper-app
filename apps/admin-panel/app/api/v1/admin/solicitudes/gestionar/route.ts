import type { Database } from '@copper/database';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail, ErrorHttp } from '@/lib/apiHandler';
import { esEstado, esPrioridad } from '@/lib/solicitudes';

type CambiosSolicitud = Database['public']['Tables']['solicitudes']['Update'];

/** Lee la solicitud o corta. Se usa desde el resolver y desde el handler. */
async function buscarSolicitud(solicitudId: unknown) {
  if (!solicitudId) {
    throw new ErrorHttp('Falta el solicitud_id', 400);
  }

  const { data: solicitud } = await supabaseAdmin
    .from('solicitudes')
    .select('id, conjunto_id')
    .eq('id', solicitudId as string)
    .maybeSingle();

  if (!solicitud) {
    throw new ErrorHttp('No se encontró la solicitud', 404);
  }

  return solicitud;
}

/**
 * POST: Gestión de una solicitud (PQR).
 *
 * Aplica solo los campos que vengan en el cuerpo, así el modal puede mandar cambios
 * parciales sin borrar lo que no tocó.
 */
export const POST = withAdminConjunto(
  async ({ conjuntoId, body }) => {
    const {
      solicitud_id,
      solicitud_estado,
      solicitud_prioridad,
      asignado_admin_conjunto_id,
      admin_comentario,
      fecha_atencion_viable,
      fecha_atencion_solicitud,
      hora_atencion,
      costo,
    } = body;

    const cambios: CambiosSolicitud = {};

    if (solicitud_estado !== undefined) {
      if (!esEstado(String(solicitud_estado))) {
        return fail('El estado no es válido', 400);
      }
      cambios.solicitud_estado = solicitud_estado;
    }

    if (solicitud_prioridad !== undefined) {
      if (solicitud_prioridad !== null && !esPrioridad(String(solicitud_prioridad))) {
        return fail('La prioridad no es válida', 400);
      }
      cambios.solicitud_prioridad = solicitud_prioridad || null;
    }

    if (asignado_admin_conjunto_id !== undefined) {
      if (asignado_admin_conjunto_id) {
        // Sin esto se podría asignar la solicitud a un admin de otro conjunto.
        const { data: admin } = await supabaseAdmin
          .from('admins_conjuntos')
          .select('id, conjunto_id, activo')
          .eq('id', asignado_admin_conjunto_id)
          .maybeSingle();

        if (!admin || admin.conjunto_id !== conjuntoId || !admin.activo) {
          return fail('El administrador no pertenece a este conjunto', 400);
        }
      }
      cambios.asignado_admin_conjunto_id = asignado_admin_conjunto_id || null;
    }

    if (admin_comentario !== undefined) {
      cambios.admin_comentario = String(admin_comentario ?? '').trim() || null;
    }

    if (fecha_atencion_viable !== undefined) {
      cambios.fecha_atencion_viable =
        fecha_atencion_viable === null ? null : Boolean(fecha_atencion_viable);
    }

    if (fecha_atencion_solicitud !== undefined) {
      cambios.fecha_atencion_solicitud = fecha_atencion_solicitud || null;
    }

    if (hora_atencion !== undefined) {
      cambios.hora_atencion = hora_atencion || null;
    }

    // El comentario viaja en el mismo update que el estado a propósito: el trigger de
    // notificación lee `admin_comentario` de la fila nueva para incluirlo en el aviso.
    if (Object.keys(cambios).length > 0) {
      cambios.updated_at = new Date().toISOString();

      const { error } = await supabaseAdmin
        .from('solicitudes')
        .update(cambios)
        .eq('id', solicitud_id);

      if (error) {
        console.error('Error al actualizar la solicitud:', error);
        return fail('Error interno al actualizar la solicitud', 500);
      }
    }

    let cobro: { cargo_id: string; creado: boolean } | null = null;

    const valor = Number(costo ?? 0);
    if (Number.isFinite(valor) && valor > 0) {
      const { data, error } = await supabaseAdmin.rpc('crear_cobro_solicitud', {
        p_solicitud_id: solicitud_id,
        p_valor: valor,
      });

      if (error) {
        // La gestión ya se guardó: se informa del fallo del cobro sin deshacerla.
        console.error('Solicitud actualizada pero cobro no generado:', error);
        return fail(
          `Se guardaron los cambios, pero no se pudo generar el cobro: ${error.message}`,
          500
        );
      }

      cobro = (Array.isArray(data) ? data[0] : data) ?? null;
    }

    const { data: solicitud } = await supabaseAdmin
      .from('vista_gestion_solicitudes_detalle')
      .select('*')
      .eq('id_solicitud', solicitud_id)
      .maybeSingle();

    return ok({ solicitud, cobro });
  },
  {
    // El conjunto sale de la fila, no de lo que mande el cliente.
    resolverConjunto: async (body) => (await buscarSolicitud(body?.solicitud_id)).conjunto_id,
  }
);
