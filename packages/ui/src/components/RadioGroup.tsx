import React from "react";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { cn, obscureString } from "./utils";

export interface RadioGroupProps {
  /** The name attribute shared by all radio inputs in this group. */
  name: string;
  /** The currently selected value. */
  value?: string;
  /** Callback fired when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Optional group label. */
  label?: string;
  error?: string;
  theme?: Theme;
  /** Layout direction of the radio items. */
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  /** When true, blurs & disables the entire radio group with an obscured visual effect. */
  obscured?: boolean;
  children?: React.ReactNode;
}

export interface RadioGroupItemProps {
  /** The value this item represents. */
  value: string;
  /** Label displayed next to the radio indicator. */
  label: string;
  /** Optional helper text beneath the label. */
  description?: string;
  disabled?: boolean;
  /** When true, blurs & disables this individual radio item with an obscured visual effect. */
  obscured?: boolean;
}

const RadioGroupContext = React.createContext<{
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  obscured?: boolean;
}>({ name: "" });

export function RadioGroup({
  name,
  value,
  onValueChange,
  label,
  error,
  theme,
  orientation = "vertical",
  disabled,
  obscured: obscuredProp,
  children,
}: RadioGroupProps) {
  const obscured = obscuredProp || useObscured();
  const isDisabled = disabled || obscured;

  const contextValue = React.useMemo(
    () => ({ name, value, onValueChange, disabled: isDisabled, obscured }),
    [name, value, onValueChange, isDisabled, obscured],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex flex-col gap-2 mt-2",
          obscured && "select-none pointer-events-none",
        )}
        data-theme={theme}
        role="radiogroup"
        aria-label={label}
      >
        {label && (
          <span
            className={cn(
              "text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]",
              obscured && "blur-[5.5px]",
            )}
          >
            {obscured ? obscureString(label) : label}
          </span>
        )}
        <div
          className={cn(
            "flex gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          )}
        >
          {children}
        </div>
        {error && (
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]">
            {error}
          </span>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
}
RadioGroup.displayName = "RadioGroup";

export function RadioGroupItem({
  value,
  label,
  description,
  disabled: itemDisabled,
  obscured: itemObscured,
}: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const isObscured = itemObscured || ctx.obscured;
  const isDisabled = itemDisabled || ctx.disabled || isObscured;
  const isSelected = ctx.value === value;
  const inputId = React.useId();
  const glitchDuration = React.useMemo(() => isObscured ? 4 + Math.random() * 5 : 6, []);
  const glitchDelay = React.useMemo(() => isObscured ? Math.random() * 6 : 0, []);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-start gap-3 cursor-pointer group",
        isDisabled && "cursor-not-allowed opacity-50",
        isObscured && "select-none pointer-events-none",
      )}
    >
      <span
        className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center"
      >
        <input
          id={inputId}
          type="radio"
          name={ctx.name}
          value={value}
          checked={isSelected}
          disabled={isDisabled}
          onChange={() => ctx.onValueChange?.(value)}
          className="peer sr-only"
        />
        <span
          data-text={isObscured ? "x" : undefined}
          style={isObscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
          className={cn(
            "h-5 w-5 rounded-full border-2 border-[var(--theme-secondary)]/40 bg-[var(--theme-bg)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme-primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--theme-bg)]",
            isSelected && "border-[var(--theme-primary)]",
            isObscured && "blur-[1.5px] obscured-glitch",
          )}
        />
        {isSelected && (
          <span
            className={cn(
              "absolute h-2.5 w-2.5 rounded-full bg-[var(--theme-primary)] transition-transform scale-100 animate-in zoom-in duration-150",
              isObscured && "blur-[1.5px]",
            )}
          />
        )}
      </span>
      <span className="flex flex-col gap-0.5 select-none">
        <span
          data-text={isObscured ? obscureString(label) : undefined}
          className={cn(
            "text-sm font-black uppercase tracking-widest text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors",
            isObscured && "blur-[5.5px] obscured-glitch",
          )}
          style={isObscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
        >
          {isObscured ? obscureString(label) : label}
        </span>
        {description && (
          <span
            data-text={isObscured ? obscureString(description) : undefined}
            className={cn(
              "text-sm text-[var(--theme-secondary)]/70",
              isObscured && "blur-[5.5px] obscured-glitch",
            )}
            style={isObscured ? { '--glitch-delay': `-${glitchDelay.toFixed(2)}s`, '--glitch-duration': `${glitchDuration.toFixed(2)}s` } as React.CSSProperties : undefined}
          >
            {isObscured ? obscureString(description) : description}
          </span>
        )}
      </span>
    </label>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";
