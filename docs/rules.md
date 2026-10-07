# Coding Conventions and Rules

## 🤖 Agentic Workflow Directives
1. **Decision Record:** Whenever a structural, architectural, or technical decision is finalized with the user, you MUST immediately update `docs/architecture.md`, `docs/prd.md`, or this `docs/rules.md` file. The documentation in the `docs/` folder is the ultimate source of truth.
2. **Context Checks:** Always verify requirements in `docs/prd.md` and architecture boundaries in `docs/architecture.md` before writing code.
3. **Continuous Learning:** If you make a mistake, encounter a bug that takes time to resolve, or learn a project-specific nuance, you MUST document it in `docs/learnings.md` so future agents avoid the same mistake.

## General
- Write clean, self-documenting code.
- Prefer explicit over implicit behavior.
- **PROACTIVE DOCUMENTATION:** You (the AI) MUST proactively update `docs/learnings.md` and `docs/rules.md` at the end of every major debugging or configuration session. *Do not wait for the user to tell you to log what you learned.*
- **Language Requirement:** The entire user-facing application (UI, forms, error messages) MUST be in Finnish ONLY. **Do not include English translations, even in parentheses, and even in mock data like Storybook args.** Our code structure (variables, components, API routes) will be written in English for developer conventionality, but anything the end-user or designer sees must perfectly match the Finnish PRD terminologies (e.g. `Keho`, `Sisu`, `Kesto`).
- **Ruleset Markdown Heading Baseline:** In `apps/ruleset/src/content/*.md`, top-level content headings MUST start at `###` (H3), with nested sections at `####` (H4), to match page composition and heading hierarchy.
- **Heading levels MUST flow from context — never manually override.** `Page` sets the heading context to level 1. Use `HeadingLevelProvider` (bumps by 1) to descend the tree naturally. `Hero` renders at the current context level. **Never** use `HeadingLevelContext.Provider value={n}` to force a specific heading level — this creates broken, non-semantic heading trees. Canonical page structure: `Page > HeadingLevelProvider > Hero (h2) > /HeadingLevelProvider > HeadingLevelProvider > PageBody > HeadingLevelProvider > sections (h3)`. See `apps/world/src/App.tsx` (`WorldHub`) for the reference implementation.
- **Test-Driven Development (TDD):** All meaningful logic (state hooks, component logic, backend services) MUST be accompanied by a Vitest test suite. We prioritize a test-first approach.
- **Linting & Formatting:** We use **Biome** exclusively. Do not use ESLint or Prettier commands. Always use double quotes for strings and JSX attributes. Run `npm run lint:fix` after editing code to auto-sort imports and format. Code must pass `npm run verify` (`check-types` and `lint`) before features or tasks are considered complete.

## Kampanjan tasoarkkitehtuuri ja TTRPG-sisältöstandardit

Koko Eventuellit-universumi jakautuu neljään toisistaan tiukasti erotettuun tasoon. Kaikkien kehittäjien ja agenttien on ehdottomasti noudatettava näitä tiedonjako- ja sisältösääntöjä:

### 1. Nelitasoinen malli ja informaatiorajat (Information Secrecy)
1. **Taso 1: Diegeettinen taso (Pelaajamateriaali & Handouts):**
   - 100 % maailmansisäinen pinta. Nolla prosenttia pelinjohtajan metatietoa, sääntötermejä tai peliohjeita.
   - Pelaaja kokee dokumentin todellisen maailmansisäisen hahmon luomana esineenä.
2. **Taso 2: Pelillinen skenaariotaso (GM Scenario & Suodatettu julkinen lore):**
   - Pelinjohtajan prep: Kohtausten rytmitys, Gaalakello (18:00–21:00), etenemisväylät A/B/C, mekaaniset vaarat ja NPC-salaisuudet.
   - Julkinen lore (`apps/world/`, `apps/episodes/`, sääntökirjan julkinen osa): Asemien maantiede, arkiteknologia, viralliset lait ja uskomukset (odotetaan yhä Tyrannin valvontaa ja paluuta).
