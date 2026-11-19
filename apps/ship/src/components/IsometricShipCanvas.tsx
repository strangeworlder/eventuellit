import { ConsoleButton, ConsolePill, computeArrivalWavefrontU, useConsoleArrival } from "@repo/ui";
import type React from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { ShipClock, ShipOverviewResponse, ShipRoom } from "../api/ship";
import {
  renderOverviewAuxiliarySectors,
  renderSingleDeckAuxiliaryLabels,
  renderSingleDeckAuxiliarySectors,
  renderSingleDeckCabinInterior,
  renderSingleDeckCorridors,
  renderSingleDeckHullStructure,
  renderSingleDeckShafts,
  renderSingleDeckWallAssembly,
  renderSingleDeckWingCorridor,
  renderSingleDeckZoneDetail,
  type ZoneToneColors,
} from "./ship-deck-detail";
import {
  buildDeckHullPolygon,
  buildExtrudedWalls,
  buildWingCabinLayouts,
  buildZonePolygon,
  CABIN_WING_MAP,
  type CabinWingSpec,
  DECK_SPEC_MAP,
  DECK_SPECS,
  type DeckSpec,
  type ExtrudedWallFace,
  estimateHudPillMetrics,
  formatCabinCode,
  formatZoneMapLabel,
  getCabinBadgeAnchors,
  getDeckSelectorCardBounds,
  getWingListButtonAnchor,
  HULL_LENGTH_METERS,
  type IsoPoint,
  MAIN_CORRIDORS,
  polygonCentroid,
  polygonInnerHeaderAnchor,
  polygonToPointsAttr,
  projectDeckPoint,
  SHIP_ZONES,
  type ShipPropKind,
  type ShipZoneSpec,
  SVG_VIEWBOX_HEIGHT,
  SVG_VIEWBOX_WIDTH,
  VERTICAL_SHAFTS,
  type WingCabinLayout,
} from "./ship-zones";

export type ShipSelectionTarget =
  | { type: "room"; room: ShipRoom }
  | { type: "wing"; wingId: string };

export interface IsometricShipCanvasProps {
  overview: ShipOverviewResponse;
  focusedDeck: number | null;
  selectedTarget: ShipSelectionTarget | null;
  highlightedWingId: string | null;
  onSelectTarget: (target: ShipSelectionTarget) => void;
  onFocusDeck: (deckNumber: number | null) => void;
}

export interface HullRevealBounds {
  progress: number;
  frontX: number;
  leftX: number;
  featherWidth: number;
  thrusterOpacity: number;
  crestOpacity: number;
  bowWakeOpacity: number;
  isRevealing: boolean;
}

/**
 * Computes synchronized SVG scan-mask coordinates, hydro-scan crest visibility, and aft thruster
 * ignition opacity from normalized arrival progress (`0..1`).
 */
export function computeHullRevealBounds(progress: number): HullRevealBounds {
  const clamped = Math.max(0, Math.min(1, progress));
  const frontU = computeArrivalWavefrontU(clamped, 0.22);
  const frontX = Number((frontU * SVG_VIEWBOX_WIDTH).toFixed(1));
  const featherWidth = 96;
  const leftX = Number((225 * (1 - Math.min(1, clamped / 0.28))).toFixed(1));
  const thrusterOpacity = Number(
    (clamped <= 0.62 ? 0 : Math.min(1, (clamped - 0.62) / 0.3)).toFixed(3),
  );
  const crestOpacity =
    clamped >= 0.999 ? 0 : Number(Math.max(0.24, Math.sin(clamped * Math.PI) * 0.94).toFixed(3));
  const bowWakeOpacity = Number(Math.min(0.88, 0.42 + clamped * 0.46).toFixed(3));

  return {
    progress: clamped,
    frontX,
    leftX,
    featherWidth,
    thrusterOpacity,
    crestOpacity,
    bowWakeOpacity,
    isRevealing: clamped < 0.999,
  };
}

const MIN_SCALE = 0.75;
const MAX_SCALE = 2.6;
const DRAG_THRESHOLD_PX = 5;

function getOccupantInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function isoQuad(
  deckNumber: number,
  u0: number,
  u1: number,
  v0: number,
  v1: number,
  mode: "overview" | "single",
  z = 0,
): string {
  return polygonToPointsAttr(buildZonePolygon(deckNumber, { u0, u1, v0, v1 }, mode, z));
}

function isoLine(
  deckNumber: number,
  uA: number,
  vA: number,
  uB: number,
  vB: number,
  mode: "overview" | "single",
  zA = 0,
  zB = 0,
) {
  const pA = projectDeckPoint(deckNumber, uA, vA, mode, zA);
  const pB = projectDeckPoint(deckNumber, uB, vB, mode, zB);
  return { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };
}

function getZoneToneColors(opts: {
  selected: boolean;
  hovered: boolean;
  isLocked: boolean;
  statusTone?: string;
  isOwn?: boolean;
  occupied?: boolean;
  isWing?: boolean;
  propKind?: ShipPropKind;
}): ZoneToneColors {
  let base: ZoneToneColors;

  if (opts.isOwn) {
    base = {
      fill: "color-mix(in srgb, var(--theme-dawn) 22%, var(--theme-cockpit-surface))",
      stroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-dawn)",
      strokeWidth: opts.hovered ? 1.9 : 1.65,
      wallFillLit: "color-mix(in srgb, var(--theme-dawn) 36%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-dawn) 22%, var(--theme-cockpit-surface))",
      wallFillDark: "color-mix(in srgb, var(--theme-dawn) 12%, var(--theme-cockpit-surface))",
      pillFill: "color-mix(in srgb, var(--theme-dawn) 22%, var(--theme-cockpit-surface))",
      pillStroke: "var(--theme-dawn)",
      pillText: "var(--theme-text)",
    };
  } else if (opts.isWing) {
    base = {
      fill: "color-mix(in srgb, var(--theme-dawn) 5%, var(--theme-cockpit-surface))",
      stroke: opts.hovered
        ? "var(--theme-dawn)"
        : "color-mix(in srgb, var(--theme-dawn) 54%, var(--theme-cockpit-border))",
      strokeWidth: opts.hovered ? 1.85 : 1.3,
      wallFillLit: "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-cockpit-surface))",
      wallFillMid:
        "color-mix(in srgb, var(--theme-cockpit-border-soft) 36%, var(--theme-cockpit-surface))",
      wallFillDark:
        "color-mix(in srgb, var(--theme-cockpit-surface) 92%, var(--theme-hull-shadow))",
      pillFill: "color-mix(in srgb, var(--theme-dawn) 10%, var(--theme-cockpit-elevated))",
      pillStroke: opts.hovered
        ? "var(--theme-dawn)"
        : "color-mix(in srgb, var(--theme-dawn) 72%, var(--theme-cockpit-border))",
      pillText: "var(--theme-text)",
    };
  } else if (opts.isLocked || opts.statusTone === "locked") {
    base = {
      fill: "color-mix(in srgb, var(--theme-accent) 14%, var(--theme-cockpit-surface))",
      stroke: opts.hovered
        ? "var(--theme-secondary)"
        : "color-mix(in srgb, var(--theme-accent) 62%, var(--theme-cockpit-border-soft))",
      strokeWidth: opts.hovered ? 1.65 : 1.25,
      wallFillLit: "color-mix(in srgb, var(--theme-accent) 28%, var(--theme-bg))",
      wallFillMid: "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-bg))",
      wallFillDark: "color-mix(in srgb, var(--theme-bg) 92%, var(--theme-hull-shadow))",
      pillFill: "color-mix(in srgb, var(--theme-accent) 16%, var(--theme-cockpit-surface))",
      pillStroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-accent)",
      pillText: "var(--theme-text)",
    };
  } else if (opts.statusTone === "critical") {
    base = {
      fill: "color-mix(in srgb, var(--theme-primary) 22%, var(--theme-cockpit-surface))",
      stroke: opts.hovered ? "var(--theme-dawn)" : "var(--theme-primary)",
      strokeWidth: opts.hovered ? 1.85 : 1.35,
      wallFillLit: "color-mix(in srgb, var(--theme-primary) 30%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-primary) 20%, var(--theme-cockpit-surface))",
      wallFillDark: "color-mix(in srgb, var(--theme-primary) 12%, var(--theme-bg))",
      pillFill: "color-mix(in srgb, var(--theme-primary) 22%, var(--theme-cockpit-surface))",
      pillStroke: opts.hovered ? "var(--theme-dawn)" : "var(--theme-primary)",
      pillText: "var(--theme-text)",
    };
  } else if (opts.statusTone === "warning") {
    base = {
      fill: "color-mix(in srgb, var(--theme-dawn) 18%, var(--theme-cockpit-surface))",
      stroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-dawn)",
      strokeWidth: opts.hovered ? 1.85 : 1.4,
      wallFillLit: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-dawn) 20%, var(--theme-cockpit-surface))",
      wallFillDark: "color-mix(in srgb, var(--theme-dawn) 12%, var(--theme-bg))",
      pillFill: "color-mix(in srgb, var(--theme-dawn) 18%, var(--theme-cockpit-surface))",
      pillStroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-dawn)",
      pillText: "var(--theme-text)",
    };
  } else if (opts.occupied) {
    base = {
      fill: "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-cockpit-surface))",
      stroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-accent)",
      strokeWidth: opts.hovered ? 1.75 : 1.3,
      wallFillLit: "color-mix(in srgb, var(--theme-accent) 28%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-cockpit-surface))",
      wallFillDark:
        "color-mix(in srgb, var(--theme-cockpit-surface) 92%, var(--theme-hull-shadow))",
      pillFill: "color-mix(in srgb, var(--theme-accent) 16%, var(--theme-cockpit-elevated))",
      pillStroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-accent)",
      pillText: "var(--theme-text)",
    };
  } else if (opts.propKind) {
    base = {
      fill: "color-mix(in srgb, var(--theme-secondary) 20%, var(--theme-cockpit-surface))",
      stroke: opts.hovered ? "var(--theme-dawn)" : "var(--theme-secondary)",
      strokeWidth: opts.hovered ? 1.75 : 1.3,
      wallFillLit: "color-mix(in srgb, var(--theme-secondary) 30%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-secondary) 19%, var(--theme-cockpit-surface))",
      wallFillDark: "color-mix(in srgb, var(--theme-secondary) 11%, var(--theme-bg))",
      pillFill: "color-mix(in srgb, var(--theme-cockpit-surface) 88%, var(--theme-secondary))",
      pillStroke: opts.hovered ? "var(--theme-dawn)" : "var(--theme-secondary)",
      pillText: "var(--theme-text)",
    };
  } else {
    base = {
      fill: opts.hovered
        ? "color-mix(in srgb, var(--theme-secondary) 14%, var(--theme-cockpit-surface))"
        : "var(--theme-cockpit-surface)",
      stroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-cockpit-border-soft)",
      strokeWidth: opts.hovered ? 1.55 : 1.15,
      wallFillLit: "color-mix(in srgb, var(--theme-secondary) 18%, var(--theme-cockpit-surface))",
      wallFillMid: "color-mix(in srgb, var(--theme-cockpit-border-soft) 28%, var(--theme-bg))",
      wallFillDark: "color-mix(in srgb, var(--theme-bg) 90%, var(--theme-hull-shadow))",
      pillFill: "var(--theme-cockpit-elevated)",
      pillStroke: opts.hovered ? "var(--theme-secondary)" : "var(--theme-cockpit-border-soft)",
      pillText: "var(--theme-text)",
    };
  }

  if (!opts.selected) return base;

  const needsSelectionLift =
    opts.isWing ||
    (!opts.propKind &&
      !opts.occupied &&
      !opts.isLocked &&
      (!opts.statusTone || opts.statusTone === "normal"));

  return {
    ...base,
    fill: needsSelectionLift
      ? "color-mix(in srgb, var(--theme-dawn) 16%, var(--theme-cockpit-surface))"
      : base.fill,
    stroke: "var(--theme-dawn)",
    strokeWidth: 2.35,
    pillStroke: "var(--theme-dawn)",
  };
}

