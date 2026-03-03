import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatBlock } from "./StatBlock";

const meta = {
  title: "TTRPG/StatBlock",
  component: StatBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Heart Icon Mock
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const Health: Story = {
  args: {
    label: "Kesto",
    value: 4,
    maxValue: 5,
    icon: <HeartIcon />,
  },
};

export const AbilityScore: Story = {
  args: {
    label: "Sisu",
    value: 12,
  },
};
