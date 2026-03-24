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

## Active Learnings (Post-Purge)

### 1) Host-Mounted Remote Images Must Use Remote Origin
**Issue:** Microfrontend assets can break when using root-relative paths (for example `/images/...`) because they resolve to host origin.
**Action:** For remote-owned assets, resolve URLs against `new URL(import.meta.url).origin` and prefer manifest-driven paths.

### 2) Portaled Overlays Can Lose DOM Theme Inheritance
**Issue:** UI rendered with `ReactDOM.createPortal(..., document.body)` can lose local `data-theme` scope.
**Action:** Capture the nearest themed DOM ancestor from the trigger/source element and apply that `data-theme` to the modal/overlay root.

### 3) Markdown `strong` Should Keep Design-System Semantics
**Issue:** Plain `<strong>` rendering diverges from project typography semantics.
**Action:** Keep markdown `strong` mapped to `GameTerm` primary emphasis style in the shared markdown renderer.

### 4) Token Rebalancing Requires Storybook + Contrast Revalidation
**Issue:** Palette tweaks can look acceptable in one theme but fail in others.
**Action:** Keep token values synchronized between `packages/ui/src/styles.css` and color stories, then re-check contrast at minimum for `base`, `inverted`, and `secondary-dark`.

### 5) Ruleset Copy Should Prefer Natural Finnish Over Dense Bullet Jargon
**Issue:** Ultra-condensed bullet phrasing in player-facing rules pages reads technical and stiff in Finnish.
**Action:** Keep `apps/ruleset/src/content/*.md` concise but narrative: shorter paragraphs + supportive bullets, with plain Finnish wording and minimal shorthand.

### 6) Imported Rulebook Updates Must Be Fully Mapped, Not Lightly Summarized
**Issue:** A condensed rewrite can accidentally drop major mechanics when a new source rulebook introduces substantial sections.
**Action:** When syncing from a source file (for example downloaded `.md` rulebooks), explicitly map every major heading into `apps/ruleset/src/content/mekaniikat.md` before polishing language.

### 7) Hero Height Must Stay Stable Across Optional Media States
**Issue:** Hero layout shifts when optional description or background image UI appears/disappears.
**Action:** Keep a shared minimum height in `Hero` regardless of `description`/image presence, and place the media thumbnail as an absolute overlay so it does not alter flow height.

### 8) Ruleset Frontmatter Supports Optional Multi-Image Flow
**Issue:** Rules pages need richer visual layout while preserving backwards compatibility for pages without image metadata.
**Action:** In `apps/ruleset/src/content/*.md`, allow optional `images` frontmatter list where the first image feeds `Hero` background and remaining images are interleaved between major markdown sections; keep legacy single `image` as fallback.

### 9) Storybook Docs Coverage Should Be Enabled Globally
**Issue:** Relying on per-story `tags: ["autodocs"]` caused inconsistent docs pages when some stories omitted the tag.
**Action:** Set `tags: ["autodocs"]` in `packages/ui/.storybook/preview.ts` so every story title gets a Docs page by default.

### 10) Shared Image Optimization Must Live in `ImageElement`
**Issue:** Keeping image manifest fetch + responsive source wiring inside app-level code duplicates logic and prevents other MFEs from automatically getting compacted images/placeholders.
**Action:** Centralize manifest lookup in `packages/ui/src/components/ImageElement.tsx` and run per-app image optimization scripts that emit `/images/manifest.json` so `ruleset` and `episodes` inherit the same behavior.

### 11) Frontmatter Image Names Need URL Decoding Before Manifest Key Lookup
**Issue:** Ruleset images with non-ASCII characters in file names (for example `Pelipöytäily.png`) are URL-encoded in browser paths, which can break manifest key matching and silently fall back to original PNG assets.
**Action:** Decode the URL filename (`decodeURIComponent`) before key normalization in `ImageElement`, and route Hero background rendering through `ImageElement` so both background and inline images share the same optimization path.

### 12) Responsive Variant Selection Needs Correct `sizes` + Small Fallback `src`
**Issue:** Even with manifest-backed `<picture>` sources, browsers may fetch the fallback `img src` early and/or pick oversized variants if `sizes` is left too broad (for example defaulting to viewport width for thumbnails).
**Action:** In `ImageElement`, keep inline fallback `src` on the smallest manifest JPG while reserving largest JPG for modal view, and pass explicit `sizes` from known layouts (`Hero` background `100vw`, thumbnail `56px`, ruleset inline images capped to content width).

