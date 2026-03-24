import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusOptions = [
  { value: "active", label: "Aktiivinen" },
  { value: "completed", label: "Arkistoitu" },
  { value: "planned", label: "Tulossa" },
];

export const Default: Story = {
  args: {
    options: statusOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Tila",
    options: statusOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Tila",
    placeholder: "Valitse tila...",
    options: statusOptions,
    defaultValue: "",
  },
};

export const WithError: Story = {
  args: {
    label: "Tila",
    options: statusOptions,
    error: "Tila on pakollinen.",
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen valinta",
    options: statusOptions,
    obscured: true,
  },
};
