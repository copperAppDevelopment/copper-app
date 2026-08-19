import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { secretoEventos, firmaEventoValida } from '@/lib/wompi';
import type { EventoWompi } from '@/lib/wompi';
import { normalizarPeriodo, ESTADOS_PAGO_FINALES } from '@/lib/conjuntos';
import type { EstadoPago } from '@/lib/conjuntos';
import { asignarSuscripcion } from '@/lib/suscripcionesServidor';

/**
 * POST: recibe los eventos de transacción de Wompi. Reemplaza a la edge function
 * `wompi-webhook`.
 *
 * Es la única ruta pública del panel que escribe: no hay sesión que validar porque quien
 * llama es la pasarela. La autenticidad la da exclusivamente la firma del evento, así que
 * nada se toca antes de comprobarla.
 *
 * Se responde 200 a todo evento auténtico —incluido el que no reconocemos—, porque un
 * error haría a Wompi reintentar en bucle un caso que no va a cambiar.
 */
export async function POST(req: Request) {
  try {
    const evento = (await req.json().catch(() => null)) as EventoWompi | null;

    // Sin secreto configurado, `firmaEventoValida` devuelve false y aquí no entra nada:
    // un despliegue a medio configurar rechaza en vez de aceptar a ciegas.
    if (!evento || !firmaEventoValida(evento, secretoEventos())) {
      console.error('Webhook de Wompi con firma inválida');
      return new Response('Invalid signature', { status: 401 });
    }

    const transaccion = evento.data?.transaction;
    const referencia = transaccion?.reference;
    if (!referencia) {
      return new Response('OK', { status: 200 });
    }

    const { data: pago } = await supabaseAdmin
      .from('pagos')
      .select('id, monto, suscripcion_id, estado, datos_pago')
      .eq('referencia_externa', referencia)
      .maybeSingle();

    if (!pago) {
      console.error('Webhook de Wompi para una referencia desconocida:', referencia);
      return new Response('OK', { status: 200 });
    }

    // Idempotencia: Wompi reenvía el mismo evento si duda de la respuesta. Un pago ya
    // resuelto no vuelve a crear ni a extender nada.
    if (ESTADOS_PAGO_FINALES.includes(pago.estado as EstadoPago)) {
      return new Response('OK', { status: 200 });
    }

    const estado: string = transaccion?.status ?? '';

    if (estado === 'EXPIRED' || estado === 'VOIDED' || estado === 'DECLINED') {
      await supabaseAdmin
        .from('pagos')
        .update({ estado: estado === 'EXPIRED' ? 'expirado' : 'rechazado' } as any)
        .eq('id', pago.id);

      return new Response('OK', { status: 200 });
    }

    if (estado !== 'APPROVED') {
      // PENDING y demás estados intermedios: se deja el pago como está.
      return new Response('OK', { status: 200 });
    }

    const datos = (pago.datos_pago ?? {}) as Record<string, any>;
    const periodo = normalizarPeriodo(datos.tipo_periodo);
    const conjuntoId: string = datos.conjunto_id;
    const adminUserId: string = datos.admin_user_id;
    const planId: string = datos.plan_id;

    if (!periodo || !conjuntoId || !adminUserId || !planId) {
      console.error('Pago aprobado con datos_pago incompletos:', pago.id);
      return new Response('OK', { status: 200 });
    }

    let suscripcionId: string;

    try {
      // Antes esto insertaba a ciegas salvo que el pago viniera marcado como renovación, y un
      // conjunto acabó con tres suscripciones activas a la vez. `asignarSuscripcion` actualiza
      // siempre la vigente si la hay —y desde que existe el índice único parcial, insertar una
      // segunda activa sería un error de base de datos—.
      //
      // `vencimiento` reproduce lo que hacía la rama de renovación: si aún quedaba vigencia, el
      // periodo nuevo se encadena en vez de empezar hoy.
      const resultado = await asignarSuscripcion({
        conjuntoId,
        adminUserId,
        planId,
        periodo,
        precio: pago.monto,
        metodoPago: 'wompi',
        referencia,
        desde: 'vencimiento',
      });

      suscripcionId = resultado.suscripcionId;
    } catch (error) {
      console.error('Error al registrar la suscripción del pago:', error);
      // 500 a propósito: aquí sí conviene que Wompi reintente, porque el cobro se hizo y el
      // conjunto se quedaría sin suscripción.
      return new Response('Error', { status: 500 });
    }

    await supabaseAdmin
      .from('pagos')
      .update({
        estado: 'aprobado',
        metodo_pago: transaccion?.payment_method_type ?? 'wompi',
        suscripcion_id: suscripcionId,
      } as any)
      .eq('id', pago.id);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error en el webhook de Wompi:', error);
    return new Response('Error', { status: 500 });
  }
}
