import type { Meta, StoryObj } from "@storybook/react";
import { DicePoolTracker } from "./DicePoolTracker";
import { useState } from "react";

/**
 * `DicePoolTracker` renders a pool of dice visually using `DiceIcon`.
 * Each die can be toggled between active and removed (spent) states.
 * Dice are grouped by face type and sorted in ascending order.
 *
 * Designed for tracking Sisu pools but generic enough for any dice-pool mechanic.
 */
const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/DicePoolTracker",
  component: DicePoolTracker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    readOnly: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof DicePoolTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helpers ──

const makeDice = (count: number, faces: 4 | 6 | 8 | 10 | 12 | 20, prefix = "") =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}d${faces}-${i}`,
    faces,
  }));

// ── Stories ──

/**
 * Oletuspooli 3×d6, interaktiivinen — klikkaa noppia vaihtaaksesi tilaa.
 */
export const Oletuspooli: Story = {
  args: {
    dice: makeDice(3, 6),
    label: "Sisu",
  },
  render: (args) => {
    const [removed, setRemoved] = useState<string[]>([]);
    return (
      <DicePoolTracker
        {...args}
        removedIds={removed}
        onDieToggle={(id) =>
          setRemoved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
      />
    );
  },
};

/**
 * Sekoitettu pooli: 3×d6 + 1×d8 + 1×d12 — näyttää ryhmittelyn eri noppatyypeillä.
 */
export const SekoitettuPooli: Story = {
  args: {
    dice: [...makeDice(3, 6, "a"), ...makeDice(1, 8, "b"), ...makeDice(1, 12, "c")],
    label: "Sisu",
  },
  render: (args) => {
    const [removed, setRemoved] = useState<string[]>([]);
    return (
      <DicePoolTracker
        {...args}
        removedIds={removed}
        onDieToggle={(id) =>
          setRemoved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
      />
    );
  },
};

/**
 * Vain luku -tila, osa nopista poistettu.
 */
export const VainLuku: Story = {
  args: {
    dice: makeDice(3, 8),
    removedIds: ["d8-1"],
    label: "Sisu",
    readOnly: true,
  },
};

/**
 * Kaikki nopat käytetty — näyttää tyhjän tilan viestin.
 */
export const TyhjaPooli: Story = {
  args: {
    dice: makeDice(3, 6),
    removedIds: ["d6-0", "d6-1", "d6-2"],
    label: "Sisu",
    readOnly: true,
  },
};
