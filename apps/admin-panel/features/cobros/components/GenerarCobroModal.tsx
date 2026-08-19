'use client';

import * as React from "react";
import { Receipt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda } from "@/lib/formato";
import { useCrearCobro } from "../hooks/useCrearCobro";
import { opcionesPeriodo } from "../types";
import { ResumenCobro } from "./ResumenCobro";
import { CobrosGenerados } from "./CobrosGenerados";

export interface GenerarCobroModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoId: string;
  conjuntoNombre?: string;
}

const PERIODOS = opcionesPeriodo();

export function GenerarCobroModal({
  isOpen, onClose, conjuntoId, conjuntoNombre,
}: GenerarCobroModalProps) {
  const c = useCrearCobro(conjuntoId, isOpen);

  const cerrar = () => {
    c.reiniciar();
    onClose();
  };

  const enConfirmacion = c.pestana === "nuevo" && c.paso === "confirmacion";

  return (
    <Modal
      isOpen={isOpen}
      title="Cobros extras"
      description={conjuntoNombre}
      onClose={cerrar}
      busy={c.enviando}
      size="lg"
      footer={
        c.pestana === "generados" ? (
          <Button variant="outline" onClick={cerrar}>Cerrar</Button>
        ) : enConfirmacion ? (
          <>
            <Button variant="outline" onClick={() => c.setPaso("form")} disabled={c.enviando}>
              Volver
            </Button>
            <Button
              onClick={c.enviar}
              loading={c.enviando}
              disabled={c.cuantosApartamentos === 0}
              variant={c.avisos.length > 0 ? "danger" : "primary"}
              icon={<Receipt className="w-4 h-4" />}
            >
              Confirmar cobro
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={cerrar} disabled={c.enviando}>Cerrar</Button>
            <Button
              onClick={c.continuar}
              disabled={c.cargando}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continuar
            </Button>
          </>
        )
      }
    >
      <div role="tablist" className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 -mb-px">
        {([["nuevo", "Nuevo cobro"], ["generados", "Generados"]] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={c.pestana === id}
            onClick={() => c.setPestana(id)}
            disabled={c.enviando}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              c.pestana === id
                ? "border-brand text-brand"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {c.error && <Alert variant="danger">{c.error}</Alert>}

      {c.resultado && c.pestana === "nuevo" && (
        <Alert variant="success" title="Cobro generado">
          Se crearon {c.resultado.creados} de {c.resultado.apartamentos} cargos.
          {c.resultado.omitidos > 0 && (
            <> {c.resultado.omitidos} ya tenían este concepto en ese periodo y se omitieron.</>
          )}
          {" "}Los residentes no reciben notificación: publica un comunicado si quieres avisarles.
        </Alert>
      )}

      {c.pestana === "generados" ? (
        <CobrosGenerados c={c} />
      ) : c.cargando ? (
        <p className="text-sm text-zinc-500">Cargando conceptos y apartamentos…</p>
      ) : c.conceptos.length === 0 ? (
        <Alert variant="info">
          Este conjunto no tiene conceptos de cobro activos. Créalos desde Mi perfil →
          Configuración de administración.
        </Alert>
      ) : enConfirmacion ? (
        <ResumenCobro c={c} />
      ) : (
        <>
          <Select
            id="cobro-concepto"
            label="Concepto"
            value={c.form.concepto_codigo}
            onChange={(e) => c.cambiar("concepto_codigo", e.target.value)}
            disabled={c.enviando}
            options={c.opcionesConcepto}
          />

          <Select
            id="cobro-apartamento"
            label="Dirigido a"
            value={c.form.apartamento_id}
            onChange={(e) => c.cambiar("apartamento_id", e.target.value)}
            disabled={c.enviando}
            options={c.opcionesApartamento}
            helperText={`«Todo el conjunto» genera un cargo a cada uno de los ${c.apartamentos.length} apartamentos.`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="cobro-periodo"
              label="Periodo"
              value={c.form.periodo}
              onChange={(e) => c.cambiar("periodo", e.target.value)}
              disabled={c.enviando}
              options={PERIODOS}
            />

            <Input
              id="cobro-vencimiento"
              label="Vence el"
              type="date"
              value={c.form.fecha_vencimiento}
              onChange={(e) => c.cambiar("fecha_vencimiento", e.target.value)}
              disabled={c.enviando}
              helperText="Ordena en qué orden se aplican los pagos."
            />
          </div>

          <Input
            id="cobro-valor"
            label="Valor por apartamento"
            type="number"
            min={1}
            step={1}
            placeholder="50000"
            value={c.form.valor}
            onChange={(e) => c.cambiar("valor", e.target.value)}
            disabled={c.enviando}
            helperText={
              c.valorNumerico > 0
                ? `${formatoMoneda(c.valorNumerico)} · total ${formatoMoneda(c.total)}`
                : "Sin decimales."
            }
          />
        </>
      )}
    </Modal>
  );
}
