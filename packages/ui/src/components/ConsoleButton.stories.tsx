import type { Meta, StoryObj } from "@storybook/react";
import { ConsoleButton } from "./ConsoleButton";

const meta: Meta<typeof ConsoleButton> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsoleButton",
  component: ConsoleButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "danger", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "lg", "compact"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConsoleButton>;

export const Perus: Story = {
  args: {
    variant: "primary",
    iconLeft: "dice5",
    children: "Lukitse ja heitä nopat",
  },
};

export const Variantit: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <ConsoleButton variant="primary" iconLeft="check">
        Varaa hytti
      </ConsoleButton>
      <ConsoleButton variant="secondary" iconLeft="home">
        Avaa hytti
      </ConsoleButton>
      <ConsoleButton variant="outline" iconLeft="pencil">
        Muokkaa
      </ConsoleButton>
      <ConsoleButton variant="danger">Vapauta hytti</ConsoleButton>
      <ConsoleButton variant="ghost">Peruuta</ConsoleButton>
      <ConsoleButton variant="primary" loading>
        Tallennetaan
      </ConsoleButton>
    </div>
  ),
};
