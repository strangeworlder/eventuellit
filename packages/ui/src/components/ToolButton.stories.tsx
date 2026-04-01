import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "./Button";
import { MarkdownRenderer } from "./Markdown";
import { Text } from "./Text";
import { TextSection } from "./TextSection";
import { ToolButton } from "./ToolButton";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/ToolButton",
  component: ToolButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "Muokkaa",
  },
} satisfies Meta<typeof ToolButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Perustilat ── */

export const Oletus: Story = {
  args: {
    children: "Muokkaa",
  },
};

export const Ladataan: Story = {
  args: {
    loading: true,
    loadingMessage: "Julkaistaan...",
    children: "Julkaistaan...",
  },
};

export const EiKaytossa: Story = {
  name: "Ei käytössä",
  args: {
    disabled: true,
    children: "Muokkaa",
  },
};

/* ── Käyttöesimerkki ── */

export const TyokaluriviEsimerkki: Story = {
  name: "Työkalurivi-esimerkki",
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="max-w-2xl w-full">
      <TextSection
        title="Pelinjohtajan kertaus"
        variant="bordered"
        actions={
          <>
            <ToolButton>Piilota</ToolButton>
            <ToolButton>Muokkaa</ToolButton>
          </>
        }
      >
        <MarkdownRenderer>
          {`Jakso alkaa tilanteessa, jossa miehistö etsii reittiä nestemäisen avaruuden
virtauksista pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu.

Pelaajat saavat tehtäväkseen selvittää, miksi aseman tietoliikenneyhteys on katkennut.`}
        </MarkdownRenderer>
      </TextSection>
    </div>
  ),
};

/* ── Vertailu ── */

export const ButtonVsToolButton: Story = {
  name: "Button vs. ToolButton (vertailu)",
  tags: ["!manifest"],
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div className="flex flex-col gap-4">
        <Text variant="overline">Button variant=&quot;outline&quot; — toimintakehote</Text>
        <Text variant="small">
          Käytä, kun painike kutsuu käyttäjää tekemään jonkin merkittävän toiminnon. Muodollinen,
          vahva visuaalinen paino.
        </Text>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline">Muokkaa</Button>
          <Button variant="outline">Piilota</Button>
          <Button variant="outline">Julkaise</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text variant="overline">ToolButton — toimintatyökalu</Text>
        <Text variant="small">
          Käytä, kun painike on apuväline sisällön hallintaan — ei kutsu käyttäjää toimimaan, vaan
          antaa pääsyn toimintoon. Matala visuaalinen paino, sopii sisältöotsikoiden yhteyteen.
        </Text>
        <div className="flex gap-3 flex-wrap">
          <ToolButton>Muokkaa</ToolButton>
          <ToolButton>Piilota</ToolButton>
          <ToolButton>Julkaise</ToolButton>
        </div>
      </div>
    </div>
  ),
};

export const KaikkiTilat: Story = {
  name: "Kaikki tilat",
  tags: ["!manifest"],
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">Oletus</p>
        <div className="flex flex-wrap gap-3">
          <ToolButton>Muokkaa</ToolButton>
          <ToolButton>Piilota</ToolButton>
          <ToolButton>Julkaise</ToolButton>
          <ToolButton>Muokkaa omaa kertausta</ToolButton>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">Ladataan</p>
        <div className="flex flex-wrap gap-3">
          <ToolButton loading loadingMessage="Julkaistaan...">
            Julkaistaan...
          </ToolButton>
          <ToolButton loading loadingMessage="Piilotetaan...">
            Piilotetaan...
          </ToolButton>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-text-subtle">
          Ei käytössä
        </p>
        <div className="flex flex-wrap gap-3">
          <ToolButton disabled>Muokkaa</ToolButton>
          <ToolButton disabled>Piilota</ToolButton>
        </div>
      </div>
    </div>
  ),
};
