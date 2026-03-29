import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { ThemeContext, type Theme, primaryThemeMap } from "./Theme";
import "../styles.css";

const themeValues: Theme[] = [
  "base",
  "inverted",
  "primary-light",
  "primary-dark",
  "secondary-light",
  "secondary-dark",
  "accent-light",
  "accent-dark",
];

const meta = {
  title: "Suunnittelujarjestelma/Perustat/Theme",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Teemakartta: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
      {themeValues.map((theme) => (
        <ThemeContext.Provider key={theme} value={theme}>
          <Card theme={theme} variant="surface">
            <CardHeader>
              <CardTitle>{theme}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Tama kortti nayttaa, milta sisalto nayttaa teemakontekstissa
                <span className="font-bold"> {theme}</span>.
              </p>
            </CardContent>
          </Card>
        </ThemeContext.Provider>
      ))}
    </div>
  ),
};

export const PrimaryVaihto: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
      {themeValues.map((theme) => (
        <div key={theme} className="rounded-lg border border-[var(--theme-primary)]/20 p-4">
          <p className="text-sm mb-3">
            Vanhemman teema: <span className="font-bold">{theme}</span>
          </p>
          <ThemeContext.Provider value={theme}>
            <Card variant="surface">
              <CardHeader>
                <CardTitle>Primary-vaihto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  primaryThemeMap tulos: <span className="font-bold">{primaryThemeMap[theme]}</span>
                </p>
              </CardContent>
            </Card>
          </ThemeContext.Provider>
        </div>
      ))}
    </div>
  ),
};
