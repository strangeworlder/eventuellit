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
 * - **`outline`**: Light bordered surface card with soft border and shadow. For non-semantic grouping.
 * - **`highlight`**: Theme background with `--theme-accent` text and a thick bottom accent border. Matches the "Accent Notifier" pattern.
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
            options: ["surface", "outline", "highlight", "interactive", "callout"],
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
        <CardTitle>Hahmon tiedot</CardTitle>
        <CardDescription>Ominaisuudet ja tila</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center py-2 border-b border-current/10">
          <span className="font-bold">Voima</span>
          <span>16 (+3)</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-current/10">
          <span className="font-bold">Ketteryys</span>
          <span>14 (+2)</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-bold">Kestävyys</span>
          <span>15 (+2)</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Peruuta</Button>
        <Button variant="solid">Tallenna</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * All semantic visual variants. Each matches a distinct design system pattern:
 * - **Primary**: Solid fill, inverted text — for primary actions and content.
 * - **Outline**: Soft bordered surface — for non-semantic grouping.
 * - **Accent**: Bottom accent border — for highlights, notifications, active states.
 * - **Rule**: Left-accented callout — for game mechanics and rules.
 */
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6 w-full max-w-4xl">
      {(["surface", "outline", "highlight", "interactive", "callout"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
          </CardHeader>
          <CardContent>
            Tämä kortti käyttää <strong>{variant}</strong>-varianttia.
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

/**
 * Interaktiivinen kortti reagoi hover- ja klikkaustilaan kohoamalla ja hehkumalla.
 * Käytä tätä varianttia navigoitavissa sisältökorteissa, kuten asemalistauksissa.
 */
export const Interaktiivinen: Story = {
  render: () => (
    <div className="grid grid-cols-1 mobile:grid-cols-2 gap-4 max-w-xl">
      <Card variant="interactive" className="cursor-pointer">
        <CardHeader>
          <CardTitle>Seula</CardTitle>
          <CardDescription>Järjestys 1 — Matala jännite</CardDescription>
        </CardHeader>
        <CardContent>
          Kynnyksen kauppasatama ja solmupiste. Vie hiiri päälle.
        </CardContent>
      </Card>
      <Card variant="interactive" className="cursor-pointer">
        <CardHeader>
          <CardTitle>Kuiskaus</CardTitle>
          <CardDescription>Järjestys 10 — Murtunut</CardDescription>
        </CardHeader>
        <CardContent>
          Informaatioverkostojen solmukohta — kaikki kulkee tästä.
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Demonstrates the different density options available for `CardContent`.
 */
export const ContentDensity: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px]">
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Oletusvälitys</CardTitle>
        </CardHeader>
        <CardContent variant="default">
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center text-sm font-semibold">
            Oletus
          </div>
        </CardContent>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle>Tiivis välitys</CardTitle>
        </CardHeader>
        <CardContent variant="dense">
          <div className="bg-[var(--theme-primary)]/10 h-16 w-full rounded flex items-center justify-center text-sm font-semibold">
            Tiivis
          </div>
        </CardContent>
      </Card>

      <Card variant="callout">
        <CardContent variant="rule">
          <strong>Sääntö:</strong> CardContent-variantti <code>rule</code> soveltuu peli&shy;mekaniikan
          korostuksiin — tiheämpi sisäinen välitys, kapiteeli-kirjasintyyli.
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
        <CardTitle>Kriittinen osuma</CardTitle>
      </CardHeader>
      <CardContent variant="rule">
        Kun teet kriittisen osuman, heität hyökkäyksesi vahinkopisteet kahdesti ja lasket ne yhteen.
        Lisää tähän normaalit modifikaattorit.
        <br />
        <br />
        Kriittinen osuma syntyy, kun hyökkäysheiton tulos on luonnollinen 20.
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
          <CardTitle>Hahmopaja</CardTitle>
        </CardHeader>
        <CardContent>Ensisijainen kuvake (noppa)</CardContent>
      </Card>

      <Card iconName="book" iconVariant="secondary">
        <CardHeader>
          <CardTitle>Sääntökirja</CardTitle>
        </CardHeader>
        <CardContent>Toissijainen kuvake (kirja)</CardContent>
      </Card>

      <Card iconName="sparkles" iconVariant="accent">
        <CardHeader>
          <CardTitle>Uudet ominaisuudet</CardTitle>
        </CardHeader>
        <CardContent>Korostuskuvake (kipinät)</CardContent>
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
