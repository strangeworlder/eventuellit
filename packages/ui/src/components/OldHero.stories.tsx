import type { Meta, StoryObj } from "@storybook/react";
import { OldHero } from "./OldHero";
import { Text } from "./Text";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Organismit/OldHero",
  component: OldHero,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    backgroundImageSrc: {
      control: "text",
    },
    backgroundImageAlt: {
      control: "text",
    },
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
        "royal",
        "royal-dark",
      ],
    },
  },
} satisfies Meta<typeof OldHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Sivun otsikko",
    description: "Lyhyt kuvaus sivun sisällöstä.",
    children: (
      <Text variant="muted" className="mt-2">
        Aiempi tähtikenttäversio säilytettynä suunnittelujärjestelmässä.
      </Text>
    ),
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "Asetukset",
  },
};

export const WithBackgroundImage: Story = {
  args: {
    title: "Mekaaninen sääntökirja",
    description: "Perusmekaniikat ja konfliktien kulku",
    backgroundImageSrc:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23022c43'/%3E%3Cstop offset='1' stop-color='%230d5f7f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='400' fill='url(%23g)'/%3E%3Ccircle cx='260' cy='120' r='90' fill='%23d95b43' fill-opacity='.9'/%3E%3Ccircle cx='1280' cy='90' r='70' fill='%23f0f3bd' fill-opacity='.7'/%3E%3C/svg%3E",
    backgroundImageAlt: "",
    children: (
      <Text variant="muted" className="mt-2">
        Taustakuvallinen versio säilyttää luettavuuden tummennetun peitekerroksen avulla.
      </Text>
    ),
  },
};
