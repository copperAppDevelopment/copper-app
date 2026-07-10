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

// 1. POST: Agregar nuevo empleado de servicio
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
    const { nombres, apellidos, cargo, documento_ident, tipo_documento } = body;

    if (!nombres || !cargo || !documento_ident || !tipo_documento) {
      return NextResponse.json({ error: 'Faltan campos requeridos (nombres, cargo, documento_ident o tipo_documento)' }, { status: 400 });
    }

    const { data: newEmployee, error } = await supabaseAdmin
      .from('empleados_servicio')
      .insert({
        nombres,
        apellidos: apellidos || null,
        cargo,
        documento_ident,
        tipo_documento,
        residente_id: residenteId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar empleado de servicio:', error);
      return NextResponse.json({ error: 'Error interno al agregar el empleado' }, { status: 500 });
    }

    return NextResponse.json({ data: newEmployee }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST employees:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. PATCH: Editar empleado de servicio existente
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
    const { id, nombres, apellidos, cargo, documento_ident, tipo_documento } = body;

    if (!id || !nombres || !cargo || !documento_ident || !tipo_documento) {
      return NextResponse.json({ error: 'Faltan campos requeridos para la edición' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('empleados_servicio')
      .update({
        nombres,
        apellidos: apellidos || null,
        cargo,
        documento_ident,
        tipo_documento,
      })
      .eq('id', id)
      .eq('residente_id', residenteId)
      .select()
      .single();

    if (error) {
      console.error('Error al editar empleado de servicio:', error);
      return NextResponse.json({ error: 'Error interno al actualizar datos del empleado' }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error('Error en PATCH employees:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 3. DELETE: Eliminar empleado de servicio
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
      .from('empleados_servicio')
      .delete()
      .eq('id', parseInt(id, 10))
      .eq('residente_id', residenteId);

    if (error) {
      console.error('Error al eliminar empleado de servicio:', error);
      return NextResponse.json({ error: 'Error interno al eliminar el empleado' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Empleado de servicio eliminado con éxito.' });
  } catch (error: any) {
    console.error('Error en DELETE employees:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
