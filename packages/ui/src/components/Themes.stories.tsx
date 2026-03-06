import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Perustat/Teemat",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const themes = [
  { id: "base", name: "Perus" },
  { id: "inverted", name: "Käänteinen" },
  { id: "primary-light", name: "Pääteema Vaalea" },
  { id: "primary-dark", name: "Pääteema Tumma" },
  { id: "secondary-light", name: "Sivuteema Vaalea" },
  { id: "secondary-dark", name: "Sivuteema Tumma" },
  { id: "accent-light", name: "Korostus Vaalea" },
  { id: "accent-dark", name: "Korostus Tumma" },
];

const ThemeShowcase = ({ themeId, themeName }: { themeId: string; themeName: string }) => {
  return (
    <div data-theme={themeId} className="w-full flex">
      {/* The wrapper sets the data-theme attribute, cascading properties down to children */}
      <div
        className="w-full p-8 md:p-16 flex flex-col md:flex-row gap-8 transition-colors duration-200"
        style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}
      >
        {/* Info Block */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold font-heading tracking-tight mb-2">
            {themeName} Esimerkki
          </h2>
          <p className="text-lg opacity-80 max-w-lg mb-8">
            Tämä lohko renderöidään `{themeId}` data-theme-kontekstissa. Muuttujat muodostavat
            dynaamiset etu- ja taustavärien yhdistelmät, jotka täyttävät WCAG 2.1 AA -vaatimukset.
          </p>
          <div className="flex flex-col gap-2 font-mono text-sm opacity-60">
            <span>bg-surface</span>
            <span>text-foreground</span>
          </div>
        </div>

        {/* Example Semantic Components */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Primary semantic */}
          <div
            className="p-6 rounded-xl border border-white/10 shadow-sm flex flex-col gap-3"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            <h3 className="font-heading font-bold text-2xl" style={{ color: "var(--theme-bg)" }}>
              Ensisijainen komponentti
            </h3>
            <p
              className="opacity-90 leading-relaxed"
              style={{ color: "var(--theme-primary-foreground)" }}
            >
              Renderöidään `bg-theme-primary text-surface` -luokilla otsikossa ja
              `text-theme-primary-foreground` -luokalla leipätekstissä. Ensisijainen toimintaväri
              mukautuu taustateeman mukaan, jotta kontrasti säilyy.
            </p>
          </div>

          {/* Secondary semantic */}
          <div
            className="p-6 rounded-xl border shadow-sm flex flex-col gap-3"
            style={{
              borderColor: "var(--theme-secondary)",
              color: "var(--theme-secondary)",
              backgroundColor: "transparent",
            }}
          >
            <h3 className="font-heading font-bold text-2xl">Toissijainen komponentti</h3>
            <p className="opacity-80 leading-relaxed">
              Renderöidään `border-theme-secondary text-theme-secondary` -luokilla. Soveltuu
              vaihtoehtoisiin toimintoihin ja rajauksiin, jotka eivät peitä ensisijaista pintaa.
            </p>
          </div>

          {/* Accent semantic */}
          <div
            className="p-6 rounded-xl shadow-sm flex flex-col gap-3"
            style={{
              backgroundColor: "var(--theme-bg)",
              color: "var(--theme-accent)",
              borderBottom: "4px solid var(--theme-accent)",
            }}
          >
            <h3 className="font-heading font-bold text-2xl flex items-center justify-between">
              <span>Korostusilmaisin</span>
              <Badge variant="accent-solid">
                AKTIIVINEN
              </Badge>
            </h3>
            <p
              className="opacity-80 text-foreground leading-relaxed"
              style={{ color: "var(--theme-text)" }}
            >
              Renderöidään `text-theme-accent border-theme-accent` -luokilla. Sopii aktiivisten
              tilojen ja tärkeiden ilmoitusten korostamiseen komponenttipuussa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <div
        className="p-8 md:p-16 border-b border-white/10"
        style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }}
      >
        <h1 className="text-5xl font-extrabold font-heading mb-4">Kontekstuaaliset teemat</h1>
        <p className="text-xl max-w-3xl opacity-80 leading-relaxed">
          CSS-muuttujien avulla voidaan rakentaa vahvat kontekstirajat `data-theme`-attribuutilla.
          Tunnisteet kuten `bg-surface` tai `text-theme-primary` mukautuvat dynaamisesti, jotta
          komponentit pysyvät selkeinä ja kontrastisina kaikilla ennalta määritellyillä taustoilla.
        </p>
      </div>
      <div className="flex flex-col">
        {themes.map((t) => (
          <ThemeShowcase key={t.id} themeId={t.id} themeName={t.name} />
        ))}
      </div>
    </div>
  ),
};
