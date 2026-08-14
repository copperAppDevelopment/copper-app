'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Users, CreditCard, DollarSign, LayoutDashboard, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Acceso {
  label: string;
  icono: React.ReactNode;
  href: string | null;
}

const accesos: Acceso[] = [
  { label: "Ver apartamentos", icono: <Building2 className="w-4 h-4" />, href: "/admin/apartamentos" },
  { label: "Gestionar residentes", icono: <Users className="w-4 h-4" />, href: "/admin/residentes" },
  { label: "Gestionar recaudos", icono: <DollarSign className="w-4 h-4" />, href: "/admin/recaudos" },
  // Sin ruta todavía: se deja inerte, como estaba.
  { label: "Gestionar plan", icono: <CreditCard className="w-4 h-4" />, href: null },
];

export function AccesosRapidos() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-brand" />
            <span>Accesos Rápidos</span>
          </div>
        }
        className="shadow-sm"
      >
        <div className="grid grid-cols-2 gap-3">
          {accesos.map(a => (
            <Button
              key={a.label}
              variant="outline"
              onClick={() => a.href && router.push(a.href)}
              disabled={!a.href}
              className="h-28 flex flex-col items-center justify-center text-center gap-2 w-full"
            >
              <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                {a.icono}
              </div>
              <span className="font-semibold text-xs">{a.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      <Card title="Operaciones del Sistema" className="shadow-sm">
        <div className="space-y-3">
          {[
            {
              titulo: "Enviar Comunicado",
              descripcion: "Notifica a todos los residentes mediante push.",
            },
            {
              titulo: "Registrar Apartamento",
              descripcion: "Crea una nueva unidad y asocia propietarios.",
            },
          ].map(op => (
            <div
              key={op.titulo}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between text-zinc-800 dark:text-white"
            >
              <div>
                <h3 className="font-semibold text-xs text-left">{op.titulo}</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 text-left">
                  {op.descripcion}
                </p>
              </div>
              <Plus className="w-4 h-4 text-brand shrink-0" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
