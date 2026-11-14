import React from "react";
import { FieldDescription } from "./FieldDescription";
import { FieldError } from "./FieldError";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
import { cn, obscureString } from "./utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
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
  (
    { className, label, description, error, theme, id, obscured: obscuredProp, disabled, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const contextObscured = useObscured();
    const obscured = Boolean(obscuredProp || contextObscured);
    const isDisabled = disabled || obscured;
    const { glitchStyle } = useObscuredGlitch(obscured);

    return (
      <div
        className={cn("flex flex-col gap-1 mt-2", obscured && "select-none pointer-events-none")}
        data-theme={theme}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-start gap-3 cursor-pointer group",
            isDisabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              disabled={isDisabled}
              className="peer sr-only"
              {...props}
            />
            <span
              aria-disabled={isDisabled || undefined}
              data-text={obscured ? "x" : undefined}
              style={obscured ? glitchStyle : undefined}
              className={cn(
                "ds-checkbox-box flex h-5 w-5 items-center justify-center rounded-[5px] ds-input-surface text-transparent transition-all duration-150",
                !isDisabled && "group-hover:border-[var(--theme-border-medium)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme-secondary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--theme-bg)]",
                error && "border-[var(--theme-accent)]",
                obscured && "blur-[1.5px] obscured-glitch",
                className,
              )}
            >
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
              </svg>
            </span>
          </span>
          <span className="flex flex-col gap-0.5 select-none">
            <span
              data-text={obscured ? obscureString(label) : undefined}
              className={cn(
                "font-sans text-sm font-medium text-[var(--theme-text)] transition-colors",
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