### 10) Host Mobile Menu Toggle Must Stay Viewport-Pinned During Scroll
**Issue:** The host app mobile menu toggle can scroll out of view when positioned inside the scrollable main content.
**Action:** Keep the toggle viewport-pinned with `fixed` positioning (`top-4 left-4`) and a responsive mobile stacking class (`max-desktop:z-50`) so it remains reachable while content scrolls.

### 11) Shared Article Progress Navigation Should Reuse Heading-ID Prefixes
**Issue:** Scroll progress and section jump links drift when each MFE invents separate heading IDs or local slug rules.
**Action:** Generate H3 anchor IDs through shared markdown/id utilities in `@repo/ui`, pass an explicit per-article prefix (`ruleset` page id / `episode` id), and feed both the vertical sticky rail markers and rendered markdown headings from the same ID strategy.

### 12) H3 Marker Spacing Must Follow Real Offsets, Not Equal Steps
**Issue:** Evenly spaced marker placement can falsely imply that the last H3 equals article end, which breaks trust in progress feedback on long pages.
**Action:** Keep rail fill tied to full article scroll normalization and map each H3 marker position from measured heading offsets within the same start/end range; mount the sticky rail directly under the H1/title area using the same behavior on desktop and mobile.

### 13) Host-Level Headings Require Host-Level Rail Mounting
**Issue:** Mounting the progress rail inside remote MFEs (`ruleset`/`episodes`) causes placement drift when the visible H1 belongs to `apps/host`, and can break sticky/scroll sync in container-scrolled layouts.
**Action:** Render the rail in host under the real left H1 and bridge progress + jump events between host and MFEs with typed `CustomEvent` payloads.

### 14) Full-Page Rail Should Not Use Article-Only Progress Range
**Issue:** If progress is normalized only between article start/end, the rail can fail to reach 100% at page bottom and can mislead users when content continues after the last linked H3.
**Action:** Normalize fill and marker positioning to the host scroll-root range, and jump anchors by explicit `scrollRoot.scrollTo(...)` offsets instead of generic `scrollIntoView`.

### 15) Host Left-Lane Controls Should Share One Absolute Top Wrapper
**Issue:** Separately positioned mobile menu toggle, rotated H1 lane title, and article rail can drift out of alignment and produce conflicting pin/fixed behavior.
**Action:** Mount all three under one host-level absolute top wrapper; keep the menu toggle and article rail `sticky` inside that wrapper, while the rotated heading remains normal-flow content within the same lane.

### 16) Rotated Host H1 Requires Visual-Bounds Measurement for Rail Start
**Issue:** A rotated H1 (`transform`) can visually occupy far more vertical space than its layout height, causing progress rail overlap when start offsets are based on normal flow metrics.
**Action:** Measure the heading's transformed `getBoundingClientRect()` bottom against the lane wrapper and derive progress rail start from that visual bottom; expose `ArticleProgressNavigator` `railHeight` override so host can enforce viewport-relative rail height (`100dvh - 2 * burger height`).

### 17) Sticky Rails Inside Absolute Lane Wrappers Can Fail to Pin
**Issue:** A rail rendered as `position: sticky` inside an absolutely positioned side lane may never enter sticky mode correctly because its sticky range is constrained by that wrapper instead of the full scroll root.
**Action:** In host layouts with an absolute left lane, use a measured absolute-to-fixed handoff tied to `#app-scroll-root` scrollTop and lane X-position to pin the rail under the burger button reliably.

### 18) H3 Marker Normalization Must Use Full Scroll Height, Not Max ScrollTop
**Issue:** Mapping heading marker positions with `maxScroll` (`scrollHeight - clientHeight`) can push late headings to `100%` even when meaningful content still exists below them.
**Action:** Keep rail fill based on `scrollTop / maxScroll`, but normalize marker positions against full `scrollHeight` (`headingTop / scrollHeight`) so the last H3 can sit before 100% when the article continues.

### 19) Progress Navigator Clicks Need A Local Scroll Fallback
**Issue:** In standalone usage (for example Storybook or app pages without jump-event wiring), `ArticleProgressNavigator` section buttons can appear inert when `onSelectSection` is omitted.
**Action:** Let `ArticleProgressNavigator` call `onSelectSection` when provided, but otherwise fall back to `document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })`.

### 20) Cross-MFE Jump IDs Must Come From Rendered Headings, Not Re-Parsing
**Issue:** Generating rail section IDs from markdown source and rendering IDs through a separate markdown pipeline can drift in edge cases, causing host rail clicks to target non-existent anchors.
**Action:** In article MFEs, build rail `sections` + offset maps from rendered `h3[id]` DOM nodes (`querySelectorAll("h3[id]")`) so emitted IDs are always identical to clickable anchors.

