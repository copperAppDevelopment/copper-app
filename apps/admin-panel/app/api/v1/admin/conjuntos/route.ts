import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAuthUser } from '@/lib/auth';
import { esAdminDeConjunto } from '@/lib/adminAuth';
import { ok, fail } from '@/lib/apiHandler';
import { TIPOS_VIVIENDA } from '@/lib/conjuntos';
import { crearTorresDeConjunto, leerBorradores, motivoInvalido } from '@/lib/torresServidor';

const BUCKET = 'Conjunto';
const MIMES_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES_FOTO = 5 * 1024 * 1024;

/** Deja el nombre del archivo en algo seguro para una ruta de storage. */
const sanearNombre = (nombre: string) =>
  nombre.normalize('NFD').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);

function texto(form: FormData, clave: string): string {
  return String(form.get(clave) ?? '').trim();
}

function entero(form: FormData, clave: string): number | null {
  const valor = texto(form, clave);
  if (!valor) return null;
  const numero = Number(valor);
  return Number.isInteger(numero) ? numero : null;
}

/**
 * POST: crea un conjunto o edita uno existente. `multipart/form-data`, porque lleva foto.
 *
 * No usa `withAdminConjunto`: al crear todavía no hay conjunto sobre el que comprobar
 * pertenencia. La autorización se hace aquí a mano y solo en la rama de edición.
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) return fail('No autorizado', 401);

    // Faltaba: cualquier usuario autenticado —un residente incluido— podía crear conjuntos.
    // `withAdminConjunto` no sirve aquí porque al crear todavía no hay conjunto, así que el
    // rol se comprueba a mano.
    const { data: perfil } = await supabaseAdmin
      .from('users')
      .select('rol, estado, cuenta_bloqueada')
      .eq('id', user.id)
      .maybeSingle();

    if (perfil?.rol !== 'Admin' || perfil?.estado === false || perfil?.cuenta_bloqueada === true) {
      return fail('Necesitas una cuenta de administrador activa', 403);
    }

    const form = await req.formData();
    const conjuntoId = texto(form, 'conjunto_id');
    const esEdicion = Boolean(conjuntoId);

    if (esEdicion && !(await esAdminDeConjunto(user.id, conjuntoId))) {
      return fail('No administras este conjunto', 403);
    }

    const nombre = texto(form, 'nombre');
    const direccion = texto(form, 'direccion');
    const tipoVivienda = texto(form, 'tipo_vivienda');

    if (!nombre || !direccion) {
      return fail('El nombre y la dirección son obligatorios', 400);
    }

    if (!TIPOS_VIVIENDA.includes(tipoVivienda as any)) {
      return fail('El tipo de vivienda no es válido', 400);
    }

    const borradores = leerBorradores(texto(form, 'torres'));
    // Si vienen torres el conjunto se organiza por torres, diga lo que diga la casilla.
    const tieneTorres = texto(form, 'tiene_torres') === 'true' || borradores.length > 0;

    if (borradores.length > 0) {
      // Se valida antes de insertar nada, para que el caso normal no llegue a un fallo
      // a medias con el conjunto ya creado.
      const invalido = motivoInvalido(borradores);
      if (invalido) return fail(invalido, 400);

      if (esEdicion) {
        return fail('Las torres de un conjunto existente se gestionan desde Torres', 400);
      }
    }

    const campos: Record<string, unknown> = {
      nombre,
      direccion,
      tipo_vivienda: tipoVivienda,
      estrato: entero(form, 'estrato'),
      anio_construccion: entero(form, 'anio_construccion'),
      tiene_torres: tieneTorres,
      updated_at: new Date().toISOString(),
    };

    // `codigo_municipio` es NOT NULL y tiene FK a `ubicaciones`. Se valida contra el
    // catálogo para dar un 400 legible en vez de un 500 por violación de clave foránea, y
    // de paso `ciudad` sale de la fila del catálogo: hay 66 nombres de municipio repetidos
    // entre departamentos, así que el nombre que mande el cliente no es fiable.
    // Al editar solo se toca si viene, para no borrar el código de un conjunto que ya lo
    // tenía.
    const codigoMunicipio = texto(form, 'codigo_municipio');
    if (codigoMunicipio) {
      const { data: ubicacion } = await supabaseAdmin
        .from('ubicaciones')
        .select('codigo_municipio, nombre_municipio')
        .eq('codigo_municipio', codigoMunicipio)
        .maybeSingle();

      if (!ubicacion) {
        return fail('La ciudad seleccionada no existe en el catálogo', 400);
      }

      campos.codigo_municipio = ubicacion.codigo_municipio;
      campos.ciudad = ubicacion.nombre_municipio;
    } else if (!esEdicion) {
      return fail('Hay que elegir el departamento y la ciudad', 400);
    }

    // Desmarcar la casilla en un conjunto que ya tiene torres dejaría un estado
    // incoherente: la vista seguiría enseñándolas y nada las gestionaría.
    if (esEdicion && !tieneTorres) {
      const { count } = await supabaseAdmin
        .from('torres')
        .select('id', { count: 'exact', head: true })
        .eq('conjunto_id', conjuntoId);

      if ((count ?? 0) > 0) {
        return fail(
          `El conjunto tiene ${count} torres. Elimínalas desde Torres antes de desmarcar la casilla.`,
          409
        );
      }
    }

    const foto = form.get('foto');
    let fotoPath: string | null = null;

    if (foto instanceof File && foto.size > 0) {
      if (foto.size > MAX_BYTES_FOTO) {
        return fail('La imagen supera el límite de 5 MB', 400);
      }
      if (!MIMES_FOTO.includes(foto.type)) {
        return fail('Solo se admiten imágenes JPG, PNG o WEBP', 400);
      }

      fotoPath = `${conjuntoId || 'nuevo'}/${Date.now()}-${sanearNombre(foto.name)}`;

      const { error: errorSubida } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(fotoPath, foto, { contentType: foto.type, upsert: false });

      if (errorSubida) {
        console.error('Error al subir la foto del conjunto:', errorSubida);
        return fail('No se pudo subir la imagen', 500);
      }

      // El bucket es público: se guarda la URL directa, como el resto de las fotos.
      const { data: publica } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fotoPath);
      campos.foto_url = publica.publicUrl;
    }

    if (esEdicion) {
      const { error } = await supabaseAdmin
        .from('conjuntos')
        .update(campos as any)
        .eq('id', conjuntoId);

      if (error) {
        console.error('Error al actualizar el conjunto:', error);
        return fail('No se pudo guardar el conjunto', 500);
      }

      return ok({ conjunto_id: conjuntoId });
    }

    // El conjunto nace inactivo: lo activa el webhook cuando el pago se aprueba.
    const { data: creado, error } = await supabaseAdmin
      .from('conjuntos')
      .insert({ ...campos, activo: false } as any)
      .select('id')
      .single();

    if (error || !creado) {
      console.error('Error al crear el conjunto:', error);
      if (fotoPath) await supabaseAdmin.storage.from(BUCKET).remove([fotoPath]);
      return fail('No se pudo crear el conjunto', 500);
    }

    // Las dos filas que el conjunto necesita y que ningún trigger crea: sin
    // `admins_conjuntos` quien lo creó no lo vería, y sin `conjuntos_configuracion` el
    // JOIN de `generar_cargos_mensuales` lo deja fuera. Los conceptos ADMIN y MORA no se
    // tocan aquí: los inserta `trg_crear_conceptos_default` al dar de alta el conjunto.
    await supabaseAdmin.from('admins_conjuntos').insert({
      conjunto_id: creado.id,
      user_id: user.id,
      es_propietario: true,
      activo: true,
    } as any);

    await supabaseAdmin.from('conjuntos_configuracion').insert({
      conjunto_id: creado.id,
    } as any);

    // Las torres viajan en el mismo POST y se crean aquí: hacerlo desde el cliente tras
    // recibir el id dejaría una ventana con el conjunto sin torres y el modal ya cerrado,
    // sin dónde reintentar. Un fallo aquí no anula el alta —el conjunto ya existe y la
    // foto está subida—: se informa de cuáles quedaron fuera.
    const torres = borradores.length
      ? await crearTorresDeConjunto(creado.id, borradores)
      : { creadas: 0, fallidas: [] };

    return ok({ conjunto_id: creado.id, torres }, 201);
  } catch (error: any) {
    console.error('Error en POST /api/v1/admin/conjuntos:', error);
    return fail(error?.message || 'Error interno del servidor', 500);
  }
}
