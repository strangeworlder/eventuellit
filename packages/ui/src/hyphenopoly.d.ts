declare module "hyphenopoly" {
    type HyphenateFn = (text: string) => string;

    interface HyphenopolyModuleConfig {
        require: string[];
        /** Async loader — receives `(filename, patternDirUrl)`, must return the WASM ArrayBuffer. */
        loader?: (file: string, patDir: URL) => Promise<ArrayBuffer>;
        /** Character inserted at hyphenation points. Defaults to \u00AD (soft hyphen). */
        hyphen?: string;
        minWordLength?: number;
        exceptions?: Record<string, string>;
        leftmin?: number;
        rightmin?: number;
    }

    const H: {
        config(config: HyphenopolyModuleConfig): Map<string, Promise<HyphenateFn>>;
        supportedLanguages: readonly string[];
    };

    export default H;
}
