import React, { useCallback, useEffect, useId, useState } from "react";
import { Button } from "./Button";
import { type Theme, useCurrentTheme } from "./Theme";
import { cn } from "./utils";

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The theme context to apply, which modifies CSS variables */
  theme?: Theme;
  /** The stacked cards (1 or more React elements, typically `<Card>` components) */
  children?: React.ReactNode;
  /** Optional label displayed next to the counter in the header strip (e.g. "Pelaaja: Petri") */
  label?: React.ReactNode;
  /** Controlled active index (0-based) */
  activeIndex?: number;
  /** Default active index for uncontrolled mode (defaults to 0) */
  defaultActiveIndex?: number;
  /** Callback fired when the active card changes */
  onActiveIndexChange?: (index: number) => void;
  /** Maximum number of peeked background layers to render behind the active card (defaults to 2) */
  maxPeekLayers?: number;
  /** Whether to show the navigation controls bar (defaults to true) */
  showControls?: boolean;
  /** Accessible label for the card stack region */
  deckAriaLabel?: string;
}

/**
 * Organism that renders a stack of cards with physical deck layering and smooth
 * "deal to bottom" cycling animation.
 *
 * - **1 card:** Renders the single card directly without stack offsets or controls.
 * - **2–3 cards:** Displays 1 or 2 tactile peek layers behind the active card.
 * - **4+ cards:** Caps visual peek layers at 2 while adding a thick-deck affordance and counter.
 *
 * @summary card deck container; stacks cards with peek layers and deal-to-bottom cycling
 */
