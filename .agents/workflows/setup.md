---
description: Set up the local environment
---
# Setup Workflow

This workflow initializes the local development environment.

## Prerequisites
- **Node v22 (LTS)** is required.
- **Windows NVM Nuances**: If you encounter "Access is Denied" when switching Node versions via NVM, run your terminal as an Administrator or use `cmd.exe /c "set PATH=... && npm run <script>"` to dynamically bypass.
- **Strict NPM Workspaces**: Ensure you are using traditional NPM workspaces. When linking local monorepo packages in `package.json`, strictly use the standard string `*` wildcard (e.g., `"@repo/ui": "*"`), do NOT use `pnpm` style `"workspace:*"`.

// turbo-all
1. Kill zombie ports to prevent Vite port floating
```bash
npx kill-port 3001 3002 3003
```
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm run dev
```
