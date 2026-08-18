'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { TIPOS_VIVIENDA, ESTRATOS } from "@/lib/conjuntos";
import * as api from "../api";
import { CONJUNTO_VACIO } from "../types";
import type { DatosConjunto } from "../types";

export interface ConjuntoFormModalProps {
  isOpen: boolean;
  /** Sin id, el modal da de alta un conjunto nuevo. */
  conjuntoId?: string;
  inicial?: DatosConjunto | null;
  onClose: () => void;
  onGuardado: (conjuntoId: string, esNuevo: boolean) => void;
}

export function ConjuntoFormModal({
  isOpen,
  conjuntoId,
  inicial,
  onClose,
  onGuardado,
}: ConjuntoFormModalProps) {
  const [form, setForm] = useState<DatosConjunto>(CONJUNTO_VACIO);
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setFoto(null);
    setForm(inicial ?? CONJUNTO_VACIO);
  }, [isOpen, inicial]);

  const cambiar = <K extends keyof DatosConjunto>(clave: K, valor: DatosConjunto[K]) =>
    setForm(previo => ({ ...previo, [clave]: valor }));

  const guardar = async () => {
    setLoading(true);
    setError("");
    try {
      const { conjunto_id } = await api.guardarConjunto(form, foto, conjuntoId);
      onGuardado(conjunto_id, !conjuntoId);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completo = Boolean(
    form.nombre.trim() &&
    form.direccion.trim() &&
    (conjuntoId || form.codigo_municipio.trim())
  );

  return (
    <Modal
      isOpen={isOpen}
      title={conjuntoId ? "Editar conjunto" : "Nuevo conjunto"}
      onClose={onClose}
      busy={loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={loading}
            disabled={!completo}
            icon={<Save className="w-4 h-4" />}
          >
            {conjuntoId ? "Guardar" : "Crear y pagar"}
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {!conjuntoId && (
        <Alert variant="info">
          El conjunto se crea inactivo. Se activa en cuanto se apruebe el pago de la
          suscripción, que se pide justo después.
        </Alert>
      )}

      <Input
        id="conjunto-nombre"
        label="Nombre"
        placeholder="Conjunto Residencial Salamanca"
        value={form.nombre}
        onChange={(e) => cambiar("nombre", e.target.value)}
        disabled={loading}
      />

      <Input
        id="conjunto-direccion"
        label="Dirección"
        placeholder="Calle 10 # 43-15"
        value={form.direccion}
        onChange={(e) => cambiar("direccion", e.target.value)}
        disabled={loading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="conjunto-ciudad"
          label="Ciudad"
          placeholder="MEDELLÍN"
          value={form.ciudad}
          onChange={(e) => cambiar("ciudad", e.target.value)}
          disabled={loading}
        />

        <Input
          id="conjunto-municipio"
          label="Código DANE"
          placeholder="05001"
          helperText="Código del municipio (5 dígitos)."
          value={form.codigo_municipio}
          onChange={(e) => cambiar("codigo_municipio", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          id="conjunto-tipo"
          label="Tipo de vivienda"
          value={form.tipo_vivienda}
          onChange={(e) => cambiar("tipo_vivienda", e.target.value)}
          disabled={loading}
          options={TIPOS_VIVIENDA.map(t => ({ value: t, label: t }))}
        />

        <Select
          id="conjunto-estrato"
          label="Estrato"
          value={form.estrato}
          onChange={(e) => cambiar("estrato", e.target.value)}
          disabled={loading}
          options={[
            { value: "", label: "Sin definir" },
            ...ESTRATOS.map(e => ({ value: String(e), label: String(e) })),
          ]}
        />

        <Input
          id="conjunto-anio"
          label="Año de construcción"
          type="number"
          placeholder="2015"
          value={form.anio_construccion}
          onChange={(e) => cambiar("anio_construccion", e.target.value)}
          disabled={loading}
        />
      </div>

      <label htmlFor="conjunto-torres" className="flex items-center gap-2.5 cursor-pointer">
        <input
          id="conjunto-torres"
          type="checkbox"
          checked={form.tiene_torres}
          onChange={(e) => cambiar("tiene_torres", e.target.checked)}
          disabled={loading}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand focus:ring-brand/30 cursor-pointer"
        />
        <span className="text-sm text-zinc-800 dark:text-zinc-100">
          Los apartamentos se organizan por torres
        </span>
      </label>

      <div className="w-full space-y-1 text-left">
        <label
          htmlFor="conjunto-foto"
          className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Foto
        </label>
        <input
          id="conjunto-foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
          disabled={loading}
          className="w-full text-sm text-zinc-600 dark:text-zinc-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"
        />
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
          JPG, PNG o WEBP, hasta 5 MB.{form.foto_url && " Si no eliges una, se conserva la actual."}
        </p>
      </div>
    </Modal>
  );
}
