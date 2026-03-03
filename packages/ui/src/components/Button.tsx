import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility function to merge tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  theme?: "base" | "inverted" | "primary-light" | "primary-dark" | "secondary-light" | "secondary-dark" | "accent-light" | "accent-dark";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", theme, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-theme={theme}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-sm font-bold uppercase tracking-widest transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md hover:-translate-y-0.5",
          {
            "h-12 px-6 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-14 px-8 py-4 text-xl w-full": size === "lg",
            "h-10 w-10 min-w-[2.5rem] px-0 py-0 text-xl font-black": size === "icon",
          },
          {
            "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] hover:bg-[var(--theme-primary)]/90 border-2 border-transparent": variant === "primary",
            "bg-transparent border-2 border-[var(--theme-secondary)] text-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)]/10 hover:text-[var(--theme-secondary)]/90": variant === "secondary",
            "bg-[var(--theme-accent)] text-[var(--theme-accent-foreground)] hover:bg-[var(--theme-accent)]/90": variant === "danger",
            "hover:bg-[var(--theme-accent)] hover:text-[var(--theme-accent-foreground)]": variant === "ghost",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
