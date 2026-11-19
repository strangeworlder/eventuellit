import type React from "react";
import {
  AUXILIARY_DECK_SECTORS,
  type AuxiliaryDeckSector,
  buildDeckHullPolygon,
  buildDeckInnerHullPolygon,
  buildExtrudedWalls,
  buildZonePolygon,
  type CabinWingSpec,
  DECK_SPEC_MAP,
  type ExtrudedWallFace,
  getDeckCorridorRects,
  getSingleDeckCompassAnchors,
  getSingleDeckShaftLabelAnchor,
  getWingCorridorRect,
  getZoneDoorwaySegment,
  HULL_LENGTH_METERS,
  type IsoPoint,
  polygonCentroid,
  polygonToPointsAttr,
  projectDeckPoint,
  type ShipZoneSpec,
  SINGLE_CENTER_X,
  VERTICAL_SHAFTS,
  type WingCabinLayout,
} from "./ship-zones";

export interface ZoneToneColors {
  fill: string;
  stroke: string;
  strokeWidth: number;
  wallFillLit: string;
  wallFillMid: string;
  wallFillDark: string;
  pillFill: string;
  pillStroke: string;
  pillText: string;
}

function isoQuadPoints(
  deckNumber: number,
  u0: number,
  u1: number,
  v0: number,
  v1: number,
  z = 0,
): IsoPoint[] {
  return buildZonePolygon(deckNumber, { u0, u1, v0, v1 }, "single", z);
}

function isoQuad(
  deckNumber: number,
  u0: number,
  u1: number,
  v0: number,
  v1: number,
  z = 0,
): string {
  return polygonToPointsAttr(isoQuadPoints(deckNumber, u0, u1, v0, v1, z));
}

function isoLine(
  deckNumber: number,
  uA: number,
  vA: number,
  uB: number,
  vB: number,
  zA = 0,
  zB = 0,
) {
  const pA = projectDeckPoint(deckNumber, uA, vA, "single", zA);
  const pB = projectDeckPoint(deckNumber, uB, vB, "single", zB);
  return { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };
}

