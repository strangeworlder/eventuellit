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
- **Testing Framework:** Vitest (workspace-wide, including `apps/server`) & React Testing Library
- **Linting & Formatting:** Biome (workspace standard; no ESLint/Prettier task gates)

## Component Hierarchy
The monorepo structure is expected to follow this pattern:
- `apps/host`: The shell application orchestrating the MFEs.
- `apps/generator`: Character generator Micro Frontend.
- `apps/ruleset`: Ruleset documentation Micro Frontend.
- `apps/episodes`: Episode journal Micro Frontend.
- `apps/server`: NestJS backend API.
- `packages/ui`: Shared React/Tailwind design system components visualized through Storybook.
- `packages/config`: Shared TS and tooling configs.

## Design System Storybook Taxonomy
- Storybook content in `packages/ui` must use a single Finnish root namespace: `Suunnittelujarjestelma`.
- Stories are grouped by intent, not by historical file ownership:
  - `Suunnittelujarjestelma/Komponentit/*` for reusable UI components.
  - `Suunnittelujarjestelma/Perustat/*` for foundational tokens, themes, typography, and color primitives.
  - `Suunnittelujarjestelma/Rakenne/*` for structural layout primitives.
  - `Suunnittelujarjestelma/Pelimekaniikka/*` for domain-specific interaction components.
- Repeated app-level UI states (e.g., loading labels and notice panels) should be extracted into `@repo/ui` primitives before further app growth.
- Routed tabs and feature-card compositions are still treated as application-shell composition patterns until at least two stable app contexts require a shared DS-level abstraction.

## State Management
Current implementation uses:
- Local React state for view and form state within each micro frontend.
- TanStack Query for server-state fetching, caching, optimistic updates, and invalidation.

No global Zustand store is currently in production code. If cross-MFE global state becomes necessary later, it must be introduced explicitly as a separate architectural decision.

## API Boundary and Input Safety
- Controllers must use explicit DTO classes and class-validator decorators.
- `ValidationPipe` runs globally with `transform`, `whitelist`, and `forbidNonWhitelisted` enabled.
- Services map DTOs to explicit write payloads to prevent over-posting of protected fields.

## Environment Configuration
- `DATABASE_URL` is required for server DB bootstrap and Drizzle tooling.
- `CORS_ORIGINS` is required and must contain a comma-separated allowlist (no wildcard CORS).
- Frontend API origin must be configured via `VITE_API_BASE_URL` (no hardcoded localhost URLs).
