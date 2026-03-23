import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Kirjoita tähän...",
    className: "h-32",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Motivaatio",
    placeholder: "Mikä ajaa hahmoasi eteenpäin?",
    className: "h-32",
  },
};

export const WithError: Story = {
  args: {
    label: "Kuvaus",
    placeholder: "Kirjoita kuvaus...",
    error: "Kuvaus on pakollinen.",
    className: "h-32",
  },
};

export const Monospace: Story = {
  args: {
    label: "Sisältö (Markdown)",
    placeholder: "### Otsikko\n\nKirjoita markdown-sisältöä...",
    variant: "monospace",
    className: "h-64",
  },
};
