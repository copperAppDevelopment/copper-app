'use client';

import { useState } from "react";
import { Plus, Layers, Info } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useApartamentos } from "@/features/apartamentos/hooks/useApartamentos";
import { ApartamentosIndicadores } from "@/features/apartamentos/components/ApartamentosIndicadores";
import { ApartamentosTabla } from "@/features/apartamentos/components/ApartamentosTabla";
import { CrearApartamentoModal } from "@/features/apartamentos/components/CrearApartamentoModal";
import { GenerarApartamentosModal } from "@/features/apartamentos/components/GenerarApartamentosModal";

export default function ApartamentosPage() {
  const sesion = useAdminSession();
  const a = useApartamentos(sesion.conjuntoId, sesion.loading);

  const [crearAbierto, setCrearAbierto] = useState(false);
  const [generarAbierto, setGenerarAbierto] = useState(false);

  return (
    <AdminPageShell
      sesion={sesion}
      active="apartamentos"
      loading={a.loading}
      titulo="Apartamentos"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <>
          <Button
            variant="outline"
            icon={<Layers className="w-4 h-4" />}
            onClick={() => setGenerarAbierto(true)}
            disabled={!a.conjuntoVacio}
            title={
              a.conjuntoVacio
                ? undefined
                : `Ya existen ${a.indicadores.total} apartamentos. La generación masiva solo está disponible en un conjunto vacío.`
            }
          >
            Generar masivamente
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCrearAbierto(true)}>
            Agregar apartamento
          </Button>
        </>
      }
    >
      {!a.conjuntoVacio && (
        <p className="flex items-start gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 -mt-4">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          La generación masiva numera siempre desde 1, por lo que solo está disponible mientras
          el conjunto no tenga apartamentos. Usa &ldquo;Agregar apartamento&rdquo; para añadir unidades sueltas.
        </p>
      )}

      {a.error && <Alert variant="danger">{a.error}</Alert>}

      <ApartamentosIndicadores {...a.indicadores} conjuntoNombre={sesion.conjuntoNombre} />

      <ApartamentosTabla tabla={a.tabla} filtro={a.filtro} onFiltroChange={a.cambiarFiltro} />

      <CrearApartamentoModal
        isOpen={crearAbierto}
        onClose={() => setCrearAbierto(false)}
        conjuntoNombre={sesion.conjuntoNombre}
        torres={a.torres}
        onCrear={a.crear}
      />

      <GenerarApartamentosModal
        isOpen={generarAbierto}
        onClose={() => setGenerarAbierto(false)}
        onGenerar={a.generar}
      />
    </AdminPageShell>
  );
}
