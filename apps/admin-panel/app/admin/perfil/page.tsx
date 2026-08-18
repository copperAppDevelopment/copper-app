'use client';

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { SpinnerPagina } from "@/components/ui/spinner";
import { PerfilTabs } from "@/features/perfil/components/PerfilTabs";
import { PerfilDatosForm } from "@/features/perfil/components/PerfilDatosForm";
import { TabMisConjuntos } from "@/features/perfil/components/TabMisConjuntos";
import { TabEquipo } from "@/features/perfil/components/TabEquipo";
import { TabAdministracion } from "@/features/perfil/components/TabAdministracion";
import { TabAreasComunes } from "@/features/perfil/components/TabAreasComunes";
import { esTab } from "@/features/perfil/types";
import type { TabPerfil } from "@/features/perfil/types";

function PerfilContenido() {
  const sesion = useAdminSession();
  const router = useRouter();
  const params = useSearchParams();

  // La pestaña vive en la URL para que el enlace sea compartible y sobreviva a la recarga.
  const solicitada = params.get("tab") ?? "";
  const activa: TabPerfil = esTab(solicitada) ? solicitada : "perfil";

  const cambiar = (tab: TabPerfil) => {
    router.replace(tab === "perfil" ? "/admin/perfil" : `/admin/perfil?tab=${tab}`);
  };

  return (
    <AdminPageShell
      sesion={sesion}
      active="perfil"
      titulo="Mi perfil"
      subtitulo={sesion.conjuntoNombre}
    >
      <PerfilTabs activa={activa} onCambiar={cambiar} />

      {activa === "perfil" && <PerfilDatosForm />}
      {activa === "conjuntos" && <TabMisConjuntos />}
      {activa === "equipo" && <TabEquipo conjuntoId={sesion.conjuntoId} />}
      {activa === "administracion" && <TabAdministracion conjuntoId={sesion.conjuntoId} />}
      {activa === "areas" && <TabAreasComunes conjuntoId={sesion.conjuntoId} />}
    </AdminPageShell>
  );
}

export default function PerfilPage() {
  // `useSearchParams` obliga a un límite de Suspense en el App Router.
  return (
    <Suspense fallback={<SpinnerPagina />}>
      <PerfilContenido />
    </Suspense>
  );
}
