import type { Meta, StoryObj } from "@storybook/react";
import { AttributeCard, getScoreBonusFromValue } from "./AttributeCard";
import { Theme } from "./Theme";
import React, { useState } from "react";

const meta: Meta<typeof AttributeCard> = {
    title: "Suunnittelujarjestelma/Organismit/AttributeCard",
    component: AttributeCard,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "accent"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof AttributeCard>;

const InteractiveTemplate = (args: any) => {
    const [fysiikka, setFysiikka] = useState(1);
    const [nopeus, setNopeus] = useState(0);
    const maxDice = 15; // Increased to allow testing upgrades
    const currentTotal = fysiikka + nopeus;

    const subAttributes = [
        {
            name: "fysiikka",
            label: "Fysiikka",
            value: fysiikka,
            onAdd: () => currentTotal < maxDice && setFysiikka(fysiikka + 1),
            onRemove: () => fysiikka > 0 && setFysiikka(fysiikka - 1),
            canAdd: currentTotal < maxDice,
            canRemove: fysiikka > 0,
        },
        {
            name: "nopeus",
            label: "Nopeus",
            value: nopeus,
            onAdd: () => currentTotal < maxDice && setNopeus(nopeus + 1),
            onRemove: () => nopeus > 0 && setNopeus(nopeus - 1),
            canAdd: currentTotal < maxDice,
            canRemove: nopeus > 0,
        },
    ];

    return <AttributeCard {...args} subAttributes={subAttributes} score={8 + getScoreBonusFromValue(fysiikka) + getScoreBonusFromValue(nopeus)} />;
};

export const Default: Story = {
    args: {
        label: "Keho",
        score: 10,
        subAttributes: [
            { name: "fysiikka", label: "Fysiikka", value: 1, canRemove: true, canAdd: true },
            { name: "nopeus", label: "Nopeus", value: 0, canRemove: false, canAdd: true },
        ],
    },
};

export const Primary: Story = {
    args: {
        variant: "primary",
        label: "Keho",
        score: 10,
        subAttributes: [
            { name: "fysiikka", label: "Fysiikka", value: 1, canRemove: true, canAdd: true },
            { name: "nopeus", label: "Nopeus", value: 0, canRemove: false, canAdd: true },
        ],
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        label: "Mieli",
        score: 8,
        subAttributes: [
            { name: "ymmarrys", label: "Ymmärrys", value: 0, canRemove: false, canAdd: true },
            { name: "persoona", label: "Persoona", value: 0, canRemove: false, canAdd: true },
        ],
    },
};

export const Accent: Story = {
    args: {
        variant: "accent",
        label: "Terä",
        score: 12,
        subAttributes: [
            { name: "nakemys", label: "Näkemys", value: 2, canRemove: true, canAdd: false },
            { name: "napparyys", label: "Näppäryys", value: 0, canRemove: false, canAdd: true },
        ],
    },
};

export const Interactive: Story = {
    render: (args) => <InteractiveTemplate {...args} />,
    args: {
        label: "Keho",
    },
};
