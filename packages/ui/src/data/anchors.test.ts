import { describe, expect, it } from "vitest";
import { ANCHOR_CARDS, drawRandomAnchors, getAnchorById } from "./anchors";

describe("anchors data and helpers", () => {
  it("contains exactly 78 unique cards matching tarot structure", () => {
    expect(ANCHOR_CARDS).toHaveLength(78);

    const ids = new Set(ANCHOR_CARDS.map((c) => c.id));
    expect(ids.size).toBe(78);

    const names = new Set(ANCHOR_CARDS.map((c) => c.name));
    expect(names.size).toBe(78);
  });

  it("contains exactly 22 major arcana and 56 minor arcana", () => {
    const majors = ANCHOR_CARDS.filter((c) => c.arcana === "major");
    const minors = ANCHOR_CARDS.filter((c) => c.arcana === "minor");

    expect(majors).toHaveLength(22);
    expect(minors).toHaveLength(56);
  });

  it("contains exactly 14 cards per suit in minor arcana", () => {
    const suits = ["wands", "cups", "swords", "disks"] as const;
    for (const suit of suits) {
      const cardsInSuit = ANCHOR_CARDS.filter((c) => c.suit === suit);
      expect(cardsInSuit).toHaveLength(14);
    }
  });

  it("ensures every card has non-empty Finnish descriptions and dual polarities", () => {
    for (const card of ANCHOR_CARDS) {
      expect(card.name.trim()).not.toBe("");
      expect(card.name).not.toContain("/");
      expect(card.description.trim()).not.toBe("");
      expect(card.polarityA.title.trim()).not.toBe("");
      expect(card.polarityA.description.trim()).not.toBe("");
      expect(card.polarityB.title.trim()).not.toBe("");
      expect(card.polarityB.description.trim()).not.toBe("");
      expect(card.polarityA.title).not.toEqual(card.polarityB.title);
    }
  });

  it("retrieves a card by ID using getAnchorById", () => {
    const kuilu = getAnchorById("atu-0");
    expect(kuilu).toBeDefined();
    expect(kuilu?.name).toBe("Kuilu");
    expect(kuilu?.arcana).toBe("major");

    const nonExistent = getAnchorById("unknown-id");
    expect(nonExistent).toBeUndefined();
  });

  describe("drawRandomAnchors", () => {
    it("draws the requested number of unique anchors", () => {
      const drawn = drawRandomAnchors(5);
      expect(drawn).toHaveLength(5);
      const uniqueIds = new Set(drawn.map((c) => c.id));
      expect(uniqueIds.size).toBe(5);
    });

    it("excludes claimed anchor IDs from selection", () => {
      const claimedIds = ["atu-0", "atu-1", "atu-2", "wands-ace"];
      const drawn = drawRandomAnchors(5, claimedIds);
      expect(drawn).toHaveLength(5);
      for (const card of drawn) {
        expect(claimedIds).not.toContain(card.id);
      }
    });

    it("returns all remaining cards when count exceeds available pool", () => {
      const allExceptTwo = ANCHOR_CARDS.slice(2).map((c) => c.id);
      const drawn = drawRandomAnchors(5, allExceptTwo);
      expect(drawn).toHaveLength(2);
    });

    it("returns an empty array when all cards are claimed", () => {
      const allIds = ANCHOR_CARDS.map((c) => c.id);
      const drawn = drawRandomAnchors(5, allIds);
      expect(drawn).toHaveLength(0);
    });
  });
});
