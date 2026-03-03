import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiceRoller } from "./DiceRoller";

const meta = {
  title: "TTRPG/DiceRoller",
  component: DiceRoller,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onRoll: { action: "noppatulos" },
  },
} satisfies Meta<typeof DiceRoller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultAction: Story = {
  args: {
    label: "Toimintotesti",
    count: 2,
    diceType: "n10",
  },
};

export const HighStakes: Story = {
  args: {
    label: "Epätoivoinen yritys",
    count: 1,
    diceType: "n20",
  },
};
