import React from "react";
import { Badge } from "./Badge";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type SelectionState = "primary" | "secondary" | "none";

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectionCardGroupContext {
  value: { primary: string | null; secondary: string | null };
  onValueChange: (value: { primary: string | null; secondary: string | null }) => void;
  disabled?: boolean;
}

const SelectionCardGroupCtx = React.createContext<SelectionCardGroupContext | null>(null);

function useSelectionCardGroup(): SelectionCardGroupContext | null {
  return React.useContext(SelectionCardGroupCtx);
}

// ─── SelectionCardGroup ────────────────────────────────────────────────────────

export interface SelectionCardGroupProps {
  /**
   * Controlled value. `primary` holds the id of the card voted as first choice,
   * `secondary` holds the second choice.
   */
  value: { primary: string | null; secondary: string | null };
  onValueChange: (value: { primary: string | null; secondary: string | null }) => void;
  /** When true, all child cards are non-interactive. */
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Manages "one primary + one secondary" selection across a group of `SelectionCard`s.
 * Tapping an unselected card assigns it as primary if primary is empty, otherwise secondary.
 * Tapping an already-selected card cycles: primary → secondary → none.
 *
 * @summary controlled group managing primary+secondary card selection
 */
export function SelectionCardGroup({
  value,
  onValueChange,
  disabled,
  className,
  children,
}: SelectionCardGroupProps) {
  const ctx = React.useMemo(
    () => ({ value, onValueChange, disabled }),
    [value, onValueChange, disabled],
  );

  return (
    <SelectionCardGroupCtx.Provider value={ctx}>
      <div
        role="group"
        className={cn("grid grid-cols-1 tablet:grid-cols-2 gap-3", className)}
      >
        {children}
      </div>
    </SelectionCardGroupCtx.Provider>
  );
}
SelectionCardGroup.displayName = "SelectionCardGroup";

// ─── SelectionCard ─────────────────────────────────────────────────────────────

export interface SelectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /**
   * Unique identifier for this card within a `SelectionCardGroup`.
   * Required when used inside a group.
   */
  cardId?: string;
  /**
   * Explicit selection state — required when used standalone (without a group).
   * When inside a `SelectionCardGroup`, this is derived automatically.
   */
  selectionState?: SelectionState;
  /** Called when the user changes selection. Provides the new state. */
  onSelectionChange?: (state: SelectionState) => void;
  /**
   * When true, no interaction is possible and the card appears faded.
   * Use for closed voting rounds.
   */
  locked?: boolean;
  theme?: Theme;
  children: React.ReactNode;
}

/**
 * A card that can hold a primary, secondary, or no selection state.
 * Use standalone with `selectionState` + `onSelect`, or inside `SelectionCardGroup`
 * with a `cardId` for managed multi-selection.
 *
 * **Operational density variant** — uses `rounded-md` (not `rounded-xl`) and tighter
 * internal spacing to signal this is an action-oriented, dense card rather than an
 * informational surface. The interior is a named CSS grid with two rows:
 * - `meta`: urgency chip + selection badge (always aligned via `SelectionCardMeta`)
 * - `body`: title and description (via `SelectionCardBody`)
 *
 * @summary selectable card with primary/secondary/none states and glow feedback
 */
