import type { Meta, StoryObj } from "@storybook/react";
import { AspectTag } from "./AspectTag";
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { CardStack } from "./CardStack";
import { DiceIcon } from "./DiceIcon";

/**
 * `CardStack` on organismi, joka pinoaa useampia kortteja fyysiseksi korttipakaksi.
 * Se näyttää päällimmäisen kortin takana hienovaraisia porrastettuja taustakerroksia
 * ja tarjoaa sujuvan "siirrä pohjalle" -animaation pakkaa selattaessa.
 *
 * ### Ominaisuudet:
 * - **1 kortti:** Toimii tavanomaisena yksittäiskorttina ilman ohjaimia tai pinoefektiä.
 * - **2–3 korttia:** Näyttää 1 tai 2 porrastettua taustakerrosta ja pakan selausohjaimet.
 * - **4+ korttia:** Rajaa taustakerrokset kahteen layoutin säilyttämiseksi, mutta viestii
 *   pakan paksuudesta lisävarjostuksella ja selkeällä tilaindikaattorilla (esim. `1 / 5`).
 * - **Esteettömyys:** Tukee nuolinäppäimiä (Vasen/Oikea) ja kunnioittaa `prefers-reduced-motion` -asetusta.
 */
const meta = {
  title: "Suunnittelujarjestelma/Organismit/CardStack",
  component: CardStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    maxPeekLayers: 2,
    showControls: true,
  },
  argTypes: {
    theme: {
      control: "select",
      options: [
        undefined,
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
      description: "Teemakonteksti, joka ohjaa pakan ja sen elementtien värejä.",
    },
    label: {
      control: "text",
      description: "Pakan yläpuolella näkyvä ryhmäotsikko tai pelaajan nimi.",
    },
    maxPeekLayers: {
      control: "number",
      description: "Maksimimäärä näkyviä taustakerroksia pakan takana.",
    },
    showControls: {
      control: "boolean",
      description: "Näytetäänkö pakan selausohjaimet.",
    },
  },
} satisfies Meta<typeof CardStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Esimerkkikortti hahmolle
function SampleCharacterCard({
  name,
  archetype,
  anchor,
  harmit,
  sisuCounts,
  owner,
}: {
  name: string;
  archetype: string;
  anchor?: string;
  harmit: number;
  sisuCounts: Array<{ faces: 4 | 6 | 8 | 10 | 12 | 20; count: number }>;
  owner?: string;
}) {
  return (
    <Card variant="interactive" className="w-[320px] tablet:w-[360px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-secondary)]">
            {archetype}
          </p>
          {anchor && <AspectTag variant="anchor" text={anchor} readOnly />}
        </div>
      </CardHeader>
      <CardContent variant="dense">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center w-full text-sm">
            <span className="text-text-muted">
              Harmit:{" "}
              <span
                className={
                  harmit >= 5
                    ? "font-bold text-[var(--theme-accent)]"
                    : harmit > 0
                      ? "font-bold text-[var(--theme-primary)]"
                      : "font-medium text-[var(--theme-text)]"
                }
              >
                {harmit} / 5
              </span>
            </span>
            <span className="text-text-muted inline-flex items-center gap-1.5">
              Sisu:
              {sisuCounts.map(({ faces, count }) => (
                <span key={faces} className="inline-flex items-center gap-0.5">
                  <span className="font-medium text-[var(--theme-text)]">{count}×</span>
                  <DiceIcon faces={faces} size="sm" />
                </span>
              ))}
            </span>
          </div>

          {owner && (
            <p className="text-xs text-text-subtle border-t border-[var(--theme-border-soft)] pt-2 mt-1">
              Pelaaja: {owner}
              <span className="ml-2 text-[length:var(--font-size-2xs)] font-black tracking-widest text-[var(--theme-secondary)] uppercase">
                sinun
              </span>
            </p>
          )}

          <div className="border-t border-[var(--theme-border-soft)] pt-2 mt-1 flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              Valmistaudu
            </Button>
            <Button variant="solid" size="sm" onClick={(e) => e.stopPropagation()}>
              Hahmosivu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tyypillinen 3 kortin pakka pelaajan hahmoista.
 */
export const Default: Story = {
  args: {
    label: "Pelaaja: Petri (3 hahmoa)",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <CardStack {...args}>
        <SampleCharacterCard
          name="Kaarlo Rautio"
          archetype="Sotilas"
          anchor="Torni"
          harmit={1}
          sisuCounts={[{ faces: 6, count: 2 }]}
          owner="Petri"
        />
        <SampleCharacterCard
          name="Veera Lind"
          archetype="Ekspertti"
          anchor="Tähti"
          harmit={0}
          sisuCounts={[
            { faces: 6, count: 1 },
            { faces: 8, count: 1 },
          ]}
          owner="Petri"
        />
        <SampleCharacterCard
          name="Mikael Vesi"
          archetype="Sotilas"
          harmit={3}
          sisuCounts={[{ faces: 10, count: 1 }]}
          owner="Petri"
        />
      </CardStack>
    </div>
  ),
};

/**
 * Kahden kortin pakka. Taustalla näkyy yksi peilaava korttikerros.
 */
export const KaksiKorttia: Story = {
  args: {
    label: "Pelaaja: Anna (2 hahmoa)",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <CardStack {...args}>
        <SampleCharacterCard
          name="Aura Korhonen"
          archetype="Ekspertti"
          anchor="Kuningatar"
          harmit={0}
          sisuCounts={[{ faces: 8, count: 2 }]}
          owner="Anna"
        />
        <SampleCharacterCard
          name="Samu Lehto"
          archetype="Sotilas"
          harmit={2}
          sisuCounts={[{ faces: 6, count: 1 }]}
          owner="Anna"
        />
      </CardStack>
    </div>
  ),
};

/**
 * Yksittäisen kortin reunatapaus. Renderöityy suoraan tavanomaisena korttina ilman ohjaimia tai pinoefektiä.
 */
export const YksiKortti: Story = {
  args: {
    label: "Pelaaja: Matti (1 hahmo)",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <CardStack {...args}>
        <SampleCharacterCard
          name="Eeva Mäki"
          archetype="Ekspertti"
          anchor="Aurinko"
          harmit={0}
          sisuCounts={[{ faces: 6, count: 3 }]}
          owner="Matti"
        />
      </CardStack>
    </div>
  ),
};

/**
 * Suuri pakka (5 korttia). Taustakerrokset on rajattu kahteen, jotta asettelu ei veny,
 * mutta paksuudesta viestitään lisävarjostuksella ja `1 / 5` -laskurilla.
 */
export const NeljaTaiEnemman: Story = {
  args: {
    label: "Arkisto (5 hahmoa)",
  },
  render: (args) => (
    <div className="p-8 max-w-sm">
      <CardStack {...args}>
        <SampleCharacterCard
          name="Kaarlo Rautio"
          archetype="Sotilas"
          anchor="Torni"
          harmit={1}
          sisuCounts={[{ faces: 6, count: 2 }]}
          owner="Arkisto"
        />
        <SampleCharacterCard
          name="Veera Lind"
          archetype="Ekspertti"
          anchor="Tähti"
          harmit={0}
          sisuCounts={[{ faces: 8, count: 1 }]}
          owner="Arkisto"
        />
        <SampleCharacterCard
          name="Mikael Vesi"
          archetype="Sotilas"
          harmit={4}
          sisuCounts={[{ faces: 6, count: 1 }]}
          owner="Arkisto"
        />
        <SampleCharacterCard
          name="Tuomo Kivi"
          archetype="Ekspertti"
          harmit={0}
          sisuCounts={[{ faces: 12, count: 1 }]}
          owner="Arkisto"
        />
        <SampleCharacterCard
          name="Helmi Jalo"
          archetype="Sotilas"
          harmit={5}
          sisuCounts={[]}
          owner="Arkisto"
        />
      </CardStack>
    </div>
  ),
};

/**
 * Vaalea inverted-teema.
 */
export const InvertedTheme: Story = {
  args: {
    theme: "inverted",
    label: "Pelaaja: Laura",
  },
  render: (args) => (
    <div className="p-8 max-w-sm" data-theme="inverted">
      <CardStack {...args}>
        <SampleCharacterCard
          name="Laura Salo"
          archetype="Ekspertti"
          anchor="Maailma"
          harmit={0}
          sisuCounts={[{ faces: 8, count: 2 }]}
          owner="Laura"
        />
        <SampleCharacterCard
          name="Kasperi Ilma"
          archetype="Sotilas"
          harmit={1}
          sisuCounts={[{ faces: 6, count: 2 }]}
          owner="Laura"
        />
      </CardStack>
    </div>
  ),
};
