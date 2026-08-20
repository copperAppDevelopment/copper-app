# CopperAppV2 - Monorepo de Administración de Copropiedades

Bienvenido al monorepo de **CopperAppV2**, una plataforma interactiva de alto rendimiento diseñada para la administración y comunicación de conjuntos residenciales en Colombia.

El proyecto está organizado en un monorepo administrado por **PNPM Workspaces** y acelerado con **Turborepo** para optimizar los procesos de compilación, linteo y ejecución en desarrollo.

---

## 🛠️ Estructura del Proyecto

El monorepo está dividido en las siguientes aplicaciones y paquetes compartidos:

```
/ (Raíz del Monorepo)
├── apps/
│   ├── landing/                 # Sitio web original en Astro (Landing Page)
│   ├── admin-panel/             # Panel administrativo y API backend en Next.js 15
│   └── mobile-residents/        # Aplicación para residentes en React Native (Expo)
├── packages/
│   ├── database/                # Cliente común de Supabase y tipos de TypeScript
│   └── tsconfig/                # Plantillas y configuraciones base de TypeScript
```

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema de desarrollo:

- **Node.js** (v18.x o superior)
- **PNPM** (v11.x o superior): Instálalo globalmente con `npm i -g pnpm`
- **Supabase CLI** (para la sincronización y generación de tipos de base de datos)
- **Android Studio** con un dispositivo virtual (AVD) configurado y ejecutándose (para probar la app móvil)

---

## ⚙️ Inicialización e Instalación

Para instalar todas las dependencias del monorepo y vincular los proyectos internos de forma optimizada, ejecuta en la raíz:

```bash
pnpm install
```

---

## 💻 Comandos de Desarrollo (Raíz)

Ejecuta estos comandos en la raíz del monorepo:

### Iniciar todos los proyectos en paralelo:
```bash
pnpm dev
```
Esto levantará simultáneamente:
- **Landing Page (Astro):** `http://localhost:3000`
- **Admin Dashboard & API (Next.js):** `http://localhost:3001`
- **App Móvil (Metro Bundler de Expo):** Enrutador para emuladores.

### Compilar todos los proyectos del workspace:
```bash
pnpm build
```

### Ejecutar validaciones de linteo y tipo (TypeScript):
```bash
pnpm lint
```

---

## 🗄️ Supabase y Generación de Tipos de TypeScript

La aplicación móvil, el backend de Next.js y la landing page comparten los mismos tipos tipados de base de datos autogenerados a partir de Supabase. El proyecto está enlazado al ID: `javsddqiuzzigbhygrtp`.

### Pasos para actualizar los tipos de la base de datos:
1. **Iniciar sesión en la CLI de Supabase** (si no lo has hecho):
   ```bash
   npx supabase login
   ```
2. **Vincular el proyecto local con Supabase** (ejecutar una sola vez en la raíz):
   ```bash
   npx supabase link --project-ref javsddqiuzzigbhygrtp
   ```
3. **Generar los tipos actualizados:**
   Ejecuta el script global configurado en el `package.json` raíz:
   ```bash
   pnpm db:gen-types
   ```
   *Este comando sobrescribirá automáticamente el archivo de tipos en `packages/database/src/types.ts`.*

---

## 📱 Ejecución de la App Móvil (React Native & Expo)

La aplicación para residentes está diseñada para ser emulada con Android Studio.

### Pasos para ejecutarla:
1. Abre **Android Studio** e inicia tu dispositivo virtual (AVD) desde el **Device Manager**.
2. Con el emulador activo, ejecuta en la raíz del monorepo:
   ```bash
   pnpm --filter @copper/mobile-residents android
   ```
   *(También puedes ingresar a `apps/mobile-residents` y correr `npx expo start --android`)*
3. La aplicación se compilará y se cargará en el emulador de Android.
4. Comando para subir la aplicación a expo para descargarla:
   ```bash
   eas build --platform android --profile preview
   ```

### 🧠 Arquitectura de la Aplicación Móvil
Para el control de estados y datos del cliente, la app móvil no utiliza Nanostores, sino una combinación robusta de:
- **React Query (TanStack Query):** Se encarga de gestionar y cachear los datos que provienen de la API de Next.js (`/api/v1/...`) de forma asíncrona, manejando estados de carga, reintentos offline y actualizaciones en segundo plano.
- **Zustand:** Se encarga de la persistencia y control del estado global local en el dispositivo del usuario (como la sesión activa del residente y sus tokens JWT).

---

## 📐 Convenciones de Código

Estas reglas aplican a **las tres aplicaciones**. Existen porque ya nos costaron un bug: la
función que formatea fechas estaba copiada en tres páginas del panel, solo una corregía el
desfase de zona horaria, y la misma fecha se mostraba distinta según dónde la miraras.

### 1. Máximo ~300 líneas por archivo

Superarlo casi siempre significa que hay un componente o un hook esperando salir. En
`apps/admin-panel` la regla está activa en ESLint como **aviso**:

```json
"max-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }]
```

Dos páginas heredadas (`login`, `contador`) están exceptuadas en `overrides` mientras se migran.
**No añadas archivos nuevos a esa lista**: si uno nuevo supera el límite, divídelo. Y cuando
migres una de las que quedan, quita también su excepción: si sobrevive al archivo que la
justificaba, tapa el próximo desmadre.

### 2. Arquitectura feature-based

Cada módulo de negocio vive en su propia carpeta, con la lógica separada de la presentación:

```
features/<modulo>/
├── types.ts          # interfaces del dominio
├── api.ts            # consultas a Supabase y llamadas a /api/v1/...
├── utils.ts          # funciones puras del módulo
├── hooks/            # estado y orquestación (toda la E/S vive aquí)
└── components/       # presentación: reciben datos y callbacks por props
```

Ubicación por app:

| App | Carpeta | Forma |
|---|---|---|
| `admin-panel` | `features/<modulo>/` | con `hooks/` y `components/` |
| `mobile-residents` | `src/features/<modulo>/` | con `hooks/` y `components/` |
| `landing` | `src/features/<modulo>/` | plana; el estado va en `src/stores/` |

