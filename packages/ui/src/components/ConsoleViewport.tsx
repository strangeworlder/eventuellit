import React from "react";
import type { Theme } from "./Theme";
import { cn } from "./utils";

export interface ConsoleArrivalState {
  /** Normalized progress in [0, 1]; 1 means bow-to-stern arrival has completed. */
  progress: number;
  /** Normalized horizontal wavefront coordinate inside the viewport (0..1.08). */
  wavefrontU: number;
  /** True while the bow-to-stern fluid sweep is actively advancing. */
  isArriving: boolean;
  /** Restarts the bow-to-stern sweep from the bow. */
  replayArrival: () => void;
}

export interface ConsoleViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top ship telemetry bar rendered as a dedicated non-overlapping header row. */
  topBar?: React.ReactNode;
  /** Primary interactive ship blueprint or game stage. */
  stage: React.ReactNode;
  /** Contextual console sheets (floating bottom sheet on mobile, floating pod drawer on desktop). */
  overlay?: React.ReactNode;
  /** Persistent bottom navigation dock and optional filter utility strip. */
  dock?: React.ReactNode;
  /** Controls whether the stage scrolls vertically ("scroll") or locks to full canvas ("canvas"). */
  stageMode?: "scroll" | "canvas";
  /** Plays the synchronized 2.15s bow-to-stern fluid wavefront and hull materialization sequence. */
  igniteOnMount?: boolean;
  /** Optional deterministic progress override (0..1) for testing or snapshot scrubbing. */
  arrivalProgressOverride?: number;
  /** Scoped `data-theme` override applied to the viewport root. */
  theme?: Theme;
}

const ARRIVAL_DURATION_MS = 2150;
const ARRIVAL_END_U = 1.08;

/**
 * Computes the normalized horizontal wavefront coordinate anchored at `bowOriginU` (0.22 at p=0)
 * and clearing past the stern (`1.08` at p=1) with an energetic initial bow eruption curve.
 */
export function computeArrivalWavefrontU(progress: number, bowOriginU = 0.22): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const eased = 1 - (1 - clamped) ** 1.18;
  return bowOriginU + (ARRIVAL_END_U - bowOriginU) * eased;
}

const ConsoleArrivalContext = React.createContext<ConsoleArrivalState>({
  progress: 1,
  wavefrontU: ARRIVAL_END_U,
  isArriving: false,
  replayArrival: () => {},
});

/**
 * Reads synchronized bow-to-stern arrival telemetry provided by the enclosing `ConsoleViewport`.
 */
export function useConsoleArrival(): ConsoleArrivalState {
  return React.useContext(ConsoleArrivalContext);
}

interface RgbTriple {
  r: number;
  g: number;
  b: number;
}

interface LiquidPalette {
  surfaceTint: RgbTriple;
  secondary: RgbTriple;
  accent: RgbTriple;
  borderSoft: RgbTriple;
  dawn: RgbTriple;
}

/**
 * Computes spatial-temporal wave phase so crests travel strictly left-to-right (`+u`, bow to stern)
 * as `timeSec` increases (`du/dt = speed / (2π * freq) > 0`).
 */
export function computeWavePhaseOffset(
  u: number,
  freq: number,
  timeSec: number,
  speed = 0.62,
): number {
  return u * Math.PI * 2 * freq - timeSec * speed;
}

function parseColorWithScratch(
  scratchCtx: CanvasRenderingContext2D | null,
  cssColor: string,
  fallback: RgbTriple,
): RgbTriple {
  if (!scratchCtx || !cssColor) return fallback;
  try {
    scratchCtx.clearRect(0, 0, 1, 1);
    scratchCtx.fillStyle = "rgba(0, 0, 0, 0)";
    scratchCtx.fillStyle = cssColor;
    scratchCtx.fillRect(0, 0, 1, 1);
    const data = scratchCtx.getImageData(0, 0, 1, 1).data;
    if ((data[3] ?? 0) === 0) return fallback;
    return {
      r: data[0] ?? fallback.r,
      g: data[1] ?? fallback.g,
      b: data[2] ?? fallback.b,
    };
  } catch {
    return fallback;
  }
}

function rgba(rgb: RgbTriple, alpha: number): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
}

