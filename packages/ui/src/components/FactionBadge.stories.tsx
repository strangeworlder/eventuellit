import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { FactionBadge } from "./FactionBadge";
import { Stack } from "./Layout";

const meta: Meta<typeof FactionBadge> = {
  title: "Suunnittelujarjestelma/Molekyylit/FactionBadge",
  component: FactionBadge,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "accent"],
    },
    variant: {
      control: "select",
      options: ["inline", "card"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FactionBadge>;

export const TuhkanPuolue: Story = {
  args: {
    factionName: "Tuhkan puolue",
    color: "primary",
    variant: "inline",
  },
};

export const KwKonsortio: Story = {
  args: {
    factionName: "KW-konsortio",
    color: "secondary",
    variant: "inline",
  },
};

export const Ekklesia: Story = {
  args: {
    factionName: "Ekklesia",
    color: "accent",
    variant: "inline",
  },
};

export const Subfaction: Story = {
  args: {
    factionName: "Ratasvartio",
    parentFactionName: "KW-konsortio",
    color: "secondary",
    variant: "inline",
  },
};

export const DisruptingFaction: Story = {
  args: {
    factionName: "Pyhän Tragedian lapset",
    color: "accent",
    variant: "inline",
    disrupting: true,
  },
};

/** Hybrid faction — diagonal split dot, dual heritage */
export const HybridFaction: Story = {
  args: {
    factionName: "Kokemuspuolue",
    parentFactionName: "Tuhkan puolue × Ekklesia",
    color: "primary",
    secondaryColor: "accent",
    variant: "inline",
  },
};

/** Hybrid faction card variant — gradient left border */
export const HybridCardVariant: Story = {
  args: {
    factionName: "Kokemuspuolue",
    color: "primary",
    secondaryColor: "accent",
    iconName: "heart-pulse",
    variant: "card",
    href: "/world/faktiot/kokemuspuolue",
  },
};

export const CardVariant: Story = {
  args: {
    factionName: "Tuhkan puolue",
    color: "primary",
    variant: "card",
    href: "/world/faktiot/tuhkan-puolue",
  },
};

export const CardVariantSubfaction: Story = {
  args: {
    factionName: "Ratasvartio",
    parentFactionName: "KW-konsortio",
    color: "secondary",
    variant: "card",
    href: "/world/faktiot/ratasvartio",
    disrupting: true,
  },
};

export const AllThree: Story = {
  render: () => (
    <Stack direction="column" gap={4} className="p-4">
      <Stack gap={2}>
        <FactionBadge factionName="Tuhkan puolue" color="primary" />
        <FactionBadge factionName="KW-konsortio" color="secondary" />
        <FactionBadge factionName="Ekklesia" color="accent" />
      </Stack>
      <Stack gap={2}>
        <FactionBadge
          factionName="Muotinvalajat"
          parentFactionName="Tuhkan puolue"
          color="primary"
        />
        <FactionBadge
          factionName="Ratasvartio"
          parentFactionName="KW-konsortio"
          color="secondary"
        />
        <FactionBadge factionName="Verhonkutojat" parentFactionName="Ekklesia" color="accent" />
      </Stack>
      {/* Hybrid faction */}
      <Stack gap={2}>
        <FactionBadge
          factionName="Kokemuspuolue"
          parentFactionName="Tuhkan puolue × Ekklesia"
          color="primary"
          secondaryColor="accent"
        />
      </Stack>
      <Stack direction="column" gap={2} className="max-w-xs">
        <FactionBadge
          factionName="Tuhkan puolue"
          color="primary"
          variant="card"
          href="/world/faktiot/tuhkan-puolue"
        />
        <FactionBadge
          factionName="Ratasvartio"
          parentFactionName="KW-konsortio"
          color="secondary"
          variant="card"
          disrupting
          href="/world/faktiot/ratasvartio"
        />
        <FactionBadge
          factionName="Kokemuspuolue"
          color="primary"
          secondaryColor="accent"
          iconName="heart-pulse"
          variant="card"
          href="/world/faktiot/kokemuspuolue"
        />
      </Stack>
    </Stack>
  ),
};
