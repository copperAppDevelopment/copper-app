import * as React from "react";
import { Card } from "@/components/ui/card";

export interface ConjuntosKpisProps {
  total: number;
  activos: number;
  inactivos: number;
  residentes: number;
}

const CELDAS: { etiqueta: string; clave: keyof ConjuntosKpisProps; pie: string; color: string }[] = [
  { etiqueta: "Copropiedades", clave: "total", pie: "Registradas en la plataforma", color: "text-zinc-900 dark:text-white" },
  { etiqueta: "Con acceso", clave: "activos", pie: "Sus residentes pueden usar la app", color: "text-emerald-500" },
  { etiqueta: "Sin acceso", clave: "inactivos", pie: "Desactivadas o sin activar", color: "text-red-500" },
  { etiqueta: "Residentes", clave: "residentes", pie: "Activos en toda la plataforma", color: "text-zinc-900 dark:text-white" },
];

export function ConjuntosKpis(props: ConjuntosKpisProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {CELDAS.map(celda => (
        <Card key={celda.clave} className="shadow-sm">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
            {celda.etiqueta}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-extrabold ${celda.color}`}>{props[celda.clave]}</span>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">{celda.pie}</p>
        </Card>
      ))}
    </section>
  );
}
