import { supabaseAdmin } from './supabaseAdmin';

/** Bucket privado de los adjuntos. Lo usan las rutas de crear, abrir y eliminar. */
export const BUCKET_COMUNICADOS = 'comunicados';

/**
 * El comunicado, solo si es de ese conjunto. Sin RLS, esta condición es la única frontera:
 * sin ella se podría abrir o borrar el comunicado de otro conjunto sabiendo su id.
 */
export async function comunicadoDelConjunto(comunicadoId: string, conjuntoId: string) {
  const { data } = await supabaseAdmin
    .from('comunicados')
    .select('id, adjunto')
    .eq('id', comunicadoId)
    .eq('conjunto_id', conjuntoId)
    .maybeSingle();

  return data;
}
