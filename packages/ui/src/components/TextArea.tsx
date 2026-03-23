import React from "react";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  theme?: Theme;
  /** "monospace" applies a mono font suited for code/markdown editors. */
  variant?: "default" | "monospace";
  /** When true, blurs & disables the textarea with an obscured visual effect. */
  obscured?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, label, error, theme, variant = "default", obscured: obscuredProp, disabled, placeholder, value, defaultValue, ...props },
    ref,
  ) => {
    const obscured = obscuredProp || useObscured();
    const isDisabled = disabled || obscured;
    const glitchDuration = React.useMemo(() => obscured ? 4 + Math.random() * 5 : 6, []);
    const glitchDelay = React.useMemo(() => obscured ? Math.random() * 6 : 0, []);

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
        <textarea
          ref={ref}
          disabled={isDisabled}
          placeholder={obscuredPlaceholder}
          value={obscuredValue}
          defaultValue={obscuredDefault}
          data-obscured={obscured ? obscureString(placeholder ?? "") : undefined}
          style={obscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
          className={cn(
            "flex w-full rounded-sm border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] px-4 py-3 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all resize-none placeholder:text-[var(--theme-secondary)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            variant === "monospace" && "font-mono text-sm font-normal",
            error &&
              "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
            obscured && "blur-[1.5px] btn-obscured-glitch obscured-field",
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]">
            {error}
          </span>
        )}
      </div>
    );
  },
);
TextArea.displayName = "TextArea";
