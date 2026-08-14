import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, okCon, ErrorHttp } from '@/lib/apiHandler';
import { procesarArchivo, registrarCarga } from '@/lib/procesarBalances';

/** Lee la carga o corta con 404. Se usa desde el resolver y desde el handler. */
async function buscarCarga(cargaId: unknown) {
  if (!cargaId) {
    throw new ErrorHttp('Falta el carga_id', 400);
  }

  const { data: carga } = await supabaseAdmin
    .from('cargas_recaudos')
    .select('id, conjunto_id, archivo_path, archivo_nombre, periodo')
    .eq('id', cargaId as string)
    .maybeSingle();

  if (!carga) {
    throw new ErrorHttp('No se encontró la carga', 404);
  }

  return carga;
}

/**
 * POST: Reintentar una carga sobre el MISMO archivo ya subido.
 *
 * Es seguro por construcción: el índice único `unique_recaudo_por_apto` rechaza las filas
 * que ya entraron, así que solo se insertan las que faltaban y el resto vuelve marcado
 * como duplicado. Verificado sobre los 211 recaudos existentes: 0 duplicados reales.
 *
 * Lo que el reintento NO recupera es el estado "insertado pero no aplicado": esa fila
 * chocará con el índice único sin reintentar la aplicación. Para eso está `/aplicar`.
 *
 * El conjunto sale de la fila de la carga, no del cuerpo: el cliente solo manda el id.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, body, accessToken }) => {
    const carga = await buscarCarga(body?.carga_id);

    const resultado = await procesarArchivo({
      archivoPath: carga.archivo_path,
      conjuntoId,
      periodo: carga.periodo,
      accessToken,
    });

    const nueva = await registrarCarga({
      conjuntoId,
      archivoPath: carga.archivo_path,
      archivoNombre: carga.archivo_nombre,
      periodo: carga.periodo,
      creadoPor: user.id,
      resultado,
    });

    return okCon({ data: { carga: nueva, resultado } }, 201);
  },
  { resolverConjunto: async (body) => (await buscarCarga(body?.carga_id)).conjunto_id }
);
