import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ActiveStatBlock } from "./ActiveStatBlock";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/ActiveStatBlock",
  component: ActiveStatBlock,
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
    minAllowed: { control: "number" },
    maxAllowed: { control: "number" },
  },
} satisfies Meta<typeof ActiveStatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for Storybook
const InteractiveStatBlock = (props: any) => {
  const [value, setValue] = useState(props.value || 0);

  return (
    <ActiveStatBlock
      {...props}
      value={value}
      onIncrement={() => setValue(value + 1)}
      onDecrement={() => setValue(value - 1)}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveStatBlock {...args} />,
  args: {
    label: "Terveys",
    value: 10,
    maxValue: 20,
    icon: "zap",
  },
};

export const NoMaxValue: Story = {
  render: (args) => <InteractiveStatBlock {...args} />,
  args: {
    label: "Panssari",
    value: 5,
    icon: "book",
  },
};

export const WithoutIcon: Story = {
  render: (args) => <InteractiveStatBlock {...args} />,
  args: {
    label: "Kestävyys",
    value: 100,
    maxValue: 100,
  },
};

export const Accent: Story = {
  render: (args) => <InteractiveStatBlock {...args} />,
  args: {
    label: "Taikapisteet",
    value: 15,
    maxValue: 50,
    variant: "accent",
    icon: "sparkles",
  },
};

export const Primary: Story = {
  render: (args) => <InteractiveStatBlock {...args} />,
  args: {
    label: "Kesto",
    value: 8,
    maxValue: 12,
    variant: "primary",
    icon: "shield",
  },
};

export const ThemeShowcase: Story = {
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
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <InteractiveStatBlock
            key={theme}
            theme={theme as any}
            label={theme}
            value={10}
            maxValue={20}
            icon="sparkles"
          />
        ))}
      </div>
    );
  },
  args: {
    label: "Teema",
    value: 10,
  },
};
