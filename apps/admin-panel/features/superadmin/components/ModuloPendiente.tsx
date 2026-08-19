import * as React from "react";
import { Hammer } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Marcador de las rutas del SuperAdmin que todavía no tienen módulo.
 *
 * Existen para que los accesos rápidos del dashboard naveguen a algo en vez de dar 404 y para
 * que el sidebar pueda marcar la sección activa.
 */
export function ModuloPendiente({ descripcion }: { descripcion: string }) {
  return (
    <Card className="shadow-sm">
      <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center">
          <Hammer className="w-6 h-6" />
        </div>
        <p className="font-bold text-zinc-900 dark:text-white">Módulo en construcción</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">{descripcion}</p>
      </div>
    </Card>
  );
}
