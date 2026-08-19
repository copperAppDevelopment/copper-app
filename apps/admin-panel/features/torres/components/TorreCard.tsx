'use client';

import * as React from "react";
import { useState } from "react";
import { Building, ChevronDown, ChevronRight, Layers, Trash2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MAX_APTOS_PISO } from "@/lib/torres";
import * as api from "../api";
import type { TorreListado, PisoTorre } from "../types";

export interface TorreCardProps {
  torre: TorreListado;
  onAgregarPisos: () => void;
  onEliminar: () => void;
  onAjustarPiso: (torreId: string, pisoId: string, objetivo: number) => Promise<unknown>;
}

/** Una fila de piso, con su ajuste de apartamentos en línea. */
function FilaPiso({
  piso, torreId, onAjustar,
}: {
  piso: PisoTorre;
  torreId: string;
  onAjustar: (torreId: string, pisoId: string, objetivo: number) => Promise<unknown>;
}) {
  const [valor, setValor] = useState(String(piso.apartamentos));
  const [guardando, setGuardando] = useState(false);

  const objetivo = Number(valor);
  const cambiado = objetivo !== piso.apartamentos;
  const valido = Number.isInteger(objetivo) && objetivo >= 0 && objetivo <= MAX_APTOS_PISO;

  const aplicar = async () => {
    setGuardando(true);
    try {
      await onAjustar(torreId, piso.id, objetivo);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <p className="text-sm text-zinc-800 dark:text-zinc-100">Piso {piso.piso}</p>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={MAX_APTOS_PISO}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          disabled={guardando}
          aria-label={`Apartamentos del piso ${piso.piso}`}
          className="w-16 text-sm text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100"
        />
        <span className="text-xs text-zinc-400 w-16">apartamentos</span>

        <Button
          variant={cambiado ? "primary" : "ghost"}
          size="sm"
          onClick={aplicar}
          loading={guardando}
          disabled={!cambiado || !valido}
          icon={<Check className="w-3.5 h-3.5" />}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}

export function TorreCard({ torre, onAgregarPisos, onEliminar, onAjustarPiso }: TorreCardProps) {
  const [abierta, setAbierta] = useState(false);
  const [pisos, setPisos] = useState<PisoTorre[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarPisos = async () => {
    setCargando(true);
    try {
      setPisos(await api.listarPisos(torre.id));
    } finally {
      setCargando(false);
    }
  };

  const alternar = async () => {
    const abrir = !abierta;
    setAbierta(abrir);
    if (abrir) await cargarPisos();
  };

  const ajustar = async (torreId: string, pisoId: string, objetivo: number) => {
    const resultado = await onAjustarPiso(torreId, pisoId, objetivo);
    await cargarPisos();
    return resultado;
  };

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={alternar}
            aria-expanded={abierta}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
          >
            {abierta
              ? <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
              : <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />}
            <Building className="w-5 h-5 text-brand shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-zinc-900 dark:text-white truncate">
                {torre.nombre_torre}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {torre.pisos ?? 0} pisos · {torre.total_apartamentos} apartamentos
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {torre.prefijo && (
              <Badge variant="brand">
                <span className="font-mono">{torre.prefijo}-101</span>
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onAgregarPisos}
              icon={<Layers className="w-3.5 h-3.5" />}
            >
              Añadir pisos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEliminar}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Eliminar
            </Button>
          </div>
        </div>

        {abierta && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-2">
            {cargando ? (
              <p className="text-sm text-zinc-500 py-3">Cargando pisos…</p>
            ) : pisos.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 py-3">
                Esta torre no tiene pisos registrados.
              </p>
            ) : (
              <>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {pisos.map(piso => (
                    <FilaPiso
                      key={piso.id}
                      piso={piso}
                      torreId={torre.id}
                      onAjustar={ajustar}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pt-2">
                  Al reducir un piso solo se retiran apartamentos vacíos. Los que tengan
                  residentes, cargos o recaudos bloquean el cambio.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
