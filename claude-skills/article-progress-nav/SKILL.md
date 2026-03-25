---
name: Article Progress Navigation
description: Architecture and integration contract for the article progress navigation rail shared between the host app and content MFEs. Use when working on ArticleProgressNavigator, adding a new content MFE, or debugging the progress rail.
---

# Article Progress Navigation

## Architecture

The ownership split is non-obvious and must not be reversed:

- **Rail rendering** is owned by `apps/host` — it renders `ArticleProgressNavigator` in the left lane below the rotated H1.
- **Section/progress publishing** is owned by each content MFE (`ruleset`, `episodes`, `world`).
- Communication uses a **browser `CustomEvent` bridge** — MFEs dispatch events; host listens and drives the rail.

The rail fades in only after the host H1 has scrolled past a threshold. It does not render during page load.

## Registering a New Content MFE

When adding a new long-form article MFE that needs the progress rail:

1. Add the source name to `ArticleProgressSource` in `packages/ui/src/components/article-progress-events.tsx`
2. Update `activeView` / progress-filter logic in `apps/host/src/App.tsx`
3. In the MFE: implement markdown glob loading with frontmatter parsing
4. Build rail sections from **rendered `h3[id]` DOM nodes** — `querySelectorAll<HTMLElement>("h3[id]")` — never re-parse markdown
5. Generate H3 anchor IDs using shared utilities from `@repo/ui`
6. Publish `ArticleProgressSource` events; consume `ARTICLE_JUMP_EVENT` for section navigation

## Marker Positions

Markers reflect **real heading Y-offsets** normalized against full scroll height — they are NOT evenly spaced. The last H3 marker can sit before 100% when content continues after it.

## Event Filtering

Host accepts exact `source` match first, then falls back to route prefix matching (`/ruleset`, `/episodes`, `/world`) for deployment-skew tolerance.
