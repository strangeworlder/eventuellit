export type CompassDir = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface ConnectionNode {
  direction: CompassDir;
  type?: "station" | "marker";
  shape?: 12 | "swirl";
}

/**
 * Station connection map. Keys are station titles as they appear in frontmatter.
 * Values are maps of neighbor title → { direction, type?, shape? }.
 *
 * "type: marker" entries are non-navigable d12 shapes (no tooltip, no click).
 * Marker keys use the prefix "_marker_" and are never matched against real stations.
 */
export const stationConnections: Record<string, Record<string, ConnectionNode>> = {
  Seula: {
    Syke: { direction: "N" },
    Verso: { direction: "E" },
    Pesä: { direction: "NE" },
    Kuiskaus: { direction: "SE" },
    Alasin: { direction: "W" },
    Louhos: { direction: "SW" },
    Häkki: { direction: "S" },
    _marker_nw: { direction: "NW", type: "marker", shape: 12 },
  },
  Syke: {
    Seula: { direction: "S" },
    Akseli: { direction: "W" },
    Katedraali: { direction: "E" },
  },
  Verso: {
    Seula: { direction: "W" },
    Pesä: { direction: "N" },
    Kuiskaus: { direction: "SE" },
  },
  Alasin: {
    Seula: { direction: "E" },
    Evoluutio: { direction: "S" },
    Laki: { direction: "SW" },
  },
  Louhos: {
    Seula: { direction: "NE" },
    Laki: { direction: "SE" },
  },
  Akseli: {
    Syke: { direction: "E" },
    Katedraali: { direction: "SE" },
    Häkki: { direction: "S" },
  },
  Katedraali: {
    Syke: { direction: "W" },
    Akseli: { direction: "NW" },
    Verkko: { direction: "E" },
    Pesä: { direction: "S" },
    Ikoni: { direction: "N" },
    Pöytä: { direction: "SW" },
  },
  Pesä: {
    Seula: { direction: "SW" },
    Katedraali: { direction: "N" },
    Pöytä: { direction: "SE" },
    Verso: { direction: "E" },
  },
  Kilpi: {
    Pöytä: { direction: "NW" },
    Siemen: { direction: "N" },
    _marker_se: { direction: "SE", type: "marker", shape: "swirl" },
  },
  Kuiskaus: {
    Seula: { direction: "NW" },
    Verso: { direction: "N" },
    Siemen: { direction: "E" },
    Krypta: { direction: "S" },
  },
  Evoluutio: {
    Alasin: { direction: "N" },
    Siemen: { direction: "E" },
    Tori: { direction: "W" },
  },
  Laki: {
    Alasin: { direction: "NE" },
    Tori: { direction: "E" },
    Louhos: { direction: "N" },
    Vaaka: { direction: "NW" },
    Häkki: { direction: "W" },
  },
  Vaaka: {
    Laki: { direction: "S" },
    Verkko: { direction: "N" },
  },
  Häkki: {
    Seula: { direction: "N" },
    Akseli: { direction: "NE" },
    Laki: { direction: "E" },
    Verkko: { direction: "SE" },
  },
  Verkko: {
    Katedraali: { direction: "W" },
    Häkki: { direction: "SW" },
    Vaaka: { direction: "S" },
  },
  Ikoni: {
    Katedraali: { direction: "S" },
  },
  Pöytä: {
    Katedraali: { direction: "NE" },
    Pesä: { direction: "NW" },
    Kilpi: { direction: "SE" },
  },
  Siemen: {
    Kilpi: { direction: "S" },
    Kuiskaus: { direction: "W" },
    Krypta: { direction: "SW" },
    Evoluutio: { direction: "NW" },
  },
  Krypta: {
    Siemen: { direction: "NE" },
    Kuiskaus: { direction: "N" },
  },
  Tori: {
    Evoluutio: { direction: "E" },
    Laki: { direction: "W" },
    _marker_se: { direction: "SE", type: "marker", shape: 12 },
  },
};
