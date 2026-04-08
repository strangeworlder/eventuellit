import { describe, expect, it } from "vitest";
import { suggestNames } from "./name-generator";

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
      "Pekablo", "Marisorja", "Kurtish", "Giovanho", "Jackimir",
      "Amadieu", "Aarniel", "Heico", "Wolfvick", "Lucahana",
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
});
