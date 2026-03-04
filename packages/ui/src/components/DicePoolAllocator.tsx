import React, { useState } from "react";
import { Button, cn } from "./Button";
import { DiceIcon } from "./DiceIcon";
import { Heading, HeadingLevelProvider } from "./Heading";

export interface DicePoolAllocatorProps extends React.HTMLAttributes<HTMLDivElement> {
  maxDice: number; // e.g. 5 minus Vaurio
  availableDiceLabel?: string;
  onAllocationChange?: (allocation: Record<string, number>) => void;
  axes: string[]; // e.g. ["Nopea", "Äänetön", "Tarkka"]
  attributeDie?: "n4" | "n6" | "n8" | "n10" | "n12" | null; // e.g. +1n6 from Attributes
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

export const DicePoolAllocator = React.forwardRef<HTMLDivElement, DicePoolAllocatorProps>(
  (
    {
      className,
      maxDice,
      axes,
      attributeDie,
      onAllocationChange,
      availableDiceLabel = "Käytettävissä olevat nopat",
      theme,
      ...props
    },
    ref,
  ) => {
    // Track how many n20s are allocated per axis
    const [allocation, setAllocation] = useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};
      axes.forEach((axis) => (initial[axis] = 0));
      return initial;
    });

    const [selectedAttributeAxis, setSelectedAttributeAxis] = useState<string | null>(null);

    const totalAllocated = Object.values(allocation).reduce((acc, curr) => acc + curr, 0);
    const diceRemaining = maxDice - totalAllocated;

    const handleAllocate = (axis: string) => {
      if (diceRemaining > 0) {
        setAllocation((prev) => {
          const next = { ...prev, [axis]: (prev[axis] || 0) + 1 };
          onAllocationChange?.(next);
          return next;
        });
      }
    };

    const handleDeallocate = (axis: string) => {
      if ((allocation[axis] || 0) > 0) {
        setAllocation((prev) => {
          const next = { ...prev, [axis]: (prev[axis] || 0) - 1 };
          onAllocationChange?.(next);
          return next;
        });
      }
    };

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "p-8 rounded-sm border-4 border-[var(--theme-primary)]/40 bg-[var(--theme-bg)] space-y-8 shadow-lg relative overflow-hidden",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* Decorative retro element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex flex-nowrap justify-between items-end border-b-2 border-[var(--theme-primary)]/30 pb-4 relative z-10 gap-4">
            <div className="w-full sm:w-auto">
              <Heading>Toiminnan Luonne</Heading>
              <p className="text-[var(--theme-text)]/70 text-base font-bold mt-1">
                Jaa nopat vaadittujen ominaisuuksien kesken.
              </p>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <span className="block text-5xl font-heading font-black text-[var(--theme-text)]">
                {diceRemaining}{" "}
                <span className="text-2xl text-[var(--theme-text)]/40">/ {maxDice}</span>
              </span>
              <span className="text-sm text-[var(--theme-primary)] font-bold uppercase tracking-widest mt-1 block">
                {availableDiceLabel}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <HeadingLevelProvider>
              {axes.map((axis) => (
                <div
                  key={axis}
                  className="flex flex-wrap items-center justify-between p-4 rounded-sm bg-[var(--theme-secondary)]/5 border-2 border-[var(--theme-secondary)]/20 relative z-10 gap-4"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full lg:w-auto flex-1 min-w-[200px]">
                    <Heading className="min-w-[120px]">{axis}</Heading>

                    {/* Render allocated n20 tokens visually */}
                    <div className="flex flex-wrap gap-2 items-center flex-1 min-h-[40px]">
                      {Array.from({ length: allocation[axis] || 0 }).map((_, i) => (
                        <DiceIcon
                          key={i}
                          faces={20}
                          size="md"
                          active={true}
                          className="-rotate-3 hover:rotate-0"
                        />
                      ))}
                      {(allocation[axis] || 0) === 0 && (
                        <span className="text-sm text-[var(--theme-text)]/30 italic font-bold whitespace-nowrap">
                          -- Ei noppia --
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0">
                    {/* Optional Attribute Die Toggle */}
                    {attributeDie && (
                      <button
                        onClick={() =>
                          setSelectedAttributeAxis(selectedAttributeAxis === axis ? null : axis)
                        }
                        className={cn(
                          "px-3 py-1 rounded-sm text-xs font-bold transition-colors border-2",
                          selectedAttributeAxis === axis
                            ? "bg-[var(--theme-secondary)] text-[var(--theme-secondary-foreground)] border-[var(--theme-secondary)]"
                            : "bg-transparent text-[var(--theme-text)]/50 border-[var(--theme-text)]/30 hover:border-[var(--theme-text)]/50",
                        )}
                      >
                        +1{attributeDie}
                      </button>
                    )}

                    <div className="flex gap-2 bg-[var(--theme-bg)] p-1.5 border-2 border-[var(--theme-secondary)]/30">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleDeallocate(axis)}
                        disabled={(allocation[axis] || 0) === 0}
                        className="rounded-sm bg-[var(--theme-secondary)]/10 text-[var(--theme-secondary)] border-[var(--theme-secondary)]/50 hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-foreground)] hover:border-[var(--theme-primary)] shadow-none shrink-0"
                      >
                        -
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleAllocate(axis)}
                        disabled={diceRemaining === 0}
                        className="rounded-sm bg-[var(--theme-secondary)]/10 text-[var(--theme-secondary)] border-[var(--theme-secondary)]/50 hover:bg-[var(--theme-primary)] hover:text-[var(--theme-primary-foreground)] hover:border-[var(--theme-primary)] shadow-none shrink-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </HeadingLevelProvider>
          </div>
        </HeadingLevelProvider>
      </div>
    );
  },
);
DicePoolAllocator.displayName = "DicePoolAllocator";
