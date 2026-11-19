import React from "react";
import { Heading } from "./Heading";
import { HeroCanvas } from "./HeroCanvas";
import { ImageElement } from "./ImageElement";
import { Text } from "./Text";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface HeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  theme?: Theme;
}

/**
 * Full-width page header section with title, description, optional background image,
 * and a children slot for CTAs or sub-content. Renders the Accent Blue liquid-space,
 * 3D icosahedron (`d20`), abyssal bubbles, and analog orbital telemetry `HeroCanvas`
 * when no `backgroundImageSrc` is provided.
 *
 * @summary full-width page header with title, description, background image, and CTA slot
 */
export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      title,
      description,
      children,
      className,
      backgroundImageSrc,
      backgroundImageAlt = "",
      theme,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "relative overflow-hidden font-sans border-b-2 border-[var(--theme-secondary)] bg-[var(--theme-bg)] text-[var(--theme-text)] min-h-40 tablet:min-h-48",
          className,
        )}
        {...props}
      >
        {!backgroundImageSrc && (
          <>
            <HeroCanvas className="absolute inset-0 w-full h-full" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/90 via-[var(--theme-bg)]/70 to-[var(--theme-bg)]/25 tablet:from-[var(--theme-bg)]/90 tablet:via-[var(--theme-bg)]/45 tablet:to-transparent"
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
              className="pointer-events-none absolute inset-0 bg-[var(--theme-bg)]/75"
            />
          </>
        )}

        <div
          className={cn(
            "relative z-10 px-4 py-6 tablet:py-8 min-h-40 tablet:min-h-48 flex flex-col justify-center",
            backgroundImageSrc && "pr-20",
          )}
        >
          <Heading>{title}</Heading>
          {description && (
            <Text variant="label" className="mt-2 max-w-prose">
              {description}
            </Text>
          )}
          {children}
        </div>
      </div>
    );
  },
);

Hero.displayName = "Hero";
