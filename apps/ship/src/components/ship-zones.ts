export type ShipDoorSide = "fore" | "aft" | "port" | "starboard";

export type ShipPropKind =
  | "bridge"
  | "stealth"
  | "logs"
  | "captain"
  | "mess"
  | "galley"
  | "dormitory"
  | "hangar"
  | "breach"
  | "medbay"
  | "armory"
  | "engine"
  | "reactor"
  | "hvac"
  | "archive"
  | "shafts"
  | "wing";

export interface IsoPoint {
  x: number;
  y: number;
}

export interface NormalizedRect {
  u0: number;
  u1: number;
  v0: number;
  v1: number;
}

export interface DeckSpec {
  deckNumber: 1 | 2 | 3 | 4;
  code: string;
  shortTab: string;
  title: string;
  label: string;
  subtitle: string;
  lengthFactor: number;
  beamFactor: number;
  offsetU: number;
  hasPortBreach?: boolean;
  hasThrusters?: boolean;
}

export interface CabinWingSpec extends NormalizedRect {
  wingId: string;
  wingKey: "a" | "b" | "c" | "d";
  code: string;
  title: string;
  subtitle: string;
  deckNumber: 1 | 2 | 3;
  cabinCount: number;
  cols: number;
  rows: number;
  doorSide: ShipDoorSide;
}

export interface ShipZoneSpec extends NormalizedRect {
  id: string;
  deckNumber: 1 | 2 | 3 | 4;
  kind: "facility" | "sealed" | "wing";
  doorSide: ShipDoorSide;
  propKind: ShipPropKind;
  defaultLabel: string;
  wingId?: string;
}

export interface WingCabinLayout extends NormalizedRect {
  roomKey: string;
  code: string;
  doorSide: "port" | "starboard";
  wcSide: "fore" | "aft";
}

export interface ExtrudedWallFace {
  points: IsoPoint[];
  shade: "dark" | "mid" | "lit";
  layer: "back" | "front";
  hasDoorGap: boolean;
  side: ShipDoorSide;
  edgeStart: IsoPoint;
  edgeEnd: IsoPoint;
}

export interface HudPillMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
  badgeWidth: number;
  textX: number;
}

export type AuxiliarySectorKind =
  | "cabin-grid"
  | "cargo-bay"
  | "cic-bays"
  | "tank-bank"
  | "workshop"
  | "med-lab"
  | "radiators"
  | "escape-pods"
  | "airlocks"
  | "bow-array"
  | "shield-baffle";

export interface AuxiliaryDeckSector extends NormalizedRect {
  id: string;
  deckNumber: 1 | 2 | 3 | 4;
  label: string;
  sublabel?: string;
  kind: AuxiliarySectorKind;
  cols?: number;
  rows?: number;
}

export interface DeckSelectorCardBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerY: number;
  connectorX: number;
}

export const HULL_LENGTH_METERS = 150;

export function rectLengthMeters(rect: NormalizedRect): number {
  return Number(((rect.u1 - rect.u0) * HULL_LENGTH_METERS).toFixed(1));
}

export const SVG_VIEWBOX_WIDTH = 1160;
export const SVG_VIEWBOX_HEIGHT = 760;

export const OVERVIEW_CENTER_X = 672;
export const OVERVIEW_TOP_Y = 112;
export const OVERVIEW_DECK_STEP_Y = 178;

export const SINGLE_CENTER_X = 580;
export const SINGLE_CENTER_Y = 390;

export function formatCabinCode(key: string): string {
  const match = /^cabin-([a-z])(\d+)$/i.exec(key);
  if (match?.[1] && match[2]) {
    return `${match[1].toUpperCase()}-${match[2].padStart(2, "0")}`;
  }
  return key.replace(/^(cabin-|hytti-)/i, "").toUpperCase();
}

const TIGHT_OVERVIEW_ZONE_IDS = new Set(["d1-bridge", "d1-stealth", "d3-breach", "d3-medbay"]);

/**
 * Formats a custom room name to fit inside isometric SVG pill bounds without
 * colliding with neighbouring zones or clocks badges. Full names remain in ARIA
 * labels, hover footers, and inspector sheets.
 */
export function formatZoneMapLabel(
  rawLabel: string,
  mode: "overview" | "single",
  hasBadge = false,
  zoneId?: string,
): string {
  const clean = rawLabel.trim().replace(/\s+/g, " ");
  const overviewBadgeMax = zoneId && TIGHT_OVERVIEW_ZONE_IDS.has(zoneId) ? 9 : 14;
  const maxChars = mode === "overview" ? (hasBadge ? overviewBadgeMax : 18) : hasBadge ? 22 : 26;
  if (clean.length <= maxChars) return clean;
  const sliced = clean
    .slice(0, maxChars - 1)
    .trimEnd()
    .replace(/[-,.:]+$/, "");
  return `${sliced}…`;
}

export function getRoomStatusPillTone(room: {
  isLocked: boolean;
  statusTone: string;
}): "secondary" | "dawn" | "alert" | "accent" {
  if (room.isLocked || room.statusTone === "locked") return "accent";
  if (room.statusTone === "critical") return "alert";
  if (room.statusTone === "warning") return "dawn";
  return "secondary";
}

