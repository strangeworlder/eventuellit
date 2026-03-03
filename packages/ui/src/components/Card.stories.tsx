import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Retro Space Opera themed mock Card representing a TTRPG character sheet snippet
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Keho (Sisu)</CardTitle>
        <CardDescription>Ominaisuudet ja vauriot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium">Kesto: 4 / 5</span>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary">Peruuta</Button>
        <Button>Paranna</Button>
      </CardFooter>
    </Card>
  ),
};

export const Themed: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 max-w-5xl">
      {(["base", "inverted", "primary-light", "primary-dark", "secondary-light", "secondary-dark", "accent-light", "accent-dark"] as const).map(theme => (
        <Card key={theme} theme={theme} className="w-[350px]">
          <CardHeader>
            <CardTitle>{theme} Theme</CardTitle>
            <CardDescription>Ominaisuudet ja vauriot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm font-medium">Kesto: 4 / 5</span>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="secondary">Peruuta</Button>
            <Button>Paranna</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};
