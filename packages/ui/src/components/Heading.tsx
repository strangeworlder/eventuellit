import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility function to merge tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, as: Component = "h2", variant, ...props }, ref) => {
        const activeVariant = variant || Component;

        return (
            <Component
                ref={ref}
                className={cn(
                    "font-bold tracking-tight",
                    {
                        "font-heading text-5xl uppercase text-[var(--theme-text)]": activeVariant === "h1",
                        "font-heading text-4xl text-[var(--theme-primary)]": activeVariant === "h2",
                        "font-heading text-3xl text-[var(--theme-text)]": activeVariant === "h3",
                        "font-sans text-2xl text-[var(--theme-secondary)]": activeVariant === "h4",
                        "font-sans text-xl text-[var(--theme-text)]": activeVariant === "h5",
                        "font-sans text-lg text-[var(--theme-text)]": activeVariant === "h6",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Heading.displayName = "Heading";
