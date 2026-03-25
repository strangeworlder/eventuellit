import React, { useMemo } from "react";
import { cn } from "./utils";
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
 *
 * @summary during/post-roll: track and toggle individual dice as spent; use DicePoolAllocator for allocation phase
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

    // Group dice by face count, sorted ascending (swirl sorts last)
    const grouped = useMemo(() => {
      const groups = new Map<DicePoolDie["faces"], DicePoolDie[]>();
      for (const die of dice) {
        const list = groups.get(die.faces) ?? [];
        list.push(die);
        groups.set(die.faces, list);
      }
      return [...groups.entries()].sort(([a], [b]) => {
        if (a === "swirl") return 1;
        if (b === "swirl") return -1;
        return (a as number) - (b as number);
      });
    }, [dice]);

    const handleClick = (id: string) => {
      if (readOnly || !onDieToggle) return;
      onDieToggle(id);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-6 rounded-xl shadow-sm gap-3 transition-all duration-200 relative overflow-hidden",
          "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* Header — matches ActiveStatBlock secondary variant */}
          <div
            className={cn(
              "flex items-center justify-between gap-3 pb-3 border-b border-current/20",
              "border-b-[var(--theme-secondary)]",
            )}
          >
            {label && <Heading>{label}</Heading>}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl text-[var(--theme-text)] font-heading font-black leading-none tabular-nums">
                {activeCount}
              </span>
              <span className="text-lg font-bold leading-none">
                / {dice.length}
              </span>
            </div>
          </div>

          {/* Dice grid — grouped by face type */}
          <div className="flex flex-wrap gap-6 mt-1">
            {grouped.map(([faces, group], groupIdx) => (
              <div key={faces} className="flex items-center gap-1.5">
                {groupIdx > 0 && (
                  <div className="w-px h-8 bg-[var(--theme-secondary)]/20 mr-2" />
                )}

                {/* Subtle group label */}
                <span className="text-xs font-mono text-text-subtle mr-1 select-none">
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
                        "relative rounded-md p-0.5 transition-all duration-400 ease-in focus-visible:outline-2 focus-visible:outline-[var(--theme-primary)]",
                        !readOnly && "cursor-pointer hover:scale-110 hover:duration-200 hover:ease-out",
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
            <p className="text-sm text-text-subtle italic text-center py-4">
              — Ei noppia —
            </p>
          )}

          {/* All removed state */}
          {dice.length > 0 && activeCount === 0 && (
            <p className="text-xs text-text-subtle italic text-center mt-3">
              Kaikki nopat käytetty
            </p>
          )}
        </HeadingLevelProvider>
      </div>
    );
  },
);
DicePoolTracker.displayName = "DicePoolTracker";
