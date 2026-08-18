'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTorres } from "@/features/torres/hooks/useTorres";
import { TorreCard } from "@/features/torres/components/TorreCard";
import { CrearTorreModal } from "@/features/torres/components/CrearTorreModal";
import { AgregarPisosModal } from "@/features/torres/components/AgregarPisosModal";
import type { TorreListado } from "@/features/torres/types";

export default function TorresPage() {
  const sesion = useAdminSession();
  const t = useTorres(sesion.conjuntoId);

  const [crearAbierto, setCrearAbierto] = useState(false);
  const [conPisos, setConPisos] = useState<TorreListado | null>(null);
  const [porEliminar, setPorEliminar] = useState<TorreListado | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const eliminar = async () => {
    if (!porEliminar) return;
    setEliminando(true);
    try {
      await t.eliminar(porEliminar.id);
      setPorEliminar(null);
    } catch (err: any) {
      t.setError(err.message);
      setPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <AdminPageShell
      sesion={sesion}
      active="torres"
      loading={t.loading}
      titulo="Torres"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <Button onClick={() => setCrearAbierto(true)} icon={<Plus className="w-4 h-4" />}>
          Nueva torre
        </Button>
      }
    >
      {t.error && <Alert variant="danger">{t.error}</Alert>}
      {t.exito && <Alert variant="success">{t.exito}</Alert>}

      {t.torres.length === 0 ? (
        <Card className="shadow-sm">
          <div className="text-center py-8 space-y-1">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Este conjunto no tiene torres.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Crea una para generar sus pisos y apartamentos de una vez. Si el conjunto no
              se organiza por torres, usa la generación masiva desde Apartamentos.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {t.torres.map(torre => (
            <TorreCard
              key={torre.id}
              torre={torre}
              onAgregarPisos={() => setConPisos(torre)}
              onEliminar={() => setPorEliminar(torre)}
              onAjustarPiso={t.ajustarPiso}
            />
          ))}
        </div>
      )}

      <CrearTorreModal
        isOpen={crearAbierto}
        onClose={() => setCrearAbierto(false)}
        onCrear={t.crear}
      />

      <AgregarPisosModal
        isOpen={Boolean(conPisos)}
        torre={conPisos}
        onClose={() => setConPisos(null)}
        onAgregar={t.agregarPisos}
      />

      <ConfirmDialog
        isOpen={Boolean(porEliminar)}
        title="¿Eliminar la torre?"
        description={
          porEliminar && porEliminar.total_apartamentos > 0
            ? `«${porEliminar.nombre_torre}» tiene ${porEliminar.total_apartamentos} apartamentos. No se podrá eliminar hasta que no le quede ninguno.`
            : `«${porEliminar?.nombre_torre}» se eliminará con sus pisos. No tiene apartamentos, así que no se pierde nada más.`
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={eliminar}
        onCancel={() => setPorEliminar(null)}
        variant="danger"
        loading={eliminando}
      />
    </AdminPageShell>
  );
}
