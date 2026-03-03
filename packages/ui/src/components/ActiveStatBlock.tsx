import React from "react";
import { cn } from "./Button";

export interface ActiveStatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
    maxValue?: number;
    icon?: React.ReactNode;
    onIncrement?: () => void;
    onDecrement?: () => void;
    minAllowed?: number;
    maxAllowed?: number;
}

export const ActiveStatBlock = React.forwardRef<HTMLDivElement, ActiveStatBlockProps>(
    ({ className, label, value, maxValue, icon, onIncrement, onDecrement, minAllowed = 0, maxAllowed = Infinity, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col p-4 rounded-none border-2 border-secondary/30 bg-background gap-3 shadow-[inset_0_0_10px_rgba(11,122,117,0.1)]",
                    className,
                )}
                {...props}
            >
                <div className="flex items-center gap-3 border-b-2 border-secondary/20 pb-2">
                    {icon && <div className="text-primary">{icon}</div>}
                    <span className="font-black text-secondary uppercase tracking-widest text-sm drop-shadow-sm">
                        {label}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <button
                        onClick={onDecrement}
                        disabled={value <= minAllowed}
                        className="w-10 h-10 flex items-center justify-center rounded-none bg-secondary/10 text-secondary border-2 border-secondary/50 hover:bg-primary hover:text-background hover:border-primary disabled:opacity-30 disabled:hover:bg-secondary/10 disabled:hover:text-secondary disabled:hover:border-secondary/50 transition-all font-black text-xl shadow-sm"
                    >
                        -
                    </button>

                    <div className="flex items-baseline gap-1 mx-4">
                        <span className="text-4xl font-black text-text leading-none">{value}</span>
                        {maxValue !== undefined && (
                            <span className="text-lg font-bold text-text/50 leading-none">/ {maxValue}</span>
                        )}
                    </div>

                    <button
                        onClick={onIncrement}
                        disabled={value >= (maxValue ?? maxAllowed)}
                        className="w-10 h-10 flex items-center justify-center rounded-none bg-secondary/10 text-secondary border-2 border-secondary/50 hover:bg-primary hover:text-background hover:border-primary disabled:opacity-30 disabled:hover:bg-secondary/10 disabled:hover:text-secondary disabled:hover:border-secondary/50 transition-all font-black text-xl shadow-sm"
                    >
                        +
                    </button>
                </div>
            </div>
        );
    },
);
ActiveStatBlock.displayName = "ActiveStatBlock";
