'use client';

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { ETIQUETA_ROL } from "@/lib/equipo";
import type { RolEquipo } from "@/lib/equipo";
import { TIPOS_DOCUMENTO } from "@/features/perfil/types";
import { useAceptarInvitacion } from "@/features/invitaciones/useAceptarInvitacion";

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-copper.webp" alt="Copper" className="h-9 object-contain mx-auto" />
        {children}
      </div>
    </div>
  );
}

function AceptarContenido() {
  const router = useRouter();
  const a = useAceptarInvitacion(useSearchParams().get("token") ?? "");

  if (a.loading) return <SpinnerPagina />;

  if (a.listo) {
    return (
      <Marco>
        <Card className="shadow-sm">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">¡Cuenta creada!</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Ya puedes iniciar sesión con tu correo y tu contraseña.
              </p>
            </div>
            <Button onClick={() => router.push("/login")}>Iniciar sesión</Button>
          </div>
        </Card>
      </Marco>
    );
  }

  if (!a.invitacion) {
    return (
      <Marco>
        <Card className="shadow-sm">
          <div className="space-y-4 py-2">
            <Alert variant="danger">{a.error}</Alert>
            <Button variant="outline" onClick={() => router.push("/login")} className="w-full justify-center">
              Ir a iniciar sesión
            </Button>
          </div>
        </Card>
      </Marco>
    );
  }

  const rol = ETIQUETA_ROL[a.invitacion.rol as RolEquipo] ?? a.invitacion.rol;
  // Lo que la invitación ya traía no se edita: es lo que registró quien invitó.
  const bloqueado = (campo: "nombres" | "apellidos" | "numero_documento") =>
    Boolean(a.invitacion?.[campo]);

  return (
    <Marco>
      <Card
        title="Completa tu registro"
        subtitle={`Te invitaron a ${a.invitacion.nombre_conjunto} como ${rol}.`}
        className="shadow-sm"
      >
        <div className="space-y-4">
          {a.error && <Alert variant="danger">{a.error}</Alert>}

          <Input id="inv-email" label="Correo electrónico" value={a.invitacion.email} disabled readOnly />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="inv-nombres"
              label="Nombres"
              value={a.form.nombres}
              onChange={(e) => a.cambiar("nombres", e.target.value)}
              disabled={a.enviando || bloqueado("nombres")}
            />
            <Input
              id="inv-apellidos"
              label="Apellidos"
              value={a.form.apellidos}
              onChange={(e) => a.cambiar("apellidos", e.target.value)}
              disabled={a.enviando || bloqueado("apellidos")}
            />
            <Select
              id="inv-tipo-doc"
              label="Tipo de documento"
              value={a.form.tipo_documento}
              onChange={(e) => a.cambiar("tipo_documento", e.target.value)}
              options={TIPOS_DOCUMENTO}
              disabled={a.enviando || bloqueado("numero_documento")}
            />
            <Input
              id="inv-documento"
              label="Número de documento"
              value={a.form.numero_documento}
              onChange={(e) => a.cambiar("numero_documento", e.target.value)}
              disabled={a.enviando || bloqueado("numero_documento")}
            />
          </div>

          <Input
            id="inv-telefono"
            label="Teléfono (opcional)"
            value={a.form.telefono}
            onChange={(e) => a.cambiar("telefono", e.target.value)}
            disabled={a.enviando}
          />

          <Input
            id="inv-password"
            type="password"
            label="Contraseña"
            value={a.form.password}
            onChange={(e) => a.cambiar("password", e.target.value)}
            disabled={a.enviando}
            helperText="Mínimo 8 caracteres."
          />
          <Input
            id="inv-repetida"
            type="password"
            label="Repite la contraseña"
            value={a.form.repetida}
            onChange={(e) => a.cambiar("repetida", e.target.value)}
            disabled={a.enviando}
          />

          <Button
            onClick={a.aceptar}
            loading={a.enviando}
            disabled={!a.form.password || !a.form.repetida}
            className="w-full justify-center"
          >
            Crear mi cuenta
          </Button>
        </div>
      </Card>
    </Marco>
  );
}

export default function AceptarInvitacionPage() {
  // `useSearchParams` obliga a un límite de Suspense en el App Router.
  return (
    <Suspense fallback={<SpinnerPagina />}>
      <AceptarContenido />
    </Suspense>
  );
}
