import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  DowntimeAllocator,
  type DowntimeClockTarget,
  type DowntimeDraftAllocation,
} from "./DowntimeAllocator";

const SAMPLE_CLOCKS: DowntimeClockTarget[] = [
  {
    id: 1,
    title: "Korruptoituneiden datalevyjen tulkinta",
    description: "Viestintäkeskuksen sotaa edeltävien reittilokien purkaminen.",
    category: "tutkimus",
    scope: "ship",
    roomLabel: "Kartta- ja viestintäkeskus",
    segmentsTotal: 6,
    segmentsFilled: 2,
  },
  {
    id: 2,
    title: "Signaalin suodatusalgoritmi",
    description: "Pelaajan avaama tutkimus; pelinjohtaja asettaa osien määrän.",
    category: "tutkimus",
    scope: "character",
    roomLabel: null,
    segmentsTotal: null,
    segmentsFilled: 1,
  },
  {
    id: 3,
    title: "Navigointikilpien vahvistaminen",
    description: "Konehuoneen ohjainlevyn ja keulakilpien hitsaus ja kalibrointi.",
    category: "projekti",
    scope: "ship",
    roomLabel: "Konehuone",
    segmentsTotal: 8,
    segmentsFilled: 4,
  },
];

const meta: Meta<typeof DowntimeAllocator> = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/DowntimeAllocator",
  component: DowntimeAllocator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DowntimeAllocator>;

function InteractiveTemplate({
  availableDice,
  hasHarmit,
}: {
  availableDice: number;
  hasHarmit: boolean;
}) {
  const [draft, setDraft] = React.useState<DowntimeDraftAllocation>({
    healedHarmiIndices: hasHarmit ? [0] : [],
    clockDice: { 1: 1, 3: 1 },
    prepDice: 0,
    prepDescription: "",
  });

  return (
    <DowntimeAllocator
      availableDice={availableDice}
      activeHarmit={
        hasHarmit
          ? [
              { index: 0, text: "Palovamma oikeassa kädessä" },
              { index: 1, text: "Halkeama kypärän visiirissä" },
            ]
          : []
      }
      clocks={SAMPLE_CLOCKS}
      value={draft}
      onChange={setDraft}
      onCreateClock={() => {}}
    />
  );
}

export const TerveHahmo: Story = {
  name: "Täysi 5n20 pooli",
  render: () => <InteractiveTemplate availableDice={5} hasHarmit={false} />,
};

export const VaurioitunutHahmo: Story = {
  name: "Harmien rajoittama (3n20)",
  render: () => <InteractiveTemplate availableDice={3} hasHarmit />,
};
