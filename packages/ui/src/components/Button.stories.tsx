import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Retro Action styling (Finnish labels according to PRD)
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Hyökkää",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Puolusta",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Tuhoa",
  },
};
