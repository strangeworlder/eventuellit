# Eventuellit Server

NestJS backend for the Eventuellit monorepo.

## Purpose
- Provides API endpoints for persisted game entities (currently `characters`).
- Uses PostgreSQL with Drizzle ORM.
- Enforces request validation via DTO classes and global validation pipe.

## Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `CORS_ORIGINS`: Comma-separated frontend origin allowlist.

## Scripts
- `npm run dev --workspace @eventuellit/server` - Start in watch mode.
- `npm run build --workspace @eventuellit/server` - Build production output.
- `npm run test --workspace @eventuellit/server` - Run Vitest suite.
- `npm run db:push --workspace @eventuellit/server` - Push schema to DB with Drizzle.
- `npm run db:studio --workspace @eventuellit/server` - Open Drizzle Studio.
