'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { ContactosPanel } from "@/features/superadmin/components/ContactosPanel";

export default function SuperAdminContactosPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="contactos"
      titulo="Contactos"
      subtitulo="Solicitudes recibidas desde la página web"
    >
      <ContactosPanel sesionCargando={sesion.loading} />
    </SuperAdminPageShell>
  );
}
