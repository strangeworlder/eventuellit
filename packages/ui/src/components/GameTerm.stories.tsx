import type { Meta, StoryObj } from "@storybook/react";
import { GameTerm } from "./GameTerm";
import { Text } from "./Text";

const meta = {
    title: "Typography/GameTerm",
    component: GameTerm,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "accent", "primary", "label"],
        },
    },
} satisfies Meta<typeof GameTerm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Sisupiste",
    },
    render: (args) => (
        <Text>Heitä yksi {<GameTerm {...args} />} lisää.</Text>
    )
};

export const PrimaryVariant: Story = {
    args: {
        variant: "primary",
        children: "n20",
    },
    render: (args) => (
        <Text>Vahinkoa heitetään yhdellä {<GameTerm {...args} />} nopalla.</Text>
    )
};

export const LabelVariant: Story = {
    args: {
        variant: "label",
        children: "Tyypit:",
    },
    render: (args) => (
        <ul className="list-none space-y-4">
            <li className="flex items-start">
                <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                <div>
                    <GameTerm {...args} />
                    <span className="text-lg ml-2 text-[var(--theme-text)]">
                        Sotilas tai Ekspertti.
                    </span>
                </div>
            </li>
        </ul>
    )
};