### 3. Las páginas solo componen

Un `page.tsx` llama a un hook y coloca componentes. **Sin consultas, sin `useState` de negocio,
sin lógica de filtrado.** Referencia: [apps/admin-panel/app/admin/recaudos/page.tsx](apps/admin-panel/app/admin/recaudos/page.tsx).

### 4. Una feature no importa de otra

Si dos módulos necesitan lo mismo, sube:

| Carpeta | Qué va ahí |
|---|---|
| `components/ui/` | genérico, sin dominio: `Button`, `Card`, `Modal`, `CommonTable` |
| `components/layout/` | armazones de página: `AdminPageShell`, `AdminSidebar` |
| `components/<dominio>/` | componentes de dominio compartidos entre features: `balances/` |
| `lib/` | sin React: formato, clientes HTTP, helpers de servidor |
| `hooks/` | con React y transversal: `useAdminSession`, `useTablaLocal` |

### 5. Contrato de las rutas de API

Sobre estándar: **`{ data }` en éxito, `{ error }` en fallo.**

Toda ruta bajo `app/api/v1/admin/**` usa el envoltorio de
[lib/apiHandler.ts](apps/admin-panel/lib/apiHandler.ts), que resuelve sesión, conjunto y
pertenencia del administrador en un solo sitio:

```ts
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  ...
  return ok(nuevo, 201);
});
```

Esto no es comodidad: con RLS desactivado en la base, este envoltorio es la **única** frontera de
autorización que existe. Centralizarla evita que una ruta nueva se olvide de ella.

La frontera es **pertenencia + rol**, no solo pertenencia. `rolEnConjunto` devuelve con qué rol
está el usuario en `admins_conjuntos`, y el envoltorio admite **solo `Admin` por defecto**:

```ts
export const POST = withAdminConjunto(handler, { roles: ['Admin', 'Recepcion'] });
```

⚠️ **Ese default no es decorativo.** Antes se comprobaba solo la pertenencia, y a
`admins_conjuntos` entra **todo** el equipo: un recepcionista podía llamar a cualquier ruta de
`/api/v1/admin/**` de su conjunto, incluida `equipo/vincular`, que hace `update users set rol` con
lo que mande el cliente — es decir, podía ascenderse a `Admin` él mismo. Una ruta nueva que no
declare `roles` queda cerrada a todo el que no sea administrador.

> **Excepción documentada:** las rutas de `app/api/v1/residents/**` devuelven
> `{ success, message }` en sus DELETE. Las consume la app móvil publicada, así que se mantienen
> como están hasta que haya una versión nueva de la app.

### 6. Imports con alias

En `admin-panel` usa `@/` en vez de cadenas de `../../../`:

```ts
import { Button } from "@/components/ui/button";   // ✅
import { Button } from "../../../components/ui/button";  // ❌
```

### 7. Deuda conocida

Archivos que hoy incumplen la regla 1 y están pendientes de migrar:

| Archivo | Líneas |
|---|---|
| `apps/mobile-residents/app/chatRoom.tsx` | 748 |
| `apps/landing/src/features/contact/ContactForm.tsx` | 481 |
| `apps/landing/src/features/benefits/Benefits.tsx` | 424 |
| `apps/mobile-residents/app/register.tsx` | 403 |
| `apps/mobile-residents/app/(tabs)/miPerfil.tsx` | 375 |
| `apps/landing/src/features/contact/DeleteAccountForm.tsx` | 358 |
| `apps/admin-panel/app/login/page.tsx` | 340 |

También: los cuatro `*Section.tsx` de `mobile-residents/src/features/profile/` son clones de CRUD
casi idénticos, igual que sus cuatro rutas gemelas en `api/v1/residents/profile/`.

En la base de datos:

- **`reportes_legacy`** — resto de la fusión de `reportes` en `comunicados`. Conserva 9 filas de
  prueba sin `conjunto_id` que no se pudieron migrar. Nada la lee ni la escribe; se puede borrar.
- **`notifications.envio_id`** — no existe, así que un envío no se puede relacionar con su aviso.
  Añadirla obligaría a recrear `vista_notificaciones_residente`, que consume la app **publicada**, y
  hoy no cambiaría nada observable: la edge function `Send-Notification` no manda `additionalData`,
  así que el deep-link por `id_visita` de `useOneSignal.ts` tampoco funciona. Va junto cuando salga
  una build nueva del móvil.
- **Permisos de tabla de `anon` y `authenticated`** — con RLS desactivada, ambos roles conservan
  `INSERT`/`UPDATE`/`DELETE` sobre todas las tablas, `cargos_mensuales` incluida. Cerrar las RPC
  una a una no lo arregla: mientras esto siga así, la única frontera real es que nadie use la anon
  key a mano. Es la deuda de seguridad más grande que queda.
- **Aislamiento del bucket `chat_files`** — ya no es público, pero sus políticas dan acceso a
  cualquier usuario `authenticated`, así que quien adivine la ruta de un adjunto puede firmarlo.
  Para cerrarlo del todo hay que subir a `chat_id/archivo` y escribir una política por pertenencia
  al chat; los 38 objetos actuales viven en `imagenes/` y `archivo/` y habría que moverlos.
- **Puente `documento ?? cedula`** — `users.cedula` se renombró a `documento`, pero
  `api/v1/residents/profile` acepta los dos nombres para que la app publicada pueda seguir
  guardando. Se retira cuando salga una build nueva del móvil.
- **`conjuntos.estado`** — columna de texto muerta desde que `activo` es la fuente de verdad. Sigue
  ahí con valores incoherentes (`'Activo'` y un `'true'` que dejó el webhook viejo). Se borra
  cuando se confirme que ninguna vista la expone.
