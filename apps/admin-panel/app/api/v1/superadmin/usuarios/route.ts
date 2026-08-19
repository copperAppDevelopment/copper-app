import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";

/**
 * GET: los administradores de la plataforma, con cuántos conjuntos tiene cada uno.
 *
 * Pasa por el servidor porque `users` tiene los grants de escritura revocados y la lectura
 * expone datos de contacto; el detalle por conjunto va en la misma respuesta para no encadenar
 * dos llamadas desde el modal.
 */
export const GET = withSuperAdmin(async () => {
  const [{ data: usuarios, error }, { data: conjuntos }] = await Promise.all([
    supabaseAdmin
      .from("vista_superadmin_usuarios")
      .select("*")
      .order("total_conjuntos", { ascending: false }),
    supabaseAdmin.from("vista_superadmin_admin_conjuntos").select("*"),
  ]);

  if (error) {
    console.error("Error al listar usuarios:", error);
    return fail("No se pudieron cargar los usuarios", 500);
  }

  return ok({ usuarios: usuarios ?? [], conjuntos: conjuntos ?? [] });
});

/**
 * POST: veta o readmite a un administrador.
 *
 * Escribe las dos banderas a la vez: `estado` es la que ya miran las cinco comprobaciones del
 * panel y de las rutas, y `cuenta_bloqueada` marca que fue una decisión y no un impago, para
 * que un pago de Wompi no la deshaga.
 */
export const POST = withSuperAdmin(async ({ user, body }) => {
  const userId = String(body?.user_id ?? "");
  if (!userId) return fail("Falta el usuario", 400);

  const vetado = Boolean(body?.vetado);

  if (userId === user.id) {
    return fail("No puedes vetarte a ti mismo", 409);
  }

  const { data: destino } = await supabaseAdmin
    .from("users")
    .select("id, rol, nombres, apellidos")
    .eq("id", userId)
    .maybeSingle();

  if (!destino) return fail("Ese usuario no existe", 404);

  // Con dos cuentas de SuperAdmin en la base, un veto cruzado dejaría el sistema sin nadie que
  // pueda entrar a deshacerlo.
  if (destino.rol === "SuperAdmin") {
    return fail("No se puede vetar a un SuperAdmin", 409);
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ estado: !vetado, cuenta_bloqueada: vetado } as any)
    .eq("id", userId);

  if (error) {
    console.error("Error al cambiar el veto del usuario:", error);
    return fail("No se pudo cambiar el estado del usuario", 500);
  }

  return ok({ user_id: userId, vetado });
});
