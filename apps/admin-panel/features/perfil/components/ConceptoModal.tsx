'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { OPCIONES_TIPO_CALCULO, esProtegido } from "@/lib/conceptos";
import type { TipoCalculo } from "@/lib/conceptos";
import type { Concepto, DatosConcepto } from "../adminTypes";

const VACIO: DatosConcepto = {
  codigo: "", nombre: "", descripcion: "", valor: "",
  tipo_calculo: "fijo", porcentaje: "", aplica_descuento: false, es_recurrente: false,
};

export interface ConceptoModalProps {
  isOpen: boolean;
  concepto: Concepto | null;
  onClose: () => void;
  onGuardar: (datos: DatosConcepto, conceptoId?: string) => Promise<void>;
}

function Casilla({ id, label, checked, onChange, disabled, ayuda }: {
  id: string; label: string; checked: boolean;
  onChange: (v: boolean) => void; disabled?: boolean; ayuda?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand focus:ring-brand/30 cursor-pointer"
        />
        <span className="text-sm text-zinc-800 dark:text-zinc-100">{label}</span>
      </label>
      {ayuda && <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-6.5">{ayuda}</p>}
    </div>
  );
}

export function ConceptoModal({ isOpen, concepto, onClose, onGuardar }: ConceptoModalProps) {
  const [form, setForm] = useState<DatosConcepto>(VACIO);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(concepto ? {
      codigo: concepto.codigo,
      nombre: concepto.nombre,
      descripcion: concepto.descripcion ?? "",
      valor: concepto.valor != null ? String(concepto.valor) : "",
      tipo_calculo: (concepto.tipo_calculo as TipoCalculo) ?? "fijo",
      porcentaje: concepto.porcentaje != null ? String(Number(concepto.porcentaje) * 100) : "",
      aplica_descuento: concepto.aplica_descuento,
      es_recurrente: concepto.es_recurrente,
    } : VACIO);
  }, [isOpen, concepto]);

  const cambiar = <K extends keyof DatosConcepto>(campo: K, valor: DatosConcepto[K]) =>
    setForm(previo => ({ ...previo, [campo]: valor }));

  const guardar = async () => {
    setLoading(true);
    setError("");
    try {
      await onGuardar(form, concepto?.id);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const protegido = esProtegido(concepto?.codigo ?? null);
  const esFijo = form.tipo_calculo === "fijo";
  const generaCargos = esFijo && form.es_recurrente;

  return (
    <Modal
      isOpen={isOpen}
      title={concepto ? "Editar concepto" : "Nuevo concepto de cobro"}
      onClose={onClose}
      busy={loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={loading}
            disabled={!form.codigo.trim() || !form.nombre.trim()}
            icon={<Save className="w-4 h-4" />}
          >
            Guardar
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {protegido && (
        <Alert variant="info" title={`${concepto?.codigo} es un concepto estructural`}>
          Puedes cambiar su nombre y su valor, pero no su código: la generación mensual de cargos
          lo busca exactamente por ese nombre.
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="concepto-codigo"
          label="Código"
          placeholder="PARQUEADERO"
          value={form.codigo}
          onChange={(e) => cambiar("codigo", e.target.value.toUpperCase())}
          disabled={loading || protegido}
          helperText={protegido ? undefined : "Corto y en mayúsculas. Único por conjunto."}
        />
        <Input
          id="concepto-nombre"
          label="Nombre"
          placeholder="Cuota de parqueadero"
          value={form.nombre}
          onChange={(e) => cambiar("nombre", e.target.value)}
          disabled={loading}
        />
      </div>

      <Input
        id="concepto-descripcion"
        label="Descripción (opcional)"
        value={form.descripcion}
        onChange={(e) => cambiar("descripcion", e.target.value)}
        disabled={loading}
      />

      <Select
        id="concepto-tipo"
        label="Tipo de cálculo"
        value={form.tipo_calculo}
        onChange={(e) => cambiar("tipo_calculo", e.target.value as TipoCalculo)}
        options={OPCIONES_TIPO_CALCULO}
        disabled={loading || protegido}
      />

      {esFijo ? (
        <Input
          id="concepto-valor"
          type="number"
          min={0}
          label="Valor"
          value={form.valor}
          onChange={(e) => cambiar("valor", e.target.value)}
          disabled={loading}
        />
      ) : (
        <Input
          id="concepto-porcentaje"
          type="number"
          min={0}
          max={100}
          step="0.01"
          label="Porcentaje sobre el saldo"
          value={form.porcentaje}
          onChange={(e) => cambiar("porcentaje", e.target.value)}
          disabled={loading}
          helperText="Escribe 2 para un 2 %."
        />
      )}

      <Casilla
        id="concepto-recurrente"
        label="Se cobra todos los meses"
        checked={form.es_recurrente}
        onChange={(v) => cambiar("es_recurrente", v)}
        disabled={loading || protegido}
      />

      <Casilla
        id="concepto-descuento"
        label="Admite el descuento por pronto pago"
        checked={form.aplica_descuento}
        onChange={(v) => cambiar("aplica_descuento", v)}
        disabled={loading}
      />

      {generaCargos && (
        <Alert variant="warning" title="Este concepto entra en la facturación mensual">
          Al ser recurrente y de valor fijo, la generación automática le creará un cargo a
          <strong> todos los apartamentos</strong> del conjunto el día 1 de cada mes.
        </Alert>
      )}
    </Modal>
  );
}
