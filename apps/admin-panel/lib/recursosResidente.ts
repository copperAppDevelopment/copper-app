import { NextResponse } from 'next/server';
import { supabaseAdmin } from './supabaseAdmin';
import { withResidente } from './residenteAuth';

/**
 * Las cuatro subtablas del perfil del residente —convivientes, mascotas, vehículos y empleados
 * de servicio— tenían un CRUD idéntico de 143 líneas copiado cuatro veces, con su propia copia
 * de `getResidenteId`. Esto es ese CRUD una sola vez.
 *
 * El sobre de las respuestas se conserva tal cual, incluido el `{ success, message }` del DELETE,
 * porque lo consume la app publicada.
 */
/** Las cuatro tablas que cuelgan de un residente. Acotado para que el cliente las tipe. */
type TablaRecurso = 'convivientes' | 'mascotas' | 'vehiculos' | 'empleados_servicio';

export interface RecursoResidente<T extends Record<string, unknown>> {
  /** Tabla de la base. */
  tabla: TablaRecurso;
  /** Cómo llamar al recurso en los mensajes de error: «el familiar», «la mascota». */
  articulo: string;
  /** Texto del DELETE, que la app muestra tal cual: «Familiar eliminado con éxito.». */
  mensajeBorrado: string;
  /** Campos que no pueden faltar, en el orden en que se nombran en el error. */
  obligatorios: string[];
  /** Del cuerpo a la fila, con los opcionales ya normalizados a `null`. */
  aFila: (body: any) => T;
}

const faltan = (campos: string[]) =>
  NextResponse.json(
    { error: `Faltan campos requeridos (${campos.join(', ')})` },
    { status: 400 }
  );

const completo = (body: any, campos: string[]) => campos.every(campo => Boolean(body?.[campo]));

export function rutasRecursoResidente<T extends Record<string, unknown>>(
  recurso: RecursoResidente<T>
) {
  const POST = withResidente(async ({ residenteId }, req) => {
    const body = await req.json();
    if (!completo(body, recurso.obligatorios)) return faltan(recurso.obligatorios);

    const { data, error } = await supabaseAdmin
      .from(recurso.tabla)
      .insert({ ...recurso.aFila(body), residente_id: residenteId } as any)
      .select()
      .single();

    if (error) {
      console.error(`Error al insertar en ${recurso.tabla}:`, error);
      return NextResponse.json({ error: `Error interno al agregar ${recurso.articulo}` }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  });

  const PATCH = withResidente(async ({ residenteId }, req) => {
    const body = await req.json();
    if (!body?.id || !completo(body, recurso.obligatorios)) {
      return NextResponse.json({ error: 'Faltan campos requeridos para la edición' }, { status: 400 });
    }

    // El `.eq('residente_id', …)` es lo que impide editar el registro de otro residente: sin RLS
    // en la base, esta condición es la única frontera.
    const { data, error } = await supabaseAdmin
      .from(recurso.tabla)
      .update(recurso.aFila(body) as any)
      .eq('id', body.id)
      .eq('residente_id', residenteId)
      .select()
      .single();

    if (error) {
      console.error(`Error al editar en ${recurso.tabla}:`, error);
      return NextResponse.json({ error: `Error interno al actualizar ${recurso.articulo}` }, { status: 500 });
    }

    return NextResponse.json({ data });
  });

  const DELETE = withResidente(async ({ residenteId }, req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el id del registro a eliminar' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from(recurso.tabla)
      .delete()
      .eq('id', parseInt(id, 10))
      .eq('residente_id', residenteId);

    if (error) {
      console.error(`Error al eliminar de ${recurso.tabla}:`, error);
      return NextResponse.json({ error: `Error interno al eliminar ${recurso.articulo}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: recurso.mensajeBorrado });
  });

  return { POST, PATCH, DELETE };
}
