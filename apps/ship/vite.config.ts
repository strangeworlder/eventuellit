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
      name: "ship",
      filename: "entry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],
  server: {
    port: 3006,
    strictPort: true,
  },
  preview: {
    port: 3006,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});
