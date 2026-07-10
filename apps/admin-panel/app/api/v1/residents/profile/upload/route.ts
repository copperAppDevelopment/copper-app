import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    // 1. Validar autenticación
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { fileBase64, filename } = body;

    if (!fileBase64) {
      return NextResponse.json({ error: 'Payload de imagen no proporcionado (fileBase64 es requerido)' }, { status: 400 });
    }

    // 2. Procesar base64 a Buffer
    // Remover prefijos de base64 si existen (data:image/jpeg;base64, etc.)
    const cleanBase64 = fileBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Determinar la extensión del archivo
    const fileExt = filename ? filename.split('.').pop() : 'jpg';
    const finalFilename = `Img Profile/avatar_${user.id}_${Date.now()}.${fileExt}`;

    // 3. Subir archivo al bucket público de Supabase 'Profile'
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Profile')
      .upload(finalFilename, buffer, {
        contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error al subir imagen a Supabase Storage:', uploadError);
      return NextResponse.json({ error: 'Error al subir la imagen al almacén' }, { status: 500 });
    }

    // El storage de Supabase guarda el objeto con la ruta relativa del archivo en el bucket
    const relativePath = finalFilename;

    // 4. Actualizar el campo foto_url en la tabla public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .update({ foto_url: relativePath })
      .eq('id', user.id);

    if (dbError) {
      console.error('Error al guardar foto_url en base de datos:', dbError);
      return NextResponse.json({ error: 'Error interno al guardar la referencia de la foto' }, { status: 500 });
    }

    return NextResponse.json({ success: true, relativePath });
  } catch (error: any) {
    console.error('Error en API profile/upload:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
