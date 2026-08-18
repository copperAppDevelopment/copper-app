'use client';

import * as React from "react";
import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoFecha } from "@/lib/formato";
import { etiquetaMiembro, varianteMiembro } from "@/lib/equipo";
import { useEquipo } from "../hooks/useEquipo";
import { InvitarMiembroModal } from "./InvitarMiembroModal";
import type { MiembroEquipo } from "../conjuntosTypes";

export function TabEquipo({ conjuntoId }: { conjuntoId: string }) {
  const e = useEquipo(conjuntoId);
  const [invitarAbierto, setInvitarAbierto] = useState(false);
  const [porQuitar, setPorQuitar] = useState<MiembroEquipo | null>(null);
  const [quitando, setQuitando] = useState(false);

  if (e.loading) {
    return <Card className="shadow-sm"><p className="text-sm text-zinc-500">Cargando…</p></Card>;
  }

  const quitar = async () => {
    if (!porQuitar) return;
    setQuitando(true);
    try {
      await e.remover(porQuitar.id);
      setPorQuitar(null);
    } catch (err: any) {
      e.setError(err.message);
    } finally {
      setQuitando(false);
    }
  };

  return (
    <div className="space-y-6">
      {e.error && <Alert variant="danger">{e.error}</Alert>}

      <Card
        title={
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            <span>Equipo del conjunto</span>
          </div>
        }
        subtitle="Quienes tienen acceso al panel de este conjunto."
        headerActions={
          <Button size="sm" onClick={() => setInvitarAbierto(true)} icon={<UserPlus className="w-3.5 h-3.5" />}>
            Invitar
          </Button>
        }
        className="shadow-sm"
      >
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {e.miembros.map((m) => {
            const nombre = [m.nombres, m.apellidos].filter(Boolean).join(" ") || "Sin nombre";
            return (
              <div key={m.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {nombre}
                    </p>
                    <Badge variant={varianteMiembro(m.rol, m.es_propietario)}>
                      {etiquetaMiembro(m.rol, m.es_propietario)}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {m.email}
                    {m.fecha_asignacion && ` · desde ${formatoFecha(m.fecha_asignacion)}`}
                  </p>
                </div>

                {/* Al propietario no se le puede quitar: dejaría el conjunto sin dueño. */}
                {!m.es_propietario && (
                  <Button variant="ghost" size="sm" onClick={() => setPorQuitar(m)}>
                    Quitar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <InvitarMiembroModal
        isOpen={invitarAbierto}
        onClose={() => setInvitarAbierto(false)}
        onInvitar={e.invitar}
        onVincular={e.vincular}
      />

      <ConfirmDialog
        isOpen={Boolean(porQuitar)}
        title="¿Quitar del equipo?"
        description={`${[porQuitar?.nombres, porQuitar?.apellidos].filter(Boolean).join(" ") || porQuitar?.email} perderá el acceso al panel de este conjunto. Su cuenta no se elimina y puedes volver a añadirlo cuando quieras.`}
        confirmText="Quitar"
        cancelText="Cancelar"
        onConfirm={quitar}
        onCancel={() => setPorQuitar(null)}
        variant="danger"
        loading={quitando}
      />
    </div>
  );
}