export function getRoomStatusRowTone(room: {
  isLocked: boolean;
  statusTone: string;
  isOwn?: boolean;
}): "normal" | "active" | "dawn" | "warning" | "locked" {
  if (room.isOwn) return "active";
  if (room.isLocked || room.statusTone === "locked") return "locked";
  if (room.statusTone === "critical") return "warning";
  if (room.statusTone === "warning") return "dawn";
  return "normal";
}

export const DECK_SPECS: readonly DeckSpec[] = [
  {
    deckNumber: 1,
    code: "Kansi 1",
    shortTab: "Kansi 1",
    title: "Yläkansi",
    label: "Kansi 1: Yläkansi",
    subtitle: "Komento, kuuntelu ja siipi A",
    lengthFactor: 0.86,
    beamFactor: 0.84,
    offsetU: -0.02,
  },
  {
    deckNumber: 2,
    code: "Kansi 2",
    shortTab: "Kansi 2",
    title: "Asuinkannet",
    label: "Kansi 2: Asuinkannet",
    subtitle: "Messi, muona ja siivet B ja C",
    lengthFactor: 0.96,
    beamFactor: 0.96,
    offsetU: 0,
  },
  {
    deckNumber: 3,
    code: "Kansi 3",
    shortTab: "Kansi 3",
    title: "Sukkulahalli",
    label: "Kansi 3: Sukkulahalli",
    subtitle: "Sukkula, sairastupa ja siipi D",
    lengthFactor: 1,
    beamFactor: 1,
    offsetU: 0.01,
    hasPortBreach: true,
  },
  {
    deckNumber: 4,
    code: "Kansi 4",
    shortTab: "Kansi 4",
    title: "Konehuone",
    label: "Kansi 4: Konehuone",
    subtitle: "Reaktori ja ajojärjestelmät",
    lengthFactor: 0.92,
    beamFactor: 0.88,
    offsetU: 0.03,
    hasThrusters: true,
  },
];

export const DECK_SPEC_MAP: Record<number, DeckSpec> = Object.fromEntries(
  DECK_SPECS.map((deck) => [deck.deckNumber, deck]),
);

export const CABIN_WINGS: readonly CabinWingSpec[] = [
  {
    wingId: "d1-wing-a",
    wingKey: "a",
    code: "A",
    title: "Siipi A · Kansi 1",
    subtitle: "6 asuinhuonetta",
    deckNumber: 1,
    cabinCount: 6,
    cols: 3,
    rows: 2,
    u0: -0.155,
    u1: -0.025,
    v0: 0.05,
    v1: 0.32,
    doorSide: "port",
  },
  {
    wingId: "d2-wing-b",
    wingKey: "b",
    code: "B",
    title: "Siipi B · Kansi 2",
    subtitle: "12 asuinhuonetta",
    deckNumber: 2,
    cabinCount: 12,
    cols: 6,
    rows: 2,
    u0: -0.155,
    u1: 0.085,
    v0: -0.34,
    v1: -0.05,
    doorSide: "starboard",
  },
  {
    wingId: "d2-wing-c",
    wingKey: "c",
    code: "C",
    title: "Siipi C · Kansi 2",
    subtitle: "12 asuinhuonetta",
    deckNumber: 2,
    cabinCount: 12,
    cols: 6,
    rows: 2,
    u0: -0.155,
    u1: 0.085,
    v0: 0.05,
    v1: 0.34,
    doorSide: "port",
  },
  {
    wingId: "d3-wing-d",
    wingKey: "d",
    code: "D",
    title: "Siipi D · Kansi 3",
    subtitle: "10 asuinhuonetta",
    deckNumber: 3,
    cabinCount: 10,
    cols: 5,
    rows: 2,
    u0: -0.155,
    u1: 0.045,
    v0: 0.05,
    v1: 0.34,
    doorSide: "port",
  },
];

export const CABIN_WING_MAP: Record<string, CabinWingSpec> = Object.fromEntries(
  CABIN_WINGS.map((wing) => [wing.wingId, wing]),
);

