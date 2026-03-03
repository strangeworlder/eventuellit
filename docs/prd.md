# Product Requirements Document: Eventuellit-antologia

## Overview
"Eventuellit-antologia" is a TTRPG system designed for episodic 2-to-3-shot adventures set in a unique solar system filled with "liquid space" (where movement is affected by currents and friction rather than a vacuum). The overarching narrative focuses on rebellion against tyranny and the static nature of the world.
- **Genre:** Retro-Space Opera (50% analog/retro, 35% hard sci-fi, 15% fantastic), Action Drama, Surrealist, Existential.
- **System Base:** Heavily modified versions of Jukka Sorsa's "Hood" and Ville Takanen's "FREE/FALL".
- **Localization Requirement:** The end-user language for the entire application (UI, forms, character sheets) MUST be **Finnish**. Code and backend variable names will remain in English, but all textual output must use the official Finnish terminology.

## 1. Core Game Mechanics (The n20 System)
### Dice Pool & Resolution
- **Base Resolution:** Roll a pool of n20s (default is 5n20 available for a standard action). The goal is to get a high number.
- **Axes defined by GM:** Actions are governed by "Axes" (e.g., "fast" and "quiet").
- **Splitting the Pool:** The player must allocate their 5n20s across the given axes (e.g., 4n20 to "fast", 1n20 to "quiet").
- **Result:** The highest rolling die on a specific axis becomes the result for that axis.
- **Attribute Modifiers:** If a base attribute applies to an axis, the player rolls the attribute die (e.g., 1n4, 1n6) and adds the result directly to the highest n20 on that axis.

### Skills & Justification
- Skills act as narrative *permission* to attempt an action.
- If a character lacks a skill, they can justify the action using specific equipment.
- **Pushing through without skill/equipment:** A character can spend 1 point of the relevant "Duration/Capacity" (Kesto), or 2 points of an unrelated "Duration/Capacity", to attempt the action anyway.

## 2. Character Generation

### Step 1: Character Archetype
The player chooses one of two classes:
1.  **Soldier (Sotilas):**
    - Receives 2 Skills.
    - Sisu (Grit) Pool: 3n8.
2.  **Expert (Ekspertti):**
    - Receives 3 Skills.
    - Sisu (Grit) Pool: 3n6.

### Step 2: Core Attributes & Durations (Kestot)
There are 3 main categories, each containing 2 specific attributes. All characters start with a base score of `8` in the 3 Categories.

*   **Keho (Body) - Base 8:**
    *   Fysiikka (Physique)
    *   Nopeus (Speed)
*   **Mieli (Mind) - Base 8:**
    *   Ymmärrys (Understanding)
    *   Persoona (Personality)
*   **Terä (Edge) - Base 8:**
    *   Näkemys (Vision/Insight)
    *   Näppäryys (Dexterity/Sleight)

**Assigning Attribute Dice:**
- The player receives two `+1d4` dice.
- They assign these two dice to any of the 6 attributes.
- **Duration (Kesto) Calculation:** For every `+d4` an attribute receives, its parent Category's base score increases by `+2`. *(Example: A player puts +1d4 in Fysiikka and +1d4 in Nopeus. Their Keho (Body) category becomes 12).*

### Step 3: Skills selection
- The player selects skills from an "Episode-Specific List" (Jaksokohtainen lista) equal to their allowed amount (2 for Soldier, 3 for Expert). These skills explain why they are the protagonist of this specific mission.

## 3. Damage, Sisu (Grit), and Health
- **Sisu (Grit):** Represents close calls and battle fatigue. Damage first reduces Sisu dice.
- **Duration/Capacity Loss:** When Sisu runs out, the character loses points from their Kesto (Durations).
- **Vaurio (Wounds/Direct Damage):** If damage bypasses Kesto, the character takes Vaurio.
    - Each point of Vaurio *permanently reduces* the amount of n20s available in their dice pool for actions.
    - At 5 Vaurio, the character is taken out of action.
- *Recovery:* Sisu, Durations, and Vaurio generally heal entirely at the end of an episode (jakso).

## 4. Character Progression (Returning Characters)
Because this is an anthology, characters that survive can return in later episodes. When they do, they level up:
1.  **Attribute Increase:** Add one `+1d4` to any attribute.
    - *Stacking Rule:* If an attribute already has two dice of the same size (e.g., two `d4`s), they combine into one die of the next size up (e.g., `n4 -> n6 -> n8 -> n10 -> n12`).
    - *Duration Recalculation:* Higher tier dice grant half their maximum value to the parent Category's Kesto. *(Example: Removing two `n4`s (+4 total) to get one `n6` (+3 total) will temporarily drop that Kesto score by 1).*
2.  **Skill Increase:** Receive 1 new Episode-specific Skill.
3.  **Progression Choice:** Choose one of the following:
    - Take 1 more extra Skill AND add +1n6 to the Sisu Pool.
    - Add +1n8 to the Sisu Pool.

## Technical Architecture Requirements
- **Dynamic Rules Context:** The generator and character sheet must support "Episode-Specific" skill injection, as lists change per episode.
- **Dice State Management:** The frontend needs to track the current pool size of n20s (which decreases with Vaurio), the state of Sisu dice, and complex derived math for "Kesto" calculation when dice upgrade into larger tiers during progression.
