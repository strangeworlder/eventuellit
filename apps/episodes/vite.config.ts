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
            name: "episodes",
            filename: "remoteEntry.js",
            exposes: {
                "./App": "./src/App.tsx",
            },
            shared: ["react", "react-dom", "react-router-dom"],
        }),
    ],
    server: {
        port: 3004,
        strictPort: true,
    },
    preview: {
        port: 3004,
        strictPort: true,
    },
    build: {
        target: "esnext",
    },
});
