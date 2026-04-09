import React from "react";
import type { CustomIconName } from "../generated/custom-icon-names";

/**
 * Injects the SVG sprite sheet into the DOM once (on first mount).
 * The sprite is inlined as a hidden SVG at the top of <body>,
 * so individual icons can reference it via <use href="#icon-*">.
 */
let spriteInjected = false;

function injectSprite() {
  if (spriteInjected || typeof document === "undefined") return;
  spriteInjected = true;

  const existing = document.getElementById("custom-icon-sprite");
  if (existing) return;

  // The sprite content is imported via Vite's ?raw loader in Icon.tsx
  // and passed here as a string to inject once.
}

export interface CustomIconProps extends React.SVGAttributes<SVGElement> {
  name: CustomIconName;
  size?: number;
  /** @internal Used by Icon component to set the sprite markup on first render */
  _spriteMarkup?: string;
}

/**
 * Renders a custom thematic icon from the compiled SVG sprite sheet.
 * Always use the `Icon` component wrapper — this is an internal primitive.
 */
export const CustomIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ name, size = 16, className, _spriteMarkup, style, ...props }, ref) => {
    // Inject sprite into DOM on first render (client-side only)
    React.useEffect(() => {
      if (spriteInjected || typeof document === "undefined") return;
      spriteInjected = true;

      if (document.getElementById("custom-icon-sprite")) return;

      if (_spriteMarkup) {
        const container = document.createElement("div");
        container.id = "custom-icon-sprite";
        container.setAttribute("aria-hidden", "true");
        container.style.position = "absolute";
        container.style.width = "0";
        container.style.height = "0";
        container.style.overflow = "hidden";
        container.innerHTML = _spriteMarkup;
        document.body.insertBefore(container, document.body.firstChild);
      }
    }, [_spriteMarkup]);

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

export { injectSprite };
