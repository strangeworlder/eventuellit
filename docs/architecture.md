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
- `apps/generator`: Character generator Micro Frontend (protected by authentication).
- `apps/ruleset`: Ruleset documentation Micro Frontend.
- `apps/episodes`: Episode journal Micro Frontend.
- `apps/server`: NestJS backend API.
- `packages/ui`: Shared React/Tailwind design system components visualized through Storybook.
- `packages/auth`: Shared authentication hooks and API wrappers for MFEs.
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
- `@repo/ui` `ImageElement` is the canonical responsive media primitive: it should auto-consume `/images/manifest.json` (when present) to apply optimized source sets, intrinsic dimensions, and blur placeholders without app-specific fetch logic.
- Long-form markdown article navigation (vertical sticky rail under host H1 + section jump markers) is implemented as a shared `@repo/ui` component and helper utility set, with rail rendering owned by `apps/host` and content-state publishing owned by consuming MFEs (`ruleset`, `episodes`).
- `@repo/ui` `ArticleProgressNavigator` exposes semantic visual variants: `default` (panel rail with always-visible labels) and `minimal` (rail-only markers with hover/focus rotated labels anchored to each marker) for space-constrained host lanes.
- Rail fill uses normalized host scroll-root progress (`scrollTop / (scrollHeight - clientHeight)`), while marker positions are derived from actual heading Y-offset normalization against full scroll height (`headingTop / scrollHeight`) rather than equal marker spacing.
- Host and article MFEs communicate rail state and jump actions through a browser `CustomEvent` bridge to keep host-level placement synchronized with remote article anchors.
- Browser tab title ownership stays in `apps/host`: derive `document.title` from the current router pathname so nested routes in any mounted microfrontend still show contextual location in the tab.
- Article MFEs publish rail `sections` and heading offsets from rendered `h3[id]` DOM nodes (not markdown re-parsing) so clickable rail IDs always match the live anchors.
- In the host left lane, the rail should fade in only after the rotated host `h1` has visually scrolled away; avoid scroll-in motion of the rail itself to reduce scroll-driven layout churn.
- Host progress-event consumption must be backward-compatible across independently deployed MFEs: prefer `payload.source` matching, but allow route-prefix fallback (`/ruleset` or `/episodes`) when source values drift between deployments.

## State Management
Current implementation uses:
- Local React state for view and form state within each micro frontend.
- TanStack Query for server-state fetching, caching, optimistic updates, and invalidation.

No global Zustand store is currently in production code. If cross-MFE global state becomes necessary later, it must be introduced explicitly as a separate architectural decision.

## Authentication
- **Magic link authentication:** Users log in via email magic links (no passwords). Magic links are valid for 15 minutes and single-use.
- **JWT sessions:** Upon successful token verification, the server issues a JWT stored in an httpOnly cookie (`auth_token`) with 7-day expiry. This cookie is automatically sent with all requests to the API.
- **Email allowlist:** Only emails that exist in the `users` table can request magic links. No self-registration; new users must be added to the database manually.
- **Shared auth package:** `@repo/auth` provides `useAuth()` and `useRequireAuth()` hooks that any MFE can use. Each MFE's TanStack Query instance independently calls `/auth/me`; the httpOnly cookie is the single source of truth.
- **Protected routes:** Routes can be protected using `useRequireAuth()`, which redirects unauthenticated users to `/kirjaudu`.
- **Development-friendly:** In development, magic links are logged to the server console instead of being sent via email.

## API Boundary and Input Safety
- Controllers must use explicit DTO classes and class-validator decorators.
- `ValidationPipe` runs globally with `transform`, `whitelist`, and `forbidNonWhitelisted` enabled.
- Services map DTOs to explicit write payloads to prevent over-posting of protected fields.

## Environment Configuration
- `DATABASE_URL` is required for server DB bootstrap and Drizzle tooling.
- `CORS_ORIGINS` is required and must contain a comma-separated allowlist (no wildcard CORS).
- Frontend API origin must be configured via `VITE_API_BASE_URL` (no hardcoded localhost URLs).
- `JWT_SECRET` is required for server JWT token signing.
- `MAGIC_LINK_BASE_URL` is the frontend base URL for building magic link verification URLs (defaults to `http://localhost:3003` in development).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` are optional and only needed for production email sending (not yet implemented).