'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, ClipboardList, Users, Mail, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";

export type SuperAdminSection =
  | "dashboard"
  | "planes"
  | "suscripciones"
  | "usuarios"
  | "contactos";

export interface SuperAdminSidebarProps {
  active: SuperAdminSection;
  userEmail: string;
}

interface NavItem {
  section: SuperAdminSection;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { section: "dashboard", label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { section: "planes", label: "Planes", href: "/superadmin/planes", icon: <CreditCard className="w-5 h-5" /> },
  { section: "suscripciones", label: "Asignación de planes", href: "/superadmin/suscripciones", icon: <ClipboardList className="w-5 h-5" /> },
  { section: "usuarios", label: "Usuarios", href: "/superadmin/usuarios", icon: <Users className="w-5 h-5" /> },
  { section: "contactos", label: "Contactos", href: "/superadmin/contactos", icon: <Mail className="w-5 h-5" /> },
];

const activeClasses =
  "flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl text-sm font-semibold transition-all";
const inactiveClasses =
  "flex items-center gap-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 px-4 py-3 rounded-xl text-sm font-semibold transition-all";

/**
 * Sidebar del rol SuperAdmin.
 *
 * Aparte del de administrador porque aquí no hay conjunto seleccionado: no existen «Cambiar
 * conjunto», ni el globo de mensajes sin leer, ni los modales de cobros y comunicados, que
 * necesitan un `conjuntoId`.
 */
export function SuperAdminSidebar({ active, userEmail }: SuperAdminSidebarProps) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const cerrarSesion = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    localStorage.clear();
    setIsLogoutOpen(false);
    setLogoutLoading(false);
    router.push("/login");
  };

  return (
    <>
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = item.section === active;
              return (
                <a
                  key={item.section}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? activeClasses : inactiveClasses}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isActive) return;
                    router.push(item.href);
                  }}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 p-2 -mx-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs shrink-0">
              SA
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-zinc-800 dark:text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">SUPERADMIN</p>
            </div>
          </div>

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

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="¿Cerrar Sesión?"
        description="¿Estás seguro de que deseas salir de tu cuenta de Copper?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={cerrarSesion}
        onCancel={() => setIsLogoutOpen(false)}
        variant="danger"
        loading={logoutLoading}
      />
    </>
  );
}
