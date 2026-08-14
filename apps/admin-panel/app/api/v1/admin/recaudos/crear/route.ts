import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, okCon, fail } from '@/lib/apiHandler';

/** `recaudos.archivo_url` es NOT NULL y un alta manual no tiene archivo. */
const ARCHIVO_MANUAL = 'manual';

/**
 * POST: Alta individual de un recaudo, y su aplicación inmediata.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const {
    apartamento_id,
    fecha,
    fecha_aplicacion,
    valor_total,
    origen,
    tipo_recaudo_origen,
    periodo,
    referencia_1,
    aplicar = true,
  } = body;

  if (!apartamento_id || !fecha || !periodo) {
    return fail('Apartamento, fecha y periodo son obligatorios', 400);
  }

  const valor = Number(valor_total);
  if (!Number.isFinite(valor) || valor <= 0) {
    return fail('El valor total debe ser un número mayor que cero', 400);
  }

  const { data: apartamento } = await supabaseAdmin
    .from('apartamentos')
    .select('id, conjunto_id')
    .eq('id', apartamento_id)
    .maybeSingle();

  if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
    return fail('El apartamento no pertenece a este conjunto', 400);
  }

  const { data: nuevo, error } = await supabaseAdmin
    .from('recaudos')
    .insert({
      conjunto_id: conjuntoId,
      apartamento_id,
      fecha,
      // La columna es NOT NULL; si no se indica, se asume el mismo día del pago.
      fecha_aplicacion: fecha_aplicacion || fecha,
      valor_total: valor,
      // Patrón de los 211 registros existentes: el total va en efectivo y el cheque en 0.
      valor_efectivo: valor,
      valor_cheque: 0,
      origen: origen || null,
      tipo_recaudo_origen: tipo_recaudo_origen || null,
      referencia_1: referencia_1 || null,
      periodo,
      archivo_url: ARCHIVO_MANUAL,
    })
    .select()
    .single();

  if (error) {
    // Choque contra `unique_recaudo_por_apto`.
    if (error.code === '23505') {
      return fail('Ya existe un recaudo idéntico para este apartamento y fecha.', 409);
    }
    console.error('Error al crear el recaudo:', error);
    return fail('Error interno al crear el recaudo', 500);
  }

  let mensajeAplicacion: string | null = null;

  if (aplicar) {
    const { error: errorAplicar } = await supabaseAdmin.rpc('aplicar_recaudo', {
      p_recaudo_id: nuevo.id,
    });

    if (errorAplicar) {
      // El recaudo ya está creado: se informa sin deshacerlo, y queda disponible la
      // acción "Aplicar" de la tabla.
      console.error('Recaudo creado pero no aplicado:', errorAplicar);
      mensajeAplicacion = 'El recaudo se creó, pero no se pudo aplicar. Puedes aplicarlo desde la tabla.';
    }
  }

  return okCon({ data: nuevo, message: mensajeAplicacion }, 201);
});
