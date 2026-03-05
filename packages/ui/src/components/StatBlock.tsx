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
          "flex items-center gap-4 align-center justify-between p-6 rounded-xl border shadow-sm",
          className,
        )}
        style={{
          borderColor: "var(--theme-secondary)",
          color: "var(--theme-secondary)",
          backgroundColor: "transparent",
        }}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="shrink-0">{icon}</div>}
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
      </div>
    );
  },
);
StatBlock.displayName = "StatBlock";
