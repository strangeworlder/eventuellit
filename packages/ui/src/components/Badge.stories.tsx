import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Suunnittelujarjestelma/Atomit/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "highlight", "highlight-solid", "ghost"],
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
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: "solid",
    children: "Tervetuloa seikkailuun",
    icon: "sparkles",
  },
};

export const Secondary: Story = {
  args: {
    variant: "outline",
    children: "Sääntökirja",
    icon: "rulebook",
  },
};

export const Accent: Story = {
  args: {
    variant: "highlight",
    children: "Hahmopaja",
    icon: "player-character",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Päivitys saatavilla",
  },
};

export const AccentSolid: Story = {
  args: {
    variant: "highlight-solid",
    children: "Aktiivinen",
  },
};

export const Haamu: Story = {
  args: {
    variant: "ghost",
    children: "Vierailija",
    icon: "user-circle",
  },
};

export const WithDifferentThemes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2" data-theme="base">
        <Badge {...args} theme="base">
          Perusteema
        </Badge>
        <Badge {...args} theme="inverted">
          Käänteinen teema
        </Badge>
      </div>
      <div className="flex gap-2" data-theme="primary-dark">
        <Badge {...args} theme="primary-dark">
          Tumma pääteema
        </Badge>
        <Badge {...args} theme="secondary-dark">
          Tumma sivuteema
        </Badge>
      </div>
    </div>
  ),
  args: {
    variant: "solid",
    icon: "sparkles",
  },
};
