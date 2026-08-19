'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Users, Mail, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Acceso {
  label: string;
  descripcion: string;
  icono: React.ReactNode;
  href: string;
}

const accesos: Acceso[] = [
  {
    label: "Gestionar planes",
    descripcion: "Precios y límites de los planes comerciales",
    icono: <CreditCard className="w-4 h-4" />,
    href: "/superadmin/planes",
  },
  {
    label: "Gestión de usuarios",
    descripcion: "Cuentas y roles de toda la plataforma",
    icono: <Users className="w-4 h-4" />,
    href: "/superadmin/usuarios",
  },
  {
    label: "Últimos contactos",
    descripcion: "Solicitudes que llegan desde la página web",
    icono: <Mail className="w-4 h-4" />,
    href: "/superadmin/contactos",
  },
];

export function AccesosRapidosSuperAdmin() {
  const router = useRouter();

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand" />
          <span>Accesos Rápidos</span>
        </div>
      }
      className="shadow-sm"
    >
      <div className="space-y-3">
        {accesos.map(a => (
          <Button
            key={a.label}
            variant="outline"
            onClick={() => router.push(a.href)}
            className="h-auto py-3 flex items-center gap-3 w-full justify-start text-left"
          >
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              {a.icono}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs">{a.label}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal truncate">
                {a.descripcion}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
