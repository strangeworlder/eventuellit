---
name: UI Development & Design System
description: Design system rules, Tailwind configuration, theming, Storybook conventions, and component development patterns for the @repo/ui package.
---

# UI Development & Design System

## Strict Localization

- The entire user-facing application MUST be purely in Finnish.
- No English in UI labels, even in parentheses (e.g., "Hyökkää (Attack)" is forbidden).
- Storybook `args` and mock data must only use Finnish text for anything a user or designer reads.
- Internal developer-English logic (e.g., `variant='primary'`) maps to correct localized terms.

## Design System Precedence

- Applications MUST use shared components from `@repo/ui` (`<Button>`, `<Card>`, `<Input>`, etc.).
- Do NOT hardcode raw HTML elements with custom Tailwind classes in application layers.
- If a component lacks a needed variant, **extend it** by adding the missing `variant` or `size` property — never fall back to raw HTML.

## Semantic Variant Architecture

- Components MUST NOT expose generic layout utility props (e.g., `padding: 'sm' | 'md'`).
- Build specific, semantic, opinionated `variant` props (e.g., `variant: "feature" | "compact" | "rule"`) that internally map spacing, paddings, and typography.
- Consumers pick the *purpose* of the component, not its literal pixels.

## New DS Component Contract

All new `@repo/ui` components must follow:
- `React.forwardRef` with `displayName`
- Optional `theme?: Theme` prop piped to `data-theme`
- Explicit `font-sans`
- Token-scale values (`rounded-sm`, `border` over `ring`, `shadow-md` for floating overlays)
- Standard `max-w-*` over arbitrary calc
- Stories must use DS `<Button>` instead of raw `<button>` elements

## Theming Inheritance

- Subcomponents must adapt to parent container's dynamic theme overrides via CSS cascading.
- Use explicit CSS variable strings: `bg-[var(--theme-bg)]`, `text-[var(--theme-primary)]`, `border-[var(--theme-secondary)]/30`.
- Do NOT use abstract Tailwind `@theme` alias mappings (like `bg-surface`) as they fail to cascade with opacity limits or `color-mix` across dynamic boundaries.

## Secondary Component Semantics

- Secondary layout components (Sidebars, Footers, dividing panels) must inherit global active theme context.
- Rely on `[var(--theme-secondary)]` scoping with `transparent` backgrounds.
- Never artificially inject a hardcoded `theme="..."` prop to force a specific colorway.

## Portaled Overlay Theme Fidelity

UI rendered via `ReactDOM.createPortal(..., document.body)` must preserve the nearest active `data-theme` scope from its trigger/source element. Don't assume parent DOM inheritance survives a portal boundary.

## Tailwind v4 Configuration

Tailwind v4 uses `@import` graph traversal instead of content arrays. Every consuming application's root `src/index.css` must be structured:

```css
@import "tailwindcss";
@import "../../../packages/ui/src/styles.css";
@source "../../../packages/ui";
```

## Custom Breakpoints

Use project-defined breakpoints instead of Tailwind defaults:

| Name | Width | Replaces |
|---|---|---|
| `mobile` | 550px | `sm` |
| `tablet` | 700px | `md` |
| `desktop` | 900px | `lg` |
| `x-wide` | 1200px | `xl` |
| `xx-wide` | 1500px | `2xl` |

Use named breakpoints: `desktop:flex`, `max-desktop:hidden` — never generic `lg` or `md`.

## Structural Design Tokens

- Avoid arbitrary values (`p-[18px]`, `w-[300px]`, `rounded-[10px]`).
- Use standard spacing and border-radius scales from `Tokens.stories.tsx`.
- Layouts must be predictable and conform to the grid.

## Danger Affordance

Destructive actions in shared DS components (especially `Button variant="danger"`) must NOT rely on color alone. Use at least one additional semantic cue:
- Iconography
- Structural border/shape difference
- Explicit text treatment

## Z-Index Stacking

Off-canvas features, dialogs, and overlays must declare z-index using strict responsive prefixes (e.g., `max-desktop:z-50`). Base `z-50` strings will fail via `tailwind-merge` if a consumer passes a parent utility class.

## Button State Layers

The `Button` component includes four explicit state layers:
1. **Disabled:** `opacity-40 grayscale-[40%] cursor-not-allowed shadow-none`
2. **Loading:** `loading` boolean prop → spinner + `cursor-wait pointer-events-none` (full visual opacity)
3. **Focus-visible:** 2px ring using `--theme-secondary` with offset
4. **Active/pressed:** `translate-y-0 scale-[0.98]` + per-variant background deepening

Use the `loading` prop instead of manually wiring `disabled={isPending}` + text swaps.

## Storybook Conventions

- Run Storybook on Node v22+ with Storybook v10.2+ (Vite 6 native dev server support).
- Do not use deprecated `/blocks` subpath for docs addon. Import `@storybook/addon-docs` directly.
- Set `tags: ["autodocs"]` in `packages/ui/.storybook/preview.ts` globally.
- All stories use the `Suunnittelujarjestelma` Finnish root namespace.

## ImageElement Component

- `ImageElement` is the canonical responsive media primitive.
- Auto-consumes `/images/manifest.json` for optimized source sets, intrinsic dimensions, and blur placeholders.
- `variant="inline"` disables modal opening for in-flow content images.
- Decode URL filenames (`decodeURIComponent`) before manifest key normalization.
- Keep inline fallback `src` on smallest manifest JPG; reserve largest for modal view.
