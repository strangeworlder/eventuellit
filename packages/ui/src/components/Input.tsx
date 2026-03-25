import React from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
import { cn, obscureString } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  theme?: Theme;
  /** When true, blurs & disables the input with an obscured visual effect. */
  obscured?: boolean;
}

/**
 * Single-line text input with optional label, error message, and obscure support.
 * The standard text field for all forms. Integrates with ObscuredWrapper context.
 *
 * @summary single-line text field with label/error; supports obscured prop for hidden content
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, theme, obscured: obscuredProp, disabled, placeholder, value, defaultValue, ...props }, ref) => {
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const { glitchStyle } = useObscuredGlitch(obscured);

    const obscuredPlaceholder = obscured && placeholder ? obscureString(placeholder) : placeholder;
    const obscuredValue = obscured && typeof value === "string" ? obscureString(value) : value;
    const obscuredDefault = obscured && typeof defaultValue === "string" ? obscureString(defaultValue) : defaultValue;

    return (
      <div
        className={cn(
          "flex flex-col w-full gap-2 mt-2",
          obscured && "select-none pointer-events-none",
        )}
        data-theme={theme}
      >
        {label && <FieldLabel obscured={obscured}>{label}</FieldLabel>}
        <input
          ref={ref}
          disabled={isDisabled}
          placeholder={obscuredPlaceholder}
          value={obscuredValue}
          defaultValue={obscuredDefault}
          data-text={obscured ? obscureString(placeholder ?? "") : undefined}
          style={obscured ? glitchStyle : undefined}
          className={cn(
            "flex h-12 w-full rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] px-4 py-2 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
            obscured && "blur-[1.5px] obscured-glitch obscured-field",
            className,
          )}
          {...props}
        />
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);
Input.displayName = "Input";
