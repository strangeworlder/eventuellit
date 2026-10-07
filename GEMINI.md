# Eventuellit – Project Rules for Gemini / Antigravity

See [AGENTS.md](file:///c:/Users/alvan/event/AGENTS.md) for full rules and workflow specifications.

## 1. Content Authoring & Finnish Prose Standards

> [!IMPORTANT]
> **Before writing or editing ANY markdown or narrative content in `apps/ruleset/`, `apps/episodes/`, `apps/world/`, or `metadata/Jaksot.md`, you MUST read and follow the [content-authoring skill](file:///.agents/skills/content-authoring/SKILL.md).**

All narrative content is Finnish only. You MUST strictly eliminate formulaic AI mannerisms:
1. **Never use formulaic openers:** *"X on paikka, jonne / jossa / johon..."* or *"X toimii Kynnyksen sydämenä..."*. Start in media res, sensory, physical, atmospheric.
2. **Never use definition by negation:** *"Se ei ole vain telakka, vaan myös..."*. State directly what something is.
3. **Never end paragraphs with moralizing conclusions:** *"Vain aika näyttää..."*, *"Kaikella on kuitenkin hintansa"*.
4. **Avoid clichéd AI metaphors:** *"valon ja varjon leikki"*, *"herkkä tasapaino"*, *"monimutkainen kudos"*, *"sulatusuuni"*, *"kaksiteräinen miekka"*, *"toimii muistutuksena siitä, että..."*.
5. **Avoid symmetric triads:** Compulsive grouping into 3 abstract nouns (*"toivo, pelko ja epätoivo"*).
6. **Episode skill names:** In `metadata/Jaksot.md` and `apps/episodes/`, **never use slashes in skill names** (`"X / Y"` is forbidden).
7. **Heading hierarchy:** Content markdown headings start at `###` (H3) — never H1 or H2.

---

## 2. Design System Pre-Flight

> [!CAUTION]
> **Before building ANY new feature or UI:**
> 1. Read [.agents/skills/visual-identity/SKILL.md](file:///.agents/skills/visual-identity/SKILL.md).
> 2. Read [.agents/skills/ui-design-system/SKILL.md](file:///.agents/skills/ui-design-system/SKILL.md).
> 3. Use `@repo/ui` components (`<Button>`, `<Card>`, `<Input>`, `<Text>`, `<Heading>`, etc.) — NEVER raw HTML elements with custom Tailwind classes.

---

## 3. Verification

Always verify before completion:
```bash
npm run verify
```
Never run bare `tsc`. Use `npm run check-types`.
Format with Biome: `npm run lint:fix`. Double quotes, LF line endings, no `any`.
