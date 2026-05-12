# Project Learnings & Nuances

This file is a rolling, purge-friendly log of high-signal lessons.

Long-term policy belongs in `docs/rules.md` and `docs/architecture.md`.
Operational runbooks belong in `.agents/workflows/`.

---

## How To Use This File

- Read this file before complex debugging or refactors.
- If a learning is evergreen, promote it to canonical docs immediately.
- If a learning is a repeatable fix, move it to a workflow.
- Keep this file concise by removing historical noise after promotion.

For purge operations, follow `.agents/workflows/learnings-retention.md`.

---

## Active Learnings

### Design System & UI

#### 1) Color Tokens Must Be Pre-Computed Solid Values — Never Opacity Modifiers
**Date:** 2026-03-24
**Issue:** Opacity modifiers on text (`text-[var(...)]/50`, `opacity-60`) and interactive backgrounds (`hover:bg-[var(...)]/10`) produce theme-dependent, unauditable contrast ratios that fail WCAG AA on non-base themes. `color-mix()` on text colors has the same problem.
**Action:** Introduced six semantic CSS tokens per theme in `styles.css` — `--theme-text-muted`, `--theme-text-subtle`, `--theme-text-placeholder`, `--theme-surface-tint`, `--theme-border-soft`, `--theme-border-medium` — all solid scale colors with verified contrast ratios. See the `ui-design-system` skill for full rules. Key pitfall: on dark themes, `--theme-secondary` sits at a *mid* scale step and is **darker** than `--theme-text-muted` (a high step), so hover text should always go to `--theme-text` (full contrast), not `--theme-secondary`.

#### 2) New DS Components Must Follow Shared Structural & Styling Conventions
**Date:** 2026-03-11
**Issue:** Components added to `@repo/ui` sometimes ship without `forwardRef`, `displayName`, or `theme` prop, and use off-pattern tokens (`rounded-md`, `ring-1`, `shadow-lg`, arbitrary `max-w-[calc(...)]`) that diverge from the established DS visual language.
**Action:** All new `@repo/ui` components must follow the shared DS contract: `React.forwardRef` with `displayName`, optional `theme?: Theme` prop piped to `data-theme`, explicit `font-sans`, and token-scale values (`rounded-sm` for small utilities, `border` over `ring`, `shadow-md` for floating overlays, standard `max-w-*` over arbitrary calc). Stories must use DS `<Button>` instead of raw `<button>` elements.

#### 3) Button Component Must Define All Interactive States Explicitly
**Date:** 2026-03-11
**Issue:** The `@repo/ui` `Button` only had a minimal `disabled:opacity-50` and no loading, focus-visible ring, or active/pressed state.
**Action:** Enhanced `Button` with four explicit state layers: **disabled** (`opacity-40 grayscale-[40%] cursor-not-allowed shadow-none translate-y-0 scale-100`), **loading** (spinner + `cursor-wait pointer-events-none` while keeping full visual opacity), **focus-visible** (2px ring using `--theme-secondary` with offset against `--theme-bg`), and **active/pressed** (`translate-y-0 scale-[0.98]` snap-back + per-variant background deepening). Consumers should use the `loading` prop instead of manually wiring `disabled={isPending}` + text swaps.

#### 4) Danger Buttons Need Multi-Cue Affordance, Not Color Alone
**Date:** 2026-03-11
**Issue:** Destructive actions were primarily signaled by color, which is insufficient for accessibility.
**Action:** `Button` `danger` combines multiple cues: default foreground danger icon, subtle background icon layer, stronger structural border/shadow treatment, and distinct pressed behavior. Keep the affordance token-driven and theme-aware.

#### 5) Storybook Taxonomy Must Use Single Finnish Root Namespace
**Date:** 2026-03-25
**Issue:** Story titles were inconsistently named across component groups, leading to chaotic Storybook navigation.
**Action:** All stories must use the `Suunnittelujarjestelma` root namespace with sub-categories: `Komponentit/*` (reusable UI), `Perustat/*` (tokens, themes, typography), `Rakenne/*` (layout primitives), `Pelimekaniikka/*` (game domain). Defined in `docs/architecture.md`.

