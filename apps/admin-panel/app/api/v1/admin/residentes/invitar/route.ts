import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, okCon, fail } from '@/lib/apiHandler';
import { crearInvitacion, enviarInvitaciones } from '@/lib/invitacionesServidor';

/**
 * POST: Invitar a un residente.
 *
 * Dos caminos según si el correo ya tiene cuenta:
 *
 *  - Email desconocido  → invitación normal (fila con token + correo, `lib/invitacionesServidor`).
 *  - Email ya registrado → no se invita. Se devuelve el usuario para que la UI ofrezca
 *    vincularlo directamente al conjunto (`/vincular`), sin depender del flujo de
 *    aceptación que vive fuera de este repositorio.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { email, telefono, apartamento_id } = body;

  const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!correo) {
    return fail('El correo es obligatorio', 400);
  }

  // ¿El correo ya tiene cuenta? `users.email` no es único, así que puede haber varias filas.
  const { data: existentes, error: errorExistente } = await supabaseAdmin
    .from('users')
    .select('id, nombres, apellidos, email, rol')
    .ilike('email', correo);

  if (errorExistente) {
    console.error('Error al buscar el usuario por correo:', errorExistente);
    return fail('Error interno al validar el correo', 500);
  }

  const existente = existentes?.[0];

  if (existente) {
    // ¿Ya es residente de este conjunto?
    const { data: residente } = await supabaseAdmin
      .from('residentes')
      .select('id, activo, apartamento_id')
      .eq('user_id', existente.id)
      .eq('conjunto_id', conjuntoId)
      .maybeSingle();

    return ok({
      yaRegistrado: true,
      usuario: existente,
      residenteExistente: residente ?? null,
    });
  }

  // Correo desconocido: se crea la invitación y se envía el correo con su enlace.
  const invitacionId = await crearInvitacion({
    conjuntoId,
    rol: 'Residente',
    email: correo,
    telefono: telefono || null,
    apartamentoId: apartamento_id || null,
  });

  const { fallidas } = await enviarInvitaciones([invitacionId]);
  if (fallidas.length > 0) {
    return fail(
      'La invitación quedó creada, pero el correo no salió. Puedes reenviarla desde Invitaciones.',
      502
    );
  }

  return okCon({ data: { yaRegistrado: false }, message: 'Invitación enviada correctamente' }, 201);
});
