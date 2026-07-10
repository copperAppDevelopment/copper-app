import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

// Helper para validar sesión y retornar el residente_id del usuario
async function getResidenteId(user: { id: string }) {
  const { data: residente, error } = await supabaseAdmin
    .from('residentes')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !residente) return null;
  return residente.id;
}

// 1. POST: Agregar nuevo familiar conviviente
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
    const { nombres, apellidos, parentesco, fecha_nacimiento } = body;

    if (!nombres || !apellidos || !parentesco) {
      return NextResponse.json({ error: 'Faltan campos requeridos (nombres, apellidos o parentesco)' }, { status: 400 });
    }

    const { data: newConviviente, error } = await supabaseAdmin
      .from('convivientes')
      .insert({
        nombres,
        apellidos,
        parentesco,
        fecha_nacimiento: fecha_nacimiento || null,
        residente_id: residenteId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar conviviente:', error);
      return NextResponse.json({ error: 'Error interno al agregar el familiar' }, { status: 500 });
    }

    return NextResponse.json({ data: newConviviente }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST convivientes:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. PATCH: Editar conviviente existente
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
    const { id, nombres, apellidos, parentesco, fecha_nacimiento } = body;

    if (!id || !nombres || !apellidos || !parentesco) {
      return NextResponse.json({ error: 'Faltan campos requeridos para la edición' }, { status: 400 });
    }

    // Actualizar registro garantizando que el residente sea dueño del registro (RLS backup a nivel de API)
    const { data: updated, error } = await supabaseAdmin
      .from('convivientes')
      .update({
        nombres,
        apellidos,
        parentesco,
        fecha_nacimiento: fecha_nacimiento || null,
      })
      .eq('id', id)
      .eq('residente_id', residenteId)
      .select()
      .single();

    if (error) {
      console.error('Error al editar conviviente:', error);
      return NextResponse.json({ error: 'Error interno al actualizar datos del familiar' }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error('Error en PATCH convivientes:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 3. DELETE: Eliminar conviviente
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
      .from('convivientes')
      .delete()
      .eq('id', parseInt(id, 10))
      .eq('residente_id', residenteId);

    if (error) {
      console.error('Error al eliminar conviviente:', error);
      return NextResponse.json({ error: 'Error interno al eliminar el familiar' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Familiar eliminado con éxito.' });
  } catch (error: any) {
    console.error('Error en DELETE convivientes:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
