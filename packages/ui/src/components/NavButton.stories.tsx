import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { NavButton } from "./NavButton";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/NavButton",
  component: NavButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof NavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "ghost-subtle",
    size: "nav",
    children: "Oma sivu",
  },
};

export const WithBadge: Story = {
  args: {
    variant: "ghost-subtle",
    size: "nav",
    showBadge: true,
    children: "Oma sivu",
  },
};

export const GhostWithBadge: Story = {
  args: {
    variant: "ghost",
    showBadge: true,
    children: "Ilmoitukset",
  },
};

export const NavSizeWithBadge: Story = {
  render: () => (
    <div className="w-64 space-y-1 p-2 bg-[var(--theme-bg)] rounded-md">
      <NavButton variant="ghost-subtle" size="nav" justify="start">
        <span className="flex items-center gap-3">
          <Icon name="rulebook" size={20} />
          <span>Sääntökirja</span>
        </span>
      </NavButton>
      <NavButton variant="ghost" size="nav" justify="start" showBadge>
        <span className="flex items-center gap-3">
          <Icon name="list-checks" size={20} />
          <span>Oma sivu</span>
        </span>
      </NavButton>
      <NavButton variant="ghost-subtle" size="nav" justify="start">
        <span className="flex items-center gap-3">
          <Icon name="file-cabinet" size={20} />
          <span>Jaksot</span>
        </span>
      </NavButton>
    </div>
  ),
};
