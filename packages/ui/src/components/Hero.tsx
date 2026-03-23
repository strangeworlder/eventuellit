import React from "react";
import { Heading } from "./Heading";
import { cn } from "./utils";
import { ImageElement } from "./ImageElement";

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    backgroundImageSrc?: string;
    backgroundImageAlt?: string;
}

export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
    ({ title, description, children, className, backgroundImageSrc, backgroundImageAlt = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden border-b-2 border-[var(--theme-secondary)] mb-6 mt-0 bg-[var(--theme-bg)] text-[var(--theme-text)] min-h-40 tablet:min-h-48",
                    className
                )}
                {...props}
            >
                {!backgroundImageSrc && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg)] via-[var(--theme-secondary)]/15 to-[var(--theme-bg)]"
                    />
                )}
                {backgroundImageSrc && (
                    <>
                        <ImageElement
                            src={backgroundImageSrc}
                            alt={backgroundImageAlt || "Hero-kuva"}
                            variant="secondary"
                            sizes="100vw"
                            enableModal={false}
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 rounded-none border-0 overflow-hidden"
                            imgClassName="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[var(--theme-bg)]/75"
                        />
                    </>
                )}

                <div
                    className={cn(
                        "relative z-10 px-4 py-6 tablet:py-8 min-h-40 tablet:min-h-48 flex flex-col justify-center",
                        backgroundImageSrc && "pr-20"
                    )}
                >
                    <Heading>{title}</Heading>
                    {description && (
                        <p className="text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/90 mt-2">
                            {description}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        );
    }
);

Hero.displayName = "Hero";
