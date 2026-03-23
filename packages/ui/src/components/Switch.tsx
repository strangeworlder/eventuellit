import React from "react";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Primary label rendered beside the switch. */
  label: string;
  /** Optional helper text shown beneath the label. */
  description?: string;
  error?: string;
  theme?: Theme;
  /** When true, blurs & disables the switch with an obscured visual effect. */
  obscured?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, error, theme, id, checked, obscured: obscuredProp, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const glitchDuration = React.useMemo(() => obscured ? 4 + Math.random() * 5 : 6, []);
    const glitchDelay = React.useMemo(() => obscured ? Math.random() * 6 : 0, []);

    return (
      <div
        className={cn(
          "flex flex-col gap-1 mt-2",
          obscured && "select-none pointer-events-none",
        )}
        data-theme={theme}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-start gap-3 cursor-pointer group",
            isDisabled && "cursor-not-allowed opacity-50",
          )}
        >
          {/* Track + Thumb */}
          <span
            className="relative mt-0.5 shrink-0"
            data-obscured={obscured ? "x" : undefined}
            style={obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
          >
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              role="switch"
              aria-checked={checked}
              checked={checked}
              disabled={isDisabled}
              className="peer sr-only"
              {...props}
            />
            <span
              className={cn(
                "block h-6 w-11 rounded-full border-2 transition-colors",
                checked
                  ? "bg-[var(--theme-primary)] border-[var(--theme-primary)]"
                  : "bg-[var(--theme-secondary)]/20 border-[var(--theme-secondary)]/40",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme-primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--theme-bg)]",
                obscured && "blur-[1.5px] btn-obscured-glitch",
              )}
            />
            <span
              className={cn(
                "absolute top-1 left-1 h-4 w-4 rounded-full transition-transform duration-200",
                checked
                  ? "translate-x-5 bg-[var(--theme-primary-foreground)]"
                  : "translate-x-0 bg-[var(--theme-secondary)]",
                obscured && "blur-[1.5px]",
              )}
            />
          </span>
          <span className="flex flex-col gap-0.5 select-none">
            <span
              className={cn(
                "text-sm font-black uppercase tracking-widest text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors",
                obscured && "blur-[5.5px]",
              )}
            >
              {obscured ? obscureString(label) : label}
            </span>
            {description && (
              <span
                className={cn(
                  "text-sm text-[var(--theme-secondary)]/70",
                  obscured && "blur-[5.5px]",
                )}
              >
                {obscured ? obscureString(description) : description}
              </span>
            )}
          </span>
        </label>
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)] pl-14">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Switch.displayName = "Switch";
