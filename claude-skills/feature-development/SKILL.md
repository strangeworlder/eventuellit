---
name: Feature Development Workflow
description: Standard procedure for starting, implementing, and completing new features in the Eventuellit monorepo.
---

# Feature Development Workflow

## Pre-Development Checklist

Before writing any code for a new feature:

1. Read `docs/prd.md` to understand product goals.
2. Read `docs/architecture.md` to understand where the feature fits in the monorepo.
3. Read `docs/learnings.md` to avoid past mistakes.
4. If `docs/learnings.md` was recently condensed, cross-check `.agents/workflows/learnings-retention.md` to ensure critical constraints were promoted.
5. Propose an `implementation_plan.md` to the user before writing any code.
6. Ensure all code adheres to `docs/rules.md`.

## Critical Rules

### Strict Finnish Localization
The entire user-facing application must be purely in Finnish. No English translations in the UI layer, even in prototypes or Storybook mock data.

### Component Usage
Always use pre-built components from `@repo/ui` (e.g., `<Button>`, `<Card>`) rather than raw HTML elements styled with Tailwind. This maintains design system consistency.

### Structural Tokens & Breakpoints
Always use custom responsive breakpoints (`mobile`, `tablet`, `desktop`, `x-wide`, `xx-wide`) instead of Tailwind defaults (`md`, `lg`). Use predefined spacing and radius from `Tokens.stories.tsx` rather than arbitrary pixel values.

### Tailwind v4 Setup (New Applications)
If initializing Tailwind v4 in a new application, structure `src/index.css`:
```css
@import "tailwindcss";
@import "../../../packages/ui/src/styles.css";
@source "../../../packages/ui";
```

### TDD Requirement
Build all logic using Test-Driven Development with Vitest. All meaningful logic (state hooks, component logic, backend services) must have accompanying test suites.

### Code Quality Gate
Code must pass Biome linting and formatting (`npm run lint` and `npm run format`) before marking a feature as complete.

## Feature Completion Checklist

- [ ] Implementation plan reviewed by user
- [ ] All logic has Vitest tests
- [ ] UI text is Finnish only
- [ ] Uses `@repo/ui` components (no raw HTML)
- [ ] Uses custom breakpoints (no `sm`/`md`/`lg`/`xl`)
- [ ] Uses design token spacing (no arbitrary values)
- [ ] Passes `npm run lint` and `npm run format`
- [ ] `docs/learnings.md` updated if new learnings emerged
- [ ] `docs/rules.md` or `docs/architecture.md` updated if decisions were made
