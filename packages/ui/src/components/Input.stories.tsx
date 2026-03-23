import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Kirjoita tähän...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Hahmon Nimi",
    placeholder: "Esim. Kaelen",
  },
};

export const WithError: Story = {
  args: {
    label: "Koodi",
    placeholder: "Syötä koodi",
    error: "Koodi on virheellinen.",
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen kenttä",
    placeholder: "Ei näkyvissä...",
    obscured: true,
  },
};
