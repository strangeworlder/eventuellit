---
name: Game Mechanics & Domain Knowledge
description: TTRPG game mechanics, character model, combat system, and domain-specific terminology for the Eventuellit system.
---

# Game Mechanics & Domain Knowledge

## Overview

Eventuellit-antologia is a TTRPG system for episodic 2-3-shot adventures in a "liquid space" solar system. Movement is affected by currents and friction instead of vacuum logic. The narrative focuses on rebellion against tyranny, scarcity, and high-stakes decision making.

- **Genre:** Retro-Space Opera (50% analog/retro, 35% hard sci-fi, 15% fantastic), Action Drama, Surrealist, Existential
- **System Base:** Modified versions of Jukka Sorsa's "Hood" and Ville Takanen's "FREE/FALL"
- **Language:** All game terms in Finnish

## Core Resolution: Noppakoura (5n20)

- Baseline action capacity: **5n20** per situation/round
- Players split dice across multiple tasks or concentrate into one
- Actions resolve through GM-defined **Axes** (e.g., speed + stealth)
- All required axes resolved simultaneously
- Axis result = highest die on that axis (k1 behavior)
- Baseline success threshold: **13**

### Difficulty Thresholds

| Difficulty | Threshold | Condition |
|---|---|---|
| Easy | 9 | Exceptionally favorable |
| Standard | 13 | Default |
| Hard | 17 | Extreme conditions |

Opposed checks (especially conflicts) should prefer opposition-based resolution over blanket threshold inflation.

### Critical Success (Doubles)

If an axis succeeds and at least two dice show the same face value → critical success with meaningful advantage.

## Character Model

### Core Attributes

Three categories, each with two attributes:

| Category | Attribute 1 | Attribute 2 |
|---|---|---|
| **Keho** | Fysiikka | Nopeus |
| **Mieli** | Ymmärrys | Persoona |
| **Terä** | Näkemys | Näppäryys |

- Characters select two strong attributes → **+n4** each
- When applicable, roll attribute die and add to axis result

### Kesto (Endurance)

- Category Kesto starts at **8** for Keho, Mieli, and Terä
- Each +n4 in an attribute raises parent category Kesto by **+2**

### Skills & Equipment

- **Skills** = narrative permission gates for specialized actions
- **Equipment** = narrative/mechanical enabler (unlocks attempts, adds axes, defines damage die)
- Missing skill/equipment: attempt by paying **1 Kesto** from relevant category
- Positive fictional positioning may waive Kesto payment

## Cooperation

### Assist
One character assists another's axis roll → on success, acting character gains **+1n20** next roll.

### Group Action
Participants pool dice into shared axes. GM evaluates result quality against group size and scene demands.

### Environment Effects
- **Positive:** Can waive Kesto access costs
- **Negative:** Can add mandatory axes and/or raise thresholds

## Combat Flow: Ajastin 20-0

### Round Structure
1. **Declaration:** GM telegraphs normal opponent intent → players declare and allocate → GM telegraphs special-opponent intent
2. **Initiative:** Dice on Aloite axis define tempo (either `5 × dice committed` or highest die)
3. **Movement:** Own axis; one die = one zone shift
4. **Resolution:** Actions resolve in Ajastin order

## Damage System

### Sisu First
Incoming damage interacts with **Sisu** first. Damage removes Sisu dice whose face value ≤ damage magnitude.

### Uhkanopat
If attack doesn't remove Sisu → creates/accumulates **Uhkanopat** (amplifies subsequent hits).

### Kesto & Harmi
- Sisu depleted → damage converts to Kesto loss (1:1) or **Harmi**
- No Sisu → apply impact from highest relevant damage/threat die
- Each Harmi is a **named tag** (free-text label written by the player, e.g., "Palovamma", "Shokki")
- **Active** (unhealed) Harmi tags reduce the action pool by **-1n20** each
- **Healed** Harmi tags no longer reduce the pool but persist and count toward the removal threshold
- At **5 total Harmi** (active + healed) → character removed from play

## Recovery & Advancement

### Recovery
Between episodes: Sisu and Kesto recover. Harmi tags can be healed through downtime/maintenance procedures between episodes. Healed tags remain on the character but stop affecting the dice pool.

### Advancement
End of episode:
- Add one **n4** to an attribute
- Two equal dice combine → next tier: `n4 → n6 → n8 → n10 → n12`
- Choose reward: new skill + **+1n6 Sisu** OR **+1n8 Sisu**

## Technical Implementation Requirements

- Dynamic rules context for episode/scene-specific axis definitions and thresholds
- Dice state engine tracking: n20 pool allocation, per-axis outcomes, doubles detection, Sisu changes, Uhkanopat accumulation, Harmi pool reduction, Ajastin sequencing
- Character model derivations must be deterministic and test-covered
- Assist/group flow UX must support +1n20 grants and pooled group-axis resolution
- Environment-aware checks with positive/negative modifiers
