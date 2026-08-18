'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useConjuntos } from "@/features/conjuntos/hooks/useConjuntos";
import { ConjuntoCard } from "@/features/conjuntos/components/ConjuntoCard";
import { ConjuntoFormModal } from "@/features/conjuntos/components/ConjuntoFormModal";
import { PlanModal } from "@/features/conjuntos/components/PlanModal";

export default function ConjuntosPage() {
  const sesion = useAdminSession();
  const router = useRouter();
  const c = useConjuntos(sesion.userId);

  const [formAbierto, setFormAbierto] = useState(false);
  // El conjunto cuyo cobro está a punto de abrirse: el recién creado o el que se reintenta.
  const [porPagar, setPorPagar] = useState<string | null>(null);

  const pendientes = c.conjuntos.filter(x => !x.estado).length;

  return (
    <AdminPageShell
      sesion={sesion}
      active="conjuntos"
      loading={c.loading}
      titulo="Mis conjuntos"
      subtitulo="Los conjuntos que administras, su estado y su suscripción."
      acciones={
        <Button onClick={() => setFormAbierto(true)} icon={<Plus className="w-4 h-4" />}>
          Nuevo conjunto
        </Button>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      {pendientes > 0 && (
        <Alert variant="warning" title="Conjuntos sin activar">
          {pendientes === 1
            ? "Uno de tus conjuntos sigue inactivo porque su pago no se ha aprobado. Los residentes no pueden usarlo hasta entonces."
            : `${pendientes} de tus conjuntos siguen inactivos porque su pago no se ha aprobado.`}
        </Alert>
      )}

      {c.conjuntos.length === 0 ? (
        <Card className="shadow-sm">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            Todavía no administras ningún conjunto.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {c.conjuntos.map(conjunto => (
            <ConjuntoCard
              key={conjunto.conjunto_id}
              conjunto={conjunto}
              onAbrir={() => router.push(`/admin/conjuntos/${conjunto.conjunto_id}`)}
              onPagar={() => setPorPagar(conjunto.conjunto_id)}
            />
          ))}
        </div>
      )}

      <ConjuntoFormModal
        isOpen={formAbierto}
        onClose={() => setFormAbierto(false)}
        onGuardado={(conjuntoId) => {
          c.recargar();
          // Recién creado: el conjunto nace inactivo, así que se encadena con el cobro.
          setPorPagar(conjuntoId);
        }}
      />

      <PlanModal
        isOpen={Boolean(porPagar)}
        conjuntoId={porPagar ?? ""}
        onClose={() => setPorPagar(null)}
      />
    </AdminPageShell>
  );
}
