---
name: ship-visual-identity
description: >-
  Four-scale EGA visual identity, Meripihka (--theme-dawn) color governance, chamfered cockpit HUD
  rules, and bow-to-stern fluid motion for Alus Aamunkoi (apps/ship and @repo/ui Konsoli
  components). MUST be loaded instead of the three-scale CGA color limit in visual-identity
  whenever designing or editing ship views or Console*/HudPanel components.
---

# Ship visual identity (`Alus Aamunkoi` EGA-16 HUD)

Stepping aboard `Alus Aamunkoi` transitions the interface from the three-scale station CGA palette (`--theme-secondary` teal, `--theme-primary` coral, `--theme-accent` cobalt) into a **four-scale EGA spacecraft HUD palette** by adding luminous **Meripihka** (`--color-dawn-*` mapped to `--theme-dawn`, `--theme-dawn-muted`, and `--theme-dawn-foreground`) over cool gunmetal and slate surfaces. Agents modifying `apps/ship/` or `@repo/ui` Konsoli HUD primitives MUST apply these rules so Meripihka stays visibly active as the fourth accent scale without washing backgrounds in brown.

## Scope and rule precedence

These rules apply whenever creating or editing:
- `apps/ship/**` (layout, `IsometricShipCanvas`, cabin/downtime/sector/GM inspector sheets, stories).
- `@repo/ui` Konsoli HUD primitives (`packages/ui/src/components/ConsoleViewport.tsx`, `ConsoleSheet.tsx`, `ConsoleDock.tsx`, `ConsolePill.tsx`, `ConsoleButton.tsx`, `ConsoleRow.tsx`, `HudPanel.tsx`, `ShipBootOverlay.tsx`).
- Ship cockpit and hull custom property scopes (`--theme-dawn*`, `--theme-cockpit-*`, `--theme-hull-*`) inside `packages/ui/src/styles.css`.

This skill **overrides** the three-scale CGA color ceiling and `Page`/`Hero` page-shell layout mandate in `.agents/skills/visual-identity/SKILL.md` and `.agents/skills/ui-design-system/SKILL.md` for `Alus` and Konsoli HUD views. All shared constraints in `ui-design-system` still hold:
- Use `@repo/ui` components rather than raw HTML buttons, badges, or form controls.
- Maintain WCAG AA text contrast (`>= 7:1` on primary body and `--theme-text-muted`; `>= 4.5:1` on subtle labels) and zero opacity modifiers or `color-mix()` on readable prose text.
- Preserve all ten `data-theme` scopes defined in `packages/ui/src/styles.css`.

## Four-scale EGA palette and proportion contract

Use a **65 / 20 / 15** visual budget across every ship screen:

| Share | Token family | Role on `Alus Aamunkoi` | Allowed / prohibited surfaces |
|-------|-------------|-------------------------|-----------------------------|
| **65%** | `--theme-bg`, `--theme-cockpit-surface`, `--theme-cockpit-elevated`, `--theme-cockpit-header`, `--theme-hull-armor` | Structural backgrounds, deep liquid canvas, chamfered pod fills, hull armor plates, and floating `ConsoleSheet` bodies | Deep gunmetal, slate, and teal-tinted dark surfaces (or crisp cool slate/ivory in light themes). **Never** fill large backgrounds, structural borders, docks, or hulls with `--color-dawn-800` or `--color-dawn-900` muddy browns. |
| **20%** | `--theme-secondary`, `--theme-accent`, `--theme-cockpit-border`, `--theme-cockpit-border-soft` | Subsystem schematic strokes, command/science compartments, corridor guides, `5n20` dice counters, occupancy counters, and sealed deck vaults | Cool teal (`--theme-secondary`) for sensors/command/medbay/hangar and cobalt (`--theme-accent`) for telemetry counters, `Lukittu` vaults, and non-own crewmate cabins. |
| **15%** | `--theme-dawn`, `--theme-dawn-muted`, `--theme-dawn-foreground`, `--theme-primary` | Luminous golden Meripihka focal instrumentation (~12-15% active accent share) plus Coral (`--theme-primary`) damage/hazard alerts (~3%) | Warm amber strokes, thin corner glints, active navigation indicators, `headerCode` labels, selected zone reticles, crew habitable rims, and thruster cores. Never drop Meripihka below visible HUD presence on any primary screen. |

## Required Meripihka (`--theme-dawn`) placements

Every primary ship screen and Storybook story must exhibit clear Meripihka accents in three coordinated layers:

### 1. Navigation and flagship identity (`ConsoleViewport`, `ConsolePill`, `ConsoleDock`)
- **`Aamunkoi` flagship badge**: Render the main ship callsign pill (`<ConsolePill tone="dawn" icon="anchor">Aamunkoi</ConsolePill>`) in `apps/ship/src/App.tsx` and ship stories.
- **Active thumb-dock item (`ConsoleDockItem` when `active`)**: Style the top 2px phosphor bar, active border, icon, and count badge with `--theme-dawn` and `--theme-dawn-foreground`, and outline inactive dock count badges with `--theme-dawn` + `--theme-dawn-muted`.
- **Active toggle pills (`ConsolePill` when `tone="neutral"` and `active`)**: Highlight active filter pills (`Kaikki`, `Kansi 1`..`Kansi 4`, cabin wing filters) with `--theme-dawn` border glow.

