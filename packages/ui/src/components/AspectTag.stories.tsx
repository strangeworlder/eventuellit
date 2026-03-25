import type { Meta, StoryObj } from "@storybook/react";
import { AspectTag } from "./AspectTag";

const meta: Meta<typeof AspectTag> = {
  title: "Suunnittelujarjestelma/Atomit/AspectTag",
  component: AspectTag,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof AspectTag>;

export const AktiivinenHarmi: Story = {
  args: {
    text: "Palovamma",
    variant: "harm",
    healed: false,
  },
};

export const ParannettuHarmi: Story = {
  args: {
    text: "Murtuma",
    variant: "harm",
    healed: true,
  },
};

export const Taito: Story = {
  args: {
    text: "Hakkerointi",
    variant: "skill",
  },
};

export const OmaTaito: Story = {
  args: {
    text: "Navigointi",
    variant: "skill",
    isCustom: true,
  },
};

export const MuokattavaHarmi: Story = {
  args: {
    text: "Shokki",
    variant: "harm",
    healed: false,
    onRemove: () => {},
    onToggleHeal: () => {},
  },
};

export const MuokattavaParannettu: Story = {
  args: {
    text: "Palovamma",
    variant: "harm",
    healed: true,
    onRemove: () => {},
    onToggleHeal: () => {},
  },
};

export const PoistettavaTaito: Story = {
  args: {
    text: "Lääketiede",
    variant: "skill",
    onRemove: () => {},
  },
};

export const HarmiLista: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <AspectTag text="Palovamma" variant="harm" onRemove={() => {}} onToggleHeal={() => {}} />
      <AspectTag text="Murtuma" variant="harm" healed onRemove={() => {}} onToggleHeal={() => {}} />
      <AspectTag text="Shokki" variant="harm" onRemove={() => {}} onToggleHeal={() => {}} />
      <AspectTag text="Haava" variant="harm" healed onRemove={() => {}} onToggleHeal={() => {}} />
    </div>
  ),
};

export const TaitoLista: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <AspectTag text="Hakkerointi" variant="skill" />
      <AspectTag text="Lääketiede" variant="skill" />
      <AspectTag text="Navigointi" variant="skill" isCustom />
    </div>
  ),
};

/** All variants side-by-side for visual comparison */
export const KaikkiVariantit: Story = {
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2 font-heading">
          Harmit (aktiivinen)
        </p>
        <div className="flex flex-wrap gap-2">
          <AspectTag text="Palovamma" variant="harm" onRemove={() => {}} onToggleHeal={() => {}} />
          <AspectTag text="Shokki" variant="harm" />
          <AspectTag text="Murtuma" variant="harm" onRemove={() => {}} onToggleHeal={() => {}} />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2 font-heading">
          Harmit (parannettu)
        </p>
        <div className="flex flex-wrap gap-2">
          <AspectTag text="Haava" variant="harm" healed onRemove={() => {}} onToggleHeal={() => {}} />
          <AspectTag text="Nyrjähdys" variant="harm" healed />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2 font-heading">
          Taidot
        </p>
        <div className="flex flex-wrap gap-2">
          <AspectTag text="Hakkerointi" variant="skill" />
          <AspectTag text="Lääketiede" variant="skill" onRemove={() => {}} />
          <AspectTag text="Navigointi" variant="skill" isCustom />
        </div>
      </div>
    </div>
  ),
};
