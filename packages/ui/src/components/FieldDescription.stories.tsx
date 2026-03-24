import type { Meta, StoryObj } from "@storybook/react";
import { FieldDescription } from "./FieldDescription";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/FieldDescription",
  component: FieldDescription,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    obscured: { control: "boolean" },
  },
} satisfies Meta<typeof FieldDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Valinnallinen kuvaus valintaruudulle.",
  },
};

export const Obscured: Story = {
  args: {
    children: "Valinnallinen kuvaus valintaruudulle.",
    obscured: true,
    glitchStyle: {
      "--glitch-delay": "-2.50s",
      "--glitch-duration": "6.00s",
    } as React.CSSProperties,
  },
};
