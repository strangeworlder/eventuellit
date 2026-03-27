/// <reference path="../hyphenopoly.d.ts" />
import hyphenopoly from "hyphenopoly";

type HyphenateFn = (text: string) => string;

let cached: HyphenateFn | null = null;
const queue: Array<() => void> = [];

// Kick off WASM loading immediately on first import — shared singleton
// across all Heading instances so the 2.6 KB fi.wasm is fetched only once.
(hyphenopoly
    .config({
        require: ["fi"],
        // patDir (second arg) is bundle-relative and useless in a Vite SPA;
        // we resolve the WASM ourselves via the /Hyphenopoly/patterns/ path
        // served by the Vite plugin in @eventuellit/host.
        loader: async (file: string) => {
            const res = await fetch(`/Hyphenopoly/patterns/${file}`);
            if (!res.ok) {
                throw new Error(`[Hyphenopoly] ${file}: HTTP ${res.status}`);
            }
            return res.arrayBuffer();
        },
    })
    .get("fi") as Promise<HyphenateFn>)
    .then((fn) => {
        cached = fn;
        queue.splice(0).forEach((cb) => cb());
    })
    .catch((err: unknown) => {
        console.warn("[Hyphenopoly] Failed to load Finnish patterns:", err);
    });

/**
 * Returns the text with Finnish soft hyphens (\u00AD) inserted at correct
 * syllable boundaries. Falls back to the original string until the WASM loads.
 */
export function hyphenateText(text: string): string {
    return cached !== null ? cached(text) : text;
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
    queue.push(cb);
    return () => {
        const i = queue.indexOf(cb);
        if (i >= 0) queue.splice(i, 1);
    };
}
