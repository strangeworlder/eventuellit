import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page, PageBody } from "@repo/ui/components/Page";
import { requestMagicLink } from "@repo/auth/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await requestMagicLink(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tuntematon virhe");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Page>
        <Hero title="Kirjautumislinkki lähetetty" />
        <PageBody>
          <NoticePanel variant="success" title="Linkki lähetetty">
            <p className="text-lg">
              Jos sähköpostiosoite on järjestelmässä, olet saanut kirjautumislinkin sähköpostiisi.
              Klikkaa linkkiä kirjautuaksesi sisään.
            </p>
            <p className="text-sm text-secondary mt-4">
              Huom: Kehitysympäristössä linkki tulostetaan myös palvelimen konsoliin.
            </p>
          </NoticePanel>
          <Button onClick={() => navigate("/")}>Palaa etusivulle</Button>
        </PageBody>
      </Page>
    );
  }

  return (
    <Page>
      <Hero title="Kirjaudu sisään" />
      <PageBody>
        <Card>
          <CardHeader>
            <CardTitle>Pyydä kirjautumislinkki</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Sähköpostiosoite"
                type="email"
                placeholder="sähköposti@esimerkki.fi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              {error && (
                <NoticePanel variant="error" title="Virhe">
                  {error}
                </NoticePanel>
              )}
              <div className="flex gap-4">
                <Button type="submit" loading={isLoading} disabled={!email}>
                  {isLoading ? "Lähetetään..." : "Lähetä linkki"}
                </Button>
                <Button variant="outline" type="button" onClick={() => navigate("/")}>
                  Peruuta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-[var(--theme-text)]/50 leading-relaxed max-w-md">
          Kirjautuminen käyttää välttämätöntä evästettä istunnon ylläpitämiseksi.{" "}
          <button
            type="button"
            onClick={() => navigate("/tietosuoja")}
            className="underline hover:text-[var(--theme-primary)] transition-colors"
          >
            Lue tietosuojaselosteemme
          </button>.
        </p>
      </PageBody>
    </Page>
  );
}
