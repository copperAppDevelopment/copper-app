'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda } from "@/lib/formato";
import { etiquetaApartamento, pudoGenerarMora, MINIMO_MOTIVO } from "../types";
import type { Cargo } from "../types";

export interface CondonarCargoModalProps {
  /** El cargo a condonar; `null` mantiene el modal cerrado. */
  cargo: Cargo | null;
  onClose: () => void;
  /** Debe lanzar si falla: el error se muestra aquí, junto al formulario. */
  onCondonar: (cargoId: string, motivo: string) => Promise<void>;
}

/**
 * Confirma una condonación y recoge su motivo.
 *
 * Enseña las tres cifras antes de confirmar —valor, lo ya pagado y lo que se perdona— porque
 * «condonar» no borra el cargo ni devuelve dinero: solo deja de cobrarse lo que falta.
 */
export function CondonarCargoModal({ cargo, onClose, onCondonar }: CondonarCargoModalProps) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Cada cargo empieza con el formulario limpio: el motivo de uno no sirve para otro.
  useEffect(() => {
    setMotivo("");
    setError("");
  }, [cargo?.id]);

  if (!cargo) return null;

  const pagado = Number(cargo.pagado) + Number(cargo.descuento_aplicado);
  const faltan = MINIMO_MOTIVO - motivo.trim().length;

  const confirmar = async () => {
    setEnviando(true);
    setError("");
    try {
      await onCondonar(cargo.id, motivo.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "No se pudo condonar el cargo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      isOpen
      title="Condonar cargo"
      description={`${etiquetaApartamento(cargo)} · ${cargo.concepto_nombre} · ${cargo.periodo}`}
      onClose={onClose}
      busy={enviando}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={enviando}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={confirmar}
            loading={enviando}
            disabled={faltan > 0}
            icon={<Ban className="w-4 h-4" />}
          >
            Condonar {formatoMoneda(cargo.saldo)}
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <dl className="rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
        <div className="flex justify-between px-4 py-2.5">
          <dt className="text-zinc-500 dark:text-zinc-400">Valor del cargo</dt>
          <dd className="font-semibold text-zinc-900 dark:text-white">{formatoMoneda(cargo.valor_final)}</dd>
        </div>
        <div className="flex justify-between px-4 py-2.5">
          <dt className="text-zinc-500 dark:text-zinc-400">Ya pagado</dt>
          <dd className="font-semibold text-emerald-600 dark:text-emerald-400">{formatoMoneda(pagado)}</dd>
        </div>
        <div className="flex justify-between px-4 py-2.5">
          <dt className="text-zinc-500 dark:text-zinc-400">Se condona</dt>
          <dd className="font-extrabold text-red-600 dark:text-red-400">{formatoMoneda(cargo.saldo)}</dd>
        </div>
      </dl>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        El cargo no se borra: sigue en el estado de cuenta del residente, junto a un movimiento que
        lo anula.{pagado > 0 && " Lo que ya se pagó se conserva como pago."} Puedes reactivarlo
        después.
      </p>

      {pudoGenerarMora(cargo) && (
        <Alert variant="info">
          Este cargo es de un mes ya cerrado, así que pudo generar intereses de mora en los meses
          siguientes. Condonarlo no los recalcula: si el acuerdo los incluye, condónalos también.
        </Alert>
      )}

      <div className="space-y-1">
        <label
          htmlFor="condonar-motivo"
          className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
        >
          Motivo
        </label>
        <textarea
          id="condonar-motivo"
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          disabled={enviando}
          placeholder="El acuerdo al que se llegó: qué se pactó, con quién y cuándo."
          className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y"
        />
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {faltan > 0
            ? `Queda en el historial del cargo. Faltan ${faltan} caracteres.`
            : "Queda en el historial del cargo, con tu nombre y la fecha."}
        </p>
      </div>
    </Modal>
  );
}
