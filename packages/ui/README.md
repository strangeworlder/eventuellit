# @repo/ui — Design System

The shared design system for Eventuellit. Built on Tailwind v4, React 19, and Storybook 10.

---

## Getting Started!

### CSS Setup

Every consuming application's root stylesheet must import the design system styles:

```css
/* apps/<app>/src/index.css */
@import "tailwindcss";
@import "../../../packages/ui/src/styles.css";

@source "../../../packages/ui/src";
```

### Importing Components

**Recommended** — barrel import (all components from one entry):

```tsx
import { Button, Text, Heading, Card } from "@repo/ui";
```

**Deep import** — for code splitting or when you need only one component:

```tsx
import { Button } from "@repo/ui/components/Button";
```

---

## Theming

The design system has **8 pre-built themes**, each with WCAG AA-verified contrast ratios:

| Theme | Description |
|---|---|
| `base` | Default dark theme — near-black background, light text |
| `inverted` | Light theme — near-white background, dark text |
| `primary-light` | Light pinkish-red surface |
| `primary-dark` | Deep red surface |
| `secondary-light` | Light teal surface |
| `secondary-dark` | Deep teal surface |
| `accent-light` | Light blue surface |
| `accent-dark` | Deep blue surface |

### Applying a Theme

Set `data-theme` on any container element (or use the `theme` prop on supported components):

```tsx
// Via prop (components that support it)
<Card theme="secondary-dark">...</Card>

// Via HTML attribute
<div data-theme="primary-light">...</div>
```

### Theme Tokens

All theme-aware styles must use CSS custom properties:

```tsx
// ✅ Correct — responds to theme changes
<div className="bg-[var(--theme-bg)] text-[var(--theme-text)]" />

// ❌ Wrong — hardcoded, ignores theme
<div className="bg-gray-900 text-white" />
```

#### Text hierarchy

| Token | Tailwind class | Contrast | Use |
|---|---|---|---|
| `--theme-text` | `text-[var(--theme-text)]` | ≥ 7:1 | Primary body text |
| `--theme-text-muted` | `text-text-muted` | ≥ 7:1 | Labels, secondary info |
| `--theme-text-subtle` | `text-text-subtle` | ≥ 4.5:1 | Captions, hints |
| `--theme-text-placeholder` | `text-text-placeholder` | ≥ 3:1 | Form placeholders only |

#### Surface & border tokens

| Token | Tailwind class | Use |
|---|---|---|
| `--theme-surface-tint` | `bg-[var(--theme-surface-tint)]` | Hover/active fill |
| `--theme-border-soft` | `border-[var(--theme-border-soft)]` | Subtle dividers |
| `--theme-border-medium` | `border-[var(--theme-border-medium)]` | Form controls |

#### Prohibited patterns

```tsx
// ❌ Opacity on text — breaks contrast guarantees
text-[var(--theme-text)]/60
opacity-70

// ❌ Opacity on structural borders
border-[var(--theme-secondary)]/40

// ✅ Use semantic tokens instead
text-text-subtle
border-[var(--theme-border-soft)]
```

---

## Typography

Two typefaces are defined in `styles.css`:

- `font-sans` → **Inter** (body text, UI labels)
- `font-heading` → **Outfit** (headings, display text)

### Typography Components

**Block text** — use `<Text>` for paragraphs:

```tsx
<Text variant="body">Standard body copy</Text>
<Text variant="lead">Introductory / hero paragraph</Text>
<Text variant="small">Compact secondary info</Text>
<Text variant="muted">De-emphasized helper text</Text>
<Text variant="bold">Emphasized body text</Text>
<Text variant="label">UPPERCASE TRACKED LABEL</Text>
<Text variant="caption">Tiny metadata footnote</Text>
```

**Headings** — use `<Heading>`:

```tsx
<Heading as="h1">Page title</Heading>
<Heading as="h2">Section title</Heading>
<Heading variant="h3">Explicit visual variant</Heading>
```

Use `<HeadingLevelProvider>` for auto-incrementing heading levels in reusable components.

**Inline code** — use `<Code>`:

```tsx
Run <Code>npm install</Code> to get started.
Press <Code variant="kbd">Ctrl+S</Code> to save.
```

**Rule:** `className` on `<Text>` and `<Heading>` is only for **spacing/layout** (`mt-4`, `max-w-prose`). Never for typography properties — create or use an existing variant instead.

---

## Breakpoints

Use project-defined breakpoints instead of Tailwind defaults:

| Name | Width | Replaces |
|---|---|---|
| `mobile` | 550px | `sm` |
| `tablet` | 700px | `md` |
| `desktop` | 900px | `lg` |
| `x-wide` | 1200px | `xl` |
| `xx-wide` | 1500px | `2xl` |

```tsx
// ✅ Correct
<div className="flex-col desktop:flex-row" />

// ❌ Wrong — uses generic Tailwind breakpoints
<div className="flex-col lg:flex-row" />
```

---

## Design Tokens

### Spacing Scale

Use Tailwind's default spacing scale (`p-4`, `mt-8`, `gap-6`). See `Tokens.stories` in Storybook for the full reference.

### Motion Tokens

```css
--motion-duration-fast: 150ms
--motion-duration-base: 250ms
--motion-duration-slow: 400ms
--motion-easing-default: cubic-bezier(0.4, 0, 0.2, 1)
--motion-easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Shadow Tokens

```css
--shadow-interactive   /* Buttons, interactive elements */
--shadow-overlay       /* Modals, dialogs */
--shadow-floating      /* Tooltips, dropdowns */
```

---

## Components

Run Storybook to browse all components:

```bash
npm run storybook -w @repo/ui
```

### Component Contract

All `@repo/ui` components follow these rules:

- `React.forwardRef` with `displayName`
- Optional `theme?: Theme` prop mapped to `data-theme`
- `font-sans` on root element
- Token-scale values only (no arbitrary `p-[18px]`)
- Semantic `variant` props — consumers choose *purpose*, not pixels

---

## Adding a New Component

1. Create `packages/ui/src/components/MyComponent.tsx`
2. Create `packages/ui/src/components/MyComponent.stories.tsx`
3. Add export to `packages/ui/src/index.ts`
4. Follow the component contract above
5. Add to Storybook under the correct atomic design level:
   - `Suunnittelujarjestelma/Atomit/` — basic building blocks (Button, Text, Icon)
   - `Suunnittelujarjestelma/Molekyylit/` — composed from atoms (Card, Input, Badge)
   - `Suunnittelujarjestelma/Organismit/` — complex, domain-aware (Sidebar, Tabs, Page)
   - `Suunnittelujarjestelma/Pelimekaniikka/` — game-specific components

---

## Localization

The UI is **entirely in Finnish**. No English text in labels, buttons, or messages — even in parentheses. Storybook story data uses Finnish text for anything a user or designer reads.

---

## Accessibility

- All interactive components include keyboard navigation and visible focus rings
- ARIA attributes are applied per WAI-ARIA patterns (tablist, dialog, switch, radiogroup)
- Color contrast is pre-verified at WCAG AA (documented inline in `styles.css`)
- Danger/destructive actions use iconography + text — not color alone
- ObscuredWrapper announces "Sisältö piilotettu" to screen readers
