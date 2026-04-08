---
name: UI Development & Design System
description: Design system rules, theming constraints, accessibility contracts, and component development patterns for the @repo/ui package. Use when building UI, creating components, writing Tailwind classes, or working in packages/ui.
---

# UI Development & Design System

## Design System Precedence

- Applications MUST use shared components from `@repo/ui`. Never fall back to raw HTML with custom Tailwind classes.
- If a component lacks a needed variant, **extend it** in `@repo/ui` — don't work around it in app code.
- Use `Stack`, `Grid`, `Container` layout primitives instead of raw `div` + flex/grid classes.

## Semantic Variant Architecture

Components expose semantic, opinionated `variant` props (e.g., `variant: "feature" | "compact" | "rule"`) — never generic layout utility props like `padding: 'sm' | 'md'`. Consumers pick the *purpose*, not the pixels.

## New Component Contract

All new `@repo/ui` components must:
- Use `React.forwardRef` with `displayName`
- Accept optional `theme?: Theme` piped to `data-theme`
- Use `font-sans` explicitly
- Use token-scale values (`rounded-sm`, `border`, `shadow-md`) — no arbitrary values
- Have a Storybook story using DS components (not raw `<button>`)

## Theming

Eight themes defined via `data-theme` attribute in `packages/ui/src/styles.css`: `base` (default dark), `inverted` (light), `primary-light`, `primary-dark`, `secondary-light`, `secondary-dark`, `accent-light`, `accent-dark`. Read `styles.css` for the full variable set.

### Rules

- Use explicit CSS variable references: `bg-[var(--theme-bg)]`, `text-[var(--theme-primary)]`.
- Do NOT use Tailwind `@theme` alias mappings (like `bg-surface`) — they fail to cascade across dynamic `data-theme` boundaries.
- `primaryThemeMap` maps each theme to a contrasting theme for nested surfaces (used by `Card variant="surface"`).
- Secondary layout components (Sidebars, Footers) inherit theme context — never hardcode `theme="..."` to force a colorway.
- Portaled overlays (`ReactDOM.createPortal`) must manually preserve the nearest `data-theme` scope from the trigger element.

## Color Accessibility — Semantic Token System

The system uses **pre-computed solid-color semantic tokens** instead of opacity modifiers. All tokens live in `styles.css` per-theme with WCAG AA contrast targets.

### Text hierarchy

| Tailwind class | Contrast | Use |
|---|---|---|
| `text-[var(--theme-text)]` | ≥ 7:1 | Primary body |
| `text-text-muted` | ≥ 7:1 | Labels, descriptions |
| `text-text-subtle` | ≥ 4.5:1 | Captions, hints |
| `text-text-placeholder` | ≥ 3:1 | Placeholders only |

### Surface & border

| Tailwind class | Use |
|---|---|
| `bg-[var(--theme-surface-tint)]` | Hover/active fills |
| `border-[var(--theme-border-soft)]` | Subtle dividers |
| `border-[var(--theme-border-medium)]` | Form controls |

### Prohibited patterns

- `text-[var(--theme-text)]/50` — no opacity modifiers on text colors
- `opacity-60` on text elements — unpredictable cross-theme contrast
- `hover:bg-[var(--theme-secondary)]/10` — use `bg-[var(--theme-surface-tint)]` instead
- `border-[var(--theme-secondary)]/40` — use `border-[var(--theme-border-medium)]` instead
- `color-mix()` on text — only permitted for decorative contexts behind known backgrounds

### Permitted opacity exceptions

- `disabled:opacity-40` with `grayscale-[40%]` on disabled controls
- Background scrim layers (e.g., Hero image overlay)
- Decorative shadows, thin divider lines, ambient blur orbs

### Gotchas

- **Button hover contrast on dark themes:** `--theme-secondary` can be darker than `--theme-text-muted`. Hover text → `--theme-text` (full contrast), not `--theme-secondary`.
- **Variant class merge:** `tailwind-merge` may not resolve Tailwind v4 custom color conflicts between variant and consumer `className`. Solution: use a different `variant` so the className override wins cleanly.

## Design Tokens

All tokens are defined in `packages/ui/src/styles.css`. Read the file directly for current values. Key conventions:

- **Fonts:** `--font-sans` (Inter) for body; `--font-heading` (Outfit) for headings. Custom `--font-size-*` scale — `base` is 1.05rem (larger than Tailwind default).
- **Breakpoints:** `mobile` (550px), `tablet` (700px), `desktop` (900px), `x-wide` (1200px), `xx-wide` (1500px). Always use these — never Tailwind defaults (`sm`/`md`/`lg`).
- **Motion:** Duration tokens (`instant` → `enter`) and easing tokens (`default`, `in`, `out`, `spring`). Component-level animations use **framer-motion** (`^12.38.0`).
- **Shadows:** `interactive`, `overlay`, `floating` — increasing depth.
- **Colors:** Three scales (`primary`/`secondary`/`accent`) with 50–900 steps. Semantic bridge tokens in `@theme` point at `--theme-*` variables.

## Button State Layers

The `Button` has five state layers (disabled, loading, focus-visible, active/pressed, obscured). Use the `loading` prop with optional `loadingMessage` instead of manually wiring `disabled={isPending}` + text swaps.

Danger buttons include a default `alert-triangle` icon via `showDangerIcon` — destructive actions must NOT rely on color alone.

## Compact Size Convention

`size="compact"` is available on `Button` and `Input`. Use it exclusively for:

- **Inline editing** — edit controls that appear inside data rows, table cells, or tight list items where default-sized controls would break the layout rhythm.
- **GM / admin tools** — the generator app and any other operator-facing surface where screen density matters more than player-facing legibility.

Player-facing surfaces (character sheets, episode views, world articles) MUST use `size="default"` or `size="lg"`. Never use `size="compact"` there.

## Storybook

- Storybook v10.2+ on Node v22+ with Vite 6.
- `tags: ["autodocs"]` set globally. Default background: dark.
- All stories under `Suunnittelujarjestelma/` root with Finnish category prefixes and English component names.
- Organized by atomic design hierarchy — see the `atomic-design` skill for classification.

## Heading Hierarchy (`HeadingLevelContext`)

`Heading` auto-renders the correct HTML heading level (H1–H6) based on `HeadingLevelContext`. Wrap sections in `<HeadingLevelProvider>` to set the base depth — child `<Heading>` components increment automatically. **Never use `as` props to force heading levels.** This keeps semantic hierarchy correct across nested layouts, Page/Hero/Card compositions, and MFE boundaries.

## Page Layout Primitives

- `Page` / `PageBody` / `PageAside` — Standard page shell with optional sidebar. Used by all content routes.
- `UtilityPage` — Centered, narrow-width layout for utility flows (login, verification, error pages). No sidebar.
- `Hero` — Full-width header section with optional background image and description.

Always use these over custom `div` structures for page-level layout.

## `Text` Component Rule

`className` on `<Text>` is only for spacing/layout (e.g. `mt-4`, `max-w-prose`). Never use it for font properties — create or use an existing `variant` instead.
