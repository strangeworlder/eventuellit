import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Heading",
  component: Heading,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Vikkelä kettu loikkaa laiskan koiran yli",
    variant: "h1",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background text-text p-8 min-h-screen">
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h1 (3rem)</span>
        <Heading variant="h1">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h2 (2.25rem)</span>
        <Heading variant="h2">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h3 (1.875rem)</span>
        <Heading variant="h3">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h4 (1.5rem)</span>
        <Heading variant="h4">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h5 (1.25rem)</span>
        <Heading variant="h5">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variantti: h6 (1.125rem)</span>
        <Heading variant="h6">Vikkelä kettu loikkaa laiskan koiran yli</Heading>
      </div>
    </div>
  ),
};
