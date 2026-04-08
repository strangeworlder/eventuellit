import React from "react";
import { Heading, HeadingLevelProvider } from "./Heading";
import { cn } from "./utils";

export interface TextSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  /**
   * Optional utility controls rendered inline with the title (e.g. ToolButtons for edit/publish).
   * Only rendered when `title` is also provided.
   */
  actions?: React.ReactNode;
  /**
   * `default` – plain section with no border (original behaviour).
   * `bordered` – adds a subtle bottom separator under the heading row, giving article-level
   * structure without the full visual weight of a Card.
   */
  variant?: "default" | "bordered";
  headingClassName?: string;
}

/**
 * A reusable `<section>` container that optionally renders an auto-levelled heading.
 * Use to group paragraphs in long-form content with consistent vertical rhythm.
 *
 * Use `variant="bordered"` with the `actions` slot for article-length content that needs
 * a visible section boundary and inline utility controls (edit, publish, hide) without
 * the heavy container treatment of a Card.
 *
 * @summary section container with optional auto-levelled heading; use in long-form article content
 */
export const TextSection = React.forwardRef<HTMLElement, TextSectionProps>(
  (
    { className, title, actions, variant = "default", headingClassName, children, ...props },
    ref,
  ) => {
    const hasTitleRow = title || actions;
    return (
      <section ref={ref} className={cn("flex flex-col mt-8 gap-4", className)} {...props}>
        <HeadingLevelProvider>
          {hasTitleRow && (
            <div
              className={cn(
                "flex flex-row items-center justify-between gap-3",
                variant === "bordered" && "border-b-2 border-[var(--theme-border-soft)] pb-3",
              )}
            >
              {title && <Heading className={cn(headingClassName)}>{title}</Heading>}
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
          )}
          {children}
        </HeadingLevelProvider>
      </section>
    );
  },
);

TextSection.displayName = "TextSection";
