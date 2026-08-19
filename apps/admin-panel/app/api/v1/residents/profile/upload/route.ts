import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const POST = withResidente(async ({ user }, req) => {
  const body = await req.json();
  const { fileBase64, filename } = body;

  if (!fileBase64) {
    return NextResponse.json({ error: 'Payload de imagen no proporcionado (fileBase64 es requerido)' }, { status: 400 });
  }

  // Se quita el prefijo `data:image/...;base64,` si viene.
  const cleanBase64 = fileBase64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');

  const fileExt = filename ? filename.split('.').pop() : 'jpg';
  const finalFilename = `Img Profile/avatar_${user.id}_${Date.now()}.${fileExt}`;

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

  const { error: dbError } = await supabaseAdmin
    .from('users')
    .update({ foto_url: finalFilename })
    .eq('id', user.id);

  if (dbError) {
    console.error('Error al guardar foto_url en base de datos:', dbError);
    return NextResponse.json({ error: 'Error interno al guardar la referencia de la foto' }, { status: 500 });
  }

  return NextResponse.json({ success: true, relativePath: finalFilename });
});
