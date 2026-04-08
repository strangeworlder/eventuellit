---
name: Environment Setup & Troubleshooting
description: Local development environment setup, prerequisites, and fixes for common stack and environment errors. Use when setting up the project, encountering startup errors, or working with Module Federation remotes.
---

# Environment Setup & Troubleshooting

## Prerequisites

- **Node v22 (LTS)** required.
- **NPM** (`npm@10.9.2+`) with traditional workspaces.
- **Windows** development environment.

## Initial Setup

```bash
npx kill-port 3001 3002 3003 3004 3005  # Kill zombie ports before install
npm install
npm run dev
```

## Common Issues

### Node & NVM

**Symptom:** `exit status 5: Access is denied` when running `nvm use`.

**Cause:** Windows restricts symlink creation for normal accounts.

**Fix:** Run terminal as Administrator, or enable "Developer Mode" in Windows settings, or bypass: `cmd.exe /c "set PATH=... && npm run <script>"`.

### Module Federation (Vite)

**Symptom:** `404 Not Found` for `remoteEntry.js` or ports silently floating upwards.

**Cause:** `vite dev` uses ES-module streaming (no static bundles); zombie Node processes occupy ports.

**Fix:**
1. `npx kill-port 3001 3002 3003 3004 3005`
2. Use `vite build && vite preview` for remotes — never `vite dev`
3. All remote `vite.config.ts` must set `strictPort: true`

### Remote-Origin Asset Resolution

In host-mounted MFEs, do NOT use root-relative static paths (`/images/...`) for remote-owned assets. Resolve URLs against the remote origin:

```js
new URL(import.meta.url).origin
```

Use manifest-driven paths where applicable.

### Storybook Vite 6 Crash

**Symptom:** `res.status is not a function` in Storybook.

**Cause:** Storybook version incompatible with Vite 6 native dev servers.

**Fix:** Node v22+ with Storybook v10.2+. Do not use deprecated `/blocks` subpath for docs addon.

### VITE_API_BASE_URL Missing

**Symptom:** `Uncaught Error: VITE_API_BASE_URL is required`

**Fix:** Create `.env` in the relevant app directory:
```
VITE_API_BASE_URL=http://localhost:3000
```

### NPM Audit — NestJS CLI Vulnerabilities

**Symptom:** `npm audit` shows moderate/high vulnerabilities from `@nestjs/cli`.

**Fix:** Do NOT run `npm audit fix --force` — it downgrades the CLI to v7 and breaks NestJS. These are build-time dependencies, not runtime, and are explicitly ignored.

## Required Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGINS` | Comma-separated allowlist (no wildcards) |
| `VITE_API_BASE_URL` | Frontend API origin |
| `JWT_SECRET` | JWT token signing secret |
| `MAGIC_LINK_BASE_URL` | Frontend base URL for magic link verification |
| `PORT` | Server port (defaults to 3000) |
| `RESEND_API_KEY` | Resend email delivery (optional in dev — links logged to console) |
| `VITE_GENERATOR_URL` | Generator MFE remote URL (default `http://localhost:3001`) |
| `VITE_RULESET_URL` | Ruleset MFE remote URL (default `http://localhost:3002`) |
| `VITE_EPISODES_URL` | Episodes MFE remote URL (default `http://localhost:3004`) |
| `VITE_WORLD_URL` | World MFE remote URL (default `http://localhost:3005`) |

## When You Resolve a New Issue

Add it here and mirror in `docs/learnings.md`. For purge sessions, follow `.agents/workflows/learnings-retention.md`.
