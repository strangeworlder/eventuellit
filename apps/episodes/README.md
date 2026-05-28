# @eventuellit/episodes

Episodes microfrontend for the Eventuellit TTRPG campaign manager. Manages episode CRUD, session tracking, recaps (GM + player), reading lists, and player enrollment.

## Development

```bash
npm run dev          # Starts Vite dev server on port 3004
npm run build        # Production build
npm run check-types  # TypeScript type checking
npm run lint         # Biome linting
```

## Module Federation

This app is loaded as a remote by the host shell. It exposes `./App` via `@originjs/vite-plugin-federation`.

| Setting   | Value            |
| --------- | ---------------- |
| Port      | 3004             |
| Exposes   | `./App`          |
| Shared    | `react`, `react-router-dom`, `@tanstack/react-query` |
