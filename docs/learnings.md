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

#### 14. Dynamic Heading Contexts vs Hardcoded Props (March 2026)
**Issue:** Hardcoding the `as="h5"` and `variant="h5"` properties on the `<Heading>` component within reusable UI elements (like `StatBlock` or `CardTitle`) breaks the component's ability to scale based on its DOM position.
**Nuance/Resolution:** The `<Heading>` component leverages `HeadingLevelProvider` to automatically infer its correct semantic level (e.g. `n + 1`) based on where it is placed in the tree. Hardcoding the props forces the heading to ignore this dynamic context, leading to incorrect semantic document outlines and inflexible styling.
**Action:** Always omit the `as` and `variant` props on `<Heading>` when integrating it into lower-level, highly reusable layout components. Let the typography dynamically scale by wrapping parent sections with a `<HeadingLevelProvider>` rather than forcing a specific tag.

#### 15. Secondary Component Theming Semantics (March 2026)
**Issue:** Secondary components like the Sidebar were forcefully setting `<aside theme="secondary-dark">` to get a specific look, which bypassed the active global theme set by the user and disrupted the unified aesthetic.
**Nuance/Resolution:** According to the Design System (`Themes.stories.tsx`), secondary supporting components should *inherit* the theme gracefully. Instead of hardcoding a theme, they should use `transparent` backgrounds, and swap primary colors for `border-[var(--theme-secondary)]` and `text-[var(--theme-secondary)]`.
**Action:** Never hardcode `theme="..."` on secondary layout components. Always let the theme fall through from the root context and use secondary scoped variables (`var(--theme-secondary)`) to avoid overpowering the primary content surface.

#### 16. Mobile Overlay Z-Index Stacking Context (March 2026)
**Issue:** A mobile backdrop overlay (`z-40`) rendered on top of the Sidebar menu because the App layout container applied a generic `z-20` class to the Sidebar component via props causing a conflict.
**Nuance/Resolution:** Tailwind's `cn` merge function resolves conflicts by prioritizing the last class evaluated. Thus, `className="... z-20"` from a parent overriding a child's internal `className="... z-50"` will win. However, if the child uses a responsive prefix like `max-desktop:z-50`, Tailwind correctly preserves it over un-prefixed base classes.
**Action:** When building off-canvas or overlay components (like modals or drawers), explicitly declare their required z-index using the precise responsive breakpoint prefix (e.g., `max-desktop:z-50`) to guarantee their stacking context is isolated and cannot be accidentally overridden by a parent container using base modifier classes.

#### 17. Extending Core Components over HTML Elements (March 2026)
**Issue:** We used raw `<button>` elements in the `Sidebar` to achieve custom "nav" sizes and transparent behavior instead of utilizing the `packages/ui` `<Button>` component.
**Nuance/Resolution:** Using raw HTML fragments prevents global typography and transition rules from applying consistently. The solution is to extend the `<Button>` component's Props to support new variants (e.g., `variant="ghost-secondary"`, `size="nav"`, `justify="start"`) rather than abandoning it.
**Action:** Do not write raw semantic HTML elements (`<button>`, `<a>`) for interactive elements in consumers. If the Design System lacks a specific layout permutation, extend the `packages/ui` core component's configuration to support it globally.

#### 18. Structural Design Tokens (Breakpoints, Spacing, Radius) (March 2026)
**Issue:** Consumer applications were using generic Tailwind breakpoints (`md:`, `lg:`) and arbitrary spacing/radius values which led to inconsistent responsive behaviors and layouts.
**Nuance/Resolution:** We migrated to a unified set of Design Tokens documented in Storybook (`Tokens.stories.tsx`). This includes custom semantic breakpoints (`mobile`, `tablet`, `desktop`, `x-wide`) registered in Tailwind v4's `@theme` directive, as well as standardized spacing and border-radius scales.
**Action:** Always use the custom semantic breakpoints (`tablet:flex`, `max-desktop:hidden`) instead of default Tailwind breakpoints. Avoid using arbitrary values in classes (like `w-[320px]` or `p-[18px]`); stick strictly to the documented spacing and layout scales.

#### 19. Primary Variant Pattern for Stat Blocks (March 2026)
**Issue:** `StatBlock` and `ActiveStatBlock` only supported `secondary` and `accent`, causing inconsistent primary-surface behavior versus other core components.
**Nuance/Resolution:** Components exposing a `primary` variant must use `primaryThemeMap` to swap `data-theme` relative to their parent context and provide the resolved theme through `ThemeContext` for nested descendants.
**Action:** For `primary`, resolve with `useCurrentTheme -> baseTheme -> primaryThemeMap[baseTheme]`; for non-primary variants, keep inherited theming unless an explicit `theme` prop is provided.