#### 6) Massive DS Expansion Requires Component Guide Maintenance
**Date:** 2026-03-24 → 2026-05-12
**Issue:** The design system grew from ~40 to ~80 components in this period. New components added: `Accordion`, `Breadcrumb`, `Code`, `ConfirmDialog`, `CustomIcon`, `DatePicker`, `Dialog` (rewritten), `Drawer`, `EditableField`, `EmptyState`, `EntityCard`, `ErrorBoundary`, `FactionBadge`, `FieldDescription`, `FieldError`, `FieldLabel`, `ImageField`, `Layout`, `MfeNotFoundRedirect`, `NavButton`, `Pagination`, `QuickViewPanel`, `Separator`, `Skeleton`, `SkillMasonry`, `SkillTagList`, `Table`, `Tabs`, `Toast`, `ToolButton`, `TopNav` (rewritten), `UtilityPage`, plus hooks (`useFocusTrap`, `useObscuredGlitch`, `useArticleScrollProgress`, `usePillIndicator`) and utilities (`hyphenation.ts`, `attribute-dice.ts`).
**Action:** Keep `packages/ui/src/components/ComponentGuide.mdx` updated when adding or significantly modifying components. The Storybook MCP is available but fallback to ComponentGuide when MCP is unavailable.

### Media & Images

#### 7) Images Must Be Stored in Cloudflare R2, Not Git
**Date:** 2026-05-12
**Issue:** Storing ~120MB of image binaries (source PNGs + generated responsive variants) in git is unsustainable — bloats repo permanently, slows clones, and makes CI expensive.
**Action:** All images are now stored in Cloudflare R2 (`eventuellit-media` bucket, public URL: `pub-af583d95f0c543179e569e08a407bc5e.r2.dev`). Per-app `optimize-images.mjs` scripts, `sharp` devDependencies, and `predev`/`prebuild` hooks have been removed from MFEs. The `scripts/migrate-images-to-r2.mjs` handles batch optimization + upload.

#### 8) R2 Images Must Be Pre-Optimized with Sharp Before Upload
**Date:** 2026-05-12
**Issue:** Cloudflare edge transforms (`cdn-cgi/image/...`) require the domain to be on Cloudflare DNS. Since `eventuell.it` DNS is managed by Joker, we use the `r2.dev` public URL which has no transform support.
**Action:** All images are optimized locally or server-side via `sharp` before uploading to R2: AVIF/WebP/JPG variants at 480, 768, 1200, and original widths, plus a base64 blur placeholder. A unified `manifest.json` is uploaded to `images/manifest.json` on R2. `ImageElement` fetches this manifest from the R2 origin and uses it for responsive source sets — same behavior as the old local pipeline.

#### 9) ImageElement CDN URL Handling: No Special Bypass Needed
**Date:** 2026-05-12
**Issue:** An initial attempt to bypass manifest lookup for R2 URLs (`isExternalCdnUrl()`) was unnecessary since R2 now hosts a proper `manifest.json`.
**Action:** Removed `EXTERNAL_CDN_PATTERNS` and `isExternalCdnUrl`. ImageElement treats R2 origins the same as MFE origins — fetches `manifest.json` from the URL's origin and resolves responsive variants normally. No special-case handling needed.

#### 10) ImageField DS Component for Media Management
**Date:** 2026-05-12
**Issue:** Episode create/edit forms used a plain text `Input` for image URLs, requiring GMs to manually paste R2 URLs.
**Action:** Created `ImageField` in `@repo/ui` — a form-level component that combines: (1) a thumbnail grid of existing media from `GET /media` for reuse, (2) drag-and-drop upload with server-side optimization via the `POST /media/upload` endpoint, and (3) upload progress state. Returns `{ imageUrl, mediaId }` to the form.

### Server / Backend

