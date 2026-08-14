import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-left">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full text-sm rounded-xl border bg-white dark:bg-zinc-950 px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-900/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-brand"
              }
              ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-semibold text-red-500">{error}</p>
        ) : (
          helperText && <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
