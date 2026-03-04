import React from "react";
import { Heading } from "./Heading";
import { cn } from "./Heading";

export interface TextSectionProps extends React.HTMLAttributes<HTMLElement> {
    title?: string;
    headingClassName?: string;
}

/**
 * A reusable container for text sections, optionally rendering a title heading.
 */
export const TextSection = React.forwardRef<HTMLElement, TextSectionProps>(
    ({ className, title, headingClassName = "mb-4", children, ...props }, ref) => {
        return (
            <section ref={ref} className={cn("flex flex-col mt-8", className)} {...props}>
                {title && <Heading className={headingClassName}>{title}</Heading>}
                {children}
            </section>
        );
    }
);

TextSection.displayName = "TextSection";
