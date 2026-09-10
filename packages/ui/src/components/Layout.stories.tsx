import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { Container, Grid, Stack } from "./Layout";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Layout",
  component: Stack,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helper ──

function Boksi({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/30 rounded-sm px-4 py-3 text-sm font-semibold text-[var(--theme-text)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

// ── Stack ──

export const Pino: Story = {
  render: () => (
    <Stack direction="column" gap={4} className="max-w-xs">
      <Boksi>Kohta 1</Boksi>
      <Boksi>Kohta 2</Boksi>
      <Boksi>Kohta 3</Boksi>
    </Stack>
  ),
};

export const RiviPino: Story = {
  render: () => (
    <Stack direction="row" gap={3} wrap>
      <Boksi>Ominaisuus</Boksi>
      <Boksi>Taito</Boksi>
      <Boksi>Varuste</Boksi>
      <Boksi>Haitta</Boksi>
      <Boksi>Etu</Boksi>
    </Stack>
  ),
};

export const PinoKeskitetty: Story = {
  render: () => (
    <Stack direction="row" gap={4} align="center" justify="between" className="w-full max-w-sm">
      <Boksi>Vasen</Boksi>
      <Boksi className="py-6">Pitkä</Boksi>
      <Boksi>Oikea</Boksi>
    </Stack>
  ),
};

// ── Grid ──

export const Ruudukko: Story = {
  render: () => (
    <Grid cols={3} gap={4} className="max-w-lg">
      {["Solu 1", "Solu 2", "Solu 3", "Solu 4", "Solu 5", "Solu 6"].map((solu) => (
        <Boksi key={solu}>{solu}</Boksi>
      ))}
    </Grid>
  ),
};

export const VastaavaRuudukko: Story = {
  render: () => (
    <Grid responsive={{ base: 1, mobile: 2, desktop: 4 }} gap={4} className="w-full">
      <Boksi>Seula</Boksi>
      <Boksi>Syke</Boksi>
      <Boksi>Verso</Boksi>
      <Boksi>Pesä</Boksi>
    </Grid>
  ),
};

// ── Container ──

export const Sailio: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-6 py-8 bg-[var(--theme-bg)]">
      {(["prose", "page", "wide", "full"] as const).map((size) => (
        <Container key={size} size={size} padded>
          <Boksi>
            <span className="font-black uppercase tracking-widest text-xs text-text-subtle mr-2">
              {size}
            </span>
            Säiliö — leveysrajoitus:{" "}
            {size === "prose"
              ? "65ch"
              : size === "page"
                ? "1280px"
                : size === "wide"
                  ? "1536px"
                  : "rajoittamaton"}
          </Boksi>
        </Container>
      ))}
    </div>
  ),
};
