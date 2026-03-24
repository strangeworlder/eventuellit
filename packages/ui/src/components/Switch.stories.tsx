import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Ilmoitukset",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

export const WithDescription: Story = {
  args: {
    label: "Pimeä tila",
    description: "Vähentää silmien rasitusta hämärässä ympäristössä.",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

export const Checked: Story = {
  args: {
    label: "Aktiivinen",
    description: "Tämä asetus on käytössä.",
  },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
};

export const Disabled: Story = {
  args: {
    label: "Lukittu asetus",
    description: "Tätä ei voi muuttaa.",
    disabled: true,
    checked: true,
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen asetus",
    description: "Ei näkyvissä oleva kytkin.",
    obscured: true,
  },
};
