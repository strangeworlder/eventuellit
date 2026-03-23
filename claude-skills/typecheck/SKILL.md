---
name: TypeScript Type Checking
description: How to run TypeScript type checking correctly in the Eventuellit monorepo. Never use bare npx tsc.
---

# TypeScript Type Checking

## The Right Way

Run type checking across the entire monorepo from the project root:

```bash
npm run check-types
```

This uses Turborepo to execute `check-types` in every workspace (6 apps + 2 packages).

## Per-Workspace Checks

To check a single workspace:

```bash
npm run check-types -w <workspace-name>
```

Available workspaces:
- `@eventuellit/host`
- `@eventuellit/episodes`
- `@eventuellit/generator`
- `@eventuellit/world`
- `@eventuellit/ruleset`
- `@eventuellit/server`
- `@repo/ui`
- `@repo/auth`

## Common Mistakes — DO NOT DO THESE

- ❌ `npx tsc` — No root `tsconfig.json` exists; this produces garbage output.
- ❌ `npx tsc --noEmit` — Same problem.
- ❌ `tsc -p apps/host/tsconfig.json` — Misses project references and cross-workspace types.

## Technical Details

- **Vite frontend apps** (`host`, `episodes`, `generator`, `world`, `ruleset`): Use `tsc -b --noEmit` because they have composite project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`).
- **NestJS server** (`server`): Uses `tsc --noEmit` with a flat `tsconfig.json`.
- **Shared packages** (`@repo/ui`, `@repo/auth`): Use `tsc --noEmit` with configs extending `@repo/typescript-config`.

## When to Run

- After modifying component props or interfaces
- After adding/removing imports across workspace boundaries
- Before considering a feature complete
- When debugging type errors reported by the IDE
