---
name: Knowledge Management & Learnings Retention
description: Procedures for managing project learnings, preserving critical knowledge during purges, and maintaining documentation continuity.
---

# Knowledge Management & Learnings Retention

## Documentation Hierarchy

| Document | Purpose |
|---|---|
| `docs/rules.md` | Evergreen coding conventions and constraints |
| `docs/architecture.md` | System architecture and technical decisions |
| `docs/prd.md` | Product requirements and game mechanics |
| `docs/learnings.md` | Rolling log of high-signal lessons |
| `.agents/workflows/*` | Operational runbooks and procedures |

## Using `docs/learnings.md`

- Read before complex debugging or refactors.
- If a learning is evergreen, promote to canonical docs immediately.
- If a learning is a repeatable fix, move to a workflow.
- Keep concise by removing historical noise after promotion.

## Classification Before Deletion

For each entry in `docs/learnings.md`, classify before removal:

1. **Evergreen rule** (always-true policy/constraint)
   → Move to: `docs/rules.md` or `docs/architecture.md`

2. **Recurring operational fix** (runbook/troubleshooting pattern)
   → Move to: `.agents/workflows/troubleshoot.md`, `.agents/workflows/setup.md`, or another workflow

3. **Historical incident only** (one-off context no longer relevant)
   → Safe to remove after confirming no active policy impact

## Non-Negotiable Knowledge (Must Survive All Purges)

These constraints must always exist somewhere outside `docs/learnings.md`:

- Finnish-only user-facing copy (including Storybook/demo text)
- Design system precedence (`@repo/ui` components over raw HTML)
- Semantic variants over generic style props in shared components
- Dynamic theming inheritance via explicit CSS variables
- Custom semantic breakpoints/tokens (`mobile`, `tablet`, `desktop`, `x-wide`) over Tailwind defaults
- Node v22+ baseline for modern Vite/Storybook flows
- Module Federation local contract (remotes build+preview, host dev, strict ports)
- NPM workspace rule (`*` for local packages, not `workspace:*`)
- Runtime security baseline (env-driven endpoints, strict DTO validation)

## Purge Checklist

1. Review target entries and classify each one
2. Promote evergreen constraints to `docs/rules.md` and/or `docs/architecture.md`
3. Copy recurring operational steps into `.agents/workflows/*`
4. Only then remove/condense from `docs/learnings.md`
5. Add a short dated note indicating what was promoted and where

## Validation Gate

Before closing a purge task, confirm:
- No required behavior exists only in deleted content
- Relevant workflows still point to retained sources
- New agents can execute setup/troubleshooting/new-feature flows without old learnings context

## Proactive Documentation Rule

At the end of every major debugging or configuration session, update `docs/learnings.md` and `docs/rules.md` proactively — do not wait to be told.
