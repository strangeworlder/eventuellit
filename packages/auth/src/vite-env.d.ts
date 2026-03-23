// Ambient type declarations for Vite's import.meta.env
// These augment the built-in ImportMeta interface so TypeScript
// understands Vite environment variables without a direct vite dependency.

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
