---
description: Preserve critical knowledge when trimming docs/learnings.md
---
# Learnings Retention Workflow

Use this workflow whenever `docs/learnings.md` is reorganized, condensed, or purged.

## Goal
- Keep `docs/learnings.md` readable as a rolling log.
- Ensure critical constraints and repeatable fixes survive in canonical docs and workflows.

## Classification Before Deletion
For each entry in `docs/learnings.md`, classify it into one of these buckets before removal:

1. **Evergreen rule** (always true policy/constraint)
   - Move to: `docs/rules.md` or `docs/architecture.md`
2. **Recurring operational fix** (runbook/troubleshooting pattern)
   - Move to: `.agents/workflows/troubleshoot.md`, `.agents/workflows/setup.md`, or another workflow
3. **Historical incident only** (one-off context no longer relevant)
   - Safe to remove after confirming it has no active policy impact

## Non-Negotiable Knowledge That Must Survive Purges
At minimum, preserve these constraints somewhere outside `docs/learnings.md`:

- Finnish-only user-facing copy (including Storybook/demo text).
- Design system precedence (`@repo/ui` components over raw HTML in apps).
- Semantic variants over generic style props in shared components.
- Dynamic theming inheritance via explicit CSS variables when needed.
- Custom semantic breakpoints/tokens (`mobile`, `tablet`, `desktop`, `x-wide`) over default Tailwind breakpoints/arbitrary values.
- Node v22+ baseline for modern Vite/Storybook flows.
- Module Federation local contract (remotes build+preview, host dev, strict ports).
- NPM workspace rule (`*` for local packages, not `workspace:*`).
- Runtime security baseline (env-driven endpoints, strict DTO validation boundaries).

## Purge Checklist
1. Review target entries and classify each one.
2. Promote evergreen constraints to `docs/rules.md` and/or `docs/architecture.md`.
3. Copy recurring operational steps into `.agents/workflows/*`.
4. Only then remove/condense from `docs/learnings.md`.
5. Add a short dated note in `docs/learnings.md` indicating what was promoted and where.

## Validation Gate
Before closing a purge task, confirm:
- No required behavior exists only in deleted `docs/learnings.md` content.
- `.cursorrules` and relevant `.agents/workflows/*` still point to the retained sources.
- New agents can execute setup/troubleshooting/new-feature flows without old learnings context.
