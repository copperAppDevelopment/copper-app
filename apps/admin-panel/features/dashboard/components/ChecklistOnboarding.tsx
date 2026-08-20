'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { KpisAdmin, PendientesConjunto } from "../types";

export interface ChecklistOnboardingProps {
  kpis: KpisAdmin | null;
  pendientes: PendientesConjunto | null;
}

interface Tarea {
  titulo: string;
  detalle: string;
  hecha: boolean;
  href: string;
}

/**
 * Lo que le falta al conjunto para funcionar.
 *
 * Desaparece entera cuando están todas hechas: es una guía para quien acaba de registrarse, no
 * un elemento permanente del dashboard.
 */
export function ChecklistOnboarding({ kpis, pendientes }: ChecklistOnboardingProps) {
  const router = useRouter();

  if (!pendientes) return null;

  const apartamentos = Number(kpis?.total_apartamentos ?? 0);
  const residentes = Number(kpis?.total_residentes ?? 0);

  const tareas: Tarea[] = [
    {
      titulo: "Activar el conjunto",
      detalle: "Mientras el pago no se apruebe, tus residentes no pueden usar la app.",
      hecha: pendientes.activo,
      href: "/admin/conjuntos",
    },
    {
      titulo: pendientes.tieneTorres ? "Crear las torres y sus apartamentos" : "Crear los apartamentos",
      detalle: "Sin apartamentos no hay a quién cobrarle ni a quién registrar.",
      hecha: apartamentos > 0,
      href: pendientes.tieneTorres ? "/admin/torres" : "/admin/apartamentos",
    },
    {
      titulo: "Fijar la cuota de administración",
      detalle: "Nace en cero, y con cero la facturación mensual no genera nada.",
      hecha: pendientes.cuotaDefinida,
      href: "/admin/perfil",
    },
    {
      titulo: "Invitar a los residentes",
      detalle: "Cada residente entra a la app con su propia cuenta.",
      hecha: residentes > 0,
      href: "/admin/residentes",
    },
  ];

  const faltan = tareas.filter(t => !t.hecha);
  if (faltan.length === 0) return null;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-brand" />
          <span>Termina de montar tu conjunto</span>
        </div>
      }
      subtitle={`Te faltan ${faltan.length} de ${tareas.length} pasos`}
      className="shadow-sm border-brand/30"
    >
      <div className="space-y-2">
        {tareas.map(tarea => (
          <div
            key={tarea.titulo}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              tarea.hecha
                ? "border-transparent opacity-60"
                : "border-zinc-200 dark:border-zinc-800 hover:border-brand/40"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                tarea.hecha
                  ? "bg-emerald-500 text-white"
                  : "border-2 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {tarea.hecha && <Check className="w-3.5 h-3.5" />}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  tarea.hecha
                    ? "text-zinc-500 dark:text-zinc-400 line-through"
                    : "text-zinc-900 dark:text-white"
                }`}
              >
                {tarea.titulo}
              </p>
              {!tarea.hecha && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{tarea.detalle}</p>
              )}
            </div>

            {!tarea.hecha && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(tarea.href)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Ir
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