- **`unique (conjunto_id, numero_apartamento)`** — sigue sin existir porque ya hay un grupo
  duplicado en producción y el índice fallaría. Mientras tanto la unicidad la defienden los
  índices de nombre y prefijo de `torres` y la comprobación de colisión de
  `crear_torre_con_pisos`.
- **RPC `agregar_o_actualizar_piso` y `generar_pisos_y_apartamentos`** — restos de
  FlutterFlow, sin llamantes. Se les retiró el `execute` de `anon` y `authenticated`: la
  primera hacía `delete from apartamentos` de un piso entero, y con RLS desactivada
  cualquiera con la anon key podía vaciar su contabilidad. Se pueden borrar cuando se
  confirme que nada externo las invoca.
- **Edge functions `create-wompi-payment` y `wompi-webhook`** — reemplazadas por
  `/api/v1/pagos/*` pero **siguen desplegadas y activas**. Retíralas desde el dashboard en cuanto
  valides el flujo nuevo; mientras la URL del webhook apunte a la vieja, los eventos van al código
  roto.

### Auth: códigos de 6 dígitos

El cambio de correo y el restablecimiento de contraseña usan el **OTP nativo de Supabase**, no una
tabla de códigos propia: `updateUser({email})` y `resetPasswordForEmail` los emiten, y `verifyOtp`
los canjea. Tres ajustes del dashboard los sostienen, y **sin ellos los códigos no llegan o llegan
como enlace**:

| Dónde | Qué |
|---|---|
| Auth → SMTP Settings | `smtp.resend.com:587`, usuario `resend`, la `RESEND_API_KEY` como contraseña, remitente `noreply@copperapp.co` |
| Auth → Email Templates | *Change Email Address* y *Reset Password* deben usar `{{ .Token }}`, no `{{ .ConfirmationURL }}` |
| Auth → Providers → Email | *Secure email change* **desactivado**, para que se pida un solo código (al correo nuevo) en vez de dos |

`trg_sync_email` sobre `auth.users` copia el correo a `public.users`: no hace falta actualizarlo a
mano desde el cliente.

⚠️ **Dos enums están acoplados a la app publicada.** En ambos casos, agregar un valor exige
**migrar la base antes** de publicar la build que lo use, o la app fallará al escribir:

| Enum | Acoplado a | Lista en el panel |
|---|---|---|
| `solicitud_tipo_enum` | el selector de `CreateRequestModal.tsx` | `lib/solicitudes.ts` (`TIPOS`) |
| `chat_estado_enum` | `useChats` inserta `'Activo'`; `useChatRoom` compara `'Finalizado'` | `lib/chats.ts` (`ESTADOS_CHAT`) |

### Facturación mensual

`generar_cargos_mensuales` (cron `generar-cargos`, día 1 de cada mes) genera un cargo a **todos los
apartamentos** por cada concepto con `es_recurrente = true`, `tipo_calculo = 'fijo'` y
`activo = true`. **No filtra por código**: cualquier concepto que cumpla esas tres condiciones entra
en la facturación, así que crear uno mal configurado factura a todo el conjunto.

`ADMIN` y `MORA` son estructurales y el trigger `trg_proteger_conceptos` impide renombrarlos,
desactivarlos o borrarlos: `MORA` lo busca la función **por código literal**, así que renombrarlo
apagaría el cálculo de intereses en silencio.

**El periodo es siempre `YYYY-MM`.** La mora compara periodos como texto (`cm.periodo < p_periodo`),
y `-` (0x2D) ordena antes que `/` (0x2F): mientras convivieron `2026-08` y `2026/4`, los cargos con
barra nunca contaban como periodo anterior y **su saldo no generaba intereses**. La única fuente del
formato es `periodoActual()` en `lib/conceptos.ts`, y en la base `crear_cobro_solicitud`.

Deuda conocida: `valor_final` se guarda igual a `valor_base` sin restar `valor_descuento`, así que
el descuento por pronto pago se calcula pero no se aplica al total del cargo.

### Cobros extras

El modal del sidebar genera cargos sueltos —una multa, una cuota extraordinaria— con la RPC
`crear_cobro_manual`, a un apartamento o a todo el conjunto, y permite deshacerlos con
`revertir_cobro_manual`. Ambas están restringidas a `service_role`: con RLS desactivada y la anon
key viajando en el bundle, dejarlas abiertas permitía a cualquiera generar cargos en el conjunto que
quisiera.

⚠️ **Cobrar a mano un concepto recurrente apaga el cron para ese mes.**
`generar_cargos_mensuales` decide qué facturar con un `not exists` sobre
*(apartamento, concepto, periodo)* **sin mirar `origen`**. Verificado: con un cargo manual de
`ADMIN` para un periodo, el cron generó 71 de las 72 administraciones de Lusitania y saltó
justamente ese apartamento, que se quedó con el valor escrito a mano. Con `MORA` pasa lo mismo con
los intereses. El modal lo avisa en la confirmación; no lo bloquea, porque a veces es lo que se
quiere.

Otras cosas que no son obvias:

- **`crear_cobro_manual` devuelve `(creados, apartamentos)`**, y la ruta deriva de ahí los
  omitidos. Antes tenía dos ramas y la de un solo apartamento hacía `v_count := 1` fijo sin mirar
  el `on conflict do nothing`: informaba de éxito con el cargo ya existente. Ahora hay un solo
  `insert` y un solo `get diagnostics`, así que no queda ningún camino que pueda mentir.
- **El vencimiento por defecto es el último día del periodo**, igual que el del cron, y no da
  igual: `aplicar_recaudo` reparte cada pago entre los cargos pendientes
  `order by fecha_vencimiento`, así que una fecha arbitraria colaría el cobro nuevo por delante de
  deudas más antiguas.
- **La reversión nunca borra un cargo con pagos aplicados.** `cargos_recaudos.cargo_id` es
  `ON DELETE CASCADE`: borrarlo se llevaría el registro de aplicación y el dinero del recaudo
  desaparecería del estado de cuenta. Esos se cuentan aparte y se informan.
