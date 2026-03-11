import type { Meta, StoryObj } from "@storybook/react";
import { StatBlock } from "./StatBlock";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/StatBlock",
  component: StatBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent"],
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
    label: "Terveys",
    value: 10,
    maxValue: 20,
    icon: "zap",
  },
};

export const LargeNumbers: Story = {
  args: {
    label: "Krediitit",
    value: 15420,
    icon: "sparkles",
  },
};

export const WithoutMax: Story = {
  args: {
    label: "Taso",
    value: 5,
    icon: "dice5",
  },
};

export const Accent: Story = {
  args: {
    label: "Kokemus",
    value: 750,
    maxValue: 1000,
    variant: "accent",
    icon: "sparkles",
  },
};

export const Primary: Story = {
  args: {
    label: "Sisu",
    value: 3,
    maxValue: 6,
    variant: "primary",
    icon: "shield",
  },
};

export const ThemeShowcase: Story = {
  args: {
    label: "Teema",
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
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4 min-w-[300px] mobile:min-w-[600px] desktop:min-w-[1000px]">
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
