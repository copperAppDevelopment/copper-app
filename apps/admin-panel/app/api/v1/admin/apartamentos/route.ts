import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

// `apartamentos.numero_apartamento` es varchar(20).
const MAX_LONGITUD_NUMERO = 20;

// POST: Crear un apartamento en el conjunto indicado
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { numero_apartamento, direccion, torre_id } = body;

  const numero = typeof numero_apartamento === 'string' ? numero_apartamento.trim() : '';
  const dir = typeof direccion === 'string' ? direccion.trim() : '';

  if (!numero) {
    return fail('El número de apartamento es obligatorio', 400);
  }

  if (numero.length > MAX_LONGITUD_NUMERO) {
    return fail(`El número de apartamento no puede superar ${MAX_LONGITUD_NUMERO} caracteres`, 400);
  }

  // `direccion` es NOT NULL y no tiene default.
  if (!dir) {
    return fail('La dirección es obligatoria', 400);
  }

  // La tabla no tiene constraint único en (conjunto_id, numero_apartamento):
  // sin esta comprobación se pueden crear duplicados silenciosamente.
  const { data: existente, error: errorExistente } = await supabaseAdmin
    .from('apartamentos')
    .select('id')
    .eq('conjunto_id', conjuntoId)
    .eq('numero_apartamento', numero)
    .maybeSingle();

  if (errorExistente) {
    console.error('Error al verificar duplicados de apartamento:', errorExistente);
    return fail('Error interno al validar el apartamento', 500);
  }

  if (existente) {
    return fail(`Ya existe un apartamento con el número ${numero} en este conjunto`, 409);
  }

  const { data: nuevo, error } = await supabaseAdmin
    .from('apartamentos')
    .insert({
      conjunto_id: conjuntoId,
      numero_apartamento: numero,
      direccion: dir,
      torre_id: torre_id || null,
      ocupado: false,
      generado_automatico: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error al insertar apartamento:', error);
    return fail('Error interno al crear el apartamento', 500);
  }

  return ok(nuevo, 201);
});