- **Los residentes no se enteran**: `cargos_mensuales` no tiene ningún trigger de notificación. Si
  el cobro hay que anunciarlo, va un comunicado aparte; el modal lo recuerda al terminar.

### Suscripciones

`suscripciones.estado` es el enum `estado_suscripcion` (`activa`, `proxima`, `vencida`,
`bloqueada`). El cron `actualizar_suscripciones_diario` (2:00 a diario) lo recalcula llamando a
`estado_suscripcion_por_fecha`, que concentra la regla: **30 días de aviso antes de vencer, 15 de
gracia después**. Cambiar los umbrales es tocar esa función y nada más.

Antes del enum, la columna era `text` con un CHECK que validaba `lower(estado)`, así que aceptaba
`'Activa'`; el cron comparaba contra `'activa'` y **llevaba 135 ejecuciones sin actualizar una sola
fila**. Ese es el motivo de que estos vocabularios sean enums y no texto libre.

⚠️ **`bloqueada` es hoy solo informativo**: se muestra en «Mis conjuntos» pero no corta ningún
acceso. El sitio donde poner el corte, cuando se decida la política, es
`api/v1/auth/register/route.ts`, que ya consulta la suscripción del conjunto.

### Pagos de suscripción (Wompi)

El cobro vive en el panel, no en Supabase: `POST /api/v1/pagos/crear` abre la transacción y
`POST /api/v1/pagos/webhook` la resuelve. La lógica común (firmas, periodos) está en
[`lib/wompi.ts`](apps/admin-panel/lib/wompi.ts) y el vocabulario en
[`lib/conjuntos.ts`](apps/admin-panel/lib/conjuntos.ts).

Se migró desde las edge functions `create-wompi-payment` y `wompi-webhook` para poder **alternar
sandbox y producción con variables de entorno**: en Supabase las llaves eran secretos de la función
y cambiarlas obligaba a redesplegar, así que no había forma de probar un cobro sin tocar producción.

| Variable | Para qué |
|---|---|
| `WOMPI_PUBLIC_KEY` | Llave pública (`pub_test_…` o `pub_prod_…`) |
| `WOMPI_INTEGRITY_SECRET` | Firma de integridad del checkout |
| `WOMPI_EVENTS_SECRET` | Firma de los eventos del webhook |
| `WOMPI_CHECKOUT_URL` | `https://checkout.wompi.co/p/`; se cambia para apuntar a sandbox |
| `APP_BASE_URL` | A dónde vuelve el navegador tras pagar |

Para probar en sandbox basta con poner las llaves de prueba en `apps/admin-panel/.env.local`, que
pisa a `.env` y no se versiona. **Ojo: una variable escrita ahí en blanco anula la de `.env`**;
si no la vas a usar, borra la línea en vez de dejarla vacía.

⚠️ **La URL del webhook hay que cambiarla en el panel de Wompi** a
`{APP_BASE_URL}/api/v1/pagos/webhook`. Mientras siga apuntando a la edge function, los eventos
llegan al código viejo, que además está roto: escribía `estado: 'Activa'` y el enum
`estado_suscripcion` solo admite minúsculas.

Detalles que no son obvios:

- **El webhook es la única ruta pública que escribe.** No hay sesión que validar: la autenticidad la
  da exclusivamente la firma del evento, y sin `WOMPI_EVENTS_SECRET` configurado rechaza todo.
- **Idempotencia por `pagos.estado`**, que es el enum `estado_pago` (`pendiente`, `aprobado`,
  `rechazado`, `expirado`). Un pago ya resuelto no vuelve a crear ni extender nada. Antes era texto
  libre, con el mismo riesgo de mayúsculas que tenía `suscripciones.estado`.
- **`conjuntos.activo` es la única fuente de verdad.** La columna `conjuntos.estado` es texto y está
  muerta: el webhook viejo le escribía un booleano y dejó la cadena `'true'` en Salamanca. Nadie
  vuelve a escribirla; se puede borrar cuando se confirme que ninguna vista la expone.
- **Un conjunto nuevo nace inactivo** y lo activa el webhook al aprobarse el pago. Por eso
  `vista_mis_conjuntos_administracion` ya **no** filtra por `activo = true`: si lo hiciera, el
  conjunto pendiente de pago sería invisible justo cuando hay que enseñarlo.
- **`trg_crear_conceptos_default` ya inserta ADMIN y MORA** al dar de alta el conjunto. La ruta de
  creación solo añade `admins_conjuntos` (con `es_propietario`) y `conjuntos_configuracion`, que sí
  faltarían.
- **El QR del conjunto es el UUID en texto plano**, sin prefijo ni JSON: el escáner de
  `apps/mobile-residents/app/register.tsx` mete lo leído tal cual en el campo del conjunto, así que
  cualquier envoltorio rompe el registro de residentes.

### Torres y numeración de apartamentos

Un conjunto puede organizarse por torres (`conjuntos.tiene_torres`). Entonces sus
apartamentos se generan desde `/admin/torres`, o desde el propio alta del conjunto, y **no**
con la generación masiva de Apartamentos, que es para conjuntos sin torres.

**La numeración es `PREFIJO-<piso·100 + índice>`**: `A-101`, `A-102`, `A-201`. El prefijo
se guarda en `torres.prefijo` y no se deriva del nombre: «Torre A» daría `A`, pero «Bloque
Norte» no daría nada, y el prefijo se vuelve a necesitar al añadir pisos meses después.
La fórmula está en [`lib/torres.ts`](apps/admin-panel/lib/torres.ts) y repetida en la RPC
`crear_torre_con_pisos`; **cambiar una obliga a cambiar la otra**, y el formulario enseña
una vista previa justamente para que la discrepancia no se descubra con 200 apartamentos
ya creados.

Cuatro RPC sostienen el módulo, todas con `execute` restringido a `service_role`:
`crear_torre_con_pisos`, `agregar_pisos_a_torre`, `ajustar_apartamentos_de_piso` y
`eliminar_torre_si_vacia`. Las tres primeras son `SECURITY DEFINER` y hacen torre, pisos y
apartamentos en una sola transacción: en dos pasos, un fallo dejaría una torre sin pisos y
el reintento chocaría contra `UNIQUE (torre_id, piso)`.

