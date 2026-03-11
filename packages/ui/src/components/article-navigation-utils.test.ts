import { describe, expect, it } from "vitest";

import {
  calculateArticleProgress,
  createUniqueHeadingId,
  extractH3SectionsFromMarkdown,
  mapSectionOffsetsToProgressPositions,
  resolveActiveSectionFromProgress,
  resolveActiveSectionId,
  slugifyHeadingLabel,
} from "./article-navigation-utils";

describe("article navigation utils", () => {
  it("slugifies finnish labels into stable ids", () => {
    expect(slugifyHeadingLabel("Kehitys ja toipuminen")).toBe("kehitys-ja-toipuminen");
    expect(slugifyHeadingLabel("Näppäryys & Ymmärrys")).toBe("napparyys-ymmarrys");
  });

  it("creates unique heading ids for duplicate labels", () => {
    const map = new Map<string, number>();
    expect(createUniqueHeadingId("Toipuminen", map, "jakso-1")).toBe("jakso-1-toipuminen");
    expect(createUniqueHeadingId("Toipuminen", map, "jakso-1")).toBe("jakso-1-toipuminen-2");
  });

  it("extracts h3 sections from markdown in source order", () => {
    const markdown = [
      "Johdanto",
      "",
      "### 1\\. Pelimekaniikka",
      "Teksti",
      "",
      "#### Alataso",
      "",
      "### 2\\. Hahmo",
      "Lisää tekstiä",
    ].join("\n");

    expect(extractH3SectionsFromMarkdown(markdown, "mekaniikat")).toEqual([
      { id: "mekaniikat-1-pelimekaniikka", label: "1. Pelimekaniikka" },
      { id: "mekaniikat-2-hahmo", label: "2. Hahmo" },
    ]);
  });

  it("clamps article progress between 0 and 100", () => {
    expect(calculateArticleProgress(100, 200, 1200)).toBe(0);
    expect(calculateArticleProgress(700, 200, 1200)).toBe(50);
    expect(calculateArticleProgress(2200, 200, 1200)).toBe(100);
  });

  it("resolves the active section nearest above viewport probe", () => {
    const sections = [
      { id: "alku", top: 150 },
      { id: "keskiosa", top: 550 },
      { id: "loppu", top: 1000 },
    ];

    expect(resolveActiveSectionId(120, sections)).toBe("alku");
    expect(resolveActiveSectionId(600, sections)).toBe("keskiosa");
    expect(resolveActiveSectionId(1300, sections)).toBe("loppu");
  });

  it("maps section offsets to normalized progress positions", () => {
    const positions = mapSectionOffsetsToProgressPositions(
      [
        { id: "alku", top: 200 },
        { id: "keskiosa", top: 500 },
        { id: "loppu", top: 800 },
      ],
      200,
      1200,
    );

    expect(positions.alku).toBe(0);
    expect(positions.keskiosa).toBe(30);
    expect(positions.loppu).toBe(60);
  });

  it("allows progress to continue after the final h3 marker", () => {
    const positions = mapSectionOffsetsToProgressPositions(
      [{ id: "viimeinen-h3", top: 700 }],
      200,
      1200,
    );

    expect(positions["viimeinen-h3"]).toBe(50);
    expect(calculateArticleProgress(1200, 200, 1200)).toBe(100);
  });

  it("resolves active section from progress when before first marker", () => {
    const markers = { alku: 5, keskiosa: 30, loppu: 60 };
    expect(resolveActiveSectionFromProgress(0, ["alku", "keskiosa", "loppu"], markers)).toBe("alku");
    expect(resolveActiveSectionFromProgress(3, ["alku", "keskiosa", "loppu"], markers)).toBe("alku");
  });

  it("resolves active section from progress when between markers", () => {
    const markers = { alku: 10, keskiosa: 30, loppu: 60 };
    expect(resolveActiveSectionFromProgress(50, ["alku", "keskiosa", "loppu"], markers)).toBe("keskiosa");
  });

  it("resolves last section as active at 100% progress", () => {
    const markers = { alku: 10, keskiosa: 30, loppu: 60 };
    expect(resolveActiveSectionFromProgress(100, ["alku", "keskiosa", "loppu"], markers)).toBe("loppu");
  });

  it("returns undefined for empty sections", () => {
    expect(resolveActiveSectionFromProgress(50, [], {})).toBeUndefined();
  });

  it("filters out sections missing from markerPositions", () => {
    const markers = { alku: 10, keskiosa: 30 };
    // "loppu" is in sectionIds but not in markers - should be filtered out
    expect(resolveActiveSectionFromProgress(100, ["alku", "keskiosa", "loppu"], markers)).toBe("keskiosa");
  });

  it("handles sections with missing markers by falling back to first section", () => {
    const markers = {};
    // No markers, should fall back to first section
    expect(resolveActiveSectionFromProgress(50, ["alku", "keskiosa"], markers)).toBe("alku");
  });
});
