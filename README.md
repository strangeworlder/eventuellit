# Eventuellit-antologia

Eventuellit is a TTRPG system for episodic 2-3-shot adventures set in a "liquid space" solar system. This repository contains the ruleset, character generator, and world-building applications for this TTRPG system, structured as a modern Micro Frontend architecture within a Monorepo.

## 🤖 Agent Directives
**CRITICAL: If you are an AI agent (Antigravity, Cursor, Windsurf, etc.), you MUST follow these directives:**
1. **Context First:** Before proposing architectural changes or adding major features, read `docs/architecture.md` and `docs/prd.md`.
2. **Coding Standards:** All code must adhere to the conventions defined in `docs/rules.md`.
3. **Workflows:** Check `.agents/workflows/` for standardized procedures like deployment or setup (especially useful for Antigravity).

## 📂 Project Structure

This project adopts a Monorepo approach managed by Turborepo, featuring a React 19 / Vite Micro Frontend ecosystem and a NestJS backend.

### Apps (`/apps`)
- **`host`**: The root shell application that orchestrates all the Micro Frontends.
- **`generator`**: Character generator Micro Frontend.
- **`ruleset`**: Ruleset documentation Micro Frontend.
- **`episodes`**: Episode journal Micro Frontend.
- **`world`**: World-building Micro Frontend (locations, factions, NPCs).
- **`server`**: NestJS backend API handling database persistence (PostgreSQL + Drizzle ORM) and magic link authentication.

### Documentation (`/docs`)
- **`prd.md`**: Core Product Requirements Document detailing the "Eventuellit" TTRPG mechanics, dice rules (Noppakoura), and architecture requirements.
- **`architecture.md`**: Comprehensive overview of the system architecture, component hierarchy, state management, and authentication flow.
- **`rules.md`**: Coding standards and conventions for this repository.
- **`learnings.md`**: Accumulated development learnings and historical context.
- **`adding_ruleset_content.md`**: Guide for adding markdown content to the ruleset.
- **`vue_vs_react_analysis.md`**: Historical analysis and decision log for choosing React over Vue.

## Getting Started
To start the application locally:
- Configure environment variables for `apps/server` (e.g., `DATABASE_URL`, `CORS_ORIGINS`, `JWT_SECRET`) as outlined in its `README.md`.
- Use the provided npm scripts in the monorepo root to run the development servers.
