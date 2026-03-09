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

---

## Purge Ledger

### 2026-03-07
Performed periodic purge and promoted critical knowledge before deletion:

- Promoted evergreen constraints into `docs/rules.md` (including portal theme fidelity and remote-origin asset resolution).
- Retained recurring environment/tooling fixes in `.agents/workflows/setup.md`, `.agents/workflows/troubleshoot.md`, and `.agents/workflows/deploy.md`.
- Added purge retention process in `.agents/workflows/learnings-retention.md`.
- Updated `.cursorrules` to require retention workflow usage before future learnings purges.
