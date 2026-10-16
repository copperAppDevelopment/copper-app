import { withAdminConjunto, ok, fail, esUuid } from '@/lib/apiHandler';
import { reprogramarInvitaciones, enviarInvitaciones } from '@/lib/invitacionesServidor';

/**
 * POST: reenvía una invitación. Conserva el token —el enlace del correo anterior sigue
 * sirviendo—, la extiende siete días desde hoy y suma un envío.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const invitacionId = String(body.invitacion_id ?? '').trim();
  if (!esUuid(invitacionId)) return fail('Falta la invitación', 400);

  const reprogramadas = await reprogramarInvitaciones([invitacionId], conjuntoId);
  if (reprogramadas.length === 0) {
    return fail('La invitación no existe en este conjunto o ya fue aceptada', 409);
  }

  const { fallidas } = await enviarInvitaciones(reprogramadas);
  if (fallidas.length > 0) {
    return fail(`No se pudo enviar el correo: ${fallidas[0]!.error}`, 502);
  }

  return ok({ reenviada: invitacionId });
});
