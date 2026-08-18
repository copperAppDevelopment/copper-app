'use client';

import * as React from "react";
import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPT_CHAT, MIMES_CHAT, MAX_BYTES_CHAT } from "@/lib/chats";

export interface ComponerMensajeProps {
  onEnviar: (contenido: string, archivo: File | null) => Promise<void>;
  enviando: boolean;
  deshabilitado?: boolean;
}

export function ComponerMensaje({ onEnviar, enviando, deshabilitado = false }: ComponerMensajeProps) {
  const [texto, setTexto] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [aviso, setAviso] = useState("");
  const inputArchivo = useRef<HTMLInputElement>(null);

  const elegir = (elegido: File | null) => {
    if (!elegido) return;
    if (elegido.size > MAX_BYTES_CHAT) {
      setAviso("El archivo supera el límite de 10 MB.");
      return;
    }
    if (!MIMES_CHAT.includes(elegido.type)) {
      setAviso("Solo se admiten imágenes (JPG, PNG, WEBP) o PDF.");
      return;
    }
    setAviso("");
    setArchivo(elegido);
  };

  const quitarArchivo = () => {
    setArchivo(null);
    // Un input de archivo no se limpia por estado; hay que vaciarlo a mano.
    if (inputArchivo.current) inputArchivo.current.value = "";
  };

  const enviar = async () => {
    if (!texto.trim() && !archivo) return;
    try {
      await onEnviar(texto.trim(), archivo);
      setTexto("");
      quitarArchivo();
    } catch {
      // El error ya lo muestra la sala; aquí se conserva lo escrito.
    }
  };

  if (deshabilitado) {
    return (
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Esta conversación está finalizada. Reábrela para volver a escribir.
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2 shrink-0">
      {aviso && <p className="text-[11px] font-semibold text-red-500">{aviso}</p>}

      {archivo && (
        <div className="flex items-center gap-2 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2">
          <Paperclip className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate flex-1">{archivo.name}</span>
          <button onClick={quitarArchivo} className="shrink-0 p-0.5 hover:text-red-500 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={inputArchivo}
          type="file"
          accept={ACCEPT_CHAT}
          className="hidden"
          onChange={(e) => elegir(e.target.files?.[0] ?? null)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => inputArchivo.current?.click()}
          disabled={enviando}
          aria-label="Adjuntar archivo"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <textarea
          rows={1}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            // Enter envía; Shift+Enter hace salto de línea.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          disabled={enviando}
          placeholder="Escribe un mensaje…"
          className="flex-1 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none max-h-32"
        />

        <Button
          onClick={enviar}
          loading={enviando}
          disabled={!texto.trim() && !archivo}
          aria-label="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
