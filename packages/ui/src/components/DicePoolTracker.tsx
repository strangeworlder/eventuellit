import React, { useMemo } from "react";
import { cn } from "./Button";
import { DiceIcon, type DiceIconProps } from "./DiceIcon";
import { Heading, HeadingLevelProvider } from "./Heading";

export interface DicePoolDie {
  /** Unique identifier for this die within the pool */
  id: string;
  /** Number of faces on this die (d4, d6, d8, d10, d12, d20) */
  faces: DiceIconProps["faces"];
}

export interface DicePoolTrackerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** All dice in the pool (full, unspent pool) */
  dice: DicePoolDie[];
  /** IDs of dice that have been removed / spent */
  removedIds?: string[];
  /** Callback when a die is toggled. Receives the die id. */
  onDieToggle?: (id: string) => void;
  /** If true, dice cannot be toggled */
  readOnly?: boolean;
  /** Optional heading label */
  label?: string;
}

/**
 * A visual dice-pool tracker that renders individual `DiceIcon` elements.
 * Each die can be toggled between active (remaining) and removed (spent) states.
 *
 * The component groups dice by face count and renders them in ascending order
 * (d4s first, d20s last). Designed for tracking Sisu pools but generic enough
 * for any dice-pool mechanic.
 */
export const DicePoolTracker = React.forwardRef<
  HTMLDivElement,
  DicePoolTrackerProps
>(
  (
    {
      className,
      dice,
      removedIds = [],
      onDieToggle,
      readOnly = false,
      label,
      ...props
    },
    ref,
  ) => {
    const removedSet = useMemo(() => new Set(removedIds), [removedIds]);
    const activeCount = dice.length - removedSet.size;

    // Group dice by face count, sorted ascending
    const grouped = useMemo(() => {
      const groups = new Map<number, DicePoolDie[]>();
      for (const die of dice) {
        const list = groups.get(die.faces) ?? [];
        list.push(die);
        groups.set(die.faces, list);
      }
      return [...groups.entries()].sort(([a], [b]) => a - b);
    }, [dice]);

    const handleClick = (id: string) => {
      if (readOnly || !onDieToggle) return;
      onDieToggle(id);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-[var(--theme-secondary)]/30 p-5 transition-all duration-200",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--theme-secondary)]/20 mb-4">
            {label && <Heading>{label}</Heading>}
            <span className="text-lg font-heading font-black text-[var(--theme-text)] tabular-nums">
              {activeCount}
              <span className="text-[var(--theme-text)]/30 font-light">
                {" "}
                / {dice.length}
              </span>
            </span>
          </div>

          {/* Dice grid — grouped by face type */}
          <div className="flex flex-wrap gap-6">
            {grouped.map(([faces, group], groupIdx) => (
              <div key={faces} className="flex items-center gap-1.5">
                {groupIdx > 0 && (
                  <div className="w-px h-8 bg-[var(--theme-secondary)]/20 mr-2" />
                )}

                {/* Subtle group label */}
                <span className="text-xs font-mono text-[var(--theme-text)]/40 mr-1 select-none">
                  d{faces}
                </span>

                {group.map((die) => {
                  const isRemoved = removedSet.has(die.id);
                  return (
                    <button
                      key={die.id}
                      type="button"
                      disabled={readOnly}
                      onClick={() => handleClick(die.id)}
                      className={cn(
                        "relative rounded-md p-0.5 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--theme-primary)]",
                        !readOnly && "cursor-pointer hover:scale-110",
                        readOnly && "cursor-default",
                        isRemoved && "opacity-30 scale-90",
                        !isRemoved && "hover:drop-shadow-md",
                      )}
                      aria-label={`d${die.faces}${isRemoved ? " (poistettu)" : " (aktiivinen)"}`}
                      title={
                        readOnly
                          ? undefined
                          : isRemoved
                            ? "Palauta noppa"
                            : "Poista noppa"
                      }
                    >
                      <DiceIcon
                        faces={die.faces}
                        size="lg"
                        active={!isRemoved}
                      />
                      {isRemoved && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[120%] h-0.5 bg-[var(--theme-text)]/50 rotate-[-30deg] rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {dice.length === 0 && (
            <p className="text-sm text-[var(--theme-text)]/40 italic text-center py-4">
              — Ei noppia —
            </p>
          )}

          {/* All removed state */}
          {dice.length > 0 && activeCount === 0 && (
            <p className="text-xs text-[var(--theme-text)]/40 italic text-center mt-3">
              Kaikki nopat käytetty
            </p>
          )}
        </HeadingLevelProvider>
      </div>
    );
  },
);
DicePoolTracker.displayName = "DicePoolTracker";
