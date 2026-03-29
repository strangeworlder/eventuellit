import React from "react";
import { Heading } from "./Heading";
import { cn } from "./utils";

export interface TextSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  headingClassName?: string;
}

/**
 * A reusable `<section>` container that optionally renders an auto-levelled heading.
 * Use to group paragraphs in long-form content with consistent vertical rhythm.
 *
 * @summary section container with optional auto-levelled heading; use in long-form article content
 */
export const TextSection = React.forwardRef<HTMLElement, TextSectionProps>(
  ({ className, title, headingClassName = "mb-4", children, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("flex flex-col mt-8", className)} {...props}>
        {title && <Heading className={headingClassName}>{title}</Heading>}
        {children}
      </section>
    );
  },
);

TextSection.displayName = "TextSection";
