import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Transition } from "framer-motion";
import { AnchoredTooltip, type AnchoredTooltipPlacement } from "./AnchoredTooltip";
import { DiceIcon } from "./DiceIcon";
import { Heading } from "./Heading";
import { Text } from "./Text";

export type CompassDir = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface StationConnectionNode {
  title: string;
  direction: CompassDir;
  type?: "station" | "marker";
  shape?: 4 | 6 | 8 | 10 | 12 | 20 | "swirl";
}

export interface ConnectedStation {
  id: string;
  title: string;
  order?: number;
  description?: string;
  tension?: string;
}

export interface StationConnectionsProps {
  /** Array of connection nodes built from the connections data file */
  connections: StationConnectionNode[];
  /** Tension level of the current station */
  tension?: string;
  /** Order number of the current station (shown on center die) */
  currentStationOrder?: number;
  /** Title of the current station – drives animation identity */
  currentStationTitle: string;
  /** All stations for resolving connection metadata */
  stations: ConnectedStation[];
  /** Base path for building station links, e.g. "/" or "/world" */
  basePath?: string;
  /** Override navigation handler (defaults to react-router navigate) */
  onNavigate?: (stationId: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 155;

/**
 * How far to pan the scene when navigating (SVG units).
 * Must exceed SIZE/2 / cos(smallest compass angle) ≈ 297 so the center die
 * always exits the container even on diagonal navigations.
 */
const PAN_DISTANCE = RADIUS * 2.4;

/**
 * Visual scale ratio between DiceIcon size="md" (32px) and size="lg" (48px).
 * Used to animate the hero die from peripheral size to center size.
 */
const MD_TO_LG_SCALE = 1.5;

const EXIT_DURATION = 0.28;
const ENTER_STAGGER = 0.05;

const SCENE_TRANSITION: Transition = { duration: EXIT_DURATION, ease: "easeInOut" };
const HERO_TRANSITION: Transition = { type: "spring", stiffness: 190, damping: 24 };

function nodeEnterTransition(i: number): Transition {
  return { type: "spring", stiffness: 260, damping: 26, delay: 0.06 + i * ENTER_STAGGER };
}

function lineEnterTransition(i: number): Transition {
  return { duration: 0.28, ease: "easeOut", delay: 0.1 + i * ENTER_STAGGER };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function tooltipPlacement(direction: CompassDir): AnchoredTooltipPlacement {
  const map: Record<CompassDir, AnchoredTooltipPlacement> = {
    N: "bottom",
    NE: "bottom-left",
    E: "left",
    SE: "top-left",
    S: "top",
    SW: "top-right",
    W: "right",
    NW: "bottom-right",
  };
  return map[direction];
}

function arrowPoints(x: number, y: number, angle: number): string {
  const len = 8;
  const spread = Math.PI / 6;
  const back = angle + Math.PI;
  const ax = x + len * Math.cos(back - spread);
  const ay = y + len * Math.sin(back - spread);
  const bx = x + len * Math.cos(back + spread);
  const by = y + len * Math.sin(back + spread);
  return `${ax},${ay} ${x},${y} ${bx},${by}`;
}

function posStyle(x: number, y: number): React.CSSProperties {
  return {
    position: "absolute",
    left: `${(x / SIZE) * 100}%`,
    top: `${(y / SIZE) * 100}%`,
    transform: "translate(-50%,-50%)",
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

type AnimPhase = "idle" | "exit" | "enter";

export function StationConnections({
  connections,
  tension,
  currentStationOrder,
  currentStationTitle,
  stations,
  basePath = "/",
  onNavigate,
}: StationConnectionsProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerPx, setContainerPx] = useState(SIZE);

  // Animation phase state machine
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const exitDirRef = useRef<CompassDir | null>(null);
  const prevTitleRef = useRef(currentStationTitle);

  // Display data – deliberately stale during exit so the OLD map stays visible
  // while the scene pans out. Swapped to new props when exit animation completes.
  const [displayConnections, setDisplayConnections] =
    useState(connections);
  const [displayTension, setDisplayTension] = useState(tension);
  const [displayStationOrder, setDisplayStationOrder] =
    useState(currentStationOrder);

  // ── Measure container for coordinate conversion ───────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerPx(el.offsetWidth || SIZE);
    const ro = new ResizeObserver(() =>
      setContainerPx(el.offsetWidth || SIZE),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Detect station change → start exit ───────────────────────────────────
  useEffect(() => {
    if (currentStationTitle !== prevTitleRef.current) {
      prevTitleRef.current = currentStationTitle;
      setPhase("exit");
    }
  }, [currentStationTitle]);

  // ── Safety: unstick enter phase if nodes somehow never complete ───────────
  useEffect(() => {
    if (phase !== "enter") return;
    const t = setTimeout(() => {
      setPhase("idle");
      exitDirRef.current = null;
    }, 1800);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Derived values ────────────────────────────────────────────────────────

  // Scale factor: how many CSS pixels equal one SVG viewBox unit
  const scale = containerPx / SIZE;

  const displayNodes = displayConnections.map(
    ({ title, direction, type, shape }) => {
      const angle = COMPASS_ANGLES[direction];
      const isMarker = type === "marker";
      return {
        title,
        direction,
        angle,
        x: CX + RADIUS * Math.cos(angle),
        y: CY + RADIUS * Math.sin(angle),
        isMarker,
        shape: (shape ?? 20) as 4 | 6 | 8 | 10 | 12 | 20 | "swirl",
        station: isMarker
          ? null
          : (stations.find(
              (s) => s.title.toLowerCase() === title.toLowerCase(),
            ) ?? null),
      };
    },
  );

  const currentColor = tensionColor(displayTension);

  // Hero: the peripheral node that was clicked and is now moving to center
  const heroDir = exitDirRef.current;
  const heroNode =
    phase === "exit" && heroDir
      ? (displayNodes.find(
          (n) => n.direction === heroDir && !n.isMarker,
        ) ?? null)
      : null;

  // Pan offset (CSS pixels): scene moves in opposite direction to exit dir
  const exitAngle = heroDir ? COMPASS_ANGLES[heroDir] : 0;
  const panX =
    phase === "exit" && heroDir
      ? -Math.cos(exitAngle) * PAN_DISTANCE * scale
      : 0;
  const panY =
    phase === "exit" && heroDir
      ? -Math.sin(exitAngle) * PAN_DISTANCE * scale
      : 0;

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleStationClick = (
    station: ConnectedStation,
    direction: CompassDir,
  ) => {
    if (phase !== "idle") return;
    exitDirRef.current = direction;
    if (onNavigate) {
      onNavigate(station.id);
    } else {
      const href =
        basePath === "/" ? `/${station.id}` : `${basePath}/${station.id}`;
      navigate(href);
    }
  };

  // Called when the scene-group exit animation finishes: swap data → enter
  const handleSceneExitComplete = () => {
    if (phase !== "exit") return;
    setDisplayConnections(connections);
    setDisplayTension(tension);
    setDisplayStationOrder(currentStationOrder);
    setPhase("enter");
  };

  // Called when the last enter-phase node finishes its entrance animation
  const handleAllEnterComplete = () => {
    setPhase("idle");
    exitDirRef.current = null;
  };

  // ── SVG sub-renders ───────────────────────────────────────────────────────

  const gradientDefs = (
    nodes: typeof displayNodes,
    centerColor: string,
  ) => (
    <defs>
      {nodes.map(({ title, station, angle }) => {
        const safeId = title.replace(/[^a-zA-Z0-9]/g, "_");
        const endColor = tensionColor(station?.tension);
        return (
          <linearGradient
            key={title}
            id={`line-grad-${safeId}`}
            gradientUnits="userSpaceOnUse"
            x1={CX}
            y1={CY}
            x2={CX + RADIUS * Math.cos(angle)}
            y2={CY + RADIUS * Math.sin(angle)}
          >
            <stop offset="0%" stopColor={centerColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={endColor} stopOpacity="0.2" />
          </linearGradient>
        );
      })}
    </defs>
  );

  /**
   * Static SVG lines (used in idle + scene group during exit).
   * excludeTitle: omit the hero node's line so it doesn't visually detach.
   */
  const staticLines = (
    nodes: typeof displayNodes,
    excludeTitle?: string,
  ) =>
    nodes
      .filter((n) => n.title !== excludeTitle)
      .map(({ title, x, y, angle, station, isMarker }) => {
        const safeId = title.replace(/[^a-zA-Z0-9]/g, "_");
        const color = tensionColor(station?.tension);
        return (
          <React.Fragment key={title}>
            <line
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke={
                isMarker
                  ? "var(--color-secondary-500)"
                  : `url(#line-grad-${safeId})`
              }
              strokeWidth={1.5}
              strokeDasharray="5 4"
              strokeOpacity={isMarker ? 0.15 : 1}
            />
            {!isMarker && (
              <polyline
                points={arrowPoints(x, y, angle)}
                fill="none"
                stroke={color}
                strokeOpacity={0.5}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </React.Fragment>
        );
      });

  /** Animated SVG lines (used in enter phase – fade in staggered). */
  const animatedLines = (nodes: typeof displayNodes) =>
    nodes.map(({ title, x, y, angle, station, isMarker }, i) => {
      const safeId = title.replace(/[^a-zA-Z0-9]/g, "_");
      const color = tensionColor(station?.tension);
      const lt = lineEnterTransition(i);
      return (
        <React.Fragment key={title}>
          <motion.line
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke={
              isMarker
                ? "var(--color-secondary-500)"
                : `url(#line-grad-${safeId})`
            }
            strokeWidth={1.5}
            strokeDasharray="5 4"
            strokeOpacity={isMarker ? 0.15 : 1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={lt}
          />
          {!isMarker && (
            <motion.polyline
              points={arrowPoints(x, y, angle)}
              fill="none"
              stroke={color}
              strokeOpacity={0.5}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={lt}
            />
          )}
        </React.Fragment>
      );
    });

  // ── Node content renderer ─────────────────────────────────────────────────

  const nodeContent = (
    node: (typeof displayNodes)[0],
    interactive: boolean,
  ) => {
    const color = tensionColor(node.station?.tension);
    const placement = tooltipPlacement(node.direction);

    if (node.isMarker) {
      return (
        <DiceIcon
          faces={node.shape as 12 | "swirl"}
          size="md"
          hideValue
          style={
            {
              "--theme-primary": "var(--color-secondary-500)",
              "--theme-secondary": "var(--color-secondary-500)",
              opacity: 0.35,
            } as React.CSSProperties
          }
        />
      );
    }

    const anchorId = `--station-node-${node.direction}`;

    return (
      <div className="group flex flex-col items-center gap-1 relative">
        {node.station ? (
          <button
            type="button"
            className="station-node-btn block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] rounded-sm cursor-pointer"
            aria-label={`Siirry asemalle ${node.title}`}
            onClick={
              interactive
                ? () => handleStationClick(node.station!, node.direction)
                : undefined
            }
            style={
              {
                "--theme-primary": color,
                "--theme-secondary": color,
                anchorName: anchorId,
              } as React.CSSProperties & { anchorName?: string }
            }
          >
            <DiceIcon
              faces={20}
              value={node.station.order}
              size="md"
              active
              className="hover:scale-110 transition-transform duration-200"
            />
          </button>
        ) : (
          <DiceIcon
            faces={20}
            size="md"
            style={
              {
                "--theme-primary": color,
                "--theme-secondary": color,
              } as React.CSSProperties
            }
          />
        )}

        {node.station && interactive && (
          <AnchoredTooltip
            anchorName={anchorId}
            placement={placement}
            variant="station-description"
            className="flex flex-col gap-1 z-50 shadow-2xl"
          >
            <span className="text-xs font-bold block" style={{ color }}>
              {node.title}
            </span>
            <span className="text-xs leading-relaxed block">
              {node.station.description ?? "Ei kuvausta."}
            </span>
          </AnchoredTooltip>
        )}

        <Text
          variant="node"
          className="text-center max-w-[64px] truncate"
          style={{ color }}
        >
          {node.title}
        </Text>
      </div>
    );
  };

  // ── Guard ─────────────────────────────────────────────────────────────────

  if (!connections.length && !displayConnections.length) return null;

  const lastNodeIndex = displayNodes.length - 1;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="px-4 tablet:pr-8 tablet:pl-0">
      <Heading className="mb-3">Yhteydet</Heading>

      <div
        ref={containerRef}
        className={`relative w-full max-w-md mx-auto aspect-square bg-transparent border border-[var(--theme-secondary)] rounded-xl ${phase === "idle" ? "overflow-visible" : "overflow-hidden"}`}
      >
        {/* ═══════════════ IDLE ═══════════════ */}
        {phase === "idle" && (
          <>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              aria-hidden="true"
            >
              {gradientDefs(displayNodes, currentColor)}
              {staticLines(displayNodes)}
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

            {/* Center die */}
            <div style={{ ...posStyle(CX, CY), zIndex: 5 }}>
              <DiceIcon
                faces={20}
                value={displayStationOrder}
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

            {/* Peripheral nodes */}
            {displayNodes.map((node) => (
              <div
                key={node.title}
                className="z-10 hover:z-[60]"
                style={posStyle(node.x, node.y)}
              >
                {nodeContent(node, true)}
              </div>
            ))}
          </>
        )}

        {/* ═══════════════ EXIT ═══════════════ */}
        {phase === "exit" && (
          <>
            {/*
             * Scene group: contains all old nodes + their lines.
             * Pans in the direction OPPOSITE to the clicked station and fades out.
             * Hero line is excluded so it doesn't appear to detach.
             */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: panX, y: panY, opacity: 0 }}
              transition={SCENE_TRANSITION}
              onAnimationComplete={handleSceneExitComplete}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                aria-hidden="true"
              >
                {gradientDefs(displayNodes, currentColor)}
                {staticLines(displayNodes, heroNode?.title)}
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

              {/* Old center die */}
              <div style={{ ...posStyle(CX, CY), zIndex: 5 }}>
                <DiceIcon
                  faces={20}
                  value={displayStationOrder}
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

              {/* Non-hero peripheral nodes (pan with scene) */}
              {displayNodes
                .filter((n) => n.title !== heroNode?.title)
                .map((node) => (
                  <div
                    key={node.title}
                    style={{ ...posStyle(node.x, node.y), zIndex: 10 }}
                  >
                    {nodeContent(node, false)}
                  </div>
                ))}
            </motion.div>

            {/*
             * Hero node: detaches from the scene and glides to center.
             * Positioned at center with an initial CSS-pixel offset that places
             * it at its compass position. Grows from md to lg visual size.
             */}
            {heroNode && (
              <div style={{ ...posStyle(CX, CY), zIndex: 20 }}>
                <motion.div
                  initial={{
                    x: Math.cos(heroNode.angle) * RADIUS * scale,
                    y: Math.sin(heroNode.angle) * RADIUS * scale,
                    scale: 1,
                  }}
                  animate={{ x: 0, y: 0, scale: MD_TO_LG_SCALE }}
                  transition={HERO_TRANSITION}
                >
                  <DiceIcon
                    faces={20}
                    value={heroNode.station?.order}
                    size="md"
                    active
                    style={
                      {
                        "--theme-primary": tensionColor(
                          heroNode.station?.tension,
                        ),
                        "--theme-secondary": tensionColor(
                          heroNode.station?.tension,
                        ),
                      } as React.CSSProperties
                    }
                  />
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* ═══════════════ ENTER ═══════════════ */}
        {phase === "enter" && (
          <>
            {/* Animated SVG lines for new connections */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              aria-hidden="true"
            >
              {gradientDefs(displayNodes, currentColor)}
              {animatedLines(displayNodes)}
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

            {/*
             * New center die: starts at MD_TO_LG_SCALE (matching the hero's
             * final scale) so the hand-off from hero → center looks seamless.
             */}
            <div style={{ ...posStyle(CX, CY), zIndex: 5 }}>
              <motion.div
                initial={{ scale: MD_TO_LG_SCALE, opacity: 0.85 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <DiceIcon
                  faces={20}
                  value={displayStationOrder}
                  size="lg"
                  active
                  style={
                    {
                      "--theme-primary": currentColor,
                      "--theme-secondary": currentColor,
                    } as React.CSSProperties
                  }
                />
              </motion.div>
            </div>

            {/* New peripheral nodes – slide in from their compass directions */}
            {displayNodes.map((node, i) => {
              const entryX =
                Math.cos(node.angle) * RADIUS * 0.75 * scale;
              const entryY =
                Math.sin(node.angle) * RADIUS * 0.75 * scale;
              return (
                <div
                  key={node.title}
                  style={{ ...posStyle(node.x, node.y), zIndex: 10 }}
                >
                  <motion.div
                    initial={{ x: entryX, y: entryY, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={nodeEnterTransition(i)}
                    onAnimationComplete={
                      i === lastNodeIndex
                        ? handleAllEnterComplete
                        : undefined
                    }
                  >
                    {nodeContent(node, false)}
                  </motion.div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