function renderWallFaces(
  faces: ExtrudedWallFace[],
  colors: ReturnType<typeof getZoneToneColors>,
  dashed = false,
) {
  return faces.map((face, idx) => {
    const fill =
      face.shade === "lit"
        ? colors.wallFillLit
        : face.shade === "mid"
          ? colors.wallFillMid
          : colors.wallFillDark;
    return (
      <g key={`${face.side}-${idx}`} pointerEvents="none">
        <polygon
          points={polygonToPointsAttr(face.points)}
          fill={fill}
          stroke={colors.stroke}
          strokeWidth={0.85}
          strokeDasharray={dashed ? "3 2" : undefined}
        />
        <line
          x1={face.edgeStart.x}
          y1={face.edgeStart.y}
          x2={face.edgeEnd.x}
          y2={face.edgeEnd.y}
          stroke={colors.stroke}
          strokeWidth={1.15}
        />
      </g>
    );
  });
}

function renderHudPill(opts: {
  x: number;
  y: number;
  label: string;
  badgeText?: string;
  fill: string;
  stroke: string;
  textColor: string;
  fontSize?: number;
}) {
  const fontSize = opts.fontSize ?? 12.5;
  const m = estimateHudPillMetrics({
    x: opts.x,
    y: opts.y,
    label: opts.label,
    badgeText: opts.badgeText,
    fontSize,
  });
  const c = 4.5;
  const chamferPoints = `${m.left + c},${m.top} ${m.right},${m.top} ${m.right},${m.bottom - c} ${m.right - c},${m.bottom} ${m.left},${m.bottom} ${m.left},${m.top + c}`;

  return (
    <g pointerEvents="none">
      <polygon points={chamferPoints} fill={opts.fill} stroke={opts.stroke} strokeWidth={1.15} />
      <text
        x={m.textX}
        y={opts.y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill={opts.textColor}
        fontSize={fontSize}
        fontFamily='"Outfit", "Inter", sans-serif'
        fontWeight={600}
      >
        {opts.label}
      </text>
      {opts.badgeText && (
        <g>
          <rect
            x={m.right - m.badgeWidth + 1}
            y={m.top + 2.5}
            width={m.badgeWidth - 4.5}
            height={m.height - 5}
            rx={1.5}
            fill="var(--theme-accent)"
          />
          <text
            x={m.right - m.badgeWidth / 2 - 1}
            y={opts.y + 0.5}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--theme-accent-foreground)"
            fontSize={Math.max(10, fontSize - 1.5)}
            fontFamily='"Outfit", "Inter", sans-serif'
            fontWeight={700}
          >
            {opts.badgeText}
          </text>
        </g>
      )}
    </g>
  );
}

function renderSvgDefs(idPrefix: string, reveal: HullRevealBounds) {
  const solidEnd = Math.max(reveal.leftX, reveal.frontX - reveal.featherWidth);

  return (
    <defs>
      <linearGradient id={`${idPrefix}-hull-armor`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--theme-hull-armor)" stopOpacity="0.98" />
        <stop offset="56%" stopColor="var(--theme-cockpit-surface)" stopOpacity="0.98" />
        <stop offset="100%" stopColor="var(--theme-bg)" stopOpacity="0.96" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-hull-slab`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--theme-cockpit-border-soft)" stopOpacity="0.96" />
        <stop offset="100%" stopColor="var(--theme-hull-shadow)" stopOpacity="0.98" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-thruster-plume`} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="var(--theme-dawn)" stopOpacity="0.95" />
        <stop offset="38%" stopColor="var(--theme-primary)" stopOpacity="0.65" />
        <stop offset="100%" stopColor="var(--theme-secondary)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-wake-fade`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--theme-secondary)" stopOpacity="0" />
        <stop offset="22%" stopColor="var(--theme-secondary)" stopOpacity="0.72" />
        <stop offset="72%" stopColor="var(--theme-accent)" stopOpacity="0.45" />
        <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-reveal-feather`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="68%" stopColor="white" stopOpacity="0.64" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-scan-crest`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0" />
        <stop offset="22%" stopColor="var(--theme-secondary)" stopOpacity="0.88" />
        <stop offset="50%" stopColor="var(--theme-dawn)" stopOpacity="0.96" />
        <stop offset="78%" stopColor="var(--theme-secondary)" stopOpacity="0.88" />
        <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${idPrefix}-scan-wash`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--theme-secondary)" stopOpacity="0" />
        <stop offset="100%" stopColor="var(--theme-secondary)" stopOpacity="0.22" />
      </linearGradient>
      <mask
        id={`${idPrefix}-hull-reveal-mask`}
        maskUnits="userSpaceOnUse"
        x="-80"
        y="-80"
        width="1320"
        height="920"
      >
        <rect x="-80" y="-80" width="1320" height="920" fill="black" />
        {reveal.isRevealing ? (
          <>
            <rect
              x={reveal.leftX}
              y="-80"
              width={Math.max(0, solidEnd - reveal.leftX)}
              height="920"
              fill="white"
            />
            <rect
              x={solidEnd}
              y="-80"
              width={Math.max(0, reveal.frontX - solidEnd)}
              height="920"
              fill={`url(#${idPrefix}-reveal-feather)`}
            />
          </>
        ) : (
          <rect x="-80" y="-80" width="1320" height="920" fill="white" />
        )}
      </mask>
    </defs>
  );
}

