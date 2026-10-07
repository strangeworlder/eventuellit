# Eventuellit – Project Rules for Agents

## 1. Content Authoring & Finnish Prose Standards

> [!IMPORTANT]
> **Before writing or editing ANY markdown or narrative content in `apps/ruleset/`, `apps/episodes/`, `apps/world/`, or `metadata/Jaksot.md`, you MUST read and follow the [content-authoring skill](file:///.agents/skills/content-authoring/SKILL.md).**

All narrative content is Finnish only. To avoid formulaic AI mannerisms, you MUST strictly enforce the following rules:

1. **No Formulaic Openers:**
   - **Never:** *"X on paikka, jonne / jossa / johon..."* or *"X toimii Kynnyksen sydämenä..."*
   - **Instead:** Open in media res with immediate physical action, sensory impression, architecture, or environmental texture.
2. **No Definition by Negation / "Not only X, but also Y":**
   - **Never:** *"Se ei ole vain telakka, vaan myös..."*, *"Tämä ei ole mikään tavallinen ase..."*
   - **Instead:** State directly what something *is* and what happens.
3. **No Moralizing Conclusion Sentences:**
   - **Never:** End paragraphs with philosophical wrap-ups (*"Vain aika näyttää..."*, *"Kaikella on kuitenkin hintansa"*).
   - **Instead:** Cut the final sentence if it merely explains the "meaning" of the preceding paragraph. Trust the reader.
4. **No Clichéd AI Metaphors & Fillers:**
   - **Avoid:** *"valon ja varjon leikki"*, *"herkkä tasapaino"*, *"monimutkainen kudos"*, *"sulatusuuni"*, *"kaksiteräinen miekka"*, *"toimii muistutuksena siitä, että..."*
   - **Avoid empty intensifiers:** *"lukemattomat"*, *"jatkuva"*, *"elintärkeä"*, *"eräänlainen"*.
5. **No Symmetric Triads ("Kolmen kopla"):**
   - Avoid compulsive grouping into three abstract nouns (*"toivo, pelko ja epätoivo"*). Group irregularly (pairs, single punchy nouns, or concrete lists).
6. **Episode Skill Naming Rule:**
   - In `metadata/Jaksot.md` and `apps/episodes/`, **never use slashes in skill names** (`"X / Y"` is forbidden). Each skill has one unique, evocative name.
7. **Heading Hierarchy:**
   - Content markdown headings start at `###` (H3) — never H1 or H2 (those belong to the shell).

---

## 2. Design System First — Mandatory Pre-Flight

> [!CAUTION]
> **Before building ANY new feature or UI, you MUST complete the design system pre-flight:**
> 1. Read [.agents/skills/visual-identity/SKILL.md](file:///.agents/skills/visual-identity/SKILL.md) for retro-space-opera visual identity.
> 2. Read [.agents/skills/ui-design-system/SKILL.md](file:///.agents/skills/ui-design-system/SKILL.md) for tokens, theming, and component rules.
> 3. Consult Storybook MCP (`list-all-documentation`) or read `packages/ui/src/components/ComponentGuide.mdx`.
> 4. **Use `@repo/ui` components** (`<Button>`, `<Card>`, `<Input>`, `<Text>`, `<Heading>`, etc.) — NEVER raw HTML with custom Tailwind classes.
> 5. Include a **"Design System Usage"** section in every implementation plan.

---

## 3. Code Quality & Verification (TypeScript & Biome)

> [!IMPORTANT]
> **Before marking ANY task complete, you MUST verify your changes:**
> ```bash
> npm run verify
> ```
> This runs `npm run check-types` (Turborepo type check) and `npm run lint` (Biome check) in sequence.
> If components/hooks/logic were modified, also run:
> ```bash
> npm test
> ```

### TypeScript Rules
- **NEVER run bare `npx tsc` or `npx tsc --noEmit` from root or subfolders.** There is no root tsconfig.
- Always use `npm run check-types` or `npm run check-types -w <workspace-name>`.

### Biome Linting & Formatting
- **Biome exclusively** for linting and formatting. Never run ESLint or Prettier.
- Run `npm run lint:fix` to auto-fix and sort imports.
- **Double quotes** for strings and JSX attributes.
- **No `any`** (`lint/suspicious/noExplicitAny`). Use `unknown` or narrow types.
- **No non-null assertions (`!`)**.
- **Line Endings:** LF (`\n`) exclusively.

---

## 4. Workspace Skills Inventory

Canonical skills are located in `.agents/skills/`:
- [.agents/skills/content-authoring/SKILL.md](file:///.agents/skills/content-authoring/SKILL.md) – Markdown content in ruleset/episodes/world, frontmatter, prose standards
- [.agents/skills/visual-identity/SKILL.md](file:///.agents/skills/visual-identity/SKILL.md) – Retro-space-opera aesthetic, color philosophy, animation vocabulary
- [.agents/skills/ui-design-system/SKILL.md](file:///.agents/skills/ui-design-system/SKILL.md) – Design system rules, theming, tokens for `@repo/ui`
- [.agents/skills/game-mechanics/SKILL.md](file:///.agents/skills/game-mechanics/SKILL.md) – TTRPG domain knowledge, dice resolution, harm/stress
- [.agents/skills/diegetic-pdf/SKILL.md](file:///.agents/skills/diegetic-pdf/SKILL.md) – Printable in-universe PDF handout generation
- [.agents/skills/atomic-design/SKILL.md](file:///.agents/skills/atomic-design/SKILL.md) – Component classification and Storybook hierarchy
- [.agents/skills/project-conventions/SKILL.md](file:///.agents/skills/project-conventions/SKILL.md) – Naming, security, architectural decision records
- [.agents/skills/setup-troubleshooting/SKILL.md](file:///.agents/skills/setup-troubleshooting/SKILL.md) – Environment setup and common error fixes
- [.agents/skills/article-progress-nav/SKILL.md](file:///.agents/skills/article-progress-nav/SKILL.md) – Progress rail architecture and MFE integration

---

## 5. Storybook MCP

When working on UI in `@repo/ui`, use `eventuellit-sb` MCP (`http://localhost:6006/mcp`):
1. `list-all-documentation`
2. `get-documentation`
3. `get-storybook-story-instructions`
> [!CAUTION]
> **NEVER hallucinate component props.** Verify props exist via `get-documentation`.
