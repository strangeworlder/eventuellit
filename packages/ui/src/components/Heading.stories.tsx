import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";
import "../styles.css";

const meta = {
  title: "Design System/Heading",
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
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h1",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-background text-text p-8 min-h-screen">
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h1 (3rem)</span>
        <Heading variant="h1">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h2 (2.25rem)</span>
        <Heading variant="h2">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h3 (1.875rem)</span>
        <Heading variant="h3">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h4 (1.5rem)</span>
        <Heading variant="h4">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h5 (1.25rem)</span>
        <Heading variant="h5">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <span className="text-sm opacity-60 block mb-1">Variant: h6 (1.125rem)</span>
        <Heading variant="h6">The quick brown fox jumps over the lazy dog</Heading>
      </div>
    </div>
  ),
};
