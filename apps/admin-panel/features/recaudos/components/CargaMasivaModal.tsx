'use client';

import * as React from "react";
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { ResultadoCargaPanel } from "./ResultadoCargaPanel";
import { periodoActual } from "../utils";
import type { ResultadoCarga } from "../types";

export interface CargaMasivaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Resultado a mostrar; si viene, el modal pasa a modo informe. */
  resultado: ResultadoCarga | null;
  cargaId: string | null;
  onCargar: (archivo: File, periodo: string) => Promise<void>;
  onReintentar: (cargaId: string) => Promise<void>;
  onAplicar: (recaudoId: string) => void;
  aplicandoId: string | null;
  error: string;
  loading: boolean;
}

export function CargaMasivaModal({
  isOpen, onClose, resultado, cargaId,
  onCargar, onReintentar, onAplicar, aplicandoId, error, loading,
}: CargaMasivaModalProps) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [periodo, setPeriodo] = useState(periodoActual());

  const cerrar = () => {
    setArchivo(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Carga masiva de recaudos"
      description="Sube el informe «Recaudos Días Anteriores» tal como lo exporta el banco, sin modificarlo."
      onClose={cerrar}
      busy={loading}
      size="lg"
      footer={
        resultado ? (
          <>
            <Button variant="outline" onClick={cerrar}>Cerrar</Button>
            {cargaId && (
              <Button
                onClick={() => onReintentar(cargaId)}
                loading={loading}
                icon={<RotateCw className="w-4 h-4" />}
              >
                Reintentar
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" onClick={cerrar} disabled={loading}>Cancelar</Button>
            <Button
              onClick={() => archivo && onCargar(archivo, periodo)}
              loading={loading}
              disabled={!archivo}
            >
              Subir y procesar
            </Button>
          </>
        )
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {!resultado && (
        <>
          <div className="space-y-1">
            <label
              htmlFor="archivo-csv"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Archivo CSV
            </label>
            <input
              id="archivo-csv"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-800 dark:text-zinc-100 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand cursor-pointer"
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Máximo 10 MB. El formato de columnas debe ser el original del banco.
            </p>
          </div>

          <Input
            id="cargar-periodo"
            label="Periodo"
            placeholder="2026/6"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            helperText="Se guarda en cada recaudo del archivo."
          />

          <Alert variant="info" title="Reintentar es seguro">
            Si vuelves a subir el mismo archivo, las filas que ya existen se omiten y solo entran
            las que faltaban.
          </Alert>
        </>
      )}

      {resultado && (
        <ResultadoCargaPanel
          resultado={resultado}
          onAplicar={onAplicar}
          aplicandoId={aplicandoId}
        />
      )}
    </Modal>
  );
}
