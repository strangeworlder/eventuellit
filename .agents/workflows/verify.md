---
description: Run full verification (TypeScript, Biome lint, and tests) across the monorepo
---

# Monorepo Verification Workflow

Run this workflow before concluding any task, completing a feature, or committing code changes.

## Quick Verification (All-in-One Macro)

Run both TypeScript checks and Biome linting in one command:

```bash
npm run verify
```

## Individual Checks

### 1. Biome Linting & Formatting Check

```bash
npm run lint
```

- Must pass with 0 errors.
- If errors or formatting differences are reported, run auto-fix:
  ```bash
  npm run lint:fix
  ```
  or for formatting only:
  ```bash
  npm run format
  ```

### 2. TypeScript Type Checking

```bash
npm run check-types
```

- Never run bare `npx tsc` from the root (there is no root `tsconfig.json`).
- To check an individual workspace:
  ```bash
  npm run check-types -w <workspace-name>
  ```

### 3. Unit Tests

When business logic, hooks, state, or components were modified:

```bash
npm test
```

Runs Vitest non-interactively across the monorepo.