### 21) Scroll-Driven Rails Should Isolate Fast-Changing Fill From Static Markers
**Issue:** Re-rendering full marker lists on every scroll progress tick creates unnecessary work (new closures, repeated class-condition evaluation, and extra layout churn) in long-form article rails.
**Action:** Keep marker lists memoized in a dedicated `React.memo` subcomponent and animate rail fill via `transform: scaleY(...)` on a full-height element instead of repeatedly changing `height`.

### 22) Querying Heading Anchors Should Use Typed `querySelectorAll<HTMLElement>`
**Issue:** Building rail offsets from `querySelectorAll("h3[id]")` infers `Element[]`, which fails when helper functions expect `HTMLElement` and causes TypeScript build breaks in article MFEs.
**Action:** Use `querySelectorAll<HTMLElement>("h3[id]")` when collecting headings for progress rails so offset calculations and jump handling stay type-safe in both `episodes` and `ruleset`.

### 23) Host Rail Visibility Should Fade In After Rotated H1 Exits View
**Issue:** Letting the host rail physically scroll into view under the rotated lane heading adds extra visual movement and can increase per-scroll position work for a purely decorative transition.
**Action:** Keep the rail fixed to the lane x-position/top anchor and toggle visibility with an opacity/translate fade once the rotated host `h1` has scrolled past the pin threshold; avoid updating lane-left position in the scroll handler.

### 24) Host Rail Event Filtering Needs Deployment-Skew Fallback
**Issue:** In production, one MFE can lag behind host expectations for event payload fields (for example `source` shape/value), causing host rail updates to be filtered out for that view while another MFE still works.
**Action:** In host progress-event listeners, accept exact `source` match first, then fall back to `route` prefix matching (`/ruleset` or `/episodes`) to preserve behavior across staggered deployments.

### 25) Reusable CSS Anchor-Positioned Tooltips via `:has()` Sibling Binding
**Issue:** The `ArticleProgressNavigator` minimal variant hand-wired `anchor-name`, `anchor-scope`, and `position-anchor` CSS properties plus Tailwind `peer` hover classes, making the tooltip pattern non-reusable and verbose.
**Action:** Extracted a standalone `AnchoredTooltip` component (`packages/ui/src/components/AnchoredTooltip.tsx`) that auto-binds to its previous sibling via CSS `:has()` rules in `styles.css`. The parent automatically gets `anchor-scope`, the previous sibling gets `anchor-name`, and hover/focus-visible visibility is handled purely in CSS. The component accepts a `placement` prop (`right | left | top | bottom`) for positioning relative to the anchor.

### 26) New DS Components Must Follow Shared Structural & Styling Conventions
**Issue:** `AnchoredTooltip` was initially created as a plain function export with no `forwardRef`, `displayName`, or `theme` prop, and used off-pattern tokens (`rounded-md`, `ring-1`, `shadow-lg`, arbitrary `max-w-[calc(...)]`) that diverged from the established DS visual language.
**Action:** All new `@repo/ui` components must follow the shared DS contract: `React.forwardRef` with `displayName`, optional `theme?: Theme` prop piped to `data-theme`, explicit `font-sans`, and token-scale values (`rounded-sm` for small utilities, `border` over `ring`, `shadow-md` for floating overlays, standard `max-w-*` over arbitrary calc). Stories must use DS `<Button>` instead of raw `<button>` elements.

### 27) Button Component Must Define All Interactive States Explicitly
**Date:** 2026-03-11
**Issue:** The `@repo/ui` `Button` only had a minimal `disabled:opacity-50` and no loading, focus-visible ring, or active/pressed state — forcing consumers to manually simulate loading (swapping text + `disabled={isLoading}`) and leaving keyboard navigation without a visible focus indicator.
**Action:** Enhanced `Button` with four explicit state layers: **disabled** (`opacity-40 grayscale-[40%] cursor-not-allowed shadow-none translate-y-0 scale-100`), **loading** (`loading` boolean prop → spinner + `cursor-wait pointer-events-none` while keeping full visual opacity), **focus-visible** (2px ring using `--theme-secondary` with offset against `--theme-bg`), and **active/pressed** (`translate-y-0 scale-[0.98]` snap-back + per-variant background deepening). Consumers should use the `loading` prop instead of manually wiring `disabled={isPending}` + text swaps. Each variant also gained explicit `active:bg-*` values so pressed feedback is variant-aware.

