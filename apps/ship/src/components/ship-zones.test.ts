import { describe, expect, it } from "vitest";
import { computeHullRevealBounds } from "./IsometricShipCanvas";
import {
  AUXILIARY_DECK_SECTORS,
  buildDeckHullPolygon,
  buildDeckInnerHullPolygon,
  buildWingCabinLayouts,
  buildZonePolygon,
  CABIN_WING_MAP,
  DECK_SPECS,
  estimateHudPillMetrics,
  formatZoneMapLabel,
  getCabinBadgeAnchors,
  getDeckCorridorRects,
  getDeckSelectorCardBounds,
  getRoomStatusPillTone,
  getRoomStatusRowTone,
  getSingleDeckCompassAnchors,
  getSingleDeckShaftLabelAnchor,
  getWingListButtonAnchor,
  getZoneDoorwaySegment,
  type IsoPoint,
  polygonCentroid,
  polygonInnerHeaderAnchor,
  projectDeckPoint,
  rectLengthMeters,
  SHIP_ZONES,
  SVG_VIEWBOX_HEIGHT,
  SVG_VIEWBOX_WIDTH,
  VERTICAL_SHAFTS,
} from "./ship-zones";

interface BoxItem {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function findOverlaps(items: BoxItem[], margin = 1): string[] {
  const overlaps: string[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (!a || !b) continue;
      const separated =
        a.right + margin <= b.left ||
        b.right + margin <= a.left ||
        a.bottom + margin <= b.top ||
        b.bottom + margin <= a.top;
      if (!separated) {
        overlaps.push(`${a.id} <-> ${b.id}`);
      }
    }
  }
  return overlaps;
}

