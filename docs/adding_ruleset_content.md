# Adding Content to the Ruleset App

The `@apps/ruleset` microfrontend uses standard **Markdown (`.md`)** files for its text corpus, allowing content to be managed outside of React logic.

## Architecture
Content is parsed and rendered securely via `react-markdown` and `remark-gfm`. 
All markdown elements map directly to our Design System (`@repo/ui/components`).
- `h1-h6` maps to `<Heading>`
- `p` maps to `<Text>`
- `ul`, `ol`, `li` map to `<List>` and `<ListItem>`
- `a` maps to `<Link>`
- `` `inline code` `` maps to `<GameTerm variant="accent">`

## How to add a new Markdown feature

1. **Create the Markdown file:** Add your new content anywhere under `apps/ruleset/src/content/`. Nested folders are supported!
2. **Add Frontmatter:**
    At the top of the file, define the `title` and optionally `order` and `description` using YAML block:
    ```md
    ---
    title: Ominaisuuden Nimi
    order: 3
    description: Valinnainen kuvaus tästä sivusta
    ---
    ```
3. **Write Content:**
    - Use standard markdown.
    - If you want a `GameTerm` accent (used for mechanics like *Sisu*), wrap the text in backticks: `` `n20` `` 
    - Standard bold `**text**` and italics `*text*` are fully supported by our tokens.

**That's it!** The system dynamically discovers all `.md` files in the `content` folder and generates the necessary tabs and pages in the app automatically. No React code requires editing.

## Example `content.md` snippet:
```md
### Uusi Ominaisuus

Tämä on normaalia tekstiä.
- `Tärkeä termi:` Tämä on lista.
- Voit myös *kursivoida* tai **lihavoida** tekstiä.
```
