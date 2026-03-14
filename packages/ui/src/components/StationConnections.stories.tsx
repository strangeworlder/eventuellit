import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { StationConnections } from "./StationConnections";

// Representative sample of Kynnys stations for stories
const kynnysSampleStations = [
  {
    id: "02-syke",
    title: "Syke",
    order: 2,
    description: "Teollinen solmu — Kynnyksen moottorit käyvät täällä.",
    tension: "Matala",
  },
  {
    id: "03-verso",
    title: "Verso",
    order: 3,
    description: "Biodomi — viimeinen luonnonvalo ja kasvava vastarinta.",
    tension: "Korkea",
  },
  {
    id: "08-pesa",
    title: "Pesä",
    order: 8,
    description: "Siirtolaisten kauttakulku ja ahtaat asuinsolut.",
    tension: "Matala",
  },
  {
    id: "10-kuiskaus",
    title: "Kuiskaus",
    order: 10,
    description: "Informaatioverkostojen solmukohta — kaikki kulkee tästä.",
    tension: "Murtunut",
  },
  {
    id: "04-alasin",
    title: "Alasin",
    order: 4,
    description: "Raskas teollisuus ja välimatkan päässä olevat siirtokunnat.",
    tension: "Korkea",
  },
  {
    id: "05-louhos",
    title: "Louhos",
    order: 5,
    description: "Kaivosasema — resurssit virtaavat ylöspäin, ihmiset alaspäin.",
    tension: "Korkea",
  },
  {
    id: "14-hakki",
    title: "Häkki",
    order: 14,
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
    connections: "Syke:N, Verso:E, Pesä:NE, Kuiskaus:SE, Alasin:W, Louhos:SW, Häkki:S",
    tension: "Matala",
    currentStationOrder: 1,
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Kuiskaus — murtunut asema, vähän yhteyksiä */
export const Murtunut: Story = {
  args: {
    connections: "Verso, Siemen, Krypta",
    tension: "Murtunut",
    currentStationOrder: 10,
    stations: [
      ...kynnysSampleStations,
      {
        id: "18-siemen",
        title: "Siemen",
        order: 18,
        description: "Hylätty tutkimusasema — jokin kasvaa pimeydessä.",
        tension: "Murtunut",
      },
      {
        id: "19-krypta",
        title: "Krypta",
        order: 19,
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
    currentStationOrder: 7,
    stations: [
      ...kynnysSampleStations,
      {
        id: "06-akseli",
        title: "Akseli",
        order: 6,
        description: "Kiertoradan ylläpito — Kynnyksen orbitaalinen selkäranka.",
        tension: "Korkea",
      },
      {
        id: "15-verkko",
        title: "Verkko",
        order: 15,
        description: "Valvontasolmu — kaikkialla läsnä, ei missään näkyvissä.",
        tension: "Korkea",
      },
      {
        id: "16-ikoni",
        title: "Ikoni",
        order: 16,
        description: "Ekklesian pyhäkkö — pilgrimit saapuvat, harvat palaavat.",
        tension: "Korkea",
      },
      {
        id: "17-poyta",
        title: "Pöytä",
        order: 17,
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
    currentStationOrder: 9,
    stations: [
      {
        id: "18-siemen",
        title: "Siemen",
        order: 18,
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
            currentStationOrder={1}
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
            currentStationOrder={12}
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
            currentStationOrder={19}
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
      </div>
    </MemoryRouter>
  ),
};
