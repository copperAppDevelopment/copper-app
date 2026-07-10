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

// 1. POST: Agregar nuevo vehículo
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
    const { marca, modelo, placa, color, tipo_vehiculo } = body;

    if (!marca || !placa || !tipo_vehiculo) {
      return NextResponse.json({ error: 'Faltan campos requeridos (marca, placa o tipo_vehiculo)' }, { status: 400 });
    }

    const { data: newVehicle, error } = await supabaseAdmin
      .from('vehiculos')
      .insert({
        marca,
        modelo: modelo || null,
        placa,
        color: color || null,
        tipo_vehiculo,
        residente_id: residenteId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar vehículo:', error);
      return NextResponse.json({ error: 'Error interno al agregar el vehículo' }, { status: 500 });
    }

    return NextResponse.json({ data: newVehicle }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST vehicles:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. PATCH: Editar vehículo existente
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
    const { id, marca, modelo, placa, color, tipo_vehiculo } = body;

    if (!id || !marca || !placa || !tipo_vehiculo) {
      return NextResponse.json({ error: 'Faltan campos requeridos para la edición' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('vehiculos')
      .update({
        marca,
        modelo: modelo || null,
        placa,
        color: color || null,
        tipo_vehiculo,
      })
      .eq('id', id)
      .eq('residente_id', residenteId)
      .select()
      .single();

    if (error) {
      console.error('Error al editar vehículo:', error);
      return NextResponse.json({ error: 'Error interno al actualizar datos del vehículo' }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error('Error en PATCH vehicles:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 3. DELETE: Eliminar vehículo
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
      .from('vehiculos')
      .delete()
      .eq('id', parseInt(id, 10))
      .eq('residente_id', residenteId);

    if (error) {
      console.error('Error al eliminar vehículo:', error);
      return NextResponse.json({ error: 'Error interno al eliminar el vehículo' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Vehículo eliminado con éxito.' });
  } catch (error: any) {
    console.error('Error en DELETE vehicles:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
