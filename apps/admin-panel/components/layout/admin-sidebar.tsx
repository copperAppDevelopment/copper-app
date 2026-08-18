'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Users, FileText, LayoutDashboard, Settings, LogOut,
  Bell, RefreshCw, DollarSign, MessageSquare, Landmark
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { clearConjuntoSeleccionado } from "../../lib/conjunto";
import { useNoLeidos } from "../../hooks/useNoLeidos";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { GenerarComunicadoModal } from "../../features/comunicados/components/GenerarComunicadoModal";

export type AdminSection =
  | "dashboard"
  | "apartamentos"
  | "residentes"
  | "recaudos"
  | "comunicados"
  | "chats"
  | "reportes"
  | "conjuntos"
  | "configuracion"
  | "perfil";

export interface AdminSidebarProps {
  active: AdminSection;
  userEmail: string;
  conjuntoId: string;
  conjuntoNombre?: string;
  hasMultipleConjuntos?: boolean;
}

interface NavItem {
  section: AdminSection;
  label: string;
  href: string | null;
  icon: React.ReactNode;
  /** No navega: abre un modal desde el propio sidebar. */
  abreModal?: boolean;
  /** Muestra el globo de mensajes sin leer. */
  llevaNoLeidos?: boolean;
}

const navItems: NavItem[] = [
  { section: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { section: "apartamentos", label: "Apartamentos", href: "/admin/apartamentos", icon: <Building2 className="w-5 h-5" /> },
  { section: "residentes", label: "Residentes", href: "/admin/residentes", icon: <Users className="w-5 h-5" /> },
  { section: "recaudos", label: "Recaudos", href: "/admin/recaudos", icon: <DollarSign className="w-5 h-5" /> },
  { section: "comunicados", label: "Comunicados", href: null, abreModal: true, icon: <Bell className="w-5 h-5" /> },
  { section: "chats", label: "Chats", href: "/admin/chats", llevaNoLeidos: true, icon: <MessageSquare className="w-5 h-5" /> },
  // La sección se llama `reportes` por compatibilidad, pero la tabla es `solicitudes`.
  { section: "reportes", label: "Solicitudes / PQRs", href: "/admin/solicitudes", icon: <FileText className="w-5 h-5" /> },
  { section: "conjuntos", label: "Mis conjuntos", href: "/admin/conjuntos", icon: <Landmark className="w-5 h-5" /> },
  { section: "configuracion", label: "Configuración", href: null, icon: <Settings className="w-5 h-5" /> },
];

const activeClasses =
  "flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl text-sm font-semibold transition-all";
const inactiveClasses =
  "flex items-center gap-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 px-4 py-3 rounded-xl text-sm font-semibold transition-all";

export function AdminSidebar({
  active,
  userEmail,
  conjuntoId,
  conjuntoNombre,
  hasMultipleConjuntos = false,
}: AdminSidebarProps) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isComunicadoOpen, setIsComunicadoOpen] = useState(false);
  const noLeidos = useNoLeidos(conjuntoId);

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    localStorage.clear();
    setIsLogoutOpen(false);
    setLogoutLoading(false);
    router.push("/login");
  };

  const handleBackToSelection = () => {
    clearConjuntoSeleccionado();
    router.push("/select-conjunto");
  };

  return (
    <>
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = item.section === active;
              return (
                <a
                  key={item.section}
                  href={item.href ?? "#"}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? activeClasses : inactiveClasses}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.abreModal) {
                      setIsComunicadoOpen(true);
                      return;
                    }
                    // Las secciones sin href todavía no tienen ruta: quedan inertes.
                    if (!item.href || isActive) return;
                    router.push(item.href);
                  }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.llevaNoLeidos && noLeidos > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                      {noLeidos > 9 ? "9+" : noLeidos}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {hasMultipleConjuntos && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBackToSelection}
              className="w-full justify-center"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Cambiar Conjunto
            </Button>
          )}

          <button
            onClick={() => router.push("/admin/perfil")}
            aria-current={active === "perfil" ? "page" : undefined}
            /* `-mx-2` y no `-m-2`: en vertical se comía el hueco que `space-y-3` deja
               para el botón de cerrar sesión. */
            className={`w-full flex items-center gap-2 p-2 -mx-2 rounded-xl transition-colors cursor-pointer ${
              active === "perfil"
                ? "bg-brand/10"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs shrink-0">
              AD
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-zinc-800 dark:text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">ADMINISTRADOR</p>
            </div>
          </button>
          <Button
            variant="secondary"
            onClick={() => setIsLogoutOpen(true)}
            className="w-full justify-center"
            icon={<LogOut className="w-4 h-4" />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <GenerarComunicadoModal
        isOpen={isComunicadoOpen}
        onClose={() => setIsComunicadoOpen(false)}
        conjuntoId={conjuntoId}
        conjuntoNombre={conjuntoNombre}
      />

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="¿Cerrar Sesión?"
        description="¿Estás seguro de que deseas salir de tu cuenta de administrador de Copper?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutOpen(false)}
        variant="danger"
        loading={logoutLoading}
      />
    </>
  );
}
