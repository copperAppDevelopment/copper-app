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
