---
name: Project Conventions & Coding Standards
description: Coding conventions, naming rules, security policies, and mandatory constraints for the Eventuellit TTRPG monorepo. Use when writing new code, creating files, or making architectural decisions.
---

# Project Conventions & Coding Standards

## Decision Records

When a structural or architectural decision is finalized, update `docs/architecture.md`, `docs/prd.md`, or `docs/rules.md`. The `docs/` folder is the source of truth. Document mistakes and nuances in `docs/learnings.md`.

## Finnish-Only UI

Everything the end-user or designer sees MUST be in Finnish. No English translations, not even in parentheses. Storybook mock data included. Code identifiers (variables, components, routes) use English.

## Naming Conventions

| What | Convention | Why |
|---|---|---|
| Component files | `PascalCase.tsx` | Matches the exported component name |
| Hook/utility files | `camelCase.ts` | Standard JS convention |
| Multi-word utility files | `kebab-case.ts` | e.g., `article-navigation-utils.tsx` |
| Folders | `kebab-case` | |
| React Components | `PascalCase` | |
| Functions/Hooks | `camelCase` | |

## Linting & Formatting

**Biome** exclusively. No ESLint, no Prettier. Code must pass `npm run lint` and `npm run format`.

## Testing

All meaningful logic must have Vitest tests. Test-first approach preferred.

## Security & Dependencies

- **NPM Workspaces:** Use `*` for local package dependencies, NOT `workspace:*`. We use `npm@10.9.2+` with traditional workspaces.
- **Zero runtime vulnerabilities.** Build-time exceptions documented in `docs/learnings.md`.
- **No hardcoded endpoints.** API hosts, DB URLs, CORS origins come from env vars.
- **Backend input whitelisting:** Nest controllers use explicit DTO classes with `class-validator`. Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`. No raw Drizzle types in `@Body()`.
- **Windows runtime:** Account for NVM symlink limits and PowerShell restrictions.

## State Management

- **Local React state** for view and form state within each MFE.
- **TanStack Query** for server-state fetching, caching, and optimistic updates.
- **No global Zustand store** — cross-MFE global state requires an explicit architectural decision.

## Authentication

- `@repo/auth` hooks: `useAuth()`, `useRequireAuth()`.
- JWT in httpOnly cookies. Protected routes redirect to `/kirjaudu`.
- Magic link auth with email allowlist. Dev mode logs links to console.

## Changelog

When delivering a new feature or significant change, add a corresponding entry to `apps/host/src/changelog-data.ts`. Don't defer this — update the changelog as part of the feature work, not retroactively. Entries follow the `ChangelogRelease` type: categorized into `features`, `major` (architectural), and `minor` (fixes/improvements), all in Finnish. Link to the relevant route when applicable.
