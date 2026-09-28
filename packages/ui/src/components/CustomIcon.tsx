import React from "react";
import type { CustomIconName } from "../generated/custom-icon-names";

let spriteInjected = false;
let spritePromise: Promise<void> | null = null;

export function injectSprite(): Promise<void> {
  if (spriteInjected || spritePromise) return spritePromise ?? Promise.resolve();
  if (typeof document === "undefined") return Promise.resolve();

  const existing = document.getElementById("custom-icon-sprite");
  if (existing) {
    spriteInjected = true;
    return Promise.resolve();
  }

  spritePromise = fetch("/icons-custom.svg")
    .then((res) => {
      if (!res.ok) throw new Error(`[CustomIcon] HTTP ${res.status}`);
      return res.text();
    })
    .then((markup) => {
      if (document.getElementById("custom-icon-sprite")) return;
      const container = document.createElement("div");
      container.id = "custom-icon-sprite";
      container.setAttribute("aria-hidden", "true");
      container.style.position = "absolute";
      container.style.width = "0";
      container.style.height = "0";
      container.style.overflow = "hidden";
      container.innerHTML = markup;
      document.body.insertBefore(container, document.body.firstChild);
      spriteInjected = true;
    })
    .catch((err) => {
      console.warn("[CustomIcon] Failed to load SVG sprite:", err);
    });

  return spritePromise;
}

export interface CustomIconProps extends React.SVGAttributes<SVGElement> {
  name: CustomIconName;
  size?: number;
}

/**
 * Renders a custom thematic icon from the compiled SVG sprite sheet.
 * Always use the `Icon` component wrapper — this is an internal primitive.
 */
export const CustomIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ name, size = 16, className, style, ...props }, ref) => {
    // Inject sprite into DOM on first render (client-side only)
    React.useEffect(() => {
      injectSprite();
    }, []);

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className={className}
        style={{ display: "inline-block", flexShrink: 0, ...style }}
        {...props}
      >
        <use href={`#icon-${name}`} />
      </svg>
    );
  },
);

CustomIcon.displayName = "CustomIcon";
