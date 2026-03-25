import React from "react";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { cn } from "./utils";
import { ImageElement } from "./ImageElement";
import { HeroCanvas } from "./HeroCanvas";

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    backgroundImageSrc?: string;
    backgroundImageAlt?: string;
}

/**
 * Full-width page header section with title, description, optional background image,
 * and a children slot for CTAs or sub-content. Includes the `HeroCanvas` starfield animation.
 *
 * @summary full-width page header with title, description, background image, and CTA slot
 */
export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
    ({ title, description, children, className, backgroundImageSrc, backgroundImageAlt = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden border-b-2 border-[var(--theme-secondary)] bg-[var(--theme-bg)] text-[var(--theme-text)] min-h-40 tablet:min-h-48",
                    className
                )}
                {...props}
            >
                {!backgroundImageSrc && (
                    <>
                        <HeroCanvas className="absolute inset-0 w-full h-full" />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg)]/80 via-[var(--theme-secondary)]/10 to-[var(--theme-bg)]/80"
                        />
                    </>
                )}
                {backgroundImageSrc && (
                    <>
                        <ImageElement
                            src={backgroundImageSrc}
                            alt={backgroundImageAlt || "Hero-kuva"}
                            variant="outline"
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
                        <Text variant="label" className="mt-2">
                            {description}
                        </Text>
                    )}
                    {children}
                </div>
            </div>
        );
    }
);

Hero.displayName = "Hero";