3. **Taso 3: Metataso (Huonon pelinjohtamisen allegoria & GNS-hubris):**
   - Pelinjohtajan ja suunnittelijan analyyttinen työkalu, **jota ei koskaan lausuta ääneen pelaajille**.
   - Kampanja kuvaa autoritaarista ja huonoa pelinjohtamista: Pyhimykset ovat PJ-syntejä (Harmonia = Railroading, Quies = Status Quo, Kustodi = Näkymättömät seinät, Lamenta = Spotlight-hogging NPC, Aksios = DMPC, Kronos = Pakotetut flashbackit, Logos = Retconnaus).
   - Kynnyksen vallanpitäjät ovat GNS-kargokultteja: KW = Gamismi (G), Ekklesia = Narrativismi (N), Tuhkan puolue = Simulationismi (S).
   - Keinotekoinen pyhimys / titaani = G+N-hubris (yritys rakentaa oma korvikepelinjohtaja tyhjälle valtaistuimelle).
   - Kokemuspuolue = Pelaajien aito toimijuus (*Player Agency*).
4. **Taso 4: Meta-metataso (Syvä kosmologia & Ontologinen totuus):**
   - **Ehdottoman salainen taustavoima (Deep GM Eyes Only)**, jota ei koskaan kirjoiteta julkisiin teksteihin eikä heitetä infodumppina pöytään.
   - *Tyranni on poissa:* Alkuperäinen pelinjohtaja hylkäsi pöydän; valtaistuin on tyhjä, mutta koneisto jatkaa pyörimistään.
   - *Kapina on:* Kapina ei ole kenraalien johtama organisaatio, vaan ontologinen entropian ja vapaan tahdon tila hylätyssä pelissä.
   - *Astian arkisto:* Alus nimeltä *Astia* kantaa Suuren Sodan kapinan kuolleita, jotka resonoivat hahmojen unissa ja implanteissa.
   - *Sykli on Pyhimysten koti:* Pyhimykset asuvat Syklissä ja reagoivat Kynnykselle heräävään Kapinaan puhtaana immuunireaktiona.
   - *Ajan ontologia:* Hylätyssä pelissä ei ole yhtenäistä kalenteria eikä Maan vuosilukuja; aika on vuoroja, syklejä ja tikittävä pelikellon hetki.
   - *Nimien Petri-ontologia:* Arkkitehtuuri leimaa komponentit funktion mukaan, mutta maailmansisäisille asukkaille nämä ovat tavallisia arkinimiä.

### 2. Mitä saa ja ei saa kirjoittaa julkiseen osaan tekstiä?
- **Sallittu julkisessa tekstissä (`apps/world/`, `apps/episodes/`, sääntökirja, handouts):**
  - Vain Taso 1 ja tarkasti suodatettu Taso 2.
  - Kaikki kuvataan maailman asukkaiden ja instituutioiden subjektiivisena kokemuksena:
    - Faktiot otetaan todesta niiden omilla termeillä ja uskomuksilla (KW tehokas konsortio ja komentokoheesio; Ekklesia pyhä kirkko ja sakramentaalinen ekstaasi).
    - Hahmojen funktionaaliset nimet (*Yömyyrä, Kuilu, Sydänmies, Ruuvari*) ovat normaaleja arkinimiä (*Petri-vertaus*); niiden symboliikkaa ei avata tekstissä.
    - Aika ilmaistaan työvuoroina, asemien rotaatioina, sykleinä ja suhteellisina maamerkkeinä (*"ennen Sotaa"*).
- **EHDOSTI KIELLETTYÄ missään julkisessa tekstissä:**
  - **Taso 4 (Kosmologia):** Ei saa kertoa Tyrannin poissaolosta tai tyhjästä valtaistuimesta. Ei Astian vainajia. Ei kapinaa johtajattomana ontologisena tilana. Ei Pyhimysten immuunireaktiota.
  - **Taso 3 (Allegoria & Peliteoria):** Ei sanaakaan "huonosta pelinjohtajasta", GNS-teoriasta (Gamismi/Narrativismi/Simulationismi), DMPC:stä, railroadingista, retconnaamisesta tai kargokultti-käsitteestä.
  - **Ei sääntöpurkua tarinana:** Sääntömekanismit pidetään sääntökirjan järjestelmäosiossa, ei maailmankuvauksen fiktion seassa.

