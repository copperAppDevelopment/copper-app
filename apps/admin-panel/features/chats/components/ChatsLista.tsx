'use client';

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatoFechaCorta } from "@/lib/formato";
import { ESTADOS_CHAT, resumenMensaje } from "@/lib/chats";
import type { Chat, FiltroEstadoChat } from "../types";

export interface ChatsListaProps {
  chats: Chat[];
  chatActivo: string | null;
  onSeleccionar: (chat: Chat) => void;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstadoChat;
  onEstadoChange: (valor: FiltroEstadoChat) => void;
}

export function ChatsLista({
  chats, chatActivo, onSeleccionar, filtro, onFiltroChange, filtroEstado, onEstadoChange,
}: ChatsListaProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3 shrink-0">
        <Input
          id="filtro-chat"
          placeholder="Buscar por asunto o residente…"
          value={filtro}
          onChange={(e) => onFiltroChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Select
          id="filtro-estado-chat"
          value={filtroEstado}
          onChange={(e) => onEstadoChange(e.target.value as FiltroEstadoChat)}
          options={[
            { value: "todos", label: "Todas las conversaciones" },
            ...ESTADOS_CHAT.map(e => ({ value: e, label: e === "Activo" ? "Activas" : "Finalizadas" })),
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            No hay conversaciones que coincidan.
          </p>
        ) : (
          chats.map((chat) => {
            const activo = chat.chat_id === chatActivo;
            const noLeidos = Number(chat.no_leidos_admin ?? 0);
            return (
              <button
                key={chat.chat_id}
                onClick={() => onSeleccionar(chat)}
                className={`w-full text-left px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60 transition-colors ${
                  activo
                    ? "bg-brand/10"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm truncate ${noLeidos > 0 ? "font-bold text-zinc-900 dark:text-white" : "font-semibold text-zinc-700 dark:text-zinc-200"}`}>
                    {chat.asunto}
                  </p>
                  {noLeidos > 0 && (
                    <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                      {noLeidos > 9 ? "9+" : noLeidos}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {[chat.residente_nombre, chat.residente_apellido].filter(Boolean).join(" ") || "Sin nombre"}
                </p>

                <div className="flex items-end justify-between gap-2 mt-1">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                    {resumenMensaje(chat.ultimo_mensaje_tipo, chat.ultimo_mensaje)}
                  </p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0 whitespace-nowrap">
                    {chat.ultimo_mensaje_fecha ? formatoFechaCorta(chat.ultimo_mensaje_fecha) : ""}
                  </span>
                </div>

                {chat.estado === "Finalizado" && (
                  <span className="inline-block mt-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Finalizada
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
