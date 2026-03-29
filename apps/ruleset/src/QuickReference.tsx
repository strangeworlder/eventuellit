import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { QuickViewPanel } from "@repo/ui/components/QuickViewPanel";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { GameTerm } from "@repo/ui/components/GameTerm";

interface QuickReferenceProps {
  open: boolean;
  onClose: () => void;
}

function RefSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <HeadingLevelProvider>
      <section className="space-y-3">
        <Heading variant="h4">{title}</Heading>
        {children}
      </section>
    </HeadingLevelProvider>
  );
}

function RefTable({ rows }: { rows: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <div className="rounded-md overflow-hidden border border-[var(--theme-border-soft)]">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-baseline gap-3 px-3 py-2 text-sm ${
            i % 2 === 0 ? "bg-[var(--theme-bg)]" : "bg-[var(--theme-surface-tint)]"
          }`}
        >
          <span className="w-28 shrink-0 text-text-muted font-medium">{row.label}</span>
          <GameTerm variant="emphasis" className="tabular-nums">
            {row.value}
          </GameTerm>
          {row.note && (
            <Text variant="muted" className="text-xs">
              {row.note}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
}

function RefSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-1.5">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] text-xs font-black flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <Text className="leading-snug text-sm">{step}</Text>
        </li>
      ))}
    </ol>
  );
}

function RefList({ items }: { items: Array<{ term: string; desc: string }> }) {
  return (
    <ul className="space-y-1.5">
      {items.map(({ term, desc }) => (
        <li key={term} className="text-sm flex items-start gap-2">
          <GameTerm variant="label" className="shrink-0 mt-0.5 text-xs">
            {term}
          </GameTerm>
          <Text className="leading-snug text-sm">{desc}</Text>
        </li>
      ))}
    </ul>
  );
}

export function QuickReference({ open, onClose }: QuickReferenceProps) {
  return (
    <QuickViewPanel
      open={open}
      onClose={onClose}
      title="Pikaohjeet"
      subtitle="Tärkeimmät mekaniikat nopeaan tarkistukseen"
      size="md"
    >
      <div className="space-y-6">
        {/* Vaikeusasteet */}
        <RefSection title="Vaikeusasteet">
          <RefTable
            rows={[
              { label: "Helppo", value: "OK 9", note: "Poikkeuksellisen suotuisat olosuhteet" },
              { label: "Normaali", value: "OK 13", note: "Oletusarvo" },
              { label: "Vaikea", value: "OK 17", note: "Ääriolosuhteet" },
            ]}
          />
        </RefSection>

        <Separator variant="soft" />

        {/* Vaurion käsittely */}
        <RefSection title="Vaurion käsittely">
          <RefSteps
            steps={[
              "Muodosta vaurionopat: hyökkääjän vahinkonopat + kohteen uhkanoppapino.",
              "Puolustaja heittää sisunopat. Jokainen vaurionoppa joka on suurempi kuin sisunoppa poistaa sen (1:1).",
              "Jos sisu ei menetä noppia → lisää vahinkonoppa uhkanoppapinoon.",
              "Kun sisu on loppunut: menetä kestoa suurimman jäljellä olevan vaurionopan verran, tai ota Harmi.",
            ]}
          />
        </RefSection>

        <Separator variant="soft" />

        {/* Taistelukierros */}
        <RefSection title="Taistelukierros">
          <RefList
            items={[
              {
                term: "Julistus",
                desc: "PJ kertoo tavallisten vastustajien aikeet → pelaajat jakavat nopat → PJ kertoo erikoisvastustajat.",
              },
              {
                term: "Aloite",
                desc: "5 × noppien määrä tai korkein silmäluku — valitaan suurempi.",
              },
              {
                term: "Ratkaisu",
                desc: "Toiminnot toteutuvat ajastimen järjestyksessä, alkaen korkeimmasta.",
              },
              {
                term: "Tuplat",
                desc: "Onnistuminen + kaksi samaa silmälukua = kriittinen onnistuminen.",
              },
            ]}
          />
        </RefSection>

        <Separator variant="soft" />

        {/* Hahmon kehitys */}
        <RefSection title="Kehitys (jakson alussa)">
          <RefList
            items={[
              {
                term: "Ominaisuus",
                desc: "Lisää +n4 valitsemaasi ominaisuuteen. Kolme n4 → yksi n6 (jne.).",
              },
              {
                term: "Taidot",
                desc: "Valitse: 2 taitoa + 1n6 sisu, TAI 1 taito + 1n8 sisu.",
              },
              {
                term: "Kesto",
                desc: "Laske uudelleen: 8 + ominaisuusnoppien maksimiarvot / 2 per kategoria.",
              },
            ]}
          />
        </RefSection>

        <Separator variant="soft" />

        {/* Noppakoura muistutus */}
        <RefSection title="Noppakoura">
          <div className="rounded-md bg-[var(--theme-surface-tint)] px-4 py-3 text-sm space-y-1">
            <Text className="text-sm">
              Oletusarvo: <GameTerm variant="emphasis">5n20</GameTerm> per tilanne tai kierros.
            </Text>
            <Text className="text-sm">Akselin tulos = korkein noppa kyseisellä akselilla.</Text>
            <Text className="text-sm">Tyhjä akseli = automaattinen epäonnistuminen.</Text>
            <Text className="text-sm">
              Harmi poistaa <GameTerm variant="emphasis">−1n20</GameTerm> pysyvästi. Viides Harmi →
              hahmo poistuu.
            </Text>
          </div>
        </RefSection>
      </div>
    </QuickViewPanel>
  );
}
