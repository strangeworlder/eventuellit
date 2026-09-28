/// <reference path="../hyphenopoly.d.ts" />
import hyphenopoly from "hyphenopoly";

type HyphenateFn = (text: string) => string;

let cached: HyphenateFn | null = null;
let initPromise: Promise<void> | null = null;
const queue: Array<() => void> = [];

/**
 * Lazily kicks off WASM loading on first demand.
 * Subsequent calls return the same promise.
 */
function ensureInit(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (
    hyphenopoly
      .config({
        require: ["fi"],
        loader: async (file: string) => {
          const res = await fetch(`/Hyphenopoly/patterns/${file}`);
          if (!res.ok) {
            throw new Error(`[Hyphenopoly] ${file}: HTTP ${res.status}`);
          }
          return res.arrayBuffer();
        },
      })
      .get("fi") as Promise<HyphenateFn>
  )
    .then((fn) => {
      cached = fn;
      queue.splice(0).forEach((cb) => {
        cb();
      });
    })
    .catch((err: unknown) => {
      console.warn("[Hyphenopoly] Failed to load Finnish patterns:", err);
    });
  return initPromise;
}

/**
 * Returns the text with Finnish soft hyphens (\u00AD) inserted at correct
 * syllable boundaries. Falls back to the original string until the WASM loads.
 */
export function hyphenateText(text: string): string {
  if (cached === null) {
    ensureInit();
    return text;
  }
  return cached(text);
}

/** True once the Finnish WASM pattern has finished loading. */
export function isHyphenationReady(): boolean {
  return cached !== null;
}

/**
 * Fires `cb` once hyphenation is ready (immediately if already loaded).
 * Returns an unsubscribe function for use in React cleanup.
 */
export function onHyphenationReady(cb: () => void): () => void {
  if (cached !== null) {
    cb();
    return () => {};
  }
  ensureInit();
  queue.push(cb);
  return () => {
    const i = queue.indexOf(cb);
    if (i >= 0) queue.splice(i, 1);
  };
}
