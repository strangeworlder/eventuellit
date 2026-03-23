import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page } from "@repo/ui/components/Page";
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
        <HeadingLevelProvider>
          <Hero title="Kirjautumislinkki lähetetty" />
          <div className="px-4 space-y-8 animate-in fade-in duration-500">
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
          </div>
        </HeadingLevelProvider>
      </Page>
    );
  }

  return (
    <Page>
      <HeadingLevelProvider>
        <Hero title="Kirjaudu sisään" />
        <div className="px-4 space-y-8 animate-in fade-in duration-500">
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
                  <Button variant="secondary" type="button" onClick={() => navigate("/")}>
                    Peruuta
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </HeadingLevelProvider>
    </Page>
  );
}
