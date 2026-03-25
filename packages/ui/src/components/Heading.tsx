import React from "react";
import { cn } from "./utils";

/** Re-export cn from utils for backwards compatibility */
export { cn };

const FlickeringText = ({ text }: { text: string }) => {
  const [flickerIndex, setFlickerIndex] = React.useState<number | null>(null);
  const [breathState, setBreathState] = React.useState({ center: 0, toggle: false });

  React.useEffect(() => {
    if (!text) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const scheduleFlicker = () => {
      const delay = Math.random() * 30000 + 2000;
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        const charIndices = Array.from(text)
          .map((c, i) => (c.trim() ? i : -1))
          .filter((i) => i !== -1);
        if (charIndices.length > 0) {
          const randomIdx = charIndices[Math.floor(Math.random() * charIndices.length)];
          if (randomIdx !== undefined) {
            setFlickerIndex(randomIdx);
          }

          setTimeout(
            () => {
              if (!isMounted) return;
              setFlickerIndex(null);
              scheduleFlicker();
            },
            500 + Math.random() * 1500,
          );
        } else {
          scheduleFlicker();
        }
      }, delay);
    };

    scheduleFlicker();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [text]);

  React.useEffect(() => {
    if (!text) return;
    const charIndices = Array.from(text)
      .map((c, i) => (c.trim() ? i : -1))
      .filter((i) => i !== -1);
    if (charIndices.length === 0) return;

    setBreathState({
      center: charIndices[Math.floor(Math.random() * charIndices.length)] ?? 0,
      toggle: false,
    });

    // Calculate the time required for a breath to spread fully across the entire text
    // Maximum distance spread is bounded by the text length
    const spreadDurationSeconds = text.length * 0.15;
    const animationDurationSeconds = 4;
    const totalNeededTimeMs = (spreadDurationSeconds + animationDurationSeconds) * 1000;

    // Minimum 6 seconds, plus an extra 500ms of grace time after it disappears
    const intervalTime = Math.max(10000, totalNeededTimeMs + 500);

    const intervalId = setInterval(() => {
      setBreathState((prev) => {
        const randomIdx = charIndices[Math.floor(Math.random() * charIndices.length)] ?? 0;
        return { center: randomIdx, toggle: !prev.toggle };
      });
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <>
      {Array.from(text).map((char, index) => {
        const distance = Math.abs(index - breathState.center);
        const isFlickering = flickerIndex === index;
        return (
          <span
            key={index}
            className={cn(
              isFlickering ? "flicker-char" : "",
              breathState.toggle ? "breath-char" : "",
              "inline-block transition-colors duration-300",
            )}
            style={{
              animationDelay: `${distance * 0.15}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </>
  );
};

const enhanceChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return <FlickeringText text={child} />;
    }
    return child;
  });
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const HeadingLevelContext = React.createContext<number>(2);

export const HeadingLevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const level = React.useContext(HeadingLevelContext);
  const nextLevel = Math.min(level + 1, 6);
  return <HeadingLevelContext.Provider value={nextLevel}>{children}</HeadingLevelContext.Provider>;
};

/**
 * Semantic heading with automatic level management from `HeadingLevelContext`.
 * Never use raw `<h1>`–`<h6>` elements in the design system — always use this.
 * Wrap sections in `HeadingLevelProvider` to increment the level automatically.
 * h1 text gets the ambient flicker/breath animation.
 *
 * @summary semantic heading h1–h6 with automatic level tracking; wrap sections in HeadingLevelProvider
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as, variant, children, ...props }, ref) => {
    const level = React.useContext(HeadingLevelContext);
    const Component =
      as || (`h${Math.min(Math.max(1, level), 6)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");
    const activeVariant = variant || Component;

    let renderedChildren = children;
    if (activeVariant === "h1") {
      renderedChildren = enhanceChildren(children);
    }

    return (
      <Component
        ref={ref}
        className={cn(
          "font-bold tracking-tight",
          {
            "font-black tracking-normal": ["h1", "h2", "h4", "h5"].includes(activeVariant),
            "font-heading text-4xl tablet:text-5xl uppercase text-[var(--theme-primary)]": activeVariant === "h1",
            "font-heading text-3xl tablet:text-4xl uppercase text-[var(--theme-text)]": activeVariant === "h2",
            "font-heading text-2xl tablet:text-3xl uppercase text-[var(--theme-primary)]": activeVariant === "h3",
            "font-sans text-xl tablet:text-2xl border-l-4 pl-4 border-[var(--theme-primary)] uppercase text-[var(--theme-text)]":
              activeVariant === "h4",
            "font-sans text-lg tablet:text-xl uppercase text-[var(--theme-secondary)]": activeVariant === "h5",
            "border-b-2 border-[var(--theme-primary)] font-sans text-base tablet:text-lg uppercase text-[var(--theme-text)]":
              activeVariant === "h6",
          },
          className,
        )}
        {...props}
      >
        {renderedChildren}
      </Component>
    );
  },
);

Heading.displayName = "Heading";
