# Eventuellit – Project Instructions for Claude

## Design System First — Mandatory Pre-Flight

> [!CAUTION]
> **Before building ANY new feature or UI, you MUST complete the design system pre-flight:**
> 1. Read `claude-skills/visual-identity/SKILL.md` for the retro-space-opera visual identity.
> 2. Read `claude-skills/ui-design-system/SKILL.md` for token, theming, and component rules.
> 3. Consult the Storybook MCP (`list-all-documentation`) or read `packages/ui/src/components/ComponentGuide.mdx` to check the component inventory.
> 4. **Use `@repo/ui` components** (`<Button>`, `<Card>`, `<Input>`, `<Text>`, `<Heading>`, etc.) — NEVER raw HTML elements with Tailwind classes.
> 5. Include a **"Design System Usage"** section in every implementation plan.

## TypeScript Type Checking

> [!CAUTION]
> **NEVER run bare `npx tsc` or `npx tsc --noEmit` from any location in this project.** There is no root `tsconfig.json`, so bare `tsc` produces garbage output and wastes time.

### The correct command

```bash
npm run check-types
```

This uses Turborepo to execute the correct `check-types` script in every workspace.

### Per-workspace checks

```bash
npm run check-types -w <workspace-name>
```

Available workspaces: `@eventuellit/host`, `@eventuellit/episodes`, `@eventuellit/generator`, `@eventuellit/world`, `@eventuellit/ruleset`, `@eventuellit/server`, `@repo/ui`, `@repo/auth`.

### Why bare tsc doesn't work

- Vite frontend apps use `tsc -b --noEmit` (composite project references).
- The NestJS server uses `tsc --noEmit` with a flat tsconfig.
- Shared packages use `tsc --noEmit` with configs extending `@repo/typescript-config`.
- Running bare `tsc` or `tsc -p <path>` misses project references and cross-workspace types.

## Additional Skills

Skills are available in the `claude-skills/` directory:
- `claude-skills/visual-identity/SKILL.md` – **Visual identity**: retro-space-opera aesthetic, color philosophy, animation vocabulary, anti-patterns
- `claude-skills/ui-design-system/SKILL.md` – UI design system rules, theming, tokens
- `claude-skills/atomic-design/SKILL.md` – Component classification and Storybook hierarchy
- `claude-skills/project-conventions/SKILL.md` – Naming, security, state management
- `claude-skills/setup-troubleshooting/SKILL.md` – Environment setup and common error fixes
- `claude-skills/article-progress-nav/SKILL.md` – Progress rail architecture and MFE integration
- `claude-skills/content-authoring/SKILL.md` – Markdown content in ruleset/episodes/world
- `claude-skills/game-mechanics/SKILL.md` – TTRPG domain knowledge (dice, attributes, combat)

## Storybook MCP

When working on UI components in `@repo/ui`, use the `eventuellit-sb` MCP tools to access the live component library. The MCP server runs at `http://localhost:6006/mcp` while `npm run storybook` is active.

**Required workflow before writing any UI code:**

1. Call `list-all-documentation` to get the full component index and the `Komponenttiopas` use-case guide.
2. Call `get-documentation` for each component you intend to use to verify exact prop names and variants.
3. Call `get-storybook-story-instructions` before writing or modifying any `.stories.tsx` file.

> [!CAUTION]
> **NEVER hallucinate component props.** Before using any prop (including common-sounding ones like `shadow`, `color`, `size`, `disabled`), verify it exists via `get-documentation`. Only use props that are explicitly listed.

**Available toolsets (`eventuellit-sb`):**
- `list-all-documentation` — compact index of all 57 components and docs pages
- `get-documentation` — full props, variants, and first 3 stories for a component
- `get-documentation-for-story` — full story source when `get-documentation` is insufficient
- `get-storybook-story-instructions` — project-specific story-writing conventions
- `preview-stories` — links to rendered stories at localhost:6006

## Workflows

Agent workflows are in `.agents/workflows/`:
- `typecheck.md` – Type checking steps
- `deploy.md` – Deployment
- `setup.md` – Local environment setup
- `ui-development.md` – UI component and Storybook development
- `new-feature.md` – Standard procedure for starting a new feature
- `learnings-retention.md` – Preserve critical knowledge when trimming learnings
- `troubleshoot.md` – Troubleshooting common stack and environment errors