#### 11) NestJS Media Module for R2 Integration
**Date:** 2026-05-12
**Issue:** No server-side media management existed.
**Action:** Created `apps/server/src/media/` module with: `R2Service` (AWS SDK v3 S3Client configured for Cloudflare R2), `MediaService` (CRUD for `media` table + presigned URL generation), `MediaController` (5 endpoints: `POST /media/upload-url`, `POST /media`, `GET /media`, `GET /media/:id`, `DELETE /media/:id`). All endpoints are JWT-protected; create/delete require GM role. Server-side `sharp` runs optimization on upload via `ImageOptimizerService`.

#### 12) New Server Modules Added (March–May 2026)
**Date:** 2026-03-24 → 2026-05-12
**Issue:** Significant backend expansion — many new modules were added.
**Action:** New modules: `dashboard` (GM overview + player dashboard), `episode-invites` (invite system for episodes), `episode-players` (player management), `media` (R2 integration), `notifications` (in-app notifications), `reading-items` (reading lists), `reading-progress` (scroll position tracking), `session-recaps` (post-session write-ups), `sessions` (game session scheduling), `users` (user management beyond auth), `content-registry` (content metadata). All follow the `@Inject(DATABASE_CONNECTION)` + `NodePgDatabase<typeof schema>` + Drizzle ORM pattern.

#### 13) Database Schema: media Table and Episode FK
**Date:** 2026-05-12
**Issue:** Episodes referenced images by bare slug (e.g. `jakso-1`) or URL string with no relational integrity.
**Action:** Added `media` table (`id`, `key`, `filename`, `alt`, `mime_type`, `width`, `height`, `context`, timestamps) and optional `mediaId` FK on `episodes`. Migration in `008-create-media.sql` uses `IF NOT EXISTS` for idempotency. The `media.context` column tracks which MFE the image belongs to (`ruleset`, `world`, `episodes`).

#### 14) Production Migration Scripts Must Not Depend on Local Files
**Date:** 2026-05-12
**Issue:** Running `migrate-images-to-r2.mjs` via `railway run` failed because source images had already been deleted from the local repo, and the script couldn't load `.env` (Railway injects env vars directly via `process.env`).
**Action:** Created `scripts/production-media-setup.mjs` that works with `railway run`: reads `process.env` directly (no `.env` file), registers DB records from known metadata without needing local image files, and reconstructs the manifest. All operations are idempotent.

### Cloudflare R2 Setup

#### 15) R2 API Tokens Are Not Account API Tokens
**Date:** 2026-05-12
**Issue:** Cloudflare has two different token systems: Account API Tokens (for REST API) and R2 API Tokens (for S3-compatible access). Using an Account API Token causes 403 errors from the AWS SDK.
**Action:** Create tokens via **R2 → Manage R2 API Tokens → Create API Token** (not the main Account API Tokens page). Set **Object Read & Write** permission on the target bucket. The resulting Access Key ID and Secret Access Key are what the AWS SDK expects.

#### 16) R2 Custom Domains Require Cloudflare DNS
**Date:** 2026-05-12
**Issue:** Custom domain for R2 bucket (e.g. `media.eventuell.it`) requires the domain to use Cloudflare nameservers. CNAME from an external registrar doesn't work on free Cloudflare plans.
**Action:** Use the free `r2.dev` public URL instead. The URL is in image `src` attributes that users never see directly. Migrating to a custom domain later is a one-line env var change (`R2_PUBLIC_URL`).

### Agent Configuration

#### 17) Agent Workflows Must Include DS Pre-Flight Gate
**Date:** 2026-05-12
**Issue:** Agents consistently ignored the design system when building features because no workflow step forced them to check existing components before coding.
**Action:** Both `new-feature.md` and `ui-development.md` workflows now include a mandatory "Design System Pre-Flight" section as step 2 (after context research). Agents must read `visual-identity/SKILL.md` and `ui-design-system/SKILL.md`, check the component inventory via Storybook MCP or `ComponentGuide.mdx`, and list which existing components will be reused. `CLAUDE.md` and `.cursorrules` both start with this directive.

