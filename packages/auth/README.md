# @repo/auth

Shared authentication library for the Eventuellit monorepo. Provides React hooks and API helpers for magic-link authentication.

## Purpose
- Client-side counterpart to the server's magic-link auth flow.
- Exposes API functions for requesting magic links, verifying tokens, session management, data export, and account deletion.
- Provides React hooks (`useAuth`, `useRequireAuth`) for consuming auth state throughout the frontend apps.
- Stores JWT tokens in `localStorage` and attaches them as `Authorization: Bearer` headers.

## Exports

All exports use the `"./*": "./src/*.tsx"` pattern — import by file name:

```ts
import { useAuth } from "@repo/auth/use-auth";
import { useRequireAuth } from "@repo/auth/use-require-auth";
import { requestMagicLink, verifyToken, logout } from "@repo/auth/api";
import type { AuthUser } from "@repo/auth/types";
```

### Hooks

| Hook | Description |
|------|-------------|
| `useAuth()` | Returns `{ user, isLoggedIn, isLoading, error, logout }`. Backed by TanStack Query with a 5-minute stale time. |
| `useRequireAuth()` | Guard hook — redirects unauthenticated users to `/kirjaudu`. Returns `{ isLoggedIn, isLoading }`. |

### API Functions

| Function | Description |
|----------|-------------|
| `requestMagicLink(email)` | Sends a magic-link email via `POST /auth/request-link`. |
| `verifyToken(token)` | Validates a magic-link token via `POST /auth/verify`. Stores the returned JWT. |
| `getCurrentUser()` | Fetches the authenticated user via `GET /auth/me`. |
| `logout()` | Ends the session via `POST /auth/logout` and clears the stored token. |
| `exportMyData()` | Downloads the user's data via `GET /auth/my-data`. |
| `deleteMyAccount()` | Deletes the user's account via `DELETE /auth/my-account` and clears the stored token. |

### Types

```ts
interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
  avatarUrl: string | null;
}
```

## Environment Variables
- `VITE_API_BASE_URL`: Base URL of the backend API. Defaults to `http://localhost:3000` when not set.

## Consumed By
- `apps/host`
- `apps/generator`
- `apps/episodes`

## Scripts
- `npm run lint --workspace @repo/auth` — Run Biome linter.
- `npm run check-types --workspace @repo/auth` — TypeScript type-check (no emit).
