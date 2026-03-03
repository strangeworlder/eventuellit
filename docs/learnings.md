# Project Learnings & Nuances

This document serves as the "Continuous Learning Context" for the AI agents working on this TTRPG application.

## 🤖 Agentic Directive
Whenever you (the AI agent) make a mistake, encounter a hard-to-debug issue, or identify a project-specific architectural nuance that isn't obvious, you **MUST** document it here.

Before implementing complex features or debugging, review this file to ensure you don't repeat past mistakes.

---

### Resolved Issues & Nuances

#### 1. NestJS CLI npm Audit Vulnerabilities (Feb 2026)
**Issue:** scaffolding the NestJS backend via `@nestjs/cli` introduced ~11 moderate/high vulnerabilities according to `npm audit`. These stem from deeply nested dependencies inside the CLI's internal webpack/angular-devkit builder (e.g., `serialize-javascript`).
**Attempted Fix:** Running `npm audit fix --force` attempts to resolve them by forcefully downgrading the CLI from v11 to v7, which breaks the framework.
**Nuance/Resolution:** These are *build-time* vulnerabilities inside the CLI tool, not *runtime* vulnerabilities in our production codebase. 
**Action:** Do not forcefully downgrade the CLI. Ensure the CLI remains strictly a `devDependency`. Any *runtime* package vulnerabilities are strictly forbidden.

#### 2. Strict Finnish Localization in UI & Prototypes (Feb 2026)
**Issue:** During the creation of Storybook component prototypes, English translations were added in parentheses next to the Finnish button labels (e.g., "Hyökkää (Attack)") to help developers understand the component.
**Nuance/Resolution:** This violates the core design directive. The application MUST be purely in Finnish for the end-user, including all prototype or staging environments.
**Action:** Do not use English words in any UI layer, not even in Storybook `args` or mock data payloads. Utilize the `docs/prd.md` to map the English logic (e.g., `variant: 'primary'`) directly to the correct Finnish term (`Hyökkää`).
#### 3. Node v22, Storybook v8, and Vite SSR (Feb 2026)
**Issue:** Starting the Storybook React-Vite dev server failed entirely on Node v20 with native Vite plugins throwing `crypto.hash is not a function` or Node ESM module resolution errors. Secondarily, even on Node v22, `@storybook/blocks` internal dependency `tocbot` threw `HTMLElement is not defined` during SSR building. 
**Nuance/Resolution:** Modern Vite build tools (used by our micro frontends and Storybook) require Node v22+ (`nvm use 22`). The `HTMLElement` error is a known Windows/Vite SSR bug when evaluating purely browser-based node_modules during the dev server boot.
**Action:** 
- **Requirement:** Ensure development is always running on Node v22 (LTS) or higher.
- **Hack/Patch:** To bypass the `HTMLElement` crash in `@storybook/blocks`, the `node_modules/tocbot/dist/tocbot.cjs` package was manually patched.
- **PowerShell Execution Policies:** Sometimes `nvm` npm commands are blocked by Windows PowerShell policies. Use `cmd.exe /c "set PATH=C:\Users\alvan\AppData\Roaming\nvm\v22.21.1;%PATH% && npm run <script>"` to dynamically bypass them.

#### 4. Tailwind v4 and Vite/Storybook 500 Errors (Feb 2026)
**Issue:** Loading Storybook threw a `500 Internal Server Error`.
**Nuance/Resolution:** Tailwind CSS v4 migrated its PostCSS integration to a separate package. The legacy `postcss.config.js` with `tailwindcss: {}` will crash Vite 6.
**Action:** Always install `@tailwindcss/postcss` and use an ESM config `postcss.config.mjs` exporting `{ plugins: { "@tailwindcss/postcss": {} } }`.

#### 4.1. Tailwind v4 Monorepo Import Resolution (March 2026)
**Issue:** When migrating to Tailwind v4, consuming apps (like `generator` or `ruleset`) silently failed to bundle the utility classes utilized inside the `@repo/ui` package, rendering as raw HTML.
**Nuance/Resolution:** Tailwind v4 abandons `tailwind.config.ts` content arrays in favor of CSS `@import` graph traversal. If an app only imports the `ui` package's `styles.css` without first triggering the `@import "tailwindcss"` compiler root in its *own* local CSS, it will not scan the monorepo graph correctly.
**Action:** Every consumption app must contain `@import "tailwindcss";` at the very top of its `src/index.css`, followed by `@import "../../../packages/ui/src/styles.css";` and `@source "../../../packages/ui";` using exactly relative paths.

#### 5. Storybook 8.0, Vite 6, and Connect Middleware (Feb 2026)
**Issue:** Storybook component iframes threw a silent `500 Internal Server Error` rendering Vite 6. A headless fetch revealed a server crash with: `res.status is not a function`.
**Nuance/Resolution:** Vite 6 dropped its internal Express-based `Connect` middleware in favor of native Node servers. Early versions of Storybook 8 hardcoded `res.status(200).send()` in `@storybook/builder-vite`, completely breaking Vite 6 dev servers.
**Action:** 
- Upgraded the workspace UI dependencies to Storybook v10.2+ which fundamentally patches the Vite 6 builder.

