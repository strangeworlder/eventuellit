# Eventuellit Server

NestJS backend for the Eventuellit monorepo. Handles auth and such.

## Purpose
- Provides REST API endpoints for the TTRPG campaign management platform.
- Domain modules: `auth`, `characters`, `content-registry`, `dashboard`, `episodes`, `episode-invites`, `episode-players`, `reading-items`, `reading-progress`, `session-recaps`, `sessions`, `users`.
- Uses PostgreSQL with Drizzle ORM.
- Magic-link authentication with JWT tokens (via `@nestjs/jwt`).
- Enforces request validation via DTO classes and global validation pipe.

## Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `CORS_ORIGINS`: Comma-separated frontend origin allowlist.
- `JWT_SECRET`: Secret key for signing JWT tokens (defaults to a dev secret in development).
- `MAGIC_LINK_BASE_URL`: Base URL of the frontend application for building magic link URLs (defaults to `http://localhost:3003` in development).

## Optional Environment Variables
- `PORT`: Server listen port (defaults to `3000`).
- `NODE_ENV`: Set to `production` to enable Resend email delivery; otherwise magic links are logged to console.
- `RESEND_API_KEY`: API key for the [Resend](https://resend.com) email service. Required in production for sending magic-link emails; if unset, falls back to console logging.

## Scripts
- `npm run dev --workspace @eventuellit/server` — Start in watch mode.
- `npm run build --workspace @eventuellit/server` — Build production output.
- `npm run start --workspace @eventuellit/server` — Run production build.
- `npm run test --workspace @eventuellit/server` — Run Vitest suite.
- `npm run test:watch --workspace @eventuellit/server` — Run Vitest in watch mode.
- `npm run check-types --workspace @eventuellit/server` — TypeScript type-check (no emit).
- `npm run lint --workspace @eventuellit/server` — Run Biome linter.
- `npm run format --workspace @eventuellit/server` — Auto-format with Biome.
- `npm run db:push --workspace @eventuellit/server` — Push schema to DB with Drizzle.
- `npm run db:studio --workspace @eventuellit/server` — Open Drizzle Studio.
