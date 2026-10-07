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

### Eliminating AI Writing Mannerisms & Formulaic Prose

AI models naturally gravitate toward formulaic structures that dilute Finnish narrative prose. Actively detect and eliminate the following anti-patterns:

1. **Formulaic Opening Sentences:**
   - **Never:** *"X on paikka, jonne / jossa / johon..."* or *"X toimii Kynnyksen sydämenä..."*
   - **Instead:** Open in media res, with immediate physical action, sensory impression, architecture, or environmental texture.

2. **The "Not only X, but also Y" & Definition by Negation:**
   - **Never:** *"Se ei ole vain telakka, vaan myös..."*, *"Tämä ei ole mikään tavallinen ase..."*
   - **Instead:** State directly what something *is* and what happens. Follow the positive expression standard in `docs/rules.md`.

3. **Preachy / Moralizing Conclusion Sentences:**
   - **Never:** Ending paragraphs with pompous philosophical wrap-ups (*"Vain aika näyttää..."*, *"Kaikella on kuitenkin hintansa"*, *"muistutus ihmisyyden katoavaisuudesta"*).
   - **Instead:** Cut the final sentence if it merely explains the "meaning" of the preceding paragraph. Trust the reader.

4. **Clichéd AI Metaphors & Fillers:**
   - **Avoid:** *"valon ja varjon leikki"*, *"herkkä tasapaino"*, *"monimutkainen kudos"*, *"sulatusuuni"*, *"kaksiteräinen miekka"*, *"toimii muistutuksena siitä, että..."*
   - **Avoid empty intensifiers:** *"lukemattomat"*, *"jatkuva"*, *"elintärkeä"*, *"eräänlainen"*. Use concrete numbers or precise sensory details instead.

5. **Symmetric Triads (Kolmen kopla):**
   - **Avoid:** Compulsive grouping of items into three abstract nouns (*"toivo, pelko ja epätoivo"*, *"koneet, ihmiset ja unelmat"*). Group irregularly (pairs, single punchy nouns, or concrete lists).

6. **Translationese & Passive Overload:**
   - Avoid excessive participial constructions and chained passives (*"Toimiessaan porttina ja ollessaan tunnettu..."*). Use active verbs and split into concise, flowing sentences.

7. **Narrative Distance & Voice Inconsistencies:**
   - Avoid accidental second-person address (*"sinun salaisuutesi"*, *"jos astut sisään"*).
   - Avoid jarring meta-level colloquialisms (*"vaikea rasti"*, *"koulukiusaajat"*, *"kahvijonossa"*). Keep the tone diegetically grounded.

8. **Invisible Formatting Artifacts:**
   - Strip all soft hyphens (`&shy;`) from headings and markdown bodies.

### World & Lore Prose Conventions (`apps/world/src/content/`)

1. **Modern Attention-Economy & Corporate Satire is Intentional:**
   - In Kynnys (especially Ekklesia and KW-konsortio), modern terms like *canceloiminen*, *huomiotalous*, *syötteet*, *tilit*, *auditointi* and *sopimusparametrit* are deliberate stylistic choices that deliver immediate satirical bite.
   - **Do not** disguise or replace them with clunky pseudo-archaic fantasy terms.
   - Focus on writing natural, fluent Finnish syntax around these concepts without administrative jargon stiffness or translationese.

2. **Respect Content Stubs — Do Not Artificially Bloat:**
   - Short entries (approx. 30 lines) represent areas awaiting gameplay data.
   - When polishing language, improve atmospheric resonance, sensory details, and phrasing, but **do not invent or hallucinate large new lore blocks**. Keep stubs compact and punchy.

### Jaksokuvausten standardirakenne ja taitojen nimeäminen (`metadata/Jaksot.md`, `apps/episodes/`)

Kun laaditaan tai päivitetään jaksokuvauksia:

1. **Rakenne noudattaa poikkeuksetta tuotantomallia (`metadata/Jaksot.md`):**
   - `## **Jakson Nimi**`
   - `**Eventuellit: [Monesko] jakso. [Yhden virkkeen tiivistelmä].**`
   - `* **Sijainti:** ...`
   - `* **Genre:** ...`
   - `### **Premissi**`
   - `### **Tyylilaji**` (Vertailuteokset vuosilukuineen, tunnelman ja esteiden anatomia)
   - `### **Kynnys ja [Asema]**` (Aseman kanoninen julkinen lore)
   - `### **Hahmot ja motiivit**` (tai `### **Hahmot**` + `#### **Motiivit**`)
   - `#### **Taidot**`
   - `#### **Tarvikkeet**`
   - Kaikissa alaotsikoissa käytetään lihavointia (`### **Premissi**`). Ei YAML-frontmatteria leipätekstin sekaan.

2. **Premissi on diegeettinen "mainospuhe" (Pitch):**
   - Premissi puhuttelee pelaajahahmoja suoraan ja maalaa lähtötilanteen, moraalisen konfliktin ja kuolemanvaaran.
   - **Ei koskaan** kuvata pelipöydän toimintaa (*"pelipöydässä kamppaillaan"*, *"pelaajat heittävät noppaa"*).
   - **Ei koskaan** paljasteta tulevia juonenkäänteitä tai skenaarioprepissä olevia salaisuuksia ennalta.

3. **Taitojen mekaaninen nimeämissääntö:**
   - Taidot toimivat suoraan tietokannan (`episode_skills`) tunnisteina ja hahmolomakkeen valintoina.
   - **Taitojen nimissä ei saa koskaan käyttää kauttaviivaa ("X / Y").**
   - Jokaisella taidolla on aina yksi yksikäsitteinen, iskevä ja teemaan maadoitettu nimi sekä 1–2 virkkeen aistillinen ja toiminnallinen kuvaus.
   - Taitolistan laajuus on kattava (tyypillisesti 14–20 taitoa).

4. **Informaatiorajat:**
   - Jaksokuvaus on Tason 2 julkista materiaalia. Siinä ei koskaan avata Tason 3 (huonon pelinjohtamisen allegoria, Petri-nimeämisteoria) eikä Tason 4 (Tyrannin tyhjä valtaistuin, sääntöartefaktien kosmologia) salaisuuksia.

## Article Progress Rail

Content MFEs that need the progress rail must publish `ArticleProgressSource` events and consume `ARTICLE_JUMP_EVENT`. See the `article-progress-nav` skill for the full integration contract.
