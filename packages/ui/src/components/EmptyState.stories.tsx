import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  args: {
    title: "Ei kohteita",
    description: "Lisää ensimmäinen kohde aloittaaksesi.",
  },
};

export const Toiminnolla: Story = {
  args: {
    title: "Ei hahmoja",
    description: "Luo ensimmäinen hahmosi.",
  },
  render: () => (
    <EmptyState
      title="Ei hahmoja"
      description="Luo ensimmäinen hahmosi."
      action={<Button>Luo hahmo</Button>}
    />
  ),
};
