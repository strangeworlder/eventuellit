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

---

## Purge Ledger

### 2026-03-07
Performed periodic purge and promoted critical knowledge before deletion:

- Promoted evergreen constraints into `docs/rules.md` (including portal theme fidelity and remote-origin asset resolution).
- Retained recurring environment/tooling fixes in `.agents/workflows/setup.md`, `.agents/workflows/troubleshoot.md`, and `.agents/workflows/deploy.md`.
- Added purge retention process in `.agents/workflows/learnings-retention.md`.
- Updated `.cursorrules` to require retention workflow usage before future learnings purges.
