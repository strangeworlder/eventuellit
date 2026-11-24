const TYRANNY_ROLL_REGEX = /^(?:[1-9]|1[0-2]|[A-ZÅÄÖ])$/;

export function isValidTyrannyRoll(value: string): boolean {
  return TYRANNY_ROLL_REGEX.test(value.trim().toUpperCase());
}

export function parseTyrannyRollsInput(
  raw: string,
): { ok: true; rolls: string[] } | { ok: false; invalidTokens: string[] } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, rolls: [] };
  }
  const tokens = trimmed
    .split(/[\s,;]+/)
    .map((token) => token.trim().toUpperCase())
    .filter((token) => token.length > 0);
  const invalidTokens = tokens.filter((token) => !TYRANNY_ROLL_REGEX.test(token));
  if (invalidTokens.length > 0) {
    return { ok: false, invalidTokens };
  }
  return { ok: true, rolls: tokens };
}
