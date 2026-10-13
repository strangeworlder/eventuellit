import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type AnchorCardData, getAnchorById } from "../data/anchors";
import { AnchorCard } from "./AnchorCard";

const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/AnchorCard",
  component: AnchorCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AnchorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const fallbackCard: AnchorCardData = {
  id: "atu-0",
  name: "Kuilu",
  internalRef: "Atu 0: The Fool",
  arcana: "major",
  description:
    "Painoton huimaus ja äänetön keveys. Tyhjyys lakkaa olemasta pudotus silloin, kun jalat unohtavat kiinteän aineen.",
  polarityA: {
    title: "Syöksy",
    description: "Putoaminen ilman pohjaa.",
  },
  polarityB: {
    title: "Pysähdys",
    description: "Liikkumattomuus romahduksen keskellä.",
  },
};

const kuilu: AnchorCardData = getAnchorById("atu-0") ?? fallbackCard;
const kipina: AnchorCardData = getAnchorById("wands-ace") ?? fallbackCard;
const sopu: AnchorCardData = getAnchorById("cups-2") ?? fallbackCard;
const kipu: AnchorCardData = getAnchorById("swords-3") ?? fallbackCard;
const malmi: AnchorCardData = getAnchorById("disks-ace") ?? fallbackCard;
const seppa: AnchorCardData = getAnchorById("disks-king") ?? fallbackCard;

/** Oletuskortti (Iso Arkana: Kuilu) */
export const Oletus: Story = {
  name: "Iso Arkana: Kuilu",
  args: {
    anchor: kuilu,
  },
};

/** Valittu tila korostusreunuksella */
export const Valittu: Story = {
  name: "Valittu ankkuri",
  args: {
    anchor: kuilu,
    selected: true,
  },
};

/** Sauvat: Kipinä (Tuli / Kineettisyys) */
export const SauvatKipina: Story = {
  name: "Sauvat: Kipinä",
  args: {
    anchor: kipina,
  },
};

/** Maljat: Sopu (Vesi / Intuitio) */
export const MaljatSopu: Story = {
  name: "Maljat: Sopu",
  args: {
    anchor: sopu,
  },
};

/** Miekat: Kipu (Ilma / Konflikti) */
export const MiekatKipu: Story = {
  name: "Miekat: Kipu",
  args: {
    anchor: kipu,
  },
};

/** Kiekot: Malmi (Maa / Materia) */
export const KiekotMalmi: Story = {
  name: "Kiekot: Malmi",
  args: {
    anchor: malmi,
  },
};

/** Kiekot: Seppä (Hovikortti) */
export const KiekotSeppa: Story = {
  name: "Kiekot: Seppä (Kuningas)",
  args: {
    anchor: seppa,
  },
};

/** Inverted-teema (hahmolomakkeen ja -generaattorin tumma tausta) */
export const InvertedTeema: Story = {
  name: "Inverted-teemassa",
  args: {
    anchor: kuilu,
    theme: "inverted",
    selected: true,
  },
  render: (args) => (
    <div
      data-theme="inverted"
      className="p-6 rounded-md bg-[var(--theme-bg)] text-[var(--theme-text)] max-w-2xl"
    >
      <AnchorCard {...args} />
    </div>
  ),
};

/** Kompakti esitystapa ilman taustatarinaa */
export const Kompakti: Story = {
  name: "Kompakti tila",
  args: {
    anchor: kipu,
    compact: true,
  },
};

/** Interaktiivinen valintaryhmä todellisilla ankkureilla */
export const ValittavaVuorovaikutus: Story = {
  name: "Interaktiivinen valinta",
  args: {
    anchor: kuilu,
  },
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>("atu-0");
    const options = [kuilu, kipina, sopu, kipu, malmi];

    return (
      <div className="space-y-4 max-w-2xl">
        <p className="text-sm text-text-muted">Klikkaa ankkuria valitaksesi sen:</p>
        <div className="space-y-3">
          {options.map((anchor) => (
            <AnchorCard
              key={anchor.id}
              anchor={anchor}
              selected={selectedId === anchor.id}
              onSelect={() => setSelectedId(anchor.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

/** Obscured-tila (sisältö sumennettu ja lukittu ennen paljastusta) */
export const Obscured: Story = {
  name: "Obscured (sumennettu)",
  args: {
    anchor: kuilu,
    obscured: true,
  },
};
