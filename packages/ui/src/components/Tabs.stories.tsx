import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Tabs, TabsContent, TabsList, TabsLink, TabsTrigger } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Suunnittelujarjestelma/Molekyylit/Tabs",
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
          <TabsTrigger value="stats">Ominaisuudet</TabsTrigger>
          <TabsTrigger value="skills">Taidot</TabsTrigger>
          <TabsTrigger value="visuals">Ulkoasu</TabsTrigger>
          <TabsTrigger value="equipment" disabled>
            Varusteet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Hahmon ominaisuudet</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Määritä hahmon fyysiset ja henkiset ominaisuudet täällä.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Taidot ja kyvyt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Jaa taitopisteet ja valitse hahmon osaamiset.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="visuals">
          <Card variant="subtle">
            <CardHeader>
              <CardTitle>Ulkoasun tiedot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Tässä voit määrittää, miltä hahmosi näyttää. Välilehti yhdistyy visuaalisesti
                sisältöalueeseen klassisen mapin tyyliin.
              </p>
              <div className="h-24 w-24 bg-[var(--theme-secondary)]/20 border-2 border-[var(--theme-secondary)] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold uppercase tracking-widest text-[var(--theme-secondary)]">
                  Muotokuva
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment">
          <p>Tämän sisällön ei pidä olla käytettävissä, koska välilehti on poistettu käytöstä.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const NavigointiLinkit: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/hahmot"]}>
      <div className="w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">
        <TabsList>
          <TabsLink to="/hahmot">Hahmot</TabsLink>
          <TabsLink to="/episodit">Episodit</TabsLink>
          <TabsLink to="/maailma">Maailma</TabsLink>
        </TabsList>
        <Routes>
          <Route
            path="/hahmot"
            element={
              <Card className="mt-0 rounded-t-none">
                <CardHeader>
                  <CardTitle>Hahmoluettelo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Kaikki kampanjan hahmot listattuna tässä paneelissa.</p>
                </CardContent>
              </Card>
            }
          />
          <Route
            path="/episodit"
            element={
              <Card className="mt-0 rounded-t-none">
                <CardHeader>
                  <CardTitle>Episodit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Kampanjan episodien yhteenveto ja tapahtumat.</p>
                </CardContent>
              </Card>
            }
          />
          <Route
            path="/maailma"
            element={
              <Card className="mt-0 rounded-t-none">
                <CardHeader>
                  <CardTitle>Maailmankuva</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Asemien kartta ja lorekirjasto.</p>
                </CardContent>
              </Card>
            }
          />
        </Routes>
      </div>
    </MemoryRouter>
  ),
};

export const Themed: Story = {
  render: () => (
    <div className="w-full max-w-4xl grid gap-8 bg-background p-8">
      <Card data-theme="inverted" className="p-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Käänteinen teema</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Käänteinen välilehti 1</TabsTrigger>
              <TabsTrigger value="tab2">Käänteinen välilehti 2</TabsTrigger>
              <TabsTrigger value="tab3">Käänteinen välilehti 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 1.
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 2.
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 3.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card data-theme="primary-dark" className="p-8 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Tumma pääteema</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tabA">
            <TabsList>
              <TabsTrigger value="tabA">Tumma tila A</TabsTrigger>
              <TabsTrigger value="tabB">Tumma tila B</TabsTrigger>
            </TabsList>
            <TabsContent value="tabA">
              <p className="mt-4 text-lg">
                Tumma pääteema on aktiivinen. Värit mukautuvat saumattomasti.
              </p>
            </TabsContent>
            <TabsContent value="tabB">
              <p className="mt-4 text-lg">Toinen testivälilehden sisältöpaneeli.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  ),
};
