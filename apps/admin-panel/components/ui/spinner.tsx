import * as React from "react";

export interface SpinnerProps {
  /** `sm` para inline, `md` por defecto. */
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-t-2",
  md: "h-8 w-8 border-t-2",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => (
  <div
    role="status"
    aria-label="Cargando"
    className={`animate-spin rounded-full border-brand ${sizes[size]} ${className}`}
  />
);

/** Spinner centrado a pantalla completa, para el estado de carga inicial de una página. */
export const SpinnerPagina: React.FC = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-zinc-800 dark:text-white">
    <Spinner />
  </div>
);
