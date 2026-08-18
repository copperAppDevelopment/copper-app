import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  esTipoComunicado,
  esTipoNovedad,
  MIMES_PERMITIDOS,
  MAX_BYTES_ADJUNTO,
} from '@/features/comunicados/types';

const BUCKET = 'comunicados';

/** Deja el nombre en algo seguro para una ruta de storage, conservando la extensión. */
function sanearNombre(nombre: string): string {
  return nombre
    // NFD separa las tildes en marcas propias, que el filtro siguiente descarta:
    // «Circular año.pdf» queda «Circular_ano.pdf» y no «Circular_a_o.pdf».
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    // Se recortan los últimos caracteres para no perder la extensión.
    .slice(-80);
}

/**
 * POST: Crea un comunicado (a todo el conjunto) o un reporte (a un apartamento).
 *
 * Ambos viven en la tabla `comunicados`, discriminados por `tipo`. El trigger
 * `crear_notificacion_comunicado` decide la audiencia según `apartamento_id`.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, body }) => {
    const form = body as FormData;

    const tipo = String(form.get('tipo') ?? '');
    const tipoNovedad = String(form.get('tipo_novedad') ?? '');
    const titulo = String(form.get('titulo') ?? '').trim();
    const descripcion = String(form.get('descripcion') ?? '').trim();
    const apartamentoId = String(form.get('apartamento_id') ?? '').trim();
    const archivo = form.get('archivo');

    if (!esTipoComunicado(tipo)) {
      return fail('El tipo de comunicado no es válido', 400);
    }

    if (!esTipoNovedad(tipoNovedad)) {
      return fail('El tipo de novedad no es válido', 400);
    }

    if (!titulo || !descripcion) {
      return fail('El título y la descripción son obligatorios', 400);
    }

    // Sin apartamento el aviso es para todo el conjunto. Si viene, tiene que ser de aquí:
    // es lo único que impide dirigir un reporte al apartamento de otro conjunto.
    if (apartamentoId) {
      const { data: apartamento } = await supabaseAdmin
        .from('apartamentos')
        .select('id, conjunto_id')
        .eq('id', apartamentoId)
        .maybeSingle();

      if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
        return fail('El apartamento no pertenece a este conjunto', 400);
      }
    }

    let adjuntoPath: string | null = null;

    if (archivo instanceof File && archivo.size > 0) {
      if (archivo.size > MAX_BYTES_ADJUNTO) {
        return fail('El archivo supera el límite de 10 MB', 400);
      }

      // El `type` lo declara el navegador y es falsificable; el bucket lo vuelve a
      // validar por su cuenta con `allowed_mime_types`.
      if (!MIMES_PERMITIDOS.includes(archivo.type)) {
        return fail('Solo se admiten imágenes (JPG, PNG, WEBP) o PDF', 400);
      }

      adjuntoPath = `${conjuntoId}/${Date.now()}-${sanearNombre(archivo.name)}`;

      const { error: errorSubida } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(adjuntoPath, archivo, { contentType: archivo.type, upsert: false });

      if (errorSubida) {
        console.error('Error al subir el adjunto del comunicado:', errorSubida);
        return fail('No se pudo subir el archivo adjunto', 500);
      }
    }

    const { data: creado, error } = await supabaseAdmin
      .from('comunicados')
      .insert({
        conjunto_id: conjuntoId,
        creado_por: user.id,
        tipo,
        tipo_novedad: tipoNovedad,
        titulo,
        descripcion,
        apartamento_id: apartamentoId || null,
        adjunto: adjuntoPath,
      })
      .select()
      .single();

    if (error) {
      // El archivo ya está arriba: se borra para no dejar huérfanos en el bucket.
      if (adjuntoPath) {
        await supabaseAdmin.storage.from(BUCKET).remove([adjuntoPath]);
      }
      console.error('Error al crear el comunicado:', error);
      return fail('Error interno al crear el comunicado', 500);
    }

    return ok(creado, 201);
  },
  { formData: true }
);
