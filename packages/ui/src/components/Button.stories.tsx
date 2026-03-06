import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/Button",
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

export const GhostSecondary: Story = {
  args: {
    variant: "ghost-secondary",
    children: "Peruuta",
  },
};

export const NavButton: Story = {
  args: {
    variant: "ghost-secondary",
    size: "nav",
    justify: "start",
    children: "Sääntökirja",
  },
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-background border border-border p-2 rounded-md">
        <Story />
      </div>
    ),
  ],
};
