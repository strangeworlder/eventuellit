---
name: Visual Identity & Aesthetic Language
description: The retro-space-opera visual identity governing all UI work. Read before building any new feature or component. Defines the color philosophy, animation vocabulary, spatial feel, and anti-patterns.
---

# Visual Identity & Aesthetic Language

## Identity Statement

Eventuellit's aesthetic is **retro-space-opera / spy thriller** — Cold War–era space agency control rooms, analog instrumentation readouts, neon tube signage in dark corridors, vast expanses of vacuum punctuated by the glow of station consoles. The mood is tense but hopeful: rebels on worn-out ships making do with what they have.

Every UI decision should feel like it belongs on a station terminal or mission briefing screen.

## Color Philosophy

The three-scale palette is not decorative — each scale has a semantic role:

| Scale | CSS variable root | Semantic role | Where you'll see it |
|-------|------------------|---------------|---------------------|
| **Teal (secondary)** | `--color-secondary-*` | Information, navigation, readouts | Text hierarchy, borders, station connections, progress rails, muted labels |
| **Red (primary)** | `--color-primary-*` | Danger, action, urgency | Primary buttons, harm tags, headings (h1/h3), damage states, primary accents |
| **Blue (accent)** | `--color-accent-*` | Accent, metadata, world data | Statistical panels, skill tags, accent highlights, focus rings |

### The dark canvas

The base background (`#0f0f13`) is not just "dark mode" — it represents the void of space. Surfaces emerge from this darkness through subtle teal tints (`--theme-surface-tint`) like instrument panels glowing to life. Never design light-first and darken later; design for the void first.

### Royal purple (special)

`--color-royal-purple-*` is reserved for narrative markers on the station map — mysterious waypoints, anomalies. It is not a general-purpose color.

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
- Don't use decorative gradient shifts or shimmer effects on content areas.
- Don't animate layout properties (width, height, padding) — use opacity and transform.

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
- **No light-mode-first design.** The dark canvas is the primary experience. Light themes (`inverted`, `primary-light`, etc.) are for nested surface contrast, not for full-page use.
- **No decorative gradients.** Gradients in this system serve functional purposes: connection-line tension mapping, planet rim glow, stat-block value indicators. No generic gradient backgrounds.
- **No cartoonish or playful aesthetics.** This is tense retro sci-fi, not whimsical. Think Alien's Nostromo terminals, not Star Trek LCARS.
- **No opacity modifiers on text.** Use the semantic text hierarchy tokens (`--theme-text-muted`, `--theme-text-subtle`). See the `ui-design-system` skill for the full contrast rules.
