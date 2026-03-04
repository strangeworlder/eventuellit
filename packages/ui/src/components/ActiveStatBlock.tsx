import React from "react";
import { Button, cn } from "./Button";

export interface ActiveStatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
    maxValue?: number;
    icon?: React.ReactNode;
    onIncrement?: () => void;
    onDecrement?: () => void;
    minAllowed?: number;
    maxAllowed?: number;
    theme?: "base" | "inverted" | "primary-light" | "primary-dark" | "secondary-light" | "secondary-dark" | "accent-light" | "accent-dark";
}

export const ActiveStatBlock = React.forwardRef<HTMLDivElement, ActiveStatBlockProps>(
    ({ className, label, value, maxValue, icon, onIncrement, onDecrement, minAllowed = 0, maxAllowed = Infinity, theme, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-theme={theme}
                className={cn(
                    "flex flex-col p-4 rounded-sm border-2 border-[var(--theme-secondary)]/30 bg-[var(--theme-bg)] gap-3 shadow-inner",
                    className,
                )}
                {...props}
            >
                <div className="flex items-center gap-3 border-b-2 border-[var(--theme-secondary)]/20 pb-2">
                    {icon && <div className="text-[var(--theme-primary)]">{icon}</div>}
                    <span className="font-heading font-black text-[var(--theme-secondary)] uppercase tracking-widest text-sm drop-shadow-sm">
                        {label}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={onDecrement}
                        disabled={value <= minAllowed}
                        className="rounded-sm bg-[var(--theme-secondary)]/10 border-[var(--theme-secondary)]/50 hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-foreground)] hover:border-[var(--theme-primary)] shadow-none"
                    >
                        -
                    </Button>

                    <div className="flex items-baseline gap-1 mx-4">
                        <span className="text-4xl font-heading font-black text-[var(--theme-text)] leading-none">{value}</span>
                        {maxValue !== undefined && (
                            <span className="text-lg font-bold text-[var(--theme-text)]/50 leading-none">/ {maxValue}</span>
                        )}
                    </div>

                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={onIncrement}
                        disabled={value >= (maxValue ?? maxAllowed)}
                        className="rounded-sm bg-[var(--theme-secondary)]/10 border-[var(--theme-secondary)]/50 hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-foreground)] hover:border-[var(--theme-primary)] shadow-none"
                    >
                        +
                    </Button>
                </div>
            </div>
        );
    },
);
ActiveStatBlock.displayName = "ActiveStatBlock";

