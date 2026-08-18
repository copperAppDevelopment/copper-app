import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { formatoFecha } from "@/lib/formato";
import { etiquetaEstado, varianteEstado } from "@/lib/solicitudes";
import type { Solicitud } from "../types";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {etiqueta}
      </p>
      <p className="text-sm text-zinc-800 dark:text-zinc-100">{valor || "—"}</p>
    </div>
  );
}

/** Lo que radicó el residente: solo lectura, el administrador no lo edita. */
export function DatosSolicitud({ solicitud }: { solicitud: Solicitud }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-zinc-900 dark:text-white">{solicitud.titulo}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {solicitud.tipo_solicitud} · radicada el {formatoFecha(solicitud.fecha_solicitud)}
          </p>
        </div>
        <Badge variant={varianteEstado(solicitud.estado_solicitud)}>
          {etiquetaEstado(solicitud.estado_solicitud)}
        </Badge>
      </div>

      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
        {solicitud.descripcion}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        <Dato
          etiqueta="Residente"
          valor={
            <>
              {solicitud.nombre_residente}
              {solicitud.numero_apartamento && (
                <span className="text-zinc-500 dark:text-zinc-400">
                  {" "}· Apto {solicitud.numero_apartamento}
                </span>
              )}
            </>
          }
        />
        <Dato etiqueta="Contacto" valor={solicitud.phone_number || solicitud.email} />
        <Dato etiqueta="Ubicación" valor={solicitud.ubicacion} />
        <Dato
          etiqueta="Fecha preferida"
          valor={
            solicitud.fecha_preferida_residente
              ? formatoFecha(solicitud.fecha_preferida_residente)
              : "Sin preferencia"
          }
        />
      </div>
    </div>
  );
}
