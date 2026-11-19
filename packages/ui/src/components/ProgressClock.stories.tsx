import type { Meta, StoryObj } from "@storybook/react";
import { ProgressClock } from "./ProgressClock";

const meta: Meta<typeof ProgressClock> = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/ProgressClock",
  component: ProgressClock,
  tags: ["autodocs"],
  argTypes: {
    segmentsTotal: {
      control: "select",
      options: [null, 4, 6, 8, 10, 12],
    },
    segmentsFilled: { control: { type: "number", min: 0, max: 12 } },
    pendingTicks: { control: { type: "number", min: 0, max: 5 } },
    category: {
      control: "select",
      options: ["tutkimus", "projekti"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressClock>;

export const ProjektiKuusiOsaa: Story = {
  name: "Projekti (6 osaa)",
  args: {
    segmentsTotal: 6,
    segmentsFilled: 3,
    pendingTicks: 1,
    category: "projekti",
    size: "lg",
    label: "Navigointikilpien korjaus",
  },
};

export const TutkimusKahdeksanOsaa: Story = {
  name: "Tutkimus (8 osaa)",
  args: {
    segmentsTotal: 8,
    segmentsFilled: 5,
    category: "tutkimus",
    size: "lg",
    label: "Korruptoituneiden datalevyjen purku",
  },
};

export const OdottaaMitoitusta: Story = {
  name: "Odottaa pelinjohtajan mitoitusta",
  args: {
    segmentsTotal: null,
    segmentsFilled: 2,
    category: "tutkimus",
    size: "lg",
    label: "Hätätaajuuden alkuperä",
  },
};

export const KokoValikoima: Story = {
  name: "Kaikki kellokoot ja tilat",
  render: () => (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <ProgressClock
        segmentsTotal={4}
        segmentsFilled={2}
        category="projekti"
        size="md"
        label="4 osaa"
      />
      <ProgressClock
        segmentsTotal={6}
        segmentsFilled={4}
        category="tutkimus"
        size="md"
        label="6 osaa"
      />
      <ProgressClock
        segmentsTotal={8}
        segmentsFilled={8}
        category="projekti"
        size="md"
        label="Valmis (8)"
      />
      <ProgressClock
        segmentsTotal={10}
        segmentsFilled={3}
        category="tutkimus"
        size="md"
        label="10 osaa"
      />
      <ProgressClock
        segmentsTotal={12}
        segmentsFilled={7}
        category="projekti"
        size="md"
        label="12 osaa"
      />
      <ProgressClock
        segmentsTotal={null}
        segmentsFilled={3}
        category="tutkimus"
        size="md"
        label="Mitoittamaton"
      />
    </div>
  ),
};
