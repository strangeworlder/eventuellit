import type { Meta, StoryObj } from "@storybook/react";
import { DiceIcon } from "./DiceIcon";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/DiceIcon",
  component: DiceIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    faces: {
      control: "select",
      options: [4, 6, 8, 10, 12, 20, "swirl"],
    },
    value: { control: "number" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    active: { control: "boolean" },
  },
} satisfies Meta<typeof DiceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    faces: 20,
  },
};

export const Active: Story = {
  args: {
    faces: 6,
    active: true,
  },
};

export const Sizes: Story = {
  args: { faces: 20 },
  render: () => (
    <div className="flex items-center gap-4">
      <DiceIcon faces={20} size="sm" />
      <DiceIcon faces={20} size="md" />
      <DiceIcon faces={20} size="lg" />
    </div>
  ),
};

export const Shapes: Story = {
  args: { faces: 20 },
  render: () => (
    <div className="flex items-center gap-4">
      <DiceIcon faces={4} />
      <DiceIcon faces={6} />
      <DiceIcon faces={8} />
      <DiceIcon faces={10} />
      <DiceIcon faces={12} />
      <DiceIcon faces={20} />
      <DiceIcon faces="swirl" />
    </div>
  ),
};

export const CustomValue: Story = {
  args: {
    faces: 20,
    value: 14,
    size: "lg",
    active: true,
  },
};

export const Pyorrepyora: Story = {
  args: {
    faces: "swirl",
    size: "lg",
    active: true,
  },
};

export const IlmanArvoa: Story = {
  args: { faces: 20 },
  render: () => (
    <div className="flex items-center gap-4">
      <DiceIcon faces={20} value={17} size="lg" hideValue={false} />
      <DiceIcon faces={20} value={17} size="lg" hideValue />
    </div>
  ),
};
