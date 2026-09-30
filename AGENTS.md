# Contexto del Proyecto: CopperAppV2

Este archivo contiene la documentación general y el contexto técnico del proyecto **CopperAppV2** para guiar a los agentes de IA en futuras interacciones y modificaciones de código.

---

## 1. Resumen del Proyecto
**CopperAppV2** es una plataforma interactiva y landing page premium diseñada para conjuntos residenciales y copropiedades en Colombia. Su objetivo es automatizar la administración diaria, mejorar el recaudo financiero, agilizar el control de accesos y centralizar la comunicación entre residentes y administradores.

- **Público Objetivo:** Administradores de propiedad horizontal, consejos de administración, residentes (copropietarios/arrendatarios) y personal de seguridad/portería en Colombia.
- **Diferenciadores Clave:** Integración fluida, usabilidad móvil optimizada, simulador de ahorro local, y pasarela de pago (PSE/tarjetas) integrada.

---

## 2. Reglas de Trabajo (las tres apps)

Aplican a `landing`, `admin-panel` y `mobile-residents`. El detalle de estructura de carpetas y
contratos de API está en «Convenciones de Código» del [README.md](README.md).

1. **Ante una duda de lógica de negocio, pregunta antes de inventar.** Cómo se cobra, a quién
   pertenece un dato, qué pasa cuando un residente se va, qué ve el administrador frente al
   residente: eso lo decide el dueño del producto, no el código. Si la respuesta no está en el
   código, en el README o en la conversación, pregunta. Un supuesto razonable pero equivocado
   termina en datos mal migrados o en una app publicada que no se puede corregir al instante.
2. **Nada de boilerplate.** Antes de escribir, busca si ya existe: helpers en `lib/`, componentes
   compartidos en `components/`, hooks en `hooks/`. Si vas a copiar un bloque por segunda vez,
   extráelo. Hubo un CRUD idéntico copiado cuatro veces y una función de fechas copiada en tres
   páginas, y solo una de las copias tenía el arreglo.
3. **Responsabilidad única.** Un archivo, una razón para cambiar: las páginas solo componen, los
   hooks orquestan estado y E/S, los componentes presentan lo que reciben por props, `api.ts`
   habla con Supabase o con `/api/v1`. Una feature no importa de otra; lo compartido sube a
   `components/`, `lib/` o `hooks/`.
4. **Nada de archivos monolito.** Máximo 300 líneas por archivo (sin contar líneas en blanco ni
   comentarios). ESLint lo exige como **error** en las tres apps y `pnpm lint` falla. Si un
   archivo no cabe, divídelo; no lo agregues a la lista de excepciones, que es solo para la
   deuda que ya existía.
5. **Evita la sobreingeniería.** Resuelve el problema que hay, no el que podría haber. Sin
   capas, abstracciones, configuraciones ni dependencias «por si acaso»; tres líneas repetidas
   dos veces son más claras que una abstracción prematura. Si una solución más grande parece
   necesaria, proponla y deja que el usuario decida.
6. **Normaliza la base de datos.**
   - Cada dato vive una sola vez, en la tabla de la entidad a la que pertenece. Ejemplo real:
     vehículos, mascotas, convivientes y empleados son del **apartamento** (`apartamento_id`), no
     del residente que los registró, porque un apartamento tiene varios residentes.
   - No guardes lo que se puede derivar (saldos, totales, nombres de otra tabla): calcúlalo en
     una vista o en la consulta.
   - Relaciones con FK explícitas y un `on delete` pensado: `cascade` solo si el hijo no tiene
     sentido sin el padre; si no, `set null` o `restrict`.
   - Cambios de esquema en `supabase/migrations/` (versionados), probados antes en una
     transacción que se revierte. Tras cambiar el esquema, regenera los tipos de
     `packages/database` y recompila el paquete.
   - La escritura va por la API con `service_role`; no concedas `insert/update/delete` a `anon`
     ni a `authenticated`.
7. **Compatibilidad con la app publicada.** Hay versiones de la app en teléfonos que no se
   actualizan solas: una ruta de `/api/v1` que consume la app no cambia la forma de su respuesta
   ni sus claves. Se agrega, no se renombra ni se quita.
8. **Idioma.** Código, comentarios, commits y textos de interfaz en español.

---

## 3. Tiendas Móviles (`apps/mobile-residents`)

App Expo (SDK 57, React Native, New Architecture) publicada como **Copper App**, con el mismo
identificador en las dos tiendas: `com.copper.residents`.