Cosas que no son obvias:

- **`numero_apartamento_num` no distingue torres.** El trigger
  `set_numero_apartamento_num` guarda el número quitando lo no numérico, así que `A-101` y
  `B-101` valen ambos `101`. Ordenar por esa columna mezcla las torres. El orden real lo da
  `claveOrden()` de [`lib/apartamentos.ts`](apps/admin-panel/lib/apartamentos.ts) —torre,
  piso, número— calculada en el cliente, porque PostgREST no ordena las filas padre por una
  columna embebida. Los selectores de recaudos, comunicados y residentes usan
  `etiquetaApartamento()`, que añade la torre: cobrarle a «101» con dos torres es una
  lotería.
- **Reducir los apartamentos de un piso solo retira los vacíos.** Las FK hacia
  `apartamentos` son CASCADE desde `cargos_mensuales`, `recaudos`, `comunicados`, `envios`
  y `visitas`: borrar un apartamento se lleva su facturación. `ajustar_apartamentos_de_piso`
  aborta si alguno de los sobrantes tiene residentes, cargos, recaudos o historial.
- **Eliminar una torre exige que esté vacía**, y la comprobación vive dentro de la RPC:
  `apartamentos.torre_id` es `ON DELETE SET NULL`, así que un `delete` a pelo **no falla**,
  solo deja los apartamentos huérfanos.
- **`torres.total_apartamentos` y `torres.aptos_por_piso` no son de fiar.** No los mantiene
  ningún trigger. La UI lee `vista_gestion_torres`, que cuenta en vivo. Y para saber por
  qué piso seguir se usa `max(piso)` de `torre_pisos`, nunca `torres.num_pisos`.

### Ubicaciones: departamento y ciudad

`conjuntos.codigo_municipio` tiene **FK a `ubicaciones`**, el catálogo DANE con los 1.122
municipios del país. El formulario de conjunto los elige con dos desplegables encadenados;
antes era un campo de texto y un código mal tecleado daba un 500 por violación de FK.

- **Todo es texto, nunca número.** Medellín es `05001` y su departamento `05`: un
  `Number()` los convierte en `5001` y `5` y rompe la clave foránea.
- **`ciudad` la deriva el servidor** del código elegido, no el cliente: hay 66 nombres de
  municipio repetidos entre departamentos.
- **Los departamentos salen de `vista_departamentos`.** PostgREST no sabe hacer
  `select distinct`, y traer las 1.122 filas para agrupar en el cliente choca con su
  **límite de 1.000, que trunca sin devolver error**: faltarían municipios y no habría ni
  un aviso. Los municipios se piden filtrados por departamento (el mayor tiene 125).

### Recepción: visitas y envíos

La misma página la comparten dos rutas: `/admin/recepcion` y `/recepcion/dashboard`, que es donde
aterriza el rol `Recepcion`. El contenido vive en `RecepcionPanel`
([features/recepcion/](apps/admin-panel/features/recepcion/)) y cada ruta le pone su armazón —
`PageShell` con el sidebar que corresponda. `AdminSidebar` no vale para recepción: enlaza a rutas
donde un recepcionista no puede entrar y monta los modales de cobros y comunicados, cuyos endpoints
le responden 403.

**La notificación al residente la manda la base, no el panel.** Las RPC `crear_visita` y
`crear_envio` insertan la fila en `notifications`, y un trigger sobre esa tabla llama a la edge
function `Send-Notification`, que es quien habla con OneSignal. El panel solo llama a la RPC.

Cosas que no son obvias:

- **Las RPC estaban abiertas a `anon` y eran `SECURITY DEFINER`**: cualquiera con la anon key podía
  crear visitas en cualquier apartamento y dispararle un push al residente. Ahora solo las llama el
  service role. ⚠️ Antes de cerrarlas había **un cliente externo usándolas** (9 notificaciones, la
  última del 23/07/2026, ninguna originada en este repo): si algo dejó de funcionar en portería, es
  eso.
- **Los estados son enums**: `estado_visita_enum` y `estado_envio_enum`. `envios.estado` era texto
  libre y llegó a tener `'  Pendiente'` con espacios delante, escrito por ese cliente externo.
- **Los cambios de estado son condicionales** (`.eq('estado', 'pendiente')`) y devuelven 409 si no
  afectan a ninguna fila. Residente y portería pueden responder la misma visita a la vez, y sin eso
  gana el último sobrescribiendo `autorizado_por`; además hace idempotente el doble clic del
  portero.
- **El conjunto de las rutas de estado sale de la fila, no del cuerpo**, vía `resolverConjunto`. Si
  lo eligiera el cliente, bastaría con mandar el conjunto propio y el id de una visita ajena.
- **`visitas.autorizado_por` no tiene clave foránea**, así que PostgREST no puede resolver el nombre
  con un embed: el `join` a `users` vive dentro de las vistas de recepción, que exponen también el
  rol para distinguir «aprobado por el residente» de «aprobado en portería».
- **El rango de fechas se filtra en la consulta**, no en memoria: `useTablaLocal` pagina sobre lo
  que se le dé, y un conjunto de 200 apartamentos genera miles de visitas al año.
- **`notifications.leida` pasó a `default false`.** Nacían todas marcadas como leídas, así que
  ningún contador de pendientes podía funcionar.

### SuperAdmin: consola global

`/superadmin/dashboard` lee **`vista_superadmin_kpis`** y **`vista_superadmin_ultimas_suscripciones`**
directamente desde el navegador, como el resto del panel. El contenido vive en
[features/superadmin/](apps/admin-panel/features/superadmin/) y el armazón es el mismo `PageShell`
con `SuperAdminSidebar`. `/superadmin/planes`, `/usuarios` y `/contactos` existen pero todavía son
marcadores: los módulos llegan después.