#### 6. Storybook Automigration & Addons.Docs (Feb 2026)
**Issue:** Running `npx storybook upgrade` migrated `main.ts` but added an invalid export path causing Vite to crash with: `Package subpath './blocks/package.json' is not defined by "exports"`.
**Nuance/Resolution:** Modern Storybook deprecated the `/blocks` subpath inside `@storybook/addon-docs`.
**Action:** Simply import the root `@storybook/addon-docs` directly inside `main.ts` addons array.

#### 7. Windows NVM Symlinks "Access Denied" (Feb 2026)
**Issue:** Running `nvm use 22.21.1` in the local terminal failed with `exit status 5: Access is denied.`
**Nuance/Resolution:** Windows restricts normal user accounts from creating Symlinks. NVM creates a system-wide symlink at `C:\Program Files\nodejs`.
**Action:** Future executions must be done via an Administrator terminal OR by enabling "Developer Mode" in Windows 11 privacy settings.

#### 8. Vite Module Federation `remoteEntry.js` 404 & Port Floating (Feb 2026)
**Issue:** The `@originjs/vite-plugin-federation` remote entry failed to load in the host on `localhost:3001` with a `404 Not Found`. Additionally, restarting Turborepo shifted the remotes to `3002`/`3004` implicitly.
**Nuance/Resolution:** Vite `dev` runs an ES-module stream and does NOT compile `remoteEntry.js`. Module Federation technically requires static bundles. Furthermore, zombie Node processes occupy ports, pushing Vite to float its ports upwards automatically.
**Action:** 
- Remote apps MUST be served via `vite build && vite preview` while the Host consumes them in `vite dev`.
- Ensure all remote `vite.config.ts` profiles have `strictPort: true` for both `server` and `preview` settings.
- Kill ghost network ports natively before deploying the Turbo sequence (e.g. `npx kill-port 3001 3002 3003`).

#### 9. Turborepo "workspace:*" Link Bug (Feb 2026)
**Issue:** Linking local package dependencies inside `package.json` with `"@repo/ui": "workspace:*"` threw an `npm EUNSUPPORTEDPROTOCOL` format crash.
**Nuance/Resolution:** `workspace:*` is a syntax strictly localized to `pnpm` and `yarn`. Under a pure `npm` lockfile format, you must use the standard string `*` wildcard or an exact semantic version.

#### 10. Design System Component Usage (March 2026)
**Issue:** Raw HTML elements like `<button>` and custom div-based wrappers were actively used in the applications instead of the centralized design system components from `@repo/ui`. This caused the applications to visually desync from the intended retro spy thriller aesthetic when the central UI package was themed.
**Nuance/Resolution:** To maintain a cohesive design system and a single source of truth for aesthetics, applications must inherently utilize the shared components instead of repeating tailwind combinations.
**Action:** Always import and use the pre-built components (e.g., `<Button>`, `<Input>`, `<Card>`) from `@repo/ui` rather than composing raw HTML elements with raw Tailwind classes in the consuming workspaces.

#### 11. Strict Component Variants over Generic Props (March 2026)
**Issue:** Added `padding="sm"` and `spacing="lg"` props to `<CardContent>` to let apps adjust internal constraints.
**Nuance/Resolution:** Supplying generic style primitives mapping back into Tailwind breaks the core objective of a Design System. It pushes layout decisions back down to the application developer, resulting in a fragmented "do-whatever-you-want" UI where ten different apps might render ten different layouts for the same concept.
**Action:** Expose semantic variants (`variant: "stat-block" | "default" | "feature"`) encapsulating precise margins, typography, and spacing inside the generic component. The consumer apps request the intent, not the style.

#### 12. Design System as the Source of Typography Styles (March 2026)
**Issue:** Applications used standard HTML heading tags (e.g., `<h1>`, `<h2>`) and appended custom Tailwind typography classes (like `text-2xl`, `font-black`, `uppercase`) directly in the application code.
**Nuance/Resolution:** The design system should act as the single source of truth for styles, particularly typography. Allowing individual components or applications to define their own typography via classes leads to inconsistencies and duplicated effort.
**Action:** Create and utilize centralized typography components (like `<Heading>`) that inherently implement the design system's styles via predefined variants. Avoid passing raw typography `.className` strings from the application level whenever possible.

#### 13. Dynamic Theming Cascades vs Tailwind `@theme` Variables (March 2026)
**Issue:** When implementing dynamic themes using React props (e.g., `<Card theme="secondary-light">`), applying Tailwind semantic utility classes like `bg-surface` or `text-foreground` across nested subcomponents resulted in a failure to inherit the intended theme variables. Subcomponents wouldn't read the overridden CSS variables of their parent.
**Nuance/Resolution:** Tailwind's `@theme` alias mappings often don't behave nicely with cascading nested arbitrary `data-theme` overrides applied locally to DOM subtrees (e.g., when trying to combine opacities or `color-mix`). Relying on abstract aliases stripped the native CSS variable override inheritance.
**Action:** When styling a component inside the `@repo/ui` library that is expected to perfectly inherit its parent's dynamic `theme`, its classes MUST use explicit raw CSS variable strings (e.g. `bg-[var(--theme-bg)]`, `text-[var(--theme-text)]`, `border-[var(--theme-primary)]`). Avoid relying on abstract Tailwind utility aliases for colors meant to adapt via a theme context switch.