function pointInPolygon(pt: IsoPoint, poly: IsoPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const pi = poly[i];
    const pj = poly[j];
    if (!pi || !pj) continue;
    const intersects =
      pi.y > pt.y !== pj.y > pt.y && pt.x < ((pj.x - pi.x) * (pt.y - pi.y)) / (pj.y - pi.y) + pi.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function polygonBounds(points: IsoPoint[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

describe("ship-zones horizontal 2.5D projection geometry", () => {
  it("keeps overview deck hulls, deck selector cards, and shaft markers well separated inside viewBox", () => {
    const deckBoxes: Array<{ deckNumber: number; minY: number; maxY: number }> = [];

    for (const deck of DECK_SPECS) {
      const hullTop = buildDeckHullPolygon(deck.deckNumber, "overview", 0);
      const hullBase = buildDeckHullPolygon(deck.deckNumber, "overview", -10);
      const bounds = polygonBounds([...hullTop, ...hullBase]);
      const card = getDeckSelectorCardBounds(deck.deckNumber);

      // Left column deck selector cards sit clear of hull bow
      expect(card.x).toBeGreaterThanOrEqual(16);
      expect(card.connectorX).toBeLessThan(bounds.minX - 20);
      expect(card.y).toBeGreaterThanOrEqual(40);
      expect(card.y + card.height).toBeLessThanOrEqual(SVG_VIEWBOX_HEIGHT - 60);

      // Hull lies strictly inside canvas margins
      expect(bounds.maxX).toBeLessThanOrEqual(SVG_VIEWBOX_WIDTH - 20);
      expect(bounds.minY).toBeGreaterThanOrEqual(50);
      expect(bounds.maxY).toBeLessThanOrEqual(SVG_VIEWBOX_HEIGHT - 40);

      deckBoxes.push({ deckNumber: deck.deckNumber, minY: bounds.minY, maxY: bounds.maxY });
    }

    for (let i = 0; i < deckBoxes.length - 1; i++) {
      const upper = deckBoxes[i];
      const lower = deckBoxes[i + 1];
      expect(upper && lower).toBeTruthy();
      if (upper && lower) {
        expect(lower.minY - upper.maxY).toBeGreaterThanOrEqual(50);
      }
    }
  });

  it("produces zero pill collisions across all 4 decks in overview mode", () => {
    const pills: BoxItem[] = [];

    for (const shaft of VERTICAL_SHAFTS) {
      const anchor = projectDeckPoint(1, shaft.u, -0.46, "overview", 14);
      const m = estimateHudPillMetrics({
        x: anchor.x,
        y: anchor.y,
        label: shaft.label,
        fontSize: 12,
      });
      pills.push({ id: shaft.id, left: m.left, top: m.top, right: m.right, bottom: m.bottom });
    }

    for (const zone of SHIP_ZONES) {
      const poly = buildZonePolygon(zone.deckNumber, zone, "overview");
      const center = polygonCentroid(poly);
      const badgeText =
        zone.kind === "wing" ? "10/12" : zone.kind === "sealed" ? "Lukittu" : undefined;
      const m = estimateHudPillMetrics({
        x: center.x,
        y: center.y - 2,
        label: zone.defaultLabel,
        badgeText,
        fontSize: 12.5,
      });

      expect(m.left).toBeGreaterThanOrEqual(240);
      expect(m.right).toBeLessThanOrEqual(SVG_VIEWBOX_WIDTH - 20);
      expect(m.top).toBeGreaterThanOrEqual(45);
      expect(m.bottom).toBeLessThanOrEqual(SVG_VIEWBOX_HEIGHT - 36);

      pills.push({ id: zone.id, left: m.left, top: m.top, right: m.right, bottom: m.bottom });
    }

    expect(findOverlaps(pills)).toEqual([]);
  });

  it("produces zero pill or badge collisions in single-deck cutaway mode across decks 1..4", () => {
    for (const deck of DECK_SPECS) {
      const items: BoxItem[] = [];
      const deckZones = SHIP_ZONES.filter((z) => z.deckNumber === deck.deckNumber);

      // Compass direction labels
      const compass = getSingleDeckCompassAnchors(deck.deckNumber);
      const compassSpecs = [
        { id: "dir-keula", pt: compass.bow, label: "Keula" },
        { id: "dir-pera", pt: compass.stern, label: "Perä" },
        { id: "dir-paapuuri", pt: compass.port, label: "Paapuuri" },
        { id: "dir-styyrpuuri", pt: compass.starboard, label: "Styyrpuuri" },
      ];
      for (const dir of compassSpecs) {
        const m = estimateHudPillMetrics({
          x: dir.pt.x,
          y: dir.pt.y,
          label: dir.label,
          fontSize: 12.5,
        });
        items.push({ id: dir.id, left: m.left, top: m.top, right: m.right, bottom: m.bottom });
      }

      if (deck.hasThrusters) {
        for (const vPlume of [-0.24, 0.24]) {
          const plumeCenter = projectDeckPoint(deck.deckNumber, 0.56, vPlume, "single", 2);
          items.push({
            id: `thruster-plume-${vPlume}`,
            left: plumeCenter.x - 42,
            top: plumeCenter.y - 10,
            right: plumeCenter.x + 42,
            bottom: plumeCenter.y + 10,
          });
        }
      }

      for (const shaft of VERTICAL_SHAFTS) {
        const shaftAnchor = getSingleDeckShaftLabelAnchor(deck.deckNumber, shaft);
        const plaqueLeft = shaftAnchor.x - 26;
        const plaqueTop = shaftAnchor.y - 8.5;
        items.push({
          id: `${shaft.id}-single`,
          left: plaqueLeft,
          top: plaqueTop,
          right: plaqueLeft + 52,
          bottom: plaqueTop + 17,
        });
      }

      for (const zone of deckZones) {
        if (zone.kind === "wing" && zone.wingId) {
          const wing = CABIN_WING_MAP[zone.wingId];
          expect(wing).toBeDefined();
          if (!wing) continue;

          const wingAnchor = getWingListButtonAnchor(wing);
          const wingBtn = estimateHudPillMetrics({
            x: wingAnchor.x,
            y: wingAnchor.y,
            label: `Siipi ${wing.code} · Hyttilista`,
            badgeText: "10/12",
            fontSize: 13,
          });
          expect(wingBtn.top).toBeGreaterThanOrEqual(45);
          expect(wingBtn.bottom).toBeLessThanOrEqual(SVG_VIEWBOX_HEIGHT - 36);
          items.push({
            id: `${zone.id}-list`,
            left: wingBtn.left,
            top: wingBtn.top,
            right: wingBtn.right,
            bottom: wingBtn.bottom,
          });

          const cabins = buildWingCabinLayouts(wing);
          for (const cabin of cabins) {
            const { codeAnchor, initialsAnchor } = getCabinBadgeAnchors(
              deck.deckNumber,
              cabin,
              true,
            );
            const codePill = estimateHudPillMetrics({
              x: codeAnchor.x,
              y: codeAnchor.y,
              label: cabin.code,
              fontSize: 9.5,
            });
            const initialsPill = estimateHudPillMetrics({
              x: initialsAnchor.x,
              y: initialsAnchor.y,
              label: "KK",
              fontSize: 9,
            });
            items.push({
              id: `${cabin.roomKey}-code`,
              left: codePill.left,
              top: codePill.top,
              right: codePill.right,
              bottom: codePill.bottom,
            });
            items.push({
              id: `${cabin.roomKey}-init`,
              left: initialsPill.left,
              top: initialsPill.top,
              right: initialsPill.right,
              bottom: initialsPill.bottom,
            });
          }
          continue;
        }

        const anchor = polygonInnerHeaderAnchor(deck.deckNumber, zone, "single");
        const m = estimateHudPillMetrics({
          x: anchor.x,
          y: anchor.y,
          label: zone.defaultLabel,
          badgeText: zone.kind === "sealed" ? "Lukittu" : "2 kelloa",
          fontSize: 12.5,
        });
        expect(m.left).toBeGreaterThanOrEqual(20);
        expect(m.right).toBeLessThanOrEqual(SVG_VIEWBOX_WIDTH - 20);
        expect(m.top).toBeGreaterThanOrEqual(45);
        expect(m.bottom).toBeLessThanOrEqual(SVG_VIEWBOX_HEIGHT - 36);
        items.push({ id: zone.id, left: m.left, top: m.top, right: m.right, bottom: m.bottom });
      }

      expect(findOverlaps(items)).toEqual([]);
    }
  });

  it("calibrates room dimensions to 150 m ship proportions without overlapping auxiliary sectors", () => {
    const medbay = SHIP_ZONES.find((zone) => zone.id === "d3-medbay");
    expect(medbay).toBeDefined();
    if (medbay) {
      const medbayLength = rectLengthMeters(medbay);
      expect(medbayLength).toBeGreaterThanOrEqual(15);
      expect(medbayLength).toBeLessThanOrEqual(21);
    }

    for (const wing of Object.values(CABIN_WING_MAP)) {
      const layouts = buildWingCabinLayouts(wing);
      for (const cabin of layouts) {
        const cabinLength = rectLengthMeters(cabin);
        expect(cabinLength).toBeGreaterThanOrEqual(4.5);
        expect(cabinLength).toBeLessThanOrEqual(6.5);
      }
    }

    const overlapsUv = (
      a: { u0: number; u1: number; v0: number; v1: number },
      b: { u0: number; u1: number; v0: number; v1: number },
      eps = 1e-6,
    ) => a.u0 < b.u1 - eps && a.u1 > b.u0 + eps && a.v0 < b.v1 - eps && a.v1 > b.v0 + eps;

    for (const deck of DECK_SPECS) {
      const auxSectors = AUXILIARY_DECK_SECTORS.filter(
        (sector) => sector.deckNumber === deck.deckNumber,
      );
      expect(auxSectors.length).toBeGreaterThanOrEqual(5);

      const deckZones = SHIP_ZONES.filter((zone) => zone.deckNumber === deck.deckNumber);
      const innerHull = buildDeckInnerHullPolygon(deck.deckNumber, 0);

      for (let i = 0; i < auxSectors.length; i++) {
        const sec = auxSectors[i];
        const corners: IsoPoint[] = [
          projectDeckPoint(deck.deckNumber, sec.u0, sec.v0, "single", 0),
          projectDeckPoint(deck.deckNumber, sec.u1, sec.v0, "single", 0),
          projectDeckPoint(deck.deckNumber, sec.u1, sec.v1, "single", 0),
          projectDeckPoint(deck.deckNumber, sec.u0, sec.v1, "single", 0),
        ];
        for (const corner of corners) {
          expect(pointInPolygon(corner, innerHull)).toBe(true);
        }

        for (let j = i + 1; j < auxSectors.length; j++) {
          expect(overlapsUv(sec, auxSectors[j])).toBe(false);
        }
        for (const zone of deckZones) {
          expect(overlapsUv(sec, zone)).toBe(false);
        }
        for (const shaft of VERTICAL_SHAFTS) {
          const shaftRect = {
            u0: shaft.u - shaft.uHalf,
            u1: shaft.u + shaft.uHalf,
            v0: shaft.v - shaft.vHalf,
            v1: shaft.v + shaft.vHalf,
          };
          expect(overlapsUv(sec, shaftRect)).toBe(false);
        }
      }
    }
  });

  it("keeps inner pressure liner strictly inside outer single-deck hull across decks 1..4", () => {
    for (const deck of DECK_SPECS) {
      const outer = buildDeckHullPolygon(deck.deckNumber, "single", 0);
      const inner = buildDeckInnerHullPolygon(deck.deckNumber, 0);
      expect(inner.length).toBeGreaterThanOrEqual(8);
      for (const vertex of inner) {
        expect(pointInPolygon(vertex, outer)).toBe(true);
      }

      const corridors = getDeckCorridorRects(deck.deckNumber);
      expect(corridors.length).toBeGreaterThanOrEqual(3);
    }

    for (const zone of SHIP_ZONES) {
      const door = getZoneDoorwaySegment(zone.deckNumber, zone, zone.doorSide, "single");
      const dist = Math.hypot(door.end.x - door.start.x, door.end.y - door.start.y);
      expect(dist).toBeGreaterThan(8);
    }
  });

  it("computeHullRevealBounds advances bow-to-stern hydro scan mask and ignites aft thrusters after stern sweep", () => {
    const start = computeHullRevealBounds(0);
    expect(start.isRevealing).toBe(true);
    expect(start.thrusterOpacity).toBe(0);
    expect(start.bowWakeOpacity).toBeGreaterThan(0.4);

    const mid = computeHullRevealBounds(0.44);
    expect(mid.frontX).toBeGreaterThan(500);
    expect(mid.frontX).toBeLessThan(1000);
    expect(mid.thrusterOpacity).toBe(0);
    expect(mid.crestOpacity).toBeGreaterThan(0.8);

    const settled = computeHullRevealBounds(1);
    expect(settled.isRevealing).toBe(false);
    expect(settled.thrusterOpacity).toBe(1);
    expect(settled.crestOpacity).toBe(0);
  });

  it("truncates overly long custom room names via formatZoneMapLabel with zero pill overlaps", () => {
    expect(formatZoneMapLabel("Komentosilta", "overview", false)).toBe("Komentosilta");
    const longName = "Erittäin pitkä mukautettu osastonimi aluksen perässä";
    const ovNoBadge = formatZoneMapLabel(longName, "overview", false);
    const ovWithBadge = formatZoneMapLabel(longName, "overview", true);
    const ovTightWithBadge = formatZoneMapLabel(longName, "overview", true, "d1-bridge");
    const sgNoBadge = formatZoneMapLabel(longName, "single", false);
    const sgWithBadge = formatZoneMapLabel(longName, "single", true);

    expect(ovNoBadge.endsWith("…")).toBe(true);
    expect(ovNoBadge.length).toBeLessThanOrEqual(18);
    expect(ovWithBadge.length).toBeLessThanOrEqual(14);
    expect(ovTightWithBadge.length).toBeLessThanOrEqual(9);
    expect(sgNoBadge.length).toBeLessThanOrEqual(26);
    expect(sgWithBadge.length).toBeLessThanOrEqual(22);

    const overviewPills: BoxItem[] = [];
    for (const zone of SHIP_ZONES) {
      const poly = buildZonePolygon(zone.deckNumber, zone, "overview");
      const center = polygonCentroid(poly);
      const label =
        zone.kind === "wing"
          ? zone.defaultLabel
          : formatZoneMapLabel(longName, "overview", true, zone.id);
      const m = estimateHudPillMetrics({
        x: center.x,
        y: center.y - 2,
        label,
        badgeText: zone.kind === "wing" ? "10/12" : "2 kelloa",
        fontSize: 12.5,
      });
      overviewPills.push({
        id: zone.id,
        left: m.left,
        top: m.top,
        right: m.right,
        bottom: m.bottom,
      });
    }
    expect(findOverlaps(overviewPills)).toEqual([]);
  });

  it("removes Deck 3 port breach hull indentation when hasPortBreach is false", () => {
    const damagedOverview = buildDeckHullPolygon(3, "overview", 0, true);
    const repairedOverview = buildDeckHullPolygon(3, "overview", 0, false);
    expect(damagedOverview.length).toBeGreaterThan(repairedOverview.length);

    const damagedSingle = buildDeckHullPolygon(3, "single", 0, true);
    const repairedSingle = buildDeckHullPolygon(3, "single", 0, false);
    expect(damagedSingle.length).toBeGreaterThan(repairedSingle.length);

    const innerRepaired = buildDeckInnerHullPolygon(3, 0, false);
    for (const vertex of innerRepaired) {
      expect(pointInPolygon(vertex, repairedSingle)).toBe(true);
    }
  });

  it("maps statusTone and isLocked consistently across pill and row tones", () => {
    expect(getRoomStatusPillTone({ isLocked: false, statusTone: "normal" })).toBe("secondary");
    expect(getRoomStatusPillTone({ isLocked: false, statusTone: "warning" })).toBe("dawn");
    expect(getRoomStatusPillTone({ isLocked: false, statusTone: "critical" })).toBe("alert");
    expect(getRoomStatusPillTone({ isLocked: true, statusTone: "normal" })).toBe("accent");
    expect(getRoomStatusPillTone({ isLocked: false, statusTone: "locked" })).toBe("accent");

    expect(getRoomStatusRowTone({ isLocked: false, statusTone: "normal" })).toBe("normal");
    expect(getRoomStatusRowTone({ isLocked: false, statusTone: "warning" })).toBe("dawn");
    expect(getRoomStatusRowTone({ isLocked: false, statusTone: "critical" })).toBe("warning");
    expect(getRoomStatusRowTone({ isLocked: true, statusTone: "normal" })).toBe("locked");
    expect(getRoomStatusRowTone({ isLocked: false, statusTone: "normal", isOwn: true })).toBe(
      "active",
    );
  });
});
