import React from "react";
import { cn } from "./Button";

export interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
}

export const StatBlock = React.forwardRef<HTMLDivElement, StatBlockProps>(
  ({ className, label, value, maxValue, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4 rounded-none border-2 border-primary/20 bg-background shadow-[inset_0_0_10px_rgba(201,42,42,0.05)]",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <span className="font-black text-secondary uppercase tracking-widest text-sm drop-shadow-sm">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-text leading-none">{value}</span>
          {maxValue !== undefined && (
            <span className="text-lg font-bold text-text/50 leading-none">/ {maxValue}</span>
          )}
        </div>
      </div>
    );
  },
);
StatBlock.displayName = "StatBlock";
