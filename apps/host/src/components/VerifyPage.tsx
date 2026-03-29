import { Button } from "@repo/ui/components/Button";
import { Hero } from "@repo/ui/components/Hero";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page, PageBody } from "@repo/ui/components/Page";
import { verifyToken } from "@repo/auth/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Kirjautumislinkki puuttuu");
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const user = await verifyToken(token);
        // Invalidate auth query to refresh user state
        queryClient.setQueryData(["auth", "me"], user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        // Redirect to generator after successful login
        navigate("/generator");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kirjautuminen epäonnistui");
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, navigate, queryClient]);

  if (isVerifying) {
    return (
      <Page>
        <Hero title="Vahvistetaan kirjautumista..." />
        <PageBody>
          <LoadingState message="Vahvistetaan kirjautumislinkkiä..." />
        </PageBody>
      </Page>
    );
  }

  return (
    <Page>
      <Hero title="Kirjautuminen epäonnistui" />
      <PageBody>
        <NoticePanel variant="error" title="Virhe">
          <p className="text-lg">{error || "Kirjautumislinkki on virheellinen tai vanhentunut."}</p>
          <p className="text-sm text-text-muted mt-4">
            Pyydä uusi kirjautumislinkki, jos ongelma jatkuu.
          </p>
        </NoticePanel>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/kirjaudu")}>Yritä uudelleen</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Palaa etusivulle
          </Button>
        </div>
      </PageBody>
    </Page>
  );
}
