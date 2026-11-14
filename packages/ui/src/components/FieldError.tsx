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
      className={cn("text-xs font-semibold tracking-wide text-[var(--theme-accent)]", className)}
    >
      {children}
    </span>
  );
}
FieldError.displayName = "FieldError";
