import React from "react";
import { cn, obscureString } from "./utils";

export interface FieldLabelProps {
  children: React.ReactNode;
  /** When true, blurs and scrambles the label text. */
  obscured?: boolean;
  /** HTML `for` attribute linking to the input element. */
  htmlFor?: string;
  className?: string;
}

/**
 * Standardised form-field label used across Input, TextArea, Select,
 * RadioGroup, Checkbox and Switch.
 */
export function FieldLabel({
  children,
  obscured,
  htmlFor,
  className,
}: FieldLabelProps) {
  const Tag = htmlFor ? "label" : "span";

  return (
    <Tag
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]",
        obscured && "blur-[5.5px]",
        className,
      )}
    >
      {obscured && typeof children === "string"
        ? obscureString(children)
        : children}
    </Tag>
  );
}
FieldLabel.displayName = "FieldLabel";
