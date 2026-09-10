import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, getSeedCorpusStats, suggestNames } from "./name-generator";

describe("suggestNames", () => {
  it("returns the requested number of names", () => {
    const names = suggestNames("male", 5);
    expect(names).toHaveLength(5);
  });

  it("returns unique names", () => {
    const names = suggestNames("female", 10);
    const unique = new Set(names.map((n) => n.toLowerCase()));
    expect(unique.size).toBe(names.length);
  });

  it("respects exclusion list", () => {
    const excluded = ["Testname", "Anothertest"];
    const names = suggestNames("male", 5, excluded);
    for (const name of names) {
      expect(excluded.map((e) => e.toLowerCase())).not.toContain(name.toLowerCase());
    }
  });

  it("never returns known example names", () => {
    // Generate a large batch and check none are in the known set
    const knownExamples = [
      "Pekablo",
      "Marisorja",
      "Kurtish",
      "Giovanho",
      "Jackimir",
      "Amadieu",
      "Aarniel",
      "Heico",
      "Wolfvick",
      "Lucahana",
    ];
    const names = suggestNames("male", 50);
    for (const name of names) {
      expect(knownExamples.map((e) => e.toLowerCase())).not.toContain(name.toLowerCase());
    }
  });

  it("maps non-binary to neutral pool", () => {
    const names = suggestNames("non-binary", 5);
    expect(names).toHaveLength(5);
    // Should not throw or return empty
    for (const name of names) {
      expect(name.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("maps 'none' to neutral pool", () => {
    const names = suggestNames("none", 5);
    expect(names).toHaveLength(5);
  });

  it("produces names with correct capitalization", () => {
    const names = suggestNames("female", 10);
    for (const name of names) {
      // First character should be uppercase
      expect(name[0]).toBe(name[0].toUpperCase());
      // If there's a hyphen, char after should also be uppercase
      if (name.includes("-")) {
        const parts = name.split("-");
        for (const part of parts) {
          if (part.length > 0) {
            expect(part[0]).toBe(part[0].toUpperCase());
          }
        }
      }
    }
  });

  it("produces names within reasonable length", () => {
    const names = suggestNames("male", 20);
    for (const name of names) {
      expect(name.length).toBeGreaterThanOrEqual(3);
      expect(name.length).toBeLessThanOrEqual(14);
    }
  });

  it("handles large exclusion sets", () => {
    const excluded = Array.from({ length: 100 }, (_, i) => `Excluded${i}`);
    const names = suggestNames("male", 5, excluded);
    expect(names).toHaveLength(5);
  });

  it("has an expanded seed corpus of over 1000 seeds across all categories", () => {
    const stats = getSeedCorpusStats();
    expect(stats.categoryCount).toBe(5);
    expect(stats.totalSeeds).toBeGreaterThanOrEqual(1000);
    expect(stats.uniqueSeedsCount).toBeGreaterThanOrEqual(800);
  });

  it("generates diverse names with varied prefixes and suffixes in a suggestion batch", () => {
    // Over multiple 5-name batches, ensure prefixes (first 3 chars) are distinct
    for (let b = 0; b < 5; b++) {
      const batch = suggestNames("female", 5);
      const prefixes = batch.map((n) => n.toLowerCase().slice(0, 3));
      const uniquePrefixes = new Set(prefixes);
      // In a 5-name batch, at least 4 of 5 should have unique 3-char prefixes
      expect(uniquePrefixes.size).toBeGreaterThanOrEqual(4);
    }
  });

  it("contains rich pools in every category and gender", () => {
    for (const category of ALL_CATEGORIES) {
      expect(category.male.cultureA.length).toBeGreaterThanOrEqual(30);
      expect(category.male.cultureB.length).toBeGreaterThanOrEqual(30);
      expect(category.female.cultureA.length).toBeGreaterThanOrEqual(30);
      expect(category.female.cultureB.length).toBeGreaterThanOrEqual(30);
      expect(category.neutral.cultureA.length).toBeGreaterThanOrEqual(15);
      expect(category.neutral.cultureB.length).toBeGreaterThanOrEqual(15);
    }
  });
});
