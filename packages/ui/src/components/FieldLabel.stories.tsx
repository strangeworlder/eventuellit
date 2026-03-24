import type { Meta, StoryObj } from "@storybook/react";
import { FieldLabel } from "./FieldLabel";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/FieldLabel",
  component: FieldLabel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    obscured: { control: "boolean" },
  },
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Tekstikenttä",
  },
};

export const Obscured: Story = {
  args: {
    children: "Tekstikenttä",
    obscured: true,
  },
};
