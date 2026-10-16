import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { clasificarLineas, paraCliente } from '@/lib/invitacionesMasivas';
import { crearInvitaciones, reprogramarInvitaciones, enviarInvitaciones } from '@/lib/invitacionesServidor';

/**
 * POST: invitación masiva. `{ conjunto_id, texto, modo }`
 *
 * - `previsualizar`: clasifica cada línea y no escribe nada.
 * - `enviar`: vuelve a clasificar —no se fía de la vista previa que tenga el navegador—, crea
 *   las invitaciones nuevas, reprograma las pendientes y envía todos los correos.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const modo = body.modo === 'enviar' ? 'enviar' : 'previsualizar';
  const lineas = await clasificarLineas(body.texto, conjuntoId);

  if (modo === 'previsualizar') {
    return ok({ lineas: paraCliente(lineas) });
  }

  const nuevas = lineas.filter(l => l.accion === 'invitar');
  const pendientes = lineas.filter(l => l.accion === 'reenviar').map(l => l.invitacionId!);

  if (nuevas.length === 0 && pendientes.length === 0) {
    return fail('Ninguna línea de la lista genera un envío', 400);
  }

  const creadas = await crearInvitaciones(
    nuevas.map(l => ({
      conjuntoId,
      rol: 'Residente',
      email: l.email,
      apartamentoId: l.apartamentoId,
    }))
  );
  const reprogramadas = await reprogramarInvitaciones(pendientes, conjuntoId);

  const resultado = await enviarInvitaciones([...creadas, ...reprogramadas]);

  return ok({ lineas: paraCliente(lineas), ...resultado });
});