### Google Play (Android)
- Se compila con **EAS** desde el árbol de trabajo local (no desde git):
  `eas build -p android --profile production` y se sube con `eas submit -p android`.
- `eas.json`: `appVersionSource: "remote"` y `autoIncrement` en `production`, así que el
  `versionCode` lo lleva EAS. pnpm está fijado en el perfil `base`.
- La cuenta de servicio de Google Play vive **fuera del repositorio** (`~/.secrets/`). Nunca se
  versiona ni se lee su contenido.
- Las variables `EXPO_PUBLIC_*` de los builds viven en EAS por entorno. `eas env:update
  --environment` **reemplaza** la lista de entornos: pasa todos los que deba conservar.

### App Store (iOS)
- Se compila con **Codemagic** (`codemagic.yaml`) en cada push a `main` y se sube a TestFlight.
  Las `EXPO_PUBLIC_*` salen del grupo `copper_mobile_env` y el build falla si falta alguna.
- Cuando Apple aprueba una versión, ese número de versión se cierra: el siguiente envío exige
  subir `version` en `app.json`. Solo puede haber un build en revisión a la vez.
- Requisitos de revisión que ya nos rechazaron: textos de propósito claros para cámara y fotos;
  sin permisos que la app no usa (micrófono, ubicación — OneSignal va con
  `disableLocation: true`); la app **no rastrea** (sin ATT) y así debe declararse en las
  etiquetas de privacidad; el ícono no puede tener canal alfa; la eliminación de cuenta debe
  ser accesible desde la app (Perfil → Zona de peligro → `/eliminar-cuenta` de la landing).