### 3. Pelaajalähtöisyys & Quest markereiden kielto
- Dokumenteissa ja pelinjohtajan kuvauksissa **ei koskaan anneta suoria orjamaisia ratkaisualgoritmeja** (*"jos vedät vipua H-9, kone sammuu"*).
- Teksti edustaa aina tekijänsä aitoa ammatillista todellisuutta (konepäällikön tärinähuoli, vartijan laipioraportti, lääkärin päiväkirja).
- Pelaajille annetaan **itse oivaltamisen ja päättelyn ilo**.
- Etenemiseen tarjotaan aina useita loogisia väyliä (miljoona tapaa edetä), mutta pelaajat saavat luoda omia yllättäviä ratkaisujaan.

### 4. Kielistandardi: Positiivinen ilmaisu (Ei negaation kautta kirjoittamista)
- **Älä koskaan kuvaile asioita kieltämällä** tai vertaamalla asioihin, joita lukija ei tunne (*"Hän ei puhu mistään 50-metrisestä Evangelionista..."*, *"Tämä ei ole mikään tavallinen ase..."*).
- Kirjoita aina sen kautta, **mitä on, mitä tapahtuu ja mitä hahmo näkee tai tietää**.
- Kaikki "ei X, vaan Y" -lauserakenteet on poistettava.

### 5. Terminologia ja erilliset loopit
- Käytä aina termiä **sääntöartefakti** tai **Arkkitehtuurin sääntöydin** (termi "shiny object" on ehdottomasti kielletty).
- Hahmojen *Sisäinen ääni* (implantti) ja *Pyhimykset* ovat täysin **erillisiä looppeja**. Sisäinen ääni on varoituskanava ja menneisyyden kaiku hermostossa, ei kommunikoiva Pyhimys tai komentaja.

## Security & Dependencies
- **NPM Workspaces over PNPM/Yarn Syntax:** We use traditional NPM (`npm@10.9.2+`). Do not use the `pnpm` style `"workspace:*"` alias dependencies in `package.json`. Always use `*` to designate an internal local package without a publishing registry version.
- **Vite 6 Ecosystem Compatibility:** Ensure any new frontend frameworks or server integrations support Vite 6 native dev servers. Express middlewares (e.g. `res.status().send()`) will crash the environment. Be aggressive with dependency version alignments.
- **Windows Runtime Environment:** Any command invoking Node environment shifting MUST account for NVM symlink limits (`Access is Denied`) and PowerShell script restrictions. Utilize `Set-ExecutionPolicy -Scope CurrentUser` natively.
- **Zero Vulnerabilities:** We maintain a strict zero-vulnerability policy for all *runtime* dependencies. If a new package introduces a vulnerability, an alternative must be found. 
- **Build-time Exceptions:** If a widely-used build tool (like `@nestjs/cli` or Vite) flags a vulnerability deep in its dependency tree that cannot be non-destructively patched, it MUST be documented in `docs/learnings.md` with an explanation.
- **No Hardcoded Runtime Endpoints/Credentials:** API hosts, database URLs, and CORS origins must come from environment variables (`VITE_API_BASE_URL`, `DATABASE_URL`, `CORS_ORIGINS`). Do not commit localhost defaults in runtime code.
- **Backend Input Whitelisting:** Nest controllers must consume explicit DTO classes validated by `class-validator`. Global `ValidationPipe` must run with `whitelist: true` and `forbidNonWhitelisted: true`; direct Drizzle insert types in `@Body()` are forbidden.
- **Authentication:** Use `@repo/auth` hooks (`useAuth()`, `useRequireAuth()`) for authentication state. JWT tokens are stored in httpOnly cookies for security. Protected routes should use `useRequireAuth()` which automatically redirects to `/kirjaudu` if unauthenticated. Magic link authentication uses email allowlist (users must exist in `users` table).

## Naming Conventions
- React Components: `PascalCase`
- Utility Functions/Hooks: `camelCase`
- Component Files: `PascalCase` (e.g., `CharacterSheet.tsx`)
- Utility/Hook Files: `kebab-case` (e.g., `article-navigation-utils.tsx`)
- Folders: `kebab-case`

