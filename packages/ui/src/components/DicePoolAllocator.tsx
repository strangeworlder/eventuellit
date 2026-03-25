import React, { useState } from "react";
import { Button } from "./Button";
import { cn } from "./utils";
import { type Theme, useCurrentTheme, primaryThemeMap } from "./Theme";
import { DiceIcon } from "./DiceIcon";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon } from "./Icon";
import { ToggleButton } from "./ToggleButton";

// Re-export Theme for consumers who import from this module
export type { Theme };

export interface DicePoolAllocatorProps extends React.HTMLAttributes<HTMLDivElement> {
  maxDice: number;
  availableDiceLabel?: string;
  onAllocationChange?: (allocation: Record<string, number>) => void;
  axes: string[];
  attributeDie?: "n4" | "n6" | "n8" | "n10" | "n12" | null;
  /** The theme context to apply, which modifies the component's CSS variables. */
  theme?: Theme;
}

/**
 * An interactive dice pool allocation widget. Players distribute a fixed pool of d20s
 * across named action axes, with an optional attribute die toggle per axis.
 *
 * @summary pre-roll: distribute a d20 pool across action axes; use DicePoolTracker for tracking spent dice
 *
 * Follows the **primary component** pattern from the design system — it swaps to a
 * contrasting `data-theme` based on its parent theme context (via `primaryThemeMap`),
 * so that all children inherit correct contrast automatically from the CSS theme system.
 *
 * The `theme` prop overrides the inherited context theme before the primary swap is applied.
 */
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
    const parentTheme = useCurrentTheme();
    const baseTheme = theme ?? parentTheme;
    const resolvedTheme = primaryThemeMap[baseTheme];

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
        data-theme={resolvedTheme}
        className={cn(
          "rounded-xl bg-[var(--theme-bg)] shadow-md ring-1 ring-current/10 relative overflow-hidden",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* Decorative ambient glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--theme-primary)]/8 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          {/* Header */}
          <div className="flex flex-nowrap justify-between items-end border-b border-current/20 px-6 pt-6 pb-4 relative z-10 gap-4">
            <div className="w-full mobile:w-auto">
              <Heading>Toiminnan Luonne</Heading>
              <p className="text-text-muted text-sm font-medium mt-1">
                Jaa nopat vaadittujen ominaisuuksien kesken.
              </p>
            </div>
            <div className="text-left mobile:text-right shrink-0">
              <span className="block text-5xl font-heading font-black text-[var(--theme-text)] leading-none">
                {diceRemaining}
                <span className="text-2xl text-text-subtle font-light"> / {maxDice}</span>
              </span>
              <span className="text-xs text-[var(--theme-primary)] font-bold uppercase tracking-widest mt-1.5 block">
                {availableDiceLabel}
              </span>
            </div>
          </div>

          {/* Axes */}
          <div className="px-6 pb-6 pt-2 relative z-10">
            <HeadingLevelProvider>
              {axes.map((axis, idx) => (
                <div
                  key={axis}
                  className={cn(
                    "flex flex-wrap items-center justify-between py-4 gap-4",
                    idx < axes.length - 1 && "border-b border-current/10",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full desktop:w-auto flex-1 min-w-[200px]">
                    <Heading className="min-w-[120px]">{axis}</Heading>

                    {/* Allocated dice tokens */}
                    <div className="flex flex-wrap gap-2 items-center flex-1 min-h-[40px]">
                      {Array.from({ length: allocation[axis] || 0 }).map((_, i) => (
                        <DiceIcon
                          key={i}
                          faces={20}
                          size="md"
                          active={true}
                          className="-rotate-3 hover:rotate-0 transition-transform"
                        />
                      ))}
                      {(allocation[axis] || 0) === 0 && (
                        <span className="text-sm text-text-subtle italic whitespace-nowrap">
                          — Ei noppia —
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Optional Attribute Die Toggle */}
                    {attributeDie && (
                      <ToggleButton
                        pressed={selectedAttributeAxis === axis}
                        onClick={() =>
                          setSelectedAttributeAxis(selectedAttributeAxis === axis ? null : axis)
                        }
                      >
                        +1{attributeDie}
                      </ToggleButton>
                    )}

                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeallocate(axis)}
                        disabled={(allocation[axis] || 0) === 0}
                        aria-label={`Poista noppa kohteesta ${axis}`}
                      >
                        <Icon name="minus" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAllocate(axis)}
                        disabled={diceRemaining === 0}
                        aria-label={`Lisää noppa kohteeseen ${axis}`}
                      >
                        <Icon name="plus" size={16} />
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