- Notificaciones push por OneSignal, con clave APNs para iOS.
- Enlaces públicos: [App Store](https://apps.apple.com/co/app/copper-app/id6800446218) (id
  `6800446218`) y [Google Play](https://play.google.com/store/apps/details?id=com.copper.residents).

### Publicar una versión nueva (cada vez que cambia la app)

Cualquier cambio en `apps/mobile-residents` —código, textos, íconos, permisos— solo llega a los
residentes con una versión nueva en las dos tiendas. Los cambios del panel o de la base que la
app consume se ven sin publicar nada, **siempre que no rompan la forma de la API** (regla 7).

1. **Commits** en `development`, uno por cambio, con mensaje en español.
2. **Subir `version`** en `apps/mobile-residents/app.json` (1.0.1 → 1.0.2…) en su propio commit.
   Si Apple ya aprobó la versión actual, el build se rechaza sin esto. El número de build
   (`buildNumber`/`versionCode`) no se toca a mano: lo incrementan EAS y Codemagic.
3. **Subir el código y abrir el PR a `main`**:
   `git push origin development` y `gh pr create --base main --head development …`.
   El merge a `main` despliega el panel y la landing en Vercel **y dispara el build de iOS en
   Codemagic**, que lo sube a TestFlight.
4. **Android** (desde `apps/mobile-residents`, con el árbol de trabajo ya en la versión nueva):
   `npx eas build -p android --profile production`, y después
   `npx eas submit -p android --latest`.
5. **iOS**: lo compila Codemagic en el paso 3. Si hace falta compilar en EAS en su lugar:
   `npx eas build -p ios --profile production --auto-submit`. Se usa **uno de los dos, no
   ambos**: cada uno lleva su propio contador de build, y Apple rechaza un número de build
   repetido. La primera vez en EAS hay que ponerlo por encima del último de Codemagic con
   `npx eas build:version:set -p ios`.
6. **Enviar a revisión** en App Store Connect y Play Console, con el texto de **Novedades en esta
   versión**: pocas viñetas, en español, escritas para el residente (qué puede hacer ahora), sin
   jerga técnica y sin anunciar nada que no esté en el build. Solo puede haber un build de iOS en
   revisión a la vez.
7. Si la versión incluye una migración de base de datos o un cambio de API, **desplegar el panel
   primero** (paso 3) y comprobar que la versión anterior de la app sigue funcionando: los
   residentes tardan días en actualizar.

---

## 4. Stack Tecnológico (Planificado para la Migración)
La aplicación se migrará a **Astro** para maximizar el rendimiento y optimizar el SEO, manteniendo componentes interactivos en **React** y utilizando la arquitectura de islas.

- **Framework Principal:** [Astro](https://astro.build/) (v5.x / v4.x)
- **Biblioteca UI:** [React](https://react.dev/) (v19.x)
- **Gestión de Estilo:** [Tailwind CSS v4](https://tailwindcss.com/) (integrado mediante Vite)
- **Estado Global:** [Nanostores](https://github.com/nanostores/nanostores) (para comunicación reactiva entre islas de React)
- **Íconos:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Motion](https://motion.dev/) (anteriormente Framer Motion)

---

## 5. Arquitectura del Software (Feature-based)
El proyecto utiliza una arquitectura **Feature-based** (orientada a características). En lugar de agrupar todo por tipo técnico (todos los componentes en una sola carpeta `components`), cada característica del negocio reside en su propio directorio dentro de `src/features/`.

> ⚠️ **Esta sección describe únicamente la app `landing`.** Las convenciones que aplican a **las
> tres aplicaciones** —límite de tamaño por archivo, estructura de `features/`, contrato de las
> rutas de API y dónde vive cada helper— están en la sección **«Convenciones de Código»** del
> [README.md](README.md). Esa es la fuente de verdad; lo de abajo es el detalle de los módulos
> concretos de la landing.

### Estructura de Directorios
- `src/layouts/`: Plantillas comunes del sitio (e.g. `Layout.astro`), cabeceras HTML, inyección de metatags de SEO y lógica global de cambio de tema.
- `src/pages/`: Páginas mapeadas a rutas. La página de inicio es `src/pages/index.astro`.
- `src/stores/`: Atoms de Nanostores para estado global ligero.
- `src/types/`: Interfaces TypeScript compartidas a lo largo de las características.
- `src/features/`: Directorio principal de módulos de negocio:
  - **`hero`**: Landing principal, textos destacados y el fondo dinámico de la ciudad (`CitySkyline.astro`).
  - **`about`**: Información sobre la empresa y el **Simulador de Ahorro** interactivo en tiempo real.
  - **`features-list`**: Listado de características de soporte y funcionalidades del sistema.
  - **`benefits`**: Detalle interactivo de módulos agrupados por rol (inquilinos, administración o ambos), junto con diálogos expandibles.
  - **`testimonials`**: Carrusel de opiniones de clientes con reproductor modal integrado (`VideoModal.tsx`).
  - **`pricing`**: Tabla comparativa de planes comerciales (Básico, Profesional, Premium) y redirecciones al contacto.
  - **`faq`**: Respuestas a preguntas frecuentes con acordeón dinámico.
  - **`contact`**: Formulario de captura de leads calificados, incluyendo la opción de auto-completado del plan de interés.
  - **`auth`**: Módulo de ingreso de usuarios (`LoginModal.tsx`).
  - **`navigation`**: Elementos de navegación como la barra superior (`Navbar.tsx`) y el pie de página (`Footer.astro`).

---

## 6. Estrategia de Estados e Islas
Para evitar el envío de JavaScript innecesario al navegador, la mayoría de los componentes son estáticos (`.astro`). Solo los componentes con interacción de usuario real se hidratan en el cliente mediante directivas de Astro (`client:load` o `client:visible`).

La comunicación entre estas islas independientes se realiza a través de **Nanostores** en `src/stores/appStore.ts`:
1. **`isDarkStore`**: Controla el tema oscuro/claro a nivel global.
2. **`isLoginOpenStore`**: Estado booleano para abrir o cerrar el modal de inicio de sesión (`LoginModal`).
3. **`activeTestimonialStore`**: Contiene la información del testimonio en video activo para que `VideoModal` lo reproduzca.
4. **`selectedPlanStore`**: Almacena el nombre del plan seleccionado en `Pricing` para inyectarlo en el campo correspondiente en `ContactForm`.

---

## 7. Instrucciones de Desarrollo
### Comandos Útiles (Astro)
- `pnpm dev`: Inicia el servidor de desarrollo local en `http://localhost:4321`.
- `pnpm build`: Compila el sitio estático optimizado y empaqueta las islas React en la carpeta `dist/`.
- `pnpm preview`: Sirve localmente la compilación de producción para pruebas previas.
- `pnpm lint`: Ejecuta el validador de TypeScript (`tsc --noEmit`).

### Reglas para Agregar Características
1. **Identificar interactividad:** Si la característica es puramente visual o informativa, crea un archivo `.astro` estático. Si requiere manejo de estado reactivo, inputs de texto o modals complejos, crea un componente React (`.tsx`).
2. **Organización:** Crea una subcarpeta bajo `src/features/<nombre-feature>/` y coloca allí todos los componentes y estilos específicos de esa característica.
3. **Estado Compartido:** Nunca envuelvas la página entera en un Context Provider de React si solo deseas pasar un estado simple entre dos componentes lejanos. Utiliza un atom en `src/stores/appStore.ts`.
