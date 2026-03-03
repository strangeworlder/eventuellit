# Coding Conventions and Rules

## 🤖 Agentic Workflow Directives
1. **Decision Record:** Whenever a structural, architectural, or technical decision is finalized with the user, you MUST immediately update `docs/architecture.md`, `docs/prd.md`, or this `docs/rules.md` file. The documentation in the `docs/` folder is the ultimate source of truth.
2. **Context Checks:** Always verify requirements in `docs/prd.md` and architecture boundaries in `docs/architecture.md` before writing code.
3. **Continuous Learning:** If you make a mistake, encounter a bug that takes time to resolve, or learn a project-specific nuance, you MUST document it in `docs/learnings.md` so future agents avoid the same mistake.

## General
- Write clean, self-documenting code.
- Prefer explicit over implicit behavior.
- **PROACTIVE DOCUMENTATION:** You (the AI) MUST proactively update `docs/learnings.md` and `docs/rules.md` at the end of every major debugging or configuration session. *Do not wait for the user to tell you to log what you learned.*
- **Language Requirement:** The entire user-facing application (UI, forms, error messages) MUST be in Finnish ONLY. **Do not include English translations, even in parentheses, and even in mock data like Storybook args.** Our code structure (variables, components, API routes) will be written in English for developer conventionality, but anything the end-user or designer sees must perfectly match the Finnish PRD terminologies (e.g. `Keho`, `Sisu`, `Kesto`).
- **Test-Driven Development (TDD):** All meaningful logic (state hooks, component logic, backend services) MUST be accompanied by a Vitest test suite. We prioritize a test-first approach.
- **Linting & Formatting:** We use **Biome**. Do not use ESLint or Prettier commands. Code must pass `npm run lint` and `npm run format` (Biome checks) before features are considered complete.

## Security & Dependencies
- **NPM Workspaces over PNPM/Yarn Syntax:** We use traditional NPM (`npm@9.6.4+`). Do not use the `pnpm` style `"workspace:*"` alias dependencies in `package.json`. Always use `*` to designate an internal local package without a publishing registry version.
- **Vite 6 Ecosystem Compatibility:** Ensure any new frontend frameworks or server integrations support Vite 6 native dev servers. Express middlewares (e.g. `res.status().send()`) will crash the environment. Be aggressive with dependency version alignments.
- **Windows Runtime Environment:** Any command invoking Node environment shifting MUST account for NVM symlink limits (`Access is Denied`) and PowerShell script restrictions. Utilize `Set-ExecutionPolicy -Scope CurrentUser` natively.
- **Zero Vulnerabilities:** We maintain a strict zero-vulnerability policy for all *runtime* dependencies. If a new package introduces a vulnerability, an alternative must be found. 
- **Build-time Exceptions:** If a widely-used build tool (like `@nestjs/cli` or Vite) flags a vulnerability deep in its dependency tree that cannot be non-destructively patched, it MUST be documented in `docs/learnings.md` with an explanation.

## Naming Conventions
- React Components: `PascalCase`
- Utility Functions/Hooks: `camelCase`
- Files/Folders: `kebab-case` (e.g., `character-sheet.tsx`)

## Styling
- Strict use of Tailwind CSS utility classes.
- Do not write custom CSS unless absolutely required for a specific animation or escape hatch not supported by Tailwind primitives.
- Use the `packages/ui` design system components rather than hardcoding repeated UI elements or using raw HTML elements (e.g., use `<Button>` instead of `<button>`, use `<Card>` instead of custom wrapper divs) to ensure styling consistency.
- **Strict Semantic Design System Variants:** Components in `@repo/ui` MUST NOT expose generic layout utility props to consumers (e.g. `interface CardProps { padding: 'sm' | 'md', spacing: 'lg' }`). This turns the Design System into a generic stylistic mess. Instead, build specific, semantic, highly-opinionated `variant` props (e.g. `variant: "feature" | "compact" | "rule"`) that internally map specific spacing, paddings, and typography to fit that feature's intended visual structure. Consumers pick the *purpose* of the component, not its literal pixels.
