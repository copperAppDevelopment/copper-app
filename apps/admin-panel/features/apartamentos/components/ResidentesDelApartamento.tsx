import * as React from "react";
import { Building2, Users, History, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { nombreCompleto } from "@/lib/formato";
import type { ResidenteApt } from "../types";

function Fila({ r }: { r: ResidenteApt }) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
          {nombreCompleto(r.users)}
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
          {r.users?.email || "Sin correo"}
          {r.users?.phone_number ? ` · ${r.users.phone_number}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {r.ano_ingreso && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">desde {r.ano_ingreso}</span>
        )}
        <Badge variant={r.activo ? "success" : "neutral"}>{r.activo ? "Activo" : "Inactivo"}</Badge>
      </div>
    </div>
  );
}

export function ResidentesDelApartamento({ residentes }: { residentes: ResidenteApt[] }) {
  const actuales = residentes.filter(r => r.activo);
  const historicos = residentes.filter(r => !r.activo);

  const contador = (n: number) => (
    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
      {n}
    </span>
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            <span>Residentes actuales</span>
          </div>
        }
        headerActions={contador(actuales.length)}
        className="shadow-sm"
      >
        {actuales.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-zinc-500 dark:text-zinc-400">
            <UserX className="w-6 h-6" />
            <p className="text-sm font-semibold">Nadie vive actualmente aquí</p>
          </div>
        ) : (
          <div className="space-y-2">
            {actuales.map(r => <Fila key={r.id} r={r} />)}
          </div>
        )}
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand" />
            <span>Residentes anteriores</span>
          </div>
        }
        headerActions={contador(historicos.length)}
        className="shadow-sm"
      >
        {historicos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-zinc-500 dark:text-zinc-400">
            <Building2 className="w-6 h-6" />
            <p className="text-sm font-semibold">Sin residentes anteriores</p>
            <p className="text-[11px] max-w-xs text-center">
              Solo aparecen aquí quienes fueron desactivados en este apartamento.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {historicos.map(r => <Fila key={r.id} r={r} />)}
          </div>
        )}
      </Card>
    </section>
  );
}
