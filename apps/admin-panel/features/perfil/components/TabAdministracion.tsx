'use client';

import * as React from "react";
import { useState } from "react";
import { Plus, Receipt, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda } from "@/lib/formato";
import { ETIQUETA_TIPO_CALCULO, esProtegido } from "@/lib/conceptos";
import type { TipoCalculo } from "@/lib/conceptos";
import { useConfiguracionAdmin } from "../hooks/useConfiguracionAdmin";
import { ConceptoModal } from "./ConceptoModal";
import { ConfiguracionPagoForm } from "./ConfiguracionPagoForm";
import { AvisosCobroCard } from "./AvisosCobroCard";
import type { Concepto } from "../adminTypes";

export function TabAdministracion({ conjuntoId }: { conjuntoId: string }) {
  const c = useConfiguracionAdmin(conjuntoId);
  const [enEdicion, setEnEdicion] = useState<Concepto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  if (c.loading) {
    return <Card className="shadow-sm"><p className="text-sm text-zinc-500">Cargando…</p></Card>;
  }

  const abrir = (concepto: Concepto | null) => {
    setEnEdicion(concepto);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-6">
      {c.error && <Alert variant="danger">{c.error}</Alert>}
      {c.exito && <Alert variant="success">{c.exito}</Alert>}

      <Card
        title={
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand" />
            <span>Conceptos de cobro</span>
          </div>
        }
        subtitle="Lo que se le factura a cada apartamento."
        headerActions={
          <Button size="sm" onClick={() => abrir(null)} icon={<Plus className="w-3.5 h-3.5" />}>
            Nuevo
          </Button>
        }
        className="shadow-sm"
      >
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {c.conceptos.map((concepto) => {
            const protegido = esProtegido(concepto.codigo);
            const esFijo = concepto.tipo_calculo === "fijo";

            return (
              <div
                key={concepto.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      {concepto.codigo}
                    </span>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {concepto.nombre}
                    </p>
                    {protegido && (
                      <Badge variant="brand">
                        <Lock className="w-2.5 h-2.5 mr-1" />
                        Estructural
                      </Badge>
                    )}
                    {concepto.es_recurrente && <Badge variant="info">Mensual</Badge>}
                    {!concepto.activo && <Badge variant="neutral">Inactivo</Badge>}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ETIQUETA_TIPO_CALCULO[concepto.tipo_calculo as TipoCalculo]}
                    {" · "}
                    {esFijo
                      ? formatoMoneda(concepto.valor)
                      : `${Number(concepto.porcentaje ?? 0) * 100} %`}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => abrir(concepto)}>
                    Editar
                  </Button>
                  {/* La base rechaza desactivar ADMIN y MORA: ni se ofrece. */}
                  {!protegido && (
                    <Button variant="ghost" size="sm" onClick={() => c.alternarConcepto(concepto)}>
                      {concepto.activo ? "Desactivar" : "Activar"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <ConfiguracionPagoForm
        form={c.form}
        guardando={c.guardando}
        onCambiar={c.cambiar}
        onGuardar={c.guardarConfig}
      />

      {/* Después del formulario: el calendario depende del pronto pago que se configura arriba. */}
      <AvisosCobroCard
        prontoPagoHabilitado={c.form.pronto_pago_habilitado}
        prontoPagoDias={c.form.pronto_pago_dias}
      />

      <ConceptoModal
        isOpen={modalAbierto}
        concepto={enEdicion}
        onClose={() => setModalAbierto(false)}
        onGuardar={c.guardarConcepto}
      />
    </div>
  );
}
