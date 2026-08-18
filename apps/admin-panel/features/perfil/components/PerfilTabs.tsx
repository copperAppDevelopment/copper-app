'use client';

import * as React from "react";
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
