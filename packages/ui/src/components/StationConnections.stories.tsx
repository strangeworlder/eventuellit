import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { StationConnections, type StationConnectionNode } from "./StationConnections";

// Representative sample of Kynnys stations for stories
const kynnysSampleStations = [
  {
    id: "01-seula",
    title: "Seula",
    order: 1,
    description: "Keskusasema — Kynnyksen kauppasatama ja solmupiste.",
    tension: "Matala",
  },
  {
    id: "02-syke",
    title: "Syke",
    order: 2,
    description: "Teollinen solmu — Kynnyksen moottorit käyvät täällä.",
    tension: "Korkea",
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
    tension: "Matala",
  },
  {
    id: "05-louhos",
    title: "Louhos",
    order: 5,
    description: "Kaivosasema — resurssit virtaavat ylöspäin, ihmiset alaspäin.",
    tension: "Murtunut",
  },
  {
    id: "14-hakki",
    title: "Häkki",
    order: 14,
    description: "Säilytysasema — vankilat ja pakkotyöleirit.",
    tension: "Korkea",
  },
  {
    id: "06-akseli",
    title: "Akseli",
    order: 6,
    description: "KW-konsortio HQ — Kynnyksen hallintotorni ja logiikkakeskus.",
    tension: "Matala",
  },
  {
    id: "07-katedraali",
    title: "Katedraali",
    order: 7,
    description: "Ekklesian sydän — temppeli, teatteri ja propagandakeskus.",
    tension: "Matala",
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
    description: "Studio — Kynnyksen mediakeskus ja julkisuuskoneen koti.",
    tension: "Matala",
  },
  {
    id: "17-poyta",
    title: "Pöytä",
    order: 17,
    description: "Neuvottelu — diplomatian ja sovittelun asema.",
    tension: "Matala",
  },
  {
    id: "18-siemen",
    title: "Siemen",
    order: 18,
    description: "Hylätty tutkimusasema — jokin kasvaa pimeydessä.",
    tension: "Matala",
  },
  {
    id: "19-krypta",
    title: "Krypta",
    order: 19,
    description: "Hautausmaa-asema. Kukaan ei kysy, keitä täällä lepää.",
    tension: "Matala",
  },
];

// Connection node helpers
const seulaSolmuConnections: StationConnectionNode[] = [
  { title: "Syke", direction: "N" },
  { title: "Verso", direction: "E" },
  { title: "Pesä", direction: "NE" },
  { title: "Kuiskaus", direction: "SE" },
  { title: "Alasin", direction: "W" },
  { title: "Louhos", direction: "SW" },
  { title: "Häkki", direction: "S" },
  { title: "_marker_nw", direction: "NW", type: "marker", shape: 12 },
];

const katedraaliConnections: StationConnectionNode[] = [
  { title: "Syke", direction: "W" },
  { title: "Akseli", direction: "NW" },
  { title: "Verkko", direction: "E" },
  { title: "Pesä", direction: "S" },
  { title: "Ikoni", direction: "N" },
  { title: "Pöytä", direction: "SW" },
];

const kuiskausConnections: StationConnectionNode[] = [
  { title: "Seula", direction: "NW" },
  { title: "Verso", direction: "N" },
  { title: "Siemen", direction: "E" },
  { title: "Krypta", direction: "S" },
];

const sykeConnections: StationConnectionNode[] = [
  { title: "Seula", direction: "S" },
  { title: "Katedraali", direction: "E" },
  { title: "Alasin", direction: "W" },
  { title: "Akseli", direction: "SE" },
  { title: "_marker_n", direction: "N", type: "marker", shape: 6 },
];

const meta: Meta<typeof StationConnections> = {
  title: "Suunnittelujarjestelma/Organismit/StationConnections",
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
    currentStationTitle: {
      control: "text",
      description: "Nykyisen aseman nimi (ajetaan layoutId-animaatioille)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StationConnections>;

/** Seula — Kynnyksen keskusasema, 7 yhteyttä + d12-merkki NW:ssä */
export const Solmupiste: Story = {
  args: {
    connections: seulaSolmuConnections,
    tension: "Matala",
    currentStationOrder: 1,
    currentStationTitle: "Seula",
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Kuiskaus — murtunut asema, 4 yhteyttä */
export const Murtunut: Story = {
  args: {
    connections: kuiskausConnections,
    tension: "Murtunut",
    currentStationOrder: 10,
    currentStationTitle: "Kuiskaus",
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Katedraali — matala jännite, tiheä 6-yhteyden verkosto */
export const Tiheaverkosto: Story = {
  args: {
    connections: katedraaliConnections,
    tension: "Matala",
    currentStationOrder: 7,
    currentStationTitle: "Katedraali",
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Syke — korkea jännite, teollinen solmupiste */
export const KorkeaJannite: Story = {
  args: {
    connections: sykeConnections,
    tension: "Korkea",
    currentStationOrder: 2,
    currentStationTitle: "Syke",
    stations: kynnysSampleStations,
    basePath: "/",
  },
};

/** Yksittäinen yhteys — minimaalinen näkymä */
export const YksiYhteys: Story = {
  args: {
    connections: [
      { title: "Siemen", direction: "N" },
      { title: "_marker_se", direction: "SE", type: "marker", shape: "swirl" },
    ],
    tension: "Murtunut",
    currentStationOrder: 9,
    currentStationTitle: "Kilpi",
    stations: kynnysSampleStations,
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
            Matala jännite — Seula (7 yhteyttä + d12-merkki)
          </p>
          <StationConnections
            connections={seulaSolmuConnections}
            tension="Matala"
            currentStationOrder={1}
            currentStationTitle="Seula"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2">
            Korkea jännite — Syke (5 yhteyttä + d6-merkki)
          </p>
          <StationConnections
            connections={sykeConnections}
            tension="Korkea"
            currentStationOrder={2}
            currentStationTitle="Syke"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-2">
            Murtunut jännite — Kuiskaus (4 yhteyttä)
          </p>
          <StationConnections
            connections={kuiskausConnections}
            tension="Murtunut"
            currentStationOrder={10}
            currentStationTitle="Kuiskaus"
            stations={kynnysSampleStations}
            basePath="/"
          />
        </div>
      </div>
    </MemoryRouter>
  ),
};
