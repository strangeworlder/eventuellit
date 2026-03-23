import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Hyväksy ehdot",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Muista minut",
    description: "Pidä kirjautuminen voimassa 30 päivää.",
  },
};

export const Checked: Story = {
  args: {
    label: "Aktiivinen",
    description: "Tämä asetus on käytössä.",
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Hyväksy ehdot",
    error: "Sinun on hyväksyttävä ehdot jatkaaksesi.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Estetty valinta",
    description: "Tätä ei voi muuttaa.",
    disabled: true,
    defaultChecked: true,
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen valinta",
    description: "Ei näkyvissä oleva asetus.",
    obscured: true,
  },
};
