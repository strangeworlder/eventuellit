import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Separator } from "./Separator";
import { Text } from "./Text";

const meta = {
    title: "Suunnittelujarjestelma/Atomit/Separator",
    component: Separator,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["soft", "medium", "strong"],
        },
        orientation: {
            control: "select",
            options: ["horizontal", "vertical"],
        },
        decorative: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pehmeä: Story = {
    args: {
        variant: "soft",
    },
    render: (args) => (
        <div className="max-w-md space-y-4">
            <Text>Ensimmäinen osio — perusteelliset säännöt.</Text>
            <Separator {...args} />
            <Text>Toinen osio — lisäsäännöt ja poikkeukset.</Text>
        </div>
    ),
};

export const Keski: Story = {
    args: {
        variant: "medium",
    },
    render: (args) => (
        <div className="max-w-md space-y-4">
            <Text>Hahmon ominaisuudet</Text>
            <Separator {...args} />
            <Text>Hahmon varusteet</Text>
        </div>
    ),
};

export const Vahva: Story = {
    args: {
        variant: "strong",
    },
    render: (args) => (
        <div className="max-w-md space-y-4">
            <Text variant="bold">Luku 1: Maailma</Text>
            <Separator {...args} />
            <Text variant="bold">Luku 2: Hahmot</Text>
        </div>
    ),
};

export const Pystysuora: Story = {
    render: () => (
        <div className="flex items-center gap-4 h-12">
            <Text variant="small">Hahmo</Text>
            <Separator orientation="vertical" variant="medium" />
            <Text variant="small">Varusteet</Text>
            <Separator orientation="vertical" variant="medium" />
            <Text variant="small">Historia</Text>
        </div>
    ),
};

export const KaikkiVariantit: Story = {
    tags: ["!manifest"],
    render: () => (
        <div className="max-w-md space-y-8">
            <div className="space-y-3">
                <Text variant="label">Pehmeä</Text>
                <Separator variant="soft" />
                <Text variant="caption">Hienovarainen erottaja samankaltaisten osioiden välillä.</Text>
            </div>
            <div className="space-y-3">
                <Text variant="label">Keski</Text>
                <Separator variant="medium" />
                <Text variant="caption">Selkeämpi jako eri sisältöalueiden välillä.</Text>
            </div>
            <div className="space-y-3">
                <Text variant="label">Vahva</Text>
                <Separator variant="strong" />
                <Text variant="caption">Korostava erottaja päälohkojen tai lukujen välissä.</Text>
            </div>
        </div>
    ),
};
