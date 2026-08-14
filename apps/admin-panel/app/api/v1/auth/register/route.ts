import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

// Cabeceras CORS comunes para que la app móvil pueda consumirla libremente
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  let createdAuthUserId: string | null = null;

  try {
    const {
      nombres,
      apellidos,
      tipo_documento,
      documento,
      email,
      contrasena,
      conjunto_id,
    } = await request.json();

    // 1️⃣ Validaciones de campos obligatorios
    if (
      !nombres ||
      !apellidos ||
      !tipo_documento ||
      !documento ||
      !email ||
      !contrasena ||
      !conjunto_id
    ) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2️⃣ Validar si el conjunto cuenta con una suscripción activa
    const { data: suscripcion, error: subError } = await supabaseAdmin
      .from('suscripciones')
      .select('estado')
      .eq('conjunto_id', conjunto_id)
      .eq('estado', 'Activa')
      .maybeSingle();

    if (subError) {
      console.error('Error consultando suscripción del conjunto:', subError);
      return NextResponse.json(
        { error: 'Error al verificar la suscripción del conjunto.' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (!suscripcion) {
      return NextResponse.json(
        { error: 'El conjunto residencial especificado no cuenta con una suscripción activa.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3️⃣ Registrar el usuario en Supabase Auth usando el cliente administrador
    // Esto se realiza de forma segura en el servidor, evitando que el usuario deba confirmar su email si queremos agilidad.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: contrasena,
      email_confirm: true, // Confirmamos el email automáticamente
    });

    if (authError) {
      console.error('Error creando usuario en auth.users:', authError);
      return NextResponse.json(
        { error: authError.message || 'Error al registrar las credenciales de acceso.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario de autenticación.' },
        { status: 500, headers: corsHeaders }
      );
    }

    createdAuthUserId = authData.user.id;

    // 4️⃣ Insertar el perfil del usuario en la tabla pública public.users
    const { error: userInsertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: createdAuthUserId,
        nombres,
        apellidos,
        cedula: documento,
        tipo_documento,
        email,
        rol: 'Residente',
        estado: true, // Activo por defecto al registrarse
      });

    if (userInsertError) {
      console.error('Error insertando en public.users:', userInsertError);
      throw userInsertError; // Provoca rollback
    }

    // 5️⃣ Insertar el registro en la tabla public.residentes
    const { error: residenteInsertError } = await supabaseAdmin
      .from('residentes')
      .insert({
        user_id: createdAuthUserId,
        conjunto_id,
        activo: true,
      });

    if (residenteInsertError) {
      console.error('Error insertando en public.residentes:', residenteInsertError);
      throw residenteInsertError; // Provoca rollback
    }

    // Registro completado exitosamente
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente como residente.',
        userId: createdAuthUserId,
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Rollback activado debido a error en el registro:', error);

    // 🧼 Idempotencia y Rollback manual para no dejar usuarios huérfanos en auth.users
    if (createdAuthUserId) {
      console.warn(`Eliminando usuario huérfano de auth.users: ${createdAuthUserId}`);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
      if (deleteError) {
        console.error(`Error crítico limpiando el usuario huérfano ${createdAuthUserId}:`, deleteError);
      }
    }

    return NextResponse.json(
      { error: error.message || 'Error interno al registrar el usuario en el servidor.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
