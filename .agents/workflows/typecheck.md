---
description: Run TypeScript type checking across the monorepo
---

# TypeScript Type Checking

// turbo-all

## Full monorepo typecheck (recommended)

1. Run type checking across all workspaces:

```bash
npm run check-types
```

This runs `turbo run check-types`, which executes `tsc --noEmit` (or `tsc -b --noEmit` for Vite apps) in every workspace that has a `check-types` script.

## Single workspace typecheck

2. To check a specific workspace only:

```bash
npm run check-types -w @eventuellit/host
npm run check-types -w @eventuellit/episodes
npm run check-types -w @eventuellit/generator
npm run check-types -w @eventuellit/world
npm run check-types -w @eventuellit/ruleset
npm run check-types -w @eventuellit/server
npm run check-types -w @repo/ui
npm run check-types -w @repo/auth
```

## Important

- **NEVER** run bare `npx tsc` from the root — there is no root `tsconfig.json`, so it doesn't resolve workspace configs correctly.
- Vite frontend apps use `tsc -b --noEmit` (project references via `tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`).
- The NestJS server and shared packages use `tsc --noEmit` (flat tsconfig).
