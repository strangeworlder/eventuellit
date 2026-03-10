import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { ArticleProgressNavigator } from "./ArticleProgressNavigator";

const sampleSections = [
  { id: "pelimekaniikka", label: "1. Pelimekaniikka" },
  { id: "hahmo", label: "2. Hahmo ja ominaisuudet" },
  { id: "konfliktit", label: "3. Konfliktit ja taistelu" },
  { id: "vaurio", label: "4. Vaurio ja selviytyminen" },
  { id: "kehitys", label: "5. Kehitys ja toipuminen" },
];

const meta: Meta<typeof ArticleProgressNavigator> = {
  title: "Suunnittelujarjestelma/Komponentit/ArticleProgressNavigator",
  component: ArticleProgressNavigator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticleProgressNavigator>;

export const Interactive: Story = {
  render: (args) => {
    const [activeSectionId, setActiveSectionId] = useState(
      args.activeSectionId ?? sampleSections[0]?.id,
    );

    return (
      <div className="max-w-4xl space-y-4 bg-[var(--theme-bg)] text-[var(--theme-text)]">
        <ArticleProgressNavigator
          {...args}
          activeSectionId={activeSectionId}
          onSelectSection={(sectionId) => {
            setActiveSectionId(sectionId);
          }}
        />
        <p className="text-sm opacity-80">
          Klikkaa merkkeja palkissa: aktiivinen osio vaihtuu ja simuloi sticky-tilassa
          artikkelissa liikkumista.
        </p>
      </div>
    );
  },
  args: {
    sections: sampleSections,
    progress: 42,
    activeSectionId: sampleSections[1]?.id,
    markerPositions: {
      pelimekaniikka: 6,
      hahmo: 24,
      konfliktit: 45,
      vaurio: 62,
      kehitys: 78,
    },
  },
};

export const StickyUnderHeading: Story = {
  args: {
    sections: sampleSections,
    progress: 8,
    activeSectionId: sampleSections[0]?.id,
  },
};

export const MinimalHoverLabels: Story = {
  args: {
    sections: sampleSections,
    progress: 52,
    activeSectionId: sampleSections[2]?.id,
    variant: "minimal",
  },
};

export const WithoutSections: Story = {
  args: {
    sections: [],
    progress: 55,
  },
};
