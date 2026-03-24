import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page } from "@repo/ui/components/Page";
import { useAuth } from "@repo/auth/use-auth";
import { exportMyData, deleteMyAccount } from "@repo/auth/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PrivacyPolicyPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eventuellit-tietoni-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess("Tietosi on ladattu.");
    } catch {
      setError("Tietojen lataus epäonnistui.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMyAccount();
      logout();
      navigate("/");
    } catch {
      setError("Tilin poisto epäonnistui.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page>
      <HeadingLevelProvider>
        <Hero title="Tietosuojaseloste" />
        <div className="px-4 space-y-8 animate-in fade-in duration-500 max-w-3xl pb-16">

          <section className="space-y-4">
            <Heading>Rekisterinpitäjä</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Eventuellit-roolipelisovelluksen ylläpitäjä. Yhteystiedot: <em>alvancow+eventuellit@gmail.com</em>.
            </p>
          </section>

          <section className="space-y-4">
            <Heading>Kerättävät tiedot</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Keräämme seuraavia henkilötietoja palvelun toiminnan mahdollistamiseksi:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--theme-text)]/80">
              <li><strong>Sähköpostiosoite</strong> — käytetään kirjautumiseen magic link -menetelmällä</li>
              <li><strong>Käyttäjänimi</strong> — näytetään sovelluksessa muille pelaajille</li>
              <li><strong>Hahmotiedot</strong> — pelin hahmosi ja niihin liittyvät tiedot (ominaisuudet, taidot, varusteet)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <Heading>Tietojen käyttötarkoitus</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Henkilötietoja käytetään ainoastaan palvelun toiminnan mahdollistamiseen:
              kirjautumiseen, hahmojen luontiin ja pelitilanteen ylläpitoon.
              Emme käytä tietojasi markkinointiin, profilointiin tai muuhun tarkoitukseen.
            </p>
          </section>

          <section className="space-y-4">
            <Heading>Evästeet ja paikallinen tallennus</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Sivusto käyttää ainoastaan <strong>välttämättömiä evästeitä</strong> kirjautumisen ylläpitoon:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--theme-text)]/80">
              <li>
                <strong>auth_token</strong> (eväste) — httpOnly-eväste, joka sisältää
                kirjautumistunnisteen. Voimassa 7 päivää. Ei sisällä henkilötietoja.
              </li>
              <li>
                <strong>auth_token</strong> (localStorage) — kirjautumistunniste selaimen
                paikallisessa tallennustilassa.
              </li>
            </ul>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Emme käytä analytiikka-, mainonta- tai seurantaevästeitä.
              Sivusto ei lataa kolmannen osapuolen seurantapalveluita.
            </p>
          </section>

          <section className="space-y-4">
            <Heading>Oikeutesi</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              EU:n yleisen tietosuoja-asetuksen (GDPR) nojalla sinulla on seuraavat oikeudet:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--theme-text)]/80">
              <li><strong>Oikeus saada pääsy tietoihisi</strong> — voit ladata kaikki sinusta tallennetut tiedot</li>
              <li><strong>Oikeus tietojen poistamiseen</strong> — voit pyytää tilisi ja tietojesi poistamista</li>
              <li><strong>Oikeus tehdä valitus</strong> — voit tehdä valituksen tietosuojavaltuutetun toimistoon (tietosuoja.fi)</li>
            </ul>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Tilin poiston yhteydessä hahmosi siirtyvät pelinjohtajan hallintaan osana pelimaailmaa.
              Henkilötietosi (sähköposti, käyttäjänimi) poistetaan pysyvästi.
            </p>
          </section>

          <section className="space-y-4">
            <Heading>Tietojen säilytys</Heading>
            <p className="text-[var(--theme-text)]/80 leading-relaxed">
              Tietojasi säilytetään niin kauan kuin tilisi on aktiivinen.
              Voit poistaa tilisi ja siihen liittyvät henkilötiedot milloin tahansa.
              Kirjautumistunnisteet vanhenevat automaattisesti 7 päivän kuluttua.
            </p>
          </section>

          {isLoggedIn && (
            <section className="space-y-6 pt-4">
              <Heading>Omat tietosi</Heading>

              {error && (
                <NoticePanel variant="error" title="Virhe">
                  {error}
                </NoticePanel>
              )}

              {success && (
                <NoticePanel variant="success" title="Valmis">
                  {success}
                </NoticePanel>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Lataa tietosi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--theme-text)]/70 mb-4">
                    Lataa kaikki sinusta tallennetut tiedot JSON-tiedostona.
                    Tiedosto sisältää käyttäjätietosi ja hahmosi.
                  </p>
                  <Button
                    onClick={handleExportData}
                    loading={isExporting}
                    variant="secondary"
                  >
                    <Icon name="download" size={16} className="mr-2" />
                    Lataa tietosi
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Poista tilisi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--theme-text)]/70 mb-4">
                    Tilisi ja henkilötietosi poistetaan pysyvästi.
                    Hahmosi siirtyvät pelinjohtajan hallintaan.
                    Tätä toimintoa ei voi peruuttaa.
                  </p>
                  {!showDeleteConfirm ? (
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="danger"
                    >
                      <Icon name="trash-2" size={16} className="mr-2" />
                      Poista tilini
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <NoticePanel variant="error" title="Oletko varma?">
                        Tämä poistaa tilisi ja kaikki henkilötietosi pysyvästi.
                        Hahmosi säilyvät pelinjohtajan hallinnassa.
                      </NoticePanel>
                      <div className="flex gap-4">
                        <Button
                          onClick={handleDeleteAccount}
                          loading={isDeleting}
                          variant="danger"
                        >
                          Kyllä, poista tilini
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="secondary"
                        >
                          Peruuta
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </HeadingLevelProvider>
    </Page>
  );
}
