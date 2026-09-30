import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail, esUuid } from '@/lib/apiHandler';
import { BUCKET_COMUNICADOS, comunicadoDelConjunto } from '@/lib/comunicadosServidor';

/** Suficiente para abrirlo; si se comparte el enlace, caduca pronto. */
const SEGUNDOS_VIGENCIA = 5 * 60;

/** POST: URL firmada del adjunto de un comunicado. El bucket es privado. */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const comunicadoId = String(body.comunicado_id ?? '').trim();
  if (!esUuid(comunicadoId)) return fail('Falta el comunicado', 400);

  const comunicado = await comunicadoDelConjunto(comunicadoId, conjuntoId);
  if (!comunicado) return fail('No se encontró el comunicado', 404);
  if (!comunicado.adjunto) return fail('Este comunicado no tiene adjunto', 404);

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_COMUNICADOS)
    .createSignedUrl(comunicado.adjunto, SEGUNDOS_VIGENCIA);

  if (error || !data) {
    console.error('Error al firmar el adjunto del comunicado:', error);
    return fail('No se pudo abrir el adjunto', 500);
  }

  return ok({ url: data.signedUrl });
});
