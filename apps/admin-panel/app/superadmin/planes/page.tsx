'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { ModuloPendiente } from "@/features/superadmin/components/ModuloPendiente";

export default function SuperAdminPlanesPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="planes"
      titulo="Planes"
      subtitulo="Planes comerciales de Copper"
    >
      <ModuloPendiente descripcion="Aquí se listarán y editarán los planes: precios mensual, trimestral y anual, tope de residentes y si están activos." />
    </SuperAdminPageShell>
  );
}