export const SelectionCard = React.forwardRef<HTMLDivElement, SelectionCardProps>(
  (
    {
      className,
      cardId,
      selectionState: selectionStateProp,
      onSelectionChange,
      locked = false,
      theme,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const group = useSelectionCardGroup();

    // Derive state from group context if available
    const selectionState: SelectionState = group && cardId
      ? group.value.primary === cardId
        ? "primary"
        : group.value.secondary === cardId
          ? "secondary"
          : "none"
      : (selectionStateProp ?? "none");

    const isDisabled = locked || (group?.disabled ?? false);

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
      onClick?.(e);
      if (e.defaultPrevented || isDisabled || !cardId) return;

      if (group) {
        // Group-managed cycling logic
        const { primary, secondary } = group.value;
        if (selectionState === "primary") {
          // Was primary → promote secondary to primary (so it keeps its vote),
          // rather than producing an orphaned secondary-only state that can't be saved.
          group.onValueChange({
            primary: secondary !== cardId ? secondary : null,
            secondary: null,
          });
        } else if (selectionState === "secondary") {
          // Was secondary → clear
          group.onValueChange({ primary, secondary: null });
        } else {
          // Unselected → assign as primary if empty, otherwise secondary
          if (!primary) {
            group.onValueChange({ primary: cardId, secondary });
          } else if (!secondary) {
            group.onValueChange({ primary, secondary: cardId });
          } else {
            // Both slots taken — replace secondary
            group.onValueChange({ primary, secondary: cardId });
          }
        }
      } else {
        // Standalone cycling
        const next: SelectionState =
          selectionState === "none" ? "primary"
            : selectionState === "primary" ? "secondary"
              : "none";
        onSelectionChange?.(next);
      }
    }

    return (
      <div
        ref={ref}
        data-theme={theme}
        data-selection={selectionState}
        role="radio"
        aria-checked={selectionState !== "none"}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        onClick={handleClick}
        className={cn(
          // ── Operational baseline ──────────────────────────────────────────
          // rounded-md (not rounded-xl) signals this is a dense, operational card
          "font-sans relative rounded-md border-2 bg-[var(--theme-bg)] text-[var(--theme-text)]",
          "transition-all duration-300 ease-in",
          // ── Inner layout: named grid rows ─────────────────────────────────
          // row 1 (meta): urgency chip + selection badge, always same height
          // row 2 (body): title + description
          "grid grid-rows-[auto_1fr] [grid-template-areas:'meta'_'body']",
          // ── Focus ring ────────────────────────────────────────────────────
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
          // ── Locked / disabled ─────────────────────────────────────────────
          isDisabled && "cursor-default opacity-60 grayscale-[30%]",
          // ── Interactive cursor when not locked ────────────────────────────
          !isDisabled && "cursor-pointer",
          // ── Selection states ──────────────────────────────────────────────
          selectionState === "none" && !isDisabled && [
            "border-[var(--theme-border-soft)] shadow-md",
            "hover:border-[var(--theme-border-medium)] hover:shadow-[0_0_14px_color-mix(in_srgb,var(--theme-secondary)_18%,transparent)] hover:-translate-y-0.5 hover:duration-200 hover:ease-out",
          ],
          selectionState === "primary" && [
            "border-[var(--theme-primary)] shadow-[0_0_18px_color-mix(in_srgb,var(--theme-primary)_28%,transparent)]",
            "bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--theme-bg))]",
          ],
          selectionState === "secondary" && [
            "border-[var(--theme-accent)] shadow-[0_0_14px_color-mix(in_srgb,var(--theme-accent)_22%,transparent)]",
            "bg-[color-mix(in_srgb,var(--theme-accent)_5%,var(--theme-bg))]",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SelectionCard.displayName = "SelectionCard";

// ─── SelectionCardMeta ─────────────────────────────────────────────────────────

/**
 * The top metadata row of a `SelectionCard`.
 * Renders a two-column grid: urgency chip (start) and selection badge (end).
 * Pass the card's current `selectionState` so the badge renders automatically.
 * A zero-width spacer reserves the badge column height even when the state is `none`,
 * keeping the meta row height stable across all cards in a group.
 *
 * @summary meta row: urgency/left-side chip + auto selection badge, subgrid-aligned
 */
export interface SelectionCardMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mirror the parent `SelectionCard`'s derived selectionState to render the badge. */
  selectionState: SelectionState;
}

export const SelectionCardMeta = React.forwardRef<HTMLDivElement, SelectionCardMetaProps>(
  ({ className, selectionState, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "[grid-area:meta] grid grid-cols-[1fr_auto] items-center gap-2",
        "px-3 pt-3 pb-2 border-b border-current/10",
        className,
      )}
      {...props}
    >
      {/* start column: urgency chip or any left-side meta */}
      <div className="flex items-center gap-1.5 min-w-0">
        {children}
      </div>

      {/* end column: selection state badge — always rendered to keep row height stable */}
      <div className="shrink-0">
        {selectionState === "primary" && (
          <Badge variant="solid" icon="alert-triangle">Ensisijainen</Badge>
        )}
        {selectionState === "secondary" && (
          <Badge variant="highlight" icon="compass">Toissijainen</Badge>
        )}
        {selectionState === "none" && (
          <span className="inline-block h-[1.5rem] w-0" aria-hidden />
        )}
      </div>
    </div>
  ),
);
SelectionCardMeta.displayName = "SelectionCardMeta";

// ─── SelectionCardBody ─────────────────────────────────────────────────────────

/**
 * The main content area of a `SelectionCard`.
 * Occupies the `body` grid area below `SelectionCardMeta`.
 *
 * @summary body area: title, description, and other card content
 */
export const SelectionCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "[grid-area:body] flex flex-col gap-1.5 px-3 py-2.5",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
SelectionCardBody.displayName = "SelectionCardBody";
