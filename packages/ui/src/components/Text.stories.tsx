import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "./Text";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  args: {
    variant: "body",
    children:
      "Eventuellit on episodinen roolipelijarjestelma, jossa valinnat vaikuttavat seuraavan jakson asetelmiin.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["body", "small", "lead", "muted", "bold", "label", "caption", "node", "station-node"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Variantit: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      <Text variant="lead">Johdanto: Tämä kappale toimii ingressina.</Text>
      <Text variant="body">
        Perusteksti kuvaa tilanteen selkeasti ja neutraalisti.
      </Text>
      <Text variant="bold">
        Korostettu teksti nostaa esiin yhden tarkean huomiokohdan.
      </Text>
      <Text variant="muted">
        Hillitty teksti sopii taustatiedolle, joka ei saa varastaa huomiota.
      </Text>
      <Text variant="small">Pieni teksti toimii lisahuomautuksissa.</Text>
      <Text variant="label">Osion otsikko</Text>
      <Text variant="caption">Metatiedot ja alaviitteet, kuten päivämäärä tai lähde.</Text>
      <div className="flex gap-6 items-start">
        <div className="flex flex-col items-center gap-1">
          <Text variant="node" className="text-center max-w-16">Lyhyt</Text>
          <Text variant="caption" className="text-text-subtle">node</Text>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Text variant="station-node">Pohjoisinen Solmukohta</Text>
          <Text variant="caption" className="text-text-subtle">station-node</Text>
        </div>
      </div>
    </div>
  ),
};