export const SHIP_ZONES: readonly ShipZoneSpec[] = [
  // Kansi 1: Yläkansi
  {
    id: "d1-bridge",
    deckNumber: 1,
    kind: "facility",
    u0: -0.38,
    u1: -0.26,
    v0: -0.15,
    v1: 0.15,
    doorSide: "aft",
    propKind: "bridge",
    defaultLabel: "Komentosilta",
  },
  {
    id: "d1-stealth",
    deckNumber: 1,
    kind: "facility",
    u0: -0.155,
    u1: 0.01,
    v0: -0.33,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "stealth",
    defaultLabel: "Kuunteluasema",
  },
  {
    id: "d1-wing-a",
    deckNumber: 1,
    kind: "wing",
    u0: -0.155,
    u1: -0.025,
    v0: 0.05,
    v1: 0.32,
    doorSide: "port",
    propKind: "wing",
    defaultLabel: "Siipi A",
    wingId: "d1-wing-a",
  },
  {
    id: "d1-captain",
    deckNumber: 1,
    kind: "facility",
    u0: 0.255,
    u1: 0.375,
    v0: -0.31,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "captain",
    defaultLabel: "Kapteenin hytti",
  },
  {
    id: "d1-logs",
    deckNumber: 1,
    kind: "facility",
    u0: 0.255,
    u1: 0.375,
    v0: 0.05,
    v1: 0.3,
    doorSide: "port",
    propKind: "logs",
    defaultLabel: "Lokiholvi",
  },

  // Kansi 2: Asuinkannet
  {
    id: "d2-mess",
    deckNumber: 2,
    kind: "facility",
    u0: -0.355,
    u1: -0.195,
    v0: -0.34,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "mess",
    defaultLabel: "Messi",
  },
  {
    id: "d2-galley-stores",
    deckNumber: 2,
    kind: "facility",
    u0: -0.335,
    u1: -0.195,
    v0: 0.05,
    v1: 0.31,
    doorSide: "port",
    propKind: "galley",
    defaultLabel: "Muonavarasto",
  },
  {
    id: "d2-wing-b",
    deckNumber: 2,
    kind: "wing",
    u0: -0.155,
    u1: 0.085,
    v0: -0.34,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "wing",
    defaultLabel: "Siipi B",
    wingId: "d2-wing-b",
  },
  {
    id: "d2-wing-c",
    deckNumber: 2,
    kind: "wing",
    u0: -0.155,
    u1: 0.085,
    v0: 0.05,
    v1: 0.34,
    doorSide: "port",
    propKind: "wing",
    defaultLabel: "Siipi C",
    wingId: "d2-wing-c",
  },
  {
    id: "d2-sealed-dorm",
    deckNumber: 2,
    kind: "sealed",
    u0: 0.255,
    u1: 0.435,
    v0: -0.34,
    v1: 0.34,
    doorSide: "fore",
    propKind: "dormitory",
    defaultLabel: "Suljettu siipi",
  },

  // Kansi 3: Hangaari & sairastupa
  {
    id: "d3-breach",
    deckNumber: 3,
    kind: "facility",
    u0: -0.385,
    u1: -0.205,
    v0: -0.45,
    v1: -0.27,
    doorSide: "aft",
    propKind: "breach",
    defaultLabel: "Kylkivaurio",
  },
  {
    id: "d3-hangar",
    deckNumber: 3,
    kind: "facility",
    u0: -0.385,
    u1: -0.195,
    v0: 0.05,
    v1: 0.44,
    doorSide: "port",
    propKind: "hangar",
    defaultLabel: "Sukkulahalli",
  },
  {
    id: "d3-medbay",
    deckNumber: 3,
    kind: "facility",
    u0: -0.155,
    u1: -0.035,
    v0: -0.31,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "medbay",
    defaultLabel: "Sairastupa",
  },
  {
    id: "d3-wing-d",
    deckNumber: 3,
    kind: "wing",
    u0: -0.155,
    u1: 0.045,
    v0: 0.05,
    v1: 0.34,
    doorSide: "port",
    propKind: "wing",
    defaultLabel: "Siipi D",
    wingId: "d3-wing-d",
  },
  {
    id: "d3-armory",
    deckNumber: 3,
    kind: "facility",
    u0: 0.255,
    u1: 0.385,
    v0: -0.29,
    v1: 0.29,
    doorSide: "fore",
    propKind: "armory",
    defaultLabel: "Varustamo",
  },

  // Kansi 4: Konehuone & syväjärjestelmät
  {
    id: "d4-hvac",
    deckNumber: 4,
    kind: "facility",
    u0: -0.355,
    u1: -0.195,
    v0: -0.33,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "hvac",
    defaultLabel: "Ilmanvaihto",
  },
  {
    id: "d4-sealed-archive",
    deckNumber: 4,
    kind: "sealed",
    u0: -0.355,
    u1: -0.195,
    v0: 0.05,
    v1: 0.33,
    doorSide: "port",
    propKind: "archive",
    defaultLabel: "Laiva-arkisto",
  },
  {
    id: "d4-reactor",
    deckNumber: 4,
    kind: "facility",
    u0: -0.095,
    u1: 0.135,
    v0: -0.34,
    v1: -0.05,
    doorSide: "starboard",
    propKind: "reactor",
    defaultLabel: "Reaktori",
  },
  {
    id: "d4-sealed-shafts",
    deckNumber: 4,
    kind: "sealed",
    u0: -0.145,
    u1: 0.135,
    v0: 0.05,
    v1: 0.34,
    doorSide: "port",
    propKind: "shafts",
    defaultLabel: "Huoltokuilut",
  },
  {
    id: "d4-engine",
    deckNumber: 4,
    kind: "facility",
    u0: 0.255,
    u1: 0.45,
    v0: -0.34,
    v1: 0.34,
    doorSide: "fore",
    propKind: "engine",
    defaultLabel: "Konehuone",
  },
];

