'use client';

import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { RecepcionPanel } from "@/features/recepcion/components/RecepcionPanel";

export default function RecepcionAdminPage() {
  const sesion = useAdminSession();

  return (
    <AdminPageShell
      sesion={sesion}
      active="recepcion"
      titulo="Recepción"
      subtitulo="Visitas y envíos registrados en portería."
    >
      {/* Una ventana más larga que en portería: el administrador revisa, no atiende. */}
      <RecepcionPanel conjuntoId={sesion.conjuntoId} rangoInicial="30" />
    </AdminPageShell>
  );
}
