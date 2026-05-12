import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Icon, type IconProps, icons, lucideIcons } from "./Icon";
import { customIconNames } from "../generated/custom-icon-names";
import "../styles.css";

const allIconNames = Object.keys(icons) as Array<keyof typeof icons>;
const lucideIconNameList = Object.keys(lucideIcons) as Array<keyof typeof lucideIcons>;

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Yhtenäinen kuvakekomponentti, joka yhdistää Lucide React -kirjaston ja temaattiset " +
          "kustomoidut SVG-sprite-kuvakkeet saman API:n taakse. Käytä aina `<Icon>` suoraan " +
          "— älä tuo Lucide- tai CustomIcon-komponentteja erikseen.",
      },
    },
  },
  args: {
    name: "sparkles",
    size: 24,
    variant: "default",
  },
  argTypes: {
    name: {
      control: "select",
      options: allIconNames,
      description: "Kuvakkeen nimi — Lucide-nimi tai kustomoidun SVG-spriten nimi.",
    },
    size: {
      control: { type: "range", min: 12, max: 64, step: 2 },
      description: "Kuvakkeen koko pikseleinä. Branded-variantti ohittaa tämän.",
    },
    variant: {
      control: "select",
      options: ["default", "branded"],
      description:
        "Visuaalinen tyyli. `branded` renderöi kuvakkeen ympyränmuotoisessa kehyksessä hehkuefektillä.",
    },
  },
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Peruskäyttö ────────────────────────────────────────────────────────────

/** Oletuskuvake ilman varianttia — pelkkä SVG-elementti. */
export const Esikatselu: Story = {};

// ── Branded-variantti ──────────────────────────────────────────────────────

/** Branded-variantti: suuri pyöreä kehys hehkuefektillä, käytössä apusivuilla. */
export const Koristeltu: Story = {
  args: {
    name: "log-in",
    variant: "branded",
  },
};

/** Branded-variantti kustomoidulla SVG-kuvakkeella. */
export const KoristeltuKustomoitu: Story = {
  args: {
    name: "world",
    variant: "branded",
  },
};

// ── Kokovalikoima ──────────────────────────────────────────────────────────

/** Vertailu eri kuvakekokojen välillä. */
export const Kokovalikoima: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {[14, 18, 24, 32, 48].map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Icon name="sparkles" size={s} />
          <span className="text-xs opacity-60">{s}px</span>
        </div>
      ))}
    </div>
  ),
};

// ── Kustomoidut kuvakkeet ──────────────────────────────────────────────────

/** Kaikki kustomoidut SVG-sprite-kuvakkeet. */
export const KustomoidutKuvakkeet: Story = {
  render: () => (
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">
      {customIconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-primary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
        >
          <Icon name={name} size={22} />
          <span className="text-xs opacity-80 font-mono">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Lucide-kuvakkeet ───────────────────────────────────────────────────────

/** Kaikki Lucide React -kuvakkeet. */
export const LucideKuvakkeet: Story = {
  render: () => (
    <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">
      {lucideIconNameList.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-secondary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
        >
          <Icon name={name} size={22} />
          <span className="text-xs opacity-80 font-mono">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// ── Kaikki kuvakkeet ───────────────────────────────────────────────────────

/** Täydellinen kuvakekartta — kustomoidut ja Lucide yhdessä. */
export const KaikkiKuvakkeet: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-heading font-bold uppercase tracking-widest mb-3 opacity-60">
          Kustomoidut ({customIconNames.length})
        </h3>
        <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">
          {customIconNames.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-primary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
            >
              <Icon name={name} size={22} />
              <span className="text-xs opacity-80 font-mono">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-heading font-bold uppercase tracking-widest mb-3 opacity-60">
          Lucide ({lucideIconNameList.length})
        </h3>
        <div className="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-4">
          {lucideIconNameList.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-2 rounded-lg border border-[var(--theme-secondary)]/25 p-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
            >
              <Icon name={name} size={22} />
              <span className="text-xs opacity-80 font-mono">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── Branded-vertailu ───────────────────────────────────────────────────────

/** Branded-variantti eri kuvakkeilla rinnakkain. */
export const BrandedVertailu: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Icon name="log-in" variant="branded" />
      <Icon name="world" variant="branded" />
      <Icon name="sparkles" variant="branded" />
      <Icon name="shield" variant="branded" />
      <Icon name="player-character" variant="branded" />
    </div>
  ),
};
