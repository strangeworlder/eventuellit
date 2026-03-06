import type { Meta, StoryObj } from "@storybook/react";
import { StatBlock } from "./StatBlock";

const meta = {
  title: "Components/StatBlock",
  component: StatBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["secondary", "accent"],
    },
    theme: {
      control: "select",
      options: [
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
    },
    value: { control: "number" },
    maxValue: { control: "number" },
  },
} satisfies Meta<typeof StatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Health",
    value: 10,
    maxValue: 20,
    icon: "zap",
  },
};

export const LargeNumbers: Story = {
  args: {
    label: "Credits",
    value: 15420,
    icon: "sparkles",
  },
};

export const WithoutMax: Story = {
  args: {
    label: "Level",
    value: 5,
    icon: "dice5",
  },
};

export const Accent: Story = {
  args: {
    label: "Experience",
    value: 750,
    maxValue: 1000,
    variant: "accent",
    icon: "sparkles",
  },
};

export const ThemeShowcase: Story = {
  args: {
    label: "Theme",
    value: 0,
  },
  render: () => {
    const themes = [
      "base",
      "inverted",
      "primary-light",
      "primary-dark",
      "secondary-light",
      "secondary-dark",
      "accent-light",
      "accent-dark",
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[300px] sm:min-w-[600px] lg:min-w-[1000px]">
        {themes.map((theme) => (
          <StatBlock
            key={theme}
            theme={theme as any}
            label={theme}
            value={Math.floor(Math.random() * 50) + 10}
            maxValue={100}
            icon="zap"
          />
        ))}
      </div>
    );
  },
};
