import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
}

const variants = {
  neutral:
    "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800",
  success:
    "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/30",
  warning:
    "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/30",
  danger:
    "bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/30",
  info:
    "bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30",
  brand:
    "bg-brand/10 text-brand border border-brand/20",
};

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "neutral",
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
