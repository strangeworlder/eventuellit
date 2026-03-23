import React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  theme?:
    | "base"
    | "inverted"
    | "primary-light"
    | "primary-dark"
    | "secondary-light"
    | "secondary-dark"
    | "accent-light"
    | "accent-dark";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, theme, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-2 mt-2" data-theme={theme}>
        {label && (
          <label className="text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-sm border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] px-4 py-2 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
