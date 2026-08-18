import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/** POST: Crea, actualiza o elimina un área común del conjunto. */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { area_id, eliminar } = body;

  if (area_id) {
    const { data: area } = await supabaseAdmin
      .from('areas_comunes')
      .select('id, conjunto_id')
      .eq('id', area_id)
      .maybeSingle();

    if (!area || area.conjunto_id !== conjuntoId) {
      return fail('Esa área no pertenece a este conjunto', 404);
    }

    if (eliminar) {
      // Nada referencia todavía a `areas_comunes`, así que el borrado es seguro. Si algún
      // día se añaden reservas, esto pasa a ser una desactivación.
      const { error } = await supabaseAdmin.from('areas_comunes').delete().eq('id', area_id);

      if (error) {
        console.error('Error al eliminar el área:', error);
        return fail('No se pudo eliminar el área', 500);
      }

      return ok({ area_id, eliminada: true });
    }
  }

  const nombre = String(body.nombre ?? '').trim();
  if (!nombre) {
    return fail('El nombre del área es obligatorio', 400);
  }

  const fila = {
    nombre,
    descripcion: String(body.descripcion ?? '').trim() || null,
    activa: body.activa === undefined ? true : Boolean(body.activa),
  };

  if (area_id) {
    const { error } = await supabaseAdmin.from('areas_comunes').update(fila).eq('id', area_id);

    if (error) {
      console.error('Error al actualizar el área:', error);
      return fail('No se pudo guardar el área', 500);
    }

    return ok({ area_id });
  }

  const { data: creada, error } = await supabaseAdmin
    .from('areas_comunes')
    .insert({ ...fila, conjunto_id: conjuntoId })
    .select('id')
    .single();

  if (error) {
    console.error('Error al crear el área:', error);
    return fail('No se pudo crear el área', 500);
  }

  return ok({ area_id: creada.id }, 201);
});
