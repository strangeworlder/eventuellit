import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ANCHOR_CARDS, getAnchorById } from "../data/anchors";
import { AnchorSelector } from "./AnchorSelector";
import { Badge } from "./Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

/**
 * `AnchorSelector` on interaktiivinen pelimekaniikkaorganismi pelaajakohtaisen
 * Tarot-ankkurin arpomiseen, tarkasteluun ja valintaan.
 *
 * Ominaisuudet:
 * - 5 satunnaista vapaana olevaa vaihtoehtoa 78 kortin Thoth Tarot -pakasta.
 * - "Arvo uudet 5" -painike uusien korttien arpomiseen vapaasta pakasta.
 * - Muiden pelaajien varaamien korttien ehdoton poissulku.
 * - Rinnakkaiset polariteetit (Koan ja Anti-koan) aukeavat heti kortin valinnan yhteydessä.
 * - Pysyvä lukittu tila palaaville pelaajille, joiden tilille ankkuri on jo sidottu.
 * - Oletuksena `inverted`-teema hauntologisen taustan merkiksi.
 */
const meta = {
  title: "Suunnittelujarjestelma/Pelimekaniikka/AnchorSelector",
  component: AnchorSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AnchorSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Oletusvalitsin:
 * Arpoo 5 vapaata korttia 78 kortin pakasta. Korttia klikkaamalla sen kuvaus ja
 * rinnakkaiset polariteetit (Koan ja Anti-koan) avautuvat heti näkyviin.
 */
export const Oletus: Story = {
  name: "Oletusvalitsin (5 vapaata)",
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <AnchorSelector selectedAnchorId={selectedId} onSelectAnchor={setSelectedId} />
        {selectedId && (
          <div className="p-3 border border-[var(--theme-border-medium)] rounded bg-[var(--theme-surface-tint)] text-xs font-mono text-text-muted">
            Valittu ankkuri-tunnus:{" "}
            <span className="text-[var(--theme-primary)] font-bold">{selectedId}</span>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Todellinen hahmogeneraattorin konteksti:
 * Renderöityy `<Card variant="outline" theme="inverted">` -kortin sisällä vaiheessa 6 (Taidot),
 * täsmälleen kuten oikeassa hahmonluontisovelluksessa.
 */
export const GeneraattorinKonteksti: Story = {
  name: "Hahmogeneraattorin sisällä (Inverted Card)",
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>("atu-0");

    return (
      <div className="max-w-3xl mx-auto p-4 bg-[var(--theme-bg)]">
        <Card variant="outline" theme="inverted">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pelaajan Ankkuri</CardTitle>
                <p className="text-xs text-text-muted mt-0.5">
                  Pysyvä pelaajakohtainen valinta – sitoutuu tiliisi ja vaikuttaa kaikkiin
                  hahmoihisi
                </p>
              </div>
              {selectedId ? (
                <Badge variant="solid" className="text-2xs py-0 px-2">
                  Valittu
                </Badge>
              ) : (
                <Badge variant="outline" className="text-2xs py-0 px-2">
                  Valitse 1
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <AnchorSelector
              theme="inverted"
              selectedAnchorId={selectedId}
              onSelectAnchor={setSelectedId}
            />
          </CardContent>
        </Card>
      </div>
    );
  },
};

/**
 * Esivalittu ankkuri:
 * Valitsin aukeaa tilassa, jossa ankkuri on jo valittu (esim. Atu 0: Kuilu).
 */
export const EsivalittuKuilu: Story = {
  name: "Esivalittu: Kuilu (Atu 0)",
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>("atu-0");

    return (
      <div className="max-w-3xl mx-auto">
        <AnchorSelector selectedAnchorId={selectedId} onSelectAnchor={setSelectedId} />
      </div>
    );
  },
};

/**
 * Palaavalle pelaajalle lukittu ankkuri:
 * Kun pelaajalla on jo pelattuja pelejä ja vakiintunut ankkuri (esim. Miekat 3: Kipu),
 * valitsin esittää suoraan pysyvän ankkurin ja sen polariteetit lukittuna.
 */
export const PelaajalleLukittu: Story = {
  name: "Pelaajalle lukittu: Kipu (Miekat 3)",
  args: {
    lockedAnchorId: "swords-3",
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto">
      <AnchorSelector {...args} />
    </div>
  ),
};

/**
 * Pöydässä varatut ankkurit suodatettu:
 * Simuloi tilannetta, jossa 15 ankkuria on jo varattu muille pelaajille.
 * Nämä 15 ankkuria eivät voi koskaan tulla valikoimaan.
 */
export const VaratutAnkkuritSuodatettu: Story = {
  name: "Varatut ankkurit suodatettu (15 kpl)",
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const claimedIds = ANCHOR_CARDS.slice(0, 15).map((c) => c.id);

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-xs text-text-muted font-mono bg-[var(--theme-surface-tint)] p-2 rounded border border-[var(--theme-border-soft)]">
          Pöydässä varatut ankkurit (eivät voi tulla arvontaan): {claimedIds.join(", ")}
        </div>
        <AnchorSelector
          selectedAnchorId={selectedId}
          onSelectAnchor={setSelectedId}
          claimedAnchorIds={claimedIds}
        />
      </div>
    );
  },
};

/**
 * Kaikki maat edustettuina (kiinteä erä):
 * Esimerkki, jossa valikoimassa on yksi kortti jokaisesta arkanasta ja maasta:
 * Iso Arkana (Kuilu), Sauvat (Kipinä), Maljat (Sopu), Miekat (Kipu) ja Kiekot (Malmi).
 */
export const KaikkiMaatEdustettuina: Story = {
  name: "Kaikki maat (Kuilu, Kipinä, Sopu, Kipu, Malmi)",
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>("swords-3");
    const sampleBatch = [
      getAnchorById("atu-0"),
      getAnchorById("wands-ace"),
      getAnchorById("cups-2"),
      getAnchorById("swords-3"),
      getAnchorById("disks-ace"),
    ].filter((c): c is (typeof ANCHOR_CARDS)[number] => Boolean(c));

    return (
      <div className="max-w-3xl mx-auto">
        <AnchorSelector
          options={sampleBatch}
          selectedAnchorId={selectedId}
          onSelectAnchor={setSelectedId}
          allowReroll={false}
          description="Esimerkki kiinteästä valikoimasta, jossa jokainen maa on edustettuna."
        />
      </div>
    );
  },
};

/**
 * Obscured-tila:
 * Valitsin sumennettuna ja poiskytkettynä ennen kuin edeltävä luontivaihe on suoritettu.
 */
export const Obscured: Story = {
  name: "Obscured (sumennettu)",
  args: {
    obscured: true,
  },
  render: (args) => (
    <div className="max-w-3xl mx-auto">
      <AnchorSelector {...args} />
    </div>
  ),
};
