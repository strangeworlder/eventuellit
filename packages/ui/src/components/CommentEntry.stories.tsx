import type { Meta, StoryObj } from "@storybook/react";
import { CommentEntry } from "./CommentEntry";

const meta: Meta<typeof CommentEntry> = {
  title: "Suunnittelujarjestelma/Atomit/CommentEntry",
  component: CommentEntry,
  tags: ["autodocs"],
  argTypes: {
    anonymous: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CommentEntry>;

export const Nimetty: Story = {
  args: {
    author: "Kaisa K.",
    anonymous: false,
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    children: "Tämä operaatio kuulostaa erittäin riskialttiilta — kannatan silti.",
  },
};

export const Anonyymi: Story = {
  args: {
    author: "Nimetön",
    anonymous: true,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    children: "En usko, että meillä on resursseja tähän vielä. Ehkä seuraavalla kerralla.",
  },
};

export const Vanha: Story = {
  name: "Vanha kommentti",
  args: {
    author: "Pekka V.",
    anonymous: false,
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    children: "Kiinnostava kohde. Täytyy miettiä strategiaa.",
  },
};
