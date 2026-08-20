'use client';

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { useRegistro } from "@/features/registro/hooks/useRegistro";
import { CuentaForm } from "@/features/registro/components/CuentaForm";
import { PasosRegistro } from "@/features/registro/components/PasosRegistro";
import { ConjuntoFormModal } from "@/features/conjuntos/components/ConjuntoFormModal";
import { PlanModal } from "@/features/conjuntos/components/PlanModal";

/**
 * Registro público de administradores.
 *
 * Solo el primer paso es nuevo. El segundo y el tercero reutilizan `ConjuntoFormModal` y
 * `PlanModal`, que son los mismos que usa un administrador desde el panel: crear el conjunto
 * —inactivo— y pagar la suscripción que lo activa.
 */
/**
 * `useSearchParams` obliga a un límite de Suspense: sin él, Next no puede prerenderizar la
 * página y el build falla.
 */
export default function RegistroPage() {
  return (
    <Suspense fallback={<SpinnerPagina />}>
      <Asistente />
    </Suspense>
  );
}

function Asistente() {
  const router = useRouter();
  const parametros = useSearchParams();
  const r = useRegistro();

  // Quien llega desde la página de precios trae el plan que eligió allí.
  const planPedido = parametros?.get("plan") ?? undefined;

  // El modal del paso se abre solo al llegar, y se puede cerrar para volver a leer la
  // explicación; el botón de la tarjeta lo reabre.
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (r.paso === "conjunto" || r.paso === "plan") setModalAbierto(true);
  }, [r.paso]);

  if (r.comprobando) return <SpinnerPagina />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-white flex flex-col items-center px-4 py-10 md:py-16">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-copper.webp" alt="Copper" className="h-9 mx-auto object-contain" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Registra tu copropiedad
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tres pasos y tu conjunto queda listo para funcionar.
          </p>
        </header>

        <Card className="shadow-sm">
          <PasosRegistro actual={r.paso} />
        </Card>

        {r.paso === "cuenta" && (
          <Card title="Tus datos" subtitle="Serás el administrador del conjunto" className="shadow-sm">
            <CuentaForm r={r} />
          </Card>
        )}

        {r.paso === "conjunto" && (
          <PasoExplicado
            icono={<Building2 className="w-6 h-6" />}
            texto="Cuéntanos dónde queda tu conjunto y cómo se organiza. Si los apartamentos se agrupan por torres, las defines aquí mismo y se crean con su numeración."
            boton="Registrar mi conjunto"
            onAbrir={() => setModalAbierto(true)}
          />
        )}

        {r.paso === "plan" && (
          <PasoExplicado
            icono={<CreditCard className="w-6 h-6" />}
            texto="Tu conjunto ya existe, pero está inactivo hasta que se apruebe el pago. Elige el plan y te llevamos a la pasarela; al volver, el panel te espera."
            boton="Elegir plan y pagar"
            onAbrir={() => setModalAbierto(true)}
          />
        )}

        {r.paso === "listo" && (
          <Card className="shadow-sm">
            <div className="text-center py-8 space-y-4">
              <Alert variant="success">
                Ya tienes tu conjunto activo. Entra al panel para terminar de configurarlo.
              </Alert>
              <Button onClick={() => router.push("/admin/dashboard")}>Ir al panel</Button>
            </div>
          </Card>
        )}

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-brand font-semibold hover:underline cursor-pointer"
          >
            Entra aquí
          </button>
        </p>
      </div>

      {/* Pasos 2 y 3: los mismos componentes que usa el panel. */}
      <ConjuntoFormModal
        isOpen={r.paso === "conjunto" && modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardado={(conjuntoId) => r.conjuntoCreado(conjuntoId)}
      />

      <PlanModal
        isOpen={r.paso === "plan" && modalAbierto}
        conjuntoId={r.conjuntoId}
        planInicial={planPedido}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}

function PasoExplicado({
  icono, texto, boton, onAbrir,
}: {
  icono: React.ReactNode;
  texto: string;
  boton: string;
  onAbrir: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <div className="text-center py-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
          {icono}
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">{texto}</p>
        <Button onClick={onAbrir}>{boton}</Button>
      </div>
    </Card>
  );
}
