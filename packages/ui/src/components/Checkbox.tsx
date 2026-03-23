import React from "react";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Primary label rendered beside the checkbox. */
  label: string;
  /** Optional helper text shown beneath the label. */
  description?: string;
  error?: string;
  theme?: Theme;
  /** When true, blurs & disables the checkbox with an obscured visual effect. */
  obscured?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, theme, id, obscured: obscuredProp, disabled, ...props }, ref) => {
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
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={isDisabled}
            data-text={obscured ? "x" : undefined}
            style={obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
            className={cn(
              "mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] accent-[var(--theme-primary)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] disabled:cursor-not-allowed",
              error && "border-[var(--theme-accent)]",
              obscured && "blur-[1.5px] obscured-glitch",
              className,
            )}
            {...props}
          />
          <span className="flex flex-col gap-0.5 select-none">
            <span
              data-text={obscured ? obscureString(label) : undefined}
              className={cn(
                "text-sm font-black uppercase tracking-widest text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors",
                obscured && "blur-[5.5px] obscured-glitch",
              )}
              style={obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
            >
              {obscured ? obscureString(label) : label}
            </span>
            {description && (
              <span
                data-text={obscured ? obscureString(description) : undefined}
                className={cn(
                  "text-sm text-[var(--theme-secondary)]/70",
                  obscured && "blur-[5.5px] obscured-glitch",
                )}
                style={obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
              >
                {obscured ? obscureString(description) : description}
              </span>
            )}
          </span>
        </label>
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)] pl-8">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
