'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { UsuariosPanel } from "@/features/superadmin/components/UsuariosPanel";

export default function SuperAdminUsuariosPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="usuarios"
      titulo="Usuarios"
      subtitulo="Administradores de la plataforma y su acceso"
    >
      <UsuariosPanel sesionCargando={sesion.loading} />
    </SuperAdminPageShell>
  );
}
