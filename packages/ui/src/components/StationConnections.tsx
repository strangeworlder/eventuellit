import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnchoredTooltip } from "./AnchoredTooltip";
import { DiceIcon } from "./DiceIcon";
import { Heading } from "./Heading";

export interface ConnectedStation {
  id: string;
  title: string;
  order?: number;
  description?: string;
  tension?: string;
}

export interface StationConnectionsProps {
  /** Comma-separated list of connected station titles, optionally with compass direction.
   *  e.g. "Seula:N, Verso:SE, Pesä:NW"
   */
  connections: string;
  /** Tension level of the current station (affects center icon color) */
  tension?: string;
  /** Order number of the current station */
  currentStationOrder?: number;
  /** All stations to search for connection matches */
  stations: ConnectedStation[];
  /** Base path for building station links, e.g. "/" or "/world" */
  basePath?: string;
}

type CompassDir = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

const COMPASS_ANGLES: Record<CompassDir, number> = {
  N: -Math.PI / 2,
  NE: -Math.PI / 4,
  E: 0,
  SE: Math.PI / 4,
  S: Math.PI / 2,
  SW: (3 * Math.PI) / 4,
  W: Math.PI,
  NW: -(3 * Math.PI) / 4,
};

function directionToAngle(dir: string | undefined): number {
  if (dir && dir in COMPASS_ANGLES) {
    return COMPASS_ANGLES[dir as CompassDir];
  }
  return 0;
}

function tensionColor(tension: string | undefined): string {
  switch (tension) {
    case "Murtunut":
      return "var(--color-primary-500)";
    case "Korkea":
      return "var(--color-accent-500)";
    default:
      return "var(--color-secondary-500)";
  }
}

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 155;

/** Derive a placement hint for the tooltip based on the node angle */
function tooltipPlacement(
  angle: number,
): "top" | "bottom" | "left" | "right" {
  let deg = (angle * 180) / Math.PI;
  while (deg < 0) deg += 360;
  deg %= 360;
  // If the node is on the right side of the chart (East), the tooltip should be placed on its left side 
  // (pointing inwards to the center)
  if (deg >= 315 || deg < 45) return "left";
  // Node is South -> Tooltip Top
  if (deg >= 45 && deg < 135) return "top";
  // Node is West -> Tooltip Right
  if (deg >= 135 && deg < 225) return "right";
  // Node is North -> Tooltip Bottom
  return "bottom";
}

