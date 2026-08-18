'use client';

import * as React from "react";
import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TABS } from "../types";
import type { TabPerfil } from "../types";

export interface PerfilTabsProps {
  activa: TabPerfil;
  onCambiar: (tab: TabPerfil) => void;
}

export function PerfilTabs({ activa, onCambiar }: PerfilTabsProps) {
  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 -mb-px"
    >
      {TABS.map((tab) => {
        const seleccionada = tab.id === activa;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={seleccionada}
            onClick={() => onCambiar(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              seleccionada
                ? "border-brand text-brand"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Marcador de las cuatro pestañas que todavía no tienen contenido. */
export function TabProximamente({ titulo }: { titulo: string }) {
  return (
    <Card className="shadow-sm">
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Construction className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
        <div>
          <p className="font-semibold text-zinc-700 dark:text-zinc-200">{titulo}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Esta sección todavía está en construcción.
          </p>
        </div>
      </div>
    </Card>
  );
}
