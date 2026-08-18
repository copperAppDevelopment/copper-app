'use client';

import * as React from "react";
import { useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PerfilFotoProps {
  fotoUrl: string | null;
  foto: File | null;
  nombre: string;
  onElegir: (archivo: File | null) => void;
  disabled?: boolean;
}

const MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export function PerfilFoto({ fotoUrl, foto, nombre, onElegir, disabled }: PerfilFotoProps) {
  const input = useRef<HTMLInputElement>(null);
  const [aviso, setAviso] = React.useState("");

  // Vista previa local de lo que aún no se ha subido.
  const previa = React.useMemo(
    () => (foto ? URL.createObjectURL(foto) : null),
    [foto]
  );

  React.useEffect(
    () => () => { if (previa) URL.revokeObjectURL(previa); },
    [previa]
  );

  const elegir = (archivo: File | null) => {
    if (!archivo) return;
    if (archivo.size > MAX_BYTES) {
      setAviso("La imagen supera el límite de 5 MB.");
      return;
    }
    if (!MIMES.includes(archivo.type)) {
      setAviso("La foto debe ser JPG, PNG o WEBP.");
      return;
    }
    setAviso("");
    onElegir(archivo);
  };

  const iniciales = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join("") || "AD";

  const src = previa ?? fotoUrl;

  return (
    <div className="flex items-center gap-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Foto de perfil"
          className="w-20 h-20 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center text-brand font-bold text-xl">
          {iniciales}
        </div>
      )}

      <div className="space-y-1">
        <input
          ref={input}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => elegir(e.target.files?.[0] ?? null)}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={disabled}
          icon={<Camera className="w-3.5 h-3.5" />}
        >
          {src ? "Cambiar foto" : "Subir foto"}
        </Button>
        {aviso ? (
          <p className="text-[11px] font-semibold text-red-500">{aviso}</p>
        ) : (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {foto ? "Se subirá al guardar." : "JPG, PNG o WEBP. Máximo 5 MB."}
          </p>
        )}
      </div>
    </div>
  );
}
