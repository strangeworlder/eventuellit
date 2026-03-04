import React from "react";
import { cn } from "./Button";
import { Heading } from "./Heading";

export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
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

export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, label, value, maxValue, icon, theme, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "flex items-center gap-4 align-center justify-between p-4 rounded-sm border-2 border-[var(--theme-primary)]/20 bg-[var(--theme-bg)] shadow-[inset_0_0_10px_color-mix(in_srgb,var(--theme-primary)_5%,transparent)] overflow-hidden relative",
          className,
        )}
        {...props}
      >
        {/* Subtle decorative background element */}
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-[var(--theme-primary)]/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          {icon && <div className="text-[var(--theme-primary)] shrink-0">{icon}</div>}
          <Heading>{label}</Heading>
        </div>
        <div className="flex items-baseline gap-1 relative z-10">
          <span className="text-3xl font-heading font-black text-[var(--theme-text)] leading-none">
            {value}
          </span>
          {maxValue !== undefined && (
            <span className="text-lg font-bold text-[var(--theme-text)]/50 leading-none">
              / {maxValue}
            </span>
          )}
        </div>
      </div>
    );
  },
);
StatBlock.displayName = "StatBlock";
