'use client';

import { useRecepcionSession } from "@/hooks/useRecepcionSession";
import { RecepcionPageShell } from "@/components/layout/recepcion-page-shell";
import { RecepcionPanel } from "@/features/recepcion/components/RecepcionPanel";

export default function RecepcionDashboardPage() {
  const sesion = useRecepcionSession();

  return (
    <RecepcionPageShell
      sesion={sesion}
      titulo="Recepción"
      subtitulo={sesion.conjuntoNombre}
    >
      {/* En portería lo que importa es el día en curso. */}
      <RecepcionPanel conjuntoId={sesion.conjuntoId} rangoInicial="1" />
    </RecepcionPageShell>
  );
}
