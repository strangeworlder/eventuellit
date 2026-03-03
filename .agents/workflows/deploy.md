---
description: Deploy the complete application
---
# Deployment Workflow

1. Run the build command
```bash
npm run build
```
2. (Pending: Add specific deployment steps based on hosting provider)

## Module Federation Context
- Remote applications in our micro-frontend architecture MUST be built and served via `vite build && vite preview` for local consumption.
- The Host application can consume these static remotes while running in standard dev mode (`vite dev`).
- Ensure all remote `vite.config.ts` profiles define `strictPort: true` for both server and preview settings to prevent 404 remoteEntry errors.