### 28) Hahmopaja Temporarily Disabled in Production
**Date:** 2026-03-11
**Issue:** Hahmopaja (character generator) is not ready for production visibility yet.
**Action:** Commented out Hahmopaja sidebar menu item, H1 heading, landing page card, and route in `apps/host/src/App.tsx` and `apps/host/src/components/LandingPage.tsx`. The `/generator` route now redirects to `/`. The lazy import of `generator/App` is also commented out. To re-enable, search for "Hahmopaja temporarily hidden" and "temporarily disabled" comments in those files and uncomment/restore. Also restore `Dice5` to the lucide-react import in `App.tsx` and revert the landing page grid back to `desktop:grid-cols-3` with `max-w-6xl`.

### 29) Loading Is Disabled but Must Stay Readable and Explainable in Buttons
**Date:** 2026-03-11
**Issue:** Treating `loading` identically to `disabled` reduced contrast and hid useful status context for users when actions were in progress.
**Action:** In `@repo/ui` `Button`, keep native `disabled` interaction lock during loading but split visual styling from passive disabled treatment so loading remains high-contrast. Add a button-specific `AnchoredTooltip` variant and render it in loading state with Finnish copy for explicit status communication.

### 30) Danger Buttons Need Multi-Cue Affordance, Not Color Alone
**Date:** 2026-03-11
**Issue:** Destructive actions were primarily signaled by color, which is insufficient for robust affordance and accessibility.
**Action:** `Button` `danger` now combines multiple cues: default foreground danger icon, subtle background icon layer, stronger structural border/shadow treatment, and distinct pressed behavior. Keep the affordance token-driven and theme-aware.

### 31) Breakpoints Should Avoid Popular Viewport Edge Values
**Date:** 2026-03-11
**Issue:** Using breakpoints at common viewport widths makes responsive UI feel unstable because users can hover around exact threshold boundaries during normal browser usage.
**Action:** Rebalanced design-system breakpoints to pulled-back thresholds and added an extra wide tier in `packages/ui/src/styles.css`: `mobile` 550px, `tablet` 700px, `desktop` 900px, `x-wide` 1200px, `xx-wide` 1500px. Keep token docs (for example `Tokens.stories.tsx`) synchronized with these values.

### 32) Breakpoint Migration Must Target Source Files, Not Built Storybook Assets
**Date:** 2026-03-11
**Issue:** Default Tailwind breakpoint prefixes (`sm/md/lg/xl/2xl`) remained in multiple `packages/ui/src/components` files even though project rules require custom breakpoint names, and mirrored strings in `packages/ui/storybook-static` can mislead edits.
**Action:** Migrate responsive classes in source files using the mapping `sm->mobile`, `md->tablet`, `lg->desktop`, `xl->x-wide`, `2xl->xx-wide` (and matching `max-*` variants when present). Do not hand-edit `storybook-static`; regenerate it from updated source when publishing Storybook outputs.

### 33) Ruleset Inline Article Images Should Not Open Lightbox Modals
**Date:** 2026-03-13
**Issue:** Opening full-size modals from in-flow rules text images interrupts long-form reading and introduces extra interaction noise for purely illustrative content.
**Action:** Added `ImageElement` `variant="inline"` in `@repo/ui`, which disables modal opening by default while keeping shared responsive/manifest behavior; `apps/ruleset` markdown section images now use this inline variant.

### 34) Color Tokens Must Be Pre-Computed Solid Values — Never Opacity Modifiers
**Date:** 2026-03-24
**Issue:** Opacity modifiers on text (`text-[var(...)]/50`, `opacity-60`) and interactive backgrounds (`hover:bg-[var(...)]/10`) produce theme-dependent, unauditable contrast ratios that fail WCAG AA on non-base themes. `color-mix()` on text colors has the same problem.
**Action:** Introduced six semantic CSS tokens per theme in `styles.css` — `--theme-text-muted`, `--theme-text-subtle`, `--theme-text-placeholder`, `--theme-surface-tint`, `--theme-border-soft`, `--theme-border-medium` — all solid scale colors with verified contrast ratios. See the `ui-design-system` skill for full rules. Key pitfall: on dark themes, `--theme-secondary` sits at a *mid* scale step and is **darker** than `--theme-text-muted` (a high step), so hover text should always go to `--theme-text` (full contrast), not `--theme-secondary`.


---

## Purge Ledger

### 2026-03-07
Performed periodic purge and promoted critical knowledge before deletion:

- Promoted evergreen constraints into `docs/rules.md` (including portal theme fidelity and remote-origin asset resolution).
- Retained recurring environment/tooling fixes in `.agents/workflows/setup.md`, `.agents/workflows/troubleshoot.md`, and `.agents/workflows/deploy.md`.
- Added purge retention process in `.agents/workflows/learnings-retention.md`.
- Updated `.cursorrules` to require retention workflow usage before future learnings purges.