Cosas que no son obvias:

- **El SuperAdmin no pertenece a ningún conjunto.** No está en `admins_conjuntos` y nunca pasa por
  `/select-conjunto`, así que `useSesionPanel` no le sirve: ese hook exige conjunto seleccionado.
  Tiene el suyo, `useSuperAdminSession`, que solo valida sesión y rol.
- **`RolEquipo` no incluye `SuperAdmin`, y es deliberado.** Ese tipo es el rol *dentro de un
  conjunto* y alimenta el `roles` de `withAdminConjunto`; meterlo ahí lo colaría en la autorización
  por conjunto, que es justo donde estuvo la escalada de privilegios de Recepción.
- **Hay dos ingresos distintos y no son lo mismo.** `ingresos_mes_actual` suma `pagos`: lo que los
  residentes le pagan a SU conjunto, dinero que no pasa por Copper. La columna
  `ingresos_suscripciones_mes`, añadida a la vista, es la facturación propia. La maqueta anterior
  mostraba el primero rotulado como «Recaudo Global».
- **`vista_superadmin_nuevas_suscripciones` filtra por el mes en curso**, así que cada día 1
  devuelve una lista vacía. Para «las últimas 5» se creó
  `vista_superadmin_ultimas_suscripciones`, sin ese filtro. La otra sigue intacta porque la
  consume FlutterFlow.
- **`suscripciones` no tiene unicidad por conjunto**: hay tres filas idénticas de un mismo conjunto,
  de las pruebas de pago, y el dashboard las muestra repetidas.
- ⚠️ **El control de acceso es solo de cliente.** Sin RLS, cualquiera con la anon key lee estas
  vistas. En cuanto `/planes` o `/usuarios` escriban, hará falta un `withSuperAdmin` en
  `lib/apiHandler.ts` y cerrar los grants.

### Asignación manual de planes

`/superadmin/suscripciones` da o cambia el plan de un conjunto **sin pasar por Wompi**: cortesías,
demos y clientes que pagan por transferencia. La escritura vive en
[lib/suscripcionesServidor.ts](apps/admin-panel/lib/suscripcionesServidor.ts) y la comparte con el
webhook de la pasarela.

Cosas que no son obvias:

- **`suscripciones` no tiene ni un trigger.** Habilitar el conjunto (`conjuntos.activo`) y a su
  administrador (`users.estado`) lo hace el código, no la base. Si una vía de alta se salta eso, el
  conjunto queda con plan y sin acceso.
- **Se actualiza la suscripción vigente; no se inserta una nueva.** El webhook insertaba a ciegas y
  un conjunto llegó a tener tres activas a la vez. Ahora hay además un índice único parcial
  (`suscripciones_una_activa_por_conjunto`) que lo impide.
  ⚠️ Ese índice lo comprueba también el `update` masivo del cron: si dos filas del mismo conjunto
  pasaran a `activa`, reventaría el cron entero. Por eso ninguna vía puede crear una segunda fila
  con fecha futura.
- **El estado no se fija a mano.** Un cron diario (`actualizar_estados_suscripciones`, 02:00 UTC)
  lo recalcula desde `fecha_fin` con la regla de 30 días de aviso y 15 de gracia. Los endpoints
  llaman a esa misma función, así que la regla vive en un solo sitio.
- **`metodo_pago = 'manual'`** y referencia con prefijo `SA-`: antes todo decía `'wompi'` y no había
  forma de saber el origen de una suscripción.
- **El titular tiene que ser `Admin` de ese conjunto.** A `admins_conjuntos` entra todo el equipo,
  recepcionista incluido, y `suscripciones.admin_user_id` solo tiene clave foránea a `users`: sin la
  comprobación de rol, la suscripción podía quedar a nombre de portería —y el endpoint le habilita
  la cuenta—.
- **El precio se registra a mano y arranca en cero.** No hay dinero cobrado por la pasarela, y
  `vista_superadmin_kpis.ingresos_suscripciones_mes` suma `precio_pagado`: rellenarlo con el precio
  de lista inflaría la facturación del dashboard con dinero que nunca entró.
- **Revocar no borra la fila**, corta `fecha_fin`. `pagos.suscripcion_id` es `ON DELETE CASCADE`, así
  que borrar una suscripción se llevaría por delante los pagos que la originaron.
- ⚠️ `vista_detalle_admin` y `get_admin_suscripciones()` **están mal**: enlazan la suscripción por
  `admin_user_id` sin exigir `conjunto_id`, así que atribuyen el plan de un conjunto a todos los
  demás del mismo administrador. Este módulo no las usa.

### Planes comerciales

`/superadmin/planes` es la única vía de escritura sobre `planes`: crea, edita y activa o desactiva.
Los datos compartidos viven en [lib/planesData.ts](apps/admin-panel/lib/planesData.ts), que
reemplazó a dos copias idénticas de la misma consulta en `features/conjuntos` y
`features/superadmin`.

Cosas que no son obvias:

- **`anon` ya no puede escribir en `planes`.** Sin RLS, cualquiera con la clave pública podía
  cambiar los precios desde el navegador. Se revocaron `insert`, `update`, `delete` y `truncate`
  de `anon` y `authenticated`; **el `select` se queda**, porque lo necesitan la landing y los dos
  modales de plan del panel.
- **Solo puede haber 3 planes activos**, que es lo que la página de precios sabe pintar. Lo impone
  el trigger `trg_planes_tope_activos`, no solo el endpoint: es una regla del negocio. Un plan
  nuevo creado con el cupo lleno nace inactivo, para poder prepararlo antes de reemplazar a otro.
- **Editar uno de los tres activos no cuenta como un cuarto**: el trigger excluye la propia fila.
- **No se borran planes.** `suscripciones_plan_fk` es `ON DELETE NO ACTION` y `plan_id` es
  `NOT NULL`, así que un plan con suscripciones no se puede borrar ni desreferenciar. Desactivar es
  el equivalente y conserva el historial.
