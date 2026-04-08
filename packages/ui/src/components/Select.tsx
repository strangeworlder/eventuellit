import React from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
import { cn, obscureString } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label?: string;
  error?: string;
  theme?: Theme;
  options: SelectOption[];
  /** Placeholder shown as the first disabled option. */
  placeholder?: string;
  /** When true, blurs & disables the select with an obscured visual effect. */
  obscured?: boolean;
  /**
   * Controls the visual scale of the select.
   * - `"default"` — full-height (h-12) form select, large text
   * - `"compact"` — reduced height (h-7) for inline/density contexts, xs text
   * @default "default"
   */
  size?: "default" | "compact";
}

/**
 * Inline SVG chevron encoded as a data-URI for the custom dropdown arrow.
 * Uses currentColor so it inherits the text color of the select.
 */
const chevronDataUri =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")";

/**
 * Dropdown select control with label, error, placeholder, and obscure support.
 * Pass `options` as `{ value, label }` array. For multi-select use native HTML.
 * Use `size="compact"` for inline or density-sensitive contexts.
 *
 * @summary dropdown select with label/error/size; pass options array; supports obscured prop; size controls visual scale
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      theme,
      options,
      placeholder,
      obscured: obscuredProp,
      disabled,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const { glitchStyle } = useObscuredGlitch(obscured);

    return (
      <div
        className={cn(
          "flex flex-col w-full",
          size === "compact" ? "gap-1 mt-1" : "gap-2 mt-2",
          obscured && "select-none pointer-events-none",
        )}
        data-theme={theme}
      >
        {label && <FieldLabel obscured={obscured}>{label}</FieldLabel>}
        <select
          ref={ref}
          disabled={isDisabled}
          data-text={obscured ? obscureString(placeholder ?? options[0]?.label ?? "") : undefined}
          className={cn(
            "flex w-full appearance-none rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] font-bold text-[var(--theme-text)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            size === "default" && "h-12 px-4 py-2 pr-10 text-lg",
            size === "compact" && "h-7 px-2.5 py-0.5 pr-8 text-[length:var(--font-size-xs)]",
            error && "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
            obscured && "blur-[1.5px] obscured-glitch obscured-field",
            className,
          )}
          style={{
            backgroundImage: chevronDataUri,
            backgroundRepeat: "no-repeat",
            backgroundPosition: size === "compact" ? "right 0.5rem center" : "right 0.75rem center",
            backgroundSize: size === "compact" ? "0.75rem" : "1rem",
            ...(obscured ? (glitchStyle ?? {}) : {}),
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {obscured ? obscureString(placeholder) : placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {obscured ? obscureString(opt.label) : opt.label}
            </option>
          ))}
        </select>
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);
Select.displayName = "Select";
