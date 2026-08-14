import * as React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
  /** Impide cerrar con el backdrop o Escape mientras hay una operación en curso. */
  busy?: boolean;
}

const sizes = {
  md: "max-w-md",
  lg: "max-w-lg",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
  busy = false,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Evita que la página de fondo haga scroll mientras el modal está abierto.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, busy, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !busy && onClose()}
      />

      {/* Modal box */}
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full ${sizes[size]} p-6 relative shadow-2xl flex flex-col text-left space-y-5 max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          disabled={busy}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5 pt-2 pr-8">
          <h4 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-4">{children}</div>

        {footer && <div className="flex gap-3 justify-end pt-1">{footer}</div>}
      </div>
    </div>
  );
};
