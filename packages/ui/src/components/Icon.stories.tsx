import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Icon, type IconProps, icons } from "./Icon";
import "../styles.css";

const iconNames = Object.keys(icons) as Array<keyof typeof icons>;

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "sparkles",
    size: 24,
  },
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
    variant: {
      control: "select",
      options: ["default", "branded"],
    },
  },
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Esikatselu: Story = {};

export const Koristeltu: Story = {
  args: {
    name: "log-in",
    variant: "branded",
  },
};

export const KaikkiKuvakkeet: Story = {
  render: () => (
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-primary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
        >
          <Icon name={name} size={22} />
          <span className="text-xs opacity-80">{name}</span>
        </div>
      ))}
    </div>
  ),
};
