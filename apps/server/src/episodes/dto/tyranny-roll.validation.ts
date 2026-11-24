export const TYRANNY_ROLL_REGEX = /^(?:[1-9]|1[0-2]|[A-ZÅÄÖ])$/;

export function normalizeTyrannyRollInput(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((item) => {
    if (typeof item === "number" && Number.isInteger(item)) {
      return String(item);
    }
    if (typeof item === "string") {
      return item.trim().toUpperCase();
    }
    return item;
  });
}

export function normalizeTyrannyRolls(rolls: string[] | undefined): string[] | undefined {
  if (rolls === undefined) return undefined;
  return rolls.map((item) => item.trim().toUpperCase());
}
