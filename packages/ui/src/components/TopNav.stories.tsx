import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { TopNavDropdown, TopNavList, TopNavLink } from "./TopNav";

const meta: Meta<typeof TopNavList> = {
  title: "Suunnittelujarjestelma/Molekyylit/TopNav",
  component: TopNavList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TopNavList>;

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
          Yhdistä TopNavList:n kanssa responsiiviisella näkyvyydellä: TopNavList hidden tablet:flex,
          TopNavDropdown tablet:hidden
        </p>
      </div>
    </MemoryRouter>
  ),
};
