'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { periodoActual } from "../utils";
import type { NuevoRecaudo } from "../types";

export interface CrearRecaudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoNombre: string;
  opcionesApartamento: { value: string; label: string }[];
  onCrear: (payload: NuevoRecaudo) => Promise<void>;
}

export function CrearRecaudoModal({
  isOpen, onClose, conjuntoNombre, opcionesApartamento, onCrear,
}: CrearRecaudoModalProps) {
  const [apartamentoId, setApartamentoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaAplicacion, setFechaAplicacion] = useState("");
  const [valor, setValor] = useState("");
  const [origen, setOrigen] = useState("");
  const [tipo, setTipo] = useState("");
  const [periodo, setPeriodo] = useState(periodoActual());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cerrar = () => {
    setApartamentoId(""); setFecha(""); setFechaAplicacion("");
    setValor(""); setOrigen(""); setTipo(""); setError("");
    onClose();
  };

  const enviar = async () => {
    setLoading(true); setError("");
    try {
      await onCrear({
        apartamento_id: apartamentoId,
        fecha,
        fecha_aplicacion: fechaAplicacion || fecha,
        valor_total: Number(valor),
        origen,
        tipo_recaudo_origen: tipo,
        periodo,
      });
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
      title="Cargar recaudo"
      description={`Se registrará en ${conjuntoNombre} y se aplicará a los cargos pendientes del apartamento.`}
      onClose={cerrar}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={loading}>Cancelar</Button>
          <Button onClick={enviar} loading={loading}>Registrar</Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Select
        id="nuevo-apartamento"
        label="Apartamento"
        value={apartamentoId}
        onChange={(e) => setApartamentoId(e.target.value)}
        options={opcionesApartamento}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="nueva-fecha"
          label="Fecha del pago"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <Input
          id="nueva-fecha-aplicacion"
          label="Fecha de aplicación"
          type="date"
          value={fechaAplicacion}
          onChange={(e) => setFechaAplicacion(e.target.value)}
          helperText="Si la dejas vacía se usa la del pago."
        />
      </div>

      <Input
        id="nuevo-valor"
        label="Valor total"
        type="number"
        min={1}
        placeholder="0"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="nuevo-origen"
          label="Origen (opcional)"
          placeholder="Ej. 619"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />
        <Input
          id="nuevo-tipo"
          label="Tipo de origen (opcional)"
          placeholder="Ej. CAN"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
      </div>

      <Input
        id="nuevo-periodo"
        label="Periodo"
        placeholder="2026/6"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
        helperText="Formato AAAA/M, como lo usa el banco. Es distinto del AAAA-MM de los cargos."
      />
    </Modal>
  );
}
