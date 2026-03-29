import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "pp.kk.vvvv",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Pelipäivä",
    placeholder: "pp.kk.vvvv",
  },
};

export const WithError: Story = {
  args: {
    label: "Pelipäivä",
    error: "Päivämäärä on pakollinen.",
  },
};

export const WithValue: Story = {
  name: "Valittu päivä",
  args: {
    label: "Pelipäivä",
    value: "2026-03-29",
  },
};

export const WithMinMax: Story = {
  name: "Rajoitettu väli",
  args: {
    label: "Pelipäivä",
    min: "2026-03-01",
    max: "2026-03-31",
    placeholder: "Maaliskuu 2026",
  },
};

export const Disabled: Story = {
  name: "Pois käytöstä",
  args: {
    label: "Pelipäivä",
    value: "2026-03-29",
    disabled: true,
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen päivämäärä",
    value: "2026-03-29",
    obscured: true,
  },
};

export const Compact: Story = {
  name: "Tiivis (GM-työkalut)",
  args: {
    size: "compact",
    placeholder: "pp.kk.vvvv",
  },
};

export const CompactWithLabel: Story = {
  name: "Tiivis, otsikolla",
  args: {
    size: "compact",
    label: "Päivämäärä",
    placeholder: "pp.kk.vvvv",
  },
};
