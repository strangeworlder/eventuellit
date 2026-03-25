import React from "react";
import { FieldDescription } from "./FieldDescription";
import { FieldError } from "./FieldError";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
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

/**
 * Single checkbox with label, optional description, and error message.
 * For grouped single-choice use RadioGroup; for an immediate-effect binary toggle use Switch.
 *
 * @summary single checkbox with label/description/error; for single-choice groups use RadioGroup
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, theme, id, obscured: obscuredProp, disabled, ...props }, ref) => {
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
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={isDisabled}
            data-text={obscured ? "x" : undefined}
            style={obscured ? glitchStyle : undefined}
            className={cn(
              "mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] accent-[var(--theme-secondary)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] disabled:cursor-not-allowed",
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
        {error && <FieldError className="pl-8">{error}</FieldError>}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
