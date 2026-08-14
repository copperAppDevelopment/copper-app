import { withAdminConjunto, okCon, fail } from '@/lib/apiHandler';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { BUCKET_BALANCES, procesarArchivo, registrarCarga } from '@/lib/procesarBalances';

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * POST: Carga masiva de recaudos desde el CSV del banco (multipart/form-data).
 *
 * El navegador nunca toca el bucket: el archivo se sube aquí con service role a una ruta
 * separada por conjunto, y a la edge function se le pasa una URL firmada temporal.
 *
 * `formData: true` — el envoltorio lee el cuerpo como FormData y lo pasa ya leído, porque
 * el cuerpo de una Request solo puede consumirse una vez.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, body, accessToken }) => {
    const form = body as FormData;
    const periodo = String(form.get('periodo') ?? '').trim();
    const archivo = form.get('archivo');

    if (!periodo) {
      return fail('El periodo es obligatorio', 400);
    }

    if (!(archivo instanceof File)) {
      return fail('No se recibió el archivo', 400);
    }

    if (!archivo.name.toLowerCase().endsWith('.csv')) {
      return fail('El archivo debe ser un CSV exportado del banco', 400);
    }

    if (archivo.size > MAX_BYTES) {
      return fail('El archivo supera el límite de 10 MB', 400);
    }

    // Ruta por conjunto: antes todo iba a la raíz del bucket, en un espacio de nombres
    // compartido donde no se podía saber a qué conjunto pertenecía cada archivo.
    const archivoPath = `${conjuntoId}/${Date.now()}.csv`;

    const { error: errorSubida } = await supabaseAdmin.storage
      .from(BUCKET_BALANCES)
      .upload(archivoPath, archivo, { contentType: 'text/csv', upsert: false });

    if (errorSubida) {
      console.error('Error al subir el CSV de recaudos:', errorSubida);
      return fail('No se pudo subir el archivo', 500);
    }

    const resultado = await procesarArchivo({ archivoPath, conjuntoId, periodo, accessToken });

    const carga = await registrarCarga({
      conjuntoId,
      archivoPath,
      archivoNombre: archivo.name,
      periodo,
      creadoPor: user.id,
      resultado,
    });

    return okCon({ data: { carga, resultado } }, 201);
  },
  { formData: true }
);
