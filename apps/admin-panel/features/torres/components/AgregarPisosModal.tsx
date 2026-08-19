'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { MAX_PISOS, MAX_APTOS_PISO, numeroApartamento } from "@/lib/torres";
import type { TorreListado } from "../types";

export interface AgregarPisosModalProps {
  isOpen: boolean;
  torre: TorreListado | null;
  onClose: () => void;
  onAgregar: (torreId: string, pisos: number, aptosPorPiso: number) => Promise<void>;
}

export function AgregarPisosModal({ isOpen, torre, onClose, onAgregar }: AgregarPisosModalProps) {
  const [pisos, setPisos] = useState("");
  const [aptos, setAptos] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !torre) return;
    setPisos("");
    // Por defecto, los mismos por piso que ya tiene la torre.
    setAptos(torre.aptos_por_piso ? String(torre.aptos_por_piso) : "");
    setError("");
  }, [isOpen, torre]);

  const numPisos = Number(pisos);
  const numAptos = Number(aptos);
  const desde = (torre?.pisos ?? 0) + 1;

  const valido =
    Number.isInteger(numPisos) && numPisos >= 1 &&
    Number.isInteger(numAptos) && numAptos >= 1 && numAptos <= MAX_APTOS_PISO &&
    desde + numPisos - 1 <= MAX_PISOS;

  const guardar = async () => {
    if (!torre) return;
    setLoading(true);
    setError("");
    try {
      await onAgregar(torre.id, numPisos, numAptos);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Añadir pisos a ${torre?.nombre_torre ?? ""}`}
      description="Los pisos nuevos se añaden encima de los que ya existen; los actuales no se tocan."
      onClose={onClose}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={loading}
            disabled={!valido}
            icon={<Layers className="w-4 h-4" />}
          >
            Añadir
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="pisos-nuevos"
          label="Pisos a añadir"
          type="number"
          min={1}
          value={pisos}
          onChange={(e) => setPisos(e.target.value)}
          disabled={loading}
          helperText={`Empezarían en el piso ${desde}.`}
        />

        <Input
          id="pisos-nuevos-aptos"
          label="Apartamentos por piso"
          type="number"
          min={1}
          max={MAX_APTOS_PISO}
          value={aptos}
          onChange={(e) => setAptos(e.target.value)}
          disabled={loading}
        />
      </div>

      {valido && torre?.prefijo && (
        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-850 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Se crearán {numPisos * numAptos} apartamentos
          </p>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
            {numeroApartamento(torre.prefijo, desde, 1)} …{" "}
            {numeroApartamento(torre.prefijo, desde + numPisos - 1, numAptos)}
          </p>
        </div>
      )}
    </Modal>
  );
}
