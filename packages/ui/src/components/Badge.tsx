import React from "react";
import { Icon, type IconName } from "./Icon";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * - `solid` (default): Filled primary pill.
   * - `outline`: Transparent with a secondary-colored bottom border.
   * - `highlight`: Transparent with an accent-colored bottom border.
   * - `highlight-solid`: Filled accent pill.
   * - `ghost`: Fully transparent outline pill.
   */
  variant?: "solid" | "outline" | "highlight" | "highlight-solid" | "ghost";
  icon?: IconName;
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

/**
 * Small status or label chip. Use for tags, counts, states, and category labels.
 *
 * @summary small label/status chip; variant: solid/outline/highlight/highlight-solid/ghost; optional icon
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "solid", icon, theme, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
          {
            "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]": variant === "solid",
            "bg-[var(--theme-bg)] border-2 border-b-[var(--theme-secondary)] text-[var(--theme-secondary)]":
              variant === "outline",
            "bg-[var(--theme-bg)] border-b-2 border-b-[var(--theme-accent)] text-[var(--theme-accent)]":
              variant === "highlight",
            "bg-[var(--theme-accent)] text-[var(--theme-bg)]": variant === "highlight-solid",
            "bg-transparent border border-[var(--theme-secondary)] text-[var(--theme-secondary)]":
              variant === "ghost",
          },
          className,
        )}
        {...props}
      >
        {icon && <Icon name={icon} size={16} className="shrink-0" />}
        <span>{children}</span>
      </div>
    );
  },
);

Badge.displayName = "Badge";
