---
name: Ruleset Content Authoring
description: How to add and manage markdown content in the ruleset, episodes, and world MFEs, including frontmatter, heading conventions, and markdown-to-component mappings. Use when writing or editing content in apps/ruleset, apps/episodes, or apps/world.
---

# Ruleset Content Authoring

## Where Content Lives

- `apps/ruleset/src/content/` — Rules pages
- `apps/episodes/src/content/` — Episode journals
- `apps/world/src/content/` — World locations/factions

All `.md` files are auto-discovered. No React code edits needed to add a page.

## Frontmatter

```yaml
---
title: Ominaisuuden Nimi
order: 3
description: Valinnainen kuvaus
---
```

Optional `images` list: first image feeds the `Hero` background; remaining images interleave between major sections. Legacy single `image` field works as fallback.

## Heading Hierarchy

Content headings start at `###` (H3) — not H1 or H2. Those levels are owned by the host shell. Nested sections use `####` (H4).

## Markdown → Component Mapping

| Markdown | DS Component | Note |
|---|---|---|
| `` `inline code` `` | `<GameTerm variant="accent">` | Game term accent color |
| `**bold**` | `<GameTerm>` | Primary emphasis |
| `h1`–`h6` | `<Heading>` | |
| `p` | `<Text>` | |
| `ul`/`ol`/`li` | `<List>`, `<ListItem>` | |
| `a` | `<Link>` | |

## Content Style

- Prefer natural Finnish prose over condensed bullet jargon — terse bullets read as stiff in Finnish.
- Shorter paragraphs with supportive bullets.
- When syncing from source rulebooks, map every major heading before polishing language.
- All content is Finnish only.

## Article Progress Rail

Content MFEs that need the progress rail must publish `ArticleProgressSource` events and consume `ARTICLE_JUMP_EVENT`. See the `article-progress-nav` skill for the full integration contract.
