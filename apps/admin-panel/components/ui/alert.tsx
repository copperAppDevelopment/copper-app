import * as React from "react";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className = "",
  variant = "info",
  title,
  onClose,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    danger: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const variants = {
    info: "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30 text-blue-950 dark:text-blue-200",
    success: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-200",
    warning: "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 text-amber-950 dark:text-amber-200",
    danger: "bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/30 text-red-950 dark:text-red-200",
  };

  return (
    <div
      className={`p-4 border rounded-2xl flex gap-3.5 items-start text-left text-sm transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-bold tracking-tight">{title}</h5>}
        <div className="text-zinc-600 dark:text-zinc-300 text-xs font-light">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      )}
    </div>
  );
};
