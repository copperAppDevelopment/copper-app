import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ok, fail } from '@/lib/apiHandler';

const BUCKET = 'Profile';
const MIMES_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES_FOTO = 5 * 1024 * 1024;

function sanearNombre(nombre: string): string {
  return nombre.normalize('NFD').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
}

/**
 * POST: Actualiza el perfil del **propio** usuario autenticado.
 *
 * No usa `withAdminConjunto` porque no opera sobre un conjunto sino sobre el usuario: el id
 * sale siempre del token y nunca del cuerpo, así que mandar un `user_id` ajeno no sirve de
 * nada. El correo tampoco se toca aquí — solo cambia por el flujo con código.
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) return fail('No autorizado', 401);

    const form = await req.formData();
    const nombres = String(form.get('nombres') ?? '').trim();
    const apellidos = String(form.get('apellidos') ?? '').trim();
    const tipoDocumento = String(form.get('tipo_documento') ?? '').trim();
    const documento = String(form.get('documento') ?? '').trim();
    const telefono = String(form.get('phone_number') ?? '').trim();
    const direccion = String(form.get('direccion') ?? '').trim();
    const foto = form.get('foto');

    if (!nombres || !apellidos || !tipoDocumento || !documento) {
      return fail('Nombres, apellidos, tipo y número de documento son obligatorios', 400);
    }

    let fotoUrl: string | undefined;

    if (foto instanceof File && foto.size > 0) {
      if (foto.size > MAX_BYTES_FOTO) {
        return fail('La imagen supera el límite de 5 MB', 400);
      }

      if (!MIMES_FOTO.includes(foto.type)) {
        return fail('La foto debe ser JPG, PNG o WEBP', 400);
      }

      const ruta = `${user.id}/${Date.now()}-${sanearNombre(foto.name)}`;

      const { error: errorSubida } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(ruta, foto, { contentType: foto.type, upsert: false });

      if (errorSubida) {
        console.error('Error al subir la foto de perfil:', errorSubida);
        return fail('No se pudo subir la foto', 500);
      }

      const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(ruta);
      fotoUrl = data.publicUrl;
    }

    const { data: actualizado, error } = await supabaseAdmin
      .from('users')
      .update({
        nombres,
        apellidos,
        tipo_documento: tipoDocumento,
        documento,
        phone_number: telefono || null,
        direccion: direccion || null,
        updated_at: new Date().toISOString(),
        ...(fotoUrl ? { foto_url: fotoUrl } : {}),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar el perfil:', error);
      return fail('Error interno al guardar el perfil', 500);
    }

    return ok(actualizado);
  } catch (error: any) {
    console.error('Error en POST perfil:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
