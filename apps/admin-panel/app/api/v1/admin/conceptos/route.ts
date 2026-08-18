import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { esTipoCalculo, esProtegido } from '@/lib/conceptos';

/** Lee el concepto y comprueba que sea de este conjunto. */
async function buscarConcepto(conceptoId: string, conjuntoId: string) {
  const { data } = await supabaseAdmin
    .from('conceptos_cobro')
    .select('id, conjunto_id, codigo')
    .eq('id', conceptoId)
    .maybeSingle();

  if (!data || data.conjunto_id !== conjuntoId) return null;
  return data;
}

/**
 * POST: Crea o actualiza un concepto de cobro, o solo cambia su estado.
 *
 * `ADMIN` y `MORA` los protege además el trigger `trg_proteger_conceptos` en la base: aquí
 * se validan para dar un mensaje claro en vez de un error de Postgres.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { concepto_id, solo_activo, activo } = body;

  // Alternar el estado desde la tabla, sin abrir el formulario.
  if (solo_activo) {
    if (!concepto_id) return fail('Falta el concepto_id', 400);

    const concepto = await buscarConcepto(concepto_id, conjuntoId);
    if (!concepto) return fail('Ese concepto no pertenece a este conjunto', 404);

    if (esProtegido(concepto.codigo)) {
      return fail(`El concepto ${concepto.codigo} es estructural y no se puede desactivar.`, 409);
    }

    const { error } = await supabaseAdmin
      .from('conceptos_cobro')
      .update({ activo: Boolean(activo) })
      .eq('id', concepto_id);

    if (error) {
      console.error('Error al cambiar el estado del concepto:', error);
      return fail('No se pudo cambiar el estado', 500);
    }

    return ok({ concepto_id, activo: Boolean(activo) });
  }

  const codigo = String(body.codigo ?? '').trim().toUpperCase();
  const nombre = String(body.nombre ?? '').trim();
  const tipoCalculo = String(body.tipo_calculo ?? '');

  if (!codigo || !nombre) {
    return fail('El código y el nombre son obligatorios', 400);
  }

  if (!esTipoCalculo(tipoCalculo)) {
    return fail('El tipo de cálculo no es válido', 400);
  }

  const valor = Number(body.valor ?? 0);
  if (!Number.isFinite(valor) || valor < 0) {
    return fail('El valor debe ser un número mayor o igual que cero', 400);
  }

  // En la UI el porcentaje se escribe como 2 (%) y en la base se guarda como 0.02, que es
  // como lo multiplica `generar_cargos_mensuales`.
  const porcentajeUi = Number(body.porcentaje ?? 0);
  if (tipoCalculo === 'porcentaje_saldo' && (!Number.isFinite(porcentajeUi) || porcentajeUi <= 0)) {
    return fail('Indica un porcentaje mayor que cero', 400);
  }

  const fila = {
    nombre,
    descripcion: String(body.descripcion ?? '').trim() || null,
    valor: tipoCalculo === 'fijo' ? valor : 0,
    tipo_calculo: tipoCalculo,
    porcentaje: tipoCalculo === 'porcentaje_saldo' ? porcentajeUi / 100 : null,
    aplica_descuento: Boolean(body.aplica_descuento),
    es_recurrente: Boolean(body.es_recurrente),
  };

  if (concepto_id) {
    const concepto = await buscarConcepto(concepto_id, conjuntoId);
    if (!concepto) return fail('Ese concepto no pertenece a este conjunto', 404);

    if (esProtegido(concepto.codigo) && codigo !== concepto.codigo) {
      return fail(`No se puede cambiar el código del concepto ${concepto.codigo}.`, 409);
    }

    const { error } = await supabaseAdmin
      .from('conceptos_cobro')
      .update({ ...fila, codigo })
      .eq('id', concepto_id);

    if (error) {
      if (error.code === '23505') return fail('Ya existe un concepto con ese código.', 409);
      console.error('Error al actualizar el concepto:', error);
      return fail('No se pudo guardar el concepto', 500);
    }

    return ok({ concepto_id });
  }

  const { data: creado, error } = await supabaseAdmin
    .from('conceptos_cobro')
    .insert({ ...fila, codigo, conjunto_id: conjuntoId, activo: true })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') return fail('Ya existe un concepto con ese código.', 409);
    console.error('Error al crear el concepto:', error);
    return fail('No se pudo crear el concepto', 500);
  }

  return ok({ concepto_id: creado.id }, 201);
});
