# Contexto del Proyecto: CopperAppV2

Este archivo contiene la documentación general y el contexto técnico del proyecto **CopperAppV2** para guiar a los agentes de IA en futuras interacciones y modificaciones de código.

---

## 1. Resumen del Proyecto
**CopperAppV2** es una plataforma interactiva y landing page premium diseñada para conjuntos residenciales y copropiedades en Colombia. Su objetivo es automatizar la administración diaria, mejorar el recaudo financiero, agilizar el control de accesos y centralizar la comunicación entre residentes y administradores.

- **Público Objetivo:** Administradores de propiedad horizontal, consejos de administración, residentes (copropietarios/arrendatarios) y personal de seguridad/portería en Colombia.
- **Diferenciadores Clave:** Integración fluida, usabilidad móvil optimizada, simulador de ahorro local, y pasarela de pago (PSE/tarjetas) integrada.

---

## 2. Stack Tecnológico (Planificado para la Migración)
La aplicación se migrará a **Astro** para maximizar el rendimiento y optimizar el SEO, manteniendo componentes interactivos en **React** y utilizando la arquitectura de islas.

- **Framework Principal:** [Astro](https://astro.build/) (v5.x / v4.x)
- **Biblioteca UI:** [React](https://react.dev/) (v19.x)
- **Gestión de Estilo:** [Tailwind CSS v4](https://tailwindcss.com/) (integrado mediante Vite)
- **Estado Global:** [Nanostores](https://github.com/nanostores/nanostores) (para comunicación reactiva entre islas de React)
- **Íconos:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Motion](https://motion.dev/) (anteriormente Framer Motion)

---

## 3. Arquitectura del Software (Feature-based)
El proyecto utiliza una arquitectura **Feature-based** (orientada a características). En lugar de agrupar todo por tipo técnico (todos los componentes en una sola carpeta `components`), cada característica del negocio reside en su propio directorio dentro de `src/features/`.

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

## 4. Estrategia de Estados e Islas
Para evitar el envío de JavaScript innecesario al navegador, la mayoría de los componentes son estáticos (`.astro`). Solo los componentes con interacción de usuario real se hidratan en el cliente mediante directivas de Astro (`client:load` o `client:visible`).

La comunicación entre estas islas independientes se realiza a través de **Nanostores** en `src/stores/appStore.ts`:
1. **`isDarkStore`**: Controla el tema oscuro/claro a nivel global.
2. **`isLoginOpenStore`**: Estado booleano para abrir o cerrar el modal de inicio de sesión (`LoginModal`).
3. **`activeTestimonialStore`**: Contiene la información del testimonio en video activo para que `VideoModal` lo reproduzca.
4. **`selectedPlanStore`**: Almacena el nombre del plan seleccionado en `Pricing` para inyectarlo en el campo correspondiente en `ContactForm`.

---

## 5. Instrucciones de Desarrollo
### Comandos Útiles (Astro)
- `pnpm dev`: Inicia el servidor de desarrollo local en `http://localhost:4321`.
- `pnpm build`: Compila el sitio estático optimizado y empaqueta las islas React en la carpeta `dist/`.
- `pnpm preview`: Sirve localmente la compilación de producción para pruebas previas.
- `pnpm lint`: Ejecuta el validador de TypeScript (`tsc --noEmit`).

### Reglas para Agregar Características
1. **Identificar interactividad:** Si la característica es puramente visual o informativa, crea un archivo `.astro` estático. Si requiere manejo de estado reactivo, inputs de texto o modals complejos, crea un componente React (`.tsx`).
2. **Organización:** Crea una subcarpeta bajo `src/features/<nombre-feature>/` y coloca allí todos los componentes y estilos específicos de esa característica.
3. **Estado Compartido:** Nunca envuelvas la página entera en un Context Provider de React si solo deseas pasar un estado simple entre dos componentes lejanos. Utiliza un atom en `src/stores/appStore.ts`.