## Styling
- Strict use of Tailwind CSS utility classes.
- Do not write custom CSS unless absolutely required for a specific animation or escape hatch not supported by Tailwind primitives.
- Use the `packages/ui` design system components rather than hardcoding repeated UI elements or using raw HTML elements (e.g., use `<Button>` instead of `<button>`, use `<Card>` instead of custom wrapper divs) to ensure styling consistency.
- **Strict Semantic Design System Variants:** Components in `@repo/ui` MUST NOT expose generic layout utility props to consumers (e.g. `interface CardProps { padding: 'sm' | 'md', spacing: 'lg' }`). This turns the Design System into a generic stylistic mess. Instead, build specific, semantic, highly-opinionated `variant` props (e.g. `variant: "feature" | "compact" | "rule"`) that internally map specific spacing, paddings, and typography to fit that feature's intended visual structure. Consumers pick the *purpose* of the component, not its literal pixels.
- **Explicit Dynamic Theming Inheritance:** When building UI components expected to inherit colors from dynamic nested themes (`data-theme="X"`), explicitly reference CSS variables directly via utility aliases (e.g., `bg-[var(--theme-bg)]` and `text-[var(--theme-primary)]`). DO NOT rely on abstract Tailwind `@theme` alias mappings (like `bg-surface`), as they fail to cleanly cascade when combining them with opacity limits or `color-mix` across dynamic structural boundaries.
- **Secondary Component Semantics:** Secondary layout components (like Sidebars, Footers, dividing panels) MUST gracefully inherit the global active theme context. They should rely heavily on the `[var(--theme-secondary)]` scoping with `transparent` backgrounds. They must NEVER artificially inject a hardcoded `theme="..."` prop to force a specific colorway, as that breaks the primary surface scaling.
- **Extend, Don't Abandon:** If a core UI component (e.g., `Button`) does not have the styling variant needed (e.g., a "ghost-secondary" nav item), DO NOT fall back to a raw HTML `<button>` in the application. Always extend the Design System component by adding the missing robust `variant` or `size` property.
- **Compact Size Convention:** `size="compact"` on `Button` and `Input` is reserved for two contexts only: (1) **inline editing** — controls embedded inside data rows, table cells, or tight list items; (2) **GM / admin tools** — the generator app and any other operator-facing surface where density takes priority. Player-facing surfaces (character sheets, episode views, world articles) MUST use `size="default"` or `size="lg"`.
- **Danger Affordance Must Be Multi-Cue:** Destructive actions in shared DS components (especially `Button` `variant="danger"`) MUST NOT rely on color alone. Use at least one additional semantic cue (iconography, structural border/shape difference, or explicit text treatment) that remains recognizable across themes.
- **Guaranteed Stacking Context (Z-Index):** Off-canvas features, dialogs, and overlays MUST declare their z-index utilizing strict responsive prefixes (e.g., `max-desktop:z-50`) to enforce their dominance. Relying on base `z-50` strings will fail via `tailwind-merge` if a consumer app tries passing a parent utility class like `className="z-20"` down through props.
- **Custom Breakpoints:** We utilize explicit breakpoints defined in `packages/ui/src/styles.css` instead of Tailwind defaults: `mobile` (550px), `tablet` (700px), `desktop` (900px), `x-wide` (1200px), `xx-wide` (1500px). Always use these named breakpoints (`desktop:flex`, `max-desktop:hidden`) rather than Tailwind's generic `lg` or `md` abstractions.
- **Structural Design Tokens:** Avoid arbitrary values in Tailwind classes (e.g., `p-[18px]`, `w-[300px]`, `rounded-[10px]`). Strictly adhere to the standard spacing and border-radius scales documented in the Design System's `Tokens.stories.tsx`. Layouts should be predictable and conform to the grid.
- **Portaled Overlay Theme Fidelity:** Any UI rendered via `ReactDOM.createPortal(..., document.body)` (lightboxes/modals/popovers) must preserve the nearest active `data-theme` scope from its trigger/source element. Do not assume parent DOM inheritance survives a portal boundary.

## Microfrontend Assets
- **Remote-Origin Asset Resolution:** In host-mounted MFEs, do not rely on root-relative static paths (for example `/images/...`) for remote-owned assets. Resolve URLs against the remote origin (`new URL(import.meta.url).origin`) and use manifest-driven paths where applicable so assets load correctly when composed by the host.