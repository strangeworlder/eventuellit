import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createReadStream, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * Serves fi.wasm from node_modules/hyphenopoly/min/patterns/ at
 * /Hyphenopoly/patterns/fi.wasm during dev, and copies it to
 * <outDir>/Hyphenopoly/patterns/ during production builds.
 *
 * The path is resolved via require.resolve so it works regardless of
 * whether npm hoisted hyphenopoly to the root or a nested node_modules.
 */
function hyphenopolyPlugin(): Plugin {
  const require = createRequire(import.meta.url);
  const pkgDir = dirname(require.resolve("hyphenopoly/package.json"));
  const wasmSrc = resolve(pkgDir, "min/patterns/fi.wasm");

  return {
    name: "vite-plugin-hyphenopoly",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== "/Hyphenopoly/patterns/fi.wasm") return next();
        if (!existsSync(wasmSrc)) return next();
        res.setHeader("Content-Type", "application/wasm");
        createReadStream(wasmSrc).pipe(res as NodeJS.WritableStream);
      });
    },

    writeBundle({ dir }) {
      if (!dir) return;
      const outPatternsDir = resolve(dir, "Hyphenopoly/patterns");
      mkdirSync(outPatternsDir, { recursive: true });
      copyFileSync(wasmSrc, resolve(outPatternsDir, "fi.wasm"));
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      hyphenopolyPlugin(),
      tailwindcss(),
      react(),
      federation({
        name: "host",
        remotes: {
          generator: `${env.VITE_GENERATOR_URL || "http://localhost:3001"}/assets/entry.js`,
          ruleset: `${env.VITE_RULESET_URL || "http://localhost:3002"}/assets/entry.js`,
          episodes: `${env.VITE_EPISODES_URL || "http://localhost:3004"}/assets/entry.js`,
          world: `${env.VITE_WORLD_URL || "http://localhost:3005"}/assets/entry.js`,
        },
        shared: ["react", "react-dom", "react-router-dom"],
      }),
    ],
    server: {
      port: 3003,
      strictPort: true,
    },
    build: {
      target: "esnext",
    },
  };
});
