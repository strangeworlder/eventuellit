import React, { useMemo, useRef } from "react";
import { Button } from "./Button";
import { cn } from "./utils";

/** Returns a stable map of item-id → glitch CSS vars, seeded once per unique id. */
function useGlitchSeeds(ids: Array<string | number>): Map<string, React.CSSProperties> {
  const cache = useRef(new Map<string, React.CSSProperties>());
  return useMemo(() => {
    const next = new Map<string, React.CSSProperties>();
    for (const id of ids) {
      const key = String(id);
      const existing = cache.current.get(key);
      if (existing) {
        next.set(key, existing);
      } else {
        const delay = Math.random() * 36;
        const duration = 25 + Math.random() * 20;
        const style = {
          "--glitch-delay": `-${delay.toFixed(2)}s`,
          "--glitch-duration": `${duration.toFixed(2)}s`,
        } as React.CSSProperties;
        next.set(key, style);
      }
    }
    cache.current = next;
    return next;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);
}

export interface SkillItem {
  id: string | number;
  name: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface SkillMasonryProps {
  /** Array of skill items to render */
  skills: SkillItem[];
  /** Triggered when a skill is clicked */
  onSkillClick: (skill: SkillItem) => void;
  /**
   * How to order items before layout.
   * - `'none'` (default): keep original order
   * - `'alphabetical'`: sort A → Z by name
   * - `'optimal'`: interleave long and short names for the most compact flex-wrap packing
   */
  sort?: "none" | "alphabetical" | "optimal";
  /** Whether the custom skill button should be shown */
  showCustomButton?: boolean;
  /** Whether the custom skill button is currently selected */
  isCustomSelected?: boolean;
  /** Triggered when the custom button is clicked */
  onCustomClick?: () => void;
  /** Text for the custom button */
  customButtonLabel?: string;
  /** Optional className on the root container */
  className?: string;
}

/**
 * Categorise text length into a flex-grow tier so longer
 * labels claim proportionally more row space, producing
 * an organic brick-wall feel.
 */
function growTier(text: string): number {
  const len = text.length;
  if (len <= 10) return 1;
  if (len <= 20) return 2;
  return 3;
}

/**
 * Interleave items by text length for optimal flex-wrap
 * packing: sort by length, then alternate picking from
 * the longest and shortest remaining items so each row
 * pairs wide items with narrow ones.
 */
function optimalOrder<T extends { name: string }>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => a.name.length - b.name.length);
  const result: T[] = [];
  let lo = 0;
  let hi = sorted.length - 1;
  let pickLong = true;
  while (lo <= hi) {
    result.push(pickLong ? sorted[hi--]! : sorted[lo++]!);
    pickLong = !pickLong;
  }
  return result;
}

export function SkillMasonry({
  skills,
  onSkillClick,
  sort = "none",
  showCustomButton = false,
  isCustomSelected = false,
  onCustomClick,
  customButtonLabel = "Oma taito...",
  className,
}: SkillMasonryProps) {
  const allItems = useMemo(() => {
    let items: Array<SkillItem & { _custom?: true }> = skills.map((s) => ({ ...s }));

    // Sort skill items (custom button always goes last)
    if (sort === "alphabetical") {
      items.sort((a, b) => a.name.localeCompare(b.name, "fi"));
    } else if (sort === "optimal") {
      items = optimalOrder(items);
    }

    if (showCustomButton) {
      items.push({
        id: "__custom__",
        name: customButtonLabel,
        _custom: true,
      });
    }
    return items;
  }, [skills, showCustomButton, customButtonLabel, sort]);

  const glitchSeeds = useGlitchSeeds(allItems.map((i) => i.id));

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {allItems.map((item) => {
        const isCustom = item._custom === true;

        return (
          <Button
            key={String(item.id)}
            size="sm"
            variant={
              isCustom
                ? isCustomSelected
                  ? "solid"
                  : "outline"
                : item.selected
                  ? "solid"
                  : "outline"
            }
            disabled={isCustom ? false : item.disabled}
            className="text-left justify-start"
            style={{ flexGrow: growTier(item.name), flexBasis: 0, minWidth: "fit-content", ...glitchSeeds.get(String(item.id)) }}
            onClick={() => {
              if (isCustom) {
                onCustomClick?.();
              } else {
                onSkillClick(item);
              }
            }}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
}
