import React from "react";
import { cn } from "./Button";
import { Heading } from "./Heading";
import { Icon, type IconName } from "./Icon";

import { type Theme } from "./Theme";

export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: IconName;
  variant?: "secondary" | "accent";
  theme?: Theme;
}

export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, label, value, maxValue, icon, variant = "secondary", theme, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        data-variant={variant}
        className={cn(
          "flex items-center gap-4 align-center justify-between p-6 rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden",
          {
            "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
              variant === "secondary",
            "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
              variant === "accent",
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
          <span className="text-3xl font-heading font-black leading-none">
            {value}
          </span>
          {maxValue !== undefined && (
            <span className="text-lg font-bold opacity-50 leading-none">
              / {maxValue}
            </span>
          )}
        </div>
        {icon && <Icon name={icon} size={128} className="-top-6 -left-6 absolute opacity-5" />}

      </div>
    );
  },
);
StatBlock.displayName = "StatBlock";
