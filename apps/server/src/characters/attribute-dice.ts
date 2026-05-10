const ATTRIBUTE_FACES = [4, 6, 8, 10, 12] as const;
const MAX_TIER_COUNT = 2;
const MAX_ENCODED_VALUE = 242; // 22222 in base-3

export type AttributeDiceCounts = [number, number, number, number, number];

export function decodeAttributeDice(packed: number): AttributeDiceCounts {
  if (!Number.isInteger(packed) || packed < 0 || packed > MAX_ENCODED_VALUE) {
    throw new Error("Invalid packed attribute value");
  }

  const counts: number[] = [];
  let remainder = packed;
  for (let i = 0; i < ATTRIBUTE_FACES.length; i += 1) {
    const digit = remainder % 3;
    if (digit > MAX_TIER_COUNT) {
      throw new Error("Packed attribute contains an invalid tier count");
    }
    counts.push(digit);
    remainder = Math.floor(remainder / 3);
  }
  return counts as AttributeDiceCounts;
}

export function encodeAttributeDice(counts: AttributeDiceCounts): number {
  if (counts.length !== ATTRIBUTE_FACES.length) {
    throw new Error("Invalid attribute dice array");
  }

  let multiplier = 1;
  let packed = 0;
  for (const count of counts) {
    if (!Number.isInteger(count) || count < 0 || count > MAX_TIER_COUNT) {
      throw new Error("Invalid tier count");
    }
    packed += count * multiplier;
    multiplier *= 3;
  }
  return packed;
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

  return encodeAttributeDice(counts);
}

export function kestoBonusFromPackedAttribute(packed: number): number {
  const counts = decodeAttributeDice(packed);
  return counts.reduce((sum, count, idx) => sum + (ATTRIBUTE_FACES[idx] / 2) * count, 0);
}
