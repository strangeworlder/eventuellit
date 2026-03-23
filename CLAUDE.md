# Eventuellit – Project Instructions for Claude

## TypeScript Type Checking

> [!CAUTION]
> **NEVER run bare `npx tsc` or `npx tsc --noEmit` from any location in this project.** There is no root `tsconfig.json`, so bare `tsc` produces garbage output and wastes time.

### The correct command

```bash
npm run check-types
```

This uses Turborepo to execute the correct `check-types` script in every workspace.

### Per-workspace checks

```bash
npm run check-types -w <workspace-name>
```

Available workspaces: `@eventuellit/host`, `@eventuellit/episodes`, `@eventuellit/generator`, `@eventuellit/world`, `@eventuellit/ruleset`, `@eventuellit/server`, `@repo/ui`, `@repo/auth`.

### Why bare tsc doesn't work

- Vite frontend apps use `tsc -b --noEmit` (composite project references).
- The NestJS server uses `tsc --noEmit` with a flat tsconfig.
- Shared packages use `tsc --noEmit` with configs extending `@repo/typescript-config`.
- Running bare `tsc` or `tsc -p <path>` misses project references and cross-workspace types.

## Additional Skills

Detailed skills are available in the `claude-skills/` directory:
- `claude-skills/typecheck/SKILL.md` – Full typecheck details
- `claude-skills/ui-design-system/SKILL.md` – UI design system conventions

## Workflows

Agent workflows are in `.agents/workflows/`:
- `typecheck.md` – Type checking steps
- `deploy.md` – Deployment
- `setup.md` – Local environment setup
- `ui-development.md` – UI component and Storybook development
