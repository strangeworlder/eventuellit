---
name: Ruleset Content Authoring
description: How to add and manage markdown content in the ruleset, episodes, and world MFEs, including frontmatter, heading conventions, and markdown-to-component mappings.
---

# Ruleset Content Authoring

## Architecture

Content in `@apps/ruleset`, `@apps/episodes`, and `@apps/world` is managed as standard **Markdown (`.md`)** files, parsed and rendered via `react-markdown` and `remark-gfm`. All markdown elements map directly to Design System components from `@repo/ui`.

### Markdown → Component Mapping

| Markdown Element | DS Component |
|---|---|
| `h1`–`h6` | `<Heading>` |
| `p` | `<Text>` |
| `ul`, `ol`, `li` | `<List>`, `<ListItem>` |
| `a` | `<Link>` |
| `` `inline code` `` | `<GameTerm variant="accent">` |
| `**bold**` | `<GameTerm>` (primary emphasis) |
| `*italic*` | Standard italic styling |

## Adding New Content

### 1. Create the Markdown File

Add content under the appropriate `src/content/` directory:
- `apps/ruleset/src/content/` — Rules pages
- `apps/episodes/src/content/` — Episode journals
- `apps/world/src/content/` — World locations/factions

Nested folders are supported.

### 2. Add Frontmatter

```yaml
---
title: Ominaisuuden Nimi
order: 3
description: Valinnainen kuvaus tästä sivusta
---
```

Optional `images` frontmatter list for richer visual layout:
- First image feeds `Hero` background
- Remaining images interleave between major markdown sections
- Legacy single `image` field works as fallback

### 3. Write Content

- Use standard markdown
- Wrap game terms in backticks for `GameTerm` accent: `` `n20` ``
- Bold and italics fully supported

### 4. Heading Hierarchy

In `apps/ruleset/src/content/*.md`:
- Top-level content headings start at `###` (H3)
- Nested sections use `####` (H4)
- This matches page composition and heading hierarchy

## Automatic Discovery

The system dynamically discovers all `.md` files in the `content` folder and generates necessary tabs/pages automatically. No React code editing required.

## Content Style Guidelines

- Keep content concise but narrative — shorter paragraphs with supportive bullets.
- Use plain Finnish wording; minimize shorthand.
- Ultra-condensed bullet jargon reads technical and stiff in Finnish — prefer natural prose.
- When syncing from source rulebooks, explicitly map every major heading before polishing language.

## Article Progress Navigation

Content MFEs that need the progress rail must:
1. Use markdown glob loading with frontmatter parsing
2. Publish `ArticleProgressSource` events
3. Consume `ARTICLE_JUMP_EVENT` for navigation
4. Add source name to `ArticleProgressSource` in `packages/ui/src/components/article-progress-events.tsx`
5. Build rail sections from rendered `h3[id]` DOM nodes (not markdown re-parsing)
6. Generate H3 anchor IDs through shared utilities in `@repo/ui`
