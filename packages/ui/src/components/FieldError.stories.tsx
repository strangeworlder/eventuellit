import type { Meta, StoryObj } from "@storybook/react";
import { FieldError } from "./FieldError";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/FieldError",
  component: FieldError,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Kenttä on pakollinen.",
  },
};

export const WithPadding: Story = {
  args: {
    children: "Hyväksy ehdot.",
    className: "pl-8",
  },
};
