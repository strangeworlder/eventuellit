import React from "react";
import { FieldDescription } from "./FieldDescription";
import { FieldError } from "./FieldError";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
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

/**
 * Binary on/off toggle with label and optional description.
 * Use instead of Checkbox when the action takes immediate effect (no form submit needed).
 *
 * @summary immediate-effect binary toggle; use Checkbox when toggle is part of a submitted form
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, error, theme, id, checked, obscured: obscuredProp, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const { glitchStyle } = useObscuredGlitch(obscured);

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
            data-text={obscured ? "x" : undefined}
            style={obscured ? glitchStyle : undefined}
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
                  ? "bg-[var(--theme-secondary)] border-[var(--theme-secondary)]"
                  : "bg-[var(--theme-surface-tint)] border-[var(--theme-border-soft)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme-secondary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--theme-bg)]",
                obscured && "blur-[1.5px] obscured-glitch",
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
              data-text={obscured ? obscureString(label) : undefined}
              className={cn(
                "text-sm font-black uppercase tracking-widest text-[var(--theme-text)] group-hover:text-[var(--theme-secondary)] transition-colors",
                obscured && "blur-[5.5px] obscured-glitch",
              )}
              style={obscured ? glitchStyle : undefined}
            >
              {obscured ? obscureString(label) : label}
            </span>
            {description && (
              <FieldDescription obscured={obscured} glitchStyle={glitchStyle}>
                {description}
              </FieldDescription>
            )}
          </span>
        </label>
        {error && <FieldError className="pl-14">{error}</FieldError>}
      </div>
    );
  },
);
Switch.displayName = "Switch";
