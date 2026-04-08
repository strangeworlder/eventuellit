import React from "react";
import { getDiceFromValue } from "./AttributeCard";
import { Button } from "./Button";
import { DiceIcon } from "./DiceIcon";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon } from "./Icon";
import { cn } from "./utils";

export interface EnduranceSubAttribute {
  /** Human-readable label (e.g. "Fysiikka") */
  label: string;
  /** Allocation units — input for getDiceFromValue() */
  diceValue: number;
}

export interface EnduranceBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kesto label (e.g. "Keho") */
  label: string;
  /** Current Kesto value */
  value: number;
  /** Maximum Kesto value */
  maxValue?: number;
  /** The two sub-attributes belonging to this Kesto */
  subAttributes: EnduranceSubAttribute[];
  /** Callback for incrementing the Kesto value */
  onIncrement?: () => void;
  /** Callback for decrementing the Kesto value */
  onDecrement?: () => void;
  /** Minimum allowed value (locks decrement) */
  minAllowed?: number;
  /** Maximum allowed value (locks increment) */
  maxAllowed?: number;
}

/**
 * A composite Kesto (endurance) block that displays:
 * - Left side: sub-attributes with passive (non-interactive) dice icons
 * - Right side: the Kesto value with increment/decrement controls
 *
 * @summary Kesto (endurance) widget: sub-attribute dice on left, increment/decrement value on right
 * The right side (Kesto value) is given more visual weight as it is the
 * primary gameplay-relevant value.
 */
export const EnduranceBlock = React.forwardRef<HTMLDivElement, EnduranceBlockProps>(
  (
    {
      className,
      label,
      value,
      maxValue,
      subAttributes,
      onIncrement,
      onDecrement,
      minAllowed = 0,
      maxAllowed = Infinity,
      ...props
    },
    ref,
  ) => {
    const canInteract = !!(onIncrement || onDecrement);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden",
          "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]",
          className,
        )}
        {...props}
      >
        <HeadingLevelProvider>
          {/* Header */}
          <div className={cn("px-6 pt-5 pb-3 border-b border-[var(--theme-border-soft)]")}>
            <Heading>{label}</Heading>
          </div>

          {/* Body — left: sub-attributes, right: Kesto value */}
          <div className="flex items-stretch">
            {/* Left — Sub-attributes with passive dice */}
            <div className="flex flex-col justify-center gap-3 px-5 py-4 flex-shrink-0">
              {subAttributes.map((attr) => {
                const dice = getDiceFromValue(attr.diceValue);
                return (
                  <div key={attr.label} className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      {attr.label}
                    </span>
                    <div className="flex flex-wrap gap-1 min-h-[1.5rem] items-center">
                      {dice.length > 0 ? (
                        dice.map((faces, i) => (
                          <DiceIcon
                            key={`${attr.label}-${faces}-${i}`}
                            faces={faces}
                            size="sm"
                            active={false}
                          />
                        ))
                      ) : (
                        <span className="text-[10px] italic text-text-subtle font-bold uppercase tracking-tighter">
                          Ei noppia
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px bg-[var(--theme-secondary)]/20 my-3" />

            {/* Right — Kesto value (more space) */}
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-4 gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl text-[var(--theme-text)] font-heading font-black leading-none tabular-nums">
                  {value}
                </span>
                {maxValue !== undefined && (
                  <span className="text-lg font-bold leading-none">/ {maxValue}</span>
                )}
              </div>

              {/* Controls */}
              {canInteract && (
                <div className="flex items-center gap-3 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onDecrement}
                    disabled={value <= minAllowed}
                    aria-label={`Vähennä ${label}`}
                  >
                    <Icon name="minus" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onIncrement}
                    disabled={value >= (maxValue ?? maxAllowed)}
                    aria-label={`Lisää ${label}`}
                  >
                    <Icon name="plus" size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </HeadingLevelProvider>
      </div>
    );
  },
);
EnduranceBlock.displayName = "EnduranceBlock";