function renderBowPartingWave(opts: {
  deckNumber: number;
  mode: "overview" | "single";
  idPrefix: string;
  opacity?: number;
}) {
  const { deckNumber, mode, idPrefix, opacity = 0.85 } = opts;
  const bowTip = projectDeckPoint(deckNumber, -0.545, 0, mode, -3);
  const portCtrl = projectDeckPoint(deckNumber, -0.45, -0.5, mode, -3);
  const portTail = projectDeckPoint(deckNumber, mode === "overview" ? 0.58 : 0.56, -0.57, mode, -3);
  const stbdCtrl = projectDeckPoint(deckNumber, -0.45, 0.5, mode, -3);
  const stbdTail = projectDeckPoint(deckNumber, mode === "overview" ? 0.58 : 0.56, 0.57, mode, -3);
  const wakeUrl = `url(#${idPrefix}-wake-fade)`;

  return (
    <g pointerEvents="none" opacity={opacity}>
      {/* Keula-aalto ja virtaus keulasta perään (+x) */}
      <path
        d={`M ${bowTip.x} ${bowTip.y} Q ${portCtrl.x} ${portCtrl.y} ${portTail.x} ${portTail.y}`}
        fill="none"
        stroke={wakeUrl}
        strokeWidth={mode === "overview" ? 1.5 : 2.1}
        strokeDasharray="18 10"
        className="ds-ship-wake-dash"
        opacity={0.78}
      />
      <path
        d={`M ${bowTip.x} ${bowTip.y} Q ${stbdCtrl.x} ${stbdCtrl.y} ${stbdTail.x} ${stbdTail.y}`}
        fill="none"
        stroke={wakeUrl}
        strokeWidth={mode === "overview" ? 1.7 : 2.3}
        strokeDasharray="18 10"
        className="ds-ship-wake-dash"
        opacity={0.92}
      />
      <circle
        cx={bowTip.x}
        cy={bowTip.y}
        r={mode === "overview" ? 2.6 : 3.4}
        fill="var(--theme-secondary)"
      />
    </g>
  );
}

