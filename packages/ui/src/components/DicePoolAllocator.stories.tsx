import type { Meta, StoryObj } from "@storybook/react";
import { DicePoolAllocator } from "./DicePoolAllocator";

const meta = {
    title: "Components/DicePoolAllocator",
    component: DicePoolAllocator,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        theme: {
            control: "select",
            options: [
                "base",
                "inverted",
                "primary-light",
                "primary-dark",
                "secondary-light",
                "secondary-dark",
                "accent-light",
                "accent-dark",
            ],
        },
        maxDice: { control: "number" },
        attributeDie: {
            control: "select",
            options: [null, "n4", "n6", "n8", "n10", "n12"],
        },
    },
} satisfies Meta<typeof DicePoolAllocator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        maxDice: 5,
        axes: ["Nopea", "Äänetön", "Tarkka"],
        attributeDie: "n8",
    },
};

export const CustomTheme: Story = {
    args: {
        maxDice: 4,
        axes: ["Vahva", "Sulava", "Varovainen"],
        attributeDie: "n6",
        theme: "primary-dark",
    },
};

export const ThemeShowcase: Story = {
    render: () => {
        const themes = [
            "base",
            "inverted",
            "primary-light",
            "primary-dark",
            "secondary-light",
            "secondary-dark",
            "accent-light",
            "accent-dark",
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {themes.map((theme) => (
                    <div key={theme}>
                        <p className="font-bold text-center mb-2">{theme}</p>
                        <DicePoolAllocator
                            theme={theme as any}
                            maxDice={3}
                            axes={["Voima", "Ketteruus"]}
                            attributeDie="n4"
                        />
                    </div>
                ))}
            </div>
        );
    },
};