#### 18) Visual Identity Skill: Retro-Space-Opera, Not Generic SaaS
**Date:** 2026-05-12
**Issue:** Without a documented visual identity, agents default to generic clean SaaS design instead of the project's retro-space-opera aesthetic.
**Action:** Created `claude-skills/visual-identity/SKILL.md` documenting the aesthetic: fluorescent flicker headings, teal-as-information / red-as-danger palette, dark console base (`#0f0f13`), starfield canvas (`HeroCanvas`), compass-rose station navigation, and glitch/obscured spoiler mechanics. Anti-patterns documented: pastel palettes, white backgrounds, rounded-everything, stock illustration style.

### Content & Rules

#### 19) Hahmopaja (Character Workshop) Is Fully Active
**Date:** 2026-05-12
**Status:** Hahmopaja is fully enabled in production. Sidebar, routes, landing page, and lazy imports are all live. Previous disabling comments have been removed.

#### 20) Inline Article Images Should Not Open Lightbox Modals
**Date:** 2026-03-13
**Issue:** Opening full-size modals from in-flow rules text images interrupts long-form reading.
**Action:** `ImageElement` has `variant="inline"` which disables modal opening while keeping shared responsive/manifest behavior. Ruleset markdown section images use this inline variant.

### Build & Tooling

#### 21) Storybook 10 on Vite 6 Requires Node v22+
**Date:** 2026-03-25
**Issue:** Storybook 10.2+ with Vite 6 native dev servers crashes on Node <22 with `res.status is not a function` errors due to Connect middleware incompatibility.
**Action:** Node v22+ is the baseline. `@storybook/addon-docs` must be imported directly, not via the deprecated `/blocks` subpath.

#### 22) PowerShell Inline Node Scripts Can Create Stray Files
**Date:** 2026-05-12
**Issue:** Running `node -e "..."` with SQL or complex expressions in PowerShell causes string escaping issues — `$1` becomes empty, `media_id=8` becomes separate tokens, and stray 0-byte files (e.g. `apps/server/1`) get created.
**Action:** Always use script files (`node scripts/myscript.cjs`) instead of inline `node -e` for anything beyond trivial one-liners on Windows/PowerShell.

---

## Purge Ledger

### 2026-05-12
Performed comprehensive update of learnings file:

- Removed 16 learnings from the March 2026 batch that were already fully captured in `docs/rules.md` and `docs/architecture.md`:
  - Host-mounted remote images (→ `docs/rules.md` §Microfrontend Assets)
  - Portaled overlays theme inheritance (→ `docs/rules.md` §Styling)
  - Markdown `strong` → `GameTerm` mapping (→ `docs/rules.md` §Styling)
  - Token rebalancing requires Storybook revalidation (→ `docs/rules.md` §Styling)
  - Finnish-only ruleset copy (→ `docs/rules.md` §General)
  - Rulebook import mapping (→ `docs/rules.md` §General)
  - Hero height stability (→ promoted to DS component convention)
  - Ruleset frontmatter multi-image flow (→ now superseded by R2 pipeline)
  - Storybook autodocs global tags (→ `docs/architecture.md` §Design System)
  - `ImageElement` centralization (→ `docs/architecture.md`)
  - Frontmatter URL decoding (→ superseded by R2 CDN URLs)
  - Responsive variant `sizes` (→ now handled by manifest automatically)
  - Host mobile menu toggle (→ implemented in host left-lane architecture)
  - Article progress navigation entries #11–#24 (→ all fully captured in `docs/architecture.md` §Component Hierarchy and article progress events)
  - Breakpoint migration rules (→ `docs/rules.md` §Styling)
  - AnchoredTooltip CSS pattern (→ promoted to DS component)
- Added 16 new learnings covering March 24 – May 12 development.

### 2026-03-07
Performed periodic purge and promoted critical knowledge before deletion:

- Promoted evergreen constraints into `docs/rules.md` (including portal theme fidelity and remote-origin asset resolution).
- Retained recurring environment/tooling fixes in `.agents/workflows/setup.md`, `.agents/workflows/troubleshoot.md`, and `.agents/workflows/deploy.md`.
- Added purge retention process in `.agents/workflows/learnings-retention.md`.
- Updated `.cursorrules` to require retention workflow usage before future learnings purges.
