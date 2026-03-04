import React from "react";
import { cn } from "./Button";

export interface DiceIconProps extends React.HTMLAttributes<HTMLDivElement> {
    faces: 4 | 6 | 8 | 10 | 12 | 20;
    value?: number;
    size?: "sm" | "md" | "lg";
    active?: boolean;
}

export const DiceIcon = React.forwardRef<HTMLDivElement, DiceIconProps>(
    ({ className, faces, value, size = "md", active = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center font-black shadow-sm transform transition-transform",
                    {
                        "w-6 h-6 text-xs": size === "sm",
                        "w-8 h-8 text-sm": size === "md",
                        "w-12 h-12 text-lg": size === "lg",
                    },
                    // Standard diamond/square shape based on dice type
                    {
                        "rounded-sm": faces === 6,
                        "rotate-45 rounded-sm [&>span]:-rotate-45": faces === 8,
                        "rounded-full": faces === 20, // Simplified representation
                    },
                    // Active vs Inactive states
                    active
                        ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] shadow-[2px_2px_0px_rgba(201,42,42,0.4)]"
                        : "bg-[var(--theme-secondary)]/20 text-[var(--theme-secondary)] border-2 border-[var(--theme-secondary)]/30",
                    className
                )}
                {...props}
            >
                <span>{value ?? faces}</span>
            </div>
        );
    }
);
DiceIcon.displayName = "DiceIcon";
