import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, helperText, options = [], id, ...props }, ref) => {
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
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`w-full text-sm rounded-xl border bg-white dark:bg-zinc-950 px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-900/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600
              ${
                error
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-brand"
              }
              ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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

Select.displayName = "Select";
