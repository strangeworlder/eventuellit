import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

/**
 * The `Card` component is a flexible container for grouping related content and actions.
 * It is built with a subcomponent architecture (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`)
 * to provide maximum flexibility while maintaining consistent spacing and styling.
 *
 * The Card's `variant` prop controls which **semantic pattern** is used:
 * - **`surface`** (default): Solid `--theme-primary` background with inverted text. Matches the "Primary Component" pattern from the design system themes.
 * - **`outline`**: Transparent background with `--theme-secondary` border and text. Matches the "Secondary Component" pattern.
 * - **`highlight`**: Theme background with `--theme-accent` text and a thick bottom accent border. Matches the "Accent Notifier" pattern.
 * - **`subtle`**: Light bordered surface card for non-semantic grouping.
 * - **`callout`**: Left-accented callout block for game mechanics.
 *
 * > **Note:** `Card` is intended for bounded areas of related content (like character stats, rule blocks, or interactive widgets).
 * > It should **not** be used as a primary page or tab layout wrapper. For main layouts, use semantic HTML tags (`<div>`, `<main>`) with a `<HeadingLevelProvider>`.
 */
const meta = {
  title: "Suunnittelujarjestelma/Organismit/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["surface", "outline", "highlight", "subtle", "callout"],
      description: "Semantic visual style variant of the card.",
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
    iconName: {
      control: "select",
      options: [undefined, "sparkles", "dice5", "book", "chevron-left", "chevron-right"],
      description: "Optional icon to render in the CardHeader.",
    },
    iconVariant: {
      control: "select",
      options: ["primary", "secondary", "accent"],
      description: "The color variant for the icon container.",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Card uses the **primary** variant: a solid `--theme-primary` background
 * with inverted text, matching the "Primary Component" pattern from the design system themes.
 */
export const Default: Story = {
  args: {
    className: "w-[350px]",
    variant: "surface",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Character Info</CardTitle>
        <CardDescription>Stats and conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center py-2 border-b border-current/10">
          <span className="font-bold">Strength</span>
          <span>16 (+3)</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-current/10">
          <span className="font-bold">Dexterity</span>
          <span>14 (+2)</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-bold">Constitution</span>
          <span>15 (+2)</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="solid">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * All five semantic visual variants. Each matches a distinct design system pattern:
 * - **Primary**: Solid fill, inverted text — for primary actions and content.
 * - **Secondary**: Outlined, transparent — for secondary/alternative interactions.
 * - **Accent**: Bottom accent border — for highlights, notifications, active states.
 * - **Subtle**: Soft bordered surface — for non-semantic grouping.
 * - **Rule**: Left-accented callout — for game mechanics and rules.
 */
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6 w-full max-w-4xl">
      {(["surface", "outline", "highlight", "subtle", "callout"] as const).map((variant) => (
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
      <Card variant="subtle">
        <CardHeader>
          <CardTitle>Default Padding</CardTitle>
        </CardHeader>
        <CardContent variant="default">
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center">
            Default
          </div>
        </CardContent>
      </Card>

      <Card variant="subtle">
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
 * By using the 'rule' variant on `Card` and `CardContent`, we get a highly stylized block.
 */
export const RuleBlock: Story = {
  render: () => (
    <Card variant="callout" className="max-w-xl">
      <CardHeader>
        <CardTitle>Critical Hits</CardTitle>
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
 * Demonstrates the built-in icon support. Icons automatically scale on hover
 * and adapt their colors based on the `iconVariant` and current theme.
 */
export const Icons: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 w-full max-w-5xl">
      <Card iconName="dice5" iconVariant="primary">
        <CardHeader>
          <CardTitle>Generator</CardTitle>
        </CardHeader>
        <CardContent>Primary themed icon (Dice)</CardContent>
      </Card>

      <Card iconName="book" iconVariant="secondary">
        <CardHeader>
          <CardTitle>Ruleset</CardTitle>
        </CardHeader>
        <CardContent>Secondary themed icon (Book)</CardContent>
      </Card>

      <Card iconName="sparkles" iconVariant="accent">
        <CardHeader>
          <CardTitle>New Features</CardTitle>
        </CardHeader>
        <CardContent>Accent themed icon (Sparkles)</CardContent>
      </Card>
    </div>
  ),
};

/**
 * Cards can be themed via `data-theme` using the `theme` prop.
 * This changes the CSS variables used within the Card, automatically recoloring text, borders, backgrounds, and shadows.
 * Notice how each Card adapts its primary variant to the theme's primary color.
 */
export const Themes: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="grid grid-cols-1 mobile:grid-cols-2 desktop:grid-cols-3 x-wide:grid-cols-4 gap-4 w-full">
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
      ).map((theme, idx) => (
        <Card
          key={theme}
          theme={theme}
          iconName={idx % 2 === 0 ? "dice5" : "book"}
          iconVariant={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "secondary" : "accent"}
        >
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
              <div className="h-2 w-full bg-current/20 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--theme-bg)]" style={{ width: "80%" }} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-current/10 pt-4 mt-2">
            <Button>Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};
