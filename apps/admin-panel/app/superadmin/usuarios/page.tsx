'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { ModuloPendiente } from "@/features/superadmin/components/ModuloPendiente";

export default function SuperAdminUsuariosPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="usuarios"
      titulo="Usuarios"
      subtitulo="Cuentas de toda la plataforma"
    >
      <ModuloPendiente descripcion="Aquí se listarán los usuarios de todos los conjuntos, con su rol, su estado y las acciones de bloqueo." />
    </SuperAdminPageShell>
  );
}
