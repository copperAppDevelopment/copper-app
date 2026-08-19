'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { ModuloPendiente } from "@/features/superadmin/components/ModuloPendiente";

export default function SuperAdminContactosPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="contactos"
      titulo="Contactos"
      subtitulo="Solicitudes recibidas desde la página web"
    >
      <ModuloPendiente descripcion="Aquí se listarán los contactos de la tabla `contactos`, que hoy solo se ven por correo: tipo de solicitud, datos de quien escribe y su estado de atención." />
    </SuperAdminPageShell>
  );
}
