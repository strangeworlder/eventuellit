import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    name: "archetype",
    label: "Arkkityyppi",
  },
  render: (args) => {
    const [value, setValue] = useState("expert");
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroupItem value="expert" label="Ekspertti" description="Sisu: 3n6, Taidot: 3" />
        <RadioGroupItem value="soldier" label="Sotilas" description="Sisu: 3n8, Taidot: 2" />
        <RadioGroupItem value="monk" label="Munkki" description="Sisu: 3n4, Taidot: 2" disabled />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  args: {
    name: "sex",
    label: "Sukupuoli",
    orientation: "horizontal",
  },
  render: (args) => {
    const [value, setValue] = useState("none");
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroupItem value="male" label="Mies" />
        <RadioGroupItem value="female" label="Nainen" />
        <RadioGroupItem value="non-binary" label="Ei-binäärinen" />
        <RadioGroupItem value="none" label="Ei määritelty" />
      </RadioGroup>
    );
  },
};

export const WithError: Story = {
  args: {
    name: "status",
    label: "Tila",
    error: "Valinta on pakollinen.",
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroupItem value="active" label="Aktiivinen" />
        <RadioGroupItem value="planned" label="Tulossa" />
        <RadioGroupItem value="completed" label="Arkistoitu" />
      </RadioGroup>
    );
  },
};

export const Obscured: Story = {
  name: "Piilotettu (koko ryhmä)",
  args: {
    name: "obscured-radio",
    label: "Salainen valinta",
    obscured: true,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupItem value="a" label="Vaihtoehto A" description="Ensimmäinen vaihtoehto." />
      <RadioGroupItem value="b" label="Vaihtoehto B" description="Toinen vaihtoehto." />
    </RadioGroup>
  ),
};

export const ObscuredItem: Story = {
  name: "Piilotettu (yksittäinen)",
  args: {
    name: "partial-obscured",
    label: "Arkkityyppi",
  },
  render: (args) => {
    const [value, setValue] = useState("expert");
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <RadioGroupItem value="expert" label="Ekspertti" description="Sisu: 3n6, Taidot: 3" />
        <RadioGroupItem value="soldier" label="Sotilas" description="Sisu: 3n8, Taidot: 2" />
        <RadioGroupItem value="monk" label="Munkki" description="Sisu: 3n4, Taidot: 2" obscured />
      </RadioGroup>
    );
  },
};
