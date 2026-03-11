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
- **Ruleset Markdown Heading Baseline:** In `apps/ruleset/src/content/*.md`, top-level content headings MUST start at `###` (H3), with nested sections at `####` (H4), to match page composition and heading hierarchy.
- **Test-Driven Development (TDD):** All meaningful logic (state hooks, component logic, backend services) MUST be accompanied by a Vitest test suite. We prioritize a test-first approach.
- **Linting & Formatting:** We use **Biome**. Do not use ESLint or Prettier commands. Code must pass `npm run lint` and `npm run format` (Biome checks) before features are considered complete.

## Security & Dependencies
- **NPM Workspaces over PNPM/Yarn Syntax:** We use traditional NPM (`npm@9.6.4+`). Do not use the `pnpm` style `"workspace:*"` alias dependencies in `package.json`. Always use `*` to designate an internal local package without a publishing registry version.
- **Vite 6 Ecosystem Compatibility:** Ensure any new frontend frameworks or server integrations support Vite 6 native dev servers. Express middlewares (e.g. `res.status().send()`) will crash the environment. Be aggressive with dependency version alignments.
- **Windows Runtime Environment:** Any command invoking Node environment shifting MUST account for NVM symlink limits (`Access is Denied`) and PowerShell script restrictions. Utilize `Set-ExecutionPolicy -Scope CurrentUser` natively.
- **Zero Vulnerabilities:** We maintain a strict zero-vulnerability policy for all *runtime* dependencies. If a new package introduces a vulnerability, an alternative must be found. 
- **Build-time Exceptions:** If a widely-used build tool (like `@nestjs/cli` or Vite) flags a vulnerability deep in its dependency tree that cannot be non-destructively patched, it MUST be documented in `docs/learnings.md` with an explanation.
- **No Hardcoded Runtime Endpoints/Credentials:** API hosts, database URLs, and CORS origins must come from environment variables (`VITE_API_BASE_URL`, `DATABASE_URL`, `CORS_ORIGINS`). Do not commit localhost defaults in runtime code.
- **Backend Input Whitelisting:** Nest controllers must consume explicit DTO classes validated by `class-validator`. Global `ValidationPipe` must run with `whitelist: true` and `forbidNonWhitelisted: true`; direct Drizzle insert types in `@Body()` are forbidden.
- **Authentication:** Use `@repo/auth` hooks (`useAuth()`, `useRequireAuth()`) for authentication state. JWT tokens are stored in httpOnly cookies for security. Protected routes should use `useRequireAuth()` which automatically redirects to `/kirjaudu` if unauthenticated. Magic link authentication uses email allowlist (users must exist in `users` table).

## Naming Conventions
- React Components: `PascalCase`
- Utility Functions/Hooks: `camelCase`
- Files/Folders: `kebab-case` (e.g., `character-sheet.tsx`)

## Styling
- Strict use of Tailwind CSS utility classes.
- Do not write custom CSS unless absolutely required for a specific animation or escape hatch not supported by Tailwind primitives.
- Use the `packages/ui` design system components rather than hardcoding repeated UI elements or using raw HTML elements (e.g., use `<Button>` instead of `<button>`, use `<Card>` instead of custom wrapper divs) to ensure styling consistency.
- **Strict Semantic Design System Variants:** Components in `@repo/ui` MUST NOT expose generic layout utility props to consumers (e.g. `interface CardProps { padding: 'sm' | 'md', spacing: 'lg' }`). This turns the Design System into a generic stylistic mess. Instead, build specific, semantic, highly-opinionated `variant` props (e.g. `variant: "feature" | "compact" | "rule"`) that internally map specific spacing, paddings, and typography to fit that feature's intended visual structure. Consumers pick the *purpose* of the component, not its literal pixels.
- **Explicit Dynamic Theming Inheritance:** When building UI components expected to inherit colors from dynamic nested themes (`data-theme="X"`), explicitly reference CSS variables directly via utility aliases (e.g., `bg-[var(--theme-bg)]` and `text-[var(--theme-primary)]`). DO NOT rely on abstract Tailwind `@theme` alias mappings (like `bg-surface`), as they fail to cleanly cascade when combining them with opacity limits or `color-mix` across dynamic structural boundaries.
- **Secondary Component Semantics:** Secondary layout components (like Sidebars, Footers, dividing panels) MUST gracefully inherit the global active theme context. They should rely heavily on the `[var(--theme-secondary)]` scoping with `transparent` backgrounds. They must NEVER artificially inject a hardcoded `theme="..."` prop to force a specific colorway, as that breaks the primary surface scaling.
- **Extend, Don't Abandon:** If a core UI component (e.g., `Button`) does not have the styling variant needed (e.g., a "ghost-secondary" nav item), DO NOT fall back to a raw HTML `<button>` in the application. Always extend the Design System component by adding the missing robust `variant` or `size` property.
- **Danger Affordance Must Be Multi-Cue:** Destructive actions in shared DS components (especially `Button` `variant="danger"`) MUST NOT rely on color alone. Use at least one additional semantic cue (iconography, structural border/shape difference, or explicit text treatment) that remains recognizable across themes.
- **Guaranteed Stacking Context (Z-Index):** Off-canvas features, dialogs, and overlays MUST declare their z-index utilizing strict responsive prefixes (e.g., `max-desktop:z-50`) to enforce their dominance. Relying on base `z-50` strings will fail via `tailwind-merge` if a consumer app tries passing a parent utility class like `className="z-20"` down through props.
- **Custom Breakpoints:** We utilize explicit breakpoints defined in `packages/ui/src/styles.css` instead of Tailwind defaults: `mobile` (550px), `tablet` (700px), `desktop` (900px), `x-wide` (1200px), `xx-wide` (1500px). Always use these named breakpoints (`desktop:flex`, `max-desktop:hidden`) rather than Tailwind's generic `lg` or `md` abstractions.
- **Structural Design Tokens:** Avoid arbitrary values in Tailwind classes (e.g., `p-[18px]`, `w-[300px]`, `rounded-[10px]`). Strictly adhere to the standard spacing and border-radius scales documented in the Design System's `Tokens.stories.tsx`. Layouts should be predictable and conform to the grid.
- **Portaled Overlay Theme Fidelity:** Any UI rendered via `ReactDOM.createPortal(..., document.body)` (lightboxes/modals/popovers) must preserve the nearest active `data-theme` scope from its trigger/source element. Do not assume parent DOM inheritance survives a portal boundary.

## Microfrontend Assets
- **Remote-Origin Asset Resolution:** In host-mounted MFEs, do not rely on root-relative static paths (for example `/images/...`) for remote-owned assets. Resolve URLs against the remote origin (`new URL(import.meta.url).origin`) and use manifest-driven paths where applicable so assets load correctly when composed by the host.