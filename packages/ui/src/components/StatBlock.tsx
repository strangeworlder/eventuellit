import React from "react";
import { Heading } from "./Heading";
import { Icon, type IconName } from "./Icon";
import { primaryThemeMap, type Theme, ThemeContext, useCurrentTheme } from "./Theme";
import { cn } from "./utils";

export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: IconName;
  variant?: "surface" | "outline" | "highlight";
  theme?: Theme;
}

/**
 * Read-only stat display tile: label, numeric value, optional max, and optional icon.
 * Use for character sheet display and scoreboards. For interactive increment/decrement use ActiveStatBlock.
 *
 * @summary read-only stat tile (label + value); use ActiveStatBlock when the value can change during play
 */
export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, label, value, maxValue, icon, variant = "outline", theme, ...props }, ref) => {
    const parentTheme = useCurrentTheme();
    const baseTheme = theme ?? parentTheme;
    const resolvedTheme = variant === "surface" ? primaryThemeMap[baseTheme] : theme;
    const childTheme = resolvedTheme ?? baseTheme;

    return (
      <ThemeContext.Provider value={childTheme}>
        <div
          ref={ref}
          data-theme={resolvedTheme}
          data-variant={variant}
          className={cn(
            "flex items-center gap-4 align-center justify-between p-6 rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden",
            {
              "bg-[var(--theme-bg)] text-[var(--theme-text)]": variant === "surface",
              "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
                variant === "outline",
              "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
                variant === "highlight",
            },
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            {icon && <Icon name={icon} size={24} className="shrink-0" />}
            <Heading>{label}</Heading>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-heading font-black leading-none">{value}</span>
            {maxValue !== undefined && (
              <span className="text-lg font-bold text-text-subtle leading-none">/ {maxValue}</span>
            )}
          </div>
          {icon && <Icon name={icon} size={128} className="-top-6 -left-6 absolute opacity-5" />}
        </div>
      </ThemeContext.Provider>
    );
  },
);
StatBlock.displayName = "StatBlock";
