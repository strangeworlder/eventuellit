---
description: Standard procedure for starting a new feature
---
# New Feature Workflow

When asked to start a new feature, follow these steps:

1. Read the Product Requirements Document (`docs/prd.md`) to understand the goals.
2. Read the Architecture Document (`docs/architecture.md`) to understand where the feature fits.
3. Read the Learnings Document (`docs/learnings.md`) to avoid repeating past mistakes.
4. Propose an `implementation_plan.md` to the user before writing any code.
5. Ensure code adheres to guidelines in `docs/rules.md`.

## Critical Feature Development Rules
- **Strict Finnish Localization**: The entire user-facing application MUST be purely in Finnish. Do not use English translations in the UI layer, even in prototypes or Storybook mock data.
- **Component Usage**: Always use pre-built components from the `@repo/ui` package (e.g., `<Button>`, `<Card>`) rather than raw HTML elements styled with Tailwind classes to maintain the design system aesthetic.
- **Tailwind v4 Setup**: If initializing Tailwind v4 in a new application, ensure `src/index.css` contains `@import "tailwindcss";` followed by strictly relative imports to the ui package's `styles.css` and `@source` paths to ensure mono-repo graph resolution.
- **TDD Requirement**: Build logic using a Test-Driven Development (TDD) approach with Vitest.
- **Code Quality**: Code must pass Biome linting and formatting (`npm run lint` and `npm run format`) before marking a feature as complete.
