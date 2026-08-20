import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { responderCors, okPublico, falloPublico, superaLimite, esBot } from '@/lib/publico';

export const OPTIONS = responderCors;

/** Lo que Supabase Auth exige y lo que pedimos nosotros, que es un poco más. */
const MIN_PASSWORD = 8;

/**
 * POST: alta pública de un administrador.
 *
 * Es el paso cero del registro de la landing, y la primera vía del sistema que crea un usuario
 * con rol `Admin`: hasta ahora solo se nacía por invitación de otro administrador o como
 * residente desde la app.
 *
 * La cuenta nace **utilizable** (`estado: true`), como las otras dos altas. El muro de pago no
 * está aquí sino en el conjunto, que nace en `activo: false` hasta que el webhook cobra; y son
 * los residentes de ese conjunto los que se quedan fuera mientras tanto.
 */
export async function POST(req: Request) {
  let usuarioCreado: string | null = null;

  try {
    const body = await req.json().catch(() => ({}));

    // Se responde 200 a propósito: enseñarle al bot que lo detectamos solo sirve para que
    // afine el siguiente intento.
    if (esBot(body)) {
      console.warn('Trampa activada en el registro de administradores.');
      return okPublico({ message: 'Solicitud recibida' });
    }

    const nombres = String(body.nombres ?? '').trim();
    const apellidos = String(body.apellidos ?? '').trim();
    const tipoDocumento = String(body.tipo_documento ?? '').trim();
    const documento = String(body.documento ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const telefono = String(body.telefono ?? '').trim();
    const contrasena = String(body.contrasena ?? '');

    if (!nombres || !apellidos || !tipoDocumento || !documento || !email || !contrasena) {
      return falloPublico('Faltan datos obligatorios.', 400);
    }

    if (!email.includes('@')) {
      return falloPublico('El correo no parece válido.', 400);
    }

    if (contrasena.length < MIN_PASSWORD) {
      return falloPublico(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`, 400);
    }

    // `documento` es único en toda la tabla. Se comprueba antes para dar un mensaje que se
    // entienda, en vez del error 23505 de Postgres tras haber creado ya la cuenta de Auth.
    const { data: repetido } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('documento', documento)
      .maybeSingle();

    if (repetido) {
      return falloPublico('Ya hay una cuenta registrada con ese documento.', 409);
    }

    // El límite se comprueba aquí y no al entrar: si contara también los intentos que fallan
    // por una errata, tres equivocaciones dejarían fuera cinco minutos a quien solo quiere
    // registrarse. Cuenta las altas que llegan a intentarse de verdad.
    if (superaLimite(req)) {
      return falloPublico('Demasiados registros desde esta conexión. Espera unos minutos.', 429);
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: contrasena,
      // Autoconfirmado, igual que las altas por invitación y las de residentes.
      email_confirm: true,
    });

    if (authError || !authData?.user) {
      console.error('Error creando el usuario de Auth:', authError);
      const yaExiste = /already|registered|exists/i.test(authError?.message ?? '');
      return falloPublico(
        yaExiste
          ? 'Ya hay una cuenta con ese correo. Entra con tu contraseña o recupérala.'
          : authError?.message || 'No se pudo crear la cuenta.',
        yaExiste ? 409 : 400
      );
    }

    usuarioCreado = authData.user.id;

    const { error: perfilError } = await supabaseAdmin.from('users').insert({
      id: usuarioCreado,
      nombres,
      apellidos,
      documento,
      tipo_documento: tipoDocumento,
      email,
      phone_number: telefono || null,
      // Sin esto el recorrido se rompe al pagar: `rolEnConjunto` mira el rol global, y
      // `pagos/crear` exige `Admin`.
      rol: 'Admin',
      estado: true,
    } as any);

    if (perfilError) throw perfilError;

    return okPublico({ user_id: usuarioCreado, email }, 201);
  } catch (error: any) {
    console.error('Error en el registro de administrador:', error);

    // Sin esto quedan cuentas de Auth sin perfil, que no pueden entrar a ningún sitio y
    // bloquean el correo para siempre. Ya hay ocho así en la base, de flujos anteriores.
    if (usuarioCreado) {
      const { error: borrado } = await supabaseAdmin.auth.admin.deleteUser(usuarioCreado);
      if (borrado) {
        console.error(`No se pudo limpiar la cuenta huérfana ${usuarioCreado}:`, borrado);
      }
    }

    return falloPublico(error?.message || 'No se pudo completar el registro.', 500);
  }
}

export const dynamic = 'force-dynamic';
