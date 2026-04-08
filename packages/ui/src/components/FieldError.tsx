import type React from "react";
import { cn } from "./utils";

export interface FieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardised form-field error message used across all form components.
 */
export function FieldError({ children, className }: FieldErrorProps) {
  return (
    <span
      className={cn(
        "text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
FieldError.displayName = "FieldError";
