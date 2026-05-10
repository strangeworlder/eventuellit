const ATTRIBUTE_FACES = [4, 6, 8, 10, 12] as const;
const MAX_TIER_COUNT = 2;
const MAX_ENCODED_VALUE = 242;

export type AttributeDiceCounts = [number, number, number, number, number];

export function decodeAttributeDice(packed: number): AttributeDiceCounts {
  if (!Number.isInteger(packed) || packed < 0 || packed > MAX_ENCODED_VALUE) {
    throw new Error("Invalid packed attribute value");
  }

  const counts: number[] = [];
  let remainder = packed;
  for (let i = 0; i < ATTRIBUTE_FACES.length; i += 1) {
    counts.push(remainder % 3);
    remainder = Math.floor(remainder / 3);
  }
  return counts as AttributeDiceCounts;
}

export function addN4(packed: number): number {
  const counts = decodeAttributeDice(packed);
  counts[0] += 1;

  for (let i = 0; i < counts.length; i += 1) {
    if (counts[i] <= MAX_TIER_COUNT) {
      continue;
    }
    if (i === counts.length - 1) {
      throw new Error("Attribute cannot advance beyond n12");
    }
    counts[i] = 0;
    counts[i + 1] += 1;
  }

  return counts.reduce((sum, count, index) => sum + count * 3 ** index, 0);
}