export function StationConnections({
  connections,
  tension,
  currentStationOrder,
  stations,
  basePath = "/",
}: StationConnectionsProps) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      // Close tooltip if the click target is outside any tooltip and not a toggle button
      if (!target.closest(".anchored-tooltip") && !target.closest(".station-node-btn")) {
        setOpenTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!connections.trim()) return null;

  const rawTokens = connections
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawTokens.length === 0) return null;

  /** Parse each token: "Seula:N" → {title:"Seula", dir:"N"} */
  const tokens = rawTokens.map((token, i) => {
    const parts = token.split(":").map((p) => p.trim());
    const rawTitle = parts[0] ?? token;
    const rawDir = parts[1];
    const count = rawTokens.length;
    // Fallback: evenly distribute if no direction given
    const fallbackAngle = (2 * Math.PI * i) / count - Math.PI / 2;
    const angle = rawDir ? directionToAngle(rawDir) : fallbackAngle;
    return { title: rawTitle, dir: rawDir, angle };
  });

  const nodes = tokens.map(({ title, angle }) => {
    const x = CX + RADIUS * Math.cos(angle);
    const y = CY + RADIUS * Math.sin(angle);
    const station = stations.find(
      (s) => s.title.toLowerCase() === title.toLowerCase(),
    );
    return { title, angle, x, y, station };
  });

  const currentColor = tensionColor(tension);

  const stationHref = (station: ConnectedStation) =>
    basePath === "/" ? `/${station.id}` : `${basePath}/${station.id}`;

  return (
    <div className="mt-8 px-4 tablet:pr-8 tablet:pl-0" ref={containerRef}>
      <Heading className="mb-6">
        Yhteydet
      </Heading>

      <div className="relative w-full max-w-md mx-auto aspect-square overflow-visible">
        {/* SVG layer: directional lines + center glow */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          <defs>
            {nodes.map(({ title, station }) => {
              const color = tensionColor(station?.tension);
              const safeId = title.replace(/[^a-zA-Z0-9]/g, "_");
              return (
                <linearGradient
                  key={title}
                  id={`line-grad-${safeId}`}
                  gradientUnits="userSpaceOnUse"
                  x1={CX}
                  y1={CY}
                  x2={CX + RADIUS * Math.cos(nodes.find(n => n.title === title)!.angle)}
                  y2={CY + RADIUS * Math.sin(nodes.find(n => n.title === title)!.angle)}
                >
                  <stop offset="0%" stopColor={currentColor} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.2" />
                </linearGradient>
              );
            })}
          </defs>

          {nodes.map(({ title, x, y, station }) => {
            const safeId = title.replace(/[^a-zA-Z0-9]/g, "_");
            return (
              <line
                key={title}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
                stroke={`url(#line-grad-${safeId})`}
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
            );
          })}

          {/* Directional arrow marks at the node end of each line */}
          {nodes.map(({ title, x, y, angle, station }) => {
            const color = tensionColor(station?.tension);
            const tipX = x;
            const tipY = y;
            const arrowLen = 8;
            const spread = Math.PI / 6;
            const backAngle = angle + Math.PI;
            const ax = tipX + arrowLen * Math.cos(backAngle - spread);
            const ay = tipY + arrowLen * Math.sin(backAngle - spread);
            const bx = tipX + arrowLen * Math.cos(backAngle + spread);
            const by = tipY + arrowLen * Math.sin(backAngle + spread);
            return (
              <polyline
                key={`arrow-${title}`}
                points={`${ax},${ay} ${tipX},${tipY} ${bx},${by}`}
                fill="none"
                stroke={color}
                strokeOpacity={0.5}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Glow ring around center */}
          <circle
            cx={CX}
            cy={CY}
            r={22}
            fill="none"
            stroke={currentColor}
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        </svg>

        {/* Center D20 icon representing current station */}
        <div
          className="absolute"
          style={{
            left: `${(CX / SIZE) * 100}%`,
            top: `${(CY / SIZE) * 100}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <DiceIcon
            faces={20}
            value={currentStationOrder}
            size="lg"
            active
            style={
              {
                "--theme-primary": currentColor,
                "--theme-secondary": currentColor,
              } as React.CSSProperties
            }
          />
        </div>

        {/* HTML layer: interactive station nodes */}
        {nodes.map(({ title, station, x, y, angle }) => {
          const color = tensionColor(station?.tension);
          const placement = tooltipPlacement(angle);

          return (
            <div
              key={title}
              className="absolute"
              style={{
                left: `${(x / SIZE) * 100}%`,
                top: `${(y / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: openTooltip === title ? 50 : 10,
              }}
            >
              {/* Anchor scope wrapper required for AnchoredTooltip */}
              <div className="flex flex-col items-center gap-1 relative">
                {station ? (
                  <button
                    type="button"
                    className="station-node-btn block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] rounded-sm cursor-pointer"
                    aria-label={title}
                    onClick={() => setOpenTooltip(openTooltip === title ? null : title)}
                    style={{ "--theme-primary": color, "--theme-secondary": color } as React.CSSProperties}
                  >
                    <DiceIcon
                      faces={20}
                      value={station.order}
                      size="md"
                      active
                      className="hover:scale-110 transition-transform duration-200"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="station-node-btn cursor-pointer focus-visible:outline-none"
                    onClick={() => setOpenTooltip(openTooltip === title ? null : title)}
                  >
                    <DiceIcon
                      faces={20}
                      size="md"
                      style={{ "--theme-primary": color, "--theme-secondary": color } as React.CSSProperties}
                    />
                  </button>
                )}
                <AnchoredTooltip
                  placement={placement}
                  variant="station-description"
                  className="flex flex-col gap-1 z-50 shadow-2xl"
                  isOpen={openTooltip === title}
                >
                  <span className="text-xs font-bold block" style={{ color }}>
                    {title}
                  </span>
                  {station ? (
                    <>
                      <span className="text-xs leading-relaxed text-[var(--theme-text)]/70 block">
                        {station.description || "Ei kuvausta."}
                      </span>
                      <Link
                        to={stationHref(station)}
                        className="text-xs font-semibold hover:underline mt-1"
                        style={{ color }}
                      >
                        Siirry asemalle →
                      </Link>
                    </>
                  ) : (
                    <span className="text-xs opacity-50 block">Aseman tiedot puuttuvat.</span>
                  )}
                </AnchoredTooltip>

                <span
                  className="text-[0.6rem] font-semibold tracking-wide text-center leading-tight max-w-[64px] truncate"
                  style={{ color }}
                >
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
