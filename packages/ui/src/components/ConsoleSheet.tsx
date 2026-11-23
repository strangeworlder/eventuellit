import React from "react";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type ConsoleSheetSnap = "peek" | "half" | "full";

export interface ConsoleSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls sheet visibility. */
  open?: boolean;
  /** Monospace uppercase telemetry code above the title. */
  headerCode?: string;
  /** Primary sheet title. */
  title: string;
  /** Optional muted subtitle below the title. */
  subtitle?: string;
  /** Optional status pill or badge rendered on the right of the header. */
  statusSlot?: React.ReactNode;
  /** Optional sticky footer strip (always visible when not in peek state). */
  footer?: React.ReactNode;
  /** Initial snap height when uncontrolled on mobile viewports. */
  defaultSnap?: ConsoleSheetSnap;
  /** Controlled snap height (`peek` | `half` | `full`). */
  snap?: ConsoleSheetSnap;
  /** Callback when snap height changes. */
  onSnapChange?: (snap: ConsoleSheetSnap) => void;
  /** Called when the close button is clicked. */
  onClose?: () => void;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

const NEXT_SNAP: Record<ConsoleSheetSnap, ConsoleSheetSnap> = {
  peek: "half",
  half: "full",
  full: "peek",
};

const SNAP_LABELS: Record<ConsoleSheetSnap, string> = {
  peek: "Laajenna paneeli puolikorkeaan tilaan",
  half: "Laajenna paneeli täyteen korkeuteen",
  full: "Pienennä paneeli tiiviiksi palkiksi",
};

/**
 * Elevated floating HUD window layered above the starfield and ship stage.
 * Adapts from a 3-position mobile bottom sheet above the thumb dock (`peek` / `half` / `full`)
 * to a docked right-hand floating console panel on desktop viewports.
 *
 * @summary elevated floating HUD window with mobile snap heights and desktop side-panel mode
 */
export const ConsoleSheet = React.forwardRef<HTMLDivElement, ConsoleSheetProps>(
  (
    {
      className,
      open = true,
      headerCode,
      title,
      subtitle,
      statusSlot,
      footer,
      defaultSnap = "half",
      snap: controlledSnap,
      onSnapChange,
      onClose,
      theme,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalSnap, setInternalSnap] = React.useState<ConsoleSheetSnap>(defaultSnap);
    const activeSnap = controlledSnap ?? internalSnap;

    if (!open) return null;

    const handleCycleSnap = () => {
      const next = NEXT_SNAP[activeSnap];
      if (controlledSnap === undefined) {
        setInternalSnap(next);
      }
      onSnapChange?.(next);
    };

    const isPeek = activeSnap === "peek";

    return (
      <section
        ref={ref}
        data-theme={theme}
        data-snap={activeSnap}
        aria-label={title}
        className={cn(
          "pointer-events-auto font-sans flex flex-col text-[var(--theme-text)] transition-[height,max-height] duration-200 ease-out drop-shadow-[0_18px_36px_rgb(0_0_0_/_0.5)]",
          "absolute left-2 right-2 bottom-2 tablet:left-4 tablet:right-4 tablet:bottom-3",
          activeSnap === "peek" && "h-auto max-h-[5.5rem]",
          activeSnap === "half" && "h-[58%] max-h-[calc(100%-0.75rem)]",
          activeSnap === "full" && "h-[calc(100%-0.75rem)] max-h-[calc(100%-0.75rem)]",
          "desktop:static desktop:w-full",
          activeSnap === "peek"
            ? "desktop:h-auto desktop:max-h-[6.5rem]"
            : "desktop:h-full desktop:max-h-none",
          className,
        )}
        {...props}
      >
        <div className="ds-console-bezel flex flex-col flex-1 min-h-0 w-full">
          <div className="ds-console-bezel-body flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* 2px EGA four-scale telemetry horizon accent */}
            <div
              aria-hidden="true"
              className="h-[2px] w-full shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--theme-dawn) 0%, var(--theme-secondary) 38%, var(--theme-accent) 72%, var(--theme-primary) 100%)",
              }}
            />

            {/* Header / mobile handle */}
            <div className="ds-console-sheet-header shrink-0 px-3.5 py-2.5 tablet:px-4">
              {/* Touch drag visual pill on mobile/tablet */}
              <div className="flex justify-center pb-1.5 desktop:hidden">
                <span
                  aria-hidden="true"
                  className="h-1 w-10 rounded-full bg-[var(--theme-cockpit-border)]"
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-0.5">
                  {headerCode && (
                    <div className="flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--theme-dawn-muted)] leading-snug">
                      <span
                        aria-hidden="true"
                        className="inline-block w-1.5 h-1.5 rotate-45 bg-[var(--theme-dawn)] shrink-0"
                      />
                      <span>{headerCode}</span>
                    </div>
                  )}
                  <div className="font-heading text-base tablet:text-lg font-bold tracking-wide text-[var(--theme-text)] leading-snug">
                    {title}
                  </div>
                  {subtitle && !isPeek && (
                    <div className="font-sans text-sm text-text-muted leading-snug">{subtitle}</div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCycleSnap}
                    aria-label={SNAP_LABELS[activeSnap]}
                    title={SNAP_LABELS[activeSnap]}
                    className={cn(
                      "inline-flex desktop:hidden items-center justify-center min-h-9 min-w-9 rounded-[3px] cursor-pointer transition-colors",
                      "border border-[var(--theme-cockpit-border)] bg-[var(--theme-cockpit-elevated)] text-[var(--theme-text)]",
                      "hover:text-[var(--theme-secondary)] hover:border-[var(--theme-secondary)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
                    )}
                  >
                    <Icon
                      name={activeSnap === "full" ? "chevron-down" : "chevron-up"}
                      size={16}
                      aria-hidden="true"
                    />
                  </button>

                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Sulje ikkuna"
                      title="Sulje"
                      className={cn(
                        "inline-flex items-center justify-center min-h-9 min-w-9 rounded-[3px] cursor-pointer transition-colors",
                        "border border-[var(--theme-cockpit-border)] bg-[var(--theme-cockpit-elevated)] text-[var(--theme-text)]",
                        "hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)]",
                      )}
                    >
                      <Icon name="x" size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {!isPeek && statusSlot && (
                <div className="mt-2 flex flex-wrap items-center gap-2">{statusSlot}</div>
              )}
            </div>

            {/* Scrollable interior body */}
            {!isPeek && (
              <div className="flex-1 min-h-0 overflow-y-auto p-3.5 tablet:p-4 space-y-3 select-text">
                {children}
              </div>
            )}

            {/* Sticky action footer */}
            {!isPeek && footer && (
              <div className="shrink-0 border-t border-[var(--theme-cockpit-border-soft)] bg-[var(--theme-cockpit-header)] px-3.5 py-2.5 tablet:px-4">
                {footer}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

ConsoleSheet.displayName = "ConsoleSheet";
