import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EnduranceBlock } from "./EnduranceBlock";

/**
 * `EnduranceBlock` näyttää Keston (Keho, Mieli, Terä) ja sen kaksi
 * ominaisuutta passiivisilla noppaikoneilla. Kesto-arvo on interaktiivinen,
 * nopat puhtaasti visuaalisia.
 */
const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/EnduranceBlock",
  component: EnduranceBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number" },
    maxValue: { control: "number" },
  },
} satisfies Meta<typeof EnduranceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const Interactive = (props: any) => {
  const [value, setValue] = useState(props.value ?? 10);
  return (
    <EnduranceBlock
      {...props}
      value={value}
      onIncrement={() => setValue((v: number) => v + 1)}
      onDecrement={() => setValue((v: number) => v - 1)}
    />
  );
};

/**
 * Keho oletustilassa — Fysiikka ja Nopeus kumpikin 1 noppa-allokaatio.
 */
export const Oletustila: Story = {
  render: (args) => <Interactive {...args} />,
  args: {
    label: "Keho",
    value: 10,
    maxValue: 12,
    subAttributes: [
      { label: "Fysiikka", diceValue: 1 },
      { label: "Nopeus", diceValue: 1 },
    ],
  },
};

/**
 * Täysi pooli — molemmat ominaisuudet saaneet 3 noppa-allokaatiota.
 */
export const TaysiPooli: Story = {
  render: (args) => <Interactive {...args} />,
  args: {
    label: "Mieli",
    value: 14,
    maxValue: 14,
    subAttributes: [
      { label: "Ymmärrys", diceValue: 3 },
      { label: "Persoona", diceValue: 3 },
    ],
  },
};

/**
 * Ei noppia — molemmat ominaisuudet ilman allokaatiota.
 */
export const EiNoppia: Story = {
  render: (args) => <Interactive {...args} />,
  args: {
    label: "Terä",
    value: 8,
    maxValue: 8,
    subAttributes: [
      { label: "Näkemys", diceValue: 0 },
      { label: "Näppäryys", diceValue: 0 },
    ],
  },
};

/**
 * Vain luku -tila ilman kontrolleja.
 */
export const VainLuku: Story = {
  args: {
    label: "Keho",
    value: 9,
    maxValue: 12,
    subAttributes: [
      { label: "Fysiikka", diceValue: 2 },
      { label: "Nopeus", diceValue: 0 },
    ],
  },
};

/**
 * Kaikki kolme Kestoa vierekkäin.
 */
export const KaikkiKestot: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4" style={{ width: "900px" }}>
      <Interactive
        label="Keho"
        value={10}
        maxValue={12}
        subAttributes={[
          { label: "Fysiikka", diceValue: 1 },
          { label: "Nopeus", diceValue: 1 },
        ]}
      />
      <Interactive
        label="Mieli"
        value={8}
        maxValue={10}
        subAttributes={[
          { label: "Ymmärrys", diceValue: 0 },
          { label: "Persoona", diceValue: 1 },
        ]}
      />
      <Interactive
        label="Terä"
        value={11}
        maxValue={12}
        subAttributes={[
          { label: "Näkemys", diceValue: 2 },
          { label: "Näppäryys", diceValue: 0 },
        ]}
      />
    </div>
  ),
  args: {
    label: "Kestot",
    value: 10,
    subAttributes: [],
  },
};
