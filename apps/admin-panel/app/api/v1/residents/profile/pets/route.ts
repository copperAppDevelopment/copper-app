import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

async function getResidenteId(user: { id: string }) {
  const { data: residente, error } = await supabaseAdmin
    .from('residentes')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !residente) return null;
  return residente.id;
}

// 1. POST: Agregar nueva mascota
export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const residenteId = await getResidenteId(user);
    if (!residenteId) {
      return NextResponse.json({ error: 'Perfil de residente no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { nombre, raza, especie, tamano } = body;

    if (!nombre || !especie || !tamano) {
      return NextResponse.json({ error: 'Faltan campos requeridos (nombre, especie o tamano)' }, { status: 400 });
    }

    const { data: newPet, error } = await supabaseAdmin
      .from('mascotas')
      .insert({
        nombre,
        raza: raza || null,
        especie,
        tamano,
        residente_id: residenteId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar mascota:', error);
      return NextResponse.json({ error: 'Error interno al agregar la mascota' }, { status: 500 });
    }

    return NextResponse.json({ data: newPet }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST pets:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. PATCH: Editar mascota existente
export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const residenteId = await getResidenteId(user);
    if (!residenteId) {
      return NextResponse.json({ error: 'Perfil de residente no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { id, nombre, raza, especie, tamano } = body;

    if (!id || !nombre || !especie || !tamano) {
      return NextResponse.json({ error: 'Faltan campos requeridos para la edición' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('mascotas')
      .update({
        nombre,
        raza: raza || null,
        especie,
        tamano,
      })
      .eq('id', id)
      .eq('residente_id', residenteId)
      .select()
      .single();

    if (error) {
      console.error('Error al editar mascota:', error);
      return NextResponse.json({ error: 'Error interno al actualizar datos de la mascota' }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error('Error en PATCH pets:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 3. DELETE: Eliminar mascota
export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const residenteId = await getResidenteId(user);
    if (!residenteId) {
      return NextResponse.json({ error: 'Perfil de residente no encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el id del registro a eliminar' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('mascotas')
      .delete()
      .eq('id', parseInt(id, 10))
      .eq('residente_id', residenteId);

    if (error) {
      console.error('Error al eliminar mascota:', error);
      return NextResponse.json({ error: 'Error interno al eliminar la mascota' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Mascota eliminada con éxito.' });
  } catch (error: any) {
    console.error('Error en DELETE pets:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
