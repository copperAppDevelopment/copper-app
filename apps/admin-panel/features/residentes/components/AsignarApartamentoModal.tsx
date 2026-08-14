'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import type { Residente } from "../types";

export interface AsignarApartamentoModalProps {
  /** El residente al que se asigna; `null` cierra el modal. */
  residente: Residente | null;
  onClose: () => void;
  opcionesApartamento: { value: string; label: string }[];
  onAsignar: (residenteId: string, apartamentoId: string) => Promise<void>;
}

export function AsignarApartamentoModal({
  residente, onClose, opcionesApartamento, onAsignar,
}: AsignarApartamentoModalProps) {
  const [apartamentoId, setApartamentoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Limpia la selección cada vez que se abre para otro residente.
  useEffect(() => {
    if (residente) { setApartamentoId(""); setError(""); }
  }, [residente]);

  const enviar = async () => {
    if (!residente) return;
    setLoading(true); setError("");
    try {
      await onAsignar(residente.residente_id, apartamentoId);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(residente)}
      title={residente?.activo ? "Asignar apartamento" : "Reasignar apartamento"}
      description={
        residente?.activo
          ? `Selecciona el apartamento donde vivirá ${residente?.nombre_completo?.trim() || "el residente"}.`
          : "Se creará un registro nuevo; el anterior se conserva como historial del apartamento."
      }
      onClose={onClose}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={enviar} loading={loading} disabled={!apartamentoId}>Asignar</Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Select
        id="asignar-apartamento"
        label="Apartamento"
        value={apartamentoId}
        onChange={(e) => setApartamentoId(e.target.value)}
        options={opcionesApartamento}
        helperText="Un apartamento puede alojar a varios residentes, así que los ocupados también son válidos."
      />
    </Modal>
  );
}
