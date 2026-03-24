import React from "react";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
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
        <textarea
          ref={ref}
          disabled={isDisabled}
          placeholder={obscuredPlaceholder}
          value={obscuredValue}
          defaultValue={obscuredDefault}
          data-text={obscured ? obscureString(placeholder ?? "") : undefined}
          style={obscured ? glitchStyle : undefined}
          className={cn(
            "flex w-full rounded-sm border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] px-4 py-3 text-lg font-bold text-[var(--theme-text)] shadow-sm transition-all resize-none placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            variant === "monospace" && "font-mono text-sm font-normal",
            error &&
              "border-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]",
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
TextArea.displayName = "TextArea";