- **`activo` pasó a `NOT NULL DEFAULT true`.** Era nullable y las cuatro lecturas filtran
  `.eq('activo', true)`: un plan con `NULL` desaparecía de la landing y de los modales sin error.
- **`subtipo` no se edita**, solo se elige al crear. Son los tres literales del CHECK
  `planes_subtipo_check` (`Básico`, `Profesional`, `Enterprise`), no un enum de la base.
- **Un precio en cero rompe el checkout** de ese periodo (`pagos/crear` devuelve 400), y
  **desactivar un plan impide renovarlo y asignarlo** (404 en el checkout y en la asignación
  manual). El modal avisa de ambas cosas.
- ⚠️ **La insignia «MÁS POPULAR» de la landing se decide buscando `"pro"` dentro del nombre**
  ([Pricing.tsx](apps/landing/src/features/pricing/Pricing.tsx)): renombrar el Profesional la
  apaga, y dos planes con «pro» encienden dos. Merecería una columna `destacado`.

### Registro público de administradores

`/registro` en el panel: cuenta → conjunto → plan → pago. El botón «Registrarse Ahora» de la
landing lleva allí, y los «Comenzar Ahora» de la sección de precios añaden `?plan=<id>` para dejar
el plan preseleccionado.

Cosas que no son obvias:

- **Solo el primer paso es nuevo.** Los pasos 2 y 3 reutilizan `ConjuntoFormModal` y `PlanModal`,
  los mismos que usa un administrador desde el panel. El asistente solo orquesta.
- **`POST /api/v1/auth/registro-admin` es la primera vía que crea un usuario con rol `Admin`**:
  hasta ahora se nacía por invitación de otro administrador o como residente desde la app. Escribir
  `rol: 'Admin'` no es cosmético: `rolEnConjunto` mira el rol global, así que sin él `pagos/crear`
  responde 403 y el recorrido se rompe justo al cobrar.
- **La cuenta nace activa; el que nace bloqueado es el conjunto** (`activo: false`), y lo activa el
  webhook al aprobarse el pago. Un administrador sin pagar entra al panel, pero sus residentes no
  pueden usar la app.
- **El límite por IP se comprueba después de validar**, no al entrar. Si contara los intentos que
  fallan por una errata, tres equivocaciones dejarían a alguien fuera cinco minutos. Lo descubrí
  bloqueándome a mí mismo al probarlo.
- **Se puede reanudar**: quien abandona y vuelve a `/registro` continúa donde estaba —si ya hay
  sesión salta el paso 1, si ya tiene conjunto sin pagar salta al plan— en vez de crear un segundo.
- **`admin/conjuntos` no comprobaba el rol**: cualquier usuario autenticado, un residente incluido,
  podía crear conjuntos. Ahora exige `users.rol = 'Admin'` activo.
- **El callejón sin salida**: un administrador sin conjuntos acababa en `/select-conjunto`, que con
  cero conjuntos no ofrecía ninguna acción. `useSesionPanel` gana `exigeConjunto`, que solo usa
  `/admin/conjuntos` —la única página con sentido antes del primer conjunto—, y la pantalla de
  selección gana un botón para crearlo.
- **La lista de tareas del dashboard** (`ChecklistOnboarding`) desaparece entera cuando están las
  cuatro hechas: activar el conjunto, crear apartamentos, fijar la cuota de administración —que
  nace en cero y sin ella no se factura nada— e invitar residentes.
- ⚠️ **Un conjunto no se puede borrar**, aunque las 17 claves foráneas sean en cascada: el trigger
  `trg_proteger_conceptos` impide borrar los conceptos `ADMIN` y `MORA`, y el borrado en cascada
  choca con él. Para limpiar uno hay que desactivar el trigger un instante.

**El muro de pago, que no existía.** `anon` podía escribir en `suscripciones` y `pagos` con la
clave pública de la landing: darse una suscripción activa, o marcar un pago pendiente como
aprobado sin pagar. Se revocó la escritura ahí y en `torres`, `torre_pisos`, `apartamentos` y
`ubicaciones`, más el `execute` de sus RPC.

⚠️ **Al revocar funciones, `revoke ... from anon, authenticated` no cierra nada.** Postgres concede
`EXECUTE` a `PUBLIC` por defecto y ese grant sobrevive; hay que quitárselo a `public` y devolvérselo
a `service_role`. La primera versión de esta migración parecía correcta y dejaba la RPC abierta.

### Quitar el acceso: usuarios y conjuntos

`/superadmin/usuarios` lista a los administradores con cuántos conjuntos tienen y el plan de cada
uno, y permite vetarlos. `/superadmin/conjuntos` hace lo propio con las copropiedades y su
interruptor de acceso, con ficha de detalle en `/superadmin/conjuntos/[id]`.

**Dónde bloquea de verdad**, que es lo que no era obvio:

- **La app móvil no consulta Supabase ni una sola vez**: todos sus datos salen de
  `/api/v1/residents/**`. Por eso el guard vive ahí, en
  [lib/residenteAuth.ts](apps/admin-panel/lib/residenteAuth.ts), y comprueba `users.estado`,
  `users.cuenta_bloqueada`, `residentes.activo` y `conjuntos.activo`. Surte efecto **al instante y
  en los teléfonos que ya tienen la app**, sin publicar una versión nueva.
- **`login.tsx` casi nunca se ejecuta.** `authStore` guarda la sesión en AsyncStorage y la app abre
  directa en el inicio; Supabase renueva el token solo. La comprobación que tiene esa pantalla sirve
  para dar un mensaje claro, no para bloquear. ⚠️ Y **no llega a nadie hasta una compilación nueva**.
- Al residente de un conjunto desactivado le fallan las pantallas con un 403 y su mensaje; la app
  publicada no sabe distinguirlo de un fallo de red.

**Las dos marcas de veto**, y por qué son dos:

- Vetar escribe `users.estado = false` **y** `users.cuenta_bloqueada = true`; desactivar un conjunto
  escribe `activo = false` **y** `vetado = true`. La primera es la bandera operativa que ya miraban
  cinco comprobaciones; la segunda dice que fue una decisión y no un impago.
