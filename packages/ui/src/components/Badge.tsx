import React from "react";
import { Icon, type IconName } from "./Icon";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "secondary" | "accent" | "accent-solid" | "outline";
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

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "primary", icon, theme, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-theme={theme}
                className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors",
                    {
                        "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]": variant === "primary",
                        "bg-[var(--theme-bg)] border-2 border-b-[var(--theme-secondary)] text-[var(--theme-secondary)]": variant === "secondary",
                        "bg-[var(--theme-bg)] border-b-2 border-b-[var(--theme-accent)] text-[var(--theme-accent)]": variant === "accent",
                        "bg-[var(--theme-accent)] text-[var(--theme-bg)]": variant === "accent-solid",
                        "bg-transparent border border-[var(--theme-secondary)] text-[var(--theme-secondary)]":
                            variant === "outline",
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
