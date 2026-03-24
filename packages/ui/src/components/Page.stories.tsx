import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Page } from "./Page";

const meta: Meta<typeof Page> = {
  title: "Suunnittelujarjestelma/Sivupohjat/Page",
  component: Page,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-text flex flex-col justify-start">
      <div className="w-full h-16 border-b border-primary/20 bg-background/50 flex items-center px-4 mb-4">
        Header Navigation Simulation
      </div>
      <Page>
        <div className="flex flex-col space-y-4">
          <div className="border-b border-primary/20 pb-2">
            <h2 className="text-2xl font-bold font-sans">Welcome to the Page Component</h2>
          </div>
          <p className="text-text/90 leading-relaxed max-w-3xl">
            This component enforces a minimum width of 95vw, maximum width of 1280px, and 100%
            relative width with consistent padding. It's designed to live snugly within TabsContent
            containers across the different microfrontends.
          </p>
        </div>
      </Page>
    </div>
  ),
};

export const WithStackedContent: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-text">
      <Page>
        <Card variant="primary">
          <CardHeader>
            <CardTitle>Top Section</CardTitle>
          </CardHeader>
          <CardContent>Important introductory info.</CardContent>
        </Card>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
          <Card variant="subtle">
            <CardContent className="h-48 flex items-center justify-center">Grid Item 1</CardContent>
          </Card>
          <Card variant="subtle">
            <CardContent className="h-48 flex items-center justify-center">Grid Item 2</CardContent>
          </Card>
          <Card variant="subtle">
            <CardContent className="h-48 flex items-center justify-center">Grid Item 3</CardContent>
          </Card>
        </div>
      </Page>
    </div>
  ),
};
