---
name: Environment Setup & Troubleshooting
description: Local development environment setup, prerequisites, and solutions to common stack and environment errors.
---

# Environment Setup & Troubleshooting

## Prerequisites

- **Node v22 (LTS)** is required.
- **NPM** (`npm@9.6.4+`) with traditional workspaces.
- **Windows** development environment.

## Initial Setup

1. Kill zombie ports to prevent Vite port floating:
```bash
npx kill-port 3001 3002 3003
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Common Issues & Fixes

### Node & NVM

**Symptom:** `exit status 5: Access is denied` when running `nvm use`.

**Cause:** Windows restricts symlink creation for normal accounts.

**Fixes:**
- Run the terminal as an Administrator
- Use `cmd.exe /c "set PATH=... && npm run <script>"` to dynamically bypass
- Enable "Developer Mode" in Windows settings

### NPM Workspaces

**Symptom:** `npm EUNSUPPORTEDPROTOCOL` crash when viewing `package.json` linkages.

**Cause:** Using `workspace:*` syntax (strictly for pnpm/yarn).

**Fix:** Under pure `npm` lockfile, exclusively use `*` wildcard or exact semantic version for local dependencies.

### Module Federation (Vite)

**Symptom:** `404 Not Found` for `remoteEntry.js` or ports silently floating upwards.

**Cause:** Vite `dev` uses an ES-module stream (no static bundles), and zombie Node processes occupy ports.

**Fix:**
1. Kill zombie ports: `npx kill-port 3001 3002 3003 3004`
2. Build & Preview remotes: `vite build && vite preview` instead of `vite dev`
3. Set `strictPort: true` in all configuration files

### NPM Audit

**Symptom:** `npm audit` shows moderate/high vulnerabilities from `@nestjs/cli`.

**Cause:** Deeply nested build-time dependencies (e.g., `serialize-javascript`) inside the CLI builder.

**Fix:** Do NOT run `npm audit fix --force` — it will downgrade CLI to v7 and break NestJS structure. These are build-time dependencies, not runtime, and are explicitly ignored.

### Storybook Vite 6 Crash

**Symptom:** `res.status is not a function` error in Storybook.

**Cause:** Storybook version incompatible with Vite 6 native dev servers.

**Fix:** Run Storybook on Node v22+ with Storybook v10.2+. Do not use the deprecated `/blocks` subpath for docs addon.

### VITE_API_BASE_URL Missing

**Symptom:** `Uncaught Error: VITE_API_BASE_URL is required`

**Cause:** Missing environment variable in the frontend application.

**Fix:** Create a `.env` file in the relevant app directory with:
```
VITE_API_BASE_URL=http://localhost:3000
```

## When You Resolve a New Issue

If you resolve a new recurring issue:
1. Add it to troubleshooting documentation
2. Mirror the incident details in `docs/learnings.md`
3. For purge/cleanup sessions, follow the learnings retention workflow
