import type React from "react";
import { cn, obscureString } from "./utils";

export interface FieldDescriptionProps {
  children: React.ReactNode;
  /** When true, blurs and scrambles the description text. */
  obscured?: boolean;
  /** Pre-computed glitch style from useObscuredGlitch(). */
  glitchStyle?: React.CSSProperties;
  className?: string;
}

/**
 * Standardised helper/description text used beneath labels in
 * Checkbox, RadioGroupItem and Switch.
 */
export function FieldDescription({
  children,
  obscured,
  glitchStyle,
  className,
}: FieldDescriptionProps) {
  return (
    <span
      data-text={obscured && typeof children === "string" ? obscureString(children) : undefined}
      className={cn(
        "text-sm text-text-muted",
        obscured && "blur-[5.5px] obscured-glitch",
        className,
      )}
      style={obscured ? glitchStyle : undefined}
    >
      {obscured && typeof children === "string" ? obscureString(children) : children}
    </span>
  );
}
FieldDescription.displayName = "FieldDescription";