export const AUXILIARY_DECK_SECTORS: readonly AuxiliaryDeckSector[] = [
  // Kansi 1: Yläkansi
  {
    id: "aux-d1-bow-sensors",
    deckNumber: 1,
    label: "Keula-anturit",
    kind: "bow-array",
    u0: -0.455,
    u1: -0.39,
    v0: -0.155,
    v1: 0.155,
  },
  {
    id: "aux-d1-port-radiator",
    deckNumber: 1,
    label: "Häivejäähdytin P",
    kind: "radiators",
    u0: -0.382,
    u1: -0.205,
    v0: -0.41,
    v1: -0.17,
  },
  {
    id: "aux-d1-stbd-radiator",
    deckNumber: 1,
    label: "Häivejäähdytin S",
    kind: "radiators",
    u0: -0.382,
    u1: -0.205,
    v0: 0.17,
    v1: 0.41,
  },
  {
    id: "aux-d1-cic",
    deckNumber: 1,
    label: "Viestikeskus",
    kind: "cic-bays",
    u0: 0.04,
    u1: 0.205,
    v0: -0.33,
    v1: -0.05,
  },
  {
    id: "aux-d1-quarters-a2",
    deckNumber: 1,
    label: "Majoitus A2",
    kind: "cabin-grid",
    cols: 6,
    rows: 2,
    u0: 0.005,
    u1: 0.205,
    v0: 0.05,
    v1: 0.32,
  },
  {
    id: "aux-d1-escape-port",
    deckNumber: 1,
    label: "Pelastuskapselit P",
    kind: "escape-pods",
    u0: -0.145,
    u1: 0.205,
    v0: -0.432,
    v1: -0.362,
  },
  {
    id: "aux-d1-escape-stbd",
    deckNumber: 1,
    label: "Pelastuskapselit S",
    kind: "escape-pods",
    u0: -0.145,
    u1: 0.205,
    v0: 0.335,
    v1: 0.425,
  },
  {
    id: "aux-d1-aft-buoys",
    deckNumber: 1,
    label: "Poijuasema",
    kind: "bow-array",
    u0: 0.385,
    u1: 0.445,
    v0: -0.28,
    v1: 0.28,
  },

  // Kansi 2: Asuinkannet
  {
    id: "aux-d2-water",
    deckNumber: 2,
    label: "Vesivarannot",
    kind: "tank-bank",
    u0: -0.435,
    u1: -0.365,
    v0: -0.26,
    v1: 0.26,
  },
  {
    id: "aux-d2-quarters-b2",
    deckNumber: 2,
    label: "Majoitus B2",
    kind: "cabin-grid",
    cols: 4,
    rows: 2,
    u0: 0.118,
    u1: 0.208,
    v0: -0.34,
    v1: -0.05,
  },
  {
    id: "aux-d2-quarters-c2",
    deckNumber: 2,
    label: "Majoitus C2",
    kind: "cabin-grid",
    cols: 4,
    rows: 2,
    u0: 0.118,
    u1: 0.208,
    v0: 0.05,
    v1: 0.34,
  },
  {
    id: "aux-d2-lifeboats-port",
    deckNumber: 2,
    label: "Pelastusveneet P",
    kind: "escape-pods",
    u0: -0.34,
    u1: 0.205,
    v0: -0.43,
    v1: -0.362,
  },
  {
    id: "aux-d2-lifeboats-stbd",
    deckNumber: 2,
    label: "Pelastusveneet S",
    kind: "escape-pods",
    u0: -0.33,
    u1: 0.205,
    v0: 0.355,
    v1: 0.425,
  },

  // Kansi 3: Hangaari & sairastupa
  {
    id: "aux-d3-bow-locks",
    deckNumber: 3,
    label: "Keulasulut",
    kind: "airlocks",
    u0: -0.445,
    u1: -0.395,
    v0: -0.22,
    v1: 0.22,
  },
  {
    id: "aux-d3-breach-seals",
    deckNumber: 3,
    label: "Hätälaipiot",
    kind: "shield-baffle",
    u0: -0.385,
    u1: -0.205,
    v0: -0.25,
    v1: -0.05,
  },
  {
    id: "aux-d3-med-lab",
    deckNumber: 3,
    label: "Karanteeni ja labra",
    kind: "med-lab",
    u0: -0.005,
    u1: 0.085,
    v0: -0.31,
    v1: -0.05,
  },
  {
    id: "aux-d3-cargo-hold",
    deckNumber: 3,
    label: "Rahtiruuma 1",
    kind: "cargo-bay",
    u0: 0.095,
    u1: 0.208,
    v0: -0.33,
    v1: -0.05,
  },
  {
    id: "aux-d3-workshop",
    deckNumber: 3,
    label: "Konepaja ja D2",
    kind: "workshop",
    u0: 0.076,
    u1: 0.208,
    v0: 0.05,
    v1: 0.34,
  },
  {
    id: "aux-d3-port-stores",
    deckNumber: 3,
    label: "Runkovarastot",
    kind: "cargo-bay",
    u0: -0.145,
    u1: 0.205,
    v0: -0.432,
    v1: -0.362,
  },
  {
    id: "aux-d3-stbd-clamps",
    deckNumber: 3,
    label: "Telakkasulut",
    kind: "airlocks",
    u0: -0.145,
    u1: 0.205,
    v0: 0.355,
    v1: 0.425,
  },
  {
    id: "aux-d3-aft-eva",
    deckNumber: 3,
    label: "Ulkosulku",
    kind: "airlocks",
    u0: 0.395,
    u1: 0.45,
    v0: -0.27,
    v1: 0.27,
  },

  // Kansi 4: Konehuone & syväjärjestelmät
  {
    id: "aux-d4-bow-thrusters",
    deckNumber: 4,
    label: "Keulapotkurit",
    kind: "tank-bank",
    u0: -0.44,
    u1: -0.365,
    v0: -0.25,
    v1: 0.25,
  },
  {
    id: "aux-d4-rad-shield",
    deckNumber: 4,
    label: "Säteilysulku",
    kind: "shield-baffle",
    u0: -0.15,
    u1: -0.103,
    v0: -0.34,
    v1: -0.05,
  },
  {
    id: "aux-d4-fuel-port",
    deckNumber: 4,
    label: "Polttoainesäiliöt",
    kind: "tank-bank",
    u0: 0.166,
    u1: 0.208,
    v0: -0.34,
    v1: -0.05,
  },
  {
    id: "aux-d4-coolant-stbd",
    deckNumber: 4,
    label: "Jäähdytysvaranto",
    kind: "tank-bank",
    u0: 0.166,
    u1: 0.208,
    v0: 0.05,
    v1: 0.34,
  },
  {
    id: "aux-d4-keel-bat-port",
    deckNumber: 4,
    label: "Runkoakusto P",
    kind: "cic-bays",
    u0: -0.34,
    u1: 0.205,
    v0: -0.432,
    v1: -0.362,
  },
  {
    id: "aux-d4-keel-bat-stbd",
    deckNumber: 4,
    label: "Runkoakusto S",
    kind: "cic-bays",
    u0: -0.34,
    u1: 0.205,
    v0: 0.352,
    v1: 0.425,
  },
];

