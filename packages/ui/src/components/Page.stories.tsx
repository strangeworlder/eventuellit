import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Hero } from "./Hero";
import { Page, PageBody } from "./Page";

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
        <Hero title="Sivun otsikko" description="Lyhyt kuvaus sivun sisällöstä." />
        <PageBody>
          <p className="text-text/90 leading-relaxed max-w-3xl">
            This component enforces a minimum width of 95vw, maximum width of 1280px, and 100%
            relative width with consistent padding. It's designed to live snugly within TabsContent
            containers across the different microfrontends.
          </p>
        </PageBody>
      </Page>
    </div>
  ),
};

export const WithHeroAndBody: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-text">
      <Page>
        <Hero
          title="Maailman Historiaa"
          description="Tutki kampanjan maailmaa, sijainteja ja hahmoja."
        />
        <PageBody>
          <HeadingLevelProvider>
            <section className="space-y-4">
              <Heading>Ensimmäinen osio</Heading>
              <p className="text-text/80 leading-relaxed">
                PageBody huolehtii vaakasuuntaisesta täytteestä, pystysuuntaisesta tilasta
                osioiden välillä ja sisääntuloanimaatiosta automaattisesti.
              </p>
            </section>

            <section className="space-y-4">
              <Heading>Toinen osio</Heading>
              <p className="text-text/80 leading-relaxed">
                Ei tarvita manuaalista px-4, space-y-8 tai animate-in fade-in -luokkia.
                PageBody tarjoaa ne kaikki valmiina.
              </p>
            </section>
          </HeadingLevelProvider>
        </PageBody>
      </Page>
    </div>
  ),
};

export const WithStackedContent: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-text">
      <Page>
        <Hero title="Korttinäkymä" />
        <PageBody>
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
        </PageBody>
      </Page>
    </div>
  ),
};
