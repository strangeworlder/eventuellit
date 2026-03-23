import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility function to merge tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Obscured helpers ──

/** Pattern matching any letter (including Finnish äöåÄÖÅ) or digit. */
const LETTER_OR_DIGIT = /[a-zA-ZäöåÄÖÅ0-9]/g;

/** Replace letters & digits with case-matched x/X, keep special chars. */
export function obscureString(str: string): string {
  return str.replace(LETTER_OR_DIGIT, (ch) =>
    ch >= "A" && ch <= "Z" ||
      ch === "Ä" || ch === "Ö" || ch === "Å"
      ? "X"
      : "x",
  );
}
