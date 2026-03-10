# Product Requirements Document: Eventuellit-antologia

## Overview
"Eventuellit-antologia" is a TTRPG system for episodic 2-3-shot adventures in a "liquid space" solar system. Movement is affected by currents and friction instead of vacuum logic. The narrative focuses on rebellion against tyranny, scarcity, and high-stakes decision making.
- **Genre:** Retro-Space Opera (50% analog/retro, 35% hard sci-fi, 15% fantastic), Action Drama, Surrealist, Existential.
- **System Base:** Heavily modified versions of Jukka Sorsa's "Hood" and Ville Takanen's "FREE/FALL".
- **Localization Requirement:** End-user language in UI and rules content MUST be Finnish only.

## 1. Core Resolution: Noppakoura and Axes

### Noppakoura (5n20)
- Baseline action capacity is **5n20** per situation/round.
- Players can split dice across multiple tasks or concentrate dice into one high-priority task.

### Axes
- Actions resolve through GM-defined **Axes** (for example speed + stealth), not a single roll.
- All required axes are resolved simultaneously.
- A player allocates dice to each axis.
- If an axis receives no dice, that axis fails automatically.
- Axis result = highest die on that axis (`k1` behavior).
- Baseline success threshold is **13**.

### Difficulty and Circumstances
- **Easy:** 9 (exceptionally favorable conditions).
- **Standard:** 13 (default).
- **Hard:** 17 (extreme conditions).
- Opposed checks (especially conflicts) should prefer opposition-based resolution over blanket threshold inflation.

### Critical Success (Doubles)
- If an axis succeeds and at least two dice show the same face value, the result is a critical success.
- Critical outcomes must grant meaningful advantage (for example extra effect, better positioning, additional intel, or increased damage impact).

## 2. Character Model: Attributes, Kesto, Skills, Equipment

### Core Attributes
- Three categories, each with two attributes:
  - **Keho:** Fysiikka, Nopeus
  - **Mieli:** Ymmärrys, Persoona
  - **Terä:** Näkemys, Näppäryys
- Characters select two strong attributes and gain **+n4** in each.
- When an attribute applies to an axis, roll the attribute die and add it to that axis result.

### Kesto
- Category Kesto starts at **8** for Keho, Mieli, and Terä.
- Each +n4 in an attribute raises its parent category Kesto by **+2**.

### Skills and Equipment
- **Skills** are narrative permission gates to attempt specialized actions.
- **Equipment** is a narrative/mechanical enabler (can unlock attempts, add axes, and define weapon damage die such as 1n6).
- If skill/equipment is missing, a character may still attempt by paying **1 point** from relevant Kesto.
- Positive fictional positioning/environment may allow attempts without Kesto payment.

## 3. Cooperation and Environment

### Assist
- One character can assist another with an axis roll.
- On success, the acting character gains **+1n20** to their next roll.

### Group Action
- In coordinated scenes, participants pool dice into shared axes.
- GM evaluates result quality by comparing successful axes against group size and scene demands.

### Environment Effects
- **Positive environment:** can waive Kesto access costs.
- **Negative environment:** can add mandatory axes and/or raise thresholds on affected axes.

## 4. Conflict and Combat Flow (Ajastin 20-0)

### Round Structure
1. **Declaration:** GM telegraphs normal opponent intent, players declare and allocate, then GM telegraphs special-opponent intent.
2. **Initiative:** Dice on Aloite axis define tempo on the timer. Tempo result is either `5 x dice committed` or highest die result (scene-specific method chosen by rules context/GM procedure).
3. **Movement:** Resolved on its own axis; one die supports one zone shift.
4. **Resolution:** Actions resolve in Ajastin order.

## 5. Damage, Sisu, Uhka, Harmi

### Sisu First
- Incoming damage first interacts with **Sisu**.
- Damage removes Sisu dice whose face value is at or below damage magnitude.

### Uhkanopat
- If an attack does not remove Sisu, it creates/accumulates **Uhkanopat** that amplify subsequent hits.

### Kesto and Harmi
- When Sisu is depleted, damage converts into Kesto loss (1:1) or **Harmi**.
- If a target has no Sisu, apply impact from highest relevant damage/threat die.
- Each Harmi permanently reduces action pool by **-1n20**.
- At **5 Harmi**, the character is removed from play.

## 6. Recovery and Advancement

### Recovery
- Between episodes, Sisu and Kesto recover.
- Harmi clears through downtime/maintenance procedures between episodes.

### Advancement
- End of episode: add one **n4** to an attribute.
- Two equal dice in the same attribute combine into next die tier (`n4 -> n6 -> n8 -> n10 -> n12`).
- Choose progression reward:
  - new skill + **+1n6 Sisu**, or
  - **+1n8 Sisu**.

## Technical Architecture Requirements
- **Dynamic rules context:** Ruleset and generator must support episode- and scene-specific axis definitions, thresholds, and telegraphed opposition behavior.
- **Dice state engine:** Frontend must track n20 pool allocation, per-axis outcomes, doubles detection, Sisu changes, Uhkanopat accumulation, Harmi-based pool reduction, and Ajastin sequencing.
- **Character model derivations:** Kesto derivation and attribute-die tier upgrades must be deterministic and test-covered.
- **Assist and group flows:** UX/state model must support assist grants (+1n20 next roll) and pooled group-axis resolution.
- **Environment-aware checks:** System must support positive/negative environment modifiers that alter access cost, mandatory axes, or threshold.
- **Environment safety baseline:** Frontend-backend integration uses environment endpoints (`VITE_API_BASE_URL`, `DATABASE_URL`, `CORS_ORIGINS`) with no hardcoded localhost runtime defaults.
- **Backend input integrity:** Character write endpoints enforce DTO validation, whitelist, and forbid-non-whitelisted behavior.
- **Article reading navigation:** Long-form markdown article MFEs must provide a vertical progress rail anchored under the host-level H1/title area (`Eventuellit: Säännöt` / `Eventuellit: Jaksot`) on all viewports. The rail starts below the H1 lane, then pins/sticks at top while scrolling. Progress fill must represent full host page scroll range (`0%` at top of page, `100%` at bottom), while clickable H3 markers are intermediate waypoints positioned by real heading offsets and may end before article progress reaches 100.