function isoPath(
  deckNumber: number,
  pointsUv: ReadonlyArray<readonly [number, number]>,
  z = 0,
): string {
  return pointsUv
    .map(([u, v], idx) => {
      const pt = projectDeckPoint(deckNumber, u, v, "single", z);
      return `${idx === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    })
    .join(" ");
}

function renderIsoBox(opts: {
  key?: string;
  deckNumber: number;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  zBase?: number;
  zTop: number;
  topFill: string;
  frontFill: string;
  sideFill: string;
  stroke: string;
  strokeWidth?: number;
  dashed?: boolean;
}) {
  const {
    key,
    deckNumber,
    u0,
    u1,
    v0,
    v1,
    zBase = 0,
    zTop,
    topFill,
    frontFill,
    sideFill,
    stroke,
    strokeWidth = 0.85,
    dashed = false,
  } = opts;
  const dash = dashed ? "3 2" : undefined;
  const b00 = projectDeckPoint(deckNumber, u0, v0, "single", zBase);
  const b10 = projectDeckPoint(deckNumber, u1, v0, "single", zBase);
  const b11 = projectDeckPoint(deckNumber, u1, v1, "single", zBase);
  const b01 = projectDeckPoint(deckNumber, u0, v1, "single", zBase);

  const t00 = projectDeckPoint(deckNumber, u0, v0, "single", zTop);
  const t10 = projectDeckPoint(deckNumber, u1, v0, "single", zTop);
  const t11 = projectDeckPoint(deckNumber, u1, v1, "single", zTop);
  const t01 = projectDeckPoint(deckNumber, u0, v1, "single", zTop);

  // Use unused variable suppression safely via hull corners check
  void b00;

  return (
    <g key={key} pointerEvents="none">
      {/* Styyrpuurin etuseinä (v1) */}
      <polygon
        points={polygonToPointsAttr([b01, b11, t11, t01])}
        fill={frontFill}
        stroke={stroke}
        strokeWidth={strokeWidth * 0.85}
        strokeDasharray={dash}
      />
      {/* Peräpäädyn sivuseinä (u1) */}
      <polygon
        points={polygonToPointsAttr([b10, b11, t11, t10])}
        fill={sideFill}
        stroke={stroke}
        strokeWidth={strokeWidth * 0.85}
        strokeDasharray={dash}
      />
      {/* Yläpinta */}
      <polygon
        points={polygonToPointsAttr([t00, t10, t11, t01])}
        fill={topFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
      />
    </g>
  );
}

function renderIsoCylinder(opts: {
  key?: string;
  deckNumber: number;
  u: number;
  v: number;
  rx: number;
  ry: number;
  zBase?: number;
  zTop: number;
  bodyFill: string;
  topFill: string;
  stroke: string;
  ringColor?: string;
  strokeWidth?: number;
}) {
  const {
    key,
    deckNumber,
    u,
    v,
    rx,
    ry,
    zBase = 0,
    zTop,
    bodyFill,
    topFill,
    stroke,
    ringColor,
    strokeWidth = 0.9,
  } = opts;
  const bot = projectDeckPoint(deckNumber, u, v, "single", zBase);
  const top = projectDeckPoint(deckNumber, u, v, "single", zTop);
  const skirtPath = [
    `M ${(top.x - rx).toFixed(1)} ${top.y.toFixed(1)}`,
    `L ${(bot.x - rx).toFixed(1)} ${bot.y.toFixed(1)}`,
    `A ${rx} ${ry} 0 0 0 ${(bot.x + rx).toFixed(1)} ${bot.y.toFixed(1)}`,
    `L ${(top.x + rx).toFixed(1)} ${top.y.toFixed(1)}`,
    "Z",
  ].join(" ");

  return (
    <g key={key} pointerEvents="none">
      <path d={skirtPath} fill={bodyFill} stroke={stroke} strokeWidth={strokeWidth * 0.85} />
      <ellipse
        cx={top.x}
        cy={top.y}
        rx={rx}
        ry={ry}
        fill={topFill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {ringColor && (
        <ellipse
          cx={top.x}
          cy={top.y}
          rx={rx * 0.56}
          ry={ry * 0.56}
          fill="none"
          stroke={ringColor}
          strokeWidth={1.15}
        />
      )}
    </g>
  );
}

function renderConduitPipe(opts: {
  key?: string;
  deckNumber: number;
  pointsUv: ReadonlyArray<readonly [number, number]>;
  z?: number;
  coreColor: string;
  width?: number;
  dashed?: boolean;
}) {
  const { key, deckNumber, pointsUv, z = 1, coreColor, width = 2.6, dashed = false } = opts;
  const d = isoPath(deckNumber, pointsUv, z);

  return (
    <g key={key} pointerEvents="none">
      <path
        d={d}
        fill="none"
        stroke="var(--theme-cockpit-surface)"
        strokeWidth={width + 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={coreColor}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "5 3" : undefined}
      />
    </g>
  );
}

function renderRoomFloorDecking(opts: {
  deckNumber: number;
  zone: ShipZoneSpec;
  pattern: "clinical" | "grating" | "quarters";
}) {
  const { deckNumber, zone, pattern } = opts;
  const padU = 0.012;
  const padV = 0.015;
  const uStart = zone.u0 + padU;
  const uEnd = zone.u1 - padU;
  const vStart = zone.v0 + padV;
  const vEnd = zone.v1 - padV;
  const uCount = pattern === "grating" ? 5 : 4;
  const vCount = pattern === "clinical" ? 4 : 3;

  const uLines: number[] = [];
  for (let i = 1; i < uCount; i++) {
    uLines.push(uStart + ((uEnd - uStart) * i) / uCount);
  }
  const vLines: number[] = [];
  for (let j = 1; j < vCount; j++) {
    vLines.push(vStart + ((vEnd - vStart) * j) / vCount);
  }

  const lineStroke =
    pattern === "clinical"
      ? "var(--theme-secondary)"
      : pattern === "quarters"
        ? "var(--theme-cockpit-border-soft)"
        : "var(--theme-cockpit-border)";

  return (
    <g pointerEvents="none" opacity={pattern === "grating" ? 0.34 : 0.24}>
      <polygon
        points={isoQuad(deckNumber, uStart, uEnd, vStart, vEnd, 0.3)}
        fill="none"
        stroke={lineStroke}
        strokeWidth={0.75}
      />
      {uLines.map((uLine) => (
        <line
          key={`floor-u-${uLine.toFixed(4)}`}
          {...isoLine(deckNumber, uLine, vStart, uLine, vEnd, 0.3, 0.3)}
          stroke={lineStroke}
          strokeWidth={0.65}
          strokeDasharray={pattern === "grating" ? "2 2" : undefined}
        />
      ))}
      {pattern !== "quarters" &&
        vLines.map((vLine) => (
          <line
            key={`floor-v-${vLine.toFixed(4)}`}
            {...isoLine(deckNumber, uStart, vLine, uEnd, vLine, 0.3, 0.3)}
            stroke={lineStroke}
            strokeWidth={0.65}
            strokeDasharray={pattern === "grating" ? "3 2" : undefined}
          />
        ))}
    </g>
  );
}

export function renderSingleDeckHullStructure(
  deckNumber: number,
  opts?: { hasPortBreach?: boolean; breachTone?: "critical" | "warning" },
): React.ReactNode {
  const deck = DECK_SPEC_MAP[deckNumber];
  const activePortBreach = opts?.hasPortBreach ?? Boolean(deck?.hasPortBreach);
  const breachStroke =
    opts?.breachTone === "warning" ? "var(--theme-dawn)" : "var(--theme-primary)";
  const outerHull = buildDeckHullPolygon(deckNumber, "single", 0, activePortBreach);
  const innerHull = buildDeckInnerHullPolygon(deckNumber, 0, activePortBreach);
  const compass = getSingleDeckCompassAnchors(deckNumber);

  const ribStations = [-0.4, -0.32, -0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24, 0.32, 0.4];

  return (
    <g data-deck-layer="hull-structure" pointerEvents="none">
      {/* Kaksoisrungon panssarivyö */}
      <polygon
        points={polygonToPointsAttr(outerHull)}
        fill="color-mix(in srgb, var(--theme-hull-armor) 54%, var(--theme-bg))"
        stroke="var(--theme-cockpit-border)"
        strokeWidth={1.6}
      />
      <polygon
        points={polygonToPointsAttr(innerHull)}
        fill="color-mix(in srgb, var(--theme-cockpit-surface) 92%, var(--theme-bg))"
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={1.25}
      />

      {/* Poikittaiset runkokaaret ulko- ja sisälaipion välissä */}
      {ribStations.map((uRib) => {
        const skipsBreach = Boolean(activePortBreach && uRib >= -0.4 && uRib <= -0.22);
        return (
          <g key={`hull-rib-${uRib}`}>
            {!skipsBreach && (
              <line
                {...isoLine(deckNumber, uRib, -0.474, uRib, -0.451, 0.5, 0.5)}
                stroke="var(--theme-cockpit-rim)"
                strokeWidth={1.35}
                opacity={0.78}
              />
            )}
            <line
              {...isoLine(deckNumber, uRib, 0.451, uRib, 0.474, 0.5, 0.5)}
              stroke="var(--theme-cockpit-rim)"
              strokeWidth={1.35}
              opacity={0.78}
            />
          </g>
        );
      })}

      {/* Keulan anturikärki, törmäyslaipio, ohjaussuutintaskut ja kuuntelukaaret */}
      <line
        {...isoLine(deckNumber, -0.468, -0.28, -0.468, 0.28, 1, 1)}
        stroke="var(--theme-cockpit-border)"
        strokeWidth={1.6}
      />
      <line
        {...isoLine(deckNumber, -0.448, -0.36, -0.448, 0.36, 0.8, 0.8)}
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={1.1}
      />
      {/* Keulapalkan viistot tukirakenteet keskeltä ulkolaitaan */}
      {[
        [-0.506, 0, -0.468, -0.19],
        [-0.506, 0, -0.468, 0.19],
        [-0.486, 0, -0.448, -0.26],
        [-0.486, 0, -0.448, 0.26],
      ].map(([uA, vA, uB, vB]) => (
        <line
          key={`bow-truss-${uA}-${vA}-${vB}`}
          {...isoLine(deckNumber, uA, vA, uB, vB, 1.1, 1.1)}
          stroke="var(--theme-cockpit-rim)"
          strokeWidth={1}
          opacity={0.72}
        />
      ))}
      {/* Paapuurin ja styyrpuurin keulan suuntaussuutintaskut */}
      {[-0.19, 0.19].map((vPocket) => (
        <g key={`bow-rcs-pocket-${vPocket}`}>
          <polygon
            points={isoQuad(deckNumber, -0.49, -0.47, vPocket - 0.036, vPocket + 0.036, 1)}
            fill="var(--theme-hull-shadow)"
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1}
          />
          <line
            {...isoLine(deckNumber, -0.48, vPocket - 0.022, -0.48, vPocket + 0.022, 1.6, 1.6)}
            stroke="var(--theme-dawn)"
            strokeWidth={1.4}
          />
        </g>
      ))}
      {renderConduitPipe({
        deckNumber,
        pointsUv: [
          [-0.518, 0],
          [-0.448, 0],
        ],
        z: 1.5,
        coreColor: "var(--theme-secondary)",
        width: 2.2,
      })}
      {renderIsoCylinder({
        deckNumber,
        u: -0.486,
        v: 0,
        rx: 6.5,
        ry: 3.4,
        zTop: 4.5,
        bodyFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))",
        topFill: "var(--theme-cockpit-elevated)",
        stroke: "var(--theme-secondary)",
        ringColor: "var(--theme-dawn)",
      })}
      <polyline
        points={polygonToPointsAttr([
          projectDeckPoint(deckNumber, -0.482, -0.1, "single", 2),
          projectDeckPoint(deckNumber, -0.506, 0, "single", 2),
          projectDeckPoint(deckNumber, -0.482, 0.1, "single", 2),
        ])}
        fill="none"
        stroke="var(--theme-dawn)"
        strokeWidth={1.3}
        opacity={0.9}
      />
      <polyline
        points={polygonToPointsAttr([
          projectDeckPoint(deckNumber, -0.458, -0.18, "single", 1.5),
          projectDeckPoint(deckNumber, -0.484, 0, "single", 1.5),
          projectDeckPoint(deckNumber, -0.458, 0.18, "single", 1.5),
        ])}
        fill="none"
        stroke="var(--theme-secondary)"
        strokeWidth={1.1}
        opacity={0.75}
      />

      {/* Peräpään poikittaispalkit */}
      <line
        {...isoLine(deckNumber, 0.468, -0.34, 0.468, 0.34, 1, 1)}
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={1.2}
      />

      {/* Kannen 3 sukkulahallin styyrpuurin ulkoluukun kiskot ja paapuurin kylkirepeämän/korjauksen rakenne */}
      {deck?.hasPortBreach && (
        <g>
          {activePortBreach ? (
            <>
              {/* Revenneet ulkorakenteen kaarituet */}
              {[
                [-0.4, -0.46, -0.365, -0.365],
                [-0.35, -0.38, -0.312, -0.405],
                [-0.29, -0.38, -0.252, -0.352],
                [-0.23, -0.46, -0.245, -0.37],
              ].map(([uA, vA, uB, vB]) => (
                <line
                  key={`breach-strut-${uA}-${vA}`}
                  {...isoLine(deckNumber, uA, vA, uB, vB, 1.5, 1.5)}
                  stroke={breachStroke}
                  strokeWidth={1.7}
                />
              ))}
            </>
          ) : (
            <g data-hull-repair="port-patch">
              <polygon
                points={isoQuad(deckNumber, -0.405, -0.215, -0.474, -0.451, 1.1)}
                fill="color-mix(in srgb, var(--theme-secondary) 18%, var(--theme-cockpit-elevated))"
                stroke="var(--theme-secondary)"
                strokeWidth={1.1}
              />
              {[-0.36, -0.31, -0.26].map((uWeld) => (
                <line
                  key={`repair-weld-${uWeld}`}
                  {...isoLine(deckNumber, uWeld, -0.473, uWeld, -0.452, 1.4, 1.4)}
                  stroke="var(--theme-secondary)"
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
          {/* Styyrpuurin sukkulatelakan ulko-ovien saumat */}
          <polygon
            points={isoQuad(deckNumber, -0.38, -0.2, 0.448, 0.474, 1.2)}
            fill="color-mix(in srgb, var(--theme-dawn) 20%, var(--theme-cockpit-elevated))"
            stroke="var(--theme-dawn)"
            strokeWidth={1.1}
          />
          {[-0.335, -0.29, -0.245].map((uGate) => (
            <line
              key={`hangar-door-${uGate}`}
              {...isoLine(deckNumber, uGate, 0.448, uGate, 0.474, 1.5, 1.5)}
              stroke="var(--theme-cockpit-bg, var(--theme-bg))"
              strokeWidth={1}
            />
          ))}
        </g>
      )}

      {/* Kannen 4 peräsuuttimien paineistetut kytkentätunnelit */}
      {deck?.hasThrusters &&
        [-0.24, 0.24].map((vThrust) => (
          <polygon
            key={`stern-tunnel-${vThrust}`}
            points={isoQuad(deckNumber, 0.455, 0.495, vThrust - 0.052, vThrust + 0.052, 1.5)}
            fill="color-mix(in srgb, var(--theme-primary) 18%, var(--theme-cockpit-elevated))"
            stroke="var(--theme-dawn)"
            strokeWidth={1.1}
          />
        ))}

      {/* Hienovarainen tekninen asemaruudukko kannen sisällä */}
      <g opacity={0.18}>
        {[-0.35, -0.2, 0, 0.2, 0.35].map((uGrid) => (
          <line
            key={`grid-u-${uGrid}`}
            {...isoLine(deckNumber, uGrid, -0.44, uGrid, 0.44, 0.4, 0.4)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.7}
            strokeDasharray="3 4"
          />
        ))}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((vGrid) => (
          <line
            key={`grid-v-${vGrid}`}
            {...isoLine(deckNumber, -0.45, vGrid, 0.45, vGrid, 0.4, 0.4)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.7}
            strokeDasharray="3 4"
          />
        ))}
      </g>

      {/* Suunnistusmerkit rungon ulkopuolella */}
      {[
        { pt: compass.bow, text: "Keula" },
        { pt: compass.stern, text: "Perä" },
        { pt: compass.port, text: "Paapuuri" },
        { pt: compass.starboard, text: "Styyrpuuri" },
      ].map((dir) => (
        <text
          key={dir.text}
          x={dir.pt.x}
          y={dir.pt.y}
          textAnchor="middle"
          fill="var(--theme-text-muted)"
          fontSize={12.5}
          fontFamily='"Outfit", "Inter", sans-serif'
          fontWeight={700}
          letterSpacing={1.2}
        >
          {dir.text}
        </text>
      ))}

      {/* Runkopituuden 150 m mittakaava-asteikko */}
      {(() => {
        const scaleX0 = SINGLE_CENTER_X - 0.5 * 940;
        const scaleW = 940;
        const scaleY = 706;
        const barH = 5;
        const marks = [0, 25, 50, 75, 100, 125, 150];
        const segW = scaleW / (marks.length - 1);

        return (
          <g data-deck-layer="scale-bar" pointerEvents="none">
            <text
              x={scaleX0 + scaleW}
              y={scaleY - 9}
              textAnchor="end"
              fill="var(--theme-text-muted)"
              fontSize={11}
              fontFamily='"Outfit", "Inter", sans-serif'
              fontWeight={700}
              letterSpacing={0.8}
            >
              Runkomitta 150 m
            </text>
            {[0, 1, 2, 3, 4, 5].map((segIdx) => (
              <rect
                key={`scale-seg-${segIdx}`}
                x={scaleX0 + segIdx * segW}
                y={scaleY}
                width={segW}
                height={barH}
                fill={
                  segIdx % 2 === 0
                    ? "color-mix(in srgb, var(--theme-dawn) 58%, var(--theme-cockpit-elevated))"
                    : "var(--theme-cockpit-surface)"
                }
                stroke="var(--theme-cockpit-border)"
                strokeWidth={0.85}
              />
            ))}
            {marks.map((meters) => {
              const mx = scaleX0 + (meters / HULL_LENGTH_METERS) * scaleW;
              return (
                <g key={`scale-mark-${meters}`}>
                  <line
                    x1={mx}
                    y1={scaleY - 4}
                    x2={mx}
                    y2={scaleY + barH + 4}
                    stroke={
                      meters === 0 || meters === 150
                        ? "var(--theme-dawn)"
                        : "var(--theme-cockpit-border)"
                    }
                    strokeWidth={meters === 0 || meters === 150 ? 1.4 : 0.95}
                  />
                  <text
                    x={mx}
                    y={scaleY + barH + 16}
                    textAnchor="middle"
                    fill="var(--theme-text-subtle)"
                    fontSize={10.5}
                    fontFamily='"Inter", sans-serif'
                    fontWeight={600}
                  >
                    {meters} m
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}
    </g>
  );
}

export function renderSingleDeckCorridors(
  deckNumber: number,
  deckZones: readonly ShipZoneSpec[],
): React.ReactNode {
  const corridors = getDeckCorridorRects(deckNumber);
  const spine = corridors[0];
  const spineStartU = spine?.u0 ?? -0.355;
  const spineEndU = spine?.u1 ?? 0.255;
  const plateStations: number[] = [];
  for (let uP = spineStartU + 0.035; uP < spineEndU - 0.025; uP += 0.06) {
    plateStations.push(Number(uP.toFixed(3)));
  }
  const crossSteps = [-0.28, -0.2, -0.12, 0.12, 0.2, 0.28];

  return (
    <g data-deck-layer="corridors" pointerEvents="none">
      {/* Yhtenäinen käytäväkehys ja hopeanharmaa käytävälattia */}
      {corridors.map((corr) => (
        <polygon
          key={`corr-curb-${corr.u0}-${corr.v0}`}
          points={polygonToPointsAttr(buildZonePolygon(deckNumber, corr, "single", 0.2))}
          fill="var(--theme-cockpit-border-soft)"
          stroke="var(--theme-cockpit-border)"
          strokeWidth={1.1}
        />
      ))}
      {corridors.map((corr) => (
        <polygon
          key={`corr-floor-${corr.u0}-${corr.v0}`}
          points={polygonToPointsAttr(buildZonePolygon(deckNumber, corr, "single", 0.6))}
          fill="color-mix(in srgb, var(--theme-secondary) 11%, var(--theme-cockpit-elevated))"
        />
      ))}

      {/* Hopeanharmaiden käytävien lattialevysaumat ja jalkalistavarjot */}
      {plateStations.map((uPlate) => (
        <line
          key={`corr-seam-spine-${uPlate}`}
          {...isoLine(deckNumber, uPlate, -0.032, uPlate, 0.032, 0.7, 0.7)}
          stroke="var(--theme-cockpit-border-soft)"
          strokeWidth={0.75}
          opacity={0.7}
        />
      ))}
      {crossSteps.map((vStep) => (
        <line
          key={`corr-seam-fore-${vStep}`}
          {...isoLine(deckNumber, -0.193, vStep, -0.157, vStep, 0.7, 0.7)}
          stroke="var(--theme-cockpit-border-soft)"
          strokeWidth={0.75}
          opacity={0.65}
        />
      ))}
      {crossSteps.map((vStep) => (
        <line
          key={`corr-seam-aft-${vStep}`}
          {...isoLine(deckNumber, 0.217, vStep, 0.253, vStep, 0.7, 0.7)}
          stroke="var(--theme-cockpit-border-soft)"
          strokeWidth={0.75}
          opacity={0.65}
        />
      ))}

      {/* Lattiauran kaapeli- ja jäähdytyslinja keskikäytävässä */}
      <line
        {...isoLine(deckNumber, spineStartU + 0.01, -0.01, spineEndU - 0.01, -0.01, 0.85, 0.85)}
        stroke="var(--theme-secondary)"
        strokeWidth={1.1}
        opacity={0.68}
      />
      <line
        {...isoLine(deckNumber, spineStartU + 0.01, 0.01, spineEndU - 0.01, 0.01, 0.85, 0.85)}
        stroke="var(--theme-dawn)"
        strokeWidth={0.95}
        strokeDasharray="7 5"
        opacity={0.62}
      />
      <line
        {...isoLine(deckNumber, -0.175, -0.32, -0.175, 0.32, 0.8, 0.8)}
        stroke="var(--theme-secondary)"
        strokeWidth={0.9}
        opacity={0.5}
      />
      <line
        {...isoLine(deckNumber, 0.235, -0.32, 0.235, 0.32, 0.8, 0.8)}
        stroke="var(--theme-secondary)"
        strokeWidth={0.9}
        opacity={0.5}
      />

      {/* Oviaukkojen kynnyslevyt osastoihin */}
      {deckZones
        .filter((z) => z.kind !== "wing")
        .map((zone) => {
          const door = getZoneDoorwaySegment(deckNumber, zone, zone.doorSide, "single", 0.9);
          return (
            <g key={`threshold-${zone.id}`}>
              <line
                x1={door.start.x}
                y1={door.start.y}
                x2={door.end.x}
                y2={door.end.y}
                stroke="var(--theme-cockpit-border)"
                strokeWidth={2.6}
              />
              <circle cx={door.center.x} cy={door.center.y} r={1.8} fill="var(--theme-dawn)" />
            </g>
          );
        })}
    </g>
  );
}

export function renderSingleDeckShafts(deckNumber: number): React.ReactNode {
  return (
    <g data-deck-layer="shafts" pointerEvents="none">
      {VERTICAL_SHAFTS.map((shaft) => {
        const shaftRect = {
          u0: shaft.u - shaft.uHalf,
          u1: shaft.u + shaft.uHalf,
          v0: shaft.v - shaft.vHalf,
          v1: shaft.v + shaft.vHalf,
        };
        const outerPit = buildZonePolygon(deckNumber, shaftRect, "single", 0.5);
        const dropWallPort = polygonToPointsAttr([
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v0, "single", 0.5),
          projectDeckPoint(deckNumber, shaftRect.u1, shaftRect.v0, "single", 0.5),
          projectDeckPoint(deckNumber, shaftRect.u1, shaftRect.v0, "single", -6),
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v0, "single", -6),
        ]);
        const dropWallFore = polygonToPointsAttr([
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v0, "single", 0.5),
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v1, "single", 0.5),
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v1, "single", -6),
          projectDeckPoint(deckNumber, shaftRect.u0, shaftRect.v0, "single", -6),
        ]);
        const labelAnchor = getSingleDeckShaftLabelAnchor(deckNumber, shaft);
        const w = 52;
        const h = 17;
        const c = 3.5;
        const left = labelAnchor.x - w / 2;
        const top = labelAnchor.y - h / 2;
        const right = left + w;
        const bottom = top + h;
        const plaquePoints = `${left + c},${top} ${right},${top} ${right},${bottom - c} ${right - c},${bottom} ${left},${bottom} ${left},${top + c}`;

        return (
          <g key={shaft.id}>
            {/* Syvä hissikuilun aukko */}
            <polygon
              points={polygonToPointsAttr(outerPit)}
              fill="var(--theme-hull-shadow)"
              stroke="var(--theme-secondary)"
              strokeWidth={1.4}
            />
            <polygon
              points={dropWallPort}
              fill="color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))"
            />
            <polygon
              points={dropWallFore}
              fill="color-mix(in srgb, var(--theme-bg) 88%, var(--theme-secondary))"
            />

            {/* Hissikori keulapuolella */}
            {renderIsoBox({
              deckNumber,
              u0: shaft.u - 0.013,
              u1: shaft.u - 0.001,
              v0: -0.019,
              v1: 0.019,
              zBase: -2,
              zTop: 1.5,
              topFill:
                "color-mix(in srgb, var(--theme-secondary) 32%, var(--theme-cockpit-elevated))",
              frontFill: "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-bg))",
              sideFill: "color-mix(in srgb, var(--theme-accent) 20%, var(--theme-bg))",
              stroke: "var(--theme-secondary)",
              strokeWidth: 0.85,
            })}

            {/* Huoltotikkaat peräpuolella */}
            {[-0.015, -0.005, 0.005, 0.015].map((vRung) => (
              <line
                key={`ladder-${shaft.id}-${vRung}`}
                {...isoLine(deckNumber, shaft.u + 0.003, vRung, shaft.u + 0.013, vRung, 0.8, 0.8)}
                stroke="var(--theme-dawn)"
                strokeWidth={1.15}
              />
            ))}

            {/* Kompaktin kuilutunnuksen laatta */}
            <polygon
              points={plaquePoints}
              fill="var(--theme-cockpit-elevated)"
              stroke="var(--theme-secondary)"
              strokeWidth={1.05}
            />
            <text
              x={labelAnchor.x}
              y={labelAnchor.y + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--theme-text)"
              fontSize={10.5}
              fontFamily='"Outfit", "Inter", sans-serif'
              fontWeight={700}
            >
              {shaft.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const AUXILIARY_WALL_COLORS: ZoneToneColors = {
  fill: "color-mix(in srgb, var(--theme-hull-armor) 28%, var(--theme-bg))",
  stroke: "var(--theme-cockpit-border-soft)",
  strokeWidth: 0.9,
  wallFillLit: "color-mix(in srgb, var(--theme-cockpit-border-soft) 32%, var(--theme-bg))",
  wallFillMid: "color-mix(in srgb, var(--theme-hull-shadow) 82%, var(--theme-cockpit-surface))",
  wallFillDark: "var(--theme-hull-shadow)",
  pillFill: "var(--theme-bg)",
  pillStroke: "var(--theme-cockpit-border-soft)",
  pillText: "var(--theme-text-subtle)",
};

function splitAuxiliaryLabel(label: string, uSpan: number): string[] {
  if (uSpan >= 0.115 || label.length <= 10) {
    return [label];
  }
  const hyphenIdx = label.indexOf("-");
  if (hyphenIdx > 2 && hyphenIdx < label.length - 3) {
    return [label.slice(0, hyphenIdx + 1), label.slice(hyphenIdx + 1)];
  }
  const spaceIdx = label.indexOf(" ");
  if (spaceIdx > 2) {
    return [label.slice(0, spaceIdx), label.slice(spaceIdx + 1)];
  }
  if (label === "Vesivarannot") return ["Vesi-", "varannot"];
  if (label === "Poijuasema") return ["Poiju-", "asema"];
  if (label === "Ulkosulku") return ["Ulko-", "sulku"];
  if (label === "Keulasulut") return ["Keula-", "sulut"];
  if (label === "Keulapotkurit") return ["Keula-", "potkurit"];
  if (label === "Säteilysulku") return ["Säteily-", "sulku"];
  if (label === "Polttoainesäiliöt") return ["Polttoaine-", "säiliöt"];
  if (label === "Jäähdytysvaranto") return ["Jäähdytys-", "varanto"];
  return [label];
}

function renderAuxiliaryInterior(deckNumber: number, sector: AuxiliaryDeckSector): React.ReactNode {
  const uSpan = sector.u1 - sector.u0;
  const vSpan = sector.v1 - sector.v0;
  const uC = (sector.u0 + sector.u1) / 2;
  const vC = (sector.v0 + sector.v1) / 2;

  switch (sector.kind) {
    case "cabin-grid": {
      const cols = sector.cols ?? 4;
      const rows = sector.rows ?? 2;
      const padU = 0.004;
      const padV = 0.008;
      const gapU = 0.003;
      const corrHalfV = 0.013;
      const cellU = (uSpan - padU * 2 - gapU * (cols - 1)) / cols;
      const cells: React.ReactNode[] = [];

      for (let r = 0; r < rows; r++) {
        const cV0 = r === 0 ? sector.v0 + padV : vC + corrHalfV + 0.006;
        const cV1 = r === 0 ? vC - corrHalfV - 0.006 : sector.v1 - padV;
        for (let c = 0; c < cols; c++) {
          const cU0 = sector.u0 + padU + c * (cellU + gapU);
          const cU1 = cU0 + cellU;
          const bunkW = Math.min(0.014, (cU1 - cU0) * 0.56);
          const bunkD = Math.min(0.022, (cV1 - cV0) * 0.28);
          const bU0 = c % 2 === 0 ? cU0 + 0.002 : cU1 - bunkW - 0.002;
          const bV0 = r === 0 ? cV0 + 0.004 : cV1 - bunkD - 0.004;
          cells.push(
            <g key={`${sector.id}-cell-${r}-${c}`}>
              <polygon
                points={isoQuad(deckNumber, cU0, cU1, cV0, cV1, 0.35)}
                fill="color-mix(in srgb, var(--theme-cockpit-surface) 78%, var(--theme-bg))"
                stroke="var(--theme-cockpit-border-soft)"
                strokeWidth={0.65}
              />
              <polygon
                points={isoQuad(deckNumber, bU0, bU0 + bunkW, bV0, bV0 + bunkD, 0.7)}
                fill="var(--theme-hull-armor)"
                stroke="var(--theme-cockpit-border)"
                strokeWidth={0.55}
              />
            </g>,
          );
        }
      }

      return (
        <g>
          <polygon
            points={isoQuad(deckNumber, sector.u0, sector.u1, vC - corrHalfV, vC + corrHalfV, 0.3)}
            fill="color-mix(in srgb, var(--theme-cockpit-elevated) 60%, var(--theme-bg))"
            stroke="var(--theme-cockpit-border-soft)"
            strokeWidth={0.6}
          />
          {cells}
        </g>
      );
    }

    case "cargo-bay": {
      const wideU = uSpan > vSpan;
      const cols = wideU ? 5 : 2;
      const rows = wideU ? 1 : 4;
      const padU = uSpan * 0.08;
      const padV = vSpan * 0.14;
      const cellU = (uSpan - padU * 2) / cols;
      const cellV = (vSpan - padV * 2) / rows;
      const crates: React.ReactNode[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cu0 = sector.u0 + padU + c * cellU + 0.004;
          const cu1 = cu0 + cellU - 0.008;
          const cv0 = sector.v0 + padV + r * cellV + 0.005;
          const cv1 = cv0 + cellV - 0.01;
          crates.push(
            renderIsoBox({
              key: `${sector.id}-crate-${r}-${c}`,
              deckNumber,
              u0: cu0,
              u1: cu1,
              v0: cv0,
              v1: cv1,
              zBase: 0,
              zTop: 4.4,
              topFill:
                "color-mix(in srgb, var(--theme-hull-armor) 64%, var(--theme-cockpit-surface))",
              frontFill: "var(--theme-hull-shadow)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-cockpit-border)",
              strokeWidth: 0.7,
            }),
          );
        }
      }
      return <g>{crates}</g>;
    }

    case "cic-bays": {
      const horizontal = uSpan > vSpan * 1.8;
      if (horizontal) {
        return (
          <g>
            {[-0.38, -0.22, 0.22, 0.38].map((t) => {
              const bx = uC + uSpan * t;
              return renderIsoBox({
                key: `${sector.id}-bat-${t}`,
                deckNumber,
                u0: bx - 0.025,
                u1: bx + 0.025,
                v0: vC - vSpan * 0.28,
                v1: vC + vSpan * 0.28,
                zBase: 0,
                zTop: 4,
                topFill: "var(--theme-cockpit-surface)",
                frontFill: "var(--theme-hull-shadow)",
                sideFill: "var(--theme-bg)",
                stroke: "var(--theme-cockpit-border)",
                strokeWidth: 0.7,
              });
            })}
          </g>
        );
      }

      return (
        <g>
          <line
            {...isoLine(deckNumber, uC, sector.v0 + 0.015, uC, sector.v1 - 0.015, 0.7, 0.7)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.85}
          />
          {[-0.24, 0.24].map((tU) =>
            [-0.24, 0.24].map((tV) =>
              renderIsoBox({
                key: `${sector.id}-console-${tU}-${tV}`,
                deckNumber,
                u0: uC + uSpan * tU - 0.014,
                u1: uC + uSpan * tU + 0.014,
                v0: vC + vSpan * tV - 0.028,
                v1: vC + vSpan * tV + 0.028,
                zBase: 0,
                zTop: 4.5,
                topFill: "var(--theme-cockpit-surface)",
                frontFill: "var(--theme-hull-shadow)",
                sideFill: "var(--theme-bg)",
                stroke: "var(--theme-cockpit-border)",
                strokeWidth: 0.7,
              }),
            ),
          )}
        </g>
      );
    }

    case "tank-bank": {
      const countV = Math.max(2, Math.min(4, Math.floor(vSpan / 0.11)));
      const tankVs: number[] = [];
      for (let i = 0; i < countV; i++) {
        tankVs.push(sector.v0 + ((i + 0.5) / countV) * vSpan);
      }
      return (
        <g>
          <line
            {...isoLine(deckNumber, uC, sector.v0 + 0.03, uC, sector.v1 - 0.03, 1.2, 1.2)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1.3}
          />
          {tankVs.map((tV) =>
            renderIsoCylinder({
              key: `${sector.id}-tank-${tV.toFixed(3)}`,
              deckNumber,
              u: uC,
              v: tV,
              rx: uSpan > 0.055 ? 8 : 6.2,
              ry: uSpan > 0.055 ? 4.2 : 3.2,
              zTop: 5.5,
              bodyFill: "var(--theme-hull-shadow)",
              topFill: "var(--theme-cockpit-surface)",
              stroke: "var(--theme-cockpit-border)",
              ringColor: "var(--theme-cockpit-rim)",
              strokeWidth: 0.8,
            }),
          )}
        </g>
      );
    }

    case "workshop": {
      const midU = uC - 0.008;
      return (
        <g>
          {/* Työpajan ja D2-miehistöpisteen väliseinä */}
          <line
            {...isoLine(deckNumber, midU, sector.v0 + 0.01, midU, sector.v1 - 0.01, 2, 2)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1}
          />
          {/* Sorvit ja gantrykisko etuosassa */}
          {renderIsoBox({
            deckNumber,
            u0: sector.u0 + 0.008,
            u1: midU - 0.01,
            v0: sector.v0 + 0.025,
            v1: sector.v0 + 0.075,
            zBase: 0,
            zTop: 4.5,
            topFill: "var(--theme-cockpit-surface)",
            frontFill: "var(--theme-hull-shadow)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border)",
          })}
          {renderIsoBox({
            deckNumber,
            u0: sector.u0 + 0.008,
            u1: midU - 0.01,
            v0: vC + 0.02,
            v1: vC + 0.075,
            zBase: 0,
            zTop: 4.5,
            topFill: "var(--theme-cockpit-surface)",
            frontFill: "var(--theme-hull-shadow)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border)",
          })}
          {/* D2-pienhyttejä peräpuolella */}
          {[0.09, 0.24].map((vBunk) => (
            <polygon
              key={`${sector.id}-d2-${vBunk}`}
              points={isoQuad(
                deckNumber,
                midU + 0.01,
                sector.u1 - 0.008,
                vBunk,
                vBunk + 0.065,
                0.5,
              )}
              fill="color-mix(in srgb, var(--theme-cockpit-surface) 78%, var(--theme-bg))"
              stroke="var(--theme-cockpit-border-soft)"
              strokeWidth={0.7}
            />
          ))}
        </g>
      );
    }

    case "med-lab": {
      return (
        <g>
          {/* Eristystila ja näytelaboratorio */}
          <line
            {...isoLine(deckNumber, uC, sector.v0 + 0.01, uC, sector.v1 - 0.01, 1.5, 1.5)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.9}
          />
          <line
            {...isoLine(
              deckNumber,
              sector.u0 + 0.008,
              vC + 0.025,
              sector.u1 - 0.008,
              vC + 0.025,
              1.5,
              1.5,
            )}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={0.85}
          />
          {[-0.022, 0.022].map((uCot) =>
            renderIsoBox({
              key: `${sector.id}-iso-cot-${uCot}`,
              deckNumber,
              u0: uC + uCot - 0.008,
              u1: uC + uCot + 0.008,
              v0: sector.v0 + 0.025,
              v1: sector.v0 + 0.065,
              zBase: 0,
              zTop: 3.5,
              topFill:
                "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-cockpit-surface))",
              frontFill: "var(--theme-hull-shadow)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-cockpit-border)",
              strokeWidth: 0.7,
            }),
          )}
        </g>
      );
    }

    case "radiators": {
      const louvers = 7;
      const fins: React.ReactNode[] = [];
      for (let i = 1; i < louvers; i++) {
        const uF = sector.u0 + (uSpan * i) / louvers;
        fins.push(
          <line
            key={`${sector.id}-fin-${i}`}
            {...isoLine(deckNumber, uF, sector.v0 + 0.022, uF, sector.v1 - 0.022, 1.2, 1.2)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1.1}
          />,
        );
      }
      return (
        <g>
          <line
            {...isoLine(deckNumber, sector.u0 + 0.018, vC, sector.u1 - 0.018, vC, 1.5, 1.5)}
            stroke="var(--theme-secondary)"
            strokeWidth={1.4}
            opacity={0.55}
          />
          {fins}
        </g>
      );
    }

    case "escape-pods": {
      const pods = 6;
      const blisters: React.ReactNode[] = [];
      for (let i = 0; i < pods; i++) {
        const uP = sector.u0 + ((i + 0.5) / pods) * uSpan;
        blisters.push(
          renderIsoCylinder({
            key: `${sector.id}-pod-${i}`,
            deckNumber,
            u: uP,
            v: vC,
            rx: 7,
            ry: 3.6,
            zTop: 3.5,
            bodyFill: "var(--theme-hull-shadow)",
            topFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-cockpit-border)",
            ringColor: "var(--theme-dawn)",
            strokeWidth: 0.75,
          }),
        );
      }
      return <g>{blisters}</g>;
    }

    case "airlocks": {
      const alongV = vSpan > uSpan;
      const centers = alongV ? [-0.25, 0.25] : [-0.28, 0, 0.28];
      return (
        <g>
          {centers.map((t) => {
            const pU = alongV ? uC : uC + uSpan * t;
            const pV = alongV ? vC + vSpan * t : vC;
            const c = projectDeckPoint(deckNumber, pU, pV, "single", 1.2);
            return (
              <g key={`${sector.id}-lock-${t}`}>
                <ellipse
                  cx={c.x}
                  cy={c.y}
                  rx={8}
                  ry={4.2}
                  fill="var(--theme-hull-shadow)"
                  stroke="var(--theme-cockpit-border)"
                  strokeWidth={0.9}
                />
                <ellipse
                  cx={c.x}
                  cy={c.y}
                  rx={4}
                  ry={2.1}
                  fill="none"
                  stroke="var(--theme-dawn)"
                  strokeWidth={0.75}
                />
              </g>
            );
          })}
        </g>
      );
    }

    case "bow-array": {
      return (
        <g>
          {[-0.28, 0, 0.28].map((tV) => (
            <line
              key={`${sector.id}-wave-${tV}`}
              {...isoLine(
                deckNumber,
                sector.u0 + 0.008,
                vC + vSpan * tV,
                sector.u1 - 0.008,
                vC + vSpan * tV,
                1,
                1,
              )}
              stroke="var(--theme-secondary)"
              strokeWidth={1}
              opacity={0.55}
            />
          ))}
        </g>
      );
    }

    case "shield-baffle": {
      const wide = uSpan > vSpan;
      const steps = 4;
      const pts: IsoPoint[] = [];
      for (let i = 0; i <= steps; i++) {
        const uPt = wide
          ? sector.u0 + (uSpan * i) / steps
          : i % 2 === 0
            ? sector.u0 + 0.008
            : sector.u1 - 0.008;
        const vPt = wide
          ? i % 2 === 0
            ? sector.v0 + 0.02
            : sector.v1 - 0.02
          : sector.v0 + (vSpan * i) / steps;
        pts.push(projectDeckPoint(deckNumber, uPt, vPt, "single", 1.5));
      }
      return (
        <polyline
          points={polygonToPointsAttr(pts)}
          fill="none"
          stroke="var(--theme-cockpit-border)"
          strokeWidth={1.2}
        />
      );
    }

    default:
      return null;
  }
}

export function renderSingleDeckAuxiliarySectors(deckNumber: number): React.ReactNode {
  const sectors = AUXILIARY_DECK_SECTORS.filter((s) => s.deckNumber === deckNumber);

  return (
    <g data-deck-layer="auxiliary-sectors" pointerEvents="none">
      {sectors.map((sector) => {
        const poly = buildZonePolygon(deckNumber, sector, "single", 0);
        const walls = buildExtrudedWalls(deckNumber, sector, "single", 5);
        const backWalls = walls.filter((w) => w.layer === "back");
        const frontWalls = walls.filter((w) => w.layer === "front");

        return (
          <g key={sector.id}>
            <polygon
              points={polygonToPointsAttr(poly)}
              fill={AUXILIARY_WALL_COLORS.fill}
              stroke="var(--theme-cockpit-border-soft)"
              strokeDasharray="3 2"
              strokeWidth={0.85}
            />
            {backWalls.map((wall) => (
              <polygon
                key={`${sector.id}-bw-${wall.side}-${wall.edgeStart.x.toFixed(1)}`}
                points={polygonToPointsAttr(wall.points)}
                fill={
                  wall.shade === "lit"
                    ? AUXILIARY_WALL_COLORS.wallFillLit
                    : AUXILIARY_WALL_COLORS.wallFillMid
                }
                stroke="var(--theme-cockpit-border-soft)"
                strokeWidth={0.65}
              />
            ))}
            {renderAuxiliaryInterior(deckNumber, sector)}
            {frontWalls.map((wall) => (
              <polygon
                key={`${sector.id}-fw-${wall.side}-${wall.edgeStart.x.toFixed(1)}`}
                points={polygonToPointsAttr(wall.points)}
                fill={AUXILIARY_WALL_COLORS.wallFillDark}
                stroke="var(--theme-cockpit-border-soft)"
                strokeWidth={0.65}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

export function renderSingleDeckAuxiliaryLabels(deckNumber: number): React.ReactNode {
  const sectors = AUXILIARY_DECK_SECTORS.filter((s) => s.deckNumber === deckNumber);

  return (
    <g data-deck-layer="auxiliary-labels" pointerEvents="none">
      {sectors.map((sector) => {
        const uSpan = sector.u1 - sector.u0;
        const uC = (sector.u0 + sector.u1) / 2;
        const vC = (sector.v0 + sector.v1) / 2;
        const zLift = sector.v1 <= -0.34 ? 4 : 0;
        const center = projectDeckPoint(deckNumber, uC, vC, "single", zLift);
        const lines = splitAuxiliaryLabel(sector.label, uSpan);
        const fontSize = uSpan < 0.085 ? 8.5 : 9.5;
        const maxLen = Math.max(...lines.map((line) => line.length));
        const plateW = Math.max(38, maxLen * fontSize * 0.56 + 10);
        const plateH = lines.length * 10.5 + 4;

        return (
          <g key={`${sector.id}-label`}>
            <rect
              x={center.x - plateW / 2}
              y={center.y - plateH / 2}
              width={plateW}
              height={plateH}
              rx={2.5}
              fill="color-mix(in srgb, var(--theme-bg) 92%, transparent)"
              stroke="var(--theme-cockpit-border-soft)"
              strokeWidth={0.6}
            />
            <text
              x={center.x}
              y={lines.length === 1 ? center.y + 0.5 : center.y - 4.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--theme-text-subtle)"
              fontSize={fontSize}
              fontFamily='"Outfit", "Inter", sans-serif'
              fontWeight={600}
            >
              {lines.map((line, lineIdx) => (
                <tspan key={`${sector.id}-lbl-${line}`} x={center.x} dy={lineIdx === 0 ? 0 : 10.5}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function renderOverviewAuxiliarySectors(deckNumber: number): React.ReactNode {
  const sectors = AUXILIARY_DECK_SECTORS.filter((s) => s.deckNumber === deckNumber);

  return (
    <g data-overview-layer="auxiliary-sectors" pointerEvents="none" opacity={0.56}>
      {sectors.map((sector) => {
        const poly = buildZonePolygon(deckNumber, sector, "overview", 0);
        const uSpan = sector.u1 - sector.u0;
        const vSpan = sector.v1 - sector.v0;
        const uC = (sector.u0 + sector.u1) / 2;
        const vC = (sector.v0 + sector.v1) / 2;

        return (
          <g key={`ov-${sector.id}`}>
            <polygon
              points={polygonToPointsAttr(poly)}
              fill="color-mix(in srgb, var(--theme-hull-armor) 24%, var(--theme-bg))"
              stroke="var(--theme-cockpit-border-soft)"
              strokeDasharray="2 2"
              strokeWidth={0.65}
            />
            {sector.kind === "cabin-grid" && (
              <line
                {...(() => {
                  const pA = projectDeckPoint(deckNumber, sector.u0 + 0.008, vC, "overview", 0.5);
                  const pB = projectDeckPoint(deckNumber, sector.u1 - 0.008, vC, "overview", 0.5);
                  return { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };
                })()}
                stroke="var(--theme-cockpit-border-soft)"
                strokeWidth={0.6}
              />
            )}
            {(sector.kind === "radiators" || sector.kind === "shield-baffle") &&
              [-0.25, 0, 0.25].map((t) => {
                const pA = projectDeckPoint(
                  deckNumber,
                  uC + uSpan * t,
                  sector.v0 + vSpan * 0.2,
                  "overview",
                  0.5,
                );
                const pB = projectDeckPoint(
                  deckNumber,
                  uC + uSpan * t,
                  sector.v1 - vSpan * 0.2,
                  "overview",
                  0.5,
                );
                return (
                  <line
                    key={`ov-rib-${sector.id}-${t}`}
                    x1={pA.x}
                    y1={pA.y}
                    x2={pB.x}
                    y2={pB.y}
                    stroke="var(--theme-cockpit-border-soft)"
                    strokeWidth={0.6}
                  />
                );
              })}
            {sector.kind === "tank-bank" &&
              [-0.22, 0.22].map((t) => {
                const pt = projectDeckPoint(deckNumber, uC, vC + vSpan * t, "overview", 0.5);
                return (
                  <ellipse
                    key={`ov-tk-${sector.id}-${t}`}
                    cx={pt.x}
                    cy={pt.y}
                    rx={4}
                    ry={2}
                    fill="none"
                    stroke="var(--theme-cockpit-border)"
                    strokeWidth={0.65}
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
}

export function renderSingleDeckWallAssembly(opts: {
  deckNumber: number;
  rect: { u0: number; u1: number; v0: number; v1: number };
  faces: ExtrudedWallFace[];
  colors: ZoneToneColors;
  doorSide?: ShipZoneSpec["doorSide"];
  isLocked?: boolean;
  isCabin?: boolean;
}): React.ReactNode {
  const { deckNumber, rect, faces, colors, doorSide, isLocked = false, isCabin = false } = opts;
  const dash = isLocked ? "3 2" : undefined;
  const wallCapWidth = isCabin ? 2.1 : 2.8;

  const doorSpec = doorSide ? getZoneDoorwaySegment(deckNumber, rect, doorSide, "single", 0) : null;
  const doorHeight = isCabin ? 10 : 14;
  const doorLayer: "back" | "front" = doorSide === "port" || doorSide === "fore" ? "back" : "front";
  const shouldRenderDoorInLayer =
    doorSpec !== null && faces.some((f) => f.layer === doorLayer && f.side === doorSide);

  return (
    <g pointerEvents="none">
      {faces.map((face) => {
        const fill =
          face.shade === "lit"
            ? colors.wallFillLit
            : face.shade === "mid"
              ? colors.wallFillMid
              : colors.wallFillDark;

        // Kapea leikkauspinnan yläpalkki tekee laipioista arkkitehtonisen paksut
        const capRise = wallCapWidth;
        const capPoints: IsoPoint[] = [
          face.edgeStart,
          face.edgeEnd,
          { x: face.edgeEnd.x, y: face.edgeEnd.y - capRise },
          { x: face.edgeStart.x, y: face.edgeStart.y - capRise },
        ];
        const midX = (face.edgeStart.x + face.edgeEnd.x) / 2;
        const midY = (face.edgeStart.y + face.edgeEnd.y) / 2;
        const baseMidX = ((face.points[0]?.x ?? midX) + (face.points[1]?.x ?? midX)) / 2;
        const baseMidY = ((face.points[0]?.y ?? midY) + (face.points[1]?.y ?? midY)) / 2;

        return (
          <g key={`wall-${face.side}-${face.edgeStart.x.toFixed(1)}-${face.edgeEnd.x.toFixed(1)}`}>
            <polygon
              points={polygonToPointsAttr(face.points)}
              fill={fill}
              stroke={colors.stroke}
              strokeWidth={0.85}
              strokeDasharray={dash}
            />
            {!isCabin && (
              <line
                x1={midX}
                y1={midY}
                x2={baseMidX}
                y2={baseMidY}
                stroke={colors.stroke}
                strokeWidth={0.65}
                opacity={0.4}
              />
            )}
            <polygon
              points={polygonToPointsAttr(capPoints)}
              fill="color-mix(in srgb, var(--theme-cockpit-elevated) 68%, var(--theme-cockpit-rim))"
              stroke={colors.stroke}
              strokeWidth={0.9}
              strokeDasharray={dash}
            />
          </g>
        );
      })}

      {/* Oviaukon karmit tai sinetöity paineovi */}
      {shouldRenderDoorInLayer && doorSpec && (
        <g>
          {/* Ovikarmipylväät aukon molemmilla reunoilla */}
          <line
            x1={doorSpec.start.x}
            y1={doorSpec.start.y}
            x2={doorSpec.start.x}
            y2={doorSpec.start.y - doorHeight * 0.55}
            stroke={isLocked ? "var(--theme-dawn)" : colors.stroke}
            strokeWidth={isCabin ? 1.5 : 2}
          />
          <line
            x1={doorSpec.end.x}
            y1={doorSpec.end.y}
            x2={doorSpec.end.x}
            y2={doorSpec.end.y - doorHeight * 0.55}
            stroke={isLocked ? "var(--theme-dawn)" : colors.stroke}
            strokeWidth={isCabin ? 1.5 : 2}
          />
          {isLocked ? (
            <g>
              <polygon
                points={polygonToPointsAttr([
                  doorSpec.start,
                  doorSpec.end,
                  { x: doorSpec.end.x, y: doorSpec.end.y - doorHeight },
                  { x: doorSpec.start.x, y: doorSpec.start.y - doorHeight },
                ])}
                fill="color-mix(in srgb, var(--theme-accent) 34%, var(--theme-hull-shadow))"
                stroke="var(--theme-dawn)"
                strokeWidth={1.3}
              />
              <line
                x1={doorSpec.start.x}
                y1={doorSpec.start.y}
                x2={doorSpec.end.x}
                y2={doorSpec.end.y - doorHeight}
                stroke="var(--theme-dawn)"
                strokeWidth={1.25}
              />
              <line
                x1={doorSpec.end.x}
                y1={doorSpec.end.y}
                x2={doorSpec.start.x}
                y2={doorSpec.start.y - doorHeight}
                stroke="var(--theme-dawn)"
                strokeWidth={1.25}
              />
            </g>
          ) : (
            <line
              x1={doorSpec.start.x}
              y1={doorSpec.start.y + 0.5}
              x2={doorSpec.end.x}
              y2={doorSpec.end.y + 0.5}
              stroke="var(--theme-secondary)"
              strokeWidth={1.2}
              opacity={0.75}
            />
          )}
        </g>
      )}
    </g>
  );
}

export function renderSingleDeckWingCorridor(
  deckNumber: number,
  wing: CabinWingSpec,
): React.ReactNode {
  const corr = getWingCorridorRect(wing);
  const steps = Math.max(3, wing.cols);
  const seamUs: number[] = [];
  for (let i = 1; i < steps; i++) {
    seamUs.push(corr.u0 + ((corr.u1 - corr.u0) * i) / steps);
  }
  const midV = (corr.v0 + corr.v1) / 2;

  return (
    <g data-deck-layer={`wing-corridor-${wing.wingKey}`} pointerEvents="none">
      <polygon
        points={polygonToPointsAttr(buildZonePolygon(deckNumber, corr, "single", 0.4))}
        fill="color-mix(in srgb, var(--theme-secondary) 14%, var(--theme-cockpit-elevated))"
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={0.9}
      />
      <line
        {...isoLine(deckNumber, corr.u0 + 0.01, midV, corr.u1 - 0.01, midV, 0.7, 0.7)}
        stroke="var(--theme-secondary)"
        strokeWidth={0.85}
        strokeDasharray="4 3"
        opacity={0.72}
      />
      {seamUs.map((uSeam) => (
        <line
          key={`wing-corr-seam-${wing.wingKey}-${uSeam.toFixed(4)}`}
          {...isoLine(deckNumber, uSeam, corr.v0 + 0.004, uSeam, corr.v1 - 0.004, 0.65, 0.65)}
          stroke="var(--theme-cockpit-border-soft)"
          strokeWidth={0.65}
          opacity={0.6}
        />
      ))}
    </g>
  );
}

export function renderSingleDeckCabinInterior(opts: {
  deckNumber: number;
  layout: WingCabinLayout;
  isOwn: boolean;
  isOccupied: boolean;
}): React.ReactNode {
  const { deckNumber, layout, isOwn, isOccupied } = opts;
  const uSpan = layout.u1 - layout.u0;
  const vSpan = layout.v1 - layout.v0;
  const isRow0 = layout.doorSide === "starboard";

  // Pesukomero kulmassa ja mittakaavan (~2,1 m) vuode ulkoseinän vierellä
  const wcU0 = layout.wcSide === "fore" ? layout.u0 + uSpan * 0.08 : layout.u1 - uSpan * 0.34;
  const wcU1 = wcU0 + uSpan * 0.26;
  const wcV0 = isRow0 ? layout.v0 + vSpan * 0.08 : layout.v1 - vSpan * 0.33;
  const wcV1 = wcV0 + vSpan * 0.25;

  const bunkW = Math.min(0.016, uSpan * 0.44);
  const bunkU0 = layout.wcSide === "fore" ? layout.u0 + uSpan * 0.42 : layout.u0 + uSpan * 0.1;
  const bunkU1 = bunkU0 + bunkW;
  const bunkV0 = isRow0 ? layout.v0 + vSpan * 0.08 : layout.v1 - vSpan * 0.34;
  const bunkV1 = bunkV0 + vSpan * 0.26;

  // Työpöytä ja ruutuvälähdys sänkyä vastapäätä
  const deskU0 = layout.wcSide === "fore" ? layout.u1 - uSpan * 0.38 : layout.u0 + uSpan * 0.1;
  const deskU1 = deskU0 + uSpan * 0.28;
  const deskV0 = isRow0 ? layout.v1 - vSpan * 0.28 : layout.v0 + vSpan * 0.08;
  const deskV1 = deskV0 + vSpan * 0.2;

  const pillowU0 = layout.wcSide === "fore" ? bunkU0 + bunkW * 0.08 : bunkU1 - bunkW * 0.32;
  const pillowU1 = pillowU0 + bunkW * 0.24;

  const throwFill = isOwn
    ? "color-mix(in srgb, var(--theme-dawn) 54%, var(--theme-cockpit-elevated))"
    : isOccupied
      ? "color-mix(in srgb, var(--theme-secondary) 44%, var(--theme-cockpit-elevated))"
      : "color-mix(in srgb, var(--theme-cockpit-border-soft) 35%, var(--theme-cockpit-surface))";

  const bunkStroke = isOwn
    ? "var(--theme-dawn)"
    : isOccupied
      ? "var(--theme-secondary)"
      : "var(--theme-border-medium)";

  const hatchU0 = (layout.u0 + layout.u1) / 2 - uSpan * 0.11;
  const hatchU1 = (layout.u0 + layout.u1) / 2 + uSpan * 0.11;
  const hatchV0 = (layout.v0 + layout.v1) / 2 - vSpan * 0.08;
  const hatchV1 = (layout.v0 + layout.v1) / 2 + vSpan * 0.08;

  return (
    <g pointerEvents="none">
      {/* Salainen huoltoluukku lattiassa */}
      <polygon
        points={isoQuad(deckNumber, hatchU0, hatchU1, hatchV0, hatchV1, 0.35)}
        fill="none"
        stroke="var(--theme-cockpit-border-soft)"
        strokeWidth={0.6}
        strokeDasharray="2 2"
        opacity={0.5}
      />

      {/* Pesusyvennys (WC) */}
      {renderIsoBox({
        deckNumber,
        u0: wcU0,
        u1: wcU1,
        v0: wcV0,
        v1: wcV1,
        zBase: 0,
        zTop: 5.5,
        topFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
        frontFill: "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-bg))",
        sideFill: "color-mix(in srgb, var(--theme-cockpit-surface) 88%, var(--theme-secondary))",
        stroke: "var(--theme-border-medium)",
        strokeWidth: 0.65,
      })}

      {/* 2.5D-vuode, peite ja tyyny */}
      {renderIsoBox({
        deckNumber,
        u0: bunkU0,
        u1: bunkU1,
        v0: bunkV0,
        v1: bunkV1,
        zBase: 0,
        zTop: 3.8,
        topFill: throwFill,
        frontFill: "color-mix(in srgb, var(--theme-cockpit-surface) 92%, var(--theme-hull-shadow))",
        sideFill: "var(--theme-cockpit-surface)",
        stroke: bunkStroke,
        strokeWidth: 0.7,
      })}
      <polygon
        points={isoQuad(
          deckNumber,
          pillowU0,
          pillowU1,
          bunkV0 + vSpan * 0.04,
          bunkV1 - vSpan * 0.04,
          4.3,
        )}
        fill="var(--theme-cockpit-elevated)"
        stroke={bunkStroke}
        strokeWidth={0.5}
      />

      {/* Työpöytä ja pieni päätekehys */}
      {renderIsoBox({
        deckNumber,
        u0: deskU0,
        u1: deskU1,
        v0: deskV0,
        v1: deskV1,
        zBase: 0,
        zTop: 3.4,
        topFill: "color-mix(in srgb, var(--theme-cockpit-header) 85%, var(--theme-bg))",
        frontFill: "var(--theme-cockpit-surface)",
        sideFill: "var(--theme-bg)",
        stroke: "var(--theme-cockpit-border-soft)",
        strokeWidth: 0.65,
      })}
      {(isOwn || isOccupied) && (
        <circle
          cx={polygonCentroid(isoQuadPoints(deckNumber, deskU0, deskU1, deskV0, deskV1, 4.2)).x}
          cy={polygonCentroid(isoQuadPoints(deckNumber, deskU0, deskU1, deskV0, deskV1, 4.2)).y}
          r={1.7}
          fill={isOwn ? "var(--theme-dawn)" : "var(--theme-secondary)"}
        />
      )}
    </g>
  );
}

function renderInteriorPartition(opts: {
  key?: string;
  deckNumber: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  height?: number;
  stroke?: string;
  hasDoorGap?: boolean;
}) {
  const {
    key,
    deckNumber,
    u0,
    v0,
    u1,
    v1,
    height = 10,
    stroke = "var(--theme-cockpit-border)",
    hasDoorGap = true,
  } = opts;
  const p0 = projectDeckPoint(deckNumber, u0, v0, "single", 0);
  const p1 = projectDeckPoint(deckNumber, u1, v1, "single", 0);

  if (!hasDoorGap) {
    const t0 = { x: p0.x, y: p0.y - height };
    const t1 = { x: p1.x, y: p1.y - height };
    return (
      <polygon
        key={key}
        points={polygonToPointsAttr([p0, p1, t1, t0])}
        fill="color-mix(in srgb, var(--theme-cockpit-border-soft) 36%, var(--theme-bg))"
        stroke={stroke}
        strokeWidth={0.85}
      />
    );
  }

  const lerp = (t: number): IsoPoint => ({
    x: p0.x + (p1.x - p0.x) * t,
    y: p0.y + (p1.y - p0.y) * t,
  });
  const segments: Array<[IsoPoint, IsoPoint]> = [
    [p0, lerp(0.36)],
    [lerp(0.64), p1],
  ];

  return (
    <g key={key} pointerEvents="none">
      {segments.map(([a, b], idx) => (
        <polygon
          key={`${key ?? "part"}-${idx === 0 ? "a" : "b"}`}
          points={polygonToPointsAttr([
            a,
            b,
            { x: b.x, y: b.y - height },
            { x: a.x, y: a.y - height },
          ])}
          fill="color-mix(in srgb, var(--theme-cockpit-border-soft) 36%, var(--theme-bg))"
          stroke={stroke}
          strokeWidth={0.85}
        />
      ))}
    </g>
  );
}

export function renderSingleDeckZoneDetail(
  zone: ShipZoneSpec,
  opts: { isLocked: boolean; statusTone?: string; selected: boolean; hovered: boolean },
): React.ReactNode {
  const d = zone.deckNumber;
  const uC = (zone.u0 + zone.u1) / 2;
  const vC = (zone.v0 + zone.v1) / 2;
  const muted = opts.isLocked;
  const statusAccent =
    opts.statusTone === "critical"
      ? "var(--theme-primary)"
      : opts.statusTone === "warning"
        ? "var(--theme-dawn)"
        : muted || opts.statusTone === "locked"
          ? "var(--theme-accent)"
          : "var(--theme-secondary)";

  switch (zone.propKind) {
    case "bridge": {
      const uScreen = zone.u0 + 0.012;
      const screenTopL = projectDeckPoint(d, uScreen, -0.11, "single", 15);
      const screenTopR = projectDeckPoint(d, uScreen, 0.11, "single", 15);
      const screenBotR = projectDeckPoint(d, uScreen, 0.11, "single", 4.5);
      const screenBotL = projectDeckPoint(d, uScreen, -0.11, "single", 4.5);

      return (
        <g data-room-detail="bridge" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "clinical" })}

          {/* Holokaapelit ohjauspöytiin */}
          {[-0.06, 0, 0.06].map((vArc) => (
            <line
              key={`bridge-holo-grid-${vArc}`}
              {...isoLine(d, zone.u0 + 0.014, vArc, uC, vArc, 0.7, 0.7)}
              stroke="var(--theme-secondary)"
              strokeWidth={0.7}
              opacity={0.45}
            />
          ))}

          {/* Keulan päänäyttöseinä */}
          {[-0.112, 0.112].map((vMount) =>
            renderIsoBox({
              key: `bridge-screen-strut-${vMount}`,
              deckNumber: d,
              u0: uScreen - 0.005,
              u1: uScreen + 0.005,
              v0: vMount - 0.006,
              v1: vMount + 0.006,
              zBase: 0,
              zTop: 15,
              topFill: "var(--theme-cockpit-elevated)",
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-cockpit-border)",
            }),
          )}
          <polygon
            points={polygonToPointsAttr([screenTopL, screenTopR, screenBotR, screenBotL])}
            fill="color-mix(in srgb, var(--theme-secondary) 26%, var(--theme-hull-shadow))"
            stroke="var(--theme-secondary)"
            strokeWidth={1.2}
          />
          <line
            {...isoLine(d, uScreen + 0.001, -0.095, uScreen + 0.001, 0.095, 12.2, 12.2)}
            stroke="var(--theme-secondary)"
            strokeWidth={1.1}
          />
          <line
            {...isoLine(d, uScreen + 0.001, -0.08, uScreen + 0.001, 0.02, 9.2, 9.2)}
            stroke="var(--theme-dawn)"
            strokeWidth={1.1}
          />

          {/* Kaksi mittakaavan (~2 m) ohjauspulpettia + istuimet keulassa */}
          {[-0.06, 0.06].map((vHelm) => (
            <g key={`bridge-helm-${vHelm}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: zone.u0 + 0.024,
                u1: zone.u0 + 0.042,
                v0: vHelm - 0.028,
                v1: vHelm + 0.028,
                zBase: 0,
                zTop: 4.8,
                topFill:
                  "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
                frontFill: "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-bg))",
                sideFill: "var(--theme-cockpit-surface)",
                stroke: "var(--theme-secondary)",
              })}
              <line
                {...isoLine(
                  d,
                  zone.u0 + 0.033,
                  vHelm - 0.02,
                  zone.u0 + 0.033,
                  vHelm + 0.02,
                  5.1,
                  5.1,
                )}
                stroke="var(--theme-dawn)"
                strokeWidth={1.2}
              />
              {renderIsoCylinder({
                deckNumber: d,
                u: zone.u0 + 0.052,
                v: vHelm,
                rx: 3.8,
                ry: 2,
                zTop: 3.4,
                bodyFill: "var(--theme-cockpit-surface)",
                topFill: "var(--theme-cockpit-elevated)",
                stroke: "var(--theme-accent)",
              })}
            </g>
          ))}

          {/* Keskustan taktinen karttapöytä ja kapteenin istuin */}
          {renderIsoCylinder({
            deckNumber: d,
            u: uC + 0.005,
            v: 0,
            rx: 10,
            ry: 5.2,
            zTop: 4.6,
            bodyFill: "color-mix(in srgb, var(--theme-secondary) 20%, var(--theme-bg))",
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 28%, var(--theme-cockpit-elevated))",
            stroke: "var(--theme-secondary)",
            ringColor: "var(--theme-dawn)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u1 - 0.042,
            u1: zone.u1 - 0.025,
            v0: -0.018,
            v1: 0.018,
            zBase: 0,
            zTop: 5.5,
            topFill: "color-mix(in srgb, var(--theme-dawn) 36%, var(--theme-cockpit-elevated))",
            frontFill: "color-mix(in srgb, var(--theme-dawn) 20%, var(--theme-bg))",
            sideFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-dawn)",
          })}

          {/* Paapuurin ja styyrpuurin peräpulpetit (oviaukon sivuilla) */}
          {[-0.098, 0.098].map((vPost) =>
            renderIsoBox({
              key: `bridge-aft-post-${vPost}`,
              deckNumber: d,
              u0: zone.u1 - 0.03,
              u1: zone.u1 - 0.012,
              v0: vPost - 0.028,
              v1: vPost + 0.028,
              zBase: 0,
              zTop: 4.6,
              topFill:
                vPost < 0
                  ? "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-elevated))"
                  : "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: vPost < 0 ? "var(--theme-accent)" : "var(--theme-secondary)",
            }),
          )}
        </g>
      );
    }

    case "stealth": {
      const partU = zone.u1 - 0.045;
      const plotPt = projectDeckPoint(d, zone.u0 + 0.068, -0.145, "single", 4.6);

      return (
        <g data-room-detail="stealth" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "clinical" })}

          {/* Väliseinä kuuntelusaliin ja krypto-/suodinhuoneeseen */}
          {renderInteriorPartition({
            deckNumber: d,
            u0: partU,
            v0: zone.v0 + 0.008,
            u1: partU,
            v1: zone.v1 - 0.008,
            height: 10,
            stroke: "var(--theme-secondary)",
          })}

          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u0 + 0.008, -0.18],
              [zone.u0 + 0.068, -0.18],
              [zone.u0 + 0.068, -0.075],
            ],
            z: 1,
            coreColor: "var(--theme-secondary)",
            width: 1.8,
          })}

          {/* Keulan passiivinen kuunteluseinä ja kolme operaattoripulpettia */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.024,
            v0: -0.275,
            v1: -0.095,
            zBase: 0,
            zTop: 8.5,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 28%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {[-0.24, -0.185, -0.13].map((vOp) => (
            <g key={`stealth-op-${vOp}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: zone.u0 + 0.032,
                u1: zone.u0 + 0.046,
                v0: vOp - 0.018,
                v1: vOp + 0.018,
                zBase: 0,
                zTop: 4.4,
                topFill:
                  "color-mix(in srgb, var(--theme-accent) 24%, var(--theme-cockpit-elevated))",
                frontFill: "var(--theme-cockpit-surface)",
                sideFill: "var(--theme-bg)",
                stroke: "var(--theme-accent)",
              })}
              {renderIsoCylinder({
                deckNumber: d,
                u: zone.u0 + 0.056,
                v: vOp,
                rx: 3.4,
                ry: 1.8,
                zTop: 3,
                bodyFill: "var(--theme-cockpit-surface)",
                topFill: "var(--theme-cockpit-elevated)",
                stroke: "var(--theme-secondary)",
              })}
            </g>
          ))}

          {/* Pyöreä suuntimapöytä kuuntelusalin keskellä */}
          {renderIsoCylinder({
            deckNumber: d,
            u: zone.u0 + 0.082,
            v: -0.155,
            rx: 13.5,
            ry: 7,
            zTop: 4.5,
            bodyFill: "color-mix(in srgb, var(--theme-secondary) 20%, var(--theme-bg))",
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 28%, var(--theme-cockpit-elevated))",
            stroke: "var(--theme-secondary)",
            ringColor: "var(--theme-dawn)",
          })}
          <line
            x1={plotPt.x + 6}
            y1={plotPt.y}
            x2={plotPt.x + 17}
            y2={plotPt.y - 5}
            stroke="var(--theme-dawn)"
            strokeWidth={1.2}
          />

          {/* Perän krypto- ja suodatinräkit (3 kapeaa tornia) */}
          {[-0.275, -0.19, -0.105].map((vRack) =>
            renderIsoBox({
              key: `stealth-aft-rack-${vRack}`,
              deckNumber: d,
              u0: partU + 0.012,
              u1: zone.u1 - 0.01,
              v0: vRack - 0.022,
              v1: vRack + 0.022,
              zBase: 0,
              zTop: 8.5,
              topFill:
                "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-secondary)",
            }),
          )}
        </g>
      );
    }

    case "captain": {
      const partU = zone.u0 + 0.052;
      return (
        <g data-room-detail="captain" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "quarters" })}

          {/* Väliseinä yksityishyttiin (keula) ja karttaneuvotteluun (perä) */}
          {renderInteriorPartition({
            deckNumber: d,
            u0: partU,
            v0: zone.v0 + 0.008,
            u1: partU,
            v1: zone.v1 - 0.008,
            height: 10,
          })}

          {/* Yksityinen pesutila kulmassa */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.006,
            u1: zone.u0 + 0.024,
            v0: zone.v0 + 0.008,
            v1: zone.v0 + 0.068,
            zBase: 0,
            zTop: 6.5,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-border-medium)",
          })}

          {/* Yksityishytin mittakaavan (~2,1 m) vuode ja lukupiste */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.028,
            u1: zone.u0 + 0.044,
            v0: zone.v0 + 0.01,
            v1: zone.v0 + 0.044,
            zBase: 0,
            zTop: 4.2,
            topFill: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-elevated))",
            frontFill: "color-mix(in srgb, var(--theme-dawn) 16%, var(--theme-bg))",
            sideFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-dawn)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.008,
            u1: zone.u0 + 0.028,
            v0: -0.14,
            v1: -0.095,
            zBase: 0,
            zTop: 3.8,
            topFill: "var(--theme-cockpit-elevated)",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border)",
          })}

          {/* Karttahuoneen 6 hengen neuvottelupöytä (~4,2 m × 2,4 m) + 6 tuolia */}
          {renderIsoBox({
            deckNumber: d,
            u0: partU + 0.014,
            u1: zone.u1 - 0.022,
            v0: -0.205,
            v1: -0.145,
            zBase: 0,
            zTop: 4.4,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {[partU + 0.02, partU + 0.032, partU + 0.044].map((uSeat) =>
            [-0.222, -0.128].map((vSeat) =>
              renderIsoCylinder({
                key: `capt-chair-${uSeat}-${vSeat}`,
                deckNumber: d,
                u: uSeat,
                v: vSeat,
                rx: 2.9,
                ry: 1.5,
                zTop: 2.8,
                bodyFill: "var(--theme-cockpit-surface)",
                topFill: "var(--theme-dawn)",
                stroke: "var(--theme-cockpit-border)",
              }),
            ),
          )}

          {/* Tähtikarttahylly peräseinällä */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u1 - 0.016,
            u1: zone.u1 - 0.006,
            v0: -0.29,
            v1: -0.11,
            zBase: 0,
            zTop: 9,
            topFill: "var(--theme-cockpit-elevated)",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border-soft)",
          })}
        </g>
      );
    }

    case "logs": {
      const partU = zone.u0 + 0.036;
      return (
        <g data-room-detail="logs" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {renderInteriorPartition({
            deckNumber: d,
            u0: partU,
            v0: zone.v0 + 0.008,
            u1: partU,
            v1: zone.v1 - 0.008,
            height: 10.5,
            stroke: "var(--theme-accent)",
          })}

          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u0 + 0.024, vC],
              [uC + 0.028, vC],
            ],
            z: 1,
            coreColor: "var(--theme-secondary)",
            width: 1.6,
          })}

          {/* Keulan tarkastuseteinen: purkupulpetti ja pakatut kuljetuslaatikot */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.026,
            v0: 0.135,
            v1: 0.21,
            zBase: 0,
            zTop: 4.5,
            topFill: "color-mix(in srgb, var(--theme-accent) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-accent)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.026,
            v0: 0.23,
            v1: 0.282,
            zBase: 0,
            zTop: 4.8,
            topFill: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-elevated))",
            frontFill: "color-mix(in srgb, var(--theme-dawn) 16%, var(--theme-bg))",
            sideFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-dawn)",
          })}

          {/* Keskuspäiväkirjan jalusta */}
          {renderIsoCylinder({
            deckNumber: d,
            u: partU + 0.024,
            v: vC,
            rx: 7.5,
            ry: 4,
            zTop: 6.5,
            bodyFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))",
            topFill: "var(--theme-cockpit-elevated)",
            stroke: "var(--theme-secondary)",
            ringColor: "var(--theme-dawn)",
          })}

          {/* Kuusi kapeaa nauha-asemamonoliittia holvin peräosassa */}
          {[partU + 0.044, zone.u1 - 0.02].map((uCol) =>
            [0.095, 0.175, 0.255].map((vRow) =>
              renderIsoBox({
                key: `logs-monolith-${uCol}-${vRow}`,
                deckNumber: d,
                u0: uCol,
                u1: uCol + 0.012,
                v0: vRow - 0.018,
                v1: vRow + 0.018,
                zBase: 0,
                zTop: 9.5,
                topFill:
                  "color-mix(in srgb, var(--theme-secondary) 26%, var(--theme-cockpit-elevated))",
                frontFill: "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-bg))",
                sideFill: "var(--theme-cockpit-surface)",
                stroke: "var(--theme-secondary)",
              }),
            ),
          )}
        </g>
      );
    }

    case "mess": {
      const partPentteriU = zone.u0 + 0.048;
      const partLoungeU = zone.u1 - 0.042;
      const reliefStations: number[] = [];
      for (let i = 0; i < 20; i++) {
        reliefStations.push(partPentteriU + 0.008 + i * 0.0046);
      }

      return (
        <g data-room-detail="mess" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "quarters" })}

          {/* Pentterin väliseinä (keulapuoli) ja oleskelunurkan rajaus */}
          {renderInteriorPartition({
            deckNumber: d,
            u0: partPentteriU,
            v0: zone.v0 + 0.008,
            u1: partPentteriU,
            v1: zone.v1 - 0.008,
            height: 9,
          })}
          {renderInteriorPartition({
            deckNumber: d,
            u0: partLoungeU,
            v0: zone.v0 + 0.008,
            u1: partLoungeU,
            v1: zone.v0 + 0.12,
            height: 7.5,
            hasDoorGap: false,
          })}

          {/* Pentteri: L-keittiötaso, hella ja tarjoiluluukku */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.008,
            u1: zone.u0 + 0.022,
            v0: zone.v0 + 0.015,
            v1: zone.v1 - 0.02,
            zBase: 0,
            zTop: 4.8,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {[-0.25, -0.17].map((vBurn) => {
            const bPt = projectDeckPoint(d, zone.u0 + 0.015, vBurn, "single", 5.1);
            return (
              <ellipse
                key={`mess-burner-${vBurn}`}
                cx={bPt.x}
                cy={bPt.y}
                rx={3.4}
                ry={1.8}
                fill="none"
                stroke="var(--theme-primary)"
                strokeWidth={1.1}
              />
            );
          })}

          {/* Syyn 20 aseman reliefi ruokasalin paapuurin seinällä (v0) */}
          {renderIsoBox({
            deckNumber: d,
            u0: partPentteriU + 0.004,
            u1: partLoungeU - 0.004,
            v0: zone.v0 + 0.006,
            v1: zone.v0 + 0.015,
            zBase: 0,
            zTop: 12.5,
            topFill: "var(--theme-cockpit-elevated)",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border)",
          })}
          {reliefStations.map((uSt, idx) => (
            <line
              key={`relief-station-${uSt.toFixed(4)}`}
              {...isoLine(d, uSt, zone.v0 + 0.016, uSt + 0.002, zone.v0 + 0.016, 11.5, 8.2)}
              stroke={idx % 3 === 0 ? "var(--theme-dawn)" : "var(--theme-secondary)"}
              strokeWidth={1.15}
            />
          ))}

          {/* Neljä mittakaavan (~2,4 m) ruokailupöytää penkkeineen */}
          {[partPentteriU + 0.022, partPentteriU + 0.052].map((uTbl) =>
            [-0.245, -0.135].map((vTbl) => (
              <g key={`mess-table-${uTbl}-${vTbl}`}>
                {renderIsoBox({
                  deckNumber: d,
                  u0: uTbl - 0.008,
                  u1: uTbl + 0.008,
                  v0: vTbl - 0.022,
                  v1: vTbl + 0.022,
                  zBase: 0,
                  zTop: 4.2,
                  topFill:
                    "color-mix(in srgb, var(--theme-dawn) 26%, var(--theme-cockpit-elevated))",
                  frontFill: "var(--theme-cockpit-surface)",
                  sideFill: "var(--theme-bg)",
                  stroke: "var(--theme-dawn)",
                })}
                {[-0.013, 0.013].map((uBench) =>
                  renderIsoBox({
                    key: `mess-bench-${uTbl}-${vTbl}-${uBench}`,
                    deckNumber: d,
                    u0: uTbl + uBench - 0.003,
                    u1: uTbl + uBench + 0.003,
                    v0: vTbl - 0.018,
                    v1: vTbl + 0.018,
                    zBase: 0,
                    zTop: 2.5,
                    topFill: "var(--theme-cockpit-surface)",
                    frontFill: "var(--theme-bg)",
                    sideFill: "var(--theme-bg)",
                    stroke: "var(--theme-cockpit-border-soft)",
                  }),
                )}
              </g>
            )),
          )}

          {/* Oleskelunurkka perällä: L-sohva, lautapelipöytä ja kasettimankka */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u1 - 0.022,
            u1: zone.u1 - 0.008,
            v0: -0.25,
            v1: -0.13,
            zBase: 0,
            zTop: 4.6,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: partLoungeU + 0.006,
            u1: zone.u1 - 0.026,
            v0: -0.215,
            v1: -0.165,
            zBase: 0,
            zTop: 3.4,
            topFill: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
        </g>
      );
    }

    case "galley": {
      const shelfUs = [zone.u0 + 0.014, zone.u0 + 0.036, zone.u0 + 0.058, zone.u0 + 0.08];
      return (
        <g data-room-detail="galley" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "quarters" })}

          {/* Kylmävaraston eristyskoppi styyrpuurin peränurkassa (tiukasti v <= 0.31) */}
          {renderInteriorPartition({
            deckNumber: d,
            u0: zone.u1 - 0.044,
            v0: 0.185,
            u1: zone.u1 - 0.044,
            v1: zone.v1 - 0.008,
            height: 9,
          })}
          {renderInteriorPartition({
            deckNumber: d,
            u0: zone.u1 - 0.044,
            v0: 0.185,
            u1: zone.u1 - 0.008,
            v1: 0.185,
            height: 9,
            hasDoorGap: false,
          })}
          {[0.215, 0.26].map((vCold) =>
            renderIsoBox({
              key: `galley-cold-${vCold}`,
              deckNumber: d,
              u0: zone.u1 - 0.034,
              u1: zone.u1 - 0.012,
              v0: vCold,
              v1: vCold + 0.032,
              zBase: 0,
              zTop: 6.8,
              topFill: "color-mix(in srgb, var(--theme-accent) 26%, var(--theme-cockpit-elevated))",
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-accent)",
            }),
          )}

          {/* Neljä kapeaa 1,4 m kuivamuonahyllykäytävää */}
          {shelfUs.map((uShelf) => (
            <g key={`galley-shelf-${uShelf}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: uShelf,
                u1: uShelf + 0.011,
                v0: 0.115,
                v1: 0.225,
                zBase: 0,
                zTop: 6.5,
                topFill:
                  "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
                frontFill: "var(--theme-cockpit-surface)",
                sideFill: "var(--theme-bg)",
                stroke: "var(--theme-secondary)",
              })}
              {[0.14, 0.17, 0.2].map((vCrate) => (
                <line
                  key={`galley-crate-${uShelf}-${vCrate}`}
                  {...isoLine(d, uShelf + 0.002, vCrate, uShelf + 0.009, vCrate, 6.8, 6.8)}
                  stroke="var(--theme-dawn)"
                  strokeWidth={0.8}
                />
              ))}
            </g>
          ))}

          {/* Kolme makeavesisäiliötä ulkoseinällä (v = 0.272) */}
          {[zone.u0 + 0.02, zone.u0 + 0.048, zone.u0 + 0.076].map((uTank) =>
            renderIsoCylinder({
              key: `galley-water-${uTank}`,
              deckNumber: d,
              u: uTank,
              v: 0.272,
              rx: 6.2,
              ry: 3.3,
              zTop: 7.5,
              bodyFill: "color-mix(in srgb, var(--theme-accent) 26%, var(--theme-bg))",
              topFill:
                "color-mix(in srgb, var(--theme-secondary) 28%, var(--theme-cockpit-elevated))",
              stroke: "var(--theme-secondary)",
              ringColor: "var(--theme-accent)",
            }),
          )}

          {/* Biomuonapuristin ovikäytävän lähellä */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u1 - 0.036,
            u1: zone.u1 - 0.012,
            v0: 0.088,
            v1: 0.145,
            zBase: 0,
            zTop: 7,
            topFill: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
        </g>
      );
    }

    case "dormitory": {
      const mutedStroke = muted ? "var(--theme-accent)" : "var(--theme-border-medium)";
      const cols = 6;
      const cellSpanU = (zone.u1 - zone.u0 - 0.036) / cols;
      const rowBands: Array<[number, number]> = [
        [-0.315, -0.215],
        [-0.125, -0.025],
        [0.025, 0.125],
        [0.215, 0.315],
      ];

      return (
        <g data-room-detail="dormitory" pointerEvents="none" opacity={muted ? 0.78 : 0.94}>
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "quarters" })}

          {/* Sinetöity etulaipion sulkukäytävä + kaksi pituussuuntaista pimeää käytävää */}
          <line
            {...isoLine(d, zone.u0 + 0.022, -0.32, zone.u0 + 0.022, 0.32, 0.6, 0.6)}
            stroke={mutedStroke}
            strokeWidth={1.1}
            strokeDasharray="3 3"
          />
          {[-0.17, 0.17].map((vCorr) => (
            <line
              key={`dorm-aisle-${vCorr}`}
              {...isoLine(d, zone.u0 + 0.022, vCorr, zone.u1 - 0.01, vCorr, 0.6, 0.6)}
              stroke={mutedStroke}
              strokeWidth={1.1}
              strokeDasharray="4 3"
            />
          ))}

          {/* 24 tiivistä pimeää miehistösolua (6 saraketta × 4 riviä ≈ 3,8 m × 4,2 m) */}
          {rowBands.map(([rV0, rV1], rowIdx) =>
            [0, 1, 2, 3, 4, 5].map((colIdx) => {
              const cU0 = zone.u0 + 0.026 + colIdx * cellSpanU;
              const cU1 = cU0 + cellSpanU - 0.003;
              return (
                <g key={`dorm-cell-${rowIdx}-${colIdx}`}>
                  <polygon
                    points={isoQuad(d, cU0, cU1, rV0, rV1, 0.5)}
                    fill="color-mix(in srgb, var(--theme-accent) 12%, var(--theme-cockpit-surface))"
                    stroke={mutedStroke}
                    strokeWidth={0.75}
                    strokeDasharray="3 2"
                  />
                  {renderIsoBox({
                    deckNumber: d,
                    u0: cU0 + 0.004,
                    u1: cU0 + 0.017,
                    v0: rV0 + 0.014,
                    v1: rV0 + 0.04,
                    zBase: 0,
                    zTop: 3.8,
                    topFill:
                      "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-cockpit-surface))",
                    frontFill: "var(--theme-bg)",
                    sideFill: "var(--theme-hull-shadow)",
                    stroke: mutedStroke,
                    strokeWidth: 0.65,
                  })}
                </g>
              );
            }),
          )}
        </g>
      );
    }

    case "breach": {
      const effectiveTone = opts.statusTone ?? "critical";
      const isDamaged =
        !opts.isLocked && (effectiveTone === "critical" || effectiveTone === "warning");

      if (!isDamaged) {
        return (
          <g data-room-detail="breach-repaired" pointerEvents="none">
            {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

            {/* Hitsattu paikkauslevy ja sisemmät runkopalkit */}
            <polygon
              points={isoQuad(d, zone.u0 + 0.015, zone.u1 - 0.015, -0.435, -0.395, 1.4)}
              fill={`color-mix(in srgb, ${statusAccent} 16%, var(--theme-cockpit-surface))`}
              stroke={statusAccent}
              strokeWidth={1.15}
            />
            {[-0.06, -0.02, 0.02, 0.06].map((uBeam) => (
              <line
                key={`repaired-rib-${uBeam}`}
                {...isoLine(d, uC + uBeam, -0.435, uC + uBeam, -0.32, 1.8, 1.8)}
                stroke="var(--theme-cockpit-border)"
                strokeWidth={1.6}
              />
            ))}
            {renderIsoBox({
              deckNumber: d,
              u0: zone.u0 + 0.022,
              u1: zone.u0 + 0.052,
              v0: -0.335,
              v1: -0.295,
              zBase: 0,
              zTop: 4.8,
              topFill: `color-mix(in srgb, ${statusAccent} 22%, var(--theme-cockpit-elevated))`,
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: statusAccent,
            })}
            {renderIsoCylinder({
              deckNumber: d,
              u: zone.u1 - 0.032,
              v: -0.315,
              rx: 4.8,
              ry: 2.5,
              zTop: 7,
              bodyFill: `color-mix(in srgb, ${statusAccent} 22%, var(--theme-bg))`,
              topFill: "var(--theme-cockpit-elevated)",
              stroke: statusAccent,
              ringColor: "var(--theme-dawn)",
            })}
          </g>
        );
      }

      const hazardColor =
        effectiveTone === "warning" ? "var(--theme-dawn)" : "var(--theme-primary)";

      return (
        <g data-room-detail="breach" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Revenneet ulkorakenteen pirstaleet */}
          <polygon
            points={polygonToPointsAttr([
              projectDeckPoint(d, zone.u0 + 0.02, -0.34, "single", 0.8),
              projectDeckPoint(d, uC - 0.02, -0.41, "single", 1.2),
              projectDeckPoint(d, uC + 0.02, -0.345, "single", 0.8),
            ])}
            fill="var(--theme-hull-shadow)"
            stroke={hazardColor}
            strokeWidth={1.1}
          />
          <polygon
            points={polygonToPointsAttr([
              projectDeckPoint(d, uC + 0.01, -0.345, "single", 0.8),
              projectDeckPoint(d, zone.u1 - 0.045, -0.39, "single", 1.2),
              projectDeckPoint(d, zone.u1 - 0.02, -0.335, "single", 0.8),
            ])}
            fill="var(--theme-hull-shadow)"
            stroke={hazardColor}
            strokeWidth={1.1}
          />

          {/* Sisempi hätätiivistyslaipio ja viisi diagonaalista I-palkkitukea */}
          <polygon
            points={isoQuad(d, zone.u0 + 0.015, zone.u1 - 0.015, -0.335, -0.285, 2)}
            fill={`color-mix(in srgb, ${hazardColor} 16%, var(--theme-cockpit-surface))`}
            stroke={hazardColor}
            strokeWidth={1.15}
          />
          {[-0.06, -0.02, 0.02, 0.06].map((uOff) => (
            <line
              key={`breach-ibeam-${uOff}`}
              {...isoLine(d, uC + uOff - 0.014, -0.38, uC + uOff + 0.014, -0.285, 5.5, 2.8)}
              stroke={hazardColor}
              strokeWidth={2.6}
              strokeLinecap="round"
            />
          ))}
          {[-0.04, 0, 0.04].map((uStripe) => (
            <line
              key={`breach-hazard-${uStripe}`}
              {...isoLine(d, uC + uStripe, -0.302, uC + uStripe + 0.014, -0.288, 2.3, 2.3)}
              stroke="var(--theme-dawn)"
              strokeWidth={1.3}
            />
          ))}
          {renderIsoCylinder({
            deckNumber: d,
            u: zone.u1 - 0.032,
            v: -0.315,
            rx: 4.8,
            ry: 2.5,
            zTop: 7,
            bodyFill: "color-mix(in srgb, var(--theme-dawn) 26%, var(--theme-bg))",
            topFill: "var(--theme-dawn)",
            stroke: hazardColor,
          })}
        </g>
      );
    }

    case "hangar": {
      const slip1CenterU = -0.332;
      const slip2CenterU = -0.243;

      return (
        <g data-room-detail="hangar" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Geometrinen seinämuraali sisemmässä keulalaipiossa */}
          <polygon
            points={polygonToPointsAttr([
              projectDeckPoint(d, zone.u0 + 0.012, 0.065, "single", 7.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.16, "single", 14.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.245, "single", 7.5),
            ])}
            fill="color-mix(in srgb, var(--theme-dawn) 18%, var(--theme-cockpit-surface))"
            stroke="var(--theme-dawn)"
            strokeWidth={1.2}
          />
          <polygon
            points={polygonToPointsAttr([
              projectDeckPoint(d, zone.u0 + 0.012, 0.245, "single", 7.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.33, "single", 14.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.4, "single", 8.5),
            ])}
            fill="color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-cockpit-surface))"
            stroke="var(--theme-secondary)"
            strokeWidth={1.2}
          />
          <polyline
            points={polygonToPointsAttr([
              projectDeckPoint(d, zone.u0 + 0.012, 0.065, "single", 7.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.16, "single", 14.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.245, "single", 6.8),
              projectDeckPoint(d, zone.u0 + 0.012, 0.33, "single", 14.5),
              projectDeckPoint(d, zone.u0 + 0.012, 0.4, "single", 8.5),
            ])}
            fill="none"
            stroke="var(--theme-dawn)"
            strokeWidth={1.6}
          />

          {/* Hallin pitkä kattokiskopalkki sekä Slip 1:n poikittaisnosturi */}
          <line
            {...isoLine(d, zone.u0 + 0.01, 0.115, zone.u1 - 0.01, 0.115, 14.2, 14.2)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={2.2}
          />
          <line
            {...isoLine(d, zone.u0 + 0.01, 0.115, zone.u1 - 0.01, 0.115, 14.9, 14.9)}
            stroke="var(--theme-dawn)"
            strokeWidth={1.05}
            strokeDasharray="6 4"
          />
          <line
            {...isoLine(d, slip1CenterU, 0.115, slip1CenterU, 0.35, 13.8, 13.8)}
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1.6}
          />

          {/* Slip 2: Tyhjä toinen sukkula- ja maihinnousualuksen telakkapaikka */}
          <polygon
            points={isoQuad(d, slip2CenterU - 0.032, slip2CenterU + 0.032, 0.14, 0.38, 0.7)}
            fill="none"
            stroke="var(--theme-cockpit-border)"
            strokeWidth={1}
            strokeDasharray="5 3"
          />
          {[-0.016, 0.016].map((uRailOffset) => (
            <line
              key={`slip2-rail-${uRailOffset}`}
              {...isoLine(
                d,
                slip2CenterU + uRailOffset,
                0.15,
                slip2CenterU + uRailOffset,
                0.418,
                0.8,
                0.8,
              )}
              stroke="var(--theme-cockpit-border)"
              strokeWidth={1.1}
              strokeDasharray="3 3"
            />
          ))}

          {/* Slip 1: Magneettiset laukaisukiskot styyrpuurin ulosajoporteille */}
          {[-0.02, 0.02].map((uRailOffset) => (
            <line
              key={`launch-rail-${uRailOffset}`}
              {...isoLine(
                d,
                slip1CenterU + uRailOffset,
                0.125,
                slip1CenterU + uRailOffset,
                0.425,
                1,
                1,
              )}
              stroke="var(--theme-dawn)"
              strokeWidth={1.7}
            />
          ))}
          {[0.372, 0.398, 0.422].map((vChev) => (
            <polyline
              key={`hangar-chev-${vChev}`}
              points={polygonToPointsAttr([
                projectDeckPoint(d, slip1CenterU - 0.015, vChev - 0.008, "single", 1.2),
                projectDeckPoint(d, slip1CenterU, vChev + 0.007, "single", 1.2),
                projectDeckPoint(d, slip1CenterU + 0.015, vChev - 0.008, "single", 1.2),
              ])}
              fill="none"
              stroke="var(--theme-dawn)"
              strokeWidth={1.15}
            />
          ))}

          {/* Farmarisukkula (~9.5 m pitkä huoltosukkula Slip 1:ssä) */}
          {renderIsoBox({
            deckNumber: d,
            u0: slip1CenterU - 0.022,
            u1: slip1CenterU + 0.022,
            v0: 0.145,
            v1: 0.325,
            zBase: 1.5,
            zTop: 10.2,
            topFill: "color-mix(in srgb, var(--theme-accent) 28%, var(--theme-cockpit-elevated))",
            frontFill: "color-mix(in srgb, var(--theme-accent) 20%, var(--theme-bg))",
            sideFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-accent)",
            strokeWidth: 1.15,
          })}
          {/* Farmarisukkulan keulaohjaamo ja panssari-ikkuna */}
          {renderIsoBox({
            deckNumber: d,
            u0: slip1CenterU - 0.016,
            u1: slip1CenterU + 0.016,
            v0: 0.325,
            v1: 0.362,
            zBase: 1.5,
            zTop: 7.8,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 34%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          <polygon
            points={isoQuad(d, slip1CenterU - 0.012, slip1CenterU + 0.012, 0.332, 0.354, 8.1)}
            fill="var(--theme-secondary)"
            opacity={0.78}
          />
          {/* Paapuurin ja styyrpuurin sukkulasiivekkeet */}
          {[
            [slip1CenterU - 0.032, slip1CenterU - 0.022],
            [slip1CenterU + 0.022, slip1CenterU + 0.032],
          ].map(([uW0, uW1]) => (
            <polygon
              key={`shuttle-winglet-${uW0}`}
              points={isoQuad(d, uW0, uW1, 0.175, 0.245, 5.0)}
              fill="color-mix(in srgb, var(--theme-accent) 32%, var(--theme-cockpit-elevated))"
              stroke="var(--theme-secondary)"
              strokeWidth={1.05}
            />
          ))}
          {/* Sukkulan kattoteline ja kaksi takasuutinta */}
          {renderIsoBox({
            deckNumber: d,
            u0: slip1CenterU - 0.014,
            u1: slip1CenterU + 0.014,
            v0: 0.165,
            v1: 0.295,
            zBase: 10.2,
            zTop: 12.0,
            topFill: "color-mix(in srgb, var(--theme-dawn) 30%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
          {[-0.012, 0.012].map((uJet) =>
            renderIsoCylinder({
              key: `shuttle-nozzle-${uJet}`,
              deckNumber: d,
              u: slip1CenterU + uJet,
              v: 0.132,
              rx: 4.2,
              ry: 2.2,
              zBase: 2.5,
              zTop: 5.5,
              bodyFill: "var(--theme-cockpit-surface)",
              topFill: "var(--theme-primary)",
              stroke: "var(--theme-dawn)",
            }),
          )}

          {/* Harppuunavinssi, kaapelikela ja syöttöletkut Slip 2:n perällä */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u1 - 0.032,
            u1: zone.u1 - 0.01,
            v0: 0.1,
            v1: 0.185,
            zBase: 0,
            zTop: 5.8,
            topFill: "color-mix(in srgb, var(--theme-dawn) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
          {renderIsoCylinder({
            deckNumber: d,
            u: zone.u1 - 0.021,
            v: 0.225,
            rx: 4.0,
            ry: 2.1,
            zTop: 5.2,
            bodyFill: "var(--theme-cockpit-surface)",
            topFill: "color-mix(in srgb, var(--theme-dawn) 26%, var(--theme-cockpit-elevated))",
            stroke: "var(--theme-dawn)",
          })}
          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u1 - 0.032, 0.145],
              [slip2CenterU + 0.01, 0.145],
              [slip1CenterU + 0.025, 0.185],
            ],
            z: 2.0,
            coreColor: "var(--theme-dawn)",
            width: 1.6,
          })}

          {/* Keulapuolen huoltotyöpöytä ja varustelaatikko */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.026,
            v0: 0.085,
            v1: 0.16,
            zBase: 0,
            zTop: 4.2,
            topFill: "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-accent)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.028,
            v0: 0.335,
            v1: 0.405,
            zBase: 0,
            zTop: 5.4,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
        </g>
      );
    }

    case "medbay": {
      const surgeryBedU0 = -0.102;
      const surgeryBedU1 = -0.089;
      const bedVs: readonly [number, number][] = [
        [-0.268, -0.24],
        [-0.182, -0.154],
      ];

      return (
        <g data-room-detail="medbay" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "clinical" })}

          {/* Kolmen huoneen väliseinät: keulan apteekki, keskileikkaussali ja perän heräämö/kryo */}
          {renderInteriorPartition({
            key: "med-part-triage",
            deckNumber: d,
            u0: -0.12,
            v0: zone.v0,
            u1: -0.12,
            v1: zone.v1,
            height: 9,
            stroke: "var(--theme-secondary)",
            hasDoorGap: true,
          })}
          {renderInteriorPartition({
            key: "med-part-recovery",
            deckNumber: d,
            u0: -0.07,
            v0: zone.v0,
            u1: -0.07,
            v1: zone.v1,
            height: 9,
            stroke: "var(--theme-secondary)",
            hasDoorGap: true,
          })}

          {/* Keulahuone: lääke- ja proteesikaapit sekä lajittelutiski */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.008,
            u1: -0.132,
            v0: -0.292,
            v1: -0.185,
            zBase: 0,
            zTop: 8.4,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 28%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.009,
            u1: -0.13,
            v0: -0.15,
            v1: -0.074,
            zBase: 0,
            zTop: 4.5,
            topFill: "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-accent)",
          })}

          {/* Keskihuone: leikkaussalin kaksi ihmismittakaavaista leikkauspöytää ja rengaslamput */}
          <polygon
            points={isoQuad(d, -0.113, -0.075, -0.286, -0.134, 0.8)}
            fill="none"
            stroke="var(--theme-secondary)"
            strokeWidth={0.85}
            strokeDasharray="3 3"
          />
          {bedVs.map(([vB0, vB1]) => {
            const vMid = (vB0 + vB1) / 2;
            const lampCenter = projectDeckPoint(
              d,
              (surgeryBedU0 + surgeryBedU1) / 2,
              vMid,
              "single",
              11.4,
            );
            const lampBase = projectDeckPoint(d, surgeryBedU0 - 0.004, vMid, "single", 4.5);
            const monitorPt = projectDeckPoint(d, surgeryBedU1 + 0.003, vB0, "single", 6.2);

            return (
              <g key={`med-bed-${vB0}`}>
                {renderIsoBox({
                  deckNumber: d,
                  u0: surgeryBedU0,
                  u1: surgeryBedU1,
                  v0: vB0,
                  v1: vB1,
                  zBase: 0,
                  zTop: 4.2,
                  topFill:
                    "color-mix(in srgb, var(--theme-secondary) 32%, var(--theme-cockpit-elevated))",
                  frontFill: "color-mix(in srgb, var(--theme-secondary) 16%, var(--theme-bg))",
                  sideFill: "var(--theme-cockpit-surface)",
                  stroke: "var(--theme-secondary)",
                })}
                {/* Leikkaussalin rengaslamppu ja kääntyvä varsi */}
                <line
                  x1={lampBase.x}
                  y1={lampBase.y}
                  x2={lampCenter.x}
                  y2={lampCenter.y}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.1}
                />
                <ellipse
                  cx={lampCenter.x}
                  cy={lampCenter.y}
                  rx={5.2}
                  ry={2.6}
                  fill="none"
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.15}
                />
                <circle cx={lampCenter.x} cy={lampCenter.y} r={1.6} fill="var(--theme-secondary)" />
                {/* Instrumenttitaso pöydän vieressä */}
                {renderIsoBox({
                  deckNumber: d,
                  u0: -0.085,
                  u1: -0.077,
                  v0: vB0 + 0.003,
                  v1: vB1 - 0.005,
                  zBase: 0,
                  zTop: 3.6,
                  topFill: "var(--theme-cockpit-elevated)",
                  frontFill: "var(--theme-cockpit-surface)",
                  sideFill: "var(--theme-bg)",
                  stroke: "var(--theme-secondary)",
                })}
                {/* Elintoimintomonitori */}
                <circle cx={monitorPt.x} cy={monitorPt.y} r={1.8} fill="var(--theme-primary)" />
              </g>
            );
          })}

          {/* Perähuone: heräämö (kaksi toipumisvuodetta), kompakti kryoyksikkö ja hoitajan pöytä */}
          {[
            [-0.225, -0.197],
            [-0.145, -0.117],
          ].map(([vCot0, vCot1]) =>
            renderIsoBox({
              key: `med-cot-${vCot0}`,
              deckNumber: d,
              u0: -0.062,
              u1: -0.049,
              v0: vCot0,
              v1: vCot1,
              zBase: 0,
              zTop: 3.6,
              topFill:
                "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
              frontFill: "var(--theme-cockpit-surface)",
              sideFill: "var(--theme-bg)",
              stroke: "var(--theme-secondary)",
            }),
          )}
          {renderIsoCylinder({
            deckNumber: d,
            u: zone.u1 - 0.013,
            v: -0.272,
            rx: 5.5,
            ry: 2.8,
            zTop: 8.5,
            bodyFill: "color-mix(in srgb, var(--theme-accent) 26%, var(--theme-bg))",
            topFill: "var(--theme-secondary)",
            stroke: "var(--theme-secondary)",
            ringColor: "var(--theme-dawn)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: -0.06,
            u1: -0.042,
            v0: -0.095,
            v1: -0.064,
            zBase: 0,
            zTop: 4.2,
            topFill: "color-mix(in srgb, var(--theme-accent) 20%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-accent)",
          })}
        </g>
      );
    }

    case "armory": {
      const suitVs = [-0.255, -0.2, -0.145, -0.09, 0.075, 0.13, 0.185, 0.24];

      return (
        <g data-room-detail="armory" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Kahdeksan kompaktia (~1.1 m) EVA-painepuku- ja saapaskaappia peräseinällä */}
          {suitVs.map((vSuit) => (
            <g key={`eva-locker-${vSuit}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: zone.u1 - 0.019,
                u1: zone.u1 - 0.008,
                v0: vSuit - 0.014,
                v1: vSuit + 0.014,
                zBase: 0,
                zTop: 8.5,
                topFill:
                  "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
                frontFill: "var(--theme-cockpit-surface)",
                sideFill: "var(--theme-bg)",
                stroke: "var(--theme-secondary)",
              })}
              <circle
                cx={projectDeckPoint(d, zone.u1 - 0.019, vSuit, "single", 6.4).x}
                cy={projectDeckPoint(d, zone.u1 - 0.019, vSuit, "single", 6.4).y}
                r={1.4}
                fill="var(--theme-dawn)"
              />
            </g>
          ))}

          {/* Paapuuripuoli: varustekaappi ja telineet */}
          {renderInteriorPartition({
            key: "armory-cage-aft",
            deckNumber: d,
            u0: 0.315,
            v0: zone.v0,
            u1: 0.315,
            v1: -0.06,
            height: 8.5,
            stroke: statusAccent,
            hasDoorGap: true,
          })}
          {renderInteriorPartition({
            key: "armory-cage-side",
            deckNumber: d,
            u0: zone.u0 + 0.008,
            v0: -0.06,
            u1: 0.315,
            v1: -0.06,
            height: 8.5,
            stroke: statusAccent,
            hasDoorGap: true,
          })}
          {[-0.215, -0.125].map((vRack) => (
            <g key={`armory-rack-${vRack}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: zone.u0 + 0.011,
                u1: zone.u0 + 0.029,
                v0: vRack - 0.03,
                v1: vRack + 0.03,
                zBase: 0,
                zTop: 5.8,
                topFill: `color-mix(in srgb, ${statusAccent} 24%, var(--theme-cockpit-elevated))`,
                frontFill: "var(--theme-cockpit-surface)",
                sideFill: "var(--theme-bg)",
                stroke: statusAccent,
              })}
              {[-0.018, 0, 0.018].map((vBarrel) => (
                <line
                  key={`armory-barrel-${vRack}-${vBarrel}`}
                  {...isoLine(
                    d,
                    zone.u0 + 0.014,
                    vRack + vBarrel,
                    zone.u0 + 0.026,
                    vRack + vBarrel,
                    6.2,
                    6.2,
                  )}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.1}
                />
              ))}
            </g>
          ))}
          {renderIsoBox({
            deckNumber: d,
            u0: 0.294,
            u1: 0.308,
            v0: -0.22,
            v1: -0.12,
            zBase: 0,
            zTop: 4.2,
            topFill: "color-mix(in srgb, var(--theme-dawn) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}

          {/* Kaksi kompaktia köysi- ja happiletku-kelaa paapuurin huoltovyöhykkeellä */}
          {[-0.24, -0.1].map((vReel) => {
            const rTop = projectDeckPoint(d, 0.335, vReel, "single", 5);
            return (
              <g key={`armory-reel-${vReel}`}>
                {renderIsoCylinder({
                  deckNumber: d,
                  u: 0.335,
                  v: vReel,
                  rx: 5.5,
                  ry: 2.8,
                  zTop: 5,
                  bodyFill: "color-mix(in srgb, var(--theme-dawn) 26%, var(--theme-bg))",
                  topFill: "var(--theme-cockpit-elevated)",
                  stroke: "var(--theme-dawn)",
                  ringColor: "var(--theme-secondary)",
                })}
                <ellipse
                  cx={rTop.x}
                  cy={rTop.y}
                  rx={2.8}
                  ry={1.4}
                  fill="none"
                  stroke="var(--theme-dawn)"
                  strokeWidth={0.85}
                />
              </g>
            );
          })}

          {/* Styyrpuurin puoli: avoin harjoittelu- ja pukeutumismatto sekä penkki */}
          <polygon
            points={isoQuad(d, 0.27, 0.342, 0.055, 0.245, 0.9)}
            fill="color-mix(in srgb, var(--theme-accent) 16%, var(--theme-cockpit-elevated))"
            stroke="var(--theme-accent)"
            strokeWidth={1.1}
          />
          <polygon
            points={isoQuad(d, 0.282, 0.33, 0.08, 0.22, 1.0)}
            fill="none"
            stroke="var(--theme-dawn)"
            strokeWidth={0.85}
            strokeDasharray="4 3"
          />
          {renderIsoBox({
            deckNumber: d,
            u0: 0.348,
            u1: 0.358,
            v0: 0.08,
            v1: 0.23,
            zBase: 0,
            zTop: 2.6,
            topFill: "color-mix(in srgb, var(--theme-dawn) 20%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: zone.u0 + 0.023,
            v0: 0.06,
            v1: 0.14,
            zBase: 0,
            zTop: 5.2,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
        </g>
      );
    }

    case "hvac": {
      const drumCoords: readonly [number, number][] = [
        [uC - 0.015, -0.255],
        [uC + 0.015, -0.135],
        [uC + 0.042, -0.255],
      ];

      return (
        <g data-room-detail="hvac" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Suodatinpankki keulapuolella neljine suodatinripoineen */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.012,
            u1: zone.u0 + 0.043,
            v0: -0.305,
            v1: -0.085,
            zBase: 0,
            zTop: 8.5,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}
          {[-0.278, -0.224, -0.17, -0.116].map((vFin) => (
            <line
              key={`hvac-filter-fin-${vFin}`}
              {...isoLine(d, zone.u0 + 0.017, vFin, zone.u0 + 0.038, vFin, 8.9, 8.9)}
              stroke="var(--theme-secondary)"
              strokeWidth={1.1}
            />
          ))}

          {/* Kanavalinja suodattimilta runkolinjaan */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.045,
            u1: zone.u1 - 0.01,
            v0: -0.22,
            v1: -0.17,
            zBase: 2,
            zTop: 6.8,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 20%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-cockpit-border)",
          })}

          {/* Kolme ~2.8 metrin pyörivää ilmapesurirumpua turbiinisiipineen */}
          {drumCoords.map(([uDrum, vDrum]) => {
            const c = projectDeckPoint(d, uDrum, vDrum, "single", 8.5);
            return (
              <g key={`hvac-drum-${uDrum}-${vDrum}`}>
                {renderIsoCylinder({
                  deckNumber: d,
                  u: uDrum,
                  v: vDrum,
                  rx: 10.5,
                  ry: 5.3,
                  zTop: 8.5,
                  bodyFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))",
                  topFill:
                    "color-mix(in srgb, var(--theme-secondary) 32%, var(--theme-cockpit-elevated))",
                  stroke: "var(--theme-secondary)",
                  ringColor: "var(--theme-dawn)",
                })}
                <line
                  x1={c.x - 6.2}
                  y1={c.y}
                  x2={c.x + 6.2}
                  y2={c.y}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.05}
                />
                <line
                  x1={c.x}
                  y1={c.y - 3.1}
                  x2={c.x}
                  y2={c.y + 3.1}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.05}
                />
                <line
                  x1={c.x - 4.6}
                  y1={c.y - 2.2}
                  x2={c.x + 4.6}
                  y2={c.y + 2.2}
                  stroke="var(--theme-secondary)"
                  strokeWidth={0.95}
                />
                <line
                  x1={c.x - 4.6}
                  y1={c.y + 2.2}
                  x2={c.x + 4.6}
                  y2={c.y - 2.2}
                  stroke="var(--theme-secondary)"
                  strokeWidth={0.95}
                />
              </g>
            );
          })}

          {/* Kolme manuaalista meripihkanväristä paineenkäsipyörää puolapuineen */}
          {[-0.285, -0.195, -0.105].map((vWheel) => {
            const wPt = projectDeckPoint(d, zone.u1 - 0.019, vWheel, "single", 5.5);
            return (
              <g key={`hvac-wheel-${vWheel}`}>
                {renderIsoCylinder({
                  deckNumber: d,
                  u: zone.u1 - 0.019,
                  v: vWheel,
                  rx: 4.5,
                  ry: 2.3,
                  zTop: 5.5,
                  bodyFill: "var(--theme-cockpit-surface)",
                  topFill: "var(--theme-dawn)",
                  stroke: "var(--theme-dawn)",
                })}
                <line
                  x1={wPt.x - 3.2}
                  y1={wPt.y}
                  x2={wPt.x + 3.2}
                  y2={wPt.y}
                  stroke="var(--theme-bg)"
                  strokeWidth={0.95}
                />
                <line
                  x1={wPt.x}
                  y1={wPt.y - 1.6}
                  x2={wPt.x}
                  y2={wPt.y + 1.6}
                  stroke="var(--theme-bg)"
                  strokeWidth={0.95}
                />
              </g>
            );
          })}
        </g>
      );
    }

    case "archive": {
      const rackCols = [-0.306, -0.284, -0.262, -0.24, -0.218];
      const mutedStroke = muted ? "var(--theme-accent)" : "var(--theme-border-medium)";

      return (
        <g data-room-detail="archive" pointerEvents="none" opacity={muted ? 0.8 : 0.95}>
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Keulan turvaeteinen väliseinineen, tarkastuspöytineen ja suojakaappeineen */}
          {renderInteriorPartition({
            key: "archive-vestibule",
            deckNumber: d,
            u0: -0.318,
            v0: zone.v0,
            u1: -0.318,
            v1: zone.v1,
            height: 9.5,
            stroke: mutedStroke,
            hasDoorGap: true,
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: -0.326,
            v0: 0.085,
            v1: 0.165,
            zBase: 0,
            zTop: 4.5,
            topFill: "color-mix(in srgb, var(--theme-accent) 20%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: mutedStroke,
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: -0.328,
            v0: 0.215,
            v1: 0.295,
            zBase: 0,
            zTop: 8.5,
            topFill: "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-bg))",
            frontFill: "var(--theme-bg)",
            sideFill: "var(--theme-hull-shadow)",
            stroke: mutedStroke,
            dashed: true,
          })}

          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [-0.312, 0.19],
              [zone.u1 - 0.01, 0.19],
            ],
            z: 0.9,
            coreColor: mutedStroke,
            width: 1.4,
          })}

          {/* 5 x 2 = 10 kapeaa arkistomonoliittia tiukasti v: 0.085..0.295 sisällä */}
          {rackCols.map((uCol) => (
            <g key={`arch-col-${uCol}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: uCol,
                u1: uCol + 0.013,
                v0: 0.085,
                v1: 0.165,
                zBase: 0,
                zTop: 10.5,
                topFill:
                  "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-surface))",
                frontFill: "var(--theme-bg)",
                sideFill: "var(--theme-hull-shadow)",
                stroke: mutedStroke,
                dashed: true,
              })}
              {[0.11, 0.14].map((vTape) => (
                <line
                  key={`arch-a-tape-${uCol}-${vTape}`}
                  {...isoLine(d, uCol + 0.002, vTape, uCol + 0.011, vTape, 10.8, 10.8)}
                  stroke={mutedStroke}
                  strokeWidth={0.8}
                />
              ))}
              {renderIsoBox({
                deckNumber: d,
                u0: uCol,
                u1: uCol + 0.013,
                v0: 0.215,
                v1: 0.295,
                zBase: 0,
                zTop: 10.5,
                topFill:
                  "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-surface))",
                frontFill: "var(--theme-bg)",
                sideFill: "var(--theme-hull-shadow)",
                stroke: mutedStroke,
                dashed: true,
              })}
              {[0.24, 0.27].map((vTape) => (
                <line
                  key={`arch-b-tape-${uCol}-${vTape}`}
                  {...isoLine(d, uCol + 0.002, vTape, uCol + 0.011, vTape, 10.8, 10.8)}
                  stroke={mutedStroke}
                  strokeWidth={0.8}
                />
              ))}
            </g>
          ))}
        </g>
      );
    }

    case "reactor": {
      const reactorCoreU = 0.032;
      const reactorCoreV = -0.228;
      const pitCenterGlow = projectDeckPoint(d, reactorCoreU, reactorCoreV, "single", 11.7);

      return (
        <g data-room-detail="reactor" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Keulan säteilysuojattu valvontakoppi */}
          {renderInteriorPartition({
            key: "reactor-shield-wall",
            deckNumber: d,
            u0: -0.048,
            v0: zone.v0,
            u1: -0.048,
            v1: zone.v1,
            height: 9.5,
            stroke: "var(--theme-dawn)",
            hasDoorGap: true,
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.01,
            u1: -0.06,
            v0: -0.265,
            v1: -0.145,
            zBase: 0,
            zTop: 4.5,
            topFill: "color-mix(in srgb, var(--theme-dawn) 24%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-dawn)",
          })}
          <circle
            cx={projectDeckPoint(d, -0.072, -0.205, "single", 5).x}
            cy={projectDeckPoint(d, -0.072, -0.205, "single", 5).y}
            r={1.8}
            fill={statusAccent}
          />

          {/* Jäähdytysputket reaktorista perään kohti konehuonetta */}
          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [reactorCoreU + 0.016, -0.252],
              [zone.u1 - 0.008, -0.252],
            ],
            z: 2.4,
            coreColor: "var(--theme-secondary)",
            width: 2.8,
          })}
          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [reactorCoreU + 0.016, -0.205],
              [zone.u1 - 0.008, -0.205],
            ],
            z: 2.4,
            coreColor: statusAccent,
            width: 2.2,
          })}

          {/* Fuusiotoruksen suojakaivanto ja reaktoriydin */}
          <polygon
            points={isoQuad(d, -0.026, 0.09, -0.302, -0.154, 0.8)}
            fill={`color-mix(in srgb, ${statusAccent} 16%, var(--theme-bg))`}
            stroke={statusAccent}
            strokeWidth={1.15}
            strokeDasharray="4 2"
          />
          {[-0.02, 0.084].map((uTick) => (
            <line
              key={`reactor-pit-tick-${uTick}`}
              {...isoLine(d, uTick, -0.296, uTick, -0.275, 1.1, 1.1)}
              stroke="var(--theme-dawn)"
              strokeWidth={1.4}
            />
          ))}
          {renderIsoCylinder({
            deckNumber: d,
            u: reactorCoreU,
            v: reactorCoreV,
            rx: 16,
            ry: 8.2,
            zTop: 11.5,
            bodyFill: `color-mix(in srgb, ${statusAccent} 26%, var(--theme-bg))`,
            topFill: `color-mix(in srgb, ${statusAccent} 34%, var(--theme-cockpit-elevated))`,
            stroke: statusAccent,
            ringColor: "var(--theme-dawn)",
            strokeWidth: 1.2,
          })}
          <ellipse
            cx={pitCenterGlow.x}
            cy={pitCenterGlow.y}
            rx={6.5}
            ry={3.3}
            fill="var(--theme-bg)"
            stroke="var(--theme-dawn)"
            strokeWidth={1}
          />

          {/* Kaksi jäähdytysripoista vaihemuunninta toruksen molemmin puolin */}
          {[-0.039, 0.098].map((uConv) => (
            <g key={`reactor-conv-${uConv}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: uConv,
                u1: uConv + 0.026,
                v0: -0.285,
                v1: -0.185,
                zBase: 0,
                zTop: 8.2,
                topFill: "color-mix(in srgb, var(--theme-dawn) 26%, var(--theme-cockpit-elevated))",
                frontFill: `color-mix(in srgb, ${statusAccent} 18%, var(--theme-bg))`,
                sideFill: "var(--theme-cockpit-surface)",
                stroke: "var(--theme-dawn)",
              })}
              {[-0.27, -0.246, -0.222, -0.198].map((vFin) => (
                <line
                  key={`conv-fin-${uConv}-${vFin}`}
                  {...isoLine(d, uConv + 0.004, vFin, uConv + 0.022, vFin, 8.6, 8.6)}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1}
                />
              ))}
            </g>
          ))}

          {/* Viisi deuterium- ja vesikiertosäiliötä tasolasiraidoineen */}
          {[-0.032, 0, 0.032, 0.064, 0.096].map((uTank) => (
            <g key={`reactor-tank-${uTank}`}>
              {renderIsoCylinder({
                deckNumber: d,
                u: uTank,
                v: -0.105,
                rx: 6.0,
                ry: 3.1,
                zTop: 8.0,
                bodyFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))",
                topFill:
                  "color-mix(in srgb, var(--theme-secondary) 32%, var(--theme-cockpit-elevated))",
                stroke: "var(--theme-secondary)",
                ringColor: "var(--theme-dawn)",
              })}
              <line
                {...isoLine(d, uTank + 0.005, -0.105, uTank + 0.005, -0.105, 1.5, 7.2)}
                stroke="var(--theme-dawn)"
                strokeWidth={1.25}
              />
            </g>
          ))}
        </g>
      );
    }

    case "shafts": {
      const mutedStroke = muted ? "var(--theme-accent)" : "var(--theme-border-medium)";
      const hatchUs = [-0.098, -0.049, 0, 0.049, 0.098];

      return (
        <g data-room-detail="shafts" pointerEvents="none" opacity={muted ? 0.8 : 0.94}>
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u0 + 0.015, 0.092],
              [zone.u1 - 0.015, 0.092],
            ],
            z: 0.9,
            coreColor: mutedStroke,
            width: 1.5,
          })}

          {/* Syvä X-tuettu huoltokaivanto ja viisi huoltokuiluluukkua v: 0.05..0.34 sisällä */}
          <polygon
            points={isoQuad(d, zone.u0 + 0.018, zone.u1 - 0.018, 0.135, 0.295, 0.6)}
            fill="var(--theme-hull-shadow)"
            stroke={mutedStroke}
            strokeDasharray="4 2"
            strokeWidth={1.1}
          />
          <line
            {...isoLine(d, zone.u0 + 0.022, 0.14, zone.u1 - 0.022, 0.29, 0.6, 0.6)}
            stroke="var(--theme-cockpit-border-soft)"
            strokeWidth={1}
          />
          <line
            {...isoLine(d, zone.u0 + 0.022, 0.29, zone.u1 - 0.022, 0.14, 0.6, 0.6)}
            stroke="var(--theme-cockpit-border-soft)"
            strokeWidth={1}
          />
          {hatchUs.map((uHatch) => (
            <g key={`shaft-hatch-${uHatch}`}>
              {renderIsoCylinder({
                deckNumber: d,
                u: uHatch,
                v: 0.215,
                rx: 9.5,
                ry: 4.8,
                zBase: -1.8,
                zTop: 1.4,
                bodyFill: "var(--theme-bg)",
                topFill:
                  "color-mix(in srgb, var(--theme-accent) 18%, var(--theme-cockpit-surface))",
                stroke: mutedStroke,
                ringColor: "var(--theme-dawn)",
              })}
              <line
                {...isoLine(d, uHatch - 0.006, 0.205, uHatch - 0.006, 0.225, 1.7, 1.7)}
                stroke="var(--theme-dawn)"
                strokeWidth={1.05}
              />
              <line
                {...isoLine(d, uHatch + 0.006, 0.205, uHatch + 0.006, 0.225, 1.7, 1.7)}
                stroke="var(--theme-dawn)"
                strokeWidth={1.05}
              />
            </g>
          ))}
        </g>
      );
    }

    case "engine": {
      const catwalkU0 = zone.u0 + 0.014;
      const catwalkU1 = 0.348;

      return (
        <g data-room-detail="engine" pointerEvents="none">
          {renderRoomFloorDecking({ deckNumber: d, zone, pattern: "grating" })}

          {/* Jäähdytysputket moottoriturbiineihin */}
          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u0 + 0.052, 0],
              [uC - 0.01, -0.205],
              [zone.u1 - 0.015, -0.205],
            ],
            z: 2.2,
            coreColor: "var(--theme-dawn)",
            width: 2.2,
          })}
          {renderConduitPipe({
            deckNumber: d,
            pointsUv: [
              [zone.u0 + 0.052, 0],
              [uC - 0.01, 0.205],
              [zone.u1 - 0.015, 0.205],
            ],
            z: 2.2,
            coreColor: "var(--theme-dawn)",
            width: 2.2,
          })}

          {/* Etuseinän apukytkin ja kiertovesipumppuyksikkö */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.012,
            u1: zone.u0 + 0.026,
            v0: -0.265,
            v1: -0.15,
            zBase: 0,
            zTop: 7.4,
            topFill: "color-mix(in srgb, var(--theme-accent) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-accent)",
          })}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.012,
            u1: zone.u0 + 0.026,
            v0: 0.15,
            v1: 0.265,
            zBase: 0,
            zTop: 7.4,
            topFill:
              "color-mix(in srgb, var(--theme-secondary) 22%, var(--theme-cockpit-elevated))",
            frontFill: "var(--theme-cockpit-surface)",
            sideFill: "var(--theme-bg)",
            stroke: "var(--theme-secondary)",
          })}

          {/* Kaksi päätyöntöturbiinia kompressorirenkaineen peräsuuttimien linjalla */}
          {[-0.205, 0.205].map((vCore) => (
            <g key={`engine-turbine-${vCore}`}>
              {renderIsoBox({
                deckNumber: d,
                u0: 0.302,
                u1: zone.u1 - 0.014,
                v0: vCore - 0.062,
                v1: vCore + 0.062,
                zBase: 0,
                zTop: 10.5,
                topFill: `color-mix(in srgb, ${statusAccent} 28%, var(--theme-cockpit-elevated))`,
                frontFill: `color-mix(in srgb, ${statusAccent} 18%, var(--theme-bg))`,
                sideFill: "var(--theme-cockpit-surface)",
                stroke: statusAccent,
                strokeWidth: 1.1,
              })}
              {[0.324, 0.364, 0.404].map((uRing) => (
                <line
                  key={`engine-ring-${vCore}-${uRing}`}
                  {...isoLine(d, uRing, vCore - 0.056, uRing, vCore + 0.056, 10.8, 10.8)}
                  stroke="var(--theme-dawn)"
                  strokeWidth={1.15}
                  opacity={0.85}
                />
              ))}
              {renderIsoCylinder({
                deckNumber: d,
                u: 0.372,
                v: vCore,
                rx: 12,
                ry: 6,
                zBase: 10.5,
                zTop: 13.5,
                bodyFill: `color-mix(in srgb, ${statusAccent} 30%, var(--theme-bg))`,
                topFill: `color-mix(in srgb, var(--theme-dawn) 32%, ${statusAccent})`,
                stroke: "var(--theme-dawn)",
                ringColor: statusAccent,
              })}
            </g>
          ))}

          {/* Korotettu keskihoitosilta ja sen kaide */}
          <polygon
            points={isoQuad(d, catwalkU0, catwalkU1, -0.068, 0.068, 2.2)}
            fill="color-mix(in srgb, var(--theme-cockpit-elevated) 78%, var(--theme-bg))"
            stroke="var(--theme-dawn)"
            strokeWidth={1}
          />
          {[-0.066, 0.066].map((vRail) => (
            <line
              key={`engine-catwalk-rail-${vRail}`}
              {...isoLine(d, catwalkU0 + 0.004, vRail, catwalkU1 - 0.004, vRail, 5.4, 5.4)}
              stroke="var(--theme-cockpit-border)"
              strokeWidth={1}
            />
          ))}

          {/* Ihmismittakaavainen Kilven kolvattu ohjainlevykonsoli hoitosillalla + juotostäpät */}
          {renderIsoBox({
            deckNumber: d,
            u0: zone.u0 + 0.023,
            u1: zone.u0 + 0.039,
            v0: -0.042,
            v1: 0.042,
            zBase: 2.2,
            zTop: 6.4,
            topFill: "color-mix(in srgb, var(--theme-dawn) 36%, var(--theme-cockpit-elevated))",
            frontFill: "color-mix(in srgb, var(--theme-dawn) 20%, var(--theme-bg))",
            sideFill: "var(--theme-cockpit-surface)",
            stroke: "var(--theme-dawn)",
            strokeWidth: 1.2,
          })}
          <line
            {...isoLine(d, zone.u0 + 0.026, -0.03, zone.u0 + 0.036, 0.03, 6.7, 6.7)}
            stroke="var(--theme-secondary)"
            strokeWidth={1.2}
          />
          <line
            {...isoLine(d, zone.u0 + 0.036, -0.03, zone.u0 + 0.026, 0.03, 6.7, 6.7)}
            stroke="var(--theme-dawn)"
            strokeWidth={1.2}
          />
          {[
            [zone.u0 + 0.026, -0.03],
            [zone.u0 + 0.036, -0.03],
            [zone.u0 + 0.026, 0.03],
            [zone.u0 + 0.036, 0.03],
          ].map(([uPad, vPad]) => {
            const padPt = projectDeckPoint(d, uPad, vPad, "single", 6.7);
            return (
              <circle
                key={`engine-pad-${uPad}-${vPad}`}
                cx={padPt.x}
                cy={padPt.y}
                r={1.4}
                fill="var(--theme-secondary)"
              />
            );
          })}

          {/* Perän keskitasain ja lämmönvaihdin */}
          {renderIsoCylinder({
            deckNumber: d,
            u: zone.u1 - 0.036,
            v: 0,
            rx: 10.5,
            ry: 5.5,
            zTop: 8.5,
            bodyFill: "color-mix(in srgb, var(--theme-secondary) 24%, var(--theme-bg))",
            topFill: "var(--theme-secondary)",
            stroke: "var(--theme-secondary)",
            ringColor: "var(--theme-dawn)",
          })}
        </g>
      );
    }

    default:
      return null;
  }
}