export const VERTICAL_SHAFTS = [
  { id: "shaft-fore", label: "Kuilu A", u: -0.175, v: 0, uHalf: 0.016, vHalf: 0.026 },
  { id: "shaft-aft", label: "Kuilu B", u: 0.235, v: 0, uHalf: 0.016, vHalf: 0.026 },
] as const;

export const MAIN_CORRIDORS: readonly NormalizedRect[] = [
  // Keskikäytävä keulasta perään kuilujen läpi
  { u0: -0.355, u1: 0.255, v0: -0.034, v1: 0.034 },
  // Poikittaiskäytävä etukuilun kohdalla
  { u0: -0.195, u1: -0.155, v0: -0.34, v1: 0.34 },
  // Poikittaiskäytävä peräkuilun kohdalla
  { u0: 0.215, u1: 0.255, v0: -0.34, v1: 0.34 },
];

export function getDeckCorridorRects(deckNumber: number): NormalizedRect[] {
  const spineStartU = deckNumber === 1 ? -0.26 : deckNumber === 3 ? -0.385 : -0.355;
  const spineEndU = deckNumber === 1 ? 0.38 : 0.255;
  const foreCrossV0 = deckNumber === 3 ? -0.35 : -0.34;
  const corridors: NormalizedRect[] = [
    { u0: spineStartU, u1: spineEndU, v0: -0.034, v1: 0.034 },
    { u0: -0.195, u1: -0.155, v0: foreCrossV0, v1: 0.34 },
    { u0: 0.215, u1: 0.255, v0: -0.34, v1: 0.34 },
  ];

  if (deckNumber === 1) {
    corridors.push(
      { u0: 0.01, u1: 0.032, v0: -0.33, v1: -0.034 },
      { u0: -0.025, u1: -0.003, v0: 0.034, v1: 0.32 },
    );
  } else if (deckNumber === 2) {
    corridors.push({ u0: 0.085, u1: 0.11, v0: -0.34, v1: 0.34 });
  } else if (deckNumber === 3) {
    corridors.push(
      { u0: -0.035, u1: -0.013, v0: -0.31, v1: -0.034 },
      { u0: 0.045, u1: 0.068, v0: 0.034, v1: 0.34 },
    );
  } else if (deckNumber === 4) {
    corridors.push({ u0: 0.135, u1: 0.16, v0: -0.34, v1: 0.34 });
  }

  return corridors;
}

export function projectOverviewPoint(deckNumber: number, u: number, v: number, z = 0): IsoPoint {
  const deck = DECK_SPEC_MAP[deckNumber] ?? DECK_SPECS[0];
  const length = 740 * deck.lengthFactor;
  const beamDepth = 102 * deck.beamFactor;
  const skewX = 28 * deck.beamFactor;
  const cy = OVERVIEW_TOP_Y + (deckNumber - 1) * OVERVIEW_DECK_STEP_Y;

  return {
    x: OVERVIEW_CENTER_X + (u + deck.offsetU) * length + v * skewX,
    y: cy + v * beamDepth - z,
  };
}

export function projectSingleDeckPoint(_deckNumber: number, u: number, v: number, z = 0): IsoPoint {
  return {
    x: SINGLE_CENTER_X + u * 940 + v * 72,
    y: SINGLE_CENTER_Y + v * 456 - z,
  };
}

export function getDeckSelectorCardBounds(deckNumber: number): DeckSelectorCardBounds {
  const cy = OVERVIEW_TOP_Y + (deckNumber - 1) * OVERVIEW_DECK_STEP_Y;
  const width = 228;
  const height = 54;
  const x = 20;
  return {
    x,
    y: cy - height / 2,
    width,
    height,
    centerY: cy,
    connectorX: x + width,
  };
}

export function projectDeckPoint(
  deckNumber: number,
  u: number,
  v: number,
  mode: "overview" | "single",
  z = 0,
): IsoPoint {
  return mode === "overview"
    ? projectOverviewPoint(deckNumber, u, v, z)
    : projectSingleDeckPoint(deckNumber, u, v, z);
}

