import React from "react";
import { cn } from "./Button";

export interface DiceRollerProps extends React.HTMLAttributes<HTMLDivElement> {
  diceType?: "n6" | "n10" | "n20";
  count?: number;
  label?: string;
  onRoll?: (result: number[]) => void;
}

export const DiceRoller = React.forwardRef<HTMLDivElement, DiceRollerProps>(
  ({ className, diceType = "n10", count = 1, label, onRoll, ...props }, ref) => {
    const handleRoll = () => {
      if (onRoll) {
        // TTRPG mock logic for random generation bounds
        const max = parseInt(diceType.replace("n", ""), 10) || 10;
        const results = Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
        onRoll(results);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-3 mt-4", className)} {...props}>
        {label && (
          <label className="text-sm font-black text-secondary uppercase tracking-widest">
            {label}
          </label>
        )}
        <button
          onClick={handleRoll}
          className="flex h-20 w-full items-center justify-center rounded-none border-4 border-dashed border-primary/40 bg-background hover:bg-primary/10 hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 group hover:scale-[1.02] shadow-[0_0_15px_rgba(201,42,42,0.1)] hover:shadow-[0_0_25px_rgba(201,42,42,0.3)]"
        >
          <div className="flex items-center gap-4 text-text/70 group-hover:text-primary transition-colors">
            {/* Simple mock icon for a die */}
            <svg
              xmlns="http://www.w3.org/-svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <circle cx="15.5" cy="15.5" r="1.5" />
              <circle cx="15.5" cy="8.5" r="1.5" />
              <circle cx="8.5" cy="15.5" r="1.5" />
            </svg>
            <span className="font-black text-2xl uppercase tracking-widest drop-shadow-sm">
              Heitä {count}
              {diceType}
            </span>
          </div>
        </button>
      </div>
    );
  },
);
DiceRoller.displayName = "DiceRoller";
