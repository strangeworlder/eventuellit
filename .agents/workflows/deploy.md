---
description: Deploy the complete application
---
# Deployment Workflow

1. Run the build command
```bash
npm run build
```
2. Production Runtime (Railway)
- **Host Service (`apps/host`):**
  - Build command: `npm run build --workspace=@eventuellit/host` (uses `scripts/build-with-remotes.mjs` to build `@repo/ui`, all 4 MFE remotes sequentially, `apps/host`, copies remotes into `apps/host/dist/_remotes/<app>`, and generates `meta-manifest.json`).
  - Start command: `node --max-old-space-size=64 apps/host/serve.mjs` (invoke `node` directly rather than `npm run` to avoid keeping a parent `npm` process in memory).
  - Serves both the shell and all 4 MFE remotes (`/_remotes/{generator,ruleset,episodes,world}/assets/entry.js`), so the 4 standalone remote Railway services are not needed in production.
- **Server Service (`apps/server`):**
  - Build command: `npm run build --workspace=@eventuellit/server`
  - Start command: `node --max-old-space-size=160 apps/server/dist/src/main.js`

## Module Federation Context
- In local development (`npm run dev`), remote applications are built and served via `vite build --watch` and `vite preview` on their dedicated ports (`3001`, `3002`, `3004`, `3005`), while the Host application runs on port `3003`.
- In production builds (`mode === "production"`), `apps/host` resolves all remotes from same-origin `/_remotes/<app>/assets/entry.js` served by `apps/host/serve.mjs`.
- Ensure all remote `vite.config.ts` profiles define `strictPort: true` for both server and preview settings to prevent 404 remoteEntry errors during local development.