export function buildDeckHullPolygon(
  deckNumber: number,
  mode: "overview" | "single",
  z = 0,
  hasPortBreach?: boolean,
): IsoPoint[] {
  const deck = DECK_SPEC_MAP[deckNumber];
  const activePortBreach = hasPortBreach ?? Boolean(deck?.hasPortBreach);

  if (mode === "overview") {
    const portEdge: Array<[number, number]> = activePortBreach
      ? [
          [-0.44, -0.48],
          [-0.4, -0.48],
          [-0.36, -0.36],
          [-0.31, -0.41],
          [-0.25, -0.35],
          [-0.21, -0.48],
          [0.44, -0.48],
        ]
      : [
          [-0.44, -0.48],
          [0.44, -0.48],
        ];

    const outlineUv: Array<[number, number]> = [
      [-0.53, 0],
      [-0.48, -0.27],
      ...portEdge,
      [0.5, -0.36],
      [0.5, 0.36],
      [0.44, 0.48],
      [-0.44, 0.48],
      [-0.48, 0.27],
    ];

    return outlineUv.map(([u, v]) => projectDeckPoint(deckNumber, u, v, mode, z));
  }

  const singlePortEdge: Array<[number, number]> = activePortBreach
    ? [
        [-0.435, -0.475],
        [-0.415, -0.475],
        [-0.365, -0.355],
        [-0.312, -0.405],
        [-0.252, -0.352],
        [-0.215, -0.475],
        [-0.195, -0.475],
        [-0.175, -0.458],
        [-0.155, -0.475],
        [0.215, -0.475],
        [0.235, -0.458],
        [0.255, -0.475],
        [0.435, -0.475],
      ]
    : [
        [-0.435, -0.475],
        [-0.195, -0.475],
        [-0.175, -0.458],
        [-0.155, -0.475],
        [0.215, -0.475],
        [0.235, -0.458],
        [0.255, -0.475],
        [0.435, -0.475],
      ];

  const singleSternEdge: Array<[number, number]> = deck?.hasThrusters
    ? [
        [0.495, -0.37],
        [0.495, -0.295],
        [0.475, -0.295],
        [0.475, -0.185],
        [0.495, -0.185],
        [0.495, 0.185],
        [0.475, 0.185],
        [0.475, 0.295],
        [0.495, 0.295],
        [0.495, 0.37],
      ]
    : [
        [0.505, -0.36],
        [0.505, 0.36],
      ];

  const outlineUv: Array<[number, number]> = [
    [-0.545, 0],
    [-0.512, -0.14],
    [-0.472, -0.31],
    ...singlePortEdge,
    ...singleSternEdge,
    [0.435, 0.475],
    [0.255, 0.475],
    [0.235, 0.458],
    [0.215, 0.475],
    [-0.155, 0.475],
    [-0.175, 0.458],
    [-0.195, 0.475],
    [-0.435, 0.475],
    [-0.472, 0.31],
    [-0.512, 0.14],
  ];

  return outlineUv.map(([u, v]) => projectDeckPoint(deckNumber, u, v, mode, z));
}

export function buildDeckInnerHullPolygon(
  deckNumber: number,
  z = 0,
  hasPortBreach?: boolean,
): IsoPoint[] {
  const deck = DECK_SPEC_MAP[deckNumber];
  const activePortBreach = hasPortBreach ?? Boolean(deck?.hasPortBreach);

  const innerPortEdge: Array<[number, number]> = activePortBreach
    ? [
        [-0.422, -0.451],
        [-0.42, -0.451],
        [-0.368, -0.332],
        [-0.312, -0.382],
        [-0.252, -0.33],
        [-0.208, -0.451],
        [-0.195, -0.451],
        [-0.175, -0.44],
        [-0.155, -0.451],
        [0.215, -0.451],
        [0.235, -0.44],
        [0.255, -0.451],
        [0.428, -0.451],
      ]
    : [
        [-0.422, -0.451],
        [-0.195, -0.451],
        [-0.175, -0.44],
        [-0.155, -0.451],
        [0.215, -0.451],
        [0.235, -0.44],
        [0.255, -0.451],
        [0.428, -0.451],
      ];

  const innerSternEdge: Array<[number, number]> = deck?.hasThrusters
    ? [
        [0.472, -0.352],
        [0.472, -0.31],
        [0.454, -0.31],
        [0.454, -0.172],
        [0.472, -0.172],
        [0.472, 0.172],
        [0.454, 0.172],
        [0.454, 0.31],
        [0.472, 0.31],
        [0.472, 0.352],
      ]
    : [
        [0.481, -0.344],
        [0.481, 0.344],
      ];

  const innerUv: Array<[number, number]> = [
    [-0.514, 0],
    [-0.486, -0.128],
    [-0.448, -0.292],
    ...innerPortEdge,
    ...innerSternEdge,
    [0.428, 0.451],
    [0.255, 0.451],
    [0.235, 0.44],
    [0.215, 0.451],
    [-0.155, 0.451],
    [-0.175, 0.44],
    [-0.195, 0.451],
    [-0.422, 0.451],
    [-0.448, 0.292],
    [-0.486, 0.128],
  ];

  return innerUv.map(([u, v]) => projectDeckPoint(deckNumber, u, v, "single", z));
}

export function buildZonePolygon(
  deckNumber: number,
  rect: NormalizedRect,
  mode: "overview" | "single",
  z = 0,
): IsoPoint[] {
  const corners: Array<[number, number]> = [
    [rect.u0, rect.v0],
    [rect.u1, rect.v0],
    [rect.u1, rect.v1],
    [rect.u0, rect.v1],
  ];
  return corners.map(([u, v]) => projectDeckPoint(deckNumber, u, v, mode, z));
}

function splitWallForDoor(
  pA: IsoPoint,
  pB: IsoPoint,
  hasDoorGap: boolean,
): Array<[IsoPoint, IsoPoint]> {
  if (!hasDoorGap) {
    return [[pA, pB]];
  }
  const lerp = (t: number): IsoPoint => ({
    x: pA.x + (pB.x - pA.x) * t,
    y: pA.y + (pB.y - pA.y) * t,
  });
  return [
    [pA, lerp(0.35)],
    [lerp(0.65), pB],
  ];
}

