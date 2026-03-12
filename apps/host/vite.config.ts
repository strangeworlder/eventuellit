import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      react(),
      federation({
        name: "host",
        remotes: {
          generator: `${env.VITE_GENERATOR_URL || "http://localhost:3001"}/assets/remoteEntry.js`,
          ruleset: `${env.VITE_RULESET_URL || "http://localhost:3002"}/assets/remoteEntry.js`,
          episodes: `${env.VITE_EPISODES_URL || "http://localhost:3004"}/assets/remoteEntry.js`,
          world: `${env.VITE_WORLD_URL || "http://localhost:3005"}/assets/remoteEntry.js`,
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
