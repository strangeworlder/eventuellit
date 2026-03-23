---
name: Project Conventions & Coding Standards
description: Core coding conventions, naming rules, security policies, and mandatory project constraints for the Eventuellit TTRPG monorepo.
---

# Project Conventions & Coding Standards

## Agentic Workflow Directives

1. **Decision Record:** When a structural, architectural, or technical decision is finalized, immediately update `docs/architecture.md`, `docs/prd.md`, or `docs/rules.md`. The `docs/` folder is the ultimate source of truth.
2. **Context Checks:** Always verify requirements in `docs/prd.md` and architecture boundaries in `docs/architecture.md` before writing code.
3. **Continuous Learning:** If you make a mistake, encounter a bug that takes time to resolve, or learn a project-specific nuance, document it in `docs/learnings.md` so future agents avoid the same mistake.
4. **Proactive Documentation:** Update `docs/learnings.md` and `docs/rules.md` at the end of every major debugging or configuration session without waiting to be told.

## General Code Quality

- Write clean, self-documenting code.
- Prefer explicit over implicit behavior.
- **Test-Driven Development (TDD):** All meaningful logic (state hooks, component logic, backend services) must be accompanied by a Vitest test suite. Prioritize a test-first approach.
- **Linting & Formatting:** Use **Biome** exclusively. Do not use ESLint or Prettier. Code must pass `npm run lint` and `npm run format` before features are considered complete.

## Language Requirement

The entire user-facing application (UI, forms, error messages) MUST be in **Finnish ONLY**.
- Do not include English translations, even in parentheses.
- Even Storybook mock data and args must use Finnish text.
- Code structure (variables, components, API routes) uses English for developer conventionality, but anything the end-user or designer sees must match Finnish PRD terminologies (e.g. `Keho`, `Sisu`, `Kesto`).

## Naming Conventions

| Category | Convention | Example |
|---|---|---|
| React Components | `PascalCase` | `CharacterSheet` |
| Utility Functions/Hooks | `camelCase` | `useCharacterState` |
| Files/Folders | `kebab-case` | `character-sheet.tsx` |

## Security & Dependencies

- **NPM Workspaces:** Use traditional NPM (`npm@9.6.4+`). Use `*` for local package dependencies, NOT `workspace:*`.
- **Vite 6 Compatibility:** Ensure new frontend frameworks/server integrations support Vite 6 native dev servers. Express middlewares (`res.status().send()`) crash the environment.
- **Windows Runtime:** Account for NVM symlink limits (`Access is Denied`) and PowerShell script restrictions. Use `Set-ExecutionPolicy -Scope CurrentUser` natively.
- **Zero Vulnerabilities (Runtime):** Maintain strict zero-vulnerability policy for runtime dependencies. Build-time exceptions must be documented in `docs/learnings.md`.
- **No Hardcoded Endpoints:** API hosts, database URLs, and CORS origins must come from environment variables (`VITE_API_BASE_URL`, `DATABASE_URL`, `CORS_ORIGINS`).
- **Backend Input Whitelisting:** Nest controllers consume explicit DTO classes with `class-validator`. Global `ValidationPipe` runs with `whitelist: true` and `forbidNonWhitelisted: true`. Direct Drizzle insert types in `@Body()` are forbidden.

## Authentication

- Use `@repo/auth` hooks (`useAuth()`, `useRequireAuth()`) for authentication state.
- JWT tokens stored in httpOnly cookies.
- Protected routes use `useRequireAuth()` which redirects to `/kirjaudu` if unauthenticated.
- Magic link authentication uses email allowlist (users must exist in `users` table).
- In development, magic links are logged to the server console instead of being emailed.