export const CardStack = React.forwardRef<HTMLDivElement, CardStackProps>(
  (
    {
      className,
      theme,
      children,
      label,
      activeIndex: controlledIndex,
      defaultActiveIndex = 0,
      onActiveIndexChange,
      maxPeekLayers = 2,
      showControls = true,
      deckAriaLabel,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const parentTheme = useCurrentTheme();
    const effectiveTheme = theme ?? parentTheme;
    const stackId = useId();

    // Extract valid element children
    const validChildren = React.Children.toArray(children).filter(React.isValidElement);
    const totalCards = validChildren.length;

    // Active card index state
    const isControlled = controlledIndex !== undefined;
    const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
    const activeIndex = isControlled ? controlledIndex : internalIndex;

    // Animation state for deal-to-bottom transition
    const [animatingDirection, setAnimatingDirection] = useState<"next" | "prev" | null>(null);

    const updateIndex = useCallback(
      (newIndex: number) => {
        if (!isControlled) {
          setInternalIndex(newIndex);
        }
        onActiveIndexChange?.(newIndex);
      },
      [isControlled, onActiveIndexChange],
    );

    const handleNext = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (totalCards <= 1 || animatingDirection !== null) return;

        // Respect reduced motion
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
          updateIndex((activeIndex + 1) % totalCards);
          return;
        }

        setAnimatingDirection("next");
        setTimeout(() => {
          updateIndex((activeIndex + 1) % totalCards);
          setAnimatingDirection(null);
        }, 220);
      },
      [totalCards, animatingDirection, activeIndex, updateIndex],
    );

    const handlePrev = useCallback(
      (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (totalCards <= 1 || animatingDirection !== null) return;

        // Respect reduced motion
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
          updateIndex((activeIndex - 1 + totalCards) % totalCards);
          return;
        }

        setAnimatingDirection("prev");
        setTimeout(() => {
          updateIndex((activeIndex - 1 + totalCards) % totalCards);
          setAnimatingDirection(null);
        }, 220);
      },
      [totalCards, animatingDirection, activeIndex, updateIndex],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (totalCards > 1) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        }
      }
      onKeyDown?.(e);
    };

    // Clean up animation on unmount
    useEffect(() => {
      setAnimatingDirection(null);
    }, []);

    if (totalCards === 0) {
      return null;
    }

    // ── Single card: render directly without stack overhead ──
    if (totalCards === 1) {
      return (
        <div
          ref={ref}
          data-theme={effectiveTheme}
          className={cn("w-full font-sans", className)}
          {...props}
        >
          {validChildren[0]}
        </div>
      );
    }

    // Determine how many peek layers to show (capped by maxPeekLayers and totalCards - 1)
    const peekCount = Math.min(maxPeekLayers, totalCards - 1);
    const isThickDeck = totalCards >= 4;
    const safeActiveIndex = ((activeIndex % totalCards) + totalCards) % totalCards;
    const currentCard = validChildren[safeActiveIndex];

    return (
      <section
        ref={ref}
        data-theme={effectiveTheme}
        aria-roledescription="korttipakka"
        aria-label={deckAriaLabel ?? (typeof label === "string" ? label : "Korttipakka")}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full font-sans flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] rounded-2xl transition-shadow",
          className,
        )}
        {...props}
      >
        {/* ── Deck Header & Controls ── */}
        {showControls && (
          <div
            id={`${stackId}-controls`}
            className="flex items-center justify-between mb-2.5 px-1 min-h-[1.75rem]"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {label && (
                <span className="font-bold text-xs uppercase tracking-wider text-text-muted truncate">
                  {label}
                </span>
              )}
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[length:var(--font-size-2xs)] font-black tracking-widest uppercase bg-[var(--theme-surface-tint)] text-[var(--theme-secondary)] border border-[var(--theme-border-soft)] shrink-0"
                aria-live="polite"
              >
                {safeActiveIndex + 1} / {totalCards}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="chevron"
                chevronDirection="left"
                size="compact"
                aria-label={`Edellinen kortti (näytetään ${safeActiveIndex === 0 ? totalCards : safeActiveIndex} / ${totalCards})`}
                onClick={handlePrev}
                disabled={animatingDirection !== null}
              />
              <Button
                variant="chevron"
                chevronDirection="right"
                size="compact"
                aria-label={`Seuraava kortti, siirrä pohjalle (näytetään ${((safeActiveIndex + 1) % totalCards) + 1} / ${totalCards})`}
                onClick={handleNext}
                disabled={animatingDirection !== null}
              />
            </div>
          </div>
        )}

        {/* ── Card Stack Deck Surface ── */}
        <div
          className={cn(
            "relative isolate w-full transition-all duration-300",
            peekCount > 0 ? "pb-3.5 tablet:pb-4" : "",
          )}
        >
          {/* Background Peek Layer 2 (furthest back, rendered when totalCards >= 3) */}
          {peekCount >= 2 && (
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-xl bg-[var(--theme-bg)] border-2 border-[var(--theme-border-soft)] pointer-events-none transition-all duration-300 ease-out z-0 origin-top",
                "translate-y-4 tablet:translate-y-5 scale-[0.96] opacity-60",
                isThickDeck &&
                  "shadow-[0_4px_0_0_var(--theme-border-soft),0_8px_0_0_color-mix(in_srgb,var(--theme-border-soft)_45%,transparent)]",
                animatingDirection === "next" &&
                  "translate-y-2.5 tablet:translate-y-3 scale-[0.98] opacity-80",
                animatingDirection === "prev" &&
                  "translate-y-6 tablet:translate-y-7 scale-[0.94] opacity-40",
              )}
            />
          )}

          {/* Background Peek Layer 1 (middle layer, rendered when totalCards >= 2) */}
          {peekCount >= 1 && (
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-xl bg-[var(--theme-bg)] border-2 border-[var(--theme-border-soft)] shadow-md pointer-events-none transition-all duration-300 ease-out z-10 origin-top",
                "translate-y-2 tablet:translate-y-2.5 scale-[0.98] opacity-80",
                animatingDirection === "next" && "translate-y-0 scale-100 opacity-100",
                animatingDirection === "prev" &&
                  "translate-y-4 tablet:translate-y-5 scale-[0.96] opacity-60",
              )}
            />
          )}

          {/* Foreground Active Card */}
          <div
            className={cn(
              "relative z-20 w-full transition-all duration-200 ease-out origin-center",
              animatingDirection === "next" &&
                "translate-x-8 -translate-y-3 rotate-2 scale-[1.01] opacity-75 shadow-lg",
              animatingDirection === "prev" &&
                "-translate-x-8 -translate-y-1 -rotate-2 scale-[0.98] opacity-75 shadow-lg",
            )}
          >
            {currentCard}
          </div>
        </div>
      </section>
    );
  },
);

CardStack.displayName = "CardStack";
