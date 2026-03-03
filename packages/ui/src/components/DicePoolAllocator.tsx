import React, { useState } from "react";
import { cn } from "./Button";

export interface DicePoolAllocatorProps extends React.HTMLAttributes<HTMLDivElement> {
    maxDice: number;     // e.g. 5 minus Vaurio
    availableDiceLabel?: string;
    onAllocationChange?: (allocation: Record<string, number>) => void;
    axes: string[];      // e.g. ["Nopea", "Äänetön", "Tarkka"]
    attributeDie?: "d4" | "d6" | "d8" | "d10" | "d12" | null; // e.g. +1d6 from Attributes
}

export const DicePoolAllocator = React.forwardRef<HTMLDivElement, DicePoolAllocatorProps>(
    ({ className, maxDice, axes, attributeDie, onAllocationChange, availableDiceLabel = "Käytettävissä olevat nopat", ...props }, ref) => {

        // Track how many d20s are allocated per axis
        const [allocation, setAllocation] = useState<Record<string, number>>(() => {
            const initial: Record<string, number> = {};
            axes.forEach(axis => initial[axis] = 0);
            return initial;
        });

        const [selectedAttributeAxis, setSelectedAttributeAxis] = useState<string | null>(null);

        const totalAllocated = Object.values(allocation).reduce((acc, curr) => acc + curr, 0);
        const diceRemaining = maxDice - totalAllocated;

        const handleAllocate = (axis: string) => {
            if (diceRemaining > 0) {
                setAllocation(prev => {
                    const next = { ...prev, [axis]: (prev[axis] || 0) + 1 };
                    onAllocationChange?.(next);
                    return next;
                });
            }
        };

        const handleDeallocate = (axis: string) => {
            if ((allocation[axis] || 0) > 0) {
                setAllocation(prev => {
                    const next = { ...prev, [axis]: (prev[axis] || 0) - 1 };
                    onAllocationChange?.(next);
                    return next;
                });
            }
        };

        return (
            <div
                ref={ref}
                className={cn("p-8 rounded-none border-4 border-primary/40 bg-background space-y-8 shadow-[0_0_30px_rgba(201,42,42,0.15)] relative overflow-hidden", className)}
                {...props}
            >
                {/* Decorative retro element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-center border-b-2 border-primary/30 pb-6 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-primary uppercase tracking-widest drop-shadow-sm">Toiminnan Luonne</h3>
                        <p className="text-text/70 text-base font-bold mt-1">Jaa nopat vaadittujen ominaisuuksien kesken.</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-5xl font-black text-text">{diceRemaining} <span className="text-2xl text-text/40">/ {maxDice}</span></span>
                        <span className="text-sm text-primary font-bold uppercase tracking-widest mt-1 block">{availableDiceLabel}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {axes.map(axis => (
                        <div key={axis} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-none bg-secondary/5 border-2 border-secondary/20 relative z-10 gap-4 sm:gap-2">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className="text-xl font-black text-secondary uppercase tracking-widest w-32">{axis}</span>

                                {/* Render allocated d20 tokens visually */}
                                <div className="flex gap-2 h-10 items-center min-w-[120px]">
                                    {Array.from({ length: allocation[axis] || 0 }).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-sm font-black text-background shadow-[2px_2px_0px_rgba(201,42,42,0.4)] transform -rotate-3 transition-transform hover:rotate-0">
                                            20
                                        </div>
                                    ))}
                                    {(allocation[axis] || 0) === 0 && <span className="text-sm text-text/30 italic font-bold">-- Ei noppia --</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Optional Attribute Die Toggle */}
                                {attributeDie && (
                                    <button
                                        onClick={() => setSelectedAttributeAxis(selectedAttributeAxis === axis ? null : axis)}
                                        className={cn(
                                            "px-3 py-1 rounded text-xs font-bold transition-colors border",
                                            selectedAttributeAxis === axis
                                                ? "bg-slate-200 text-slate-900 border-slate-200"
                                                : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500"
                                        )}
                                    >
                                        +1{attributeDie}
                                    </button>
                                )}

                                <div className="flex gap-2 bg-background p-1.5 border-2 border-secondary/30">
                                    <button
                                        onClick={() => handleDeallocate(axis)}
                                        disabled={(allocation[axis] || 0) === 0}
                                        className="w-10 h-10 rounded-none shrink-0 flex items-center justify-center bg-secondary/10 text-secondary hover:bg-primary hover:text-background disabled:opacity-20 transition-all font-black text-xl"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => handleAllocate(axis)}
                                        disabled={diceRemaining === 0}
                                        className="w-10 h-10 rounded-none shrink-0 flex items-center justify-center bg-secondary/10 text-secondary hover:bg-primary hover:text-background disabled:opacity-20 transition-all font-black text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);
DicePoolAllocator.displayName = "DicePoolAllocator";
