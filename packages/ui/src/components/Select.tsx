import React from "react";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  theme?: Theme;
  options: SelectOption[];
  /** Placeholder shown as the first disabled option. */
  placeholder?: string;
  /** When true, blurs & disables the select with an obscured visual effect. */
  obscured?: boolean;
}

/**
 * Inline SVG chevron encoded as a data-URI for the custom dropdown arrow.
 * Uses currentColor so it inherits the text color of the select.
 */
const chevronDataUri =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, theme, options, placeholder, obscured: obscuredProp, disabled, ...props },
    ref,
  ) => {
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const glitchDuration = React.useMemo(() => obscured ? 4 + Math.random() * 5 : 6, []);
    const glitchDelay = React.useMemo(() => obscured ? Math.random() * 6 : 0, []);

    return (
      <div
        className={cn(
          "flex flex-col w-full gap-2 mt-2",
          obscured && "select-none pointer-events-none",
        )}
        data-theme={theme}
      >
        {label && (
          <label
            className={cn(
              "text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]",
              obscured && "blur-[5.5px]",
            )}
          >
            {obscured ? obscureString(label) : label}
          </label>
        )}
        <select
          ref={ref}
          disabled={isDisabled}
          data-text={obscured ? obscureString(placeholder ?? options[0]?.label ?? "") : undefined}
          className={cn(
            "flex h-12 w-full appearance-none rounded-sm border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] px-4 py-2 pr-10 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
            obscured && "blur-[1.5px] obscured-glitch obscured-field",
            className,
          )}
          style={{
            backgroundImage: chevronDataUri,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
            ...(obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : {}),
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
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