#### 20. Mixed Jest/Vitest Test Gate Drift in Server (March 2026)
**Issue:** Root `npm test` used Vitest while `apps/server` still used Jest scripts/config and Jest-specific test doubles, causing server tests to fail or be skipped under the real workspace gate.
**Nuance/Resolution:** The backend must run on the same Vitest stack as the rest of the monorepo to keep CI signal reliable and avoid toolchain split-brain.
**Action:** Migrate `apps/server` test scripts to Vitest, add local `vitest.config.ts` (`globals: true`), replace `jest.fn` with `vi.fn`, and remove obsolete Jest config artifacts.

#### 21. Backend Input Safety and Runtime Env Hardening (March 2026)
**Issue:** Character endpoints accepted broad Drizzle insert payloads directly, CORS was wildcarded, and DB/API runtime defaults were hardcoded to localhost credentials/URLs.
**Nuance/Resolution:** Relying on inferred ORM insert types at controller boundaries enables over-posting and malformed writes. Hardcoded runtime endpoints create deployment drift and increase security risk.
**Action:** Introduce explicit DTOs with `class-validator`, enforce global `ValidationPipe` (`transform + whitelist + forbidNonWhitelisted`), map service writes to allowed fields only, require `DATABASE_URL`/`CORS_ORIGINS`, and require frontend `VITE_API_BASE_URL` for API calls.

#### 22. Storybook Text Is Part of Finnish-Only Surface (March 2026)
**Issue:** English labels and descriptions in Storybook stories (including ARIA labels and component demo content) drifted from the Finnish-only UI requirement.
**Nuance/Resolution:** Storybook is treated as a user-facing design surface in this project. Localization rules apply to stories, labels, and accessibility text, not only production routes.
**Action:** Keep Storybook-visible copy in Finnish by default, including demo labels and component explanatory text.

#### 23. Remove Nest Scaffold Endpoints Early (March 2026)
**Issue:** Retaining default Nest `Hello World` controller/service/tests creates noise and can falsely signal API coverage while not representing domain behavior.
**Nuance/Resolution:** Scaffold artifacts quickly become technical debt and can mask missing contract tests for real modules.
**Action:** Remove starter controller/service and generic e2e specs once feature modules are in place; keep server README project-specific.

#### 24. Vitest Workspace Config Compatibility (March 2026)
**Issue:** Root test execution silently diverged because `vitest.workspace.ts` used `defineWorkspace`/CLI behavior not supported in the installed Vitest runtime.
**Nuance/Resolution:** Even when `apps/server` passes locally with its own config, the root gate can still fail if workspace-level globals are not applied consistently.
**Action:** Use a root `vitest.config.ts` with explicit `include` globs and `globals: true`, and run root tests through that single config.

#### 20. Episode Images in Host-Mounted Microfrontend (March 2026)
**Issue:** Episode images rendered inside the host-mounted `episodes` microfrontend cannot reliably use plain root-relative paths like `/images/...`, because those resolve to the host origin instead of the remote origin during Module Federation composition.
**Nuance/Resolution:** Image assets are now generated at build-time from `apps/episodes/src/content/images` into responsive `avif/webp/jpg` variants plus a tiny placeholder in `apps/episodes/public/images`, with a generated `manifest.json`. Runtime image URLs must be resolved against `new URL(import.meta.url).origin` before rendering.
**Action:** Keep episode markdown image references as frontmatter keys (e.g. `image: jakso-1`), load `public/images/manifest.json` in the app, then resolve every manifest path to remote-origin URLs before passing them into the shared `ImageElement` component.

#### 24. Semantic Image Variants for Themed Placement Consistency (March 2026)
**Issue:** A single image style made sidebar usage work, but it did not guarantee visual consistency when placing image+caption blocks in different layout contexts across the app.
**Nuance/Resolution:** `ImageElement` now exposes strict semantic variants (`primary`, `secondary`, `accent`) aligned with design-system theme semantics. The original look was normalized as `secondary`, while `primary` and `accent` provide predictable alternatives without ad-hoc consumer styling.
**Action:** Default `ImageElement` to `variant="secondary"` and require consumers to opt into `primary` or `accent` intentionally for featured placements.

#### 25. Badge Micro-Typography Alignment with Theme Showcase (March 2026)
**Issue:** The generic `Badge` component used a slightly heavier footprint (`text-sm` + medium weight), which did not match the tighter, more polished badge chip shown in the `Themes.stories.tsx` accent showcase.
**Nuance/Resolution:** The accent showcase chip establishes the preferred micro-typography baseline for badge-like labels in the design system.
**Action:** Keep `Badge` typography aligned to the showcase style by using `text-xs` + `font-bold` with `px-3 py-1` pill spacing as the default baseline.