- Sin la segunda, **un pago deshacía el veto en silencio**: `habilitarConjuntoYAdmin` reactivaba sin
  mirar nada. Ahora solo reactiva lo que no esté vetado, así que un impago se sigue resolviendo
  pagando y una decisión del SuperAdmin no.
- Un veto **no se puede aplicar a un SuperAdmin ni a uno mismo**: con dos cuentas en la base, un
  veto cruzado dejaría el sistema sin nadie que pueda entrar a deshacerlo.

Y lo demás que cambió por el camino:

- **`anon` ya no puede escribir en `users`, `conjuntos`, `admins_conjuntos` ni `residentes`.** Podía
  hacer `update users set estado = true` con la clave pública, o sea que un vetado se quitaba el
  veto desde la consola del navegador. El `select` se queda: el panel lee esas cuatro desde el
  navegador en nueve sitios y el login del móvil necesita leer `conjuntos`.
- **`useSesionPanel` no miraba `estado`**, solo el rol: un admin vetado conservaba la navegación del
  panel hasta cerrar sesión. Ahora lo saca a `/login`.
- **Las cuatro subtablas del perfil del residente** —convivientes, mascotas, vehículos y empleados—
  tenían el mismo CRUD de 143 líneas copiado cuatro veces, con su propio `getResidenteId`. Ahora
  salen de [lib/recursosResidente.ts](apps/admin-panel/lib/recursosResidente.ts).
- ⚠️ **`vista_detalle_admin` y `get_admin_suscripciones()` están mal**: unen la suscripción por
  `admin_user_id` sin exigir `conjunto_id` y devuelven 20 filas donde van 4. Las vistas nuevas
  resuelven la suscripción **por conjunto**, porque `suscripciones.admin_user_id` es quien pagó, no
  quién administra.
- ⚠️ `auth/register/route.ts` **deja registrarse en un conjunto desactivado**: solo exige que exista
  una fila en `suscripciones`. Su propio comentario dice «cuando se defina la política de bloqueo, el
  filtro va aquí».
- ⚠️ `get_mis_conjuntos()` **está rota en tiempo de ejecución**: referencia columnas que ya no
  existen en `conjuntos`. No la usa nada del repo.

### Contactos: las solicitudes de la web

`/superadmin/contactos` lista lo que llega por los dos formularios de la landing —contacto y
eliminación de cuenta—, con buscador, filtros y los botones de marcar atendida o rechazada.

Cosas que no son obvias:

- ⚠️ **La tabla era pública.** `anon` tenía SELECT, INSERT, UPDATE y DELETE sobre `contactos`, que
  guarda nombre, correo y teléfono de gente que ni siquiera es usuaria: con la clave pública de la
  landing cualquiera podía descargarse los leads o borrarlos. Ahora `anon` y `authenticated` no
  tienen ningún permiso sobre ella.
- **Por eso este módulo lee por el servidor**, con `GET /api/v1/superadmin/contactos`, y no directo
  desde el navegador como el resto del panel: sin grants, el cliente no la ve. Es la primera
  lectura del panel que pasa por una ruta, y por eso `lib/apiClient.ts` ganó `getConAuth`.
- **El formulario de la landing no se entera.** `/api/v1/contact` invoca la edge function
  `send-contact-email` con la anon key, pero quien escribe la fila es la propia función con el
  service_role, que no pasa por esos grants.
- **`estado` es el enum `contacto_estado_enum`** (`Pendiente`, `Atendida`, `Rechazada`),
  capitalizado como los datos que ya había y como `chat_estado_enum`. La ruta valida el valor antes
  de escribir: si no, uno desconocido saldría como error `22P02` en un 500 en vez de un 400.
- **La edge function no escribe `estado`**: se apoya en el default de la columna, que quedó como
  `'Pendiente'::contacto_estado_enum`.
- **`tipo_solicitud` sigue siendo texto libre** y las opciones del filtro salen de los propios
  datos. Ojo a una discrepancia ya existente: el formulario ofrece «Adquirir plan» y en la base hay
  guardado «Adquirir Plan» con P mayúscula, además de una opción «Alianzas comerciales» que todavía
  no ha usado nadie.
- **Borrar una solicitud es definitivo**: no hay claves foráneas hacia `contactos` ni papelera.

### La landing es estática, salvo los precios

`apps/landing` no tiene adaptador ni `output: 'server'`: **todo se pre-renderiza en el build**. Por
eso la consulta de `index.astro` corre una sola vez y los datos quedan horneados en el HTML.

La sección de precios es la excepción: recibe los planes del build como valor inicial y **los
refresca en el navegador al hidratarse**, así un cambio desde el panel se ve al recargar y no hay
que esperar a un despliegue. Si esa consulta falla se conservan los del build: es preferible un
precio de hace unos días a una sección vacía. Cualquier otro dato que se edite desde el panel
**seguirá necesitando un redespliegue de la landing**.

### Verificar el build sin romper el dev server

Un `next build` normal escribe en el mismo `.next/` que usa `next dev`, y deja al servidor de
desarrollo sirviendo 404 en `main-app.js`. Para comprobar que el panel compila con el dev levantado,
**desde la raíz del monorepo**:

```bash
NEXT_DIST_DIR=.next-verify npx turbo run build
```

⚠️ **`turbo run build`, no `next build` a secas.** Ejecutado dentro de `apps/admin-panel`, `next
build` resuelve `@copper/database` por el `dist/` ya compilado y no vuelve a leer `src/types.ts`:
un tipo desactualizado pasa la verificación local y **rompe en Vercel**, que sí recompila el
paquete. Ya ocurrió con `conceptos_cobro.activo`.

⚠️ **`NEXT_DIST_DIR` reescribe `next-env.d.ts`** para apuntar a `.next-verify`. Ese cambio no debe
committearse; revísalo con `git status` al terminar y descártalo.
