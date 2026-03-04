import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">
      <Tabs defaultValue="visuals">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="visuals">Visuals</TabsTrigger>
          <TabsTrigger value="equipment" disabled>
            Equipment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Character Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure your character's physiological and mental attributes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Assign skill points and choose your character's proficiencies.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="visuals">
          <Card variant="subtle">
            <CardHeader>
              <CardTitle>Visual Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Here you can configure how your character looks. Notice how the tab visually
                connects to the content area, resembling a classic binder organization system.
              </p>
              <div className="h-24 w-24 bg-[var(--theme-secondary)]/20 border-2 border-[var(--theme-secondary)] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-secondary)]">
                  Avatar
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment">
          <p>This content should not be accessible since the tab is disabled.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <div className="w-full max-w-4xl grid gap-8 bg-background p-8">
      <Card data-theme="inverted" className="p-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Inverted Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Inverted Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Inverted Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Inverted Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Content for Tab 1 in Inverted Theme.
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Content for Tab 2 in Inverted Theme.
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Content for Tab 3 in Inverted Theme.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card data-theme="primary-dark" className="p-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Primary Dark Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tabA">
            <TabsList>
              <TabsTrigger value="tabA">Dark Mode A</TabsTrigger>
              <TabsTrigger value="tabB">Dark Mode B</TabsTrigger>
            </TabsList>
            <TabsContent value="tabA">
              <p className="mt-4 text-lg">
                Primary Dark Theme active. The colors seamlessly adapt.
              </p>
            </TabsContent>
            <TabsContent value="tabB">
              <p className="mt-4 text-lg">Another tab panel for testing.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  ),
};
