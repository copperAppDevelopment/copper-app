'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatoMoneda } from "@/lib/formato";
import { PERIODOS, ETIQUETA_PERIODO, COLUMNA_PRECIO } from "@/lib/conjuntos";
import { SUBTIPOS_PLAN, MAX_PLANES_ACTIVOS } from "@/lib/planesData";
import type { PlanCompleto } from "@/lib/planesData";
import { PLAN_VACIO, planAFormulario } from "../api";
import type { DatosPlan } from "../api";

export interface PlanFormModalProps {
  isOpen: boolean;
  /** `null` para dar de alta. */
  plan: PlanCompleto | null;
  /** Ya hay tres activos: el plan nuevo nacerá inactivo. */
  cupoLleno: boolean;
  onClose: () => void;
  onGuardar: (datos: DatosPlan, planId?: string) => Promise<void>;
}

export function PlanFormModal({ isOpen, plan, cupoLleno, onClose, onGuardar }: PlanFormModalProps) {
  const [form, setForm] = useState<DatosPlan>(PLAN_VACIO);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(plan ? planAFormulario(plan) : PLAN_VACIO);
  }, [isOpen, plan]);

  const cambiar = <K extends keyof DatosPlan>(campo: K, valor: DatosPlan[K]) =>
    setForm(previo => ({ ...previo, [campo]: valor }));

  const guardar = async () => {
    setLoading(true);
    setError("");
    try {
      await onGuardar(form, plan?.id);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const residentes = Number(form.max_residentes);
  const completo =
    Boolean(form.nombre.trim()) &&
    Number.isInteger(residentes) &&
    residentes > 0 &&
    PERIODOS.every(p => {
      const valor = Number(form[COLUMNA_PRECIO[p] as keyof DatosPlan]);
      return Number.isFinite(valor) && valor >= 0 && String(form[COLUMNA_PRECIO[p] as keyof DatosPlan]).trim() !== "";
    });

  const periodosEnCero = PERIODOS.filter(p => Number(form[COLUMNA_PRECIO[p] as keyof DatosPlan]) === 0);

  return (
    <Modal
      isOpen={isOpen}
      title={plan ? `Editar ${plan.nombre}` : "Nuevo plan"}
      onClose={onClose}
      busy={loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={guardar} loading={loading} disabled={!completo} icon={<Save className="w-4 h-4" />}>
            Guardar
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {!plan && cupoLleno && (
        <Alert variant="info">
          Ya hay {MAX_PLANES_ACTIVOS} planes activos, que es lo que muestra la página de precios.
          El plan se creará inactivo; para publicarlo, desactiva otro primero.
        </Alert>
      )}

      <Input
        label="Nombre"
        value={form.nombre}
        onChange={e => cambiar("nombre", e.target.value)}
        helperText="Es el título de la tarjeta en la página de precios."
      />

      <Select
        label="Subtipo"
        value={form.subtipo}
        onChange={e => cambiar("subtipo", e.target.value)}
        options={SUBTIPOS_PLAN.map(s => ({ value: s, label: s }))}
        disabled={Boolean(plan)}
        helperText={
          plan
            ? "No se cambia al editar: es la etiqueta con la que ya se vendió."
            : "Los tres valores que acepta la base."
        }
      />

      <Input
        label="Descripción"
        value={form.descripcion}
        onChange={e => cambiar("descripcion", e.target.value)}
        maxLength={200}
        helperText="El subtítulo de la tarjeta. Puede quedar vacío."
      />

      <Input
        label="Tope de residentes"
        type="number"
        min="1"
        value={form.max_residentes}
        onChange={e => cambiar("max_residentes", e.target.value)}
        helperText="Alimenta el porcentaje de uso del plan en el dashboard de cada administrador."
      />

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Precios
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PERIODOS.map(periodo => {
            const campo = COLUMNA_PRECIO[periodo] as keyof DatosPlan;
            return (
              <Input
                key={periodo}
                label={ETIQUETA_PERIODO[periodo]}
                type="number"
                min="0"
                value={form[campo]}
                onChange={e => cambiar(campo, e.target.value)}
                helperText={formatoMoneda(Number(form[campo]) || 0)}
              />
            );
          })}
        </div>
      </div>

      {periodosEnCero.length > 0 && (
        <Alert variant="warning">
          {periodosEnCero.map(p => ETIQUETA_PERIODO[p]).join(", ")}
          {periodosEnCero.length === 1 ? " está" : " están"} en cero: el checkout de Wompi rechaza
          ese periodo, así que nadie podrá contratarlo ni renovarlo por ahí.
        </Alert>
      )}

      {plan && (
        <Alert variant="info">
          Los cambios se ven en la página de precios al recargarla, y afectan a las renovaciones
          futuras: las suscripciones ya cobradas conservan el precio que se les cobró.
        </Alert>
      )}
    </Modal>
  );
}