export function buildExtrudedWalls(
  deckNumber: number,
  rect: NormalizedRect,
  mode: "overview" | "single",
  wallHeight: number,
  doorSide?: ShipDoorSide,
): ExtrudedWallFace[] {
  const aftWallHeight = Math.max(6, Math.round(wallHeight * 0.5));
  const frontCutawayHeight = Math.max(4, Math.round(wallHeight * 0.28));
  const sides: Array<{
    side: ShipDoorSide;
    uvA: [number, number];
    uvB: [number, number];
    height: number;
    shade: "dark" | "mid" | "lit";
    layer: "back" | "front";
  }> = [
    // Takalaipiot (piirretään sisäkalusteiden taakse)
    {
      side: "port",
      uvA: [rect.u0, rect.v0],
      uvB: [rect.u1, rect.v0],
      height: wallHeight,
      shade: "lit",
      layer: "back",
    },
    {
      side: "fore",
      uvA: [rect.u0, rect.v0],
      uvB: [rect.u0, rect.v1],
      height: Math.round(wallHeight * 0.86),
      shade: "mid",
      layer: "back",
    },
    // Etummaiset leikkausseinät (piirretään sisäkalusteiden eteen)
    {
      side: "aft",
      uvA: [rect.u1, rect.v0],
      uvB: [rect.u1, rect.v1],
      height: aftWallHeight,
      shade: "mid",
      layer: "front",
    },
    {
      side: "starboard",
      uvA: [rect.u0, rect.v1],
      uvB: [rect.u1, rect.v1],
      height: frontCutawayHeight,
      shade: "dark",
      layer: "front",
    },
  ];

  const faces: ExtrudedWallFace[] = [];

  for (const wall of sides) {
    const baseA = projectDeckPoint(deckNumber, wall.uvA[0], wall.uvA[1], mode, 0);
    const baseB = projectDeckPoint(deckNumber, wall.uvB[0], wall.uvB[1], mode, 0);
    const hasDoorGap = doorSide === wall.side;
    const segments = splitWallForDoor(baseA, baseB, hasDoorGap);

    for (const [segA, segB] of segments) {
      const topA = { x: segA.x, y: segA.y - wall.height };
      const topB = { x: segB.x, y: segB.y - wall.height };
      faces.push({
        points: [segA, segB, topB, topA],
        shade: wall.shade,
        layer: wall.layer,
        hasDoorGap,
        side: wall.side,
        edgeStart: topA,
        edgeEnd: topB,
      });
    }
  }

  return faces;
}

export function getWingCorridorRect(wing: CabinWingSpec): NormalizedRect {
  const midV = (wing.v0 + wing.v1) / 2;
  const halfGap = 0.016;
  return {
    u0: wing.u0,
    u1: wing.u1,
    v0: midV - halfGap,
    v1: midV + halfGap,
  };
}

export function buildWingCabinLayouts(wing: CabinWingSpec): WingCabinLayout[] {
  const padU = 0.005;
  const padV = 0.008;
  const gapU = 0.004;
  const corridorGapV = 0.034;

  const usableU = wing.u1 - wing.u0 - padU * 2 - gapU * (wing.cols - 1);
  const cabinU = usableU / wing.cols;

  const midV = (wing.v0 + wing.v1) / 2;
  const row0V0 = wing.v0 + padV;
  const row0V1 = midV - corridorGapV / 2;
  const row1V0 = midV + corridorGapV / 2;
  const row1V1 = wing.v1 - padV;

  const layouts: WingCabinLayout[] = [];

  for (let i = 0; i < wing.cabinCount; i++) {
    const row = Math.floor(i / wing.cols);
    const col = i % wing.cols;
    const u0 = wing.u0 + padU + col * (cabinU + gapU);
    const u1 = u0 + cabinU;
    const v0 = row === 0 ? row0V0 : row1V0;
    const v1 = row === 0 ? row0V1 : row1V1;
    const doorSide: "port" | "starboard" = row === 0 ? "starboard" : "port";
    const wcSide: "fore" | "aft" = col % 2 === 0 ? "fore" : "aft";
    const num = String(i + 1).padStart(2, "0");

    layouts.push({
      roomKey: `cabin-${wing.wingKey}${num}`,
      code: `${wing.code}-${num}`,
      u0,
      u1,
      v0,
      v1,
      doorSide,
      wcSide,
    });
  }

  return layouts;
}

export function polygonCentroid(points: IsoPoint[]): IsoPoint {
  if (points.length === 0) return { x: 0, y: 0 };
  const sum = points.reduce((acc, pt) => ({ x: acc.x + pt.x, y: acc.y + pt.y }), { x: 0, y: 0 });
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}

export function polygonTopAnchor(points: IsoPoint[], offsetY = 12): IsoPoint {
  if (points.length === 0) return { x: 0, y: 0 };
  const centroid = polygonCentroid(points);
  let minY = points[0].y;
  for (const pt of points) {
    if (pt.y < minY) minY = pt.y;
  }
  return {
    x: centroid.x,
    y: minY - offsetY,
  };
}

export function polygonInnerHeaderAnchor(
  deckNumber: number,
  rect: NormalizedRect,
  mode: "overview" | "single",
): IsoPoint {
  const uMid = (rect.u0 + rect.u1) / 2;
  const vDepth = rect.v1 - rect.v0;
  const vAnchor = rect.v0 + Math.min(0.056, vDepth * 0.25);
  return projectDeckPoint(deckNumber, uMid, vAnchor, mode, 10);
}

