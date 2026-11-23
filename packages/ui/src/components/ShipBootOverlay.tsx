import React from "react";
import { Icon } from "./Icon";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface ShipBootOverlayProps {
  /** Controls visibility of the terminal handshake overlay. */
  open: boolean;
  /** Ship identifier rendered in the center telemetry lockup. */
  shipName?: string;
  /** Ship hull / OS designation code. */
  callsign?: string;
  /** Live ship status banner displayed at completion of the handshake. */
  statusLine?: string;
  /** Boot animation duration in milliseconds before calling `onComplete`. */
  durationMs?: number;
  /** Invoked when the handshake completes or the user skips it. */
  onComplete: () => void;
  /** Scoped `data-theme` applied to the overlay surface. */
  theme?: Theme;
}

const BOOT_DIAGNOSTICS = [
  "OHJAINLEVY TUNNISTETTU: ARKKITEHTUURISTANDARDI",
  "SISÄINEN ÄÄNI -RUNKOLINKKI SYNKRONOITU",
  "ALKUPERÄINEN TUNNISTE KORRUPTOITUNUT: AAMUNKOI",
] as const;

/**
 * Full-viewport retro-space-opera OS handshake animation triggered when entering Aamunkoi.
 * Immediately skippable by click or keyboard (`Escape`, `Enter`, `Space`) and honours `prefers-reduced-motion`.
 *
 * @summary skippable ship OS terminal boot animation respecting data-theme tokens
 */
export function ShipBootOverlay({
  open,
  shipName = "AAMUNKOI",
  callsign = "Runko 150 m",
  statusLine = "Asemien välisessä varjossa",
  durationMs = 1400,
  onComplete,
  theme,
}: ShipBootOverlayProps) {
  const [step, setStep] = React.useState(0);
  const completedRef = React.useRef(false);

  const triggerComplete = React.useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  React.useEffect(() => {
    if (!open) {
      completedRef.current = false;
      setStep(0);
      return;
    }

    completedRef.current = false;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const totalMs = prefersReducedMotion ? 150 : Math.max(400, durationMs);
    const t1 = window.setTimeout(() => setStep(1), Math.round(totalMs * 0.25));
    const t2 = window.setTimeout(() => setStep(2), Math.round(totalMs * 0.55));
    const t3 = window.setTimeout(() => setStep(3), Math.round(totalMs * 0.8));
    const tDone = window.setTimeout(() => triggerComplete(), totalMs);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        triggerComplete();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(tDone);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, durationMs, triggerComplete]);

  if (!open) return null;

  return (
    <div
      data-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label="Aluksen päätteen käynnistys"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-6 select-none",
        "bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans",
      )}
    >
      <button
        type="button"
        aria-label="Ohita aluksen päätteen käynnistys"
        onClick={triggerComplete}
        className="absolute inset-0 w-full h-full cursor-pointer border-0 bg-transparent"
      />

      <div
        className="pointer-events-none relative z-10 w-full max-w-xl border border-[var(--theme-secondary)] bg-[var(--theme-surface-tint)] p-6 tablet:p-8 shadow-[0_0_40px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)]"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--theme-border-soft)] pb-4 mb-5">
          <div className="flex items-center gap-2.5 text-[var(--theme-secondary)]">
            <Icon name="compass" size={20} aria-hidden="true" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider">
              {callsign}
            </span>
          </div>
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            YHTEYS AVATAAN
          </span>
        </div>

        <div className="space-y-4">
          <div className="font-heading text-3xl tablet:text-4xl font-black uppercase tracking-wider text-[var(--theme-text)]">
            {shipName}
          </div>

          <div className="space-y-2 border-l-2 border-[var(--theme-secondary)] pl-4">
            {BOOT_DIAGNOSTICS.map((line, idx) => {
              const visible = step > idx;
              return (
                <div
                  key={line}
                  className={cn(
                    "flex items-center gap-2 font-heading text-xs tablet:text-sm font-semibold tracking-wider transition-colors duration-200",
                    visible ? "text-[var(--theme-text)]" : "text-text-placeholder",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block w-2 h-2 shrink-0",
                      visible ? "bg-[var(--theme-secondary)]" : "bg-[var(--theme-border-medium)]",
                    )}
                  />
                  <span>{line}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 font-sans text-sm text-text-muted">{`Tila: ${statusLine}`}</div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--theme-border-soft)] flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-text-muted">
          <span className="font-heading font-semibold uppercase tracking-wide">
            Kansikartta ja järjestelmät valmiina
          </span>
          <span>Ohita painamalla Esc tai klikkaamalla</span>
        </div>
      </div>
    </div>
  );
}

ShipBootOverlay.displayName = "ShipBootOverlay";
