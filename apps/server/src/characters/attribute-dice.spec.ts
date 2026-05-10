import { describe, expect, it } from "vitest";
import { addN4, decodeAttributeDice, encodeAttributeDice, kestoBonusFromPackedAttribute } from "./attribute-dice";

describe("attribute-dice", () => {
  it("encodes and decodes packed values", () => {
    const packed = encodeAttributeDice([2, 1, 0, 0, 0]);
    expect(packed).toBe(5);
    expect(decodeAttributeDice(packed)).toEqual([2, 1, 0, 0, 0]);
  });

  it("cascades carry while adding n4", () => {
    const packed = encodeAttributeDice([2, 2, 0, 0, 0]);
    const next = addN4(packed);
    expect(decodeAttributeDice(next)).toEqual([0, 0, 1, 0, 0]);
  });

  it("calculates kesto bonus from packed tiers", () => {
    const packed = encodeAttributeDice([1, 1, 1, 1, 1]);
    expect(kestoBonusFromPackedAttribute(packed)).toBe(20);
  });

  it("throws when adding beyond n12 cap", () => {
    const packed = encodeAttributeDice([2, 2, 2, 2, 2]);
    expect(() => addN4(packed)).toThrow("Attribute cannot advance beyond n12");
  });
});
