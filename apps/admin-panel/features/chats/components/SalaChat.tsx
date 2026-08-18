'use client';

import * as React from "react";
import { useEffect, useRef } from "react";
import { ArrowLeft, Paperclip, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { formatoFecha } from "@/lib/formato";
import { VARIANTE_ESTADO_CHAT } from "@/lib/chats";
import { useSalaChat } from "../hooks/useSalaChat";
import { ComponerMensaje } from "./ComponerMensaje";
import type { Chat, Mensaje } from "../types";
import type { EstadoChat } from "@/lib/chats";

export interface SalaChatProps {
  chat: Chat;
  onVolver: () => void;
  onCambiarEstado: (chatId: string, estado: EstadoChat) => Promise<void>;
  onMensajeEnviado: () => void;
}

function Burbuja({ mensaje, mio, url }: { mensaje: Mensaje; mio: boolean; url?: string }) {
  return (
    <div className={`flex ${mio ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 space-y-1.5 ${
          mio
            ? "bg-brand text-white rounded-br-sm"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-bl-sm"
        }`}
      >
        {mensaje.message_type === "image" && mensaje.file_name && (
          url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Adjunto" className="rounded-xl max-h-64 w-auto" />
            </a>
          ) : (
            <div className="h-24 w-40 rounded-xl bg-black/10 animate-pulse" />
          )
        )}

        {mensaje.message_type === "file" && mensaje.file_name && (
          <a
            href={url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-xs underline ${url ? "" : "pointer-events-none opacity-60"}`}
          >
            <Paperclip className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{mensaje.file_name.split("/").pop()}</span>
          </a>
        )}

        {mensaje.content && (
          <p className="text-sm whitespace-pre-wrap wrap-break-word">{mensaje.content}</p>
        )}

        <p className={`text-[10px] ${mio ? "text-white/70" : "text-zinc-400 dark:text-zinc-500"}`}>
          {formatoFecha(mensaje.created_at)}
        </p>
      </div>
    </div>
  );
}

export function SalaChat({
  chat, onVolver, onCambiarEstado, onMensajeEnviado,
}: SalaChatProps) {
  const s = useSalaChat(chat.chat_id, onMensajeEnviado);
  const finDeLista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDeLista.current?.scrollIntoView({ behavior: "smooth" });
  }, [s.mensajes]);

  const finalizada = chat.estado === "Finalizado";
  const residente = [chat.residente_nombre, chat.residente_apellido].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 shrink-0">
        <button
          onClick={onVolver}
          className="md:hidden p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          aria-label="Volver a la lista"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-zinc-900 dark:text-white truncate">{chat.asunto}</p>
            <Badge variant={VARIANTE_ESTADO_CHAT[chat.estado]}>{chat.estado}</Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {residente || "Sin nombre"}
            {chat.admin_nombre && ` · atiende ${chat.admin_nombre}`}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onCambiarEstado(chat.chat_id, finalizada ? "Activo" : "Finalizado")}
          icon={finalizada ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        >
          {finalizada ? "Reabrir" : "Finalizar"}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {s.loading ? (
          <SpinnerPagina />
        ) : s.mensajes.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            El residente abrió esta conversación pero todavía no ha escrito nada.
          </p>
        ) : (
          s.mensajes.map((m) => (
            <Burbuja
              key={m.id}
              mensaje={m}
              // Propio es todo lo que no escribió el residente: cualquier admin del conjunto.
              mio={m.sender_id !== chat.residente_user_id}
              url={m.file_name ? s.adjuntos[m.file_name] : undefined}
            />
          ))
        )}
        <div ref={finDeLista} />
      </div>

      {s.error && (
        <div className="px-4 pb-2">
          <Alert variant="danger">{s.error}</Alert>
        </div>
      )}

      <ComponerMensaje onEnviar={s.enviar} enviando={s.enviando} deshabilitado={finalizada} />
    </div>
  );
}