function readLiquidPalette(
  host: Element,
  scratchCtx: CanvasRenderingContext2D | null,
): LiquidPalette {
  const styles = getComputedStyle(host);
  return {
    surfaceTint: parseColorWithScratch(
      scratchCtx,
      styles.getPropertyValue("--theme-surface-tint").trim(),
      { r: 21, g: 76, b: 73 },
    ),
    secondary: parseColorWithScratch(
      scratchCtx,
      styles.getPropertyValue("--theme-secondary").trim(),
      { r: 39, g: 139, b: 134 },
    ),
    accent: parseColorWithScratch(scratchCtx, styles.getPropertyValue("--theme-accent").trim(), {
      r: 84,
      g: 121,
      b: 222,
    }),
    borderSoft: parseColorWithScratch(
      scratchCtx,
      styles.getPropertyValue("--theme-border-soft").trim(),
      { r: 28, g: 99, b: 96 },
    ),
    dawn: parseColorWithScratch(scratchCtx, styles.getPropertyValue("--theme-dawn").trim(), {
      r: 229,
      g: 173,
      b: 60,
    }),
  };
}

interface CurrentStreakSpec {
  seedX: number;
  yFrac: number;
  lenFrac: number;
  speed: number;
  layer: "secondary" | "accent" | "dawn";
  alpha: number;
  lineWidth: number;
}

const CURRENT_STREAKS: readonly CurrentStreakSpec[] = [
  {
    seedX: 0.08,
    yFrac: 0.14,
    lenFrac: 0.11,
    speed: 34,
    layer: "secondary",
    alpha: 0.22,
    lineWidth: 1.2,
  },
  {
    seedX: 0.37,
    yFrac: 0.21,
    lenFrac: 0.15,
    speed: 48,
    layer: "secondary",
    alpha: 0.26,
    lineWidth: 1.4,
  },
  {
    seedX: 0.64,
    yFrac: 0.18,
    lenFrac: 0.09,
    speed: 29,
    layer: "accent",
    alpha: 0.18,
    lineWidth: 1.0,
  },
  {
    seedX: 0.89,
    yFrac: 0.29,
    lenFrac: 0.17,
    speed: 54,
    layer: "secondary",
    alpha: 0.24,
    lineWidth: 1.3,
  },
  {
    seedX: 0.19,
    yFrac: 0.36,
    lenFrac: 0.13,
    speed: 42,
    layer: "accent",
    alpha: 0.19,
    lineWidth: 1.2,
  },
  {
    seedX: 0.51,
    yFrac: 0.43,
    lenFrac: 0.18,
    speed: 60,
    layer: "secondary",
    alpha: 0.25,
    lineWidth: 1.5,
  },
  {
    seedX: 0.78,
    yFrac: 0.48,
    lenFrac: 0.12,
    speed: 36,
    layer: "dawn",
    alpha: 0.22,
    lineWidth: 1.3,
  },
  {
    seedX: 0.12,
    yFrac: 0.56,
    lenFrac: 0.16,
    speed: 50,
    layer: "secondary",
    alpha: 0.23,
    lineWidth: 1.3,
  },
  {
    seedX: 0.43,
    yFrac: 0.63,
    lenFrac: 0.12,
    speed: 40,
    layer: "accent",
    alpha: 0.2,
    lineWidth: 1.1,
  },
  {
    seedX: 0.69,
    yFrac: 0.69,
    lenFrac: 0.19,
    speed: 58,
    layer: "secondary",
    alpha: 0.26,
    lineWidth: 1.5,
  },
  {
    seedX: 0.26,
    yFrac: 0.74,
    lenFrac: 0.13,
    speed: 42,
    layer: "dawn",
    alpha: 0.2,
    lineWidth: 1.2,
  },
  {
    seedX: 0.57,
    yFrac: 0.81,
    lenFrac: 0.15,
    speed: 46,
    layer: "secondary",
    alpha: 0.22,
    lineWidth: 1.3,
  },
  {
    seedX: 0.85,
    yFrac: 0.86,
    lenFrac: 0.13,
    speed: 38,
    layer: "accent",
    alpha: 0.18,
    lineWidth: 1.1,
  },
  {
    seedX: 0.31,
    yFrac: 0.91,
    lenFrac: 0.14,
    speed: 44,
    layer: "secondary",
    alpha: 0.2,
    lineWidth: 1.2,
  },
];

