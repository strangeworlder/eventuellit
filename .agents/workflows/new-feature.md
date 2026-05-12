---
description: Standard procedure for starting a new feature
---
# New Feature Workflow

When asked to start a new feature, follow these steps:

## 1. Context Research

1. Read the Product Requirements Document (`docs/prd.md`) to understand the goals.
2. Read the Architecture Document (`docs/architecture.md`) to understand where the feature fits.
3. Read the Learnings Document (`docs/learnings.md`) to avoid repeating past mistakes.
4. If `docs/learnings.md` has been recently condensed, cross-check `.agents/workflows/learnings-retention.md` to ensure critical constraints were promoted before relying on a removed entry.

## 2. Design System Pre-Flight

> **You MUST complete this before proposing any implementation plan that involves UI.**

1. Read `claude-skills/visual-identity/SKILL.md` — understand the retro-space-opera visual language.
2. Read `claude-skills/ui-design-system/SKILL.md` — understand token, theming, and component rules.
3. Consult the component inventory:
   - If Storybook MCP is available: call `list-all-documentation`, then `get-documentation` for each component you expect to use.
   - If MCP is unavailable: read `packages/ui/src/components/ComponentGuide.mdx` directly.
4. For game-domain features, also read `claude-skills/game-mechanics/SKILL.md`.
5. **List which existing `@repo/ui` components will be reused** and which new ones (if any) are genuinely needed. If an existing component could serve the purpose with a new `variant`, extend it — don't create a parallel component.

## 3. Propose Implementation Plan

Propose an `implementation_plan.md` to the user before writing any code. The plan **MUST** include:

- A **"Design System Usage"** section listing:
  - Existing `@repo/ui` components to be reused (e.g., `Card variant="interactive"`, `Button`, `Tabs`)
  - Any new components to be created, with justification for why an existing component can't be extended
  - Any new variants to be added to existing components
- Ensure the plan adheres to guidelines in `docs/rules.md`.

## 4. Critical Feature Development Rules

- **Strict Finnish Localization**: The entire user-facing application MUST be purely in Finnish. Do not use English translations in the UI layer, even in prototypes or Storybook mock data.
- **Design System First**: Always use pre-built components from `@repo/ui` (`<Button>`, `<Card>`, `<Input>`, `<Text>`, `<Heading>`, etc.) instead of raw HTML elements with Tailwind classes. If a component doesn't have the variant you need, extend the component — never fall back to raw HTML.
- **Structural Tokens & Breakpoints**: Always use the custom responsive breakpoints (`mobile`, `tablet`, `desktop`, `x-wide`) instead of Tailwind defaults (`md`, `lg`). Strictly use predefined spacing and radius from `Tokens.stories.tsx` rather than arbitrary pixel values.
- **Tailwind v4 Setup**: If initializing Tailwind v4 in a new application, ensure `src/index.css` contains `@import "tailwindcss";` followed by strictly relative imports to the ui package's `styles.css` and `@source` paths to ensure mono-repo graph resolution.
- **TDD Requirement**: Build logic using a Test-Driven Development (TDD) approach with Vitest.
- **Code Quality**: Code must pass Biome linting and formatting (`npm run lint` and `npm run format`) before marking a feature as complete.
