---
name: Architecture & Technology Stack
description: System architecture, technology stack, monorepo structure, state management, and environment configuration for the Eventuellit TTRPG application.
---

# Architecture & Technology Stack

## Overview

Eventuellit is a ruleset and character generator for a TTRPG system. It uses a **Micro Frontend architecture** within a **Turborepo monorepo**.

## Core Technology Stack

| Layer | Technology |
|---|---|
| Monorepo Management | Turborepo |
| Frontend Framework | React 18+ |
| Micro Frontend | Vite + Webpack 5 Module Federation |
| Design System & Styling | Tailwind CSS, Radix UI (shadcn/ui) |
| Component Docs | Storybook |
| Backend/BFF | NestJS (TypeScript) |
| Database | PostgreSQL (JSONB for character sheets) |
| ORM | Drizzle ORM |
| Testing | Vitest + React Testing Library |
| Linting & Formatting | Biome |

## Monorepo Structure

```
apps/
├── host        # Shell application orchestrating MFEs
├── generator   # Character generator MFE (auth-protected)
├── ruleset     # Ruleset documentation MFE
├── episodes    # Episode journal MFE
├── world       # World-building MFE (port 3005)
└── server      # NestJS backend API

packages/
├── ui          # Shared React/Tailwind design system (Storybook)
├── auth        # Shared authentication hooks & API wrappers
└── config      # Shared TS and tooling configs
```

## State Management

- **Local React state** for view and form state within each MFE.
- **TanStack Query** for server-state fetching, caching, optimistic updates, and invalidation.
- No global Zustand store in production code. Cross-MFE global state requires explicit architectural decision.

## Authentication Architecture

- **Magic link auth:** Users log in via email magic links (no passwords). Links valid 15 minutes, single-use.
- **JWT sessions:** httpOnly cookie (`auth_token`) with 7-day expiry.
- **Email allowlist:** Only emails in `users` table can request magic links. No self-registration.
- **Shared auth package:** `@repo/auth` provides `useAuth()` and `useRequireAuth()`. Each MFE's TanStack Query independently calls `/auth/me`.
- **Protected routes:** `useRequireAuth()` redirects unauthenticated users to `/kirjaudu`.

## API Boundary & Input Safety

- Controllers use explicit DTO classes with `class-validator` decorators.
- `ValidationPipe` runs globally with `transform`, `whitelist`, and `forbidNonWhitelisted`.
- Services map DTOs to explicit write payloads to prevent over-posting.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Server DB bootstrap + Drizzle tooling |
| `CORS_ORIGINS` | Comma-separated allowlist (no wildcard) |
| `VITE_API_BASE_URL` | Frontend API origin |
| `JWT_SECRET` | JWT token signing |
| `MAGIC_LINK_BASE_URL` | Frontend base URL for magic links (default: `http://localhost:3003`) |
| `SMTP_HOST/PORT/USER/PASS` | Production email (optional, not yet implemented) |

## Module Federation Contract

- Remote applications **must** be built and served via `vite build && vite preview` for local consumption.
- The Host application consumes static remotes while running in dev mode (`vite dev`).
- All remote `vite.config.ts` must define `strictPort: true` for both server and preview settings.

## Article Progress Navigation Pattern

- Long-form markdown article MFEs provide a vertical progress rail anchored under the host-level H1.
- Host and article MFEs communicate via browser `CustomEvent` bridge.
- Article MFEs publish rail sections from rendered `h3[id]` DOM nodes (not markdown re-parsing).
- Rail fill uses normalized host scroll-root progress; marker positions derived from actual heading Y-offset normalization.
- New content MFEs must add their source name to `ArticleProgressSource` in `packages/ui/src/components/article-progress-events.tsx`.

## Design System Storybook Taxonomy

All Storybook content uses a single Finnish root namespace: `Suunnittelujarjestelma`.

| Category | Path | Purpose |
|---|---|---|
| Components | `Suunnittelujarjestelma/Komponentit/*` | Reusable UI components |
| Foundations | `Suunnittelujarjestelma/Perustat/*` | Tokens, themes, typography, colors |
| Structure | `Suunnittelujarjestelma/Rakenne/*` | Structural layout primitives |
| Game Mechanics | `Suunnittelujarjestelma/Pelimekaniikka/*` | Domain-specific interaction components |