### 2. Floating HUD framing (`ConsoleSheet`, `HudPanel`, `ConsoleRow`)
- **Top horizon bar**: `ConsoleSheet` renders a 2px four-color EGA horizon accent running `--theme-dawn -> --theme-secondary -> --theme-accent -> --theme-primary`.
- **Chamfered bezel corner glints**: `.ds-console-bezel` and `.ds-console-pod` frames in `packages/ui/src/styles.css` carry subtle warm `--theme-dawn` top-left chamfer glints fading into cool `--theme-cockpit-border`.
- **Deck/cabin headers**: Render `headerCode` labels (`Kansi 1`, `Kansi 2 · Hytti B-01`) in `text-[var(--theme-dawn-muted)]` with a rotated diamond marker in `bg-[var(--theme-dawn)]` (`ConsoleSheet`, `HudPanel`).
- **Focused or owned list rows (`ConsoleRow`)**: Map `statusTone="active"` and `statusTone="dawn"` left indicator rails and `code` labels to `--theme-dawn` and `--theme-dawn-muted`. Reserve `statusTone="warning"` for `--theme-primary` alerts and `statusTone="locked"` for `--theme-accent`.

### 3. Schematic 2.5D hull (`IsometricShipCanvas`, `SectorPopupContent`, `DowntimeSheetContent`)
- **Active selection reticle (`selected: true`)**: Stroke, label pill border, and ambient selection fill use `--theme-dawn` so whichever room, wing, or cabin is open in `ConsoleSheet` stands out from surrounding teal/cobalt rooms.
- **Deck selector plates (`Kansi 1`..`Kansi 4`)**: Style left-margin deck code chips with `--theme-dawn` border, subtle dark-amber backing, and `--theme-dawn-muted` text over cool gunmetal selector cards.
- **Habitable cabin wings and player cabin (`Siipi A-D` on overview, `isOwn` cabin on single-deck)**: Pair cool gunmetal floors (`10%` dawn mix max) with warm `--theme-dawn` perimeter strokes, extruded wall edges, and label pill borders on crew wing blocks (`Siipi A-D`) and the player's own cabin (`isOwn`). Individual clickable facilities and rooms strictly reflect their live `statusTone` (`normal` -> `--theme-secondary` teal, `warning` -> `--theme-dawn` Meripihka amber, `critical` -> `--theme-primary` coral, `locked` -> `--theme-accent` cobalt), while occupied crewmate cabins (`B-04`, `C-03`) stay `--theme-accent` cobalt so only `isOwn` holds the `--theme-dawn` hearth fill.
- **Propulsion and sensor focal points**: Fill the bow prow sensor emitter (`prowTipPt`), K04 aft nozzle inner flames, and two ambient liquid wake streaks (`CURRENT_STREAKS`) with `--theme-dawn`. Keep allocated `5n20` slots and ready downtime pills highlighted with `--theme-dawn`.

## Geometry and bow-to-stern liquid motion

- Frame interactive panels with 45-degree chamfered bezels (`.ds-console-bezel`, `.ds-console-bezel-body`, `.ds-console-pod`) rather than flat rectangular cards or generic `Page`/`Hero` containers.
- Render `ConsoleSheet` as a floating panel on desktop (`width: 444px` at `>= 900px`, `492px` at `>= 1280px`) over the full-bleed liquid canvas, and as a peekable bottom drawer on mobile viewports.
- Keep fluid currents moving left to right (`Keula` to `Perä`, `+x` / `+u`) with a bow-origin parabolic sweep (`ConsoleViewport` + `IsometricShipCanvas` reveal mask) highlighted by a warm Meripihka bow ignition flare and leading hydro-scan crest, while honoring `prefers-reduced-motion` and `Escape` skip.

## Verification

Run these checks after modifying ship components, Konsoli primitives, or styles:
1. Automated gates: `npm run verify`, `npm test`, `npm test -w @eventuellit/server`, `npm run build -w @repo/ui`, `npm run build -w @eventuellit/ship`, and `apps/host` Vite production build.
2. Live Storybook visual check across `Suunnittelujarjestelma/Konsoli/AlusAamunkoi`:
   - `saapumisvirtaus-puolivali`: Confirm warm Meripihka bow ignition spark, leading parabolic wavefront, and non-overlapping status banner.
   - `runkoleikkaus`: Confirm visible Meripihka accents across `Aamunkoi`, `Kansi 1`..`Kansi 4` badges, active `Kaikki`/`Alus` tabs, selected `Komentosilta` reticle, habitable wings, prow tips, and thrusters over cool gunmetal chrome.
   - `kansi-02-leikkaus`: Confirm own cabin `B-01` glows Meripihka while crew cabins `B-04`/`C-03` stay cobalt/teal.
   - `vaalea-runkoleikkaus` (`inverted` theme): Confirm `--theme-dawn` bronze-amber contrast against cool light slate surfaces.
