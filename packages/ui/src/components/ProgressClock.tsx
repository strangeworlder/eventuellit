import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export type ProgressClockSegments = 4 | 6 | 8 | 10 | 12;

export interface ProgressClockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total clock segments. When `null`, renders as uncalibrated ("Odottaa PJ:n mitoitusta"). */
  segmentsTotal: ProgressClockSegments | null;
  /** Number of filled segments / accumulated ticks. */
  segmentsFilled: number;
  /** Optional preview of additional segments (e.g. potential ticks before roll). */
  pendingTicks?: number;
  /** Visual category determines accent fill color within the active `data-theme`. */
  category?: "tutkimus" | "projekti";
  /** Clock diameter preset. */
  size?: "sm" | "md" | "lg";
  /** Optional caption rendered next to the SVG dial. */
  label?: string;
  /** Scoped `data-theme` override. */
  theme?: Theme;
}

const SIZE_CLASSES: Record<NonNullable<ProgressClockProps["size"]>, string> = {
  sm: "w-12 h-12",
  md: "w-[72px] h-[72px]",
  lg: "w-24 h-24",
};

function polarToCartesian(cx: number, cy: number, radius: number, angleRad: number) {
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function buildAnnularWedgePath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}

/**
 * Vector progress clock for between-episode research and ship project clocks.
 * Supports 4/6/8/10/12 radial segments as well as an uncalibrated state (`segmentsTotal === null`).
 *
 * @summary radial segmented progress clock for research and project tracks
 */
export const ProgressClock = React.forwardRef<HTMLDivElement, ProgressClockProps>(
  (
    {
      className,
      segmentsTotal,
      segmentsFilled,
      pendingTicks = 0,
      category = "projekti",
      size = "md",
      label,
      theme,
      ...props
    },
    ref,
  ) => {
    const safeFilled = Math.max(0, segmentsFilled);
    const clampedFilled = segmentsTotal !== null ? Math.min(safeFilled, segmentsTotal) : safeFilled;
    const isComplete = segmentsTotal !== null && clampedFilled >= segmentsTotal;
    const clampedPending =
      segmentsTotal !== null
        ? Math.max(0, Math.min(pendingTicks, segmentsTotal - clampedFilled))
        : 0;

    const svgTitle =
      segmentsTotal === null
        ? `Edistymiskello odottaa pelinjohtajan mitoitusta, kertynyt ${clampedFilled} merkintää`
        : `Edistymiskello: ${clampedFilled} / ${segmentsTotal} osaa täynnä`;

    const activeColor = isComplete
      ? "var(--theme-primary)"
      : category === "tutkimus"
        ? "var(--theme-accent)"
        : "var(--theme-secondary)";

    const segmentSlices = React.useMemo(() => {
      if (segmentsTotal === null) return [];
      const cx = 50;
      const cy = 50;
      const outerR = 44;
      const innerR = 17;
      const step = (Math.PI * 2) / segmentsTotal;
      const gap = 0.045;
      const startBase = -Math.PI / 2;

      return Array.from({ length: segmentsTotal }, (_, idx) => {
        const a0 = startBase + idx * step + gap;
        const a1 = startBase + (idx + 1) * step - gap;
        return {
          key: `seg-${segmentsTotal}-${idx}`,
          index: idx,
          path: buildAnnularWedgePath(cx, cy, innerR, outerR, a0, a1),
        };
      });
    }, [segmentsTotal]);

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn("inline-flex items-center gap-3 font-sans", className)}
        {...props}
      >
        <svg
          role="img"
          viewBox="0 0 100 100"
          className={cn("shrink-0 overflow-visible", SIZE_CLASSES[size])}
        >
          <title>{svgTitle}</title>
          {segmentsTotal === null ? (
            <>
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="var(--theme-surface-tint)"
                stroke="var(--theme-accent)"
                strokeWidth="2.5"
                strokeDasharray="7 5"
              />
              <circle
                cx="50"
                cy="50"
                r="31"
                fill="none"
                stroke="var(--theme-border-soft)"
                strokeWidth="1.5"
              />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                fill="var(--theme-text)"
                fontSize="20"
                fontWeight="700"
                fontFamily="var(--font-heading)"
              >
                {`+${clampedFilled}`}
              </text>
            </>
          ) : (
            <>
              {segmentSlices.map((slice) => {
                const isFilled = slice.index < clampedFilled;
                const isPending = !isFilled && slice.index < clampedFilled + clampedPending;

                const fill = isFilled
                  ? activeColor
                  : isPending
                    ? "color-mix(in srgb, var(--theme-secondary) 35%, transparent)"
                    : "var(--theme-surface-tint)";

                const stroke = isFilled
                  ? activeColor
                  : isPending
                    ? "var(--theme-secondary)"
                    : "var(--theme-border-medium)";

                return (
                  <path
                    key={slice.key}
                    d={slice.path}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="1.5"
                    data-filled={isFilled ? "true" : "false"}
                  />
                );
              })}
              <circle
                cx="50"
                cy="50"
                r="14"
                fill="var(--theme-bg)"
                stroke={isComplete ? "var(--theme-primary)" : "var(--theme-border-medium)"}
                strokeWidth="1.5"
              />
              <text
                x="50"
                y="53.5"
                textAnchor="middle"
                fill={isComplete ? "var(--theme-primary)" : "var(--theme-text)"}
                fontSize="11.5"
                fontWeight="800"
                fontFamily="var(--font-heading)"
              >
                {`${clampedFilled}/${segmentsTotal}`}
              </text>
            </>
          )}
        </svg>

        {label && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--theme-text)]">{label}</div>
            <div className="font-sans text-xs text-text-muted tabular-nums">
              {segmentsTotal === null
                ? "Odottaa pelinjohtajan mitoitusta"
                : isComplete
                  ? "Valmis"
                  : `${clampedFilled} / ${segmentsTotal} osaa`}
            </div>
          </div>
        )}
      </div>
    );
  },
);

ProgressClock.displayName = "ProgressClock";
