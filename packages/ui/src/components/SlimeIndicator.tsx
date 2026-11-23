import type React from "react";
import type { SlimeIndicatorHandle } from "./usePillIndicator";
import { cn } from "./utils";

export interface SlimeIndicatorProps {
  slime: SlimeIndicatorHandle;
  className?: string;
}

/**
 * Internal SVG metaball-slime layer shared by `TabsList` and `TopNavList`.
 * Renders overlapping organic lobes and a scout droplet through an isotropic
 * Gaussian level-set gooey filter so blobs stretch liquid necks, pinch off,
 * and coalesce with a wet meniscus reflection and crisp outer membrane.
 */
export const SlimeIndicator: React.FC<SlimeIndicatorProps> = ({ slime, className }) => {
  return (
    <svg
      ref={slime.svgRef}
      aria-hidden="true"
      focusable="false"
      data-slime-indicator=""
      data-slime-state="hidden"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible text-[var(--theme-accent)]",
        className,
      )}
      style={{ opacity: 0 }}
    >
      <defs>
        <filter
          ref={slime.filterRef}
          id={slime.filterId}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x="-56"
          y="-36"
          width="480"
          height="120"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Isotropic Gaussian metaball scalar field */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />

          {/* 2. Outer membrane contour (A ≈ 0.42, ~1.15px anti-aliased edge) */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 11 -4.13"
            result="gooOuter"
          />

          {/* 3. Inner membrane contour inset by ~2px (A ≈ 0.58) */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 11 -5.87"
            result="gooInner"
          />

          {/* 4. Deep core mask for refractive gel wall cushion */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 4.2 -2.95"
            result="gooCore"
          />

          {/* 5. Translucent gel interior */}
          <feFlood floodColor="currentColor" floodOpacity="0.14" result="fillFlood" />
          <feComposite in="fillFlood" in2="gooOuter" operator="in" result="gelBase" />

          {/* 6. Refractive outer gel wall thickening */}
          <feComposite in="gooInner" in2="gooCore" operator="out" result="wallMask" />
          <feFlood floodColor="currentColor" floodOpacity="0.16" result="wallFlood" />
          <feComposite in="wallFlood" in2="wallMask" operator="in" result="gelWall" />

          {/* 7. Chromatic lower-right meniscus depth */}
          <feOffset in="gooInner" dx="-0.6" dy="-2.4" result="innerShiftedUp" />
          <feComposite in="gooInner" in2="innerShiftedUp" operator="out" result="bottomCrescent" />
          <feFlood floodColor="currentColor" floodOpacity="0.22" result="bottomFlood" />
          <feComposite in="bottomFlood" in2="bottomCrescent" operator="in" result="meniscusDepth" />

          {/* 8. Wet upper-left specular meniscus highlight */}
          <feOffset in="gooInner" dx="0.6" dy="2.2" result="innerShiftedDown" />
          <feComposite in="gooInner" in2="innerShiftedDown" operator="out" result="topCrescent" />
          <feFlood floodColor="#ffffff" floodOpacity="0.36" result="specFlood" />
          <feComposite in="specFlood" in2="topCrescent" operator="in" result="specularRim" />

          {/* 9. Crisp 2px outer slime membrane skin */}
          <feComposite in="gooOuter" in2="gooInner" operator="out" result="borderMask" />
          <feFlood floodColor="currentColor" floodOpacity="0.96" result="borderFlood" />
          <feComposite in="borderFlood" in2="borderMask" operator="in" result="membraneBorder" />

          {/* 10. Subtle bioluminescent outer aura */}
          <feGaussianBlur in="borderMask" stdDeviation="2.5" result="auraBlur" />
          <feFlood floodColor="currentColor" floodOpacity="0.26" result="auraFlood" />
          <feComposite in="auraFlood" in2="auraBlur" operator="in" result="outerAura" />

          <feMerge>
            <feMergeNode in="outerAura" />
            <feMergeNode in="gelBase" />
            <feMergeNode in="gelWall" />
            <feMergeNode in="meniscusDepth" />
            <feMergeNode in="specularRim" />
            <feMergeNode in="membraneBorder" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${slime.filterId})`} fill="currentColor">
        <rect ref={slime.lobeLeftRef} x="0" y="0" width="0" height="0" rx="0" ry="0" />
        <g ref={slime.lobeMidGroupRef}>
          <rect ref={slime.lobeMidRef} x="0" y="0" width="0" height="0" rx="0" ry="0" />
        </g>
        <rect ref={slime.lobeRightRef} x="0" y="0" width="0" height="0" rx="0" ry="0" />
        <ellipse ref={slime.lobeBulgeRef} cx="0" cy="0" rx="0" ry="0" />
        <ellipse ref={slime.lobeBeadRef} cx="0" cy="0" rx="0" ry="0" />
        <g ref={slime.snoutGroupRef}>
          <ellipse ref={slime.snoutRef} cx="0" cy="0" rx="0" ry="0" />
        </g>
        <g ref={slime.dropletGroupRef} data-slime-scout="">
          <ellipse ref={slime.dropletRef} cx="0" cy="0" rx="0" ry="0" />
        </g>
        <ellipse ref={slime.trailBeadRef} cx="0" cy="0" rx="0" ry="0" />
      </g>
    </svg>
  );
};
SlimeIndicator.displayName = "SlimeIndicator";
