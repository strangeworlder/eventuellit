---
description: Building and managing UI components and Storybook
---
# UI Development Workflow

When tasked with building components, prototypes, or styling the app, strictly follow these rules:

## Strict Localization
- **Rule:** The entire user-facing application MUST be purely in Finnish.
- **No English:** Do not include English words in UI labels, even in parentheses (e.g., "Hyökkää (Attack)" is forbidden).
- **Mocks & Storybook:** Storybook `args` and mock data payloads must also only use Finnish text for anything a user or designer reads. We map internal developer-English logic (e.g., `variant='primary'`) to the correct localized terms.

## Design System Precedence
- **Rule:** Applications MUST utilize the shared components from `@repo/ui`.
- **Implementation:** Import and use components like `<Button>`, `<Card>`, `<Input>` directly. 
- **Forbidden:** Do NOT hardcode raw HTML elements (e.g., `<button>`) with long lists of custom Tailwind classes in the application layers. This ensures our retro spy thriller aesthetic remains centralized.

## Tailwind v4 Configuration
- **Rule:** Tailwind v4 abandons content arrays for `@import` graph traversal.
- **Root Setup:** Every consuming application must structure its root `src/index.css` exactly like this to properly scan the UI monorepo package:
```css
@import "tailwindcss";
@import "../../../packages/ui/src/styles.css";
@source "../../../packages/ui";
```

## Storybook Vite 6 Nuances
- **Rule:** Storybook must be run on Node v22+ and use Storybook v10.2+ to support Vite 6 native dev servers without `Connect` middleware crashes (`res.status is not a function`).
- **Docs Addon:** Do not use the deprecated `/blocks` subpath for the docs addon inside `main.ts`. Import `@storybook/addon-docs` directly.
