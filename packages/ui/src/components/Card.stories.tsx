import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

/**
 * The `Card` component is a flexible container for grouping related content and actions.
 * It is built with a subcomponent architecture (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`)
 * to provide maximum flexibility while maintaining consistent spacing and styling.
 *
 * Supports different visual variants and integrates perfectly with the design system's CSS variable-based theming.
 */
const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "subtle", "rule"],
      description: "Visual style variant of the main card container.",
    },
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
      description: "Theme context to apply to the card and all nested subcomponents.",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The standard Card configuration used for most content blocks.
 */
export const Default: Story = {
  args: {
    className: "w-[350px]",
    variant: "default",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Character Info</CardTitle>
        <CardDescription>Stats and conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center py-2 border-b border-[var(--theme-primary)]/10">
          <span className="font-bold">Strength</span>
          <span>16 (+3)</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-[var(--theme-primary)]/10">
          <span className="font-bold">Dexterity</span>
          <span>14 (+2)</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-bold">Constitution</span>
          <span>15 (+2)</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Different visual variants for the Card container.
 * - `default`: Standard bordered look.
 * - `success`: Glowing highlight for positive outcomes.
 * - `subtle`: Lighter borders, softer shadow.
 * - `rule`: Left accentuated border, typical for callouts or rule blocks.
 */
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {(["default", "success", "subtle", "rule"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle className="capitalize">{variant} Variant</CardTitle>
          </CardHeader>
          <CardContent>
            This card uses the <strong>{variant}</strong> variant styling.
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

/**
 * Demonstrates the different density options available for `CardContent`.
 */
export const ContentDensity: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px]">
      <Card>
        <CardHeader>
          <CardTitle>Default Padding</CardTitle>
        </CardHeader>
        <CardContent variant="default">
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center">
            Default
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dense Padding</CardTitle>
        </CardHeader>
        <CardContent variant="dense">
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center">
            Dense
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * The 'rule' variant is specifically tailored for presenting game mechanics or important callouts.
 * By using the 'rule' variant on `Card`, `CardTitle` and `CardContent`, we get a highly stylized block.
 */
export const RuleBlock: Story = {
  render: () => (
    <Card variant="rule" className="max-w-xl">
      <CardHeader>
        <CardTitle variant="rule">Critical Hits</CardTitle>
      </CardHeader>
      <CardContent variant="rule">
        When you score a critical hit, you get to roll extra dice for the attack's damage against
        the target. Roll all of the attack's damage dice twice and add them together. Then add any
        relevant modifiers as normal.
        <br />
        <br />
        To score a critical hit, you must roll a natural 20 on your attack roll.
      </CardContent>
    </Card>
  ),
};

/**
 * Cards can be themed via `data-theme` using the `theme` prop.
 * This changes the CSS variables used within the Card, automatically recoloring text, borders, backgrounds, and shadows.
 */
export const Themes: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {(
        [
          "base",
          "inverted",
          "primary-light",
          "primary-dark",
          "secondary-light",
          "secondary-dark",
          "accent-light",
          "accent-dark",
        ] as const
      ).map((theme) => (
        <Card key={theme} theme={theme}>
          <CardHeader>
            <CardTitle>{theme}</CardTitle>
            <CardDescription>Theme Example</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-bold">80%</span>
              </div>
              <div className="h-2 w-full bg-[var(--theme-text)]/20 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--theme-primary)]" style={{ width: "80%" }} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[var(--theme-primary)]/10 pt-4 mt-2">
            <Button>Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};
