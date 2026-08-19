'use client';

import * as React from "react";
import { useState } from "react";
import { UserPlus, PackagePlus, Search, Clock, CheckCircle2, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useRecepcion } from "../hooks/useRecepcion";
import { RANGOS } from "../types";
import type { EnvioRecepcion } from "../types";
import { VisitasTabla } from "./VisitasTabla";
import { EnviosTabla } from "./EnviosTabla";
import { RegistrarVisitaModal } from "./RegistrarVisitaModal";
import { RegistrarEnvioModal } from "./RegistrarEnvioModal";
import { EntregarEnvioModal } from "./EntregarEnvioModal";

export interface RecepcionPanelProps {
  conjuntoId: string;
  /** «Hoy» en portería, una ventana más larga en administración. */
  rangoInicial?: string;
}

function Indicador({ icono, valor, etiqueta }: {
  icono: React.ReactNode;
  valor: number;
  etiqueta: string;
}) {
  return (
    <Card className="shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-brand">{icono}</span>
        <div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white leading-none">
            {valor}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-zinc-400">{etiqueta}</p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Contenido de la página de recepción, sin shell ni sidebar.
 *
 * Lo comparten `/admin/recepcion` y `/recepcion/dashboard`: solo cambia quién puede entrar
 * y el armazón que lo envuelve.
 */
export function RecepcionPanel({ conjuntoId, rangoInicial = "7" }: RecepcionPanelProps) {
  const r = useRecepcion(conjuntoId, rangoInicial);
  const [visitaAbierta, setVisitaAbierta] = useState(false);
  const [envioAbierto, setEnvioAbierto] = useState(false);
  const [porEntregar, setPorEntregar] = useState<EnvioRecepcion | null>(null);

  const esVisitas = r.pestana === "visitas";

  return (
    <div className="space-y-6">
      {r.error && <Alert variant="danger">{r.error}</Alert>}
      {r.exito && <Alert variant="success">{r.exito}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Indicador
          icono={<Clock className="w-5 h-5" />}
          valor={r.indicadores.visitasPendientes}
          etiqueta="Visitas por autorizar"
        />
        <Indicador
          icono={<CheckCircle2 className="w-5 h-5" />}
          valor={r.indicadores.visitasAprobadas}
          etiqueta="Visitas aprobadas"
        />
        <Indicador
          icono={<Package className="w-5 h-5" />}
          valor={r.indicadores.enviosPendientes}
          etiqueta="Paquetes por entregar"
        />
      </div>

      <Card
        className="shadow-sm"
        title={
          <div role="tablist" className="flex gap-1">
            {([["visitas", "Visitas"], ["envios", "Envíos"]] as const).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={r.pestana === id}
                onClick={() => r.setPestana(id)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                  r.pestana === id
                    ? "border-brand text-brand"
                    : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
        headerActions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisitaAbierta(true)}
              icon={<UserPlus className="w-3.5 h-3.5" />}
            >
              Visita
            </Button>
            <Button
              size="sm"
              onClick={() => setEnvioAbierto(true)}
              icon={<PackagePlus className="w-3.5 h-3.5" />}
            >
              Envío
            </Button>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            id="recepcion-buscar"
            placeholder={esVisitas ? "Buscar visitante o apartamento…" : "Buscar empresa o apartamento…"}
            value={r.filtro}
            onChange={(e) => r.cambiarFiltro(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <div className="sm:w-56 shrink-0">
            <Select
              id="recepcion-rango"
              value={r.rango}
              onChange={(e) => r.setRango(e.target.value)}
              options={RANGOS}
            />
          </div>
        </div>

        {r.loading ? (
          <p className="text-sm text-zinc-500 py-6">Cargando…</p>
        ) : esVisitas ? (
          <VisitasTabla r={r} />
        ) : (
          <EnviosTabla r={r} onEntregar={setPorEntregar} />
        )}
      </Card>

      <RegistrarVisitaModal
        isOpen={visitaAbierta}
        opcionesApartamento={r.opcionesApartamento}
        enviando={r.enviando}
        onClose={() => setVisitaAbierta(false)}
        onRegistrar={r.registrarVisita}
      />

      <RegistrarEnvioModal
        isOpen={envioAbierto}
        opcionesApartamento={r.opcionesApartamento}
        enviando={r.enviando}
        onClose={() => setEnvioAbierto(false)}
        onRegistrar={r.registrarEnvio}
      />

      <EntregarEnvioModal
        envio={porEntregar}
        enviando={r.enviando}
        onClose={() => setPorEntregar(null)}
        onEntregar={r.entregarEnvio}
      />
    </div>
  );
}
