---
name: visual-identity
description: Retro-space-opera visual identity governing all UI work in Eventuellit. Defines the color philosophy, animation vocabulary, spatial feel, and aesthetic anti-patterns. MUST be consulted before designing or building any UI component, page layout, or theme in packages/ui or frontend apps.
---

# Visual Identity & Aesthetic Language

## Identity Statement

Eventuellit's aesthetic is **retro-space-opera / spy thriller**: Cold War space agency control rooms, analog instrumentation readouts, neon tube signage in dark corridors, and calm expanses of vacuum punctuated by softly lit station consoles. The mood is tense yet composed, built for rebels on worn-out ships making do with calibrated tools.

Every UI decision should belong on a disciplined station console or mission briefing screen, pairing calm void backgrounds (`#0f0f13` in dark base) with whisper-subtle luminous surfaces rather than heavy boxes.

## Color Philosophy

The three-scale palette is not decorative — each scale has a semantic role:

| Scale | CSS variable root | Semantic role | Where you'll see it |
|-------|------------------|---------------|---------------------|
| **Teal (secondary)** | `--color-secondary-*` | Information, navigation, readouts | Text hierarchy, borders, station connections, progress rails, muted labels |
| **Red (primary)** | `--color-primary-*` | Danger, action, urgency | Primary buttons, harm tags, headings (h1/h3), damage states, primary accents |
| **Blue (accent)** | `--color-accent-*` | Accent, metadata, world data | Statistical panels, skill tags, accent highlights, focus rings |

### The dark canvas

The base background (`#0f0f13`) represents the deep void of space. Surfaces emerge from this canvas through whisper-subtle directional tints (`--theme-surface-wash`), `1px` overhead edge lighting (`--theme-edge-light`), and theme-scoped surface tints (`--theme-surface-tint`), like precision instrument panels gently catching ambient light. Keep the backdrop calm and readable, and preserve at least 7:1 WCAG AA contrast on interior surface fills.

### Royal purple (special)

`--color-royal-purple-*` is reserved for narrative markers on the station map — mysterious waypoints, anomalies. It is not a general-purpose color.

### Meripihka on Alus Aamunkoi (EGA ship exception)

