import * as React from "react";
import { Card } from "@/components/ui/card";

export interface ContactosKpisProps {
  total: number;
  Pendiente: number;
  Atendida: number;
  Rechazada: number;
}

const CELDAS: { etiqueta: string; clave: keyof ContactosKpisProps; pie: string; color: string }[] = [
  { etiqueta: "Solicitudes", clave: "total", pie: "Recibidas desde la página web", color: "text-zinc-900 dark:text-white" },
  { etiqueta: "Pendientes", clave: "Pendiente", pie: "Sin responder todavía", color: "text-amber-500" },
  { etiqueta: "Atendidas", clave: "Atendida", pie: "Ya gestionadas", color: "text-emerald-500" },
  { etiqueta: "Rechazadas", clave: "Rechazada", pie: "Descartadas o spam", color: "text-red-500" },
];

export function ContactosKpis(props: ContactosKpisProps) {
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
