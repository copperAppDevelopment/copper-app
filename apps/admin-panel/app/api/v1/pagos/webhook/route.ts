import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { secretoEventos, firmaEventoValida } from '@/lib/wompi';
import type { EventoWompi } from '@/lib/wompi';
import { normalizarPeriodo, sumarPeriodo, ESTADOS_PAGO_FINALES } from '@/lib/conjuntos';
import type { EstadoPago } from '@/lib/conjuntos';

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

    const ahora = new Date();
    let suscripcionId: string | null = null;

    if (datos.es_renovacion && pago.suscripcion_id) {
      const { data: actual } = await supabaseAdmin
        .from('suscripciones')
        .select('id, fecha_fin')
        .eq('id', pago.suscripcion_id)
        .maybeSingle();

      if (actual) {
        // Si todavía le quedaba vigencia, el periodo nuevo se encadena a la fecha de fin
        // en vez de empezar hoy: renovar antes de tiempo no debe regalar días a la casa.
        const base = new Date(actual.fecha_fin) > ahora ? new Date(actual.fecha_fin) : ahora;

        const { error } = await supabaseAdmin
          .from('suscripciones')
          .update({
            fecha_fin: sumarPeriodo(base, periodo).toISOString(),
            // Minúscula: el enum `estado_suscripcion` rechaza el 'Activa' que escribía
            // la edge function.
            estado: 'activa',
            plan_id: planId,
            tipo_periodo: periodo,
            precio_pagado: pago.monto,
            metodo_pago: 'wompi',
            referencia_pago: referencia,
          } as any)
          .eq('id', actual.id);

        if (error) {
          console.error('Error al renovar la suscripción:', error);
          return new Response('Error', { status: 500 });
        }

        suscripcionId = actual.id;
      }
    }

    if (!suscripcionId) {
      const { data: nueva, error } = await supabaseAdmin
        .from('suscripciones')
        .insert({
          admin_user_id: adminUserId,
          plan_id: planId,
          conjunto_id: conjuntoId,
          tipo_periodo: periodo,
          fecha_inicio: ahora.toISOString(),
          fecha_fin: sumarPeriodo(ahora, periodo).toISOString(),
          estado: 'activa',
          precio_pagado: pago.monto,
          metodo_pago: 'wompi',
          referencia_pago: referencia,
        } as any)
        .select('id')
        .single();

      if (error || !nueva) {
        console.error('Error al crear la suscripción:', error);
        // 500 a propósito: aquí sí conviene que Wompi reintente, porque el cobro se hizo
        // y el conjunto se quedaría sin suscripción.
        return new Response('Error', { status: 500 });
      }

      suscripcionId = nueva.id;
    }

    // `activo` es la única fuente de verdad del conjunto. La edge function escribía
    // `estado = true` sobre una columna de texto y dejaba la cadena 'true'.
    await supabaseAdmin.from('conjuntos').update({ activo: true }).eq('id', conjuntoId);
    await supabaseAdmin.from('users').update({ estado: true } as any).eq('id', adminUserId);

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
