'use client';

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Alert } from "@/components/ui/alert";
import { useChats } from "@/features/chats/hooks/useChats";
import { ChatsLista } from "@/features/chats/components/ChatsLista";
import { SalaChat } from "@/features/chats/components/SalaChat";

export default function ChatsPage() {
  const sesion = useAdminSession();
  const c = useChats(sesion.conjuntoId, sesion.loading);

  const [chatId, setChatId] = useState<string | null>(null);

  // Se busca en la lista viva para que la sala vea los cambios de estado y de no leídos.
  const chatActivo = c.chats.find(x => x.chat_id === chatId) ?? null;

  return (
    <AdminPageShell
      sesion={sesion}
      active="chats"
      loading={c.loading}
      titulo="Chats"
      subtitulo={sesion.conjuntoNombre}
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex h-[calc(100vh-14rem)] min-h-[28rem]">
        {/* En pantalla estrecha se ve una de las dos: la lista, o la sala del chat abierto. */}
        <div
          className={`w-full md:w-80 md:border-r border-zinc-200 dark:border-zinc-800 shrink-0 ${
            chatActivo ? "hidden md:block" : ""
          }`}
        >
          <ChatsLista
            chats={c.chats}
            chatActivo={chatId}
            onSeleccionar={(chat) => setChatId(chat.chat_id)}
            filtro={c.filtro}
            onFiltroChange={c.setFiltro}
            filtroEstado={c.filtroEstado}
            onEstadoChange={c.setFiltroEstado}
          />
        </div>

        <div className={`flex-1 min-w-0 ${chatActivo ? "" : "hidden md:flex"}`}>
          {chatActivo ? (
            <SalaChat
              key={chatActivo.chat_id}
              chat={chatActivo}
              onVolver={() => setChatId(null)}
              onCambiarEstado={c.cambiarEstado}
              onMensajeEnviado={c.recargar}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-500">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm">Elige una conversación para responderla.</p>
            </div>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
