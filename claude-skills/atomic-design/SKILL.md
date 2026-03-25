---
name: Design System & Atomic Design
description: Atomic design hierarchy and component classification rules for the @repo/ui package. Use when creating new components, writing Storybook stories, or deciding where a component belongs.
---

# Design System & Atomic Design

## Classification Rules

Every `@repo/ui` component belongs to one level. To find the current component inventory, grep for `title: "Suunnittelujarjestelma/` in `packages/ui/src/components/*.stories.tsx`.

### Decision guide

1. **Cannot be broken down further?** → **Atomit** (Atom)
2. **Composes 2+ atoms into a functional group?** → **Molekyylit** (Molecule)
3. **Self-contained page section with own layout?** → **Organismit** (Organism)
4. **Game-domain-specific?** → **Pelimekaniikka**
5. **Page-level layout shell?** → **Sivupohjat**

### Atom constraints

- Must NOT import other `@repo/ui` components (only utilities: `cn`, `obscureString`)
- Renders a single semantic HTML element or minimal wrapper

### Molecule constraints

- Composes atoms — e.g., form inputs use `FieldLabel` + `FieldError` + `FieldDescription`

### Storybook title format

```
title: "Suunnittelujarjestelma/{FinnishCategory}/{EnglishComponentName}"
```

Categories: `Perustat`, `Atomit`, `Molekyylit`, `Organismit`, `Pelimekaniikka`, `Sivupohjat`. Sort order enforced in `packages/ui/.storybook/preview.ts`.

## `index.ts` vs Storybook

The barrel export in `src/index.ts` groups components by API convenience and **differs** from Storybook. **Storybook is the authoritative classification.** Notable differences:
- `Card` → `index.ts` says Molecule, Storybook says Organism
- Form inputs (`Checkbox`, `Input`, `Select`, etc.) → `index.ts` says Atom, Storybook says Molecule
- `AspectTag` → `index.ts` says Molecule, Storybook says Atom

## Shared Form Patterns

All form molecules (`Input`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`) share:
- `FieldLabel` / `FieldError` / `FieldDescription` atom composition
- Optional `theme` prop → `data-theme` on wrapper
- `useObscured()` context integration (disables when obscured)
- `border-[var(--theme-border-medium)]` for control borders
- Error state: `--theme-accent` border + ring
- `useObscuredGlitch()` for glitch animation timing

When creating a new form input, follow this same pattern — read any existing form component as reference.

## Foundations (Perustat)

Non-component stories documenting raw design tokens: `Tokens`, `Colors`, `Typography`, `Icons`, `Themes`, `Theme`. These are reference pages, not importable components.
