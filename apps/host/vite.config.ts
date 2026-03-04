import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: "host",
      remotes: {
        generator: "http://localhost:3001/assets/remoteEntry.js",
        ruleset: "http://localhost:3002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 3003,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
