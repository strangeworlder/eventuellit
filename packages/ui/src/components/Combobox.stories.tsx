import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Stack } from "./Layout";
import { Combobox } from "./Combobox";
import type { ComboboxOption } from "./Combobox";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "dark" },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const HAHMOT: ComboboxOption[] = [
  { value: "1", label: "Iida Mäkinen", description: "Korsaari · Pelaaja 1" },
  { value: "2", label: "Anttoni Virtanen", description: "Koneinsinööri · Pelaaja 2" },
  { value: "3", label: "Reeta Korhonen", description: "Lääkintäupseeri · Pelaaja 3" },
  { value: "4", label: "Juhani Salmi", description: "Navigaattori · Pelaaja 4" },
  { value: "5", label: "Meri Leinonen", description: "Tiedusteluagentti · Pelaaja 1" },
  { value: "6", label: "Aleksi Heikkinen", description: "Mekaanikko · GM-hahmo" },
  { value: "7", label: "Santeri Mäkelä", description: "Kauppias · GM-hahmo" },
];

function ComboboxDemo(args: React.ComponentProps<typeof Combobox>) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const selectedLabel = HAHMOT.find((h) => h.value === selected)?.label;

  return (
    <Stack gap={4}>
      <Combobox
        {...args}
        query={query}
        onQueryChange={setQuery}
        onSelect={(value) => {
          setSelected(value);
          setQuery("");
        }}
      />
      {selected && (
        <p className="text-[var(--theme-text-muted)] text-sm font-sans">
          Valittu: <strong className="text-[var(--theme-text)]">{selectedLabel}</strong>
        </p>
      )}
    </Stack>
  );
}

export const Default: Story = {
  render: (args) => <ComboboxDemo {...args} />,
  args: {
    options: HAHMOT,
    placeholder: "Hae hahmoa...",
    label: "Lisää hahmo huoneeseen",
  },
};

export const Compact: Story = {
  render: (args) => <ComboboxDemo {...args} />,
  args: {
    options: HAHMOT,
    placeholder: "Hae hahmoa...",
    size: "compact",
  },
};

export const WithError: Story = {
  render: (args) => <ComboboxDemo {...args} />,
  args: {
    options: HAHMOT,
    placeholder: "Hae hahmoa...",
    label: "Hahmo",
    error: "Vaadittu kenttä",
  },
};

export const Loading: Story = {
  render: (args) => <ComboboxDemo {...args} />,
  args: {
    options: HAHMOT,
    placeholder: "Hae hahmoa...",
    label: "Ladataan hahmoja...",
    loading: true,
  },
};

export const Disabled: Story = {
  render: (args) => <ComboboxDemo {...args} />,
  args: {
    options: HAHMOT,
    placeholder: "Hae hahmoa...",
    label: "Ei saatavilla",
    disabled: true,
  },
};
