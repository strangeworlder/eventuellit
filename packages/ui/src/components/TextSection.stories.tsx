import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "./Text";
import { TextSection } from "./TextSection";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/TextSection",
  component: TextSection,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Kuvaus",
  },
} satisfies Meta<typeof TextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Otsikolla: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <TextSection {...args}>
        <Text>
          Jakso alkaa tilanteessa, jossa miehisto etsii reittia nestemaisen
          avaruuden virtauksista pois ennen kuin huoltoaluksen aikaikkuna sulkeutuu.
        </Text>
      </TextSection>
    </div>
  ),
};

export const IlmanOtsikkoa: Story = {
  render: () => (
    <div className="max-w-2xl">
      <TextSection>
        <Text>
          Tata rakennetta voi kayttaa myos pelkkaan tekstisisaltoon silloin, kun
          otsikko tulee ylemmalta tasolta.
        </Text>
      </TextSection>
    </div>
  ),
};
