import React from "react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { StatBlock } from "./StatBlock";
import { Icon } from "./Icon";
import { cn } from "./utils";
import { DiceIcon } from "./DiceIcon";

export const DIE_HIERARCHY: (4 | 6 | 8 | 10 | 12 | 20)[] = [4, 6, 8, 10, 12, 20];

/**
 * Converts a total number of "allocation units" into the tiered dice representation.
 * Following the progression logic: 3 dice of one type merge into 1 die of the next type.
 */
export function getDiceFromValue(value: number): (4 | 6 | 8 | 10 | 12 | 20)[] {
  const dice: (4 | 6 | 8 | 10 | 12 | 20)[] = [];
  let remainder = value;

  for (let i = 0; i < DIE_HIERARCHY.length; i++) {
    const count = remainder % 3;
    for (let j = 0; j < count; j++) {
      dice.push(DIE_HIERARCHY[i]!);
    }
    remainder = Math.floor(remainder / 3);
    if (remainder === 0) break;
  }

  // Any excess flows into the highest die type (d20)
  while (remainder > 0) {
    dice.push(DIE_HIERARCHY[DIE_HIERARCHY.length - 1]!);
    remainder--;
  }

  // Sort descending to show larger dice first (common RPG convention)
  return dice.sort((a, b) => b - a);
}

/**
 * Calculates the total score bonus for a given allocation value.
 * Bonus = half of the max value of each die in the pool.
 */
export function getScoreBonusFromValue(value: number): number {
  const dice = getDiceFromValue(value);
  return dice.reduce((acc, die) => acc + die / 2, 0);
}

export interface AttributeCardSubAttribute {
  /** Unambiguous identifier for the sub-attribute */
  name: string;
  /** Human-readable label (e.g., "Fysiikka") */
  label: string;
  /** Current value or number of dice assigned */
  value: number;
  /** Callback triggered when clicking the increment/add button */
  onAdd?: () => void;
  /** Callback triggered when clicking the decrement/remove button */
  onRemove?: () => void;
  /** If false, the increment button is disabled */
  canAdd?: boolean;
  /** If false, the decrement button is disabled */
  canRemove?: boolean;
}

export interface AttributeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The visual style variant.
   * - `surface` (default): High-contrast swapped theme (mapped via primaryThemeMap).
   * - `outline`: Transparent background with secondary-colored border and text.
   * - `highlight`: Theme background with accent-colored text and a thick bottom accent border.
   */
  variant?: "surface" | "outline" | "highlight";
  /** The main name of the attribute (e.g., "Keho", "Mieli") */
  label: string;
  /** The summary score for this attribute */
  score: number;
  /** List of sub-attributes that can be modified */
  subAttributes: AttributeCardSubAttribute[];
}

/**
 * A composite card component used in character generation.
 * It displays a main stat (StatBlock) and a list of sub-attributes that
 * can have dice assigned or removed. The allocation value is converted to
 * a tiered d4–d20 dice representation via `getDiceFromValue`.
 *
 * @summary character attribute card: shows stat score + sub-attributes with dice allocation controls
 */
export const AttributeCard = React.forwardRef<HTMLDivElement, AttributeCardProps>(
  ({ className, variant = "surface", label, score, subAttributes, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant={variant}
        className={cn("transition-all duration-300", className)}
        {...props}
      >
        <CardContent variant="dense" className="gap-5">
          <StatBlock label={label} value={score} />

          <div className="flex flex-col gap-3 px-1">
            {subAttributes.map((attr) => (
              <div
                key={attr.name}
                className="flex justify-between items-center group/row py-1 border-b border-current/5 last:border-0 pb-3 last:pb-0"
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-[var(--theme-text)] text-sm tablet:text-base shrink-0">
                      {attr.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5 min-h-[1.5rem] items-center">
                      {getDiceFromValue(attr.value).map((faces, i) => (
                        <DiceIcon
                          key={`${attr.name}-${faces}-${i}`}
                          faces={faces}
                          size="sm"
                          active={variant === "surface"}
                        />
                      ))}
                      {attr.value === 0 && (
                        <span className="text-[10px] uppercase font-bold tracking-tighter text-[var(--theme-text)] opacity-20 italic">
                          Ei lisänoppia
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={attr.onRemove}
                    disabled={!attr.canRemove}
                    aria-label={`Poista noppa kohteesta ${attr.label}`}
                  >
                    <Icon name="minus" size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={attr.onAdd}
                    disabled={!attr.canAdd}
                    aria-label={`Lisää noppa kohteeseen ${attr.label}`}
                  >
                    <Icon name="plus" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
);

AttributeCard.displayName = "AttributeCard";
