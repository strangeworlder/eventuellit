import type { Meta, StoryObj } from "@storybook/react";
import { DicePoolAllocator } from "./DicePoolAllocator";

/**
 * `DicePoolAllocator` is an interactive dice-pool widget for distributing a fixed pool
 * of d20s across named action axes, with an optional attribute die toggle per axis.
 *
 * It follows the **primary component** pattern from the design system: it resolves its
 * displayed `data-theme` via `primaryThemeMap` based on the inherited parent theme context,
 * ensuring accessible contrast on any background without manual colour overrides.
 *
 * The `theme` prop overrides the inherited context before the primary swap is applied —
 * useful when placing the widget inside a layout that doesn't participate in the theme tree.
 */
const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/DicePoolAllocator",
  component: DicePoolAllocator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: [
        undefined,
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
      description: "Theme context to apply. Resolved via primaryThemeMap before rendering.",
    },
    maxDice: { control: "number", description: "Total number of d20s in the pool." },
    attributeDie: {
      control: "select",
      options: [null, "n4", "n6", "n8", "n10", "n12"],
      description: "Optional attribute die toggle shown per axis.",
    },
    availableDiceLabel: {
      control: "text",
      description: "Label shown below the remaining dice counter.",
    },
  },
} satisfies Meta<typeof DicePoolAllocator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default allocation widget with three axes and an attribute die.
 * Notice how the component resolves its own theme via `primaryThemeMap` —
 * on the default (base) background, it swaps to `primary-dark`.
 */
export const Default: Story = {
  args: {
    maxDice: 5,
    axes: ["Nopea", "Äänetön", "Tarkka"],
    attributeDie: "n8",
  },
};

/**
 * Demonstrates the effect of an explicit `theme` prop.
 * The `primary-dark` context causes the allocator to swap to `secondary-light`.
 */
export const CustomTheme: Story = {
  args: {
    maxDice: 4,
    axes: ["Vahva", "Sulava", "Varovainen"],
    attributeDie: "n6",
    theme: "primary-dark",
  },
};

/**
 * Renders the allocator across every theme context to verify the `primaryThemeMap`
 * swap produces accessible colour contrast in all combinations.
 */
export const ThemeShowcase: Story = {
  tags: ["!manifest"],
  args: { maxDice: 3, axes: [] },
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
    ] as const;

    return (
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
        {themes.map((theme) => (
          <div key={theme}>
            <p className="font-bold text-center mb-2">{theme}</p>
            <DicePoolAllocator
              theme={theme}
              maxDice={3}
              axes={["Voima", "Ketteryys"]}
              attributeDie="n4"
            />
          </div>
        ))}
      </div>
    );
  },
};
