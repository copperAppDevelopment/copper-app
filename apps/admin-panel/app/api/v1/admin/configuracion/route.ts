import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { esTipoProntoPago } from '@/lib/conceptos';

/**
 * POST: Guarda la configuración de cobro del conjunto.
 *
 * Va por `upsert` sobre `conjunto_id`, que ahora tiene índice único: antes nada impedía
 * crear una segunda fila, y `generar_cargos_mensuales` hace JOIN contra esta tabla, así que
 * un duplicado habría duplicado todos los cargos del conjunto.
 *
 * Escribe además el NIT, el teléfono y el correo, que viven en `conjuntos` pero se editan
 * aquí: son los datos del emisor que salen impresos en la cuenta de cobro, así que pertenecen
 * a esta pantalla y no a la de crear el conjunto, que es de una sola pasada.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const habilitado = Boolean(body.pronto_pago_habilitado);
  const tipo = String(body.pronto_pago_tipo ?? '');

  const linkPago = String(body.link_pago ?? '').trim();
  if (linkPago && !/^https?:\/\//i.test(linkPago)) {
    return fail('El enlace de pago debe empezar por http:// o https://', 400);
  }

  // Texto libre: hay NIT con dígito de verificación, con guiones y con puntos, y no nos toca
  // a nosotros decidir cómo lo escribe cada administración.
  const nit = String(body.nit ?? '').trim();
  const telefono = String(body.telefono ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();

  if (email && !email.includes('@')) {
    return fail('El correo de contacto no parece válido', 400);
  }

  let valor: number | null = null;
  let porcentaje: number | null = null;
  let dias: number | null = null;

  if (habilitado) {
    if (!esTipoProntoPago(tipo)) {
      return fail('Elige si el pronto pago es por valor o por porcentaje', 400);
    }

    dias = Number(body.pronto_pago_dias ?? 0);
    if (!Number.isInteger(dias) || dias < 1 || dias > 28) {
      return fail('Los días de pronto pago deben estar entre 1 y 28', 400);
    }

    if (tipo === 'valor') {
      valor = Number(body.pronto_pago_valor ?? 0);
      if (!Number.isFinite(valor) || valor <= 0) {
        return fail('El valor del descuento debe ser mayor que cero', 400);
      }
    } else {
      porcentaje = Number(body.pronto_pago_porcentaje ?? 0);
      if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
        return fail('El porcentaje de descuento debe estar entre 1 y 100', 400);
      }
    }
  }

  const { error } = await supabaseAdmin
    .from('conjuntos_configuracion')
    .upsert(
      {
        conjunto_id: conjuntoId,
        link_pago: linkPago || null,
        pronto_pago_habilitado: habilitado,
        // Con el pronto pago apagado se limpian los tres, para que no queden valores
        // huérfanos que confundan al leer la fila.
        pronto_pago_tipo: habilitado ? tipo : null,
        pronto_pago_valor: valor,
        pronto_pago_porcentaje: porcentaje,
        pronto_pago_dias: dias,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: 'conjunto_id' }
    );

  if (error) {
    console.error('Error al guardar la configuración:', error);
    return fail('No se pudo guardar la configuración', 500);
  }

  const { error: errorEmisor } = await supabaseAdmin
    .from('conjuntos')
    .update({ nit: nit || null, telefono: telefono || null, email: email || null } as any)
    .eq('id', conjuntoId);

  if (errorEmisor) {
    console.error('Error al guardar los datos del emisor:', errorEmisor);
    return fail('Se guardó el cobro, pero no los datos de la cuenta de cobro', 500);
  }

  return ok({ conjunto_id: conjuntoId });
});
