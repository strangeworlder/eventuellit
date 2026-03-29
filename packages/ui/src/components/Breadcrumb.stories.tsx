import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Suunnittelujarjestelma/Molekyylit/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="bg-[var(--theme-bg)] text-[var(--theme-text)] p-8 min-h-24">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

/**
 * Three-level breadcrumb trail. On desktop the full path is shown.
 * On mobile (resize below 700px) it collapses to a single back-link to the direct parent.
 */
export const Default: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: "Maailma", to: "/world" },
        { label: "Kynnys", to: "/world/kynnys" },
        { label: "Seula" },
      ]}
    />
  ),
};

/**
 * Two-level breadcrumb. Does not collapse on mobile since there is only one parent level.
 */
export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb items={[{ label: "Säännöt", to: "/ruleset" }, { label: "Johdanto" }]} />
  ),
};

/**
 * Single-level breadcrumb for the current top-level page — no links, just the current location.
 */
export const SingleLevel: Story = {
  render: () => <Breadcrumb items={[{ label: "Maailma" }]} />,
};

/**
 * Breadcrumb rendered on an inverted (light) theme surface.
 */
export const InvertedTheme: Story = {
  render: () => (
    <div data-theme="inverted" className="bg-[var(--theme-bg)] p-8 rounded-sm">
      <Breadcrumb
        items={[
          { label: "Maailma", to: "/world" },
          { label: "Kynnys", to: "/world/kynnys" },
          { label: "Katedraali" },
        ]}
      />
    </div>
  ),
};
