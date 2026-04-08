import React from "react";
import { Button } from "./Button";
import { DiceIcon } from "./DiceIcon";
import { cn } from "./utils";

const DICE_FACES: Record<string, 4 | 6 | 8 | 10 | 12 | 20> = {
  n4: 4,
  n6: 6,
  n8: 8,
  n10: 10,
  n12: 12,
  n20: 20,
};

export interface DiceRollerProps extends React.HTMLAttributes<HTMLDivElement> {
  diceType?: "n6" | "n10" | "n20";
  count?: number;
  label?: string;
  onRoll?: (result: number[]) => void;
}

/**
 * Simple one-click dice-roll widget. Shows the die face and a roll button; fires `onRoll` with results.
 * Use for quick standalone rolls. For full pool allocation use DicePoolAllocator.
 *
 * @summary one-click roll widget; diceType n6/n10/n20, count, onRoll callback; for full pools use DicePoolAllocator
 */
export const DiceRoller = React.forwardRef<HTMLDivElement, DiceRollerProps>(
  ({ className, diceType = "n10", count = 1, label, onRoll, ...props }, ref) => {
    const buttonId = React.useId();

    const handleRoll = () => {
      if (onRoll) {
        // TTRPG mock logic for random generation bounds
        const max = parseInt(diceType.replace("n", ""), 10) || 10;
        const results = Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
        onRoll(results);
      }
    };

    const faces = DICE_FACES[diceType] ?? 10;

    return (
      <div ref={ref} className={cn("flex flex-col gap-3 mt-4", className)} {...props}>
        {label && (
          <label
            htmlFor={buttonId}
            className="text-sm font-black text-[var(--theme-secondary)] uppercase tracking-widest"
          >
            {label}
          </label>
        )}
        <Button id={buttonId} onClick={handleRoll} size="lg" variant="outline">
          <DiceIcon faces={faces} size="lg" active />
          <span>
            Heitä {count}
            {diceType}
          </span>
        </Button>
      </div>
    );
  },
);
DiceRoller.displayName = "DiceRoller";
