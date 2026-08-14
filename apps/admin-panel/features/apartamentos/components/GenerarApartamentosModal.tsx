'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";

export interface GenerarApartamentosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerar: (payload: { prefijo: string; cantidad: number; direccion_base: string }) => Promise<void>;
}

export function GenerarApartamentosModal({ isOpen, onClose, onGenerar }: GenerarApartamentosModalProps) {
  const [prefijo, setPrefijo] = useState("Apto");
  const [cantidad, setCantidad] = useState("");
  const [direccionBase, setDireccionBase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cerrar = () => {
    setCantidad(""); setDireccionBase(""); setError("");
    onClose();
  };

  const enviar = async () => {
    setLoading(true);
    setError("");
    try {
      await onGenerar({ prefijo, cantidad: Number(cantidad), direccion_base: direccionBase });
      cerrar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Generar apartamentos masivamente"
      description="Crea de una vez todas las unidades de un conjunto sin torres, numeradas desde 1."
      onClose={cerrar}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={loading}>Cancelar</Button>
          <Button onClick={enviar} loading={loading}>Generar</Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Alert variant="warning" title="Esta operación no se puede deshacer">
        No existe una acción para revertir la generación. Revisa la cantidad antes de continuar.
      </Alert>

      <Input
        id="gen-prefijo"
        label="Prefijo"
        placeholder="Apto"
        value={prefijo}
        onChange={(e) => setPrefijo(e.target.value)}
        helperText="Se usa en la dirección de cada unidad. Ej. «Apto 1», «Apto 2»…"
      />

      <Input
        id="gen-cantidad"
        label="Cantidad"
        type="number"
        min={1}
        max={500}
        placeholder="Ej. 48"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        helperText="Entre 1 y 500. Se numerarán del 1 al total indicado."
      />

      <Input
        id="gen-direccion-base"
        label="Dirección base (opcional)"
        placeholder="Ej. Calle 45 #12-30"
        value={direccionBase}
        onChange={(e) => setDireccionBase(e.target.value)}
        helperText="Si la indicas, la dirección quedará como «dirección base - prefijo N»."
      />
    </Modal>
  );
}
