import React from "react";
import { FieldDescription } from "./FieldDescription";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { useObscured } from "./ObscuredWrapper";
import type { Theme } from "./Theme";
import { useObscuredGlitch } from "./useObscuredGlitch";
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

/**
 * Single-choice radio group with label, error, and vertical/horizontal orientation.
 * Compose with `RadioGroupItem` children. For a binary immediate-effect toggle use Switch.
 *
 * @summary single-choice radio group; compose with RadioGroupItem; orientation: vertical/horizontal
 */
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
        className={cn("flex flex-col gap-2 mt-2", obscured && "select-none pointer-events-none")}
        data-theme={theme}
        role="radiogroup"
        aria-label={label}
      >
        {label && <FieldLabel obscured={obscured}>{label}</FieldLabel>}
        <div
          className={cn(
            "flex gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          )}
        >
          {children}
        </div>
        {error && <FieldError>{error}</FieldError>}
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
  const { glitchStyle } = useObscuredGlitch(isObscured ?? false);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-start gap-3 cursor-pointer group",
        isDisabled && "cursor-not-allowed opacity-50",
        isObscured && "select-none pointer-events-none",
      )}
    >
      <span className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
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
          style={isObscured ? glitchStyle : undefined}
          className={cn(
            "h-5 w-5 rounded-full border-2 border-[var(--theme-border-medium)] bg-[var(--theme-bg)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme-secondary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--theme-bg)]",
            isSelected && "border-[var(--theme-secondary)]",
            isObscured && "blur-[1.5px] obscured-glitch",
          )}
        />
        {isSelected && (
          <span
            className={cn(
              "absolute h-2.5 w-2.5 rounded-full bg-[var(--theme-secondary)] transition-transform scale-100 animate-in zoom-in duration-150",
              isObscured && "blur-[1.5px]",
            )}
          />
        )}
      </span>
      <span className="flex flex-col gap-0.5 select-none">
        <span
          data-text={isObscured ? obscureString(label) : undefined}
          className={cn(
            "text-sm font-black uppercase tracking-widest text-[var(--theme-text)] group-hover:text-[var(--theme-secondary)] transition-colors",
            isObscured && "blur-[5.5px] obscured-glitch",
          )}
          style={isObscured ? glitchStyle : undefined}
        >
          {isObscured ? obscureString(label) : label}
        </span>
        {description && (
          <FieldDescription obscured={isObscured} glitchStyle={glitchStyle}>
            {description}
          </FieldDescription>
        )}
      </span>
    </label>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";
