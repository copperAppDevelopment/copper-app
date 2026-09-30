import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { PIE_BOTONES } from "./modal";
import { Portal } from "./portal";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "primary" | "danger";
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "primary",
  loading = false,
}) => {
  // Igual que `Modal`: Escape cierra y la página de fondo no se desplaza.
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => !loading && onCancel()}
        />

        {/* Modal box */}
        <div
          role="alertdialog"
          aria-modal="true"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl transition-all scale-100 flex flex-col text-left space-y-5 max-h-[90dvh] overflow-y-auto"
        >
          <button
            onClick={onCancel}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4 items-start pt-2 pr-6">
            {variant === "danger" && (
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-300 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-1.5 min-w-0">
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                {title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className={PIE_BOTONES}>
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant={variant} onClick={onConfirm} loading={loading}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