`apps/ship/` and the `@repo/ui` Konsoli HUD primitives (`ConsoleViewport`, `ConsoleSheet`, `ConsoleDock`, `ConsolePill`, `ConsoleButton`, `ConsoleRow`, `HudPanel`, `ShipBootOverlay`) expand the base three-scale CGA palette to a four-scale EGA HUD palette by activating Meripihka (`--color-dawn-*` mapped to `--theme-dawn`, `--theme-dawn-muted`, and `--theme-dawn-foreground`) over cool gunmetal and slate surfaces. When designing or editing ship or Konsoli UI, read [.agents/skills/ship-visual-identity/SKILL.md](file:///.agents/skills/ship-visual-identity/SKILL.md) instead of enforcing the three-scale CGA restriction above.

## Animation Vocabulary

### Ambient life (brand moments only)

- **Fluorescent flicker** on `Heading h1` characters: aging neon tube signage effect. Random characters briefly flicker. Only on h1 — never broadly applied.
- **Breath glow** on `Heading h1` characters: a slow radial glow that ripples outward from a random character, mimicking a power surge along aging circuitry.
- **Harm pulse** on `AspectTag variant="harm"`: a warm red `box-shadow` pulse suggesting a wound that throbs. Uses `aspect-pulse` keyframe.

These are *world-building details*, not UI embellishment. They make the interface feel like a lived-in piece of station equipment.

### UI feedback (functional)

- **Micro-interactions:** `hover:-translate-y-0.5` lift, `active:scale-[0.98]` press-back on buttons. Teal hover glows on interactive cards.
- **Enter/exit:** `animate-in fade-in` for content, `zoom-in-95` for modals. Duration tokens from `styles.css`.
- **Navigation transitions:** `StationConnections` uses framer-motion for compass-rose scene pans and spring-animated die arrivals — this is the most complex animation in the system and serves as the spatial navigation metaphor.

### What NOT to animate

- Don't add ambient animations to non-h1 elements.
- Don't use flashy gradient shifts, shimmering sweeps, or loud hover glow on content areas; interactive spotlight tracking (`useSurfaceSpotlight`) belongs exclusively on clickable card/panel states using theme-scoped `--theme-spotlight` tokens (~6-9% tint).
- Keep navigation frames like `Sidebar` static and grounded without sliding indicator bubbles.
- Don't animate layout properties (width, height, padding); use `opacity`, `transform`, and `scale`.
- Respect `prefers-reduced-motion: reduce` across all transitions, enter animations, and pointer spotlight handlers.

## Spatial Metaphors

### The station map

`StationConnections` is the primary spatial component — a compass-rose of d20 dice nodes connected by dashed gradient lines. Each node represents a station in the liquid-space solar system. This component establishes the core spatial language:
- **D20 shapes as location markers** — dice are physical objects in this world, not abstract icons
- **Dashed connection lines** — routes between stations, with gradient colors indicating tension
- **Tension-as-color** — station danger mapped to the color scales (teal = safe, red = broken, blue = high tension)

### The starfield

`HeroCanvas` renders a twinkling parallax starfield with a planet silhouette. This is the ambient spatial backdrop — the viewport into space behind the station UI.

## The Glitch Vocabulary

The `ObscuredWrapper` glitch effect is an **in-world spoiler mechanic** — it represents classified intel, hidden data, content the player hasn't unlocked yet. It uses clip-path animation, positional offset, and opacity flicker to simulate corrupted data.

This is NOT decorative noise. Use it only through the `ObscuredWrapper` component for content that is intentionally hidden from specific users/players.

## Game Component Conventions

Game-domain components (`DicePoolAllocator`, `ActiveStatBlock`, `EnduranceBlock`, `AttributeCard`, `DiceIcon`, `AspectTag`, `SkillMasonry`) share these conventions:

- **Dense, instrument-panel layouts** — compact data presentation, not spacious content layouts
- **Dice as physical objects** — `DiceIcon` renders polyhedral SVG shapes (d4–d20, swirl) with internal wireframe detail, not flat icons
- **State through color** — active/inactive states use `--theme-primary` vs `--theme-secondary`, damage uses red mixing (`color-mix`)
- **Drop shadows as indicator glow** — `drop-shadow` with `color-mix` to suggest energy/status, not as decorative elevation
- **Uppercase heading font** — game headings use `font-heading` (Outfit) in uppercase for a military/technical feel

## What NOT To Do

- **No generic UI frameworks.** Don't reach for Material, Bootstrap, or shadcn patterns. Use `@repo/ui` components exclusively.
- **No raw HTML with Tailwind.** Never write `<button className="bg-teal-500 px-4 py-2 rounded">` — use `<Button>`.
- **Respect the 10-theme light/dark pairing.** The dark canvas (`base`) is the primary page backdrop, while light themes (`inverted`, `primary-light`, `secondary-light`, `accent-light`) provide crisp surface contrast. Every surface wash, edge light, spotlight, and fade divider must use its Tier-2 `--theme-*` token so both dark and light scopes remain tuned and legible.
- **No flashy or off-theme gradients.** Subtle gradients are welcome when they establish surface depth (`--theme-surface-wash`), `1px` overhead rim lighting (`--theme-edge-light`), progress paths, or section fade dividers (`--theme-divider-fade`). Avoid loud multi-stop rainbow fills or saturated full-card washes that compete with body copy.
- **No cartoonish or playful aesthetics.** This is composed, tactile retro sci-fi: fine bevels, quiet luminance, and disciplined instrumentation rather than whimsical UI chrome.
- **No opacity modifiers on text.** Use the semantic text hierarchy tokens (`--theme-text-muted`, `--theme-text-subtle`). See the `ui-design-system` skill for the full contrast rules.