function drawFluidRibbon(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number;
    height: number;
    t: number;
    baseY: number;
    thickness: number;
    waveAmp: number;
    freq: number;
    phase: number;
    rgb: RgbTriple;
    peakAlpha: number;
  },
) {
  const steps = 28;
  const dx = opts.width / steps;
  const topY: number[] = [];
  const botY: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const primaryPhase = computeWavePhaseOffset(u, opts.freq, opts.t, 0.62) + opts.phase;
    const secondaryPhase =
      computeWavePhaseOffset(u, opts.freq * 0.55, opts.t, 0.38) + opts.phase * 1.7;
    const swell =
      Math.sin(primaryPhase) * opts.waveAmp + Math.cos(secondaryPhase) * (opts.waveAmp * 0.45);
    const breath =
      opts.thickness *
      (0.82 + 0.22 * Math.sin(computeWavePhaseOffset(u, 1, opts.t, 0.44) + opts.phase));
    const midY = opts.baseY * opts.height + swell;
    topY.push(midY - breath * 0.5);
    botY.push(midY + breath * 0.5);
  }

  ctx.beginPath();
  ctx.moveTo(0, topY[0] ?? 0);
  for (let i = 1; i <= steps; i++) {
    ctx.lineTo(i * dx, topY[i] ?? 0);
  }
  for (let i = steps; i >= 0; i--) {
    ctx.lineTo(i * dx, botY[i] ?? 0);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(
    0,
    opts.baseY * opts.height - opts.thickness,
    0,
    opts.baseY * opts.height + opts.thickness,
  );
  grad.addColorStop(0, rgba(opts.rgb, 0));
  grad.addColorStop(0.5, rgba(opts.rgb, opts.peakAlpha));
  grad.addColorStop(1, rgba(opts.rgb, 0));
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawContourFilament(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number;
    height: number;
    t: number;
    baseY: number;
    waveAmp: number;
    phase: number;
    rgb: RgbTriple;
    alpha: number;
  },
) {
  const steps = 36;
  const dx = opts.width / steps;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const y =
      opts.baseY * opts.height +
      Math.sin(computeWavePhaseOffset(u, 1.2, opts.t, 0.58) + opts.phase) * opts.waveAmp +
      Math.cos(computeWavePhaseOffset(u, 0.65, opts.t, 0.36) + opts.phase) * (opts.waveAmp * 0.4);
    if (i === 0) {
      ctx.moveTo(0, y);
    } else {
      ctx.lineTo(i * dx, y);
    }
  }
  ctx.strokeStyle = rgba(opts.rgb, opts.alpha);
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawCurrentStreaks(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number;
    height: number;
    t: number;
    surgePx: number;
    palette: LiquidPalette;
  },
) {
  for (const streak of CURRENT_STREAKS) {
    const len = Math.max(48, opts.width * streak.lenFrac);
    const wrapSpan = opts.width + len * 2;
    const rawX = streak.seedX * opts.width + opts.t * streak.speed + opts.surgePx;
    // Strictly advances left -> right (+x, from ship bow toward stern)
    const xStart = (rawX % wrapSpan) - len;
    const xEnd = xStart + len;
    const y =
      streak.yFrac * opts.height +
      Math.sin(computeWavePhaseOffset(streak.seedX, 1, opts.t, 0.45)) * 4;
    const rgb =
      streak.layer === "dawn"
        ? opts.palette.dawn
        : streak.layer === "accent"
          ? opts.palette.accent
          : opts.palette.secondary;

    const grad = ctx.createLinearGradient(xStart, y, xEnd, y);
    grad.addColorStop(0, rgba(rgb, 0));
    grad.addColorStop(0.72, rgba(rgb, streak.alpha));
    grad.addColorStop(1, rgba(rgb, 0));

    ctx.beginPath();
    ctx.moveTo(xStart, y);
    ctx.lineTo(xEnd, y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = streak.lineWidth;
    ctx.stroke();
  }
}

function traceParabolicWavefront(
  ctx: CanvasRenderingContext2D,
  opts: {
    height: number;
    frontX: number;
    maxLag: number;
    minX: number;
  },
) {
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const v = i / steps;
    const ny = (v - 0.5) * 2;
    const x = Math.max(opts.minX, opts.frontX - ny * ny * opts.maxLag);
    const y = v * opts.height;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
}

function drawArrivalBowCrest(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number;
    height: number;
    progress: number;
    bowX: number;
    frontX: number;
    maxLag: number;
    t: number;
    palette: LiquidPalette;
  },
) {
  const envelope = Math.sin(Math.min(1, opts.progress) * Math.PI);
  const crestAlpha = Math.max(0.18, envelope * 0.95);
  const minX = Math.max(0, opts.bowX * (1 - Math.min(1, opts.progress / 0.36)));

  // 1. Bow ignition break flare (Keula spark during early eruption)
  if (opts.progress < 0.58) {
    const sparkAlpha = Math.max(0, 1 - opts.progress / 0.58);
    const sparkR = Math.max(64, opts.width * 0.14);
    const sparkGrad = ctx.createRadialGradient(
      opts.bowX,
      opts.height * 0.5,
      0,
      opts.bowX,
      opts.height * 0.5,
      sparkR,
    );
    sparkGrad.addColorStop(0, rgba(opts.palette.dawn, 0.56 * sparkAlpha));
    sparkGrad.addColorStop(0.42, rgba(opts.palette.secondary, 0.34 * sparkAlpha));
    sparkGrad.addColorStop(1, rgba(opts.palette.accent, 0));
    ctx.fillStyle = sparkGrad;
    ctx.fillRect(0, 0, opts.width, opts.height);
  }

  // 2. Parabolic leading hydro-crest halo & sharp EGA edge
  ctx.save();
  ctx.beginPath();
  traceParabolicWavefront(ctx, {
    height: opts.height,
    frontX: opts.frontX,
    maxLag: opts.maxLag,
    minX,
  });
  ctx.strokeStyle = rgba(opts.palette.secondary, 0.24 * crestAlpha);
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.beginPath();
  traceParabolicWavefront(ctx, {
    height: opts.height,
    frontX: opts.frontX,
    maxLag: opts.maxLag,
    minX,
  });
  ctx.strokeStyle = rgba(opts.palette.dawn, 0.78 * crestAlpha);
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Velocity wake needles trailing back from the crest
  const needleCount = 12;
  for (let i = 0; i < needleCount; i++) {
    const v = (i + 0.5) / needleCount;
    const ny = (v - 0.5) * 2;
    const tipX = Math.max(minX, opts.frontX - ny * ny * opts.maxLag);
    const y = v * opts.height + Math.sin(opts.t * 4 + i * 1.1) * 3;
    const tailLen = 36 + (i % 3) * 24;
    const tailX = Math.max(minX, tipX - tailLen);
    const grad = ctx.createLinearGradient(tailX, y, tipX, y);
    grad.addColorStop(0, rgba(opts.palette.secondary, 0));
    grad.addColorStop(1, rgba(opts.palette.secondary, 0.45 * crestAlpha));
    ctx.beginPath();
    ctx.moveTo(tailX, y);
    ctx.lineTo(tipX, y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.restore();
}

function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Full-viewport (`100dvh`) game console shell over an ambient liquid-space (`nestemäinen välitila`)
 * fluid canvas whose laminar currents erupt from the bow (`Keula`) and sweep toward stern.
 * Provides synchronized bow-to-stern arrival telemetry via `ConsoleArrivalContext`.
 *
 * @summary structural game HUD viewport with synchronized bow-origin fluid arrival and EGA console chrome
 */
export const ConsoleViewport = React.forwardRef<HTMLDivElement, ConsoleViewportProps>(
  (
    {
      className,
      style,
      topBar,
      stage,
      overlay,
      dock,
      stageMode = "scroll",
      igniteOnMount = false,
      arrivalProgressOverride,
      theme,
      children,
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);

    const hasOverride = typeof arrivalProgressOverride === "number";
    const clampedOverride = hasOverride ? Math.max(0, Math.min(1, arrivalProgressOverride)) : null;

    const [sweepProgress, setSweepProgress] = React.useState<number>(() => {
      if (clampedOverride !== null) return clampedOverride;
      if (!igniteOnMount || isReducedMotionPreferred()) return 1;
      return 0;
    });
    const [sweepCycle, setSweepCycle] = React.useState(0);

    const arrivalProgress = clampedOverride !== null ? clampedOverride : sweepProgress;
    const isArriving = arrivalProgress < 0.999;
    const wavefrontU = computeArrivalWavefrontU(arrivalProgress, 0.22);

    const arrivalProgressRef = React.useRef(arrivalProgress);
    arrivalProgressRef.current = arrivalProgress;

    const redrawCanvasRef = React.useRef<(() => void) | null>(null);

    const replayArrival = React.useCallback(() => {
      if (clampedOverride !== null) return;
      if (isReducedMotionPreferred()) {
        setSweepProgress(1);
        arrivalProgressRef.current = 1;
        redrawCanvasRef.current?.();
        return;
      }
      setSweepProgress(0);
      arrivalProgressRef.current = 0;
      setSweepCycle((prev) => prev + 1);
    }, [clampedOverride]);

    React.useEffect(() => {
      if (clampedOverride !== null) {
        arrivalProgressRef.current = clampedOverride;
        redrawCanvasRef.current?.();
      }
    }, [clampedOverride]);

    React.useEffect(() => {
      if (clampedOverride !== null) return;
      const shouldSweep = igniteOnMount || sweepCycle > 0;
      if (!shouldSweep || isReducedMotionPreferred()) {
        setSweepProgress(1);
        arrivalProgressRef.current = 1;
        return;
      }

      let sweepRaf = 0;
      let cancelled = false;
      let startMs: number | null = null;

      setSweepProgress(0);
      arrivalProgressRef.current = 0;

      const step = (now: number) => {
        if (cancelled) return;
        if (startMs === null) startMs = now;
        const nextProgress = Math.min(1, Math.max(0, (now - startMs) / ARRIVAL_DURATION_MS));
        arrivalProgressRef.current = nextProgress;
        setSweepProgress(nextProgress);
        if (nextProgress < 1) {
          sweepRaf = window.requestAnimationFrame(step);
        }
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          cancelled = true;
          if (sweepRaf) window.cancelAnimationFrame(sweepRaf);
          arrivalProgressRef.current = 1;
          setSweepProgress(1);
          redrawCanvasRef.current?.();
        }
      };

      window.addEventListener("keydown", onKeyDown);
      sweepRaf = window.requestAnimationFrame(step);

      return () => {
        cancelled = true;
        window.removeEventListener("keydown", onKeyDown);
        if (sweepRaf) window.cancelAnimationFrame(sweepRaf);
      };
    }, [clampedOverride, igniteOnMount, sweepCycle]);

    const attachRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const host = rootRef.current;
      if (!canvas || !host || typeof window === "undefined") return;

      let ctx: CanvasRenderingContext2D | null = null;
      try {
        ctx = canvas.getContext("2d");
      } catch {
        ctx = null;
      }
      if (!ctx) return;

      let scratchCtx: CanvasRenderingContext2D | null = null;
      try {
        const scratchCanvas = document.createElement("canvas");
        scratchCanvas.width = 1;
        scratchCanvas.height = 1;
        scratchCtx = scratchCanvas.getContext("2d");
      } catch {
        scratchCtx = null;
      }

      const prefersReducedMotion = isReducedMotionPreferred();

      let rafId = 0;
      let startTimeMs: number | null = null;
      let width = 0;
      let height = 0;
      let palette = readLiquidPalette(host, scratchCtx);

      const refreshPalette = () => {
        if (!host) return;
        palette = readLiquidPalette(host, scratchCtx);
      };

      const resize = () => {
        if (!canvas || !host) return;
        const rect = host.getBoundingClientRect();
        width = Math.max(1, rect.width || window.innerWidth);
        height = Math.max(1, rect.height || window.innerHeight);
        canvas.width = width;
        canvas.height = height;
      };

      const renderFrame = (timeMs: number) => {
        if (!ctx || !host) return;
        if (startTimeMs === null) startTimeMs = timeMs;
        const t = prefersReducedMotion ? 0 : Math.max(0, (timeMs - startTimeMs) / 1000);
        const frameProgress = arrivalProgressRef.current;
        const bowOriginU = 0.22;
        const bowX = width * bowOriginU;
        const frontU = computeArrivalWavefrontU(frameProgress, bowOriginU);
        const frontX = width * frontU;
        const frameArriving = frameProgress < 0.999;
        const surgePx = !prefersReducedMotion && frameArriving ? 260 * (1 - Math.exp(-t * 3.8)) : 0;

        ctx.clearRect(0, 0, width, height);

        const rearOpen = Math.min(1, frameProgress / 0.36);
        const minX = Math.max(0, bowX * (1 - rearOpen));
        const maxLag = Math.max(36, (frontX - bowX) * 0.36);

        ctx.save();
        if (frameArriving) {
          ctx.beginPath();
          ctx.moveTo(minX, 0);
          const steps = 20;
          for (let i = 0; i <= steps; i++) {
            const v = i / steps;
            const ny = (v - 0.5) * 2;
            const x = Math.max(minX, frontX - ny * ny * maxLag);
            ctx.lineTo(x, v * height);
          }
          ctx.lineTo(minX, height);
          ctx.closePath();
          ctx.clip();
        }

        // 1. Slow ambient fluid density swells drifting gently past the hull
        const maxDim = Math.max(width, height);
        const swells = [
          {
            cx: width * (0.28 + 0.08 * Math.sin(-t * 0.14)),
            cy: height * (0.34 + 0.07 * Math.cos(t * 0.11)),
            r: maxDim * 0.56,
            rgb: palette.surfaceTint,
            alpha: 0.42,
          },
          {
            cx: width * (0.72 + 0.09 * Math.cos(t * 0.12 + 1.2)),
            cy: height * (0.62 + 0.08 * Math.sin(t * 0.15 + 0.7)),
            r: maxDim * 0.48,
            rgb: palette.secondary,
            alpha: 0.11,
          },
          {
            cx: width * (0.5 + 0.11 * Math.sin(t * 0.09 + 2.4)),
            cy: height * (0.22 + 0.06 * Math.cos(t * 0.13 + 1.9)),
            r: maxDim * 0.42,
            rgb: palette.accent,
            alpha: 0.065,
          },
        ];

        for (const swell of swells) {
          const radGrad = ctx.createRadialGradient(
            swell.cx,
            swell.cy,
            0,
            swell.cx,
            swell.cy,
            swell.r,
          );
          radGrad.addColorStop(0, rgba(swell.rgb, swell.alpha));
          radGrad.addColorStop(0.55, rgba(swell.rgb, swell.alpha * 0.38));
          radGrad.addColorStop(1, rgba(swell.rgb, 0));
          ctx.fillStyle = radGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // 2. Smooth translucent laminar current ribbons flowing bow -> stern (+x)
        drawFluidRibbon(ctx, {
          width,
          height,
          t,
          baseY: 0.24,
          thickness: height * 0.2,
          waveAmp: height * 0.04,
          freq: 1.25,
          phase: 0.4,
          rgb: palette.secondary,
          peakAlpha: 0.075,
        });
        drawFluidRibbon(ctx, {
          width,
          height,
          t,
          baseY: 0.52,
          thickness: height * 0.24,
          waveAmp: height * 0.048,
          freq: 1.0,
          phase: 2.1,
          rgb: palette.surfaceTint,
          peakAlpha: 0.15,
        });
        drawFluidRibbon(ctx, {
          width,
          height,
          t,
          baseY: 0.78,
          thickness: height * 0.18,
          waveAmp: height * 0.036,
          freq: 1.4,
          phase: 3.8,
          rgb: palette.accent,
          peakAlpha: 0.06,
        });

        // 3. Bathyscape contour filaments along current boundaries
        drawContourFilament(ctx, {
          width,
          height,
          t,
          baseY: 0.28,
          waveAmp: height * 0.03,
          phase: 0.8,
          rgb: palette.borderSoft,
          alpha: 0.2,
        });
        drawContourFilament(ctx, {
          width,
          height,
          t,
          baseY: 0.56,
          waveAmp: height * 0.035,
          phase: 2.6,
          rgb: palette.secondary,
          alpha: 0.15,
        });
        drawContourFilament(ctx, {
          width,
          height,
          t,
          baseY: 0.8,
          waveAmp: height * 0.025,
          phase: 4.1,
          rgb: palette.dawn,
          alpha: 0.08,
        });

        // 4. Tapered forward-travel laminar slipstream streaks (+x, bow -> stern)
        drawCurrentStreaks(ctx, {
          width,
          height,
          t,
          surgePx,
          palette,
        });

        ctx.restore();

        if (frameArriving) {
          drawArrivalBowCrest(ctx, {
            width,
            height,
            progress: frameProgress,
            bowX,
            frontX,
            maxLag,
            t,
            palette,
          });
        }

        if (!prefersReducedMotion) {
          rafId = window.requestAnimationFrame(renderFrame);
        }
      };

      redrawCanvasRef.current = () =>
        renderFrame(typeof performance !== "undefined" ? performance.now() : 0);

      resize();
      renderFrame(typeof performance !== "undefined" ? performance.now() : 0);

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          resize();
          if (prefersReducedMotion) renderFrame(0);
        });
        resizeObserver.observe(host);
      } else {
        window.addEventListener("resize", resize);
      }

      const themeObserver = new MutationObserver(() => {
        refreshPalette();
        if (prefersReducedMotion) {
          renderFrame(0);
        }
      });
      themeObserver.observe(host, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      if (document.documentElement) {
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme", "class"],
        });
      }

      return () => {
        redrawCanvasRef.current = null;
        themeObserver.disconnect();
        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener("resize", resize);
        }
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }, []);

    const arrivalContextValue = React.useMemo<ConsoleArrivalState>(
      () => ({
        progress: arrivalProgress,
        wavefrontU,
        isArriving,
        replayArrival,
      }),
      [arrivalProgress, wavefrontU, isArriving, replayArrival],
    );

    const hudLockProgress = !isArriving
      ? 1
      : Math.max(0, Math.min(1, (arrivalProgress - 0.48) / 0.44));
    const chromeReduced = clampedOverride === null && isReducedMotionPreferred();
    const topChromeStyle: React.CSSProperties | undefined = chromeReduced
      ? undefined
      : {
          opacity: 0.42 + 0.58 * hudLockProgress,
          transform: `translateY(${((1 - hudLockProgress) * -8).toFixed(2)}px)`,
        };
    const dockChromeStyle: React.CSSProperties | undefined = chromeReduced
      ? undefined
      : {
          opacity: 0.42 + 0.58 * hudLockProgress,
          transform: `translateY(${((1 - hudLockProgress) * 8).toFixed(2)}px)`,
        };

    return (
      <ConsoleArrivalContext.Provider value={arrivalContextValue}>
        <div
          ref={attachRef}
          data-theme={theme}
          data-ignition={isArriving ? "igniting" : "ready"}
          data-arrival={isArriving ? "arriving" : "settled"}
          style={
            {
              "--ds-arrival-progress": arrivalProgress.toFixed(3),
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "relative flex flex-col h-[100dvh] w-full overflow-hidden font-sans ds-console-viewport text-[var(--theme-text)] select-none tablet:select-auto",
            className,
          )}
          {...props}
        >
          {/* Z0: Liquid-space current backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          >
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>

          {/* Dedicated top telemetry bar (leaves mobile left gutter clear for host menu) */}
          {topBar && (
            <header
              style={topChromeStyle}
              className="ds-console-header ds-console-chrome-top relative z-20 shrink-0 backdrop-blur-md py-2 pr-3 pl-14 desktop:px-5 transition-none"
            >
              {topBar}
            </header>
          )}

          {/* Middle workspace row: flexible blueprint stage + floating desktop sheet slot */}
          <div className="relative z-10 flex flex-1 min-h-0 w-full overflow-hidden">
            <div
              data-stage-mode={stageMode}
              className={cn(
                "relative flex-1 min-w-0 h-full overflow-x-hidden",
                stageMode === "canvas" ? "overflow-hidden" : "overflow-y-auto p-4 tablet:p-6",
              )}
            >
              {stage}
            </div>

            {overlay && <div className="ds-console-overlay-slot">{overlay}</div>}
          </div>

          {/* Persistent bottom dock bar */}
          {dock && (
            <footer
              style={dockChromeStyle}
              className="ds-console-dock-bar ds-console-chrome-dock relative z-20 shrink-0 backdrop-blur-md px-2.5 py-2 tablet:px-5 transition-none"
            >
              {dock}
            </footer>
          )}

          {children}
        </div>
      </ConsoleArrivalContext.Provider>
    );
  },
);

ConsoleViewport.displayName = "ConsoleViewport";
