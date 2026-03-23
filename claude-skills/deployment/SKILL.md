---
name: Deployment & Module Federation
description: Deployment procedures and Module Federation configuration for the Eventuellit micro-frontend architecture.
---

# Deployment & Module Federation

## Build & Deploy

1. Run the build command:
```bash
npm run build
```
2. (Pending: Add specific deployment steps based on hosting provider)

## Module Federation Architecture

The application uses a micro-frontend architecture where:

- **Remote apps** (`generator`, `ruleset`, `episodes`, `world`) must be built and served via `vite build && vite preview` for local consumption.
- **Host app** (`host`) consumes these static remotes while running in standard dev mode (`vite dev`).
- All remote `vite.config.ts` profiles must define `strictPort: true` for both server and preview settings.

### Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| `404 Not Found` for `remoteEntry.js` | Vite dev uses ES-module stream (no static bundles) | Use `vite build && vite preview` for remotes |
| Ports silently floating upwards | Zombie Node processes occupy ports | Run `npx kill-port 3001 3002 3003 3004` |

### Remote-Origin Asset Resolution

In host-mounted MFEs, do NOT rely on root-relative static paths (`/images/...`) for remote-owned assets. Resolve URLs against the remote origin:
```js
new URL(import.meta.url).origin
```
Use manifest-driven paths where applicable so assets load correctly when composed by the host.

## Environment Variables Required

Ensure the following are set before deployment:
- `DATABASE_URL` — PostgreSQL connection string
- `CORS_ORIGINS` — Comma-separated allowlist (no wildcards)
- `VITE_API_BASE_URL` — Frontend API origin
- `JWT_SECRET` — JWT token signing secret
- `MAGIC_LINK_BASE_URL` — Frontend base URL for magic link verification