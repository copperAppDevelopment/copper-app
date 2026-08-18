import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { validarToken, MOTIVOS } from '@/lib/invitaciones';

const MINIMO_PASSWORD = 8;

/**
 * POST: Acepta una invitación y crea la cuenta. Ruta **pública**.
 *
 * El token es la única credencial: por eso caduca a los 7 días y se marca como usado en
 * cuanto se completa el registro.
 *
 * Sustituye al flujo de FlutterFlow que vivía fuera del repositorio y que nunca escribía
 * `users.rol` — de ahí los 2 usuarios con rol NULL que quedaron en la base.
 */
export async function POST(req: Request) {
  try {
    const { token, password, nombres, apellidos, tipo_documento, numero_documento, telefono } =
      await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Falta el token' }, { status: 400 });
    }

    const resultado = await validarToken(token);
    if (!resultado.ok) {
      return NextResponse.json({ error: MOTIVOS[resultado.motivo] }, { status: 409 });
    }

    const inv = resultado.invitacion;

    // Los datos de la invitación mandan cuando existen; el formulario solo rellena huecos.
    const datos = {
      nombres: inv.nombres || nombres,
      apellidos: inv.apellidos || apellidos,
      tipo_documento: inv.tipo_documento || tipo_documento,
      documento: inv.numero_documento || numero_documento,
      telefono: inv.telefono || telefono || null,
    };

    if (!datos.nombres || !datos.apellidos || !datos.tipo_documento || !datos.documento) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (nombres, apellidos, tipo y número de documento)' },
        { status: 400 }
      );
    }

    // Si el correo ya tiene cuenta, no se crea nada: se vincula y se le pide iniciar sesión.
    const { data: existentes } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('email', inv.email);

    let userId = existentes?.[0]?.id ?? null;
    const yaExistia = Boolean(userId);

    if (!userId) {
      if (!password || String(password).length < MINIMO_PASSWORD) {
        return NextResponse.json(
          { error: `La contraseña debe tener al menos ${MINIMO_PASSWORD} caracteres` },
          { status: 400 }
        );
      }

      const { data: creado, error: errorAuth } = await supabaseAdmin.auth.admin.createUser({
        email: inv.email,
        password,
        email_confirm: true,
      });

      if (errorAuth || !creado.user) {
        console.error('Error al crear la cuenta:', errorAuth);
        return NextResponse.json(
          { error: errorAuth?.message || 'No se pudo crear la cuenta' },
          { status: 500 }
        );
      }

      userId = creado.user.id;

      const { error: errorUser } = await supabaseAdmin.from('users').insert({
        id: userId,
        email: inv.email,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        tipo_documento: datos.tipo_documento,
        documento: datos.documento,
        phone_number: datos.telefono,
        // El login enruta por este campo: dejarlo en NULL deja al usuario sin sitio.
        rol: inv.rol,
        estado: true,
      });

      if (errorUser) {
        // Sin la fila de `users` la cuenta no sirve para nada: se deshace.
        await supabaseAdmin.auth.admin.deleteUser(userId);
        console.error('Error al crear el perfil:', errorUser);
        return NextResponse.json({ error: 'No se pudo crear el perfil' }, { status: 500 });
      }
    } else {
      await supabaseAdmin
        .from('users')
        .update({ rol: inv.rol, updated_at: new Date().toISOString() })
        .eq('id', userId);
    }

    if (inv.rol === 'Residente') {
      const { data: residente } = await supabaseAdmin
        .from('residentes')
        .select('id')
        .eq('user_id', userId)
        .eq('conjunto_id', inv.conjunto_id)
        .maybeSingle();

      if (!residente) {
        await supabaseAdmin.from('residentes').insert({
          user_id: userId,
          conjunto_id: inv.conjunto_id,
          apartamento_id: inv.apartamento_id,
          activo: true,
        });
      }
    } else {
      const { data: miembro } = await supabaseAdmin
        .from('admins_conjuntos')
        .select('id')
        .eq('user_id', userId)
        .eq('conjunto_id', inv.conjunto_id)
        .maybeSingle();

      if (miembro) {
        await supabaseAdmin.from('admins_conjuntos').update({ activo: true }).eq('id', miembro.id);
      } else {
        await supabaseAdmin.from('admins_conjuntos').insert({
          user_id: userId,
          conjunto_id: inv.conjunto_id,
          es_propietario: false,
          activo: true,
          fecha_asignacion: new Date().toISOString(),
        });
      }
    }

    await supabaseAdmin
      .from('invitaciones')
      .update({ usado: true, usado_en: new Date().toISOString() })
      .eq('id', inv.id);

    return NextResponse.json({ data: { email: inv.email, yaExistia, rol: inv.rol } }, { status: 201 });
  } catch (error: any) {
    console.error('Error al aceptar la invitación:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
