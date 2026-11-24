import { describe, expect, it } from "vitest";
import { isValidTyrannyRoll, parseTyrannyRollsInput } from "./tyranny-rolls";

describe("tyranny-rolls helpers", () => {
  it("validates integers 1-12 and single Finnish/Latin letters", () => {
    for (const valid of ["1", "9", "10", "12", "a", "K", "å", "ä", "ö", "Ä"]) {
      expect(isValidTyrannyRoll(valid)).toBe(true);
    }
    for (const invalid of ["", "0", "13", "01", "AB", "?", "-1"]) {
      expect(isValidTyrannyRoll(invalid)).toBe(false);
    }
  });

  it("parses empty input as empty roll array", () => {
    expect(parseTyrannyRollsInput("   ")).toEqual({ ok: true, rolls: [] });
  });

  it("parses comma and whitespace separated numbers and letters in order", () => {
    expect(parseTyrannyRollsInput("4, k 11; ä, 4")).toEqual({
      ok: true,
      rolls: ["4", "K", "11", "Ä", "4"],
    });
  });

  it("reports invalid tokens clearly", () => {
    expect(parseTyrannyRollsInput("4, 13, ab, K")).toEqual({
      ok: false,
      invalidTokens: ["13", "AB"],
    });
  });
});
