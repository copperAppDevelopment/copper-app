import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail, esUuid } from '@/lib/apiHandler';
import { BUCKET_COMUNICADOS, comunicadoDelConjunto } from '@/lib/comunicadosServidor';

/**
 * POST: elimina un comunicado.
 *
 * Su notificación se borra en cascada (`notifications.comunicado_id`), así que desaparece de la
 * app de los residentes. La notificación push que ya recibieron no se puede retirar.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const comunicadoId = String(body.comunicado_id ?? '').trim();
  if (!esUuid(comunicadoId)) return fail('Falta el comunicado', 400);

  const comunicado = await comunicadoDelConjunto(comunicadoId, conjuntoId);
  if (!comunicado) return fail('No se encontró el comunicado', 404);

  const { error } = await supabaseAdmin
    .from('comunicados')
    .delete()
    .eq('id', comunicadoId)
    .eq('conjunto_id', conjuntoId);

  if (error) {
    console.error('Error al eliminar el comunicado:', error);
    return fail('No se pudo eliminar el comunicado', 500);
  }

  // Después de la fila y no antes: si esto falla queda un archivo huérfano, que no ve nadie; al
  // revés quedaría un comunicado con un adjunto roto.
  if (comunicado.adjunto) {
    const { error: errorArchivo } = await supabaseAdmin.storage
      .from(BUCKET_COMUNICADOS)
      .remove([comunicado.adjunto]);
    if (errorArchivo) console.error('No se pudo borrar el adjunto del comunicado:', errorArchivo);
  }

  return ok({ eliminado: comunicadoId });
});
