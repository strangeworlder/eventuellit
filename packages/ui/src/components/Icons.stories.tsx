import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DiceIcon } from "./DiceIcon";
import { Icon, icons } from "./Icon";
import "../styles.css";

/**
 * Kuvakejärjestelmä tarjoaa yhtenäisen visuaalisen kielen toiminnoille,
 * navigoinnille ja pelimekaniikalle. Yleiskäyttöiset kuvakkeet pohjautuvat
 * Lucide React -kirjastoon ja erikoistuneet pelikuvakkeet DiceIcon-komponenttiin.
 */
const meta = {
  title: "Suunnittelujarjestelma/Perustat/Icons",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const kuvakekuvaukset: Record<string, string> = {
  "alert-triangle": "Varoitus tai tärkeä huomio — käytä kriittisissä tilanteissa.",
  download: "Lataa tiedosto tai resurssi laitteelle.",
  "heart-pulse": "Elintoiminnot, hahmon kestävyys tai elinvoima.",
  "shield-alert": "Suojaukseen liittyvä varoitus tai puolustusvirhe.",
  sparkles: "Taika, erikoisteho tai hahmon kehittyminen.",
  dice5: "Pelimekaniikka, satunnaisheitto tai onnekkuus.",
  book: "Säännöt, lore, päiväkirjamerkinnät tai varasto.",
  "chevron-left": "Navigoi taaksepäin tai edelliseen kohteeseen.",
  "chevron-right": "Navigoi eteenpäin tai seuraavaan kohteeseen.",
  globe: "Maailmankartta, ulkoinen linkki tai alue.",
  loader2: "Lataus käynnissä — animoitu kehä.",
  "log-in": "Kirjaudu sisään tai siirry sovellukseen.",
  "log-out": "Kirjaudu ulos tai poistu sovelluksesta.",
  map: "Karttanäkymä, asemapohja tai navigointikartta.",
  menu: "Avaa sivupalkki tai navigointivalikko.",
  minus: "Vähennä arvoa, poista kohde tai negatiivinen muuttuja.",
  plus: "Lisää arvoa, lisää kohde tai positiivinen muuttuja.",
  settings: "Asetukset, konfigurointi tai käyttäjäprofiili.",
  shield: "Puolustus, suoja tai kampanjan turvakäytännöt.",
  "trash-2": "Poista kohde tai tyhjennä kenttä.",
  "user-circle": "Käyttäjäprofiili, hahmo tai pelaajan tunnus.",
  x: "Sulje paneeli, peruuta toiminto tai poista merkintä.",
  zap: "Energia, nopeus, pikakäsky tai sähköinen efekti.",
};

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <div
        className="p-8 tablet:p-16 border-b border-white/10"
        style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }}
      >
        <h1 className="text-5xl font-extrabold font-heading mb-4">Kuvakkeet</h1>
        <p className="text-xl max-w-3xl opacity-80 leading-relaxed">
          Kuvakkeisto perustuu Lucide React -kirjastoon ja noudattaa puhdasta, geometrista
          estetiikkaa. Käytä kuvakkeita antamaan visuaalisia vihjeitä ja parantamaan
          käyttöliittymää.
        </p>
      </div>

      <div className="p-8 tablet:p-16 flex flex-col gap-20">
        {/* Yleiset käyttöliittymäkuvakkeet */}
        <section>
          <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">
            <h2 className="text-3xl font-heading font-black">Yleiset käyttöliittymäkuvakkeet</h2>
            <p className="opacity-60">Vakiokuvakkeet navigointiin ja ohjaukseen.</p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 x-wide:grid-cols-4 gap-6">
            {Object.keys(icons).map((name) => (
              <div
                key={name}
                className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-xl bg-accent-500/10 text-accent-400 group-hover:scale-110 transition-transform">
                    <Icon name={name as keyof typeof icons} size={32} />
                  </div>
                  <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">
                    {name}
                  </code>
                </div>

                <h3 className="text-lg font-heading font-bold mb-2 capitalize">
                  {name.replace(/-/g, " ")}
                </h3>

                <p className="text-sm opacity-70 leading-snug min-h-[3rem]">
                  {kuvakekuvaukset[name] ?? "Kuvaus puuttuu."}
                </p>

                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider opacity-40">Käyttö</span>
                    <code className="text-[11px] bg-black/20 px-2 py-1 rounded">
                      {`<Icon name="${name}" />`}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Erikoistuneet pelikuvakkeet */}
        <section>
          <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">
            <h2 className="text-3xl font-heading font-black">Erikoistuneet pelikuvakkeet</h2>
            <p className="opacity-60">Pelimekaniikkaan tarkoitetut komponentit.</p>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 x-wide:grid-cols-4 gap-6">
            {([4, 6, 8, 10, 12, 20, "swirl"] as const).map((faces) => (
              <div
                key={faces}
                className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary-500/50 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-400 group-hover:scale-110 transition-transform">
                    <DiceIcon faces={faces} size="lg" />
                  </div>
                  <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">
                    {faces === "swirl" ? "swirl" : `d${faces}`}
                  </code>
                </div>

                <h3 className="text-lg font-heading font-bold mb-2">
                  {faces === "swirl" ? "Pyörre" : `D${faces}-noppa`}
                </h3>

                <p className="text-sm opacity-70 leading-snug">
                  {faces === "swirl"
                    ? "Pyörre-kuvake erikoistoiminnoille ja erityistilanteille."
                    : `Visuaalinen esitys ${faces}-sivuisesta nopasta. Käytetään noppapooleissa ja heittojen tuloksissa.`}
                </p>

                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider opacity-40">Käyttö</span>
                    <code className="text-[11px] bg-black/20 px-2 py-1 rounded">
                      {`<DiceIcon faces={${JSON.stringify(faces)}} />`}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tekninen toteutus */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-white/10">
          <h2 className="text-2xl font-heading font-bold mb-4 italic">
            Uusien kuvakkeiden lisääminen
          </h2>
          <p className="opacity-80 mb-6">
            Lisää uusi kuvake tuomalla se <code className="text-accent-300">lucide-react</code>
            -kirjastosta <code className="text-accent-300">Icon.tsx</code>-tiedostoon ja lisäämällä
            se <code className="text-accent-300">icons</code>-objektiin.
          </p>
          <div className="bg-black/40 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-blue-300">
              {`// packages/ui/src/components/Icon.tsx
export const icons = {
  // ... olemassa olevat kuvakkeet
  "uusi-kuvake": UusiLucideKuvake,
} as const;`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  ),
};
