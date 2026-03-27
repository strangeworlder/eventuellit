import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { TopNav, TopNavContent, TopNavDropdown, TopNavList, TopNavLink, TopNavTrigger } from "./TopNav";

const meta: Meta<typeof TopNav> = {
  title: "Suunnittelujarjestelma/Molekyylit/TopNav",
  component: TopNav,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TopNav>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">
      <TopNav defaultValue="visuals">
        <TopNavList>
          <TopNavTrigger value="stats">Ominaisuudet</TopNavTrigger>
          <TopNavTrigger value="skills">Taidot</TopNavTrigger>
          <TopNavTrigger value="visuals">Ulkoasu</TopNavTrigger>
          <TopNavTrigger value="equipment" disabled>
            Varusteet
          </TopNavTrigger>
        </TopNavList>
        <TopNavContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Hahmon ominaisuudet</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Määritä hahmon fyysiset ja henkiset ominaisuudet täällä.</p>
            </CardContent>
          </Card>
        </TopNavContent>
        <TopNavContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Taidot ja kyvyt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Jaa taitopisteet ja valitse hahmon osaamiset.</p>
            </CardContent>
          </Card>
        </TopNavContent>
        <TopNavContent value="visuals">
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
        </TopNavContent>
        <TopNavContent value="equipment">
          <p>Tämän sisällön ei pidä olla käytettävissä, koska välilehti on poistettu käytöstä.</p>
        </TopNavContent>
      </TopNav>
    </div>
  ),
};

export const NavigointiLinkit: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/hahmot"]}>
      <div className="w-full max-w-2xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">
        <TopNavList>
          <TopNavLink to="/hahmot">Hahmot</TopNavLink>
          <TopNavLink to="/episodit">Episodit</TopNavLink>
          <TopNavLink to="/maailma">Maailma</TopNavLink>
        </TopNavList>
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

/**
 * Demonstrates a `TopNavLink variant="parent"` as the first item.
 * It uses the primary color and non-uppercase styling to signal hierarchy,
 * while staying visually integrated with the rest of the nav bar.
 * A thin separator divides it from the content items.
 */
export const WithParentLink: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/world/kynnys/seula"]}>
      <div className="w-full max-w-3xl bg-[var(--theme-bg)] text-[var(--theme-text)] p-8">
        <TopNavList>
          <TopNavLink variant="parent" to="/world">
            Maailma
          </TopNavLink>
          <TopNavLink to="/world/kynnys/seula">Seula</TopNavLink>
          <TopNavLink to="/world/kynnys/syke">Syke</TopNavLink>
          <TopNavLink to="/world/kynnys/verso">Verso</TopNavLink>
          <TopNavLink to="/world/kynnys/pesa">Pesä</TopNavLink>
        </TopNavList>
        <div className="mt-4 p-4 border border-[var(--theme-border-soft)] rounded-sm text-text-muted text-sm">
          Nykyinen sivu: Seula — ylöspäin navigointi vie takaisin Maailma-hubiin.
        </div>
      </div>
    </MemoryRouter>
  ),
};

/**
 * The `TopNavDropdown` renders a styled select element for mobile viewports.
 * Use alongside `TopNavList` with responsive visibility classes:
 * `TopNavList className="hidden tablet:flex"` and `TopNavDropdown className="tablet:hidden"`.
 */
export const MobileDropdown: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/world/kynnys/seula"]}>
      <div className="w-full max-w-sm bg-[var(--theme-bg)] text-[var(--theme-text)] p-8 space-y-4">
        <p className="text-text-muted text-sm">Mobiilinavigaatio (alle 700px):</p>
        <TopNavDropdown
          currentId="seula"
          items={[
            { id: "seula", label: "Seula", to: "/world/kynnys/seula" },
            { id: "syke", label: "Syke", to: "/world/kynnys/syke" },
            { id: "verso", label: "Verso", to: "/world/kynnys/verso" },
            { id: "pesa", label: "Pesä", to: "/world/kynnys/pesa" },
            { id: "alasin", label: "Alasin", to: "/world/kynnys/alasin" },
          ]}
        />
        <p className="text-text-subtle text-xs">
          Yhdistä TopNavList:n kanssa responsiiviisella näkyvyydellä: TopNavList hidden
          tablet:flex, TopNavDropdown tablet:hidden
        </p>
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
          <TopNav defaultValue="tab1">
            <TopNavList>
              <TopNavTrigger value="tab1">Käänteinen 1</TopNavTrigger>
              <TopNavTrigger value="tab2">Käänteinen 2</TopNavTrigger>
              <TopNavTrigger value="tab3">Käänteinen 3</TopNavTrigger>
            </TopNavList>
            <TopNavContent value="tab1">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 1.
              </div>
            </TopNavContent>
            <TopNavContent value="tab2">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 2.
              </div>
            </TopNavContent>
            <TopNavContent value="tab3">
              <div className="p-6 bg-[var(--theme-primary)]/10 rounded-b-lg border-2 border-t-0 border-[var(--theme-primary)]">
                Sisältö käänteisen teeman välilehdelle 3.
              </div>
            </TopNavContent>
          </TopNav>
        </CardContent>
      </Card>
    </div>
  ),
};