export interface WallDoorwaySpec {
  start: IsoPoint;
  end: IsoPoint;
  center: IsoPoint;
  uvStart: [number, number];
  uvEnd: [number, number];
}

export function getZoneDoorwaySegment(
  deckNumber: number,
  rect: NormalizedRect,
  doorSide: ShipDoorSide,
  mode: "overview" | "single",
  z = 0,
): WallDoorwaySpec {
  const edgeUv: Record<ShipDoorSide, [[number, number], [number, number]]> = {
    port: [
      [rect.u0, rect.v0],
      [rect.u1, rect.v0],
    ],
    starboard: [
      [rect.u0, rect.v1],
      [rect.u1, rect.v1],
    ],
    fore: [
      [rect.u0, rect.v0],
      [rect.u0, rect.v1],
    ],
    aft: [
      [rect.u1, rect.v0],
      [rect.u1, rect.v1],
    ],
  };

  const [uvA, uvB] = edgeUv[doorSide];
  const lerpUv = (t: number): [number, number] => [
    uvA[0] + (uvB[0] - uvA[0]) * t,
    uvA[1] + (uvB[1] - uvA[1]) * t,
  ];
  const uvStart = lerpUv(0.35);
  const uvEnd = lerpUv(0.65);
  const uvCenter = lerpUv(0.5);

  return {
    start: projectDeckPoint(deckNumber, uvStart[0], uvStart[1], mode, z),
    end: projectDeckPoint(deckNumber, uvEnd[0], uvEnd[1], mode, z),
    center: projectDeckPoint(deckNumber, uvCenter[0], uvCenter[1], mode, z),
    uvStart,
    uvEnd,
  };
}

export function getCabinBadgeAnchors(
  deckNumber: number,
  cabin: WingCabinLayout,
  hasOccupant: boolean,
): { codeAnchor: IsoPoint; initialsAnchor: IsoPoint } {
  const uMid = (cabin.u0 + cabin.u1) / 2;
  const vSpan = cabin.v1 - cabin.v0;

  if (!hasOccupant) {
    const codeV =
      cabin.doorSide === "starboard" ? cabin.v1 - vSpan * 0.24 : cabin.v0 + vSpan * 0.24;
    const codeAnchor = projectDeckPoint(deckNumber, uMid, codeV, "single", 2);
    return { codeAnchor, initialsAnchor: codeAnchor };
  }

  const codeAnchor = projectDeckPoint(deckNumber, uMid, cabin.v0 + vSpan * 0.22, "single", 2);
  const initialsAnchor = projectDeckPoint(deckNumber, uMid, cabin.v1 - vSpan * 0.22, "single", 2);
  return { codeAnchor, initialsAnchor };
}

export function getSingleDeckShaftLabelAnchor(
  deckNumber: number,
  shaft: (typeof VERTICAL_SHAFTS)[number],
): IsoPoint {
  return projectDeckPoint(deckNumber, shaft.u, -0.068, "single", 6);
}

export function getSingleDeckCompassAnchors(deckNumber: number): {
  bow: IsoPoint;
  stern: IsoPoint;
  port: IsoPoint;
  starboard: IsoPoint;
} {
  return {
    bow: projectDeckPoint(deckNumber, -0.548, -0.17, "single", 2),
    stern: projectDeckPoint(deckNumber, 0.552, 0, "single", 2),
    port: projectDeckPoint(deckNumber, -0.34, -0.525, "single", 2),
    starboard: projectDeckPoint(deckNumber, -0.34, 0.535, "single", 2),
  };
}

export function getWingListButtonAnchor(wing: CabinWingSpec): IsoPoint {
  const uMid = (wing.u0 + wing.u1) / 2;
  const vAnchor = wing.v0 < 0 ? -0.508 : 0.512;
  return projectDeckPoint(wing.deckNumber, uMid, vAnchor, "single", 4);
}

export function estimateHudPillMetrics(opts: {
  x: number;
  y: number;
  label: string;
  badgeText?: string;
  fontSize?: number;
}): HudPillMetrics {
  const fontSize = opts.fontSize ?? 12.5;
  const charWidth = fontSize * 0.56;
  const sidePad = fontSize <= 9.5 ? 3.5 : fontSize <= 11.5 ? 6 : 9;
  const badgeWidth = opts.badgeText ? opts.badgeText.length * (fontSize * 0.54) + 12 : 0;
  const minWidth = fontSize <= 9.5 ? 22 : fontSize <= 10.5 ? 28 : fontSize <= 11.5 ? 38 : 60;
  const width = Math.max(minWidth, opts.label.length * charWidth + sidePad * 2 + badgeWidth);
  const height = Math.round(fontSize + (fontSize <= 9.5 ? 5 : fontSize <= 11.5 ? 7 : 10));
  const left = opts.x - width / 2;
  const top = opts.y - height / 2;
  const textX = opts.badgeText ? opts.x - badgeWidth / 2 + 2 : opts.x;

  return {
    x: opts.x,
    y: opts.y,
    width,
    height,
    left,
    top,
    right: left + width,
    bottom: top + height,
    badgeWidth,
    textX,
  };
}

export function polygonToPointsAttr(points: IsoPoint[]): string {
  return points.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
}
