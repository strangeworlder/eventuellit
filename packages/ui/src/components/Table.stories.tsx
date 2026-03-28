import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";
import { Table } from "./Table";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  // Satisfy required props at meta level so render-only stories don't need args
  args: {
    columns: [] as { key: string; header: string }[],
    data: [] as Record<string, unknown>[],
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact"],
    },
    striped: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    theme: {
      control: "select",
      options: [
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Sample datasets ─────────────────────────────────────────────────────────

type SkillRow = {
  taito: string;
  taso: string;
  noppa: string;
  bonus: string;
};

const skillData: SkillRow[] = [
  { taito: "Taistelutaidot", taso: "Mestari", noppa: "3d6", bonus: "+4" },
  { taito: "Loitsiminen", taso: "Edistynyt", noppa: "2d8", bonus: "+2" },
  { taito: "Hiiviskely", taso: "Asiantuntija", noppa: "2d6", bonus: "+3" },
  { taito: "Karisma", taso: "Noviisi", noppa: "1d6", bonus: "+1" },
  { taito: "Parantaminen", taso: "Edistynyt", noppa: "2d6", bonus: "+2" },
];

const skillColumns = [
  { key: "taito" as const, header: "Taito" },
  { key: "taso" as const, header: "Taso" },
  { key: "noppa" as const, header: "Noppa", align: "center" as const },
  { key: "bonus" as const, header: "Bonus", align: "right" as const },
];

type EpisodeRow = {
  istunto: string;
  paivamaara: string;
  pelaajat: number;
  kesto: string;
};

const episodeData: EpisodeRow[] = [
  { istunto: "Varjojen portti", paivamaara: "12.1.2025", pelaajat: 4, kesto: "3h 20min" },
  { istunto: "Kadonnut kaupunki", paivamaara: "26.1.2025", pelaajat: 3, kesto: "2h 50min" },
  { istunto: "Veren velka", paivamaara: "9.2.2025", pelaajat: 4, kesto: "4h 05min" },
  { istunto: "Kultainen naamio", paivamaara: "23.2.2025", pelaajat: 5, kesto: "3h 40min" },
  { istunto: "Viimeinen rituaali", paivamaara: "9.3.2025", pelaajat: 4, kesto: "3h 15min" },
  { istunto: "Haaveiden laakso", paivamaara: "23.3.2025", pelaajat: 3, kesto: "2h 30min" },
];

type EquipmentRow = {
  varuste: string;
  tyyppi: string;
  paino: number;
  hinta: number;
  maara: number;
};

const equipmentData: EquipmentRow[] = [
  { varuste: "Pitkämiekka", tyyppi: "Ase", paino: 1.5, hinta: 150, maara: 1 },
  { varuste: "Ketjupaita", tyyppi: "Panssari", paino: 8.0, hinta: 400, maara: 1 },
  { varuste: "Parannus­juoma", tyyppi: "Juoma", paino: 0.3, hinta: 50, maara: 3 },
  { varuste: "Pitkä jousi", tyyppi: "Ase", paino: 0.9, hinta: 120, maara: 1 },
  { varuste: "Nuolet (20 kpl)", tyyppi: "Ammus", paino: 0.5, hinta: 25, maara: 2 },
];

const tasoBadgeVariant = (taso: string) => {
  if (taso === "Mestari") return "highlight-solid" as const;
  if (taso === "Asiantuntija") return "solid" as const;
  if (taso === "Edistynyt") return "outline" as const;
  return "ghost" as const;
};

// ── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Table<SkillRow>
      columns={skillColumns}
      data={skillData}
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <Table<SkillRow>
      columns={skillColumns}
      data={skillData}
      variant="compact"
    />
  ),
};

export const Striped: Story = {
  render: () => (
    <Table<EpisodeRow>
      columns={[
        { key: "istunto", header: "Istunto" },
        { key: "paivamaara", header: "Päivämäärä" },
        { key: "pelaajat", header: "Pelaajat", align: "center" },
        { key: "kesto", header: "Kesto", align: "right" },
      ]}
      data={episodeData}
      striped
    />
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <Table<EpisodeRow>
      columns={[
        { key: "istunto", header: "Istunto" },
        { key: "paivamaara", header: "Päivämäärä" },
        { key: "pelaajat", header: "Pelaajat", align: "center" },
        { key: "kesto", header: "Kesto", align: "right" },
      ]}
      data={[
        ...episodeData,
        ...episodeData.map((r) => ({ ...r, istunto: r.istunto + " II" })),
      ]}
      stickyHeader
      striped
      className="max-h-52"
    />
  ),
};

export const NumericColumns: Story = {
  render: () => (
    <Table<EquipmentRow>
      columns={[
        { key: "varuste", header: "Varuste" },
        { key: "tyyppi", header: "Tyyppi" },
        { key: "paino", header: "Paino (kg)", align: "right" },
        { key: "hinta", header: "Hinta (gp)", align: "right" },
        { key: "maara", header: "Määrä", align: "right" },
      ]}
      data={equipmentData}
    />
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table<SkillRow>
      columns={skillColumns}
      data={skillData}
      caption="Hahmon taidot ja niihin liittyvät bonukset"
    />
  ),
};

export const WithCustomRenderer: Story = {
  render: () => (
    <Table<SkillRow>
      columns={[
        { key: "taito", header: "Taito" },
        {
          key: "taso",
          header: "Taso",
          render: (value) => (
            <Badge variant={tasoBadgeVariant(String(value))}>{String(value)}</Badge>
          ),
        },
        { key: "noppa", header: "Noppa", align: "center" },
        { key: "bonus", header: "Bonus", align: "right" },
      ]}
      data={skillData}
    />
  ),
};

export const AllVariants: Story = {
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Default</p>
        <Table<SkillRow> columns={skillColumns} data={skillData.slice(0, 3)} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">Compact + Striped</p>
        <Table<SkillRow> columns={skillColumns} data={skillData} variant="compact" striped />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-text-muted text-xs uppercase tracking-wider">With Custom Renderer</p>
        <Table<SkillRow>
          columns={[
            { key: "taito", header: "Taito" },
            {
              key: "taso",
              header: "Taso",
              render: (value) => (
                <Badge variant={tasoBadgeVariant(String(value))}>{String(value)}</Badge>
              ),
            },
            { key: "noppa", header: "Noppa", align: "center" },
            { key: "bonus", header: "Bonus", align: "right" },
          ]}
          data={skillData}
        />
      </div>
    </div>
  ),
};
