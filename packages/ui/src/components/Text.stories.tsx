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
      options: ["base", "large", "small", "lead", "muted", "bold"],
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
    </div>
  ),
};
