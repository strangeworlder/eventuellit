import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Input",
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

export const Compact: Story = {
  name: "Tiivis (GM-työkalut)",
  args: {
    size: "compact",
    placeholder: "Kirjoita tähän...",
  },
};

export const CompactWithLabel: Story = {
  name: "Tiivis, otsikolla",
  args: {
    size: "compact",
    label: "Nimi",
    placeholder: "Esim. Kaelen",
  },
};

export const CompactWithError: Story = {
  name: "Tiivis, virheellä",
  args: {
    size: "compact",
    label: "Koodi",
    placeholder: "Syötä koodi",
    error: "Koodi on virheellinen.",
  },
};

export const CompactVsDefault: Story = {
  name: "Tiivis vs. oletus",
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-6 w-72">
      <Input placeholder="Oletus" label="Oletus" />
      <Input size="compact" placeholder="Tiivis" label="Tiivis" />
    </div>
  ),
};