#### 26. Solid Accent Badge as an Explicit Semantic Variant (March 2026)
**Issue:** `Themes.stories.tsx` used a bespoke `<span>` for the accent status chip, while `Badge` lacked a variant that produced the same filled accent pill.
**Nuance/Resolution:** A repeated visual idiom (filled accent status chip) should be represented by a design-system variant, not ad-hoc story markup.
**Action:** Use `Badge variant="accent-solid"` for filled status chips (`bg-[var(--theme-accent)] text-[var(--theme-bg)]`) and replace custom inline chip spans in stories with the shared component.

#### 27. NPM Workspace Install Drift Causes False TS2307 in Server (March 2026)
**Issue:** `apps/server` DTO imports from `class-validator` failed with `TS2307: Cannot find module 'class-validator'` even though the dependency already existed in `apps/server/package.json`.
**Nuance/Resolution:** In this npm workspace setup, declarations in `package.json` are not enough if workspace installs are stale. TypeScript can report module-not-found when the package is simply absent from `node_modules`.
**Action:** Run `npm install -w @eventuellit/server` after dependency edits (or when module resolution unexpectedly fails), then verify with `npm run -w @eventuellit/server build`.

#### 28. Storybook 10 Drift: Remove Unused Legacy Packages Instead of Mixing Majors (March 2026)
**Issue:** `@repo/ui` built successfully with Storybook 10, but still declared `@storybook/blocks@8` and `@storybook/test@8`, producing compatibility warnings and future fragility.
**Nuance/Resolution:** If those packages are not imported in stories or config, the safest fix is removal, not partial major upgrades. Keeping mixed major Storybook packages creates false confidence because build may still pass transiently.
**Action:** Keep `@storybook/*` dependencies aligned to the active major and remove unused legacy packages from `packages/ui/package.json`, then refresh lockfile with `npm install -w @repo/ui`.

#### 29. Storybook IA Drift: Mixed English/Finnish Roots Hide Component Ownership (March 2026)
**Issue:** Storybook navigation mixed roots (`Components`, `Design System`, `Layout`, `Typography`, `TTRPG`, `Suunnittelujarjestelma`), making it unclear what belongs to the Design System versus demos/foundations.
**Nuance/Resolution:** A unified top-level namespace and semantic subgroups makes ownership and extraction boundaries explicit.
**Action:** Normalize story titles under `Suunnittelujarjestelma/*` and separate categories into `Komponentit`, `Perustat`, `Rakenne`, and `Pelimekaniikka`.

#### 30. App-Level UI Repetition: Prefer DS Primitives Before Composite Abstractions (March 2026)
**Issue:** Loading and notice patterns were repeated with ad-hoc Tailwind blocks across host/generator views, while larger composite candidates (`RoutedTabs`, feature-card navigation) still vary by app routing context.
**Nuance/Resolution:** High-frequency, low-variance patterns should be extracted immediately (`LoadingState`, `NoticePanel`). Route-driven composites should remain app-shell composition until two stable implementations converge on the same API.
**Action:** Extract and adopt shared primitives first; defer DS-level `RoutedTabs`/feature-card composites until repeated behavior is truly stable across apps.

#### 31. ImageElement Lightbox Must Be Portaled for True Fullscreen Behavior (March 2026)
**Issue:** Inline editorial images in app layouts are often intentionally smaller than the source asset, which requires an image modal to inspect the full-size visual. Rendering the modal inside the image wrapper can be clipped by local layout constraints (like `overflow-hidden`).
**Nuance/Resolution:** A design-system lightbox should render as a classic gallery overlay via `ReactDOM.createPortal(..., document.body)` so it escapes local stacking/clipping contexts while keeping accessibility controls (Esc close, backdrop close, focus restore).
**Action:** Keep `ImageElement` click-to-zoom behavior in the component itself, but always portal the dialog overlay to `document.body` and provide keyboard-operable close controls.

#### 32. Host Shell Must Not Override Active Theme Context (March 2026)
**Issue:** `apps/host/src/App.tsx` hardcoded `data-theme="inverted"` at the root and set `theme="base"` on the sidebar, causing the shell to ignore the active theme context and forcing mismatched colors in composed views.
**Nuance/Resolution:** The host shell is a secondary layout surface and must inherit theme context instead of overriding it. Theme-aware classes should use explicit CSS variables (`var(--theme-*)`) rather than fixed aliases/hardcoded colors.
**Action:** Remove hardcoded theme props from host shell containers and use explicit variable-based classes such as `bg-[var(--theme-bg)]`, `text-[var(--theme-text)]`, and selection colors tied to theme variables.