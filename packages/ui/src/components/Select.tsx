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
   * - `"default"` — full-height (h-11) form select
   * - `"compact"` — reduced height (h-7) for inline/density contexts, xs text
   * @default "default"
   */
  size?: "default" | "compact";
}

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
    const contextObscured = useObscured();
    const obscured = Boolean(obscuredProp || contextObscured);
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
        <div className="relative">
          <select
            ref={ref}
            disabled={isDisabled}
            data-text={obscured ? obscureString(placeholder ?? options[0]?.label ?? "") : undefined}
            style={obscured ? glitchStyle : undefined}
            className={cn(
              "flex w-full appearance-none rounded-md ds-input-surface font-sans font-normal text-[var(--theme-text)] transition-all duration-150 focus-visible:outline-none focus-visible:border-[var(--theme-secondary)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--theme-secondary)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
              size === "default" && "h-11 px-3.5 py-2 pr-10 text-base",
              size === "compact" && "h-7 px-2.5 py-0.5 pr-8 text-[length:var(--font-size-xs)]",
              error &&
                "border-[var(--theme-accent)] focus-visible:border-[var(--theme-accent)] focus-visible:ring-[color-mix(in_srgb,var(--theme-accent)_30%,transparent)]",
              obscured && "blur-[1.5px] obscured-glitch obscured-field",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[var(--theme-bg)] text-text-muted">
                {obscured ? obscureString(placeholder) : placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[var(--theme-bg)] text-[var(--theme-text)]"
              >
                {obscured ? obscureString(opt.label) : opt.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center text-text-muted",
              size === "compact" ? "right-2" : "right-3",
              isDisabled && "opacity-50",
              obscured && "blur-[1.5px]",
            )}
          >
            <svg
              aria-hidden="true"
              width={size === "compact" ? 12 : 16}
              height={size === "compact" ? 12 : 16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </span>
        </div>
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  },
);
Select.displayName = "Select";
