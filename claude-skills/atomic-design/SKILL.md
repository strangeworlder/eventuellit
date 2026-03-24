---
name: Design System & Atomic Design
description: Atomic design hierarchy, component classification (atoms/molecules/organisms), shared form primitives, and Storybook organization for the @repo/ui package.
---

# Design System & Atomic Design

## Atomic Design Hierarchy

The design system follows **atomic design** principles. Every component in `@repo/ui` belongs to one classification level. Storybook titles reflect this under the `Suunnittelujarjestelma/` root.

### Perustat (Foundations)

Non-component design tokens and reference pages. These are **not** importable React components — they document the raw system.

| Story | Purpose |
|---|---|
| Tokens | Spacing, border-radius, and sizing scales |
| Colors | Color palette and semantic color mappings |
| Typography | Font families, weights, and heading scales |
| Icons | Gallery of all available Lucide + custom icons |
| Themes / Theme | Theme override system and `data-theme` scoping |

### Atomit (Atoms)

The smallest indivisible UI primitives. They accept props but do **not** compose other design-system components internally.

**General UI:** `Button`, `ToggleButton`, `Badge`, `Icon`, `DiceIcon`, `Link`, `Heading`, `Text`, `GameTerm`, `LoadingState`, `ImageElement`

**Form primitives:** `FieldLabel`, `FieldError`, `FieldDescription`, `AspectTag`

When creating a new atom:
- It must NOT import other `@repo/ui` components (only utilities like `cn`, `obscureString`)
- It should render a single semantic HTML element or a minimal wrapper
- Classify as `title: "Suunnittelujarjestelma/Atomit/ComponentName"`

### Molekyylit (Molecules)

Compositions of atoms into a functional unit. Molecules import and use atoms.

**Form inputs:** `Input`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormInputs`

**Display:** `Tabs`, `AnchoredTooltip`, `TextSection`, `List`, `MarkdownRenderer`, `NoticePanel`, `ObscuredWrapper`, `StatBlock`, `ActiveStatBlock`

When creating a new molecule:
- It should compose 2+ atoms or have meaningful internal structure
- Classify as `title: "Suunnittelujarjestelma/Molekyylit/ComponentName"`

### Organismit (Organisms)

Complex, self-contained UI sections with their own layout logic.

`Card`, `Hero`, `Sidebar`, `VideoCta`, `AttributeCard`, `ArticleProgressNavigator`, `StationConnections`, `SkillMasonry`

When creating a new organism:
- It should represent a distinct section of a page
- Classify as `title: "Suunnittelujarjestelma/Organismit/ComponentName"`

### Pelimekaniikka (Game Mechanics)

Domain-specific game components that don't fit generic atomic levels.

`DiceRoller`, `DicePoolTracker`, `DicePoolAllocator`, `EnduranceBlock`

### Sivupohjat (Templates)

Page-level layout shells: `Page`

## Shared Form Primitives

All form components (`Input`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`) share extracted atom building blocks:

### `FieldLabel`

```tsx
import { FieldLabel } from "./FieldLabel";

// In a molecule:
{label && <FieldLabel obscured={obscured}>{label}</FieldLabel>}
```

Renders the standardised `text-sm font-black uppercase tracking-widest text-[var(--theme-secondary)]` label with built-in obscured state handling. Accepts optional `htmlFor` to render as `<label>` instead of `<span>`.

### `FieldError`

```tsx
import { FieldError } from "./FieldError";

{error && <FieldError className="pl-8">{error}</FieldError>}
```

Renders the `text-sm font-bold uppercase tracking-widest text-[var(--theme-accent)]` error message. Pass `className` for positional adjustments (e.g. `pl-8` for checkbox indent).

### `FieldDescription`

```tsx
import { FieldDescription } from "./FieldDescription";

{description && (
  <FieldDescription obscured={obscured} glitchStyle={glitchStyle}>
    {description}
  </FieldDescription>
)}
```

Helper text under labels. Handles obscured blur, glitch animation, and text scrambling.

### `useObscuredGlitch` Hook

```tsx
import { useObscuredGlitch } from "./useObscuredGlitch";

const { glitchStyle } = useObscuredGlitch(obscured);
// Spread glitchStyle onto elements that need the glitch animation
```

Encapsulates the randomised `glitchDuration` and `glitchDelay` `useMemo` calls. Returns a ready-to-spread `React.CSSProperties` object with `--glitch-delay` and `--glitch-duration` CSS custom properties.

## Storybook Sort Order

The sidebar order is enforced in `packages/ui/.storybook/preview.ts` via `storySort`:

```
Perustat → Atomit → Molekyylit → Organismit → Pelimekaniikka → Sivupohjat
```

All story titles use **English component names** after the Finnish category prefix (e.g. `Suunnittelujarjestelma/Atomit/Button`, not `Suunnittelujarjestelma/Atomit/Painike`).

## Classification Decision Guide

When adding a new component, ask:

1. **Can it be broken down further?** → If no, it's an **Atom**
2. **Does it compose 2+ atoms into a functional group?** → **Molecule**
3. **Is it a distinct, self-contained page section?** → **Organism**
4. **Is it game-domain-specific?** → **Pelimekaniikka**
5. **Is it a page-level layout shell?** → **Sivupohjat**
