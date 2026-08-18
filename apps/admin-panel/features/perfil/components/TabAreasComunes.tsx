'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Trees, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAreasComunes } from "../hooks/useAreasComunes";
import type { AreaComun, DatosArea } from "../adminTypes";

const VACIA: DatosArea = { nombre: "", descripcion: "", activa: true };

function AreaModal({ isOpen, area, onClose, onGuardar }: {
  isOpen: boolean;
  area: AreaComun | null;
  onClose: () => void;
  onGuardar: (datos: DatosArea, areaId?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<DatosArea>(VACIA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(area
      ? { nombre: area.nombre, descripcion: area.descripcion ?? "", activa: area.activa }
      : VACIA);
  }, [isOpen, area]);

  const guardar = async () => {
    setLoading(true);
    setError("");
    try {
      await onGuardar(form, area?.id);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={area ? "Editar área común" : "Nueva área común"}
      onClose={onClose}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={loading}
            disabled={!form.nombre.trim()}
            icon={<Save className="w-4 h-4" />}
          >
            Guardar
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Input
        id="area-nombre"
        label="Nombre"
        placeholder="Salón social"
        value={form.nombre}
        onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))}
        disabled={loading}
      />

      <div className="w-full space-y-1 text-left">
        <label
          htmlFor="area-descripcion"
          className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Descripción
        </label>
        <textarea
          id="area-descripcion"
          rows={3}
          value={form.descripcion}
          onChange={(e) => setForm(p => ({ ...p, descripcion: e.target.value }))}
          disabled={loading}
          placeholder="Para qué sirve el área y qué debe saber el residente."
          className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y"
        />
      </div>

      <label htmlFor="area-activa" className="flex items-center gap-2.5 cursor-pointer">
        <input
          id="area-activa"
          type="checkbox"
          checked={form.activa}
          onChange={(e) => setForm(p => ({ ...p, activa: e.target.checked }))}
          disabled={loading}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand focus:ring-brand/30 cursor-pointer"
        />
        <span className="text-sm text-zinc-800 dark:text-zinc-100">Disponible para los residentes</span>
      </label>
    </Modal>
  );
}

export function TabAreasComunes({ conjuntoId }: { conjuntoId: string }) {
  const a = useAreasComunes(conjuntoId);
  const [enEdicion, setEnEdicion] = useState<AreaComun | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [porBorrar, setPorBorrar] = useState<AreaComun | null>(null);
  const [borrando, setBorrando] = useState(false);

  if (a.loading) {
    return <Card className="shadow-sm"><p className="text-sm text-zinc-500">Cargando…</p></Card>;
  }

  const abrir = (area: AreaComun | null) => {
    setEnEdicion(area);
    setModalAbierto(true);
  };

  const borrar = async () => {
    if (!porBorrar) return;
    setBorrando(true);
    try {
      await a.borrar(porBorrar.id);
      setPorBorrar(null);
    } catch (err: any) {
      a.setError(err.message);
    } finally {
      setBorrando(false);
    }
  };

  return (
    <div className="space-y-6">
      {a.error && <Alert variant="danger">{a.error}</Alert>}

      <Card
        title={
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-brand" />
            <span>Áreas comunes</span>
          </div>
        }
        subtitle="Espacios compartidos del conjunto."
        headerActions={
          <Button size="sm" onClick={() => abrir(null)} icon={<Plus className="w-3.5 h-3.5" />}>
            Nueva
          </Button>
        }
        className="shadow-sm"
      >
        {a.areas.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            Este conjunto todavía no tiene áreas comunes registradas.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {a.areas.map((area) => (
              <div key={area.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {area.nombre}
                    </p>
                    <Badge variant={area.activa ? "success" : "neutral"}>
                      {area.activa ? "Disponible" : "No disponible"}
                    </Badge>
                  </div>
                  {area.descripcion && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{area.descripcion}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => abrir(area)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => a.alternar(area)}>
                    {area.activa ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPorBorrar(area)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AreaModal
        isOpen={modalAbierto}
        area={enEdicion}
        onClose={() => setModalAbierto(false)}
        onGuardar={a.guardar}
      />

      <ConfirmDialog
        isOpen={Boolean(porBorrar)}
        title="¿Eliminar el área?"
        description={`«${porBorrar?.nombre}» se eliminará definitivamente. Si solo quieres que deje de estar disponible, úsala como oculta en vez de eliminarla.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={borrar}
        onCancel={() => setPorBorrar(null)}
        variant="danger"
        loading={borrando}
      />
    </div>
  );
}
