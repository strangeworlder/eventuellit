---
name: Article Progress Navigation
description: Implementation patterns and learnings for the shared article progress navigation rail across host and content MFEs.
---

# Article Progress Navigation

## Overview

The article progress navigation is a vertical sticky rail that provides scroll progress visualization and section jumping for long-form markdown content MFEs (ruleset, episodes, world).

## Architecture

- **Rail rendering** is owned by `apps/host`
- **Content-state publishing** is owned by consuming MFEs
- Communication uses a browser `CustomEvent` bridge

### Visual Variants

`ArticleProgressNavigator` exposes two semantic variants:
- `default` — Panel rail with always-visible labels
- `minimal` — Rail-only markers with hover/focus rotated labels anchored to each marker

## Host-Side Implementation

### Rail Placement
- Rendered in host under the real left H1 heading area
- Mounted inside the host left lane wrapper
- Starts below the rotated H1 (measured by `getBoundingClientRect().bottom`)
- Uses measured absolute-to-fixed handoff tied to `#app-scroll-root` scrollTop

### Rail Visibility
- Fades in only after the rotated host H1 has scrolled past a threshold
- Uses opacity/translate fade — no scroll-in motion animation
- Avoid updating lane-left position in the scroll handler

### Host Controls Layout
- Mobile menu toggle, rotated H1, and article rail share one absolute top wrapper
- Menu toggle and rail are `sticky` inside the wrapper
- Rotated heading remains normal-flow content

### Event Filtering
- Accept exact `source` match first
- Fall back to route prefix matching (`/ruleset`, `/episodes`, `/world`) for deployment-skew tolerance

## MFE-Side Implementation

### Publishing Sections
- Build rail `sections` and offset maps from rendered `h3[id]` DOM nodes: `querySelectorAll<HTMLElement>("h3[id]")`
- Do NOT re-parse markdown to generate IDs
- Use shared markdown/id utilities from `@repo/ui` for consistent heading ID generation
- Pass explicit per-article prefix (ruleset page ID / episode ID)

### Registering New Content MFEs
1. Add source name to `ArticleProgressSource` in `packages/ui/src/components/article-progress-events.tsx`
2. Update `activeView` / progress-filter logic in `apps/host/src/App.tsx`
3. Implement markdown glob loading + frontmatter parsing
4. Publish progress events + consume jump events

## Progress Calculation

### Rail Fill
- Normalized to host scroll-root: `scrollTop / (scrollHeight - clientHeight)`
- `0%` at top of page, `100%` at bottom of page

### Marker Positions
- Derived from heading Y-offset normalization against full scroll height: `headingTop / scrollHeight`
- NOT equal spacing — markers reflect real heading positions
- Last H3 marker can sit before 100% when content continues after it

### Performance
- Memoize marker lists in a `React.memo` subcomponent
- Animate fill via `transform: scaleY(...)` on a full-height element (not repeated `height` changes)
- Isolate fast-changing fill updates from static marker rendering

## Click Handling
- Use `onSelectSection` callback when provided
- Fall back to `document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })` for standalone usage
- Jump using explicit `scrollRoot.scrollTo(...)` offsets instead of generic `scrollIntoView`

## Safari / Cross-Browser
- Use `getBoundingClientRect()` for transformed elements (rotated H1)
- Use typed `querySelectorAll<HTMLElement>` to avoid TypeScript issues
