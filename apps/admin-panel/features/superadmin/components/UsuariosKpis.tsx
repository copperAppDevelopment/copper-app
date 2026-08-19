import * as React from "react";
import { Card } from "@/components/ui/card";

export interface UsuariosKpisProps {
  total: number;
  activos: number;
  vetados: number;
  sinConjunto: number;
}

const CELDAS: { etiqueta: string; clave: keyof UsuariosKpisProps; pie: string; color: string }[] = [
  { etiqueta: "Administradores", clave: "total", pie: "Usuarios con rol de administrador", color: "text-zinc-900 dark:text-white" },
  { etiqueta: "Con acceso", clave: "activos", pie: "Pueden entrar al panel", color: "text-emerald-500" },
  { etiqueta: "Vetados", clave: "vetados", pie: "Bloqueados desde aquí", color: "text-red-500" },
  { etiqueta: "Sin conjuntos", clave: "sinConjunto", pie: "No administran ninguno", color: "text-amber-500" },
];

export function UsuariosKpis(props: UsuariosKpisProps) {
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
