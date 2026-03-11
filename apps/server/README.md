# Eventuellit Server

NestJS backend for the Eventuellit monorepo.

## Purpose
- Provides API endpoints for persisted game entities (currently `characters`).
- Uses PostgreSQL with Drizzle ORM.
- Enforces request validation via DTO classes and global validation pipe.

## Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `CORS_ORIGINS`: Comma-separated frontend origin allowlist.
- `JWT_SECRET`: Secret key for signing JWT tokens (required for authentication).
- `MAGIC_LINK_BASE_URL`: Base URL of the frontend application for building magic link URLs (defaults to `http://localhost:3003` in development).

## Optional Environment Variables
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP configuration for sending emails in production (not yet implemented; magic links are logged to console in development).

## Scripts
- `npm run dev --workspace @eventuellit/server` - Start in watch mode.
- `npm run build --workspace @eventuellit/server` - Build production output.
- `npm run test --workspace @eventuellit/server` - Run Vitest suite.
- `npm run db:push --workspace @eventuellit/server` - Push schema to DB with Drizzle.
- `npm run db:studio --workspace @eventuellit/server` - Open Drizzle Studio.
