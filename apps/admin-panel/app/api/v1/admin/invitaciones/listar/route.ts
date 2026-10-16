import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: las invitaciones de residentes del conjunto, las más recientes primero.
 *
 * Pasa por el servidor y no por el cliente de Supabase porque el token es la credencial para
 * crear la cuenta del invitado: no debe llegar al navegador. Por eso no se selecciona.
 */
export const POST = withAdminConjunto(async ({ conjuntoId }) => {
  const { data, error } = await supabaseAdmin
    .from('invitaciones')
    .select(
      'id, email, telefono, creado_en, ultimo_envio_en, envios, error_envio, usado, usado_en, expira_en, ' +
      'apartamentos(numero_apartamento)'
    )
    .eq('conjunto_id', conjuntoId)
    .eq('rol', 'Residente')
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error al listar invitaciones:', error);
    return fail('No se pudieron cargar las invitaciones', 500);
  }

  return ok(
    ((data as any[]) ?? []).map(({ apartamentos, usado, ...fila }) => ({
      ...fila,
      usado: Boolean(usado),
      numero_apartamento: apartamentos?.numero_apartamento ?? null,
    }))
  );
});
