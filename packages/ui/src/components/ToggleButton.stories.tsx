import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { ToggleButton } from "./ToggleButton";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/ToggleButton",
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pressed: {
      control: "boolean",
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
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aktiivinen: Story = {
  args: {
    pressed: true,
    children: "+1n6",
  },
};

export const Passiivinen: Story = {
  args: {
    pressed: false,
    children: "+1n6",
  },
};

/** Interactive controlled example — click to toggle */
export const Interaktiivinen: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(args.pressed);
    return (
      <ToggleButton {...args} pressed={pressed} onClick={() => setPressed((p) => !p)}>
        +1n6
      </ToggleButton>
    );
  },
  args: {
    pressed: false,
  },
};

/** Side-by-side comparison across themes */
export const Teemat: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      {(
        [
          "base",
          "inverted",
          "primary-light",
          "primary-dark",
          "secondary-light",
          "secondary-dark",
          "accent-light",
          "accent-dark",
        ] as const
      ).map((t) => (
        <div key={t} className="flex items-center gap-4 p-3 rounded-sm" data-theme={t}>
          <span className="text-xs text-[var(--theme-text)]/60 w-32 font-mono">{t}</span>
          <ToggleButton pressed={false} theme={t}>
            +1n8
          </ToggleButton>
          <ToggleButton pressed={true} theme={t}>
            +1n8
          </ToggleButton>
        </div>
      ))}
    </div>
  ),
  args: { pressed: false },
};