function renderHullWakeAndThrusters(opts: {
  deckNumber: number;
  mode: "overview" | "single";
  hasThrusters?: boolean;
  idPrefix: string;
  thrusterOpacity?: number;
}) {
  const { deckNumber, mode, hasThrusters, idPrefix, thrusterOpacity = 1 } = opts;
  const plumeUrl = `url(#${idPrefix}-thruster-plume)`;
  const thrusterOffsets = mode === "overview" ? [-0.22, 0.22] : [-0.24, 0.24];
  const nozzleU = mode === "overview" ? 0.535 : 0.494;
  const plumeStartU = mode === "overview" ? 0.54 : 0.498;
  const plumeTipU = mode === "overview" ? 0.69 : 0.638;

  if (!hasThrusters) return null;

  return (
    <g pointerEvents="none">
      {/* Peräsuuttimet ja suihkuvanat (+x perän taakse) */}
      {thrusterOffsets.map((vT) => {
        const nozzleCenter = projectDeckPoint(deckNumber, nozzleU, vT, mode, -3);
        const plumeRootPort = projectDeckPoint(deckNumber, plumeStartU, vT - 0.052, mode, -3);
        const plumeRootStbd = projectDeckPoint(deckNumber, plumeStartU, vT + 0.052, mode, -3);
        const plumeMidTip = projectDeckPoint(deckNumber, plumeTipU, vT, mode, -3);
        const coreTip = projectDeckPoint(deckNumber, plumeTipU - 0.065, vT, mode, -2);
        const coreTop = projectDeckPoint(deckNumber, plumeStartU + 0.004, vT - 0.024, mode, -2);
        const coreBot = projectDeckPoint(deckNumber, plumeStartU + 0.004, vT + 0.024, mode, -2);

        return (
          <g key={vT}>
            <g opacity={thrusterOpacity}>
              <polygon
                points={polygonToPointsAttr([plumeRootPort, plumeMidTip, plumeRootStbd])}
                fill={plumeUrl}
              />
              <polygon
                points={polygonToPointsAttr([coreTop, coreTip, coreBot])}
                fill="var(--theme-dawn)"
                opacity={0.85}
              />
            </g>
            {mode === "single" ? (
              <g>
                <ellipse
                  cx={nozzleCenter.x}
                  cy={nozzleCenter.y}
                  rx={17}
                  ry={8.8}
                  fill="var(--theme-cockpit-surface)"
                  stroke="var(--theme-cockpit-border)"
                  strokeWidth={1.4}
                />
                <ellipse
                  cx={nozzleCenter.x}
                  cy={nozzleCenter.y}
                  rx={12.5}
                  ry={6.4}
                  fill="color-mix(in srgb, var(--theme-dawn) 32%, var(--theme-primary))"
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.2}
                />
                <ellipse
                  cx={nozzleCenter.x + 2}
                  cy={nozzleCenter.y}
                  rx={6.5}
                  ry={3.2}
                  fill="var(--theme-dawn)"
                  opacity={0.78}
                />
              </g>
            ) : (
              <ellipse
                cx={nozzleCenter.x}
                cy={nozzleCenter.y}
                rx={11.5}
                ry={5.5}
                fill="color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-primary))"
                stroke="var(--theme-cockpit-border)"
                strokeWidth={1.3}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

function renderHydroScanCrest(idPrefix: string, reveal: HullRevealBounds) {
  if (!reveal.isRevealing || reveal.crestOpacity <= 0.01) return null;

  return (
    <g pointerEvents="none" opacity={reveal.crestOpacity}>
      <rect
        x={reveal.frontX - 42}
        y={16}
        width={42}
        height={SVG_VIEWBOX_HEIGHT - 32}
        fill={`url(#${idPrefix}-scan-wash)`}
      />
      <line
        x1={reveal.frontX}
        y1={24}
        x2={reveal.frontX}
        y2={SVG_VIEWBOX_HEIGHT - 24}
        stroke={`url(#${idPrefix}-scan-crest)`}
        strokeWidth={2.2}
      />
      <polygon
        points={`${reveal.frontX - 5},24 ${reveal.frontX + 5},24 ${reveal.frontX},33`}
        fill="var(--theme-dawn)"
      />
      <polygon
        points={`${reveal.frontX - 5},${SVG_VIEWBOX_HEIGHT - 24} ${reveal.frontX + 5},${SVG_VIEWBOX_HEIGHT - 24} ${reveal.frontX},${SVG_VIEWBOX_HEIGHT - 33}`}
        fill="var(--theme-dawn)"
      />
    </g>
  );
}

function renderDeckHullSlab(opts: {
  deckNumber: number;
  mode: "overview" | "single";
  idPrefix: string;
  hasPortBreach?: boolean;
}) {
  const { deckNumber, mode, idPrefix, hasPortBreach } = opts;
  const baseZ = mode === "overview" ? -11 : -16;
  const shadowZ = mode === "overview" ? -16 : -24;
  const hullTop = buildDeckHullPolygon(deckNumber, mode, 0, hasPortBreach);
  const hullBase = buildDeckHullPolygon(deckNumber, mode, baseZ, hasPortBreach);
  const hullShadow = buildDeckHullPolygon(deckNumber, mode, shadowZ, hasPortBreach);
  const armorUrl = `url(#${idPrefix}-hull-armor)`;
  const slabUrl = `url(#${idPrefix}-hull-slab)`;

  // Visible starboard & aft/bow skirt faces along hull perimeter
  const skirtFaces: Array<{ key: string; points: IsoPoint[] }> = [];
  for (let i = 0; i < hullTop.length; i++) {
    const nextIdx = (i + 1) % hullTop.length;
    const p0 = hullTop[i];
    const p1 = hullTop[nextIdx];
    const b1 = hullBase[nextIdx];
    const b0 = hullBase[i];
    if (p0 && p1 && b1 && b0) {
      skirtFaces.push({
        key: `skirt-${p0.x.toFixed(1)}-${p0.y.toFixed(1)}-${nextIdx}`,
        points: [p0, p1, b1, b0],
      });
    }
  }

  const bowPt = projectDeckPoint(deckNumber, -0.515, 0, mode, 0.5);
  const prowTipPt = projectDeckPoint(deckNumber, -0.558, 0, mode, 0.5);
  const bowChevPort = projectDeckPoint(deckNumber, -0.46, -0.15, mode, 0.5);
  const bowChevStbd = projectDeckPoint(deckNumber, -0.46, 0.15, mode, 0.5);

  return (
    <g pointerEvents="none">
      {/* Merisyvyysvarjo rungon alla */}
      <polygon
        points={polygonToPointsAttr(hullShadow)}
        fill="var(--theme-hull-shadow)"
        opacity={0.42}
      />

      {/* Alalaipan runkovarjo */}
      <polygon
        points={polygonToPointsAttr(hullBase)}
        fill={slabUrl}
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={1.1}
      />

      {/* Viistetty 2.5D-panssarireuna ylä- ja alakannen välillä */}
      {skirtFaces.map((face) => (
        <polygon
          key={face.key}
          points={polygonToPointsAttr(face.points)}
          fill={slabUrl}
          stroke="var(--theme-cockpit-border-soft)"
          strokeWidth={0.75}
        />
      ))}

      {/* Kylkipanssarin pystyripat styyrpuurin kyljessä */}
      {[-0.34, -0.16, 0.04, 0.22, 0.38].map((uRib) => (
        <line
          key={`rib-${uRib}`}
          {...isoLine(deckNumber, uRib, 0.48, uRib, 0.48, mode, 0, baseZ)}
          stroke="var(--theme-cockpit-rim)"
          strokeWidth={0.9}
          opacity={0.45}
        />
      ))}

      {/* Yläkannen metallinen panssarilevy */}
      <polygon
        points={polygonToPointsAttr(hullTop)}
        fill={armorUrl}
        stroke="var(--theme-cockpit-border)"
        strokeWidth={mode === "overview" ? 1.6 : 2.1}
      />

      {/* Keulan anturipiikki ja kulmasuuntain (-x) */}
      <line
        x1={bowPt.x}
        y1={bowPt.y}
        x2={prowTipPt.x}
        y2={prowTipPt.y}
        stroke="var(--theme-secondary)"
        strokeWidth={mode === "overview" ? 1.6 : 2}
      />
      <circle
        cx={prowTipPt.x}
        cy={prowTipPt.y}
        r={mode === "overview" ? 2.4 : 3.2}
        fill="var(--theme-dawn)"
        stroke="var(--theme-dawn-muted)"
        strokeWidth={1}
      />
      <polyline
        points={polygonToPointsAttr([bowChevPort, bowPt, bowChevStbd])}
        fill="none"
        stroke="var(--theme-secondary)"
        strokeWidth={mode === "overview" ? 1.5 : 2}
        opacity={0.9}
      />
    </g>
  );
}

function renderDeckSelectorCard(deck: DeckSpec, hovered: boolean) {
  const b = getDeckSelectorCardBounds(deck.deckNumber);
  const bowAnchor = projectDeckPoint(deck.deckNumber, -0.53, 0, "overview", 0);
  const c = 10;
  const platePoints = `${b.x + c},${b.y} ${b.x + b.width},${b.y} ${b.x + b.width},${b.y + b.height - c} ${b.x + b.width - c},${b.y + b.height} ${b.x},${b.y + b.height} ${b.x},${b.y + c}`;
  const bx = b.x + 10;
  const by = b.y + 9;
  const bw = 60;
  const bh = 20;
  const bc = 4;
  const badgePoints = `${bx + bc},${by} ${bx + bw},${by} ${bx + bw},${by + bh - bc} ${bx + bw - bc},${by + bh} ${bx},${by + bh} ${bx},${by + bc}`;

  return (
    <g>
      <line
        x1={b.connectorX}
        y1={b.centerY}
        x2={bowAnchor.x}
        y2={bowAnchor.y}
        stroke={hovered ? "var(--theme-dawn)" : "var(--theme-cockpit-border)"}
        strokeWidth={hovered ? 1.7 : 1.1}
        strokeDasharray="4 3"
        pointerEvents="none"
      />
      <polygon
        points={platePoints}
        fill={
          hovered
            ? "color-mix(in srgb, var(--theme-dawn) 16%, var(--theme-cockpit-elevated))"
            : "var(--theme-cockpit-elevated)"
        }
        stroke={hovered ? "var(--theme-dawn)" : "var(--theme-cockpit-border)"}
        strokeWidth={hovered ? 1.85 : 1.3}
      />
      <line
        x1={b.x + c}
        y1={b.y + 1.5}
        x2={b.x + b.width - 2}
        y2={b.y + 1.5}
        stroke="var(--theme-cockpit-rim)"
        strokeWidth={1}
        opacity={0.72}
        pointerEvents="none"
      />
      <polygon
        points={badgePoints}
        fill={hovered ? "var(--theme-dawn)" : "var(--theme-cockpit-header)"}
        stroke="var(--theme-dawn)"
        strokeWidth={0.95}
        pointerEvents="none"
      />
      <text
        x={bx + bw / 2}
        y={by + bh / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered ? "var(--theme-dawn-foreground)" : "var(--theme-dawn-muted)"}
        fontSize={12}
        fontFamily='"Outfit", "Inter", sans-serif'
        fontWeight={800}
        pointerEvents="none"
      >
        {deck.code}
      </text>
      <text
        x={b.x + 78}
        y={by + bh / 2}
        dominantBaseline="central"
        fill="var(--theme-text)"
        fontSize={13.5}
        fontFamily='"Outfit", "Inter", sans-serif'
        fontWeight={700}
        pointerEvents="none"
      >
        {deck.title}
      </text>
      <text
        x={b.x + 10}
        y={b.y + 40}
        dominantBaseline="central"
        fill="var(--theme-text-muted)"
        fontSize={11.5}
        fontFamily='"Inter", sans-serif'
        fontWeight={500}
        pointerEvents="none"
      >
        {deck.subtitle}
      </text>
    </g>
  );
}

function renderOverviewZoneDetail(zone: ShipZoneSpec, statusTone?: string) {
  const d = zone.deckNumber;
  const uSpan = zone.u1 - zone.u0;
  const vSpan = zone.v1 - zone.v0;
  const uC = (zone.u0 + zone.u1) / 2;
  const vC = (zone.v0 + zone.v1) / 2;

  switch (zone.propKind) {
    case "bridge": {
      const arcPtA = projectDeckPoint(d, zone.u0 + uSpan * 0.25, vC - vSpan * 0.3, "overview", 1);
      const arcPtB = projectDeckPoint(d, zone.u0 + uSpan * 0.25, vC + vSpan * 0.3, "overview", 1);
      const consoleLine = isoLine(
        d,
        uC,
        vC - vSpan * 0.24,
        uC,
        vC + vSpan * 0.24,
        "overview",
        1,
        1,
      );
      return (
        <g pointerEvents="none" opacity={0.48}>
          <line
            x1={arcPtA.x}
            y1={arcPtA.y}
            x2={arcPtB.x}
            y2={arcPtB.y}
            stroke="var(--theme-secondary)"
            strokeWidth={1.1}
          />
          <line
            {...consoleLine}
            stroke="var(--theme-accent)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </g>
      );
    }

    case "engine":
    case "reactor": {
      const corePoly = isoQuad(
        d,
        uC - uSpan * 0.16,
        uC + uSpan * 0.16,
        vC - vSpan * 0.18,
        vC + vSpan * 0.18,
        "overview",
        1,
      );
      const detailStroke =
        statusTone === "critical"
          ? "var(--theme-primary)"
          : statusTone === "warning"
            ? "var(--theme-dawn)"
            : "var(--theme-secondary)";
      return (
        <g pointerEvents="none" opacity={0.48}>
          <polygon points={corePoly} fill="none" stroke={detailStroke} strokeWidth={1.1} />
          <line
            {...isoLine(
              d,
              zone.u0 + uSpan * 0.12,
              vC,
              zone.u1 - uSpan * 0.12,
              vC,
              "overview",
              1,
              1,
            )}
            stroke={detailStroke}
            strokeWidth={0.9}
          />
        </g>
      );
    }

    case "wing": {
      return (
        <g pointerEvents="none" opacity={0.42}>
          {[0.33, 0.67].map((t) => {
            const uLine = zone.u0 + uSpan * t;
            return (
              <line
                key={t}
                {...isoLine(d, uLine, zone.v0 + 0.015, uLine, zone.v1 - 0.015, "overview", 1, 1)}
                stroke="var(--theme-cockpit-border)"
                strokeWidth={0.85}
              />
            );
          })}
        </g>
      );
    }

    default:
      return (
        <g pointerEvents="none" opacity={0.42}>
          <line
            {...isoLine(
              d,
              zone.u0 + uSpan * 0.18,
              zone.v0 + vSpan * 0.22,
              zone.u1 - uSpan * 0.18,
              zone.v0 + vSpan * 0.22,
              "overview",
              1,
              1,
            )}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.85}
            strokeDasharray="3 2"
          />
        </g>
      );
  }
}

export function IsometricShipCanvas({
  overview,
  focusedDeck,
  selectedTarget,
  highlightedWingId,
  onSelectTarget,
  onFocusDeck,
}: IsometricShipCanvasProps) {
  const { progress: arrivalProgress } = useConsoleArrival();
  const reveal = computeHullRevealBounds(arrivalProgress);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgUid = useId().replace(/:/g, "");
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    didDrag: boolean;
  } | null>(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<IsoPoint>({ x: 0, y: 0 });
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const [prevFocusedDeck, setPrevFocusedDeck] = useState(focusedDeck);
  if (prevFocusedDeck !== focusedDeck) {
    setPrevFocusedDeck(focusedDeck);
    setScale(1);
    setPan({ x: 0, y: 0 });
  }

  const roomsByKey = useMemo(() => {
    const map = new Map<string, ShipRoom>();
    for (const room of overview.rooms) {
      map.set(room.key, room);
    }
    return map;
  }, [overview.rooms]);

  const roomsByZone = useMemo(() => {
    const map = new Map<string, ShipRoom[]>();
    for (const room of overview.rooms) {
      const list = map.get(room.svgZoneId) ?? [];
      list.push(room);
      map.set(room.svgZoneId, list);
    }
    return map;
  }, [overview.rooms]);

  const activeClocksByRoom = useMemo(() => {
    const map = new Map<string, ShipClock[]>();
    for (const clock of overview.clocks) {
      if (clock.status === "active" && clock.roomKey) {
        const list = map.get(clock.roomKey) ?? [];
        list.push(clock);
        map.set(clock.roomKey, list);
      }
    }
    return map;
  }, [overview.clocks]);

  const handleResetCamera = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setScale((prev) => clampScale(Number((prev * factor).toFixed(3))));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("button")) return;

      dragRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originPanX: pan.x,
        originPanY: pan.y,
        didDrag: false,
      };
    },
    [pan.x, pan.y],
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.active || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.didDrag && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      drag.didDrag = true;
    }

    if (drag.didDrag && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const svgRatioX = rect.width > 0 ? SVG_VIEWBOX_WIDTH / rect.width : 1;
      const svgRatioY = rect.height > 0 ? SVG_VIEWBOX_HEIGHT / rect.height : 1;
      setPan({
        x: drag.originPanX + dx * svgRatioX,
        y: drag.originPanY + dy * svgRatioY,
      });
    }
  }, []);

  const finishDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag.active = false;
  }, []);

  const triggerTargetClick = useCallback(
    (e: React.SyntheticEvent, target: ShipSelectionTarget) => {
      if (dragRef.current?.didDrag) {
        e.stopPropagation();
        dragRef.current.didDrag = false;
        return;
      }
      onSelectTarget(target);
    },
    [onSelectTarget],
  );

  const triggerDeckFocus = useCallback(
    (e: React.SyntheticEvent, deckNumber: number | null) => {
      if (dragRef.current?.didDrag) {
        e.stopPropagation();
        dragRef.current.didDrag = false;
        return;
      }
      onFocusDeck(deckNumber);
    },
    [onFocusDeck],
  );

  const handleKeyActivate = useCallback((e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  }, []);

  const tx = pan.x + (SVG_VIEWBOX_WIDTH / 2) * (1 - scale);
  const ty = pan.y + (SVG_VIEWBOX_HEIGHT / 2) * (1 - scale);
  const cameraTransform = `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(3)})`;

  const portBreachRoom = (roomsByZone.get("d3-breach") ?? [])[0];
  const isPortBreachActive = portBreachRoom
    ? !portBreachRoom.isLocked &&
      (portBreachRoom.statusTone === "critical" || portBreachRoom.statusTone === "warning")
    : true;
  const portBreachTone: "critical" | "warning" =
    portBreachRoom?.statusTone === "warning" ? "warning" : "critical";

  const activeDeckSpec = focusedDeck ? (DECK_SPEC_MAP[focusedDeck] ?? null) : null;

  const renderOverviewSvg = () => {
    const ovPrefix = `${svgUid}-ov`;
    return (
      <svg
        role="img"
        aria-label="Alus Aamunkoi, 4 kannen isometrinen runkoleikkaus"
        viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full touch-none select-none"
      >
        {renderSvgDefs(ovPrefix, reveal)}
        <g transform={cameraTransform}>
          {/* Keulasta purkautuva nesteaalto näkyy välittömästi saapumisvirtauksen aikana */}
          {DECK_SPECS.map((deck) => (
            <g key={`wake-${deck.deckNumber}`}>
              {renderBowPartingWave({
                deckNumber: deck.deckNumber,
                mode: "overview",
                idPrefix: ovPrefix,
                opacity: reveal.bowWakeOpacity,
              })}
            </g>
          ))}

          {/* Runko, osastot ja kuilut piirtyvät keulan virtausrintaman mukana */}
          <g mask={`url(#${ovPrefix}-hull-reveal-mask)`}>
            {/* Pystykuilut läpi kaikkien 4 kannen */}
            {VERTICAL_SHAFTS.map((shaft) => {
              const top = projectDeckPoint(1, shaft.u, shaft.v, "overview", 16);
              const bot = projectDeckPoint(4, shaft.u, shaft.v, "overview", -8);
              const labelAnchor = projectDeckPoint(1, shaft.u, -0.46, "overview", 14);
              return (
                <g key={shaft.id} pointerEvents="none">
                  <line
                    x1={top.x}
                    y1={top.y}
                    x2={bot.x}
                    y2={bot.y}
                    stroke="var(--theme-secondary)"
                    strokeWidth={1.35}
                    strokeDasharray="4 3"
                    opacity={0.76}
                  />
                  <circle cx={top.x} cy={top.y} r={3.2} fill="var(--theme-secondary)" />
                  <text
                    x={labelAnchor.x}
                    y={labelAnchor.y}
                    textAnchor="middle"
                    fill="var(--theme-text-muted)"
                    fontSize={12}
                    fontFamily='"Outfit", "Inter", sans-serif'
                    fontWeight={700}
                  >
                    {shaft.label}
                  </text>
                </g>
              );
            })}

            {DECK_SPECS.map((deck) => {
              const deckZones = SHIP_ZONES.filter((z) => z.deckNumber === deck.deckNumber);

              return (
                <g key={deck.deckNumber}>
                  {renderHullWakeAndThrusters({
                    deckNumber: deck.deckNumber,
                    mode: "overview",
                    hasThrusters: deck.hasThrusters,
                    idPrefix: ovPrefix,
                    thrusterOpacity: reveal.thrusterOpacity,
                  })}

                  {renderDeckHullSlab({
                    deckNumber: deck.deckNumber,
                    mode: "overview",
                    idPrefix: ovPrefix,
                    hasPortBreach: deck.hasPortBreach ? isPortBreachActive : false,
                  })}

                  {renderOverviewAuxiliarySectors(deck.deckNumber)}

                  {/* Paapuurin kylkirepeämä K03 */}
                  {deck.hasPortBreach && isPortBreachActive && (
                    <g pointerEvents="none">
                      <line
                        {...isoLine(deck.deckNumber, -0.39, -0.44, -0.24, -0.36, "overview", 1, 1)}
                        stroke={
                          portBreachTone === "warning"
                            ? "var(--theme-dawn)"
                            : "var(--theme-primary)"
                        }
                        strokeWidth={4.2}
                        opacity={0.35}
                      />
                      <line
                        {...isoLine(deck.deckNumber, -0.39, -0.44, -0.24, -0.36, "overview", 1, 1)}
                        stroke={
                          portBreachTone === "warning"
                            ? "var(--theme-dawn)"
                            : "var(--theme-primary)"
                        }
                        strokeWidth={2.2}
                      />
                    </g>
                  )}

                  {/* Keskuskäytävät */}
                  {MAIN_CORRIDORS.map((corr) => (
                    <polygon
                      key={`ov-${corr.u0}-${corr.v0}`}
                      points={polygonToPointsAttr(
                        buildZonePolygon(deck.deckNumber, corr, "overview"),
                      )}
                      fill="color-mix(in srgb, var(--theme-secondary) 11%, var(--theme-cockpit-surface))"
                      stroke="var(--theme-cockpit-border-soft)"
                      strokeWidth={0.7}
                      pointerEvents="none"
                    />
                  ))}

                  {/* Klikattava kansikortti vasemmassa reunassa */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Avaa ${deck.label}`}
                    className="cursor-pointer focus:outline-none"
                    onClick={(e) => triggerDeckFocus(e, deck.deckNumber)}
                    onKeyDown={(e) => handleKeyActivate(e, () => onFocusDeck(deck.deckNumber))}
                    onPointerEnter={() => {
                      setHoveredKey(`deck-${deck.deckNumber}`);
                      setHoveredLabel(`${deck.label} · ${deck.subtitle}`);
                    }}
                    onPointerLeave={() => {
                      setHoveredKey(null);
                      setHoveredLabel(null);
                    }}
                  >
                    {renderDeckSelectorCard(deck, hoveredKey === `deck-${deck.deckNumber}`)}
                  </g>

                  {/* Kannen osastot ja siipilohkot */}
                  {deckZones.map((zone) => {
                    const zonePoly = buildZonePolygon(deck.deckNumber, zone, "overview");
                    const zoneWalls = buildExtrudedWalls(
                      deck.deckNumber,
                      zone,
                      "overview",
                      7,
                      zone.doorSide,
                    );
                    const anchor = polygonCentroid(zonePoly);

                    if (zone.kind === "wing" && zone.wingId) {
                      const wing: CabinWingSpec | undefined = CABIN_WING_MAP[zone.wingId];
                      if (!wing) return null;

                      const wingCabins = (roomsByZone.get(zone.id) ?? []).filter(
                        (r) => r.kind === "cabin",
                      );
                      const occupiedCount = wingCabins.filter((c) => Boolean(c.occupant)).length;
                      const isSelected =
                        (selectedTarget?.type === "wing" &&
                          selectedTarget.wingId === wing.wingId) ||
                        highlightedWingId === wing.wingId;
                      const isHovered = hoveredKey === zone.id;
                      const colors = getZoneToneColors({
                        selected: isSelected,
                        hovered: isHovered,
                        isLocked: false,
                        isWing: true,
                      });

                      return (
                        <g
                          key={zone.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`${wing.title}: ${occupiedCount}/${wingCabins.length} varattu`}
                          className="cursor-pointer focus:outline-none"
                          onClick={(e) => {
                            triggerTargetClick(e, { type: "wing", wingId: wing.wingId });
                          }}
                          onKeyDown={(e) =>
                            handleKeyActivate(e, () =>
                              onSelectTarget({ type: "wing", wingId: wing.wingId }),
                            )
                          }
                          onPointerEnter={() => {
                            setHoveredKey(zone.id);
                            setHoveredLabel(
                              `${wing.title} · ${occupiedCount}/${wingCabins.length} varattu`,
                            );
                          }}
                          onPointerLeave={() => {
                            setHoveredKey(null);
                            setHoveredLabel(null);
                          }}
                        >
                          <polygon
                            points={polygonToPointsAttr(zonePoly)}
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth={colors.strokeWidth}
                          />
                          {renderOverviewZoneDetail(zone)}
                          {renderWallFaces(zoneWalls, colors)}
                          {renderHudPill({
                            x: anchor.x,
                            y: anchor.y - 2,
                            label: zone.defaultLabel,
                            badgeText: `${occupiedCount}/${wingCabins.length}`,
                            fill: colors.pillFill,
                            stroke: colors.pillStroke,
                            textColor: colors.pillText,
                            fontSize: 12.5,
                          })}
                        </g>
                      );
                    }

                    const room = (roomsByZone.get(zone.id) ?? [])[0];
                    if (!room) {
                      const fallbackColors = getZoneToneColors({
                        selected: false,
                        hovered: false,
                        isLocked: zone.kind === "sealed",
                      });
                      return (
                        <g key={zone.id} pointerEvents="none" opacity={0.55}>
                          <polygon
                            points={polygonToPointsAttr(zonePoly)}
                            fill={fallbackColors.fill}
                            stroke={fallbackColors.stroke}
                            strokeDasharray="3 2"
                            strokeWidth={0.9}
                          />
                        </g>
                      );
                    }

                    const isSelected =
                      selectedTarget?.type === "room" && selectedTarget.room.key === room.key;
                    const isHovered = hoveredKey === zone.id;
                    const clocks = activeClocksByRoom.get(room.key) ?? [];
                    const colors = getZoneToneColors({
                      selected: isSelected,
                      hovered: isHovered,
                      isLocked: room.isLocked,
                      statusTone: room.statusTone,
                      occupied: Boolean(room.occupant),
                      propKind: zone.propKind,
                    });
                    const badgeText =
                      clocks.length > 0
                        ? `${clocks.length} ${clocks.length === 1 ? "kello" : "kelloa"}`
                        : room.isLocked
                          ? "Lukittu"
                          : undefined;
                    const rawDisplayTitle = room.cabinCustomTitle || room.name || zone.defaultLabel;

                    return (
                      <g
                        key={zone.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${rawDisplayTitle}: ${room.statusLabel}`}
                        className="cursor-pointer focus:outline-none"
                        onClick={(e) => triggerTargetClick(e, { type: "room", room })}
                        onKeyDown={(e) =>
                          handleKeyActivate(e, () => onSelectTarget({ type: "room", room }))
                        }
                        onPointerEnter={() => {
                          setHoveredKey(zone.id);
                          setHoveredLabel(`${rawDisplayTitle} · ${room.statusLabel}`);
                        }}
                        onPointerLeave={() => {
                          setHoveredKey(null);
                          setHoveredLabel(null);
                        }}
                      >
                        <polygon
                          points={polygonToPointsAttr(zonePoly)}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth={colors.strokeWidth}
                          strokeDasharray={room.isLocked ? "4 2" : undefined}
                        />
                        {renderOverviewZoneDetail(zone, room.statusTone)}
                        {renderWallFaces(zoneWalls, colors, room.isLocked)}
                        {renderHudPill({
                          x: anchor.x,
                          y: anchor.y - 2,
                          label: formatZoneMapLabel(
                            rawDisplayTitle,
                            "overview",
                            Boolean(badgeText),
                            zone.id,
                          ),
                          badgeText,
                          fill: colors.pillFill,
                          stroke: colors.pillStroke,
                          textColor: colors.pillText,
                          fontSize: 12.5,
                        })}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {(() => {
            const scaleX0 = projectDeckPoint(3, -0.5, 0, "overview", 0).x;
            const scaleX1 = projectDeckPoint(3, 0.5, 0, "overview", 0).x;
            const scaleW = scaleX1 - scaleX0;
            const scaleY = 730;
            const segments = [0, 50, 100];

            return (
              <g data-overview-scale-bar="true" pointerEvents="none">
                {segments.map((mStart, idx) => {
                  const segX0 = scaleX0 + (mStart / HULL_LENGTH_METERS) * scaleW;
                  const segW = (50 / HULL_LENGTH_METERS) * scaleW;
                  return (
                    <rect
                      key={`ov-scale-seg-${mStart}`}
                      x={segX0}
                      y={scaleY - 3}
                      width={segW}
                      height={3}
                      fill={
                        idx % 2 === 0
                          ? "color-mix(in srgb, var(--theme-dawn) 45%, var(--theme-cockpit-surface))"
                          : "var(--theme-cockpit-border)"
                      }
                    />
                  );
                })}
                <line
                  x1={scaleX0}
                  y1={scaleY}
                  x2={scaleX1}
                  y2={scaleY}
                  stroke="var(--theme-cockpit-border)"
                  strokeWidth={1.1}
                />
                {[0, 50, 100, 150].map((meters) => {
                  const tx = scaleX0 + (meters / HULL_LENGTH_METERS) * scaleW;
                  return (
                    <g key={`ov-scale-tick-${meters}`}>
                      <line
                        x1={tx}
                        y1={scaleY - 4}
                        x2={tx}
                        y2={scaleY + 4}
                        stroke="var(--theme-cockpit-border)"
                        strokeWidth={1.1}
                      />
                      <text
                        x={tx}
                        y={scaleY + 15}
                        textAnchor={meters === 0 ? "start" : meters === 150 ? "end" : "middle"}
                        fontSize={10}
                        fill="var(--theme-text-subtle)"
                      >
                        {`${meters} m`}
                      </text>
                    </g>
                  );
                })}
                <text
                  x={scaleX1 + 14}
                  y={scaleY + 4}
                  textAnchor="start"
                  fontSize={10}
                  fill="var(--theme-text-subtle)"
                >
                  {`Runko ${HULL_LENGTH_METERS} m`}
                </text>
              </g>
            );
          })()}

          {renderHydroScanCrest(ovPrefix, reveal)}
        </g>
      </svg>
    );
  };

  const renderSingleDeckSvg = (deckNumber: number) => {
    const sgPrefix = `${svgUid}-sg`;
    const deck = DECK_SPEC_MAP[deckNumber] ?? DECK_SPECS[0];
    const deckZones = SHIP_ZONES.filter((z) => z.deckNumber === deckNumber);

    return (
      <svg
        role="img"
        aria-label={`Alus Aamunkoi, kannen ${deckNumber} pohjakuva`}
        viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full touch-none select-none"
      >
        {renderSvgDefs(sgPrefix, reveal)}
        <g transform={cameraTransform}>
          {renderBowPartingWave({
            deckNumber,
            mode: "single",
            idPrefix: sgPrefix,
            opacity: reveal.bowWakeOpacity,
          })}

          <g mask={`url(#${sgPrefix}-hull-reveal-mask)`}>
            {renderHullWakeAndThrusters({
              deckNumber,
              mode: "single",
              hasThrusters: deck.hasThrusters,
              idPrefix: sgPrefix,
              thrusterOpacity: reveal.thrusterOpacity,
            })}

            {renderDeckHullSlab({
              deckNumber,
              mode: "single",
              idPrefix: sgPrefix,
              hasPortBreach: deck.hasPortBreach ? isPortBreachActive : false,
            })}

            {renderSingleDeckHullStructure(deckNumber, {
              hasPortBreach: deck.hasPortBreach ? isPortBreachActive : false,
              breachTone: portBreachTone,
            })}

            {renderSingleDeckAuxiliarySectors(deckNumber)}

            {renderSingleDeckCorridors(deckNumber, deckZones)}

            {renderSingleDeckShafts(deckNumber)}

            {/* Kannen osastot ja siivet */}
            {deckZones.map((zone) => {
              if (zone.kind === "wing" && zone.wingId) {
                const wing = CABIN_WING_MAP[zone.wingId];
                if (!wing) return null;

                const layouts: WingCabinLayout[] = buildWingCabinLayouts(wing);
                const wingAnchor = getWingListButtonAnchor(wing);
                const wingCabins = (roomsByZone.get(zone.id) ?? []).filter(
                  (r) => r.kind === "cabin",
                );
                const occupiedCount = wingCabins.filter((c) => Boolean(c.occupant)).length;

                return (
                  <g key={zone.id}>
                    {renderSingleDeckWingCorridor(deckNumber, wing)}

                    {/* Jokainen yksittäinen hytti klikattavana 2.5D-huoneena */}
                    {layouts.map((layout) => {
                      const cabinPoly = buildZonePolygon(deckNumber, layout, "single");
                      const cabinRoom = roomsByKey.get(layout.roomKey);

                      if (!cabinRoom) {
                        return (
                          <polygon
                            key={layout.roomKey}
                            points={polygonToPointsAttr(cabinPoly)}
                            fill="color-mix(in srgb, var(--theme-bg) 94%, var(--theme-surface-tint))"
                            stroke="var(--theme-border-soft)"
                            strokeDasharray="2 2"
                            strokeWidth={0.75}
                            pointerEvents="none"
                          />
                        );
                      }

                      const isSelected =
                        selectedTarget?.type === "room" &&
                        selectedTarget.room.key === cabinRoom.key;
                      const isHovered = hoveredKey === cabinRoom.key;
                      const isOwn = Boolean(cabinRoom.occupant?.isOwn);
                      const isOccupied = Boolean(cabinRoom.occupant);
                      const colors = getZoneToneColors({
                        selected: isSelected,
                        hovered: isHovered,
                        isLocked: cabinRoom.isLocked,
                        statusTone: cabinRoom.statusTone,
                        isOwn,
                        occupied: isOccupied,
                      });

                      const walls = buildExtrudedWalls(
                        deckNumber,
                        layout,
                        "single",
                        13,
                        layout.doorSide,
                      );
                      const backWalls = walls.filter((w) => w.layer === "back");
                      const frontWalls = walls.filter((w) => w.layer === "front");
                      const { codeAnchor, initialsAnchor } = getCabinBadgeAnchors(
                        deckNumber,
                        layout,
                        isOccupied,
                      );

                      const statusDesc = cabinRoom.occupant
                        ? cabinRoom.occupant.name
                        : cabinRoom.isLocked
                          ? "Lukittu"
                          : "Vapaa";
                      const title = cabinRoom.cabinCustomTitle || cabinRoom.name;

                      return (
                        <g
                          key={cabinRoom.key}
                          role="button"
                          tabIndex={0}
                          aria-label={`${title}: ${statusDesc}`}
                          className="cursor-pointer focus:outline-none"
                          onClick={(e) => triggerTargetClick(e, { type: "room", room: cabinRoom })}
                          onKeyDown={(e) =>
                            handleKeyActivate(e, () =>
                              onSelectTarget({ type: "room", room: cabinRoom }),
                            )
                          }
                          onPointerEnter={() => {
                            setHoveredKey(cabinRoom.key);
                            setHoveredLabel(
                              `${formatCabinCode(cabinRoom.key)} · ${title} · ${statusDesc}`,
                            );
                          }}
                          onPointerLeave={() => {
                            setHoveredKey(null);
                            setHoveredLabel(null);
                          }}
                        >
                          <polygon
                            points={polygonToPointsAttr(cabinPoly)}
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth={colors.strokeWidth}
                          />

                          {renderSingleDeckWallAssembly({
                            deckNumber,
                            rect: layout,
                            faces: backWalls,
                            colors,
                            doorSide: layout.doorSide,
                            isLocked: cabinRoom.isLocked,
                            isCabin: true,
                          })}

                          {renderSingleDeckCabinInterior({
                            deckNumber,
                            layout,
                            isOwn,
                            isOccupied,
                          })}

                          {renderSingleDeckWallAssembly({
                            deckNumber,
                            rect: layout,
                            faces: frontWalls,
                            colors,
                            doorSide: layout.doorSide,
                            isLocked: cabinRoom.isLocked,
                            isCabin: true,
                          })}

                          {renderHudPill({
                            x: codeAnchor.x,
                            y: codeAnchor.y,
                            label: layout.code,
                            fill: colors.pillFill,
                            stroke: colors.pillStroke,
                            textColor: colors.pillText,
                            fontSize: 9.5,
                          })}

                          {cabinRoom.occupant &&
                            renderHudPill({
                              x: initialsAnchor.x,
                              y: initialsAnchor.y,
                              label: getOccupantInitials(cabinRoom.occupant.name),
                              fill: isOwn
                                ? "color-mix(in srgb, var(--theme-dawn) 34%, var(--theme-cockpit-surface))"
                                : "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-surface))",
                              stroke: isOwn ? "var(--theme-dawn)" : "var(--theme-secondary)",
                              textColor: "var(--theme-text)",
                              fontSize: 9,
                            })}
                        </g>
                      );
                    })}

                    {/* Katkoviivainen ohjainviiva siiven reunalta ulkopuoliselle listapainikkeelle */}
                    {(() => {
                      const wingMidU = (wing.u0 + wing.u1) / 2;
                      const wingEdgeV = wing.v0 < 0 ? wing.v0 : wing.v1;
                      const edgePt = projectDeckPoint(deckNumber, wingMidU, wingEdgeV, "single", 6);
                      const pillEdgeY = wing.v0 < 0 ? wingAnchor.y + 14 : wingAnchor.y - 14;
                      return (
                        <line
                          x1={edgePt.x}
                          y1={edgePt.y}
                          x2={wingAnchor.x}
                          y2={pillEdgeY}
                          stroke="var(--theme-cockpit-border)"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          pointerEvents="none"
                        />
                      );
                    })()}

                    {/* Klikattava siipilistan avauspainike leikkauksen ulkoreunalla */}
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`Avaa siiven ${wing.code} hyttilista`}
                      className="cursor-pointer focus:outline-none"
                      onClick={(e) => triggerTargetClick(e, { type: "wing", wingId: wing.wingId })}
                      onKeyDown={(e) =>
                        handleKeyActivate(e, () =>
                          onSelectTarget({ type: "wing", wingId: wing.wingId }),
                        )
                      }
                      onPointerEnter={() => {
                        setHoveredKey(wing.wingId);
                        setHoveredLabel(
                          `${wing.title} · ${occupiedCount}/${wingCabins.length} varattu`,
                        );
                      }}
                      onPointerLeave={() => {
                        setHoveredKey(null);
                        setHoveredLabel(null);
                      }}
                    >
                      {renderHudPill({
                        x: wingAnchor.x,
                        y: wingAnchor.y,
                        label: `Siipi ${wing.code} · Hyttilista`,
                        badgeText: `${occupiedCount}/${wingCabins.length}`,
                        fill: "var(--theme-cockpit-elevated)",
                        stroke: "var(--theme-cockpit-border)",
                        textColor: "var(--theme-text)",
                        fontSize: 13,
                      })}
                    </g>
                  </g>
                );
              }

              const zonePoly = buildZonePolygon(deckNumber, zone, "single");
              const walls = buildExtrudedWalls(deckNumber, zone, "single", 18, zone.doorSide);
              const backWalls = walls.filter((w) => w.layer === "back");
              const frontWalls = walls.filter((w) => w.layer === "front");
              const room = (roomsByZone.get(zone.id) ?? [])[0];
              const anchor = polygonInnerHeaderAnchor(deckNumber, zone, "single");

              if (!room) {
                const fallbackColors = getZoneToneColors({
                  selected: false,
                  hovered: false,
                  isLocked: zone.kind === "sealed",
                  propKind: zone.propKind,
                });
                return (
                  <g key={zone.id} pointerEvents="none" opacity={0.62}>
                    <polygon
                      points={polygonToPointsAttr(zonePoly)}
                      fill={fallbackColors.fill}
                      stroke={fallbackColors.stroke}
                      strokeDasharray="4 2"
                      strokeWidth={1}
                    />
                    {renderSingleDeckWallAssembly({
                      deckNumber,
                      rect: zone,
                      faces: backWalls,
                      colors: fallbackColors,
                      doorSide: zone.doorSide,
                      isLocked: zone.kind === "sealed",
                    })}
                    {renderSingleDeckZoneDetail(zone, {
                      isLocked: zone.kind === "sealed",
                      statusTone: zone.kind === "sealed" ? "locked" : "normal",
                      selected: false,
                      hovered: false,
                    })}
                    {renderSingleDeckWallAssembly({
                      deckNumber,
                      rect: zone,
                      faces: frontWalls,
                      colors: fallbackColors,
                      doorSide: zone.doorSide,
                      isLocked: zone.kind === "sealed",
                    })}
                  </g>
                );
              }

              const isSelected =
                selectedTarget?.type === "room" && selectedTarget.room.key === room.key;
              const isHovered = hoveredKey === zone.id;
              const clocks = activeClocksByRoom.get(room.key) ?? [];
              const colors = getZoneToneColors({
                selected: isSelected,
                hovered: isHovered,
                isLocked: room.isLocked,
                statusTone: room.statusTone,
                occupied: Boolean(room.occupant),
                propKind: zone.propKind,
              });
              const badgeText =
                clocks.length > 0
                  ? `${clocks.length} ${clocks.length === 1 ? "kello" : "kelloa"}`
                  : room.isLocked
                    ? "Lukittu"
                    : undefined;
              const rawDisplayTitle = room.cabinCustomTitle || room.name || zone.defaultLabel;

              return (
                <g
                  key={zone.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${rawDisplayTitle}: ${room.statusLabel}`}
                  className="cursor-pointer focus:outline-none"
                  onClick={(e) => triggerTargetClick(e, { type: "room", room })}
                  onKeyDown={(e) =>
                    handleKeyActivate(e, () => onSelectTarget({ type: "room", room }))
                  }
                  onPointerEnter={() => {
                    setHoveredKey(zone.id);
                    setHoveredLabel(`${rawDisplayTitle} · ${room.statusLabel}`);
                  }}
                  onPointerLeave={() => {
                    setHoveredKey(null);
                    setHoveredLabel(null);
                  }}
                >
                  <polygon
                    points={polygonToPointsAttr(zonePoly)}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={colors.strokeWidth}
                    strokeDasharray={room.isLocked ? "5 3" : undefined}
                  />
                  {renderSingleDeckWallAssembly({
                    deckNumber,
                    rect: zone,
                    faces: backWalls,
                    colors,
                    doorSide: zone.doorSide,
                    isLocked: room.isLocked,
                  })}
                  {renderSingleDeckZoneDetail(zone, {
                    isLocked: room.isLocked,
                    statusTone: room.statusTone,
                    selected: isSelected,
                    hovered: isHovered,
                  })}
                  {renderSingleDeckWallAssembly({
                    deckNumber,
                    rect: zone,
                    faces: frontWalls,
                    colors,
                    doorSide: zone.doorSide,
                    isLocked: room.isLocked,
                  })}
                  {renderHudPill({
                    x: anchor.x,
                    y: anchor.y,
                    label: formatZoneMapLabel(
                      rawDisplayTitle,
                      "single",
                      Boolean(badgeText),
                      zone.id,
                    ),
                    badgeText,
                    fill: colors.pillFill,
                    stroke: colors.pillStroke,
                    textColor: colors.pillText,
                    fontSize: 12.5,
                  })}
                </g>
              );
            })}

            {renderSingleDeckAuxiliaryLabels(deckNumber)}
          </g>

          {renderHydroScanCrest(sgPrefix, reveal)}
        </g>
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      className="flex flex-col w-full h-full overflow-hidden"
    >
      {/* Ylärivin paluupainike ja kamerasäätimet */}
      <div className="shrink-0 px-3.5 py-2.5 tablet:px-4 z-10 flex flex-wrap items-center justify-between gap-2">
        {focusedDeck !== null && activeDeckSpec ? (
          <div className="ds-console-pod">
            <div className="px-1.5 py-1 flex flex-wrap items-center gap-1.5">
              <ConsoleButton
                variant="outline"
                size="default"
                iconLeft="chevron-left"
                onClick={() => onFocusDeck(null)}
              >
                Kaikki kannet
              </ConsoleButton>
              <ConsolePill tone="secondary">{activeDeckSpec.label}</ConsolePill>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="ds-console-pod">
          <div className="px-1.5 py-1 flex items-center gap-1.5">
            <ConsoleButton
              variant="outline"
              size="default"
              iconLeft="plus"
              aria-label="Lähennä karttaa"
              onClick={() => setScale((prev) => clampScale(Number((prev * 1.25).toFixed(3))))}
            />
            <ConsoleButton
              variant="outline"
              size="default"
              iconLeft="minus"
              aria-label="Loitonna karttaa"
              onClick={() => setScale((prev) => clampScale(Number((prev * 0.8).toFixed(3))))}
            />
            <ConsoleButton
              variant="ghost"
              size="default"
              iconLeft="compass"
              onClick={handleResetCamera}
            >
              Keskitä
            </ConsoleButton>
          </div>
        </div>
      </div>

      {/* Yhtenäinen 2-tasoinen 2.5D-pohjakuva */}
      <div className="relative flex-1 min-h-0 w-full">
        {focusedDeck !== null ? renderSingleDeckSvg(focusedDeck) : renderOverviewSvg()}
      </div>

      {/* Työpöydän alarivi: kiinteäkorkuinen paikka hover-tunnisteelle */}
      <div
        data-testid="ship-canvas-footer"
        className="pointer-events-none hidden desktop:flex shrink-0 h-11 px-3.5 tablet:px-4 z-10 items-center justify-between gap-2 overflow-hidden"
      >
        <div className="min-w-0 flex items-center">
          {hoveredLabel && (
            <ConsolePill
              tone="accent"
              icon="info"
              className="max-w-full overflow-hidden [&>span]:truncate"
            >
              {hoveredLabel}
            </ConsolePill>
          )}
        </div>
      </div>
    </div>
  );
}
