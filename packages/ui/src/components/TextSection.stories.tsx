import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { MarkdownRenderer } from "./Markdown";
import { Text } from "./Text";
import { TextSection } from "./TextSection";
import { ToolButton } from "./ToolButton";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/TextSection",
  component: TextSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "Kuvaus",
  },
} satisfies Meta<typeof TextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `Jakso alkaa tilanteessa, jossa miehistö etsii reittiä nestemäisen avaruuden virtauksista pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu.

Pelaajat saavat tehtäväkseen selvittää, miksi aseman tietoliikenneyhteys on katkennut. Tutkimuksen edetessä he törmäävät merkkeihin siitä, että joku on käynyt asemalla ennen heitä.`;

/* ── Perusmuodot ── */

export const Otsikolla: Story = {
  args: {
    title: "Kuvaus",
    variant: "default",
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TextSection {...args}>
        <Text>
          Jakso alkaa tilanteessa, jossa miehistö etsii reittiä nestemäisen avaruuden virtauksista
          pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu.
        </Text>
      </TextSection>
    </div>
  ),
};

export const IlmanOtsikkoa: Story = {
  args: {
    title: undefined,
  },
  render: () => (
    <div className="max-w-2xl">
      <TextSection>
        <Text>
          Tätä rakennetta voi käyttää myös pelkkään tekstisisältöön silloin, kun otsikko tulee
          ylemmältä tasolta.
        </Text>
      </TextSection>
    </div>
  ),
};

/* ── Reunaviiva-variantti ── */

export const Reunaviivalla: Story = {
  name: "Reunaviivalla (bordered)",
  args: {
    title: "Pelinjohtajan kertaus",
    variant: "bordered",
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TextSection {...args}>
        <MarkdownRenderer>{sampleMarkdown}</MarkdownRenderer>
      </TextSection>
    </div>
  ),
};

export const OtsikollaJaToiminnoilla: Story = {
  name: "Otsikolla ja toiminnoilla",
  args: {
    title: "Jakson yhteenveto",
    variant: "bordered",
    actions: <ToolButton>Muokkaa</ToolButton>,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TextSection {...args}>
        <MarkdownRenderer>{sampleMarkdown}</MarkdownRenderer>
      </TextSection>
    </div>
  ),
};

export const UseitaToimintoja: Story = {
  name: "Useita toimintoja",
  args: {
    title: "Pelinjohtajan kertaus",
    variant: "bordered",
    actions: (
      <>
        <ToolButton>Piilota</ToolButton>
        <ToolButton>Muokkaa</ToolButton>
      </>
    ),
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TextSection {...args}>
        <MarkdownRenderer>{sampleMarkdown}</MarkdownRenderer>
      </TextSection>
    </div>
  ),
};

/* ── Vertailu ── */

export const KorttiVsOsio: Story = {
  name: "Kortti vs. tekstiosio (vertailu)",
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-12 max-w-2xl">
      <div className="flex flex-col gap-3">
        <Text variant="overline">Card variant=&quot;outline&quot; — raskas</Text>
        <Card variant="outline">
          <CardHeader>
            <CardTitle>Pelinjohtajan kertaus</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer>{sampleMarkdown}</MarkdownRenderer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Text variant="overline">TextSection variant=&quot;bordered&quot; — kevyt</Text>
        <TextSection title="Pelinjohtajan kertaus" variant="bordered">
          <MarkdownRenderer>{sampleMarkdown}</MarkdownRenderer>
        </TextSection>
      </div>
    </div>
  ),
};
