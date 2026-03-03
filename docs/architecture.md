# System Architecture

## Overview
This application is a ruleset and character generator for a new TTRPG system. It adopts a modern Micro Frontend architecture within a Monorepo.

## Core Technology Stack
- **Monorepo Management:** Turborepo
- **Frontend Framework:** React 18+
- **Micro Frontend Ecosystem:** Vite with Webpack 5 Module Federation Plugins
- **Design System & Styling:** Tailwind CSS, Radix UI (via shadcn/ui)
- **Component Documentation:** Storybook
- **Backend / BFF:** NestJS (TypeScript)
- **Database:** PostgreSQL (utilizing `JSONB` for flexible character sheets)
- **ORM:** Drizzle ORM
- **Testing Framework:** Vitest & React Testing Library
- **Linting & Formatting:** Biome

## Component Hierarchy
The monorepo structure is expected to follow this pattern:
- `apps/host`: The shell application orchestrating the MFEs.
- `apps/generator`: Character generator Micro Frontend.
- `apps/ruleset`: Ruleset documentation Micro Frontend.
- `apps/server`: NestJS backend API.
- `packages/ui`: Shared React/Tailwind design system components visualized through Storybook.
- `packages/config`: Shared ESLint, TS configs.

## State Management
React state will be used. Given the complexity of nested TTRPG character state computations (e.g., stats modifying skills, spells modifying AC), **Zustand** will be used as the robust global state manager across the Micro Frontends due to its minimal boilerplate and ease of sharing context in Module Federation.
