import React, { useState } from "react";
import { Link } from "react-router-dom";

export interface ConnectedStation {
  id: string;
  title: string;
  description?: string;
  tension?: string;
}

export interface StationConnectionsProps {
  /** Comma-separated list of connected station titles */
  connections: string;
  /** Tension level of the current station (affects center dot color) */
  tension?: string;
  /** All stations to search for connection matches */
  stations: ConnectedStation[];
  /** Base path for building station links, e.g. "/" or "/world" */
  basePath?: string;
}

function tensionColor(tension: string | undefined): string {
  switch (tension) {
    case "Murtunut":
      return "var(--theme-primary)";
    case "Korkea":
      return "var(--theme-accent)";
    default:
      return "var(--theme-secondary)";
  }
}

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 155;
const CENTER_R = 10;

export function StationConnections({
  connections,
  tension,
  stations,
  basePath = "/",
}: StationConnectionsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!connections.trim()) return null;

  const connectedTitles = connections
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (connectedTitles.length === 0) return null;

  const count = connectedTitles.length;

  const nodes = connectedTitles.map((title, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = CX + RADIUS * Math.cos(angle);
    const y = CY + RADIUS * Math.sin(angle);
    const station = stations.find(
      (s) => s.title.toLowerCase() === title.toLowerCase(),
    );
    return { title, station, x, y };
  });

  const currentColor = tensionColor(tension);

  const stationHref = (station: ConnectedStation) =>
    basePath === "/" ? `/${station.id}` : `${basePath}/${station.id}`;

  return (
    <div className="mt-8 px-4 tablet:pr-8 tablet:pl-0">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--theme-text)]/50 mb-6">
        Yhteydet
      </h3>

      <div className="relative w-full max-w-md mx-auto aspect-square overflow-visible">
        {/* SVG layer: dashed lines + center dot */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
        >
          {nodes.map(({ title, x, y, station }) => (
            <line
              key={title}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke={tensionColor(station?.tension)}
              strokeOpacity={0.3}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ))}

          {/* Glow ring around center */}
          <circle
            cx={CX}
            cy={CY}
            r={CENTER_R + 6}
            fill="none"
            stroke={currentColor}
            strokeOpacity={0.25}
            strokeWidth={1}
          />

          {/* Center dot */}
          <circle
            cx={CX}
            cy={CY}
            r={CENTER_R}
            fill={currentColor}
            fillOpacity={0.75}
          />
        </svg>

        {/* HTML layer: interactive station nodes */}
        {nodes.map(({ title, station, x, y }) => {
          const color = tensionColor(station?.tension);
          const isExpanded = expanded === title;
          const isLeft = x < CX;
          const isTop = y < CY;

          return (
            <div
              key={title}
              className="absolute"
              style={{
                left: `${(x / SIZE) * 100}%`,
                top: `${(y / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isExpanded ? 20 : 10,
              }}
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : title)}
                className="relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: `color-mix(in srgb, ${color} 12%, var(--theme-bg, #0a0a0a))`,
                  color,
                  border: `1.5px solid ${color}`,
                  boxShadow: isExpanded
                    ? `0 0 20px ${color}60, 0 0 8px ${color}40`
                    : `0 0 6px ${color}30`,
                }}
              >
                {title}
              </button>

              {isExpanded && (
                <div
                  className="absolute w-52 rounded-lg p-3"
                  style={{
                    background: "var(--theme-bg, #0a0a0a)",
                    border: `1px solid ${color}`,
                    boxShadow: `0 4px 24px ${color}40`,
                    zIndex: 30,
                    ...(isTop
                      ? { bottom: "calc(100% + 10px)" }
                      : { top: "calc(100% + 10px)" }),
                    ...(isLeft ? { right: "0" } : { left: "0" }),
                  }}
                >
                  {station ? (
                    <>
                      <p className="text-[var(--theme-text)]/70 text-xs leading-relaxed mb-3">
                        {station.description || "Ei kuvausta."}
                      </p>
                      <Link
                        to={stationHref(station)}
                        className="text-xs font-semibold hover:underline"
                        style={{ color }}
                      >
                        Siirry asemalle →
                      </Link>
                    </>
                  ) : (
                    <p className="text-[var(--theme-text)]/50 text-xs">
                      Aseman tiedot puuttuvat.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
