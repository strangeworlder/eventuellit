import React from "react";
import { Heading } from "./Heading";
import { cn } from "./Heading"; // assuming cn is exported from Heading, wait no, let me check Heading.tsx

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
}

export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
    ({ title, description, children, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "border-b-2 border-[var(--theme-secondary)] pb-4 mb-6 mt-6 bg-[var(--theme-bg)] text-[var(--theme-text)] px-4",
                    className
                )}
                {...props}
            >
                <Heading>{title}</Heading>
                {description && (
                    <p className="text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/80 mt-2">
                        {description}
                    </p>
                )}
                {children}
            </div>
        );
    }
);

Hero.displayName = "Hero";
