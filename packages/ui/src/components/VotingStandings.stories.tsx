import type { Meta, StoryObj } from "@storybook/react";
import "../styles.css";
import { VotingStandings } from "./VotingStandings";

const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/VotingStandings",
  component: VotingStandings,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VotingStandings>;

export default meta;
type Story = StoryObj<typeof meta>;

const kolmeVaihtoehtoa = [
  { id: 1, title: "Infiltraatio asemalle Kepler-7" },
  { id: 2, title: "Pelastusoperaatio Sigmalta" },
  { id: 3, title: "Sabotaasi hyökkäyslaivaan" },
];

const viisiVaihtoehtoa = [
  { id: 1, title: "Infiltraatio asemalle Kepler-7" },
  { id: 2, title: "Pelastusoperaatio Sigmalta" },
  { id: 3, title: "Sabotaasi hyökkäyslaivaan" },
  { id: 4, title: "Tiedustelu Vyöhykkeellä 9" },
  { id: 5, title: "Lähettilästehtävä Neuvostolle" },
];

/** Kolme vaihtoehtoa — yleisin tapaus */
export const KolmeVaihtoehtoa: Story = {
  args: {
    items: kolmeVaihtoehtoa,
  },
};

/** Viisi vaihtoehtoa — pitkä lista testaa katkaisua */
export const ViisiVaihtoehtoa: Story = {
  args: {
    items: viisiVaihtoehtoa,
  },
};

/** Yksi vaihtoehto — johtaja yksin */
export const YksiVaihtoehto: Story = {
  args: {
    items: [{ id: 1, title: "Infiltraatio asemalle Kepler-7" }],
  },
};

/** Mukautettu otsikko ja alateksti */
export const MukautettuTeksti: Story = {
  args: {
    items: kolmeVaihtoehtoa,
    label: "Äänestyksen tilanne",
    footerNote: "Äänestys sulkeutuu pian",
  },
};

/** Tyhjä lista — ei renderöidy */
export const TyhjaLista: Story = {
  args: {
    items: [],
  },
};

