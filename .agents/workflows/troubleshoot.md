---
description: Troubleshooting common stack and environment errors
---
# Troubleshooting Workflow

When encountering persistent errors, check if they map to these known project nuances:

## Node & NVM
- **Symptom:** `exit status 5: Access is denied` when running `nvm use`.
- **Cause:** Windows restricts symlink creation for normal accounts.
- **Fix:** Run the terminal as an Administrator, OR use `cmd.exe /c "set PATH=... && npm run <script>"` to dynamically bypass, OR enable "Developer Mode" in Windows settings.

## NPM Workspaces
- **Symptom:** `npm EUNSUPPORTEDPROTOCOL` format crash when viewing `package.json` linkages.
- **Cause:** Attempting to use the `workspace:*` syntax which is strictly for `pnpm`/`yarn`.
- **Fix:** Under our pure `npm` lockfile, exclusively use the standard string `*` wildcard or an exact semantic version for local dependencies.

## Module Federation (Vite)
- **Symptom:** `404 Not Found` for `remoteEntry.js` or ports silently floating upwards (e.g., 3001 becoming 3002).
- **Cause:** Vite `dev` uses an ES-module stream (no static bundles), and zombie Node processes occupy ports.
- **Fix:** 
    1. Kill zombie ports: `npx kill-port 3001 3002 3003 3004`
    2. Build & Preview remotes: `vite build && vite preview` instead of `vite dev`.
    3. Ensure `strictPort: true` is set in all configuration files.

## NPM Audit
- **Symptom:** `npm audit` shows moderate/high vulnerabilities coming from `@nestjs/cli`.
- **Cause:** Deeply nested build-time dependencies (e.g. `serialize-javascript`) inside the CLI builder.
- **Fix:** Do **NOT** run `npm audit fix --force`, as it will downgrade the CLI to v7 and break the NestJS structure. These are build-time, not runtime, so they are explicitly ignored.
