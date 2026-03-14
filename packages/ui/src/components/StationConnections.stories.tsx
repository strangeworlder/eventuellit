import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { StationConnections } from "./StationConnections";

// Representative sample of Kynnys stations for stories
const kynnysSampleStations = [
  {
    id: "02-syke",
    title: "Syke",
    description: "Teollinen solmu — Kynnyksen moottorit käyvät täällä.",
    tension: "Matala",
  },
  {
    id: "03-verso",
    title: "Verso",
    description: "Biodomi — viimeinen luonnonvalo ja kasvava vastarinta.",
    tension: "Korkea",
  },
  {
    id: "08-pesa",
    title: "Pesä",
    description: "Siirtolaisten kauttakulku ja ahtaat asuinsolut.",
    tension: "Matala",
  },
  {
    id: "10-kuiskaus",
    title: "Kuiskaus",
    description: "Informaatioverkostojen solmukohta — kaikki kulkee tästä.",
    tension: "Murtunut",
  },
  {
    id: "04-alasin",
    title: "Alasin",
    description: "Raskas teollisuus ja välimatkan päässä olevat siirtokunnat.",
    tension: "Korkea",
  },
  {
    id: "05-louhos",
    title: "Louhos",
    description: "Kaivosasema — resurssit virtaavat ylöspäin, ihmiset alaspäin.",
    tension: "Korkea",
  },
  {
    id: "14-hakki",
    title: "Häkki",
    description: "Säilytysasema — vankilat ja pakkotyöleirit.",
    tension: "Murtunut",
  },
];

const meta: Meta<typeof StationConnections> = {
  title: "Maailma/Asemayhteydet",
  component: StationConnections,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div
          className="bg-[var(--theme-bg)] text-[var(--theme-text)] p-8 min-h-96"
          data-theme="base"
        >
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    tension: {
      control: "select",
      options: ["Matala", "Korkea", "Murtunut"],
      description: "Nykyisen aseman jännitystaso (vaikuttaa keskipisteen väriin)",
    },
    basePath: {
      control: "text",
      description: "Navigointipolun juuri (esim. '/' tai '/world')",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StationConnections>;

/** Seula — Kynnyksen keskusasema, 7 yhteyttä */
export const Solmupiste: Story = {
  args: {
    connections: "Syke, Verso, Pesä, Kuiskaus, Alasin, Louhos, Häkki",
    tension: "Matala",
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Kuiskaus — murtunut asema, vähän yhteyksiä */
export const Murtunut: Story = {
  args: {
    connections: "Verso, Siemen, Krypta",
    tension: "Murtunut",
    stations: [
      ...kynnysSampleStations,
      {
        id: "18-siemen",
        title: "Siemen",
        description: "Hylätty tutkimusasema — jokin kasvaa pimeydessä.",
        tension: "Murtunut",
      },
      {
        id: "19-krypta",
        title: "Krypta",
        description: "Hautausmaa-asema. Kukaan ei kysy, keitä täällä lepää.",
        tension: "Murtunut",
      },
    ],
    basePath: "/",
  },
};

/** Katedraali — korkea jännite, tiheä verkosto */
export const Korkea: Story = {
  args: {
    connections: "Syke, Akseli, Verkko, Pesä, Ikoni, Pöytä",
    tension: "Korkea",
    stations: [
      ...kynnysSampleStations,
      {
        id: "06-akseli",
        title: "Akseli",
        description: "Kiertoradan ylläpito — Kynnyksen orbitaalinen selkäranka.",
        tension: "Korkea",
      },
      {
        id: "15-verkko",
        title: "Verkko",
        description: "Valvontasolmu — kaikkialla läsnä, ei missään näkyvissä.",
        tension: "Korkea",
      },
      {
        id: "16-ikoni",
        title: "Ikoni",
        description: "Ekklesian pyhäkkö — pilgrimit saapuvat, harvat palaavat.",
        tension: "Korkea",
      },
      {
        id: "17-poyta",
        title: "Pöytä",
        description: "Neuvotteluasema — fraktiot kokoontuvat, sopimukset hajoavat.",
        tension: "Korkea",
      },
    ],
    basePath: "/",
  },
};

/** Yksittäinen yhteys — minimaalinen näkymä */
export const YksiYhteys: Story = {
  args: {
    connections: "Siemen",
    tension: "Murtunut",
    stations: [
      {
        id: "18-siemen",
        title: "Siemen",
        description: "Hylätty tutkimusasema — jokin kasvaa pimeydessä.",
        tension: "Murtunut",
      },
    ],
    basePath: "/",
  },
};

/** Kaikki jännitystasot näkyvissä yhtä aikaa */
export const KaikkiJannitetasot: Story = {
  render: () => (
    <MemoryRouter>
      <div className="grid grid-cols-1 gap-12 bg-[var(--theme-bg)] p-8" data-theme="base">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2">
            Matala jännite
          </p>
          <StationConnections
            connections="Syke, Pesä, Verso"
            tension="Matala"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2">
            Korkea jännite
          </p>
          <StationConnections
            connections="Alasin, Louhos, Häkki"
            tension="Korkea"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2">
            Murtunut jännite
          </p>
          <StationConnections
            connections="Kuiskaus, Häkki"
            tension="Murtunut"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
      </div>
    </MemoryRouter>
  ),
};
