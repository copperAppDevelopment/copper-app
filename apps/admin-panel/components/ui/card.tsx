import * as React from "react";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  title,
  subtitle,
  headerActions,
  footer,
  noPadding = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between gap-4">
          <div className="space-y-0.5 text-left">
            {title && (
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2 shrink-0">{headerActions}</div>}
        </div>
      )}
      <div className={`flex-1 text-left ${noPadding ? "" : "p-6"}`}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-end gap-2 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};
